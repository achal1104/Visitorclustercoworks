import { useState } from 'react'
import { Field, Button, Err, Icon } from './ui'
import { validate, nowLocal, EMPLOYEES } from '../utils/helpers'

export default function VisitorRegistration({ form, setForm, onNext }) {
  const [err, setErr] = useState({})
  const [tried, setTried] = useState(false)
  const set = (k, v) => { const nf = { ...form, [k]: v }; setForm(nf); if (tried) setErr(validate(nf)) }
  const go = (e) => { e.preventDefault(); setTried(true); const v = validate(form); setErr(v); if (!Object.keys(v).length) onNext() }

  return (
    <form onSubmit={go} noValidate>
      <Field id="name" label="Full Name" icon="user" placeholder="e.g. Rahul Sharma" value={form.name} error={err.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
      <Field id="mobile" label="Mobile Number" icon="phone" prefix="+91" inputMode="numeric" placeholder="10-digit number" maxLength={10} value={form.mobile} error={err.mobile} onChange={(e) => set('mobile', e.target.value.replace(/\D/g, ''))} autoComplete="tel-national" />
      <div className="fld">
        <label>Number of Visitors <em>*</em></label>
        <div className="stp">
          <button type="button" aria-label="Decrease" disabled={form.count <= 1} onClick={() => set('count', form.count - 1)}><Icon n="minus" /></button>
          <span>{form.count}</span>
          <button type="button" aria-label="Increase" disabled={form.count >= 50} onClick={() => set('count', form.count + 1)}><Icon n="plus" /></button>
        </div>
        <Err m={err.count} />
      </div>
      <Field id="meet" label="Whom Do You Want to Meet?" icon="brief" placeholder="Type a name or pick from the list" list="emp" value={form.meet} error={err.meet} onChange={(e) => set('meet', e.target.value)} />
      <datalist id="emp">{EMPLOYEES.map((x) => <option key={x} value={x} />)}</datalist>
      <Field id="when" label="Visit Date & Time" icon="cal" type="datetime-local" min={nowLocal()} value={form.when} error={err.when} onChange={(e) => set('when', e.target.value)} />
      <div className="fld">
        <label className={'chk' + (err.agree ? ' bad' : '')}>
          <input type="checkbox" checked={form.agree} onChange={(e) => set('agree', e.target.checked)} />
          <span className="box">{form.agree && <Icon n="check" s={14} />}</span>
          <span>I confirm that the information provided above is correct and agree to the visitor registration policy.</span>
        </label>
        <Err m={err.agree} />
      </div>
      <Button type="submit" icon="arrow">Agree &amp; Continue</Button>
      <div className="note"><Icon n="shield" /><span>Demo mode: details are kept in your browser session only and are not saved permanently.</span></div>
    </form>
  )
}
