// Builds a downloadable "visitor pass" PNG: framed QR with quiet zone, name, ID and visit details.
const INK = '#0e1411', LIME = '#c5f23a', MUT = '#5c665f', LINE = '#e2e7df', BG = '#f4f6f1'
const SANS = "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const MONO = "ui-monospace,Menlo,Consolas,monospace"

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}
function fit(ctx, text, max) {
  let t = String(text ?? '')
  if (ctx.measureText(t).width <= max) return t
  while (t.length > 1 && ctx.measureText(t + '…').width > max) t = t.slice(0, -1)
  return t + '…'
}

export function buildPassImage(d, qrCanvas, whenText) {
  const W = 900, M = 40, CW = W - M * 2, CX = M
  const HEAD = 220, QR = 540, PAD = 40, FRAME = QR + PAD * 2
  const ROW = 104, rows = [['Visitors', String(d.count)], ['Meeting', d.meet], ['Visit Time', whenText]]
  const nameY = HEAD + 96, idY = nameY + 46, frameY = idY + 86
  const detY = frameY + FRAME + 56, footY = detY + ROW * rows.length + 62
  const H = footY + 70 + M

  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d'); ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H)

  // card
  const cardH = H - M * 2
  ctx.save(); rr(ctx, CX, M, CW, cardH, 44); ctx.fillStyle = '#fff'; ctx.fill(); ctx.clip()
  // header
  ctx.fillStyle = INK; ctx.fillRect(CX, M, CW, HEAD)
  ctx.globalAlpha = .92; ctx.fillStyle = LIME; ctx.beginPath(); ctx.arc(CX + CW - 30, M - 10, 130, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
  ctx.fillStyle = '#1b241e'; rr(ctx, CX + 48, M + 44, 88, 88, 26); ctx.fill()
  ctx.fillStyle = LIME; ctx.font = `800 38px ${SANS}`; ctx.textAlign = 'center'; ctx.fillText('CC', CX + 92, M + 101)
  ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = `700 38px ${SANS}`; ctx.fillText('Clusterr Co-Works', CX + 158, M + 85)
  ctx.fillStyle = '#b8c4bb'; ctx.font = `400 25px ${SANS}`; ctx.fillText('Narhe, Pune', CX + 158, M + 122)
  ctx.fillStyle = LIME; rr(ctx, CX + 48, M + 154, 210, 44, 22); ctx.fill()
  ctx.fillStyle = INK; ctx.font = `800 22px ${SANS}`; ctx.textAlign = 'center'; ctx.fillText('VISITOR PASS', CX + 153, M + 184)
  ctx.restore()

  // name + id
  ctx.textAlign = 'center'; ctx.fillStyle = INK; ctx.font = `800 54px ${SANS}`
  ctx.fillText(fit(ctx, d.name, CW - 96), W / 2, M + nameY)
  ctx.font = `700 28px ${MONO}`; const idw = ctx.measureText(d.id).width + 56
  ctx.fillStyle = INK; rr(ctx, W / 2 - idw / 2, M + idY, idw, 52, 26); ctx.fill()
  ctx.fillStyle = LIME; ctx.fillText(d.id, W / 2, M + idY + 36)

  // QR frame with lime offset shadow, white quiet zone
  const fx = W / 2 - FRAME / 2, fy = M + frameY
  ctx.fillStyle = LIME; rr(ctx, fx + 12, fy + 12, FRAME, FRAME, 40); ctx.fill()
  ctx.fillStyle = '#fff'; rr(ctx, fx, fy, FRAME, FRAME, 40); ctx.fill()
  ctx.lineWidth = 6; ctx.strokeStyle = INK; rr(ctx, fx + 3, fy + 3, FRAME - 6, FRAME - 6, 38); ctx.stroke()
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(qrCanvas, fx + PAD, fy + PAD, QR, QR)

  // details table
  const dx = CX + 48, dw = CW - 96, dy = M + detY
  ctx.lineWidth = 2; ctx.strokeStyle = LINE; rr(ctx, dx, dy, dw, ROW * rows.length, 28); ctx.stroke()
  rows.forEach(([k, v], i) => {
    const y = dy + i * ROW
    if (i) { ctx.beginPath(); ctx.moveTo(dx, y); ctx.lineTo(dx + dw, y); ctx.stroke() }
    ctx.textAlign = 'left'; ctx.fillStyle = MUT; ctx.font = `500 24px ${SANS}`; ctx.fillText(k, dx + 36, y + 42)
    ctx.fillStyle = INK; ctx.font = `700 32px ${SANS}`; ctx.fillText(fit(ctx, v, dw - 72), dx + 36, y + 82)
  })

  ctx.textAlign = 'center'; ctx.fillStyle = MUT; ctx.font = `400 23px ${SANS}`
  ctx.fillText('Show this pass at reception. Valid for the selected date only.', W / 2, M + footY)

  // outer outline
  ctx.lineWidth = 6; ctx.strokeStyle = INK; rr(ctx, CX + 3, M + 3, CW - 6, cardH - 6, 42); ctx.stroke()
  return c.toDataURL('image/png')
}