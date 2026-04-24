import { writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = resolve(process.cwd(), 'app/data/scenes.json')
  writeFileSync(filePath, JSON.stringify(body, null, 2))
  return { ok: true }
})
