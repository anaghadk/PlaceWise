import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Send, RotateCcw, CheckCircle2, XCircle, ExternalLink, Trophy, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCoreCSQuestions, extractLeetCodeStats, sendGenieMessage } from '../../data/api';
import './GenieChat.css';

let uid = 0;
const nextId = () => `m${Date.now()}-${uid++}`;

function initialGreetings() {
  return [
    {
      id: nextId(),
      role: 'bot',
      kind: 'text',
      text: "Hey — I'm Genie, your placement-prep copilot. 👋",
    },
    {
      id: nextId(),
      role: 'bot',
      kind: 'text',
      text: "Before we dive in, let's do a 6-question warm-up across DSA, OS, OOP and CN — a quick mix of easy, medium and hard. It only takes a minute and helps me calibrate your baseline.",
    },
  ];
}

function storageKey(studentId) {
  return `campusiq-genie-${studentId || 'guest'}`;
}

export default function GenieChat() {
  const { studentUser } = useAuth();
  const key = storageKey(studentUser?.id);

  const [questions, setQuestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stage, setStage] = useState('loading'); // loading | quiz | leetcode | chat
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  // ---- boot: restore saved session or start fresh -------------------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const qs = await getCoreCSQuestions();
      if (cancelled) return;
      setQuestions(qs);

      try {
        const saved = JSON.parse(localStorage.getItem(key) || 'null');
        if (saved && Array.isArray(saved.messages) && saved.messages.length) {
          setMessages(saved.messages);
          setStage(saved.stage ?? 'chat');
          setQIndex(saved.qIndex ?? 0);
          setScore(saved.score ?? 0);
          setLeetcodeStats(saved.leetcodeStats ?? null);
          return;
        }
      } catch {
        /* corrupt/missing save — fall through to fresh start */
      }

      const greetings = initialGreetings();
      const firstQ = { id: nextId(), role: 'bot', kind: 'quiz', question: qs[0], pending: true };
      setMessages([...greetings, firstQ]);
      setStage('quiz');
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // ---- persist ----
  useEffect(() => {
    if (stage === 'loading' || !messages.length) return;
    try {
      localStorage.setItem(key, JSON.stringify({ messages, stage, qIndex, score, leetcodeStats }));
    } catch {
      /* best effort */
    }
  }, [messages, stage, qIndex, score, leetcodeStats, key]);

  // ---- autoscroll ----
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const appendMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: nextId(), ...msg }]);
  }, []);

  const withTyping = useCallback(async (ms, fn) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, ms));
    setIsTyping(false);
    fn();
  }, []);

  // ---- quiz answer handling ----
  function answerQuestion(optionIndex) {
    const q = questions[qIndex];
    if (!q) return;
    setMessages((prev) => prev.map((m) => (m.kind === 'quiz' && m.pending ? { ...m, pending: false, chosenIndex: optionIndex } : m)));
    appendMessage({ role: 'user', kind: 'text', text: q.options[optionIndex] });

    const correct = optionIndex === q.correctIndex;
    if (correct) setScore((s) => s + 1);

    withTyping(650, () => {
      appendMessage({
        role: 'bot',
        kind: 'feedback',
        correct,
        text: correct ? 'Correct!' : `Not quite — it's "${q.options[q.correctIndex]}".`,
        explain: q.explain,
      });

      const nextIndex = qIndex + 1;
      if (nextIndex < questions.length) {
        withTyping(500, () => {
          setQIndex(nextIndex);
          appendMessage({ role: 'bot', kind: 'quiz', question: questions[nextIndex], pending: true });
        });
      } else {
        withTyping(600, () => {
          appendMessage({
            role: 'bot',
            kind: 'quiz-summary',
            score: score + (correct ? 1 : 0),
            total: questions.length,
          });
          withTyping(500, () => {
            appendMessage({
              role: 'bot',
              kind: 'text',
              text: "Now paste your LeetCode profile link (e.g. https://leetcode.com/yourusername) and I'll pull in your solved-problem stats.",
            });
            setStage('leetcode');
          });
        });
      }
    });
  }

  // ---- leetcode extraction ----
  async function handleLeetCodeSubmit(url) {
    appendMessage({ role: 'user', kind: 'text', text: url });
    setIsTyping(true);
    try {
      const stats = await extractLeetCodeStats(url);
      setIsTyping(false);
      setLeetcodeStats(stats);
      appendMessage({ role: 'bot', kind: 'leetcode-stats', stats });
      await withTyping(500, () => {
        appendMessage({
          role: 'bot',
          kind: 'text',
          text: "Nice base to work with! Once I'm fully connected to Genie, I'll combine this with your resume and readiness data for tailored prep. For now — ask me anything about DSA, OS/CN fundamentals, resumes or interview strategy.",
        });
        setStage('chat');
      });
    } catch (e) {
      setIsTyping(false);
      appendMessage({ role: 'bot', kind: 'text', text: e.message || "Couldn't read that link — mind pasting your LeetCode profile URL again?" });
    }
  }

  // ---- freeform chat ----
  async function handleChatSubmit(text) {
    appendMessage({ role: 'user', kind: 'text', text });
    setIsTyping(true);
    try {
      const reply = await sendGenieMessage(text, { leetcode: leetcodeStats });
      setIsTyping(false);
      appendMessage({ role: 'bot', kind: 'text', text: reply });
    } catch {
      setIsTyping(false);
      appendMessage({ role: 'bot', kind: 'text', text: "Hmm, I couldn't process that — try again?" });
    }
  }

  function handleComposerSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || stage === 'quiz' || stage === 'loading') return;
    setInput('');
    if (stage === 'leetcode') handleLeetCodeSubmit(text);
    else handleChatSubmit(text);
  }

  function handleReset() {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setScore(0);
    setQIndex(0);
    setLeetcodeStats(null);
    const greetings = initialGreetings();
    const firstQ = { id: nextId(), role: 'bot', kind: 'quiz', question: questions[0], pending: true };
    setMessages([...greetings, firstQ]);
    setStage('quiz');
  }

  const composerDisabled = stage === 'quiz' || stage === 'loading' || isTyping;
  const composerPlaceholder =
    stage === 'quiz'
      ? 'Pick an option above ↑'
      : stage === 'leetcode'
        ? 'Paste your LeetCode profile link…'
        : 'Ask Genie anything about your placement prep…';

  return (
    <div className="genie-page">
      <div className="genie-head">
        <div className="genie-head-left">
          <span className="genie-avatar genie-avatar-lg">
            <Bot size={20} strokeWidth={1.8} />
          </span>
          <div>
            <p className="eyebrow">Ask Genie</p>
            <h1>Your placement-prep copilot</h1>
          </div>
        </div>
        <button className="btn btn-ghost genie-reset" onClick={handleReset} title="Restart conversation">
          <RotateCcw size={14} strokeWidth={1.8} />
          Restart
        </button>
      </div>

      <div className="card genie-panel">
        <div className="genie-messages" ref={listRef}>
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} onAnswer={answerQuestion} />
          ))}
          {isTyping && (
            <div className="genie-row bot">
              <span className="genie-avatar"><Bot size={15} strokeWidth={1.8} /></span>
              <div className="genie-bubble bot typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        <form className="genie-composer" onSubmit={handleComposerSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={composerPlaceholder}
            disabled={composerDisabled}
            aria-label="Message Genie"
          />
          <button type="submit" className="btn btn-primary genie-send" disabled={composerDisabled || !input.trim()}>
            <Send size={15} strokeWidth={1.9} />
          </button>
        </form>
      </div>

      <p className="genie-footnote eyebrow">
        Genie preview — quiz &amp; LeetCode extraction run locally for now. Full personalized answers connect in a later step.
      </p>
    </div>
  );
}

function MessageBubble({ message, onAnswer }) {
  const isBot = message.role === 'bot';

  if (message.kind === 'quiz') {
    const q = message.question;
    return (
      <div className="genie-row bot fade-up">
        <span className="genie-avatar"><Bot size={15} strokeWidth={1.8} /></span>
        <div className="genie-quiz-block">
          <div className="genie-bubble bot">
            <div className="quiz-meta">
              <span className="tag quiz-topic">{q.topic}</span>
              <span className={`tag quiz-diff diff-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
            </div>
            <p className="quiz-prompt">{q.prompt}</p>
          </div>
          {message.pending && (
            <div className="quiz-options">
              {q.options.map((opt, i) => (
                <button key={i} type="button" className="quiz-option" onClick={() => onAnswer(i)}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (message.kind === 'feedback') {
    return (
      <div className="genie-row bot fade-up">
        <span className="genie-avatar"><Bot size={15} strokeWidth={1.8} /></span>
        <div className={'genie-bubble bot feedback-bubble ' + (message.correct ? 'correct' : 'incorrect')}>
          <div className="feedback-verdict">
            {message.correct ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            {message.text}
          </div>
          <p className="feedback-explain">{message.explain}</p>
        </div>
      </div>
    );
  }

  if (message.kind === 'quiz-summary') {
    return (
      <div className="genie-row bot fade-up">
        <span className="genie-avatar"><Bot size={15} strokeWidth={1.8} /></span>
        <div className="genie-bubble bot summary-bubble">
          <Trophy size={18} className="summary-icon" />
          <div>
            <div className="summary-score">
              {message.score}/{message.total} <span>correct on the warm-up</span>
            </div>
            <p>That's a solid starting signal — we'll build from here.</p>
          </div>
        </div>
      </div>
    );
  }

  if (message.kind === 'leetcode-stats') {
    const s = message.stats;
    return (
      <div className="genie-row bot fade-up">
        <span className="genie-avatar"><Bot size={15} strokeWidth={1.8} /></span>
        <div className="genie-bubble bot leetcode-card">
          <div className="leetcode-card-head">
            <Flame size={16} />
            <span>u/{s.username}</span>
            <a href={s.profileUrl} target="_blank" rel="noreferrer" className="leetcode-link">
              View profile <ExternalLink size={12} />
            </a>
          </div>
          <div className="leetcode-total">
            {s.totalSolved} <span>problems solved</span>
          </div>
          <div className="leetcode-breakdown">
            <Bar label="Easy" value={s.easySolved} tone="sage" />
            <Bar label="Medium" value={s.mediumSolved} tone="gold" />
            <Bar label="Hard" value={s.hardSolved} tone="brick" />
          </div>
          <div className="leetcode-stats-row">
            <div><span className="stat-row-label">Ranking</span><span className="mono">#{s.ranking.toLocaleString()}</span></div>
            <div><span className="stat-row-label">Acceptance</span><span className="mono">{s.acceptanceRate}</span></div>
            <div><span className="stat-row-label">Contests</span><span className="mono">{s.contestsAttended}</span></div>
          </div>
          {s.badges.length > 0 && (
            <div className="leetcode-badges">
              {s.badges.map((b) => <span key={b} className="tag tag-insight">{b}</span>)}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={'genie-row ' + (isBot ? 'bot' : 'user') + ' fade-up'}>
      {isBot && <span className="genie-avatar"><Bot size={15} strokeWidth={1.8} /></span>}
      <div className={'genie-bubble ' + (isBot ? 'bot' : 'user')}>{message.text}</div>
    </div>
  );
}

function Bar({ label, value, tone }) {
  const max = 300;
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`leetcode-bar tone-${tone}`}>
      <div className="leetcode-bar-head">
        <span>{label}</span>
        <span className="mono">{value}</span>
      </div>
      <div className="leetcode-bar-track">
        <div className="leetcode-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
