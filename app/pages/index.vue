<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
    <div class="max-w-2xl w-full">
      <h1 class="text-3xl font-bold mb-8 text-amber-400 tracking-wide">Choose Your Adventure</h1>

      <div v-if="scene" class="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
        <p class="text-lg leading-relaxed mb-8 text-gray-200">{{ scene.text }}</p>

        <div class="flex flex-col gap-3">
          <button
            v-for="choice in scene.choices"
            :key="choice.nextScene"
            class="text-left px-5 py-3 rounded-xl bg-gray-800 hover:bg-amber-500 hover:text-gray-950 transition-colors duration-150 font-medium border border-gray-700 hover:border-amber-500"
            @click="handleChoice(choice)"
          >
            {{ choice.text }}
          </button>
        </div>
      </div>

      <div v-else class="text-red-400">Scene "{{ game.currentSceneId }}" not found.</div>

      <div class="mt-6 flex justify-between items-center text-sm text-gray-600">
        <span>Scene: {{ game.currentSceneId }}</span>
        <button class="hover:text-gray-400 transition-colors" @click="game.reset()">Restart</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import scenes from '~/data/scenes.json'
import type { Choice } from '~/stores/game'

const game = useGameStore()

const scene = computed(() => scenes[game.currentSceneId as keyof typeof scenes] ?? null)

function handleChoice(choice: Choice) {
  if (choice.effect) choice.effect(game.$state)
  game.goToScene(choice.nextScene)
}
</script>
