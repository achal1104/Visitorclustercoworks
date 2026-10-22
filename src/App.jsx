import { useState } from 'react'
import VisitorRegistration from './components/VisitorRegistration'
import VisitorConfirmation from './components/VisitorConfirmation'
import VisitorSuccess from './components/VisitorSuccess'
import { Logo } from './components/ui'
import { registerVisitor } from './services/visitorApi'
import { EMPTY_FORM } from './utils/helpers'

const TITLES = [['Visitor Registration','Welcome! Please fill in your details to get your visitor pass.'],['Confirm Details','One last look before we generate your pass.'],['All Set','Your visitor pass is ready.']]

export default function App() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY_FORM)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)

  const submit = async () => {
    if (busy) return
    setBusy(true)
    try { setDone(await registerVisitor(form)); setStep(3) } finally { setBusy(false) }
  }
  const reset = () => { setForm(EMPTY_FORM); setDone(null); setStep(1) }
  const [title, sub] = TITLES[step - 1]

  return (
    <div className="wrap">
      <div className="brand"><Logo /><div><b>Clusterr Co-Works</b><span>Visitor Management System</span></div></div>
      <div className="card">
        <div className="hd"><h1>{title}</h1><p>{sub}</p>
          <div className="steps">{[1,2,3].map((i) => <i key={i} className={i <= step ? 'on' : ''} />)}</div></div>
        <div className="bd" key={step}>
          {step === 1 && <VisitorRegistration form={form} setForm={setForm} onNext={() => setStep(2)} />}
          {step === 2 && <VisitorConfirmation form={form} busy={busy} onBack={() => setStep(1)} onSubmit={submit} />}
          {step === 3 && <VisitorSuccess d={done} onReset={reset} />}
        </div>
      </div>
      <div className="foot">© 2026 Clusterr Co-Works · Narhe, Pune</div>
    </div>
  )
}
