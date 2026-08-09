import { useEffect, useMemo, useState } from 'react'
import {
  Bell, BookOpen, CalendarDays, Check, CheckCircle2, ChevronDown,
  ChevronRight, Circle, Clock3, Command, GraduationCap, LayoutDashboard,
  Calculator, CalendarRange, ListChecks, Menu, MoreHorizontal, Plus, ReceiptText, RefreshCw, Search, Settings, Sparkles,
  Trash2, Users, X,
} from 'lucide-react'

type NavItem = 'Today' | 'Students' | 'Schedule' | 'Tasks' | 'Academic Calendar' | 'Extracurricular'
type Task = { id: number; title: string; meta: string; done: boolean; tone: string }

const initialTasks: Task[] = [
  { id: 1, title: 'Confirm mentor allocation', meta: 'Data Analytics · Batch 12', done: false, tone: 'violet' },
  { id: 2, title: 'Review attendance exceptions', meta: '6 students need attention', done: false, tone: 'orange' },
  { id: 3, title: 'Send weekly learning report', meta: 'Due today · 4:00 PM', done: false, tone: 'blue' },
  { id: 4, title: 'Update curriculum tracker', meta: 'Frontend Engineering · Week 7', done: true, tone: 'green' },
]

const schedule = [
  { time: '09:00', end: '10:00', title: 'Academic team standup', kind: 'Internal', color: 'green' },
  { time: '11:30', end: '12:15', title: 'Mentor check-in · Batch 12', kind: 'Google Meet', color: 'violet' },
  { time: '14:00', end: '15:30', title: 'Student progress review', kind: '18 students', color: 'orange' },
]

const cohorts = [
  { name: 'Data Analytics', batch: 'Batch 12', students: 28, progress: 68, risk: 3, color: '#7457d6' },
  { name: 'Frontend Engineering', batch: 'Batch 08', students: 24, progress: 82, risk: 1, color: '#e27645' },
  { name: 'Product Management', batch: 'Batch 05', students: 31, progress: 46, risk: 5, color: '#28917f' },
]

const nav = [
  { label: 'Today' as NavItem, icon: LayoutDashboard },
  { label: 'Students' as NavItem, icon: Users },
  { label: 'Schedule' as NavItem, icon: CalendarDays },
  { label: 'Tasks' as NavItem, icon: ListChecks },
  { label: 'Academic Calendar' as NavItem, icon: CalendarRange },
  { label: 'Extracurricular' as NavItem, icon: Calculator },
]

function App() {
  const [active, setActive] = useState<NavItem>('Today')
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('academic-ops-tasks')
    return saved ? JSON.parse(saved) : initialTasks
  })
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => localStorage.setItem('academic-ops-tasks', JSON.stringify(tasks)), [tasks])
  const pending = useMemo(() => tasks.filter(task => !task.done).length, [tasks])

  const toggleTask = (id: number) => setTasks(current => current.map(task => task.id === id ? { ...task, done: !task.done } : task))
  const addTask = () => {
    if (!newTask.trim()) return
    setTasks(current => [{ id: Date.now(), title: newTask.trim(), meta: 'Personal task · Added just now', done: false, tone: 'violet' }, ...current])
    setNewTask('')
    setShowAdd(false)
  }

  return (
    <div className="app-shell">
      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <div className="brand"><div className="brand-mark"><GraduationCap size={20}/></div><span>Acadely</span><button className="close-menu" onClick={() => setMenuOpen(false)}><X size={20}/></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {nav.map(({ label, icon: Icon }) => <button key={label} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(label); setMenuOpen(false) }}><Icon size={18}/><span>{label}</span>{label === 'Tasks' && pending > 0 && <b>{pending}</b>}</button>)}
        </nav>
        <div className="sidebar-spacer" />
        <button className="nav-item"><BookOpen size={18}/><span>Resources</span></button>
        <button className="nav-item"><Settings size={18}/><span>Settings</span></button>
        <div className="profile"><div className="avatar">AY</div><div><strong>Academic Ops</strong><small>Personal workspace</small></div><MoreHorizontal size={18}/></div>
      </aside>

      <main>
        <header>
          <button className="menu-button" onClick={() => setMenuOpen(true)}><Menu size={21}/></button>
          <div className="search"><Search size={17}/><input placeholder="Search anything..."/><span><Command size={12}/> K</span></div>
          <div className="header-actions"><button className="icon-button"><Bell size={18}/><i/></button><button className="date-button"><CalendarDays size={17}/><span>Aug 9, 2026</span><ChevronDown size={15}/></button></div>
        </header>

        <div className="content">
          {active === 'Extracurricular' ? <ExtracurricularCalculator /> : active === 'Academic Calendar' ? <AcademicCalendar /> : active !== 'Today' ? <ModulePlaceholder active={active} onBack={() => setActive('Today')}/> : <>
            <section className="welcome">
              <div><div className="eyebrow"><Sparkles size={14}/> SUNDAY OVERVIEW</div><h1>Good morning, Academic Ops.</h1><p>Here’s what needs your attention today.</p></div>
              <button className="primary-button" onClick={() => setShowAdd(true)}><Plus size={17}/> Add task</button>
            </section>

            <section className="stats-grid">
              <Stat icon={<ListChecks/>} value={pending.toString().padStart(2, '0')} label="Open tasks" note="3 due today" tone="violet" />
              <Stat icon={<Users/>} value="84" label="Active students" note="Across 3 cohorts" tone="green" />
              <Stat icon={<CalendarDays/>} value="03" label="Sessions today" note="Next at 9:00 AM" tone="orange" />
              <Stat icon={<CheckCircle2/>} value="92%" label="Attendance rate" note="+2.4% this week" tone="blue" />
            </section>

            <div className="dashboard-grid">
              <section className="panel tasks-panel">
                <PanelTitle title="Today’s priorities" subtitle={`${pending} tasks remaining`} action="View all" onAction={() => setActive('Tasks')} />
                <div className="task-list">{tasks.slice(0, 4).map(task => <button className={task.done ? 'task done' : 'task'} key={task.id} onClick={() => toggleTask(task.id)}><span className={`check ${task.tone}`}>{task.done ? <Check size={14}/> : <Circle size={15}/>}</span><span className="task-copy"><strong>{task.title}</strong><small>{task.meta}</small></span><ChevronRight size={16}/></button>)}</div>
              </section>

              <section className="panel schedule-panel">
                <PanelTitle title="Today’s schedule" subtitle="3 sessions · 3h 15m" action="Full calendar" onAction={() => setActive('Schedule')} />
                <div className="schedule-list">{schedule.map(item => <div className="schedule-row" key={item.time}><div className="time"><strong>{item.time}</strong><small>{item.end}</small></div><div className={`timeline ${item.color}`}/><div className="event"><strong>{item.title}</strong><small>{item.kind}</small></div></div>)}</div>
              </section>
            </div>

            <section className="panel cohorts-panel">
              <PanelTitle title="Cohort pulse" subtitle="A quick health check across active cohorts" action="View students" onAction={() => setActive('Students')} />
              <div className="cohort-grid">{cohorts.map(cohort => <div className="cohort" key={cohort.name}><div className="cohort-top"><span style={{background: cohort.color}}>{cohort.name.split(' ').map(x => x[0]).join('')}</span><button><MoreHorizontal size={18}/></button></div><strong>{cohort.name}</strong><small>{cohort.batch} · {cohort.students} students</small><div className="progress-head"><span>Course progress</span><b>{cohort.progress}%</b></div><div className="progress"><i style={{width: `${cohort.progress}%`, background: cohort.color}}/></div><div className="risk"><span className={cohort.risk > 3 ? 'high' : ''}>{cohort.risk} need attention</span><ChevronRight size={15}/></div></div>)}</div>
            </section>
          </>}
        </div>
      </main>

      {showAdd && <div className="modal-backdrop" onMouseDown={() => setShowAdd(false)}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-icon"><ListChecks size={22}/></div><h2>Add a new task</h2><p>Capture what needs your attention.</p><label>Task name</label><input autoFocus value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="e.g. Review student submissions"/><div className="modal-actions"><button onClick={() => setShowAdd(false)}>Cancel</button><button className="primary-button" onClick={addTask}>Add task</button></div></div></div>}
    </div>
  )
}

function Stat({ icon, value, label, note, tone }: { icon: React.ReactNode, value: string, label: string, note: string, tone: string }) {
  return <article className="stat"><div className={`stat-icon ${tone}`}>{icon}</div><div><strong>{value}</strong><span>{label}</span><small>{note}</small></div></article>
}

function PanelTitle({ title, subtitle, action, onAction }: { title: string, subtitle: string, action: string, onAction: () => void }) {
  return <div className="panel-title"><div><h2>{title}</h2><p>{subtitle}</p></div><button onClick={onAction}>{action}<ChevronRight size={15}/></button></div>
}

type CalendarEvent = { date: string; name: string; type: 'national' | 'collective' | 'school' | 'effective'; source?: string }

const officialHolidays2026: CalendarEvent[] = [
  ['2026-01-01','Tahun Baru 2026 Masehi','national'], ['2026-01-16','Isra Mikraj Nabi Muhammad SAW','national'],
  ['2026-02-16','Cuti Bersama Tahun Baru Imlek','collective'], ['2026-02-17','Tahun Baru Imlek 2577 Kongzili','national'],
  ['2026-03-18','Cuti Bersama Hari Suci Nyepi','collective'], ['2026-03-19','Hari Suci Nyepi','national'],
  ['2026-03-20','Cuti Bersama Idulfitri','collective'], ['2026-03-21','Idulfitri 1447 H','national'],
  ['2026-03-22','Idulfitri 1447 H','national'], ['2026-03-23','Cuti Bersama Idulfitri','collective'],
  ['2026-03-24','Cuti Bersama Idulfitri','collective'], ['2026-04-03','Wafat Yesus Kristus','national'],
  ['2026-04-05','Paskah','national'], ['2026-05-01','Hari Buruh Internasional','national'],
  ['2026-05-14','Kenaikan Yesus Kristus','national'], ['2026-05-15','Cuti Bersama Kenaikan Yesus Kristus','collective'],
  ['2026-05-27','Iduladha 1447 H','national'], ['2026-05-28','Cuti Bersama Iduladha','collective'],
  ['2026-05-31','Hari Raya Waisak 2570 BE','national'], ['2026-06-01','Hari Lahir Pancasila','national'],
  ['2026-06-16','Tahun Baru Islam 1448 H','national'], ['2026-08-17','Hari Kemerdekaan Republik Indonesia','national'],
  ['2026-08-25','Maulid Nabi Muhammad SAW','national'], ['2026-12-24','Cuti Bersama Natal','collective'],
  ['2026-12-25','Hari Raya Natal','national'],
].map(([date,name,type]) => ({ date, name, type: type as CalendarEvent['type'], source: 'SKB 3 Menteri 2026' }))

const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const dayNames = ['S','S','R','K','J','S','M']
const dateKey = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`

function AcademicCalendar() {
  const [year, setYear] = useState(2026)
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('academic-calendar-events')
    return saved ? JSON.parse(saved) : officialHolidays2026
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [eventName, setEventName] = useState('')
  const [eventType, setEventType] = useState<CalendarEvent['type']>('school')
  const [synced, setSynced] = useState(false)

  useEffect(() => localStorage.setItem('academic-calendar-events', JSON.stringify(events)), [events])
  const yearEvents = events.filter(event => event.date.startsWith(`${year}-`))
  const eventMap = new Map(yearEvents.map(event => [event.date, event]))
  const daysInYear = new Date(year, 1, 29).getMonth() === 1 ? 366 : 365
  const weekendDays = Array.from({length: daysInYear}, (_, i) => { const date = new Date(year, 0, i + 1); return date.getDay() === 0 || date.getDay() === 6 }).filter(Boolean).length
  const holidayWeekdays = yearEvents.filter(event => event.type !== 'effective' && ![0,6].includes(new Date(`${event.date}T12:00:00`).getDay())).length
  const effectiveOverrides = yearEvents.filter(event => event.type === 'effective').length
  const effectiveDays = daysInYear - weekendDays - holidayWeekdays + effectiveOverrides

  const openDate = (key: string) => {
    const existing = eventMap.get(key)
    setSelectedDate(key)
    setEventName(existing?.name || '')
    setEventType(existing?.type || 'school')
  }
  const saveEvent = () => {
    if (!selectedDate || !eventName.trim()) return
    setEvents(current => [...current.filter(event => event.date !== selectedDate), { date: selectedDate, name: eventName.trim(), type: eventType }])
    setSelectedDate(null)
  }
  const removeEvent = () => {
    if (!selectedDate) return
    setEvents(current => current.filter(event => event.date !== selectedDate))
    setSelectedDate(null)
  }
  const syncOfficial = () => {
    if (year !== 2026) return
    setEvents(current => [...current.filter(event => !(event.date.startsWith('2026-') && (event.type === 'national' || event.type === 'collective'))), ...officialHolidays2026])
    setSynced(true)
    window.setTimeout(() => setSynced(false), 2200)
  }

  return <section className="calendar-page">
    <div className="calendar-heading">
      <div><div className="eyebrow"><CalendarRange size={14}/> ACADEMIC YEAR</div><h1>Kalender akademik tahunan</h1><p>Atur hari efektif, libur nasional, cuti bersama, dan libur sekolah.</p></div>
      <div className="calendar-actions"><select value={year} onChange={e => setYear(Number(e.target.value))}>{[2025,2026,2027,2028].map(value => <option key={value}>{value}</option>)}</select><button className="sync-button" onClick={syncOfficial} disabled={year !== 2026}><RefreshCw size={15}/>{synced ? 'Tersinkron' : 'Sync libur Indonesia'}</button></div>
    </div>
    {year !== 2026 && <div className="calendar-warning">Data resmi otomatis saat ini tersedia untuk 2026. Kamu tetap dapat menambahkan atau mengubah tanggal secara manual untuk {year}.</div>}
    <section className="calendar-stats">
      <div><span className="cal-dot effective"/><p><strong>{effectiveDays}</strong><small>Hari efektif</small></p></div>
      <div><span className="cal-dot national"/><p><strong>{yearEvents.filter(e => e.type === 'national').length}</strong><small>Libur nasional</small></p></div>
      <div><span className="cal-dot collective"/><p><strong>{yearEvents.filter(e => e.type === 'collective').length}</strong><small>Cuti bersama</small></p></div>
      <div><span className="cal-dot school"/><p><strong>{yearEvents.filter(e => e.type === 'school').length}</strong><small>Libur sekolah</small></p></div>
    </section>
    <div className="year-calendar">{monthNames.map((month, monthIndex) => {
      const totalDays = new Date(year, monthIndex + 1, 0).getDate()
      const mondayOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7
      return <article className="month-card" key={month}><div className="month-title"><h2>{month}</h2><span>{year}</span></div><div className="weekday-row">{dayNames.map((day,index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="month-days">{Array.from({length: mondayOffset},(_,i) => <i key={`blank-${i}`}/>)}{Array.from({length: totalDays},(_,i) => {
        const day = i + 1, key = dateKey(year, monthIndex, day), event = eventMap.get(key), weekday = new Date(year, monthIndex, day).getDay(), weekend = weekday === 0 || weekday === 6
        return <button key={key} title={event?.name || (weekend ? 'Akhir pekan' : 'Hari efektif')} className={`${weekend ? 'weekend ' : ''}${event ? event.type : ''}`} onClick={() => openDate(key)}><span>{day}</span>{event && <b/>}</button>
      })}</div></article>
    })}</div>
    <div className="calendar-legend"><span><i className="national"/>Libur nasional</span><span><i className="collective"/>Cuti bersama</span><span><i className="school"/>Libur sekolah</span><span><i className="effective"/>Override hari efektif</span><small>Klik tanggal untuk mengubah statusnya</small></div>

    {selectedDate && <div className="modal-backdrop" onMouseDown={() => setSelectedDate(null)}><div className="modal date-modal" onMouseDown={e => e.stopPropagation()}><div className="date-modal-head"><div><span>ATUR TANGGAL</span><h2>{new Intl.DateTimeFormat('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${selectedDate}T12:00:00`))}</h2></div><button onClick={() => setSelectedDate(null)}><X size={18}/></button></div><label>Nama / keterangan</label><input autoFocus value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Contoh: Libur semester"/><label>Status hari</label><div className="date-type-options">{([['school','Libur sekolah'],['effective','Hari efektif'],['national','Libur nasional'],['collective','Cuti bersama']] as const).map(([value,label]) => <button className={eventType === value ? `active ${value}` : ''} onClick={() => setEventType(value)} key={value}>{label}</button>)}</div><div className="modal-actions split">{eventMap.has(selectedDate) ? <button className="delete-button" onClick={removeEvent}><Trash2 size={14}/> Hapus status</button> : <span/>}<div><button onClick={() => setSelectedDate(null)}>Cancel</button><button className="primary-button" onClick={saveEvent}>Simpan</button></div></div></div></div>}
  </section>
}

type PriceModel = 'child_month' | 'session' | 'session_child'

function ExtracurricularCalculator() {
  const [vendor, setVendor] = useState('')
  const [activity, setActivity] = useState('')
  const [model, setModel] = useState<PriceModel>('child_month')
  const [price, setPrice] = useState(250000)
  const [students, setStudents] = useState(20)
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-12-31')
  const [selectedDays, setSelectedDays] = useState<number[]>([5])
  const [markup, setMarkup] = useState(15)

  const calendarEvents: CalendarEvent[] = (() => {
    const saved = localStorage.getItem('academic-calendar-events')
    return saved ? JSON.parse(saved) : officialHolidays2026
  })()
  const extracurricularDates = useMemo(() => {
    const possible: { date: string; event?: CalendarEvent }[] = []
    const effective: { date: string; event?: CalendarEvent }[] = []
    const blocked: { date: string; event?: CalendarEvent }[] = []
    const from = new Date(`${startDate}T12:00:00`), until = new Date(`${endDate}T12:00:00`)
    if (Number.isNaN(from.getTime()) || Number.isNaN(until.getTime()) || from > until) return { possible, effective, blocked }
    const eventByDate = new Map(calendarEvents.map(event => [event.date, event]))
    for (const cursor = new Date(from); cursor <= until; cursor.setDate(cursor.getDate() + 1)) {
      if (!selectedDays.includes(cursor.getDay())) continue
      const key = dateKey(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())
      const event = eventByDate.get(key)
      possible.push({ date: key, event })
      if (!event || event.type === 'effective') effective.push({ date: key, event })
      else blocked.push({ date: key, event })
    }
    return { possible, effective, blocked }
  }, [startDate, endDate, selectedDays, calendarEvents])
  const annualSessions = extracurricularDates.effective.length
  const activeMonths = (() => {
    const from = new Date(`${startDate}T12:00:00`), until = new Date(`${endDate}T12:00:00`)
    if (Number.isNaN(from.getTime()) || Number.isNaN(until.getTime()) || from > until) return 0
    return (until.getFullYear() - from.getFullYear()) * 12 + until.getMonth() - from.getMonth() + 1
  })()
  const vendorTotal = model === 'child_month'
    ? price * students * activeMonths
    : model === 'session'
      ? price * annualSessions
      : price * annualSessions * students
  const basePerStudent = students > 0 ? vendorTotal / students : 0
  const billedPerStudent = Math.ceil((basePerStudent * (1 + markup / 100)) / 1000) * 1000
  const totalParentBilling = billedPerStudent * students
  const marginAmount = totalParentBilling - vendorTotal

  const money = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
  const number = (setter: (value: number) => void) => (event: React.ChangeEvent<HTMLInputElement>) => setter(Math.max(0, Number(event.target.value)))

  return <section className="costing-page">
    <div className="costing-heading">
      <div><div className="eyebrow"><ReceiptText size={14}/> VENDOR COSTING</div><h1>Extracurricular cost calculator</h1><p>Hitung biaya vendor dan tagihan tahunan per murid dengan satu skema yang jelas.</p></div>
      <span className="draft-badge">Live calculation</span>
    </div>

    <div className="costing-layout">
      <div className="costing-form">
        <section className="panel form-section">
          <div className="section-number">01</div><div className="section-copy"><h2>Informasi program</h2><p>Identitas vendor dan kegiatan extracurricular.</p></div>
          <div className="form-grid">
            <label><span>Nama vendor</span><input value={vendor} onChange={e => setVendor(e.target.value)} placeholder="Contoh: Little Kickers" /></label>
            <label><span>Jenis extracurricular</span><input value={activity} onChange={e => setActivity(e.target.value)} placeholder="Contoh: Futsal" /></label>
          </div>
        </section>

        <section className="panel form-section">
          <div className="section-number">02</div><div className="section-copy"><h2>Skema biaya vendor</h2><p>Pilih cara vendor mengenakan biaya.</p></div>
          <div className="pricing-options">
            <button className={model === 'child_month' ? 'selected' : ''} onClick={() => setModel('child_month')}><span>Per anak</span><small>Harga per anak setiap bulan</small></button>
            <button className={model === 'session' ? 'selected' : ''} onClick={() => setModel('session')}><span>Per sesi</span><small>Satu harga untuk satu sesi</small></button>
            <button className={model === 'session_child' ? 'selected' : ''} onClick={() => setModel('session_child')}><span>Per sesi / anak</span><small>Harga per anak di setiap sesi</small></button>
          </div>
          <div className="form-grid compact">
            <label><span>Harga vendor</span><div className="money-input"><b>Rp</b><input type="number" min="0" value={price} onChange={number(setPrice)} /></div><small>{model === 'child_month' ? 'per anak per bulan' : model === 'session' ? 'per sesi' : 'per sesi per anak'}</small></label>
            <label><span>Jumlah murid</span><input type="number" min="1" value={students} onChange={number(setStudents)} /><small>murid yang mengikuti program</small></label>
          </div>
        </section>

        <section className="panel form-section">
          <div className="section-number">03</div><div className="section-copy"><h2>Kalender kegiatan</h2><p>Pilih periode dan hari kegiatan. Hari libur dari Academic Calendar otomatis dikeluarkan.</p></div>
          <div className="form-grid">
            <label><span>Mulai program</span><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
            <label><span>Selesai program</span><input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} /></label>
          </div>
          <div className="activity-days"><span>Hari pelaksanaan</span><div>{[['Min',0],['Sen',1],['Sel',2],['Rab',3],['Kam',4],['Jum',5],['Sab',6]].map(([label,value]) => <button key={value} className={selectedDays.includes(value as number) ? 'active' : ''} onClick={() => setSelectedDays(current => current.includes(value as number) ? current.filter(day => day !== value) : [...current, value as number])}>{label}</button>)}</div><small>Pilih lebih dari satu bila kegiatan berjalan beberapa kali seminggu.</small></div>
          <div className="session-formula detailed"><span><CalendarDays size={17}/> Possible effective sessions</span><strong>{annualSessions} sesi</strong><small>{extracurricularDates.possible.length} tanggal terjadwal − {extracurricularDates.blocked.length} tanggal libur = {annualSessions} sesi efektif</small></div>
          {extracurricularDates.blocked.length > 0 && <div className="holiday-impact"><div className="impact-title"><span>Impact hari libur</span><b>−{extracurricularDates.blocked.length} sesi</b></div>{extracurricularDates.blocked.map(({date,event}) => <div className="impact-row" key={date}><span>{new Intl.DateTimeFormat('id-ID',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(new Date(`${date}T12:00:00`))}</span><strong>{event?.name}</strong><em>{event?.type === 'collective' ? 'Cuti bersama' : event?.type === 'school' ? 'Libur sekolah' : 'Libur nasional'}</em></div>)}</div>}
        </section>

        <section className="panel form-section margin-section">
          <div className="section-number">04</div><div className="section-copy"><h2>Markup operasional</h2><p>Tambahkan buffer untuk administrasi, pajak, atau sesi pengganti.</p></div>
          <label className="markup-field"><span>Markup</span><div><input type="number" min="0" value={markup} onChange={number(setMarkup)} /><b>%</b></div></label>
        </section>
      </div>

      <aside className="result-card">
        <div className="result-top"><span>ESTIMASI TAGIHAN</span><small>{activity || 'Nama kegiatan'} · {vendor || 'Nama vendor'}</small></div>
        <div className="result-main"><span>Tagihan tahunan / murid</span><strong>{money(billedPerStudent)}</strong><small>atau {money(billedPerStudent / 12)} per bulan kalender</small></div>
        <div className="result-breakdown">
          <div><span>Total sesi tahunan</span><b>{annualSessions} sesi</b></div>
          <div><span>Total bayar ke vendor</span><b>{money(vendorTotal)}</b></div>
          <div><span>Biaya dasar / murid</span><b>{money(basePerStudent)}</b></div>
          <div><span>Markup ({markup}%)</span><b>{money(marginAmount)}</b></div>
        </div>
        <div className="result-total"><span>Total tagihan ke orang tua</span><strong>{money(totalParentBilling)}</strong><small>{students} murid × {money(billedPerStudent)}</small></div>
        <div className="result-note"><CheckCircle2 size={16}/><p>Nilai per murid dibulatkan ke atas ke ribuan rupiah terdekat.</p></div>
      </aside>
    </div>
  </section>
}

function ModulePlaceholder({ active, onBack }: { active: NavItem, onBack: () => void }) {
  const copy = { Students: ['Student tracker', 'Monitor progress, attendance, and student support in one place.', Users], Schedule: ['Schedule', 'Organize classes, check-ins, and academic events.', CalendarDays], Tasks: ['Task board', 'Keep every academic operation moving on time.', ListChecks], Today: ['', '', LayoutDashboard], 'Academic Calendar': ['', '', CalendarRange], Extracurricular: ['', '', Calculator] }[active]
  const Icon = copy[2] as typeof Users
  return <section className="module-page"><button className="back-link" onClick={onBack}>← Back to overview</button><div className="module-hero"><div className="module-icon"><Icon size={25}/></div><div><span>ACADEMIC OPS</span><h1>{copy[0] as string}</h1><p>{copy[1] as string}</p></div></div><div className="empty-state"><div><Clock3 size={28}/></div><h2>This workspace is ready to build</h2><p>The main framework is in place. This module can now be shaped around your exact daily workflow.</p><button className="primary-button" onClick={onBack}>Return to dashboard</button></div></section>
}

export default App
