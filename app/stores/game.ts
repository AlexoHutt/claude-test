import { defineStore } from 'pinia'

export interface Choice {
  text: string
  nextScene: string
  condition?: (state: GameState) => boolean
  effect?: (state: GameState) => void
}

export interface Scene {
  id: string
  text: string
  choices: Choice[]
}

export interface GameState {
  currentSceneId: string
  flags: Record<string, boolean>
  inventory: string[]
  stats: Record<string, number>
  history: string[]
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    currentSceneId: 'start',
    flags: {},
    inventory: [],
    stats: {},
    history: [],
  }),

  actions: {
    goToScene(sceneId: string) {
      this.history.push(this.currentSceneId)
      this.currentSceneId = sceneId
    },

    setFlag(key: string, value: boolean = true) {
      this.flags[key] = value
    },

    addToInventory(item: string) {
      if (!this.inventory.includes(item)) this.inventory.push(item)
    },

    removeFromInventory(item: string) {
      this.inventory = this.inventory.filter((i) => i !== item)
    },

    setStat(key: string, value: number) {
      this.stats[key] = value
    },

    modifyStat(key: string, delta: number) {
      this.stats[key] = (this.stats[key] ?? 0) + delta
    },

    reset() {
      this.currentSceneId = 'start'
      this.flags = {}
      this.inventory = []
      this.stats = {}
      this.history = []
    },
  },

})
