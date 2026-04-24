import { useDb } from '../db/index'
import { scenes } from '../db/schema'
import type { Scene } from '~/stores/game'

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, Scene>>(event)
  const db = useDb()

  const rows = Object.values(body).map((scene) => ({
    id:      scene.id,
    text:    scene.text,
    choices: JSON.stringify(scene.choices),
  }))

  if (rows.length > 0) {
    db.insert(scenes)
      .values(rows)
      .onConflictDoUpdate({
        target: scenes.id,
        set: { text: scenes.text, choices: scenes.choices },
      })
      .run()
  }

  return { ok: true }
})
