import { QRCodeCanvas } from 'qrcode.react'
export default function QRCodeBox({ value, canvasRef }) {
  return (
    <div className="qr">
      <QRCodeCanvas ref={canvasRef} value={value} size={420} level="M" bgColor="#ffffff" fgColor="#0e1411" marginSize={0} role="img" aria-label="Visitor QR code" />
    </div>
  )
}
