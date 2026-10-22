import { genId } from '../utils/helpers'
// Frontend-only stub. Swap the body for your Spring Boot / Node.js endpoint:
//   const res = await fetch('/api/visitors', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
//   return await res.json()   // { id, ... }
export async function registerVisitor(form) {
  await new Promise((r) => setTimeout(r, 900))
  return { ...form, id: genId() }
}
