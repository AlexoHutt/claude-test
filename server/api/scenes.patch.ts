import { sql, notInArray } from 'drizzle-orm'
import { useDb } from '../db/index'
import { scenes, nodePositions } from '../db/schema'
import type { Scene } from '~/stores/game'

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, Scene>>(event)
  const db = useDb()

  const rows = Object.values(body).map((scene) => ({
    id:      scene.id,
    title:   scene.title,
    text:    scene.text,
    choices: JSON.stringify(scene.choices),
  }))

  if (rows.length > 0) {
    db.insert(scenes)
      .values(rows)
      .onConflictDoUpdate({
        target: scenes.id,
        set: {
          title:   sql`excluded.title`,
          text:    sql`excluded.text`,
          choices: sql`excluded.choices`,
        },
      })
      .run()
  }

  const incomingIds = Object.keys(body)
  if (incomingIds.length > 0) {
    db.delete(scenes).where(notInArray(scenes.id, incomingIds)).run()
    db.delete(nodePositions).where(notInArray(nodePositions.sceneId, incomingIds)).run()
  } else {
    db.delete(scenes).run()
    db.delete(nodePositions).run()
  }

  return { ok: true }
})
