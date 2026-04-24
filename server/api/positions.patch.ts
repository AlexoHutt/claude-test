import { sql } from 'drizzle-orm'
import { useDb } from '../db/index'
import { nodePositions } from '../db/schema'

interface PositionPayload {
  id: string
  x: number
  y: number
}

export default defineEventHandler(async (event) => {
  const { id, x, y } = await readBody<PositionPayload>(event)
  const db = useDb()

  db.insert(nodePositions)
    .values({ sceneId: id, x, y })
    .onConflictDoUpdate({
      target: nodePositions.sceneId,
      set: { x: sql`excluded.x`, y: sql`excluded.y` },
    })
    .run()

  return { ok: true }
})
