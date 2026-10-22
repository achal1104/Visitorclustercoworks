import { useEffect, useState } from 'react'
import { Icon, Err } from './ui'

const pad = (n) => String(n).padStart(2, '0')
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DOW = ['Su','Mo','Tu','We','Th','Fr','Sa']
const to24 = (h12, ap) => (h12 % 12) + (ap === 'PM' ? 12 : 0)
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const label = (d, h12, mi, ap) => `${d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · ${h12}:${pad(mi)} ${ap}`
// A slot is "past" if it is earlier than now (5 min grace, same rule as the form validation)
const isPast = (date, h24, mi) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), h24, mi) < new Date(Date.now() - 5 * 60000)

function parse(v) {
  if (!v) return null
  const [d, t = '00:00'] = v.split('T'); const [y, m, da] = d.split('-').map(Number); const [h, mi] = t.split(':').map(Number)
  if (!y || !m || !da || isNaN(h)) return null
  return { date: new Date(y, m - 1, da), h12: h % 12 || 12, mi, ap: h >= 12 ? 'PM' : 'AM' }
}

// Move the chosen time forward to the next valid 5-min slot if the day is today and the time already passed
function clampTime(date, h12, mi, ap) {
  if (!date || !isPast(date, to24(h12, ap), mi)) return { h12, mi, ap }
  const n = new Date(Date.now() + 5 * 60000); n.setMinutes(Math.ceil(n.getMinutes() / 5) * 5, 0, 0)
  return { h12: n.getHours() % 12 || 12, mi: n.getMinutes(), ap: n.getHours() >= 12 ? 'PM' : 'AM' }
}

function Sheet({ value, onClose, onPick }) {
  const init = parse(value)
  const today = startOfDay(new Date())
  const [date, setDate] = useState(init?.date || null)
  const [view, setView] = useState(init?.date ? new Date(init.date.getFullYear(), init.date.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1))
  const [t, setT] = useState(init ? { h12: init.h12, mi: init.mi, ap: init.ap } : { h12: 10, mi: 0, ap: 'AM' })

  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k); const o = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = o }
  }, [onClose])

  const chooseDate = (d) => { setDate(d); setView(new Date(d.getFullYear(), d.getMonth(), 1)); setT((x) => clampTime(d, x.h12, x.mi, x.ap)) }
  const setTime = (patch) => setT((x) => { const n = { ...x, ...patch }; return clampTime(date, n.h12, n.mi, n.ap) })

  const first = new Date(view.getFullYear(), view.getMonth(), 1)
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const cells = [...Array(first.getDay()).fill(null), ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))]
  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1)
  const h24 = to24(t.h12, t.ap)
  const hourOff = (h12) => !!date && sameDay(date, today) && [...Array(12).keys()].every((k) => isPast(date, to24(h12, t.ap), k * 5))
  const minOff = (m) => !!date && isPast(date, h24, m)
  const apOff = (ap) => !!date && sameDay(date, today) && [...Array(12).keys()].every((h) => [...Array(12).keys()].every((k) => isPast(date, to24(h || 12, ap), k * 5)))
  const ok = !!date && !isPast(date, h24, t.mi)
  const confirm = () => ok && onPick(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(h24)}:${pad(t.mi)}`)

  return (
    <div className="dtp-ov" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dtp" role="dialog" aria-modal="true" aria-label="Select visit date and time">
        <div className="dtp-h">
          <div><small>Visit schedule</small><b>{date ? label(date, t.h12, t.mi, t.ap) : 'Pick a date and time'}</b></div>
          <button type="button" className="dtp-x" aria-label="Close" onClick={onClose}><Icon n="x" /></button>
        </div>
        <div className="dtp-b">
          <div className="dtp-q">
            <button type="button" className={date && sameDay(date, today) ? 'on' : ''} onClick={() => chooseDate(today)}>Today</button>
            <button type="button" className={date && sameDay(date, addDays(today, 1)) ? 'on' : ''} onClick={() => chooseDate(addDays(today, 1))}>Tomorrow</button>
          </div>
          <div className="dtp-cal">
            <div className="dtp-mh">
              <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}><Icon n="left" /></button>
              <b>{MONTHS[view.getMonth()]} {view.getFullYear()}</b>
              <button type="button" aria-label="Next month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}><Icon n="right" /></button>
            </div>
            <div className="dtp-g dtp-dow">{DOW.map((d) => <span key={d}>{d}</span>)}</div>
            <div className="dtp-g">
              {cells.map((d, i) => d ? (
                <button type="button" key={i} disabled={d < today} className={(date && sameDay(d, date) ? 'sel ' : '') + (sameDay(d, today) ? 'tod' : '')} onClick={() => chooseDate(d)} aria-label={d.toDateString()}>{d.getDate()}</button>
              ) : <i key={i} />)}
            </div>
          </div>
          <div className="dtp-t">
            <div className="dtp-th"><Icon n="clock" s={16} /><b>Time</b>
              <div className="dtp-ap" role="group" aria-label="AM or PM">
                {['AM', 'PM'].map((ap) => <button type="button" key={ap} disabled={apOff(ap)} className={t.ap === ap ? 'on' : ''} onClick={() => setTime({ ap })}>{ap}</button>)}
              </div>
            </div>
            <small>Hour</small>
            <div className="dtp-chips">{[...Array(12)].map((_, i) => { const h = i + 1; return <button type="button" key={h} disabled={hourOff(h)} className={t.h12 === h ? 'on' : ''} onClick={() => setTime({ h12: h })}>{h}</button> })}</div>
            <small>Minute</small>
            <div className="dtp-chips">{[...Array(12)].map((_, i) => { const m = i * 5; return <button type="button" key={m} disabled={minOff(m)} className={t.mi === m ? 'on' : ''} onClick={() => setTime({ mi: m })}>{pad(m)}</button> })}</div>
          </div>
        </div>
        <div className="dtp-f">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="btn" disabled={!ok} onClick={confirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default function DateTimeField({ id = 'when', label: lbl = 'Visit Date & Time', value, error, onChange }) {
  const [open, setOpen] = useState(false)
  const p = parse(value)
  return (
    <div className="fld">
      <label htmlFor={id}>{lbl} <em>*</em></label>
      <button type="button" id={id} className={'dtp-trg' + (error ? ' bad' : '')} aria-haspopup="dialog" aria-invalid={!!error} onClick={() => setOpen(true)}>
        <Icon n="cal" />
        <span className={p ? '' : 'ph'}>{p ? label(p.date, p.h12, p.mi, p.ap) : 'Select date & time'}</span>
        <Icon n="right" s={16} />
      </button>
      <Err m={error} />
      {open && <Sheet value={value} onClose={() => setOpen(false)} onPick={(v) => { onChange(v); setOpen(false) }} />}
    </div>
  )
}