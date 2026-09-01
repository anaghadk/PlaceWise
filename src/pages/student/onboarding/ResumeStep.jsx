import { useRef, useState } from 'react';
import { FileText, UploadCloud, X, Check } from 'lucide-react';
import { parseResume } from '../../../data/api';

export default function ResumeStep({ onContinue, onSkip }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | parsing | done
  const [parsed, setParsed] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  async function handleFile(f) {
    if (!f) return;
    setFile(f);
    setStatus('parsing');
    const result = await parseResume(f);
    setParsed(result);
    setStatus('done');
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  function reset() {
    setFile(null);
    setParsed(null);
    setStatus('idle');
  }

  return (
    <div className="ob-step">
      <p className="eyebrow">Step 1 of 3</p>
      <h1>Upload your resume</h1>
      <p className="ob-step-sub">
        We'll pull out your skills automatically so you don't have to type them in.
        PDF or DOCX, up to 5MB.
      </p>

      {status === 'idle' && (
        <div
          className={'ob-dropzone' + (dragging ? ' dragging' : '')}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <UploadCloud size={30} strokeWidth={1.5} />
          <p><strong>Drop your resume here</strong> or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {status === 'parsing' && (
        <div className="ob-parsing card">
          <FileText size={22} strokeWidth={1.6} />
          <div className="ob-parsing-info">
            <div className="ob-parsing-name">{file?.name}</div>
            <div className="ob-parsing-status">
              <span className="ob-spinner" /> Reading your resume…
            </div>
          </div>
        </div>
      )}

      {status === 'done' && parsed && (
        <div className="ob-parsed card">
          <div className="ob-parsed-head">
            <FileText size={22} strokeWidth={1.6} />
            <div className="ob-parsing-info">
              <div className="ob-parsing-name">{file?.name}</div>
              <div className="ob-parsed-check"><Check size={14} /> Parsed successfully</div>
            </div>
            <button className="ob-remove" onClick={reset} aria-label="Remove resume">
              <X size={16} />
            </button>
          </div>
          <div className="ob-parsed-body">
            <span className="ob-parsed-label">Skills we found</span>
            <div className="ob-parsed-chips">
              {parsed.extractedSkills.map((s) => <span className="tag tag-eligible" key={s}>{s}</span>)}
            </div>
          </div>
        </div>
      )}

      <div className="ob-actions">
        <button className="btn btn-primary" disabled={status !== 'done'} onClick={() => onContinue({ file, parsed })}>
          Continue
        </button>
        <button className="btn-text" onClick={onSkip}>Skip for now</button>
      </div>
    </div>
  );
}
