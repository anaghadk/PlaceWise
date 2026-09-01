import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  TrendingUp,
  GraduationCap,
  Rocket,
  Search,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Building2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Globe
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  PLACEMENT_STUDENTS,
  BATCH_YEARS,
  getSummaryMetrics,
  getYearOverYearTrends,
  getTopRecruiters,
  getOutcomeData,
  getMultiOfferData,
  getGlobalAdmits,
  getStartupVentures,
  getAlumniByCompany
} from '../../data/placementData';
import './Home.css';

export default function Home() {
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompanyModal, setSelectedCompanyModal] = useState(null);

  const PAGE_SIZE = 12;

  // Aggregate Metrics based on selected batch
  const summary = useMemo(() => getSummaryMetrics(selectedBatch), [selectedBatch]);
  const yoyTrends = useMemo(() => getYearOverYearTrends(), []);
  const topRecruiters = useMemo(() => getTopRecruiters(selectedBatch, 10), [selectedBatch]);
  const outcomeData = useMemo(() => getOutcomeData(selectedBatch), [selectedBatch]);
  const multiOfferData = useMemo(() => getMultiOfferData(selectedBatch), [selectedBatch]);
  const globalAdmits = useMemo(() => getGlobalAdmits(), []);
  const startups = useMemo(() => getStartupVentures(), []);

  // Filtered students for Directory table
  const filteredStudents = useMemo(() => {
    return PLACEMENT_STUDENTS.filter((student) => {
      // Batch filter
      if (selectedBatch !== 'ALL' && student.batchYear !== Number(selectedBatch)) {
        return false;
      }
      // Status filter
      if (statusFilter === 'ON_CAMPUS' && student.status !== 'On-Campus') return false;
      if (statusFilter === 'HIGHER_STUDIES' && !student.category.includes('Off-Campus') && !student.category.includes('Higher Studies')) return false;
      if (statusFilter === 'NOT_PLACED' && student.status !== 'Not Placed') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesUsn = student.usn.toLowerCase().includes(q);
        const matchesDetails = student.details.toLowerCase().includes(q);
        const matchesCompany = student.normalizedCompanies.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesUsn && !matchesDetails && !matchesCompany) return false;
      }
      return true;
    });
  }, [selectedBatch, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, currentPage]);

  const handleBatchChange = (batch) => {
    setSelectedBatch(batch);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const openCompanyAlumni = (companyName) => {
    const alumni = getAlumniByCompany(companyName);
    setSelectedCompanyModal({
      company: companyName,
      alumni
    });
  };

  return (
<<<<<<< Updated upstream
    <>
      <section className="hero-band">
      <div className="hero container">
        <div className="hero-copy">
          <span className="pill"><span className="pill-dot" /> Live · Fall 2026 placement cycle</span>
          <h1>Your placement prep,<br />scattered no more.</h1>
          <p className="hero-sub">
            PlaceWise pulls eligibility criteria, skill benchmarks and senior interview
            experiences into one place, then lines them up against your own profile —
            so you always know what to work on next.
=======
    <div className="home-visualizer-page">
      {/* 1. HERO BANNER */}
      <header className="vis-hero container">
        <div className="vis-hero-header">
          <div className="vis-hero-badge">
            <Sparkles size={14} className="icon-sparkle" />
            <span>Placement Intelligence & Analytics · 2018–2022 Verified Dataset</span>
          </div>
          <h1>Placement Performance & Career Outcomes</h1>
          <p className="vis-hero-sub">
            Interactive visualization and comprehensive records of <strong>756 computer science graduates</strong>.
            Explore placement rates, multi-offer distributions, top recruiter hiring volumes, and elite global higher studies admits.
>>>>>>> Stashed changes
          </p>
        </div>

        {/* Global / Batch Filter Selector Pills */}
        <div className="batch-filter-strip">
          <div className="batch-filter-label">
            <Filter size={15} />
            <span>Select Cohort:</span>
          </div>
          <div className="batch-filter-pills">
            <button
              type="button"
              className={`batch-pill ${selectedBatch === 'ALL' ? 'active' : ''}`}
              onClick={() => handleBatchChange('ALL')}
            >
              All Batches (2018–2022)
            </button>
            {BATCH_YEARS.map((yr) => (
              <button
                key={yr}
                type="button"
                className={`batch-pill ${selectedBatch === String(yr) ? 'active' : ''}`}
                onClick={() => handleBatchChange(String(yr))}
              >
                Batch {yr}
              </button>
            ))}
          </div>
        </div>

        {/* 2. SUMMARY KPI CARDS */}
        <div className="kpi-grid">
          <div className="kpi-card card">
            <div className="kpi-icon-wrap icon-cobalt">
              <Users size={22} />
            </div>
            <div className="kpi-content">
              <span className="kpi-value mono">{summary.totalStudents}</span>
              <span className="kpi-label">Graduating Students</span>
              <span className="kpi-subtext">
                {selectedBatch === 'ALL' ? 'Across 5 consecutive batches' : `Class of ${selectedBatch}`}
              </span>
            </div>
          </div>

          <div className="kpi-card card">
            <div className="kpi-icon-wrap icon-sage">
              <TrendingUp size={22} />
            </div>
            <div className="kpi-content">
              <span className="kpi-value mono">{summary.placementRate}%</span>
              <span className="kpi-label">Placement & Career Rate</span>
              <span className="kpi-subtext">
                {summary.placedTotal} placed / higher studies admits
              </span>
            </div>
          </div>

          <div className="kpi-card card">
            <div className="kpi-icon-wrap icon-gold">
              <Award size={22} />
            </div>
            <div className="kpi-content">
              <span className="kpi-value mono">{summary.totalOffers}</span>
              <span className="kpi-label">On-Campus Offers Made</span>
              <span className="kpi-subtext">
                {summary.multiOfferStudents} students secured 2+ offers
              </span>
            </div>
          </div>

          <div className="kpi-card card">
            <div className="kpi-icon-wrap icon-brick">
              <Building2 size={22} />
            </div>
            <div className="kpi-content">
              <span className="kpi-value mono">{summary.uniqueCompanies}+</span>
              <span className="kpi-label">Active Recruiting Firms</span>
              <span className="kpi-subtext">Tier-1, Product & MNCs</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. CHARTS SECTION */}
      <section className="container charts-section">
        <div className="charts-grid-main">
          {/* Chart 1: 5-Year YoY Trajectory */}
          <div className="chart-card card">
            <div className="chart-card-header">
              <div>
                <span className="eyebrow">Cohort Analytics</span>
                <h3>5-Year Placement & Success Trajectory</h3>
              </div>
              <div className="chart-legend-custom">
                <span className="legend-dot dot-cobalt"></span> Total Students
                <span className="legend-dot dot-sage" style={{ marginLeft: 12 }}></span> On-Campus Placed
                <span className="legend-dot dot-line" style={{ marginLeft: 12 }}></span> Placement % Rate
              </div>
            </div>
            <div className="chart-body" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={yoyTrends} margin={{ top: 20, right: 20, bottom: 10, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="year" tickLine={false} stroke="var(--ink-soft)" />
                  <YAxis yAxisId="left" tickLine={false} stroke="var(--ink-soft)" domain={[0, 180]} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    stroke="#3E7A56"
                    domain={[80, 100]}
                    unit="%"
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar yAxisId="left" dataKey="total" name="Total Students" fill="#D6D8CE" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar yAxisId="left" dataKey="onCampus" name="On-Campus Placed" fill="#2E4DE8" radius={[4, 4, 0, 0]} barSize={28} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rate"
                    name="Success Rate %"
                    stroke="#3E7A56"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#3E7A56' }}
                    activeDot={{ r: 7 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Outcome Distribution Donut */}
          <div className="chart-card card">
            <div className="chart-card-header">
              <div>
                <span className="eyebrow">Cohort Breakdown ({selectedBatch === 'ALL' ? '2018–2022' : `Batch ${selectedBatch}`})</span>
                <h3>Placement Outcome Distribution</h3>
              </div>
            </div>
            <div className="chart-body chart-donut-layout" style={{ height: 320 }}>
              <div className="donut-chart-wrap" style={{ width: '55%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Pie
                      data={outcomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {outcomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="donut-legend-wrap" style={{ width: '45%' }}>
                {outcomeData.map((item) => {
                  const pct = summary.totalStudents > 0 ? ((item.value / summary.totalStudents) * 100).toFixed(1) : 0;
                  return (
                    <div key={item.name} className="donut-legend-item">
                      <div className="donut-legend-color" style={{ backgroundColor: item.color }}></div>
                      <div className="donut-legend-info">
                        <div className="donut-legend-title">{item.name}</div>
                        <div className="donut-legend-count mono">
                          {item.value} <span className="donut-legend-pct">({pct}%)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="charts-grid-secondary">
          {/* Chart 3: Top Recruiters */}
          <div className="chart-card card">
            <div className="chart-card-header">
              <div>
                <span className="eyebrow">Recruiter Volume ({selectedBatch === 'ALL' ? '2018–2022' : `Batch ${selectedBatch}`})</span>
                <h3>Top Recruiting Partners</h3>
              </div>
              <span className="table-caption">Click any company bar to inspect alumni</span>
            </div>
            <div className="chart-body" style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topRecruiters}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 70, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--line)" />
                  <XAxis type="number" tickLine={false} stroke="var(--ink-soft)" />
                  <YAxis
                    type="category"
                    dataKey="company"
                    tickLine={false}
                    stroke="var(--ink)"
                    width={90}
                    tick={{ fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Offers"
                    fill="#2E4DE8"
                    radius={[0, 4, 4, 0]}
                    onClick={(data) => openCompanyAlumni(data.company)}
                    className="clickable-bar"
                  >
                    {topRecruiters.map((entry, index) => (
                      <Cell
                        key={`top-bar-${index}`}
                        fill={index === 0 ? '#1B2340' : index < 3 ? '#2E4DE8' : '#4A5170'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Multi-Offer Competitiveness */}
          <div className="chart-card card">
            <div className="chart-card-header">
              <div>
                <span className="eyebrow">Student Competitiveness</span>
                <h3>Offer Multiplicity Breakdown</h3>
              </div>
              <span className="tag tag-insight">{summary.multiOfferStudents} Multi-Offer Holders</span>
            </div>
            <div className="chart-body" style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={multiOfferData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="category" tickLine={false} stroke="var(--ink-soft)" />
                  <YAxis tickLine={false} stroke="var(--ink-soft)" />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]} barSize={40}>
                    {multiOfferData.map((_, index) => {
                      const colors = ['#2E4DE8', '#3E7A56', '#B8862A', '#B5432E'];
                      return <Cell key={`multi-cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* 4. RECRUITER SPOTLIGHT PILLS */}
      <section className="container recruiter-spotlight-section">
        <div className="panel-title">
          <div>
            <span className="eyebrow">Industry Relations</span>
            <h2>Top Hiring Powerhouses (Click to explore alumni)</h2>
          </div>
        </div>
        <div className="recruiter-tags-cloud">
          {[
            'Accenture',
            'Robert Bosch',
            'LTI / L&T',
            'HPE',
            'Oracle',
            'Akamai Technologies',
            'Deloitte',
            'Cisco',
            'Walmart',
            'McKinsey & Co.',
            'Siemens',
            'Honeywell',
            'Goldman Sachs',
            'Qualcomm',
            'Nutanix',
            'Rubrik',
            'Cohesity',
            'Mercedes-Benz',
            'Société Générale',
            'Capgemini'
          ].map((comp) => (
            <button
              key={comp}
              type="button"
              className="recruiter-badge-btn"
              onClick={() => openCompanyAlumni(comp)}
            >
              <Building2 size={14} />
              <span>{comp}</span>
              <ArrowUpRight size={13} className="badge-arrow" />
            </button>
          ))}
        </div>
      </section>

      {/* 5. HIGHER STUDIES & ENTREPRENEURSHIP SPOTLIGHT */}
      <section className="container spotlight-section">
        <div className="spotlight-grid">
          {/* Global Universities */}
          <div className="spotlight-card card">
            <div className="spotlight-header">
              <div className="spotlight-title-wrap">
                <div className="kpi-icon-wrap icon-gold">
                  <Globe size={20} />
                </div>
                <div>
                  <span className="eyebrow">Global Academics</span>
                  <h3>Elite University Admits</h3>
                </div>
              </div>
              <span className="tag tag-insight">Global Alumni</span>
            </div>
            <div className="spotlight-list">
              {globalAdmits.map((item, idx) => (
                <div key={idx} className="spotlight-item">
                  <div className="spotlight-flag">{item.flag}</div>
                  <div className="spotlight-item-main">
                    <div className="spotlight-item-title">{item.university}</div>
                    <div className="spotlight-item-sub">
                      {item.program} · <span className="mono font-semibold">{item.student}</span> ({item.batch})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Startups & Entrepreneurship */}
          <div className="spotlight-card card">
            <div className="spotlight-header">
              <div className="spotlight-title-wrap">
                <div className="kpi-icon-wrap icon-cobalt">
                  <Rocket size={20} />
                </div>
                <div>
                  <span className="eyebrow">Innovation & Ventures</span>
                  <h3>Student-Founded Startups</h3>
                </div>
              </div>
              <span className="tag tag-eligible">Founders</span>
            </div>
            <div className="spotlight-list">
              {startups.map((item, idx) => (
                <div key={idx} className="spotlight-item">
                  <div className="spotlight-item-main">
                    <div className="spotlight-venture-head">
                      <span className="spotlight-item-title">{item.startup}</span>
                      <span className="tag tag-insight mono">Batch {item.batch}</span>
                    </div>
                    <div className="spotlight-item-founders">Founders: {item.founders}</div>
                    <div className="spotlight-item-desc">{item.desc}</div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="venture-link">
                        {item.url} <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEARCHABLE & FILTERABLE PLACEMENT DIRECTORY */}
      <section className="container directory-section" id="directory">
        <div className="directory-header">
          <div>
            <span className="eyebrow">Records Explorer</span>
            <h2>Searchable Placement Directory</h2>
            <p className="directory-sub">
              Browse complete placement outcomes and offers for all 756 students.
            </p>
          </div>

          {/* Search Box */}
          <div className="directory-search-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by student name, USN, company, or university..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="directory-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => handleSearchChange({ target: { value: '' } })}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Directory Controls Bar */}
        <div className="directory-controls card">
          <div className="directory-status-filters">
            <button
              type="button"
              className={`status-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => handleStatusChange('ALL')}
            >
              All Outcomes ({PLACEMENT_STUDENTS.filter(s => selectedBatch === 'ALL' || s.batchYear === Number(selectedBatch)).length})
            </button>
            <button
              type="button"
              className={`status-btn ${statusFilter === 'ON_CAMPUS' ? 'active' : ''}`}
              onClick={() => handleStatusChange('ON_CAMPUS')}
            >
              On-Campus Placed
            </button>
            <button
              type="button"
              className={`status-btn ${statusFilter === 'HIGHER_STUDIES' ? 'active' : ''}`}
              onClick={() => handleStatusChange('HIGHER_STUDIES')}
            >
              Higher Studies / Startups
            </button>
            <button
              type="button"
              className={`status-btn ${statusFilter === 'NOT_PLACED' ? 'active' : ''}`}
              onClick={() => handleStatusChange('NOT_PLACED')}
            >
              Seeking Placement
            </button>
          </div>
          <div className="directory-count-badge mono">
            Showing {filteredStudents.length} {filteredStudents.length === 1 ? 'record' : 'records'}
          </div>
        </div>

        {/* Table */}
        <div className="directory-table-container card">
          <table className="directory-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>USN</th>
                <th>Student Name</th>
                <th style={{ width: '100px' }}>Batch</th>
                <th style={{ width: '180px' }}>Status</th>
                <th>Placement Details & Offers</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table-empty">
                    <p>No matching placement records found.</p>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('ALL');
                        setSelectedBatch('ALL');
                      }}
                    >
                      Reset All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="mono usn-cell">{s.usn}</td>
                    <td className="name-cell font-semibold">{s.name}</td>
                    <td>
                      <span className="tag mono">Batch {s.batchYear}</span>
                    </td>
                    <td>
                      {s.status === 'On-Campus' && (
                        <span className="tag tag-eligible">
                          <CheckCircle2 size={12} /> On-Campus
                        </span>
                      )}
                      {s.category.includes('Off-Campus') && (
                        <span className="tag tag-insight">
                          <GraduationCap size={12} /> Higher Studies / Off-Campus
                        </span>
                      )}
                      {s.status === 'Not Placed' && (
                        <span className="tag tag-gap">Seeking Placement</span>
                      )}
                    </td>
                    <td className="details-cell">
                      {s.offers.length > 0 ? (
                        <div className="offers-pill-list">
                          {s.offers.map((offer, idx) => (
                            <span key={idx} className="offer-tag">
                              {offer}
                            </span>
                          ))}
                          {s.offerCount > 1 && (
                            <span className="tag tag-insight mono font-bold">
                              {s.offerCount} Offers
                            </span>
                          )}
                        </div>
                      ) : s.details ? (
                        <span className="other-detail-text">{s.details}</span>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="table-pagination">
              <span className="pagination-info mono">
                Page {currentPage} of {totalPages} ({filteredStudents.length} total)
              </span>
              <div className="pagination-actions">
                <button
                  type="button"
                  className="btn btn-ghost pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  type="button"
                  className="btn btn-ghost pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. RECRUITER ALUMNI MODAL */}
      {selectedCompanyModal && (
        <div className="modal-backdrop" onClick={() => setSelectedCompanyModal(null)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="kpi-icon-wrap icon-cobalt">
                  <Building2 size={20} />
                </div>
                <div>
                  <span className="eyebrow">Recruiter Alumni Spotlight</span>
                  <h3>{selectedCompanyModal.company}</h3>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedCompanyModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-stat-pill mono">
                Total Alumni Hired: <strong>{selectedCompanyModal.alumni.length} students</strong> across 2018–2022
              </div>

              <div className="modal-alumni-table-wrap">
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Batch</th>
                      <th>USN</th>
                      <th>Student Name</th>
                      <th>Offer Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCompanyModal.alumni.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <span className="tag mono">{a.batchYear}</span>
                        </td>
                        <td className="mono usn-cell">{a.usn}</td>
                        <td className="font-semibold">{a.name}</td>
                        <td>
                          <div className="offers-pill-list">
                            {a.offers.map((off, i) => (
                              <span
                                key={i}
                                className={`offer-tag ${
                                  off.toLowerCase().includes(selectedCompanyModal.company.toLowerCase())
                                    ? 'highlight-tag'
                                    : ''
                                }`}
                              >
                                {off}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setSelectedCompanyModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. STUDENT READINESS CTA BANNER */}
      <section className="container cta-band">
        <div className="cta-band-inner card">
          <div>
<<<<<<< Updated upstream
            <h2>See exactly where you stand.</h2>
            <p>Create a student account to unlock your personalized readiness score, skill gaps, and senior insights.</p>
=======
            <div className="cta-badge">CampusIQ Student Intelligence</div>
            <h2>Aiming for top recruiters like Akamai, Cisco, or Walmart?</h2>
            <p>
              Log in to the PlaceWise portal to calculate your readiness score against senior benchmarks, identify skill gaps, and explore real interview round debriefs.
            </p>
          </div>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">
              Check Placement Readiness <ArrowUpRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-ghost cta-ghost-btn">
              Student Login
            </Link>
>>>>>>> Stashed changes
          </div>
        </div>
      </section>
    </div>
  );
}

// Custom Tooltip for YoY Chart
function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-chart-tooltip card">
        <div className="tooltip-title">Batch of {label}</div>
        <div className="tooltip-row">
          <span className="tooltip-key">Total Students:</span>
          <span className="tooltip-val mono">{data.total}</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-key">On-Campus Offers:</span>
          <span className="tooltip-val mono text-cobalt">{data.offers} offers ({data.onCampus} students)</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-key">Higher Studies / Startups:</span>
          <span className="tooltip-val mono text-gold">{data.offCampusHS}</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-key">Multi-Offer Students:</span>
          <span className="tooltip-val mono">{data.multi} students</span>
        </div>
        <div className="tooltip-divider"></div>
        <div className="tooltip-row highlight-row">
          <span className="tooltip-key">Overall Success Rate:</span>
          <span className="tooltip-val mono text-sage font-bold">{data.rate}%</span>
        </div>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Donut Chart
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-chart-tooltip card">
        <div className="tooltip-title">{data.name}</div>
        <div className="tooltip-row">
          <span className="tooltip-key">Count:</span>
          <span className="tooltip-val mono font-bold">{data.value} students</span>
        </div>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Bar Charts
function CustomBarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-chart-tooltip card">
        <div className="tooltip-title">{label || data.name}</div>
        <div className="tooltip-row">
          <span className="tooltip-key">{data.name}:</span>
          <span className="tooltip-val mono font-bold text-cobalt">{data.value}</span>
        </div>
      </div>
    );
  }
  return null;
}
