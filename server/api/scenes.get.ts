import { useDb } from '../db/index'
import { scenes, nodePositions } from '../db/schema'
import { seedIfEmpty } from '../db/seed'
import type { Choice } from '~/stores/game'

export default defineEventHandler(() => {
  seedIfEmpty()
  const db = useDb()

  const sceneRows = db.select().from(scenes).all()
  const posRows   = db.select().from(nodePositions).all()

  const scenesMap: Record<string, { id: string; title: string; text: string; choices: Choice[] }> = {}
  for (const row of sceneRows) {
    scenesMap[row.id] = {
      id:      row.id,
      title:   row.title,
      text:    row.text,
      choices: JSON.parse(row.choices) as Choice[],
    }
  }

  const positionsMap: Record<string, { x: number; y: number }> = {}
  for (const row of posRows) {
    positionsMap[row.sceneId] = { x: row.x, y: row.y }
  }

  return { scenes: scenesMap, positions: positionsMap }
})
