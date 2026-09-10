import { useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FilePlus2,
  Filter,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import students from './data/students.json'
import starterActivities from './data/activities.json'
import categories from './data/categories.json'

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/activities', label: 'My activities', icon: ClipboardList },
  { to: '/add-activity', label: 'Add activity', icon: FilePlus2 },
  { to: '/profile', label: 'Student profile', icon: UserRound },
]

const categoryIcons = {
  Technical: Activity,
  Professional: BookOpen,
  Sports: Award,
  Cultural: Sparkles,
  'Social service': ShieldCheck,
  Leadership: BarChart3,
}

function App() {
  const [student, setStudent] = useState(null)
  const [activities, setActivities] = useState(starterActivities)

  useEffect(() => {
    const savedStudent = sessionStorage.getItem('loop-student')
    if (savedStudent) setStudent(JSON.parse(savedStudent))
  }, [])

  function handleLogin(uid, password) {
    const match = students.find((item) => item.uid.toLowerCase() === uid.trim().toLowerCase() && item.password === password)
    if (!match) return false
    setStudent(match)
    sessionStorage.setItem('loop-student', JSON.stringify(match))
    return true
  }

  function handleLogout() {
    setStudent(null)
    sessionStorage.removeItem('loop-student')
  }

  function addActivity(activity) {
    setActivities((current) => [{ ...activity, id: Date.now(), approved: 0, status: 'Under review' }, ...current])
  }

  if (!student) return <LoginPage onLogin={handleLogin} />

  return (
    <AppShell student={student} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard student={student} activities={activities} />} />
        <Route path="/activities" element={<ActivitiesPage activities={activities} />} />
        <Route path="/add-activity" element={<AddActivityPage onAdd={addActivity} />} />
        <Route path="/profile" element={<ProfilePage student={student} activities={activities} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

function LoginPage({ onLogin }) {
  const [uid, setUid] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    setError(onLogin(uid, password) ? '' : 'That UID and password combination was not found.')
  }

  return (
    <main className="login-page">
      <div className="login-art" aria-hidden="true">
        <div className="art-topline"><span className="brand-mark small">L</span> LOOP / CAMPUS LIFE</div>
        <div className="art-copy">
          <p className="eyebrow light">Make your work count</p>
          <h1>Every hour invested becomes part of your story.</h1>
          <p>Keep your campus journey visible, verified and moving forward.</p>
        </div>
        <div className="art-stamp"><span>2025—26</span><strong>BUILD<br />YOUR<br />LOOP</strong></div>
        <div className="art-grid" />
      </div>
      <section className="login-panel">
        <div className="mobile-brand"><span className="brand-mark">L</span><span>LOOP</span></div>
        <div className="login-inner">
          <p className="eyebrow">Student portal</p>
          <h2>Welcome back.</h2>
          <p className="muted intro">Sign in to keep track of the things you do beyond the classroom.</p>
          <form onSubmit={submit} className="login-form">
            <label>University ID<input value={uid} onChange={(event) => setUid(event.target.value)} placeholder="e.g. STU2024001" autoComplete="username" required /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required /></label>
            {error && <p className="form-error">{error}</p>}
            <button className="primary-button full" type="submit">Enter my dashboard <ArrowUpRight size={17} /></button>
          </form>
          <p className="demo-note">Demo access <strong>STU2024001</strong> / <strong>activity123</strong></p>
        </div>
        <p className="login-footer">© 2025 Loop Student Services <span>Need help? <CircleHelp size={14} /></span></p>
      </section>
    </main>
  )
}

function AppShell({ student, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const title = location.pathname === '/' ? 'Overview' : navItems.find((item) => item.to === location.pathname)?.label || 'Activity points'

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="side-brand"><span className="brand-mark">L</span><span>LOOP</span><button className="close-menu" onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
        <div className="profile-mini"><div className="avatar">AM</div><div><strong>{student.name}</strong><span>{student.uid}</span></div></div>
        <nav className="main-nav">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={18} /><span>{label}</span>{label === 'Add activity' && <span className="nav-plus"><Plus size={13} /></span>}</NavLink>)}</nav>
        <div className="side-bottom"><div className="target-note"><span className="target-icon"><GraduationCap size={18} /></span><div><strong>100 points</strong><span>Semester target</span></div></div><button className="logout-button" onClick={onLogout}><LogOut size={16} /> Sign out</button></div>
      </aside>
      {menuOpen && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <section className="main-area">
        <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)}><Menu size={21} /></button><div><span className="crumb">LOOP / STUDENT SERVICES</span><h1>{title}</h1></div><div className="top-actions"><button className="icon-button" title="Notifications"><Bell size={19} /><span className="notification-dot" /></button><div className="top-avatar">AM</div></div></header>
        <main className="content">{children}</main>
      </section>
    </div>
  )
}

function Dashboard({ student, activities }) {
  const approvedPoints = activities.reduce((total, activity) => total + activity.approved, 0)
  const claimedPoints = activities.reduce((total, activity) => total + activity.claimed, 0)
  const remaining = Math.max(student.targetPoints - approvedPoints, 0)
  const progress = Math.min((approvedPoints / student.targetPoints) * 100, 100)
  const recentActivities = activities.slice(0, 4)

  return <>
    <div className="page-intro"><div><p className="eyebrow">Tuesday, 10 September 2025</p><h2>Good morning, {student.name.split(' ')[0]} <span className="wave">✦</span></h2><p className="muted">Here’s the latest on your activity points.</p></div><NavLink to="/add-activity" className="primary-button"><Plus size={17} /> Add activity</NavLink></div>
    <section className="hero-summary"><div><p className="eyebrow light">Your progress this semester</p><div className="points-line"><strong>{approvedPoints}</strong><span>/ {student.targetPoints} points</span></div><p className="hero-note"><span className="green-dot" /> {remaining} points to reach your target</p></div><div className="progress-ring" style={{ '--progress': `${progress}%` }}><div><strong>{Math.round(progress)}%</strong><span>complete</span></div></div><div className="summary-marks"><span>01</span><span>02</span><span>03</span><span>04</span></div></section>
    <div className="stats-grid"><StatCard label="Approved points" value={approvedPoints} detail="Across all activities" icon={Check} color="green" /><StatCard label="Points claimed" value={claimedPoints} detail={`${claimedPoints - approvedPoints} awaiting review`} icon={BarChart3} color="orange" /><StatCard label="Activities logged" value={activities.length} detail={`${activities.filter((activity) => activity.status === 'Under review').length} under review`} icon={ClipboardList} color="blue" /></div>
    <div className="section-heading"><div><p className="eyebrow">Keep building</p><h3>Explore categories</h3></div><NavLink to="/activities" className="text-link">View all activities <ChevronRight size={16} /></NavLink></div>
    <div className="category-grid">{categories.map((category) => { const Icon = categoryIcons[category.name] || Activity; return <div className={`category-card ${category.color}`} key={category.id}><div className="category-icon"><Icon size={20} /></div><h4>{category.name}</h4><p>{category.description}</p><ArrowUpRight size={16} className="category-arrow" /></div> })}</div>
    <div className="section-heading recent-heading"><div><p className="eyebrow">Your record</p><h3>Recent activity</h3></div><NavLink to="/activities" className="text-link">See all <ChevronRight size={16} /></NavLink></div>
    <ActivityTable activities={recentActivities} compact />
  </>
}

function StatCard({ label, value, detail, icon: Icon, color }) { return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={18} /></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div> }

function ActivitiesPage({ activities }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const filtered = activities.filter((activity) => (filter === 'All' || activity.category === filter) && `${activity.title} ${activity.category}`.toLowerCase().includes(search.toLowerCase()))
  const filterOptions = ['All', ...new Set(activities.map((activity) => activity.category))]
  return <><div className="page-intro"><div><p className="eyebrow">Activity record</p><h2>All your activities</h2><p className="muted">A complete view of your contributions and achievements.</p></div><NavLink to="/add-activity" className="primary-button"><Plus size={17} /> Add activity</NavLink></div><div className="toolbar"><div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search activities" /></div><div className="filter-group"><Filter size={16} />{filterOptions.map((item) => <button className={filter === item ? 'selected' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div><ActivityTable activities={filtered} /></>
}

function ActivityTable({ activities, compact = false }) { return <div className={`activity-table ${compact ? 'compact' : ''}`}><div className="table-head"><span>Activity</span><span>Category</span><span>Date</span><span>Points</span><span>Status</span><span /></div>{activities.length ? activities.map((activity) => <div className="table-row" key={activity.id}><div className="activity-title"><div className="activity-symbol"><Activity size={16} /></div><div><strong>{activity.title}</strong><span>{activity.description}</span></div></div><span className="category-label">{activity.category}</span><span className="date-label"><CalendarDays size={14} />{formatDate(activity.date)}</span><div className="points-label"><strong>{activity.approved || activity.claimed}</strong><span>{activity.approved ? 'approved' : 'claimed'}</span></div><span className={`status ${activity.status === 'Approved' ? 'approved' : 'review'}`}><span />{activity.status}</span><ChevronRight size={17} className="row-chevron" /></div>) : <div className="empty-state">No activities match your search.</div>}</div> }

function AddActivityPage({ onAdd }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', category: 'Technical', date: '', description: '', claimed: '' })
  const [submitted, setSubmitted] = useState(false)
  function update(field, value) { setForm((current) => ({ ...current, [field]: value })) }
  function submit(event) { event.preventDefault(); onAdd({ ...form, claimed: Number(form.claimed) }); setSubmitted(true); setTimeout(() => navigate('/activities'), 700) }
  return <><div className="page-intro"><div><p className="eyebrow">New submission</p><h2>Add an activity</h2><p className="muted">Log something meaningful you’ve done outside the classroom.</p></div><div className="step-label"><span>01</span> Submission form</div></div><div className="form-layout"><form className="activity-form" onSubmit={submit}><div className="form-section"><span className="form-section-number">01</span><div><h3>Activity details</h3><p className="muted">Tell us what you accomplished.</p></div></div><label>Activity title<input value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Open source contribution" required /></label><div className="field-row"><label>Category<select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select></label><label>Date completed<input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} required /></label></div><label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Briefly describe your role, outcome or contribution..." rows="5" required /></label><div className="field-row"><label>Points claimed<input type="number" min="1" max="50" value={form.claimed} onChange={(event) => update('claimed', event.target.value)} placeholder="e.g. 10" required /></label><div className="points-tip"><Award size={18} /><span>Points are reviewed by the student services team.</span></div></div><div className="form-actions"><button type="button" className="secondary-button" onClick={() => navigate(-1)}>Cancel</button><button className="primary-button" type="submit">{submitted ? <><Check size={17} /> Submitted</> : <>Submit for review <ArrowUpRight size={17} /></>}</button></div></form><aside className="form-aside"><div className="aside-art"><Sparkles size={27} /><span>Make<br />it count.</span></div><div className="aside-copy"><p className="eyebrow">Before you submit</p><h3>Small details help us approve faster.</h3><ul><li><Check size={15} /> Use the official activity name</li><li><Check size={15} /> Add a clear, concise description</li><li><Check size={15} /> Attach proof when requested</li></ul></div></aside></div></>
}

function ProfilePage({ student, activities }) {
  const approved = activities.reduce((sum, item) => sum + item.approved, 0)
  const claimed = activities.reduce((sum, item) => sum + item.claimed, 0)
  return <><div className="page-intro"><div><p className="eyebrow">Student profile</p><h2>Your campus identity</h2><p className="muted">The details connected to your activity record.</p></div><div className="verified-pill"><ShieldCheck size={16} /> Verified student</div></div><section className="profile-header"><div className="profile-avatar">AM</div><div><p className="eyebrow">{student.uid}</p><h3>{student.name}</h3><p>{student.department}</p></div><div className="profile-semester"><span>Current term</span><strong>{student.semester}</strong></div></section><div className="profile-grid"><div className="profile-details"><h3>Personal details</h3><dl><div><dt>Email address</dt><dd>{student.email}</dd></div><div><dt>Phone number</dt><dd>{student.phone}</dd></div><div><dt>Joined campus</dt><dd>{student.joined}</dd></div><div><dt>Department</dt><dd>{student.department}</dd></div></dl></div><div className="profile-points"><p className="eyebrow">Points overview</p><div className="big-number">{approved}<span>/ {student.targetPoints}</span></div><div className="mini-progress"><span style={{ width: `${Math.min((approved / student.targetPoints) * 100, 100)}%` }} /></div><div className="points-breakdown"><span><strong>{approved}</strong> approved</span><span><strong>{claimed - approved}</strong> in review</span></div></div></div></>
}

function formatDate(value) { return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`)) }

export default App
