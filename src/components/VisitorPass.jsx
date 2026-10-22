import QRCodeBox from './QRCodeBox'
import { Logo, Button } from './ui'
import { fmt } from '../utils/helpers'

export default function VisitorPass({ d, qrValue, onClose }) {
  return (
    <div className="ov" role="dialog" aria-label="Visitor pass">
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div className="pass">
          <div className="ph"><Logo /><div><b>Clusterr Co-Works</b><div style={{ fontSize: 12, color: '#b8c4bb' }}>Narhe, Pune</div></div><em>VISITOR</em></div>
          <div className="pb">
            <h3>{d.name}</h3>
            <div style={{ color: '#5c665f', fontSize: 13, margin: '2px 0 14px' }}>{d.id}</div>
            <QRCodeBox value={qrValue} />
            <div className="ds">
              <div><small>Meeting</small><b>{d.meet}</b></div>
              <div><small>Visitors</small><b>{d.count}</b></div>
              <div style={{ gridColumn: '1/-1' }}><small>Visit Time</small><b>{fmt(d.when)}</b></div>
            </div>
            <div style={{ fontSize: 11, color: '#5c665f' }}>Show this pass at reception. Valid for the selected date only.</div>
          </div>
        </div>
        <div className="pa">
          <Button icon="print" onClick={() => window.print()}>Print Pass</Button>
          <Button kind="ghost" style={{ background: '#fff', color: '#0e1411', borderColor: '#fff', fontWeight: 800 }} onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
