import { User, Phone, Users, Briefcase, CalendarDays, Check, AlertCircle, Plus, Minus, ArrowRight, ArrowLeft, Download, Printer, ShieldCheck, RotateCcw } from 'lucide-react'
const MAP = { user:User, phone:Phone, users:Users, brief:Briefcase, cal:CalendarDays, check:Check, alert:AlertCircle, plus:Plus, minus:Minus, arrow:ArrowRight, back:ArrowLeft, dl:Download, print:Printer, shield:ShieldCheck, rot:RotateCcw }

export const Icon = ({ n, s = 18 }) => { const C = MAP[n]; return <C size={s} aria-hidden="true" /> }
export const Logo = () => <div className="logo">CC</div>
export const Err = ({ m }) => m ? <div className="msg" role="alert"><Icon n="alert" s={14} />{m}</div> : null

export const Field = ({ label, icon, error, prefix, ...p }) => (
  <div className="fld">
    <label htmlFor={p.id}>{label} <em>*</em></label>
    <div className={'inp' + (error ? ' bad' : '') + (prefix ? ' ph' : '')}>
      <Icon n={icon} />{prefix && <span className="pre">{prefix}</span>}
      <input {...p} aria-invalid={!!error} />
    </div>
    <Err m={error} />
  </div>
)

export const Button = ({ kind = '', icon, busy, children, ...p }) => (
  <button className={'btn ' + kind} disabled={busy} {...p}>
    {busy && <span className="sp" />}{children}{icon && !busy && <Icon n={icon} />}
  </button>
)

export const DetailRow = ({ icon, k, v }) => (
  <div><span className="ic"><Icon n={icon} /></span><span><small>{k}</small><b>{v}</b></span></div>
)
