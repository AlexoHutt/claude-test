import { computed } from 'vue'
import type { Node, Edge } from '@vue-flow/core'

const SCENE_W = 220
const SCENE_H = 110
const CHOICE_W = 170
const CHOICE_H = 56
const COL_GAP = 380
const ROW_GAP = 200

export function useAdminGraph() {
  const admin = useAdminStore()

  const nodes = computed<Node[]>(() => {
    const { scenePos } = buildLayout(admin.scenes)
    const result: Node[] = []

    for (const [id, scene] of Object.entries(admin.scenes)) {
      const pos = scenePos[id] ?? { x: 0, y: 0 }

      result.push({
        id: `scene:${id}`,
        type: 'sceneNode',
        position: { x: pos.x, y: pos.y },
        data: { id, text: scene.text },
        style: { width: `${SCENE_W}px`, minHeight: `${SCENE_H}px` },
      })

      scene.choices.forEach((choice, idx) => {
        const targetPos = scenePos[choice.nextScene]
        const px = pos.x
        const py = pos.y
        const tx = targetPos?.x ?? px + COL_GAP
        const ty = targetPos?.y ?? py

        const cx = px + (tx - px) * 0.55 - CHOICE_W / 2
        const cy = py + (ty - py) * 0.5 + (idx - (scene.choices.length - 1) / 2) * (CHOICE_H + 10)

        result.push({
          id: `choice:${id}:${idx}`,
          type: 'choiceNode',
          position: { x: cx, y: cy },
          data: { text: choice.text, sceneId: id, idx },
          style: { width: `${CHOICE_W}px`, height: `${CHOICE_H}px` },
        })
      })
    }

    return result
  })

  const edges = computed<Edge[]>(() => {
    const result: Edge[] = []

    for (const [id, scene] of Object.entries(admin.scenes)) {
      scene.choices.forEach((choice, idx) => {
        const choiceId = `choice:${id}:${idx}`

        result.push({
          id: `e-scene:${id}-${choiceId}`,
          source: `scene:${id}`,
          target: choiceId,
          type: 'smoothstep',
        })

        if (choice.nextScene && admin.scenes[choice.nextScene]) {
          result.push({
            id: `e-${choiceId}-scene:${choice.nextScene}`,
            source: choiceId,
            target: `scene:${choice.nextScene}`,
            type: 'smoothstep',
          })
        }
      })
    }

    return result
  })

  return { nodes, edges }
}

function buildLayout(scenes: Record<string, { choices: { nextScene: string }[] }>) {
  const depth: Record<string, number> = {}
  const queue = ['start']
  depth['start'] = 0

  while (queue.length > 0) {
    const id = queue.shift()!
    const scene = scenes[id]
    if (!scene) continue
    for (const choice of scene.choices) {
      if (choice.nextScene && !(choice.nextScene in depth)) {
        depth[choice.nextScene] = (depth[id] ?? 0) + 1
        queue.push(choice.nextScene)
      }
    }
  }

  const maxDepth = Math.max(0, ...Object.values(depth))
  for (const id of Object.keys(scenes)) {
    if (!(id in depth)) depth[id] = maxDepth + 1
  }

  const columns: Record<number, string[]> = {}
  for (const id of Object.keys(scenes)) {
    const col = depth[id] ?? 0
    ;(columns[col] ??= []).push(id)
  }

  const scenePos: Record<string, { x: number; y: number }> = {}
  for (const [colStr, ids] of Object.entries(columns)) {
    const col = Number(colStr)
    ids.forEach((id, row) => {
      scenePos[id] = { x: col * COL_GAP, y: row * ROW_GAP }
    })
  }

  return { scenePos }
}
