import { Button, DetailRow, Icon } from './ui'
import { fmt } from '../utils/helpers'

export default function VisitorConfirmation({ form, onBack, onSubmit, busy }) {
  return (
    <div>
      <h2 className="mb-1 text-[22px] font-bold" style={{ margin: '0 0 4px' }}>Review your details</h2>
      <p style={{ margin: '0 0 18px', color: 'var(--mut)', fontSize: 14 }}>Please check everything before submitting.</p>
      <div className="sum">
        <DetailRow icon="user" k="Full Name" v={form.name} />
        <DetailRow icon="phone" k="Mobile" v={'+91 ' + form.mobile} />
        <DetailRow icon="users" k="Visitors" v={form.count} />
        <DetailRow icon="brief" k="Meeting" v={form.meet} />
        <DetailRow icon="cal" k="Visit Time" v={fmt(form.when)} />
      </div>
      <div className="btns two">
        <Button kind="ghost" onClick={onBack} disabled={busy}><Icon n="back" />Edit Details</Button>
        <Button onClick={onSubmit} busy={busy} icon="check">Submit Registration</Button>
      </div>
    </div>
  )
}
