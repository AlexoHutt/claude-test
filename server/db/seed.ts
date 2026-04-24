import { useDb } from './index'
import { scenes } from './schema'
import type { Scene } from '~/stores/game'
import rawScenes from '../../app/data/scenes.json'

export function seedIfEmpty() {
  const db = useDb()
  const existing = db.select().from(scenes).limit(1).all()
  if (existing.length > 0) return

  const rows = Object.values(rawScenes as Record<string, Scene>).map((scene) => ({
    id:      scene.id,
    text:    scene.text,
    choices: JSON.stringify(scene.choices),
  }))

  if (rows.length > 0) {
    db.insert(scenes).values(rows).run()
  }
}
