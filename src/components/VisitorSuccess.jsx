import { useRef, useState } from 'react'
import QRCodeBox from './QRCodeBox'
import VisitorPass from './VisitorPass'
import { Icon, Button, DetailRow } from './ui'
import { fmt, qrPayload } from '../utils/helpers'
import { buildPassImage } from '../utils/passImage'

export default function VisitorSuccess({ d, onReset }) {
  const canvasRef = useRef(null)
  const [pass, setPass] = useState(false)
  const value = qrPayload(d)
  const download = () => {
    const a = document.createElement('a')
    a.href = buildPassImage(d, canvasRef.current, fmt(d.when)); a.download = d.id + '.png'; a.click()
  }
  return (
    <div className="ctr">
      <div className="ok"><Icon n="check" s={40} /></div>
      <h2>Registration Successful!</h2>
      <p style={{ margin: 0, color: 'var(--mut)' }}>Show this QR code at reception.</p>
      <div className="rid">{d.id}</div>
      <div><QRCodeBox value={value} canvasRef={canvasRef} /></div>
      <div className="sum" style={{ textAlign: 'left', marginTop: 24 }}>
        <DetailRow icon="user" k="Visitor" v={`${d.name} (${d.count})`} />
        <DetailRow icon="brief" k="Meeting" v={d.meet} />
        <DetailRow icon="cal" k="Visit Time" v={fmt(d.when)} />
      </div>
      <div className="btns">
        <Button icon="dl" onClick={download}>Download QR Pass</Button>
        <Button kind="dark" icon="print" onClick={() => setPass(true)}>Print Visitor Pass</Button>
        <Button kind="ghost" icon="rot" onClick={onReset}>Register Another Visitor</Button>
      </div>
      <div className="note" style={{ textAlign: 'left' }}><Icon n="shield" /><span>For privacy, the QR holds no mobile number. In production, encode only the registration ID and verify details via your backend.</span></div>
      {pass && <VisitorPass d={d} qrValue={value} onClose={() => setPass(false)} />}
    </div>
  )
}