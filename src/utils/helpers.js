export const EMPLOYEES = ['Reception Desk','Community Manager','Admin Team','Sales Team','Accounts Team','Amit Patil','Priya Deshmukh','Rohan Kulkarni']
export const EMPTY_FORM = { name:'', mobile:'', count:1, meet:'', when:'', agree:false }

export const genId = () =>
  `VIS-${new Date().getFullYear()}-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random().toString(36).slice(2,5).toUpperCase()}`

export const fmt = (v) => new Date(v).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})

export const nowLocal = () => { const d=new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,16) }

// Compact payload keeps the QR small (fewer modules = easy to scan). Mobile number is deliberately NOT encoded.
// Keys: id=registrationId, n=name, c=visitorCount, m=personToMeet, t=visitDateTime
export const qrPayload = (d) => JSON.stringify({ id:d.id, n:d.name, c:d.count, m:d.meet, t:d.when })

export const validate = (f) => {
  const e = {}
  if (!f.name.trim()) e.name = 'Please enter your full name.'
  if (!/^\d{10}$/.test(f.mobile)) e.mobile = 'Mobile number must be exactly 10 digits.'
  else if (!/^[6-9]/.test(f.mobile)) e.mobile = 'Indian mobile numbers start with 6, 7, 8 or 9.'
  if (!(f.count >= 1)) e.count = 'At least 1 visitor is required.'
  if (!f.meet.trim()) e.meet = 'Please tell us whom you want to meet.'
  if (!f.when || isNaN(new Date(f.when))) e.when = 'Please select a visit date and time.'
  else if (new Date(f.when) < new Date(Date.now()-5*60000)) e.when = 'Visit time cannot be in the past.'
  if (!f.agree) e.agree = 'You must accept the policy to continue.'
  return e
}