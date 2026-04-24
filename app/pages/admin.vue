<template>
  <div class="h-screen bg-gray-950 text-gray-100 flex flex-col">
    <header class="flex items-center gap-4 px-5 py-3 border-b border-gray-800 shrink-0">
      <NuxtLink to="/" class="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
        ← Back to Game
      </NuxtLink>
      <h1 class="text-lg font-bold">Scene Graph</h1>
      <span class="text-sm text-gray-500 ml-auto">
        {{ sceneCount }} scenes · {{ choiceCount }} choices
      </span>
      <button
        class="px-3 py-1 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
        @click="admin.addScene()"
      >
        + Add Scene
      </button>
      <button
        class="px-3 py-1 text-sm rounded-lg bg-amber-600 hover:bg-amber-500 font-medium transition-colors"
        :disabled="saving"
        @click="save"
      >
        {{ saving ? 'Saving…' : 'Save' }}
      </button>
    </header>

    <div class="flex-1 min-h-0">
      <ClientOnly>
        <VueFlow
          :nodes="nodes"
          :edges="edges"
          :node-types="nodeTypes"
          fit-view-on-init
          :default-viewport="{ zoom: 0.75 }"
          class="w-full h-full"
          @connect="onConnect"
          @edges-change="onEdgesChange"
        >
          <Background />
          <Controls />
          <MiniMap />
        </VueFlow>
        <template #fallback>
          <div class="flex items-center justify-center h-full text-gray-500 text-sm">Loading graph…</div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import type { Connection, EdgeChange, NodeTypesObject } from '@vue-flow/core'
import AdminSceneNode from '~/components/AdminSceneNode.vue'

definePageMeta({ layout: false })

const nodeTypes: NodeTypesObject = {
  sceneNode: markRaw(AdminSceneNode) as NodeTypesObject[string],
}

const admin = useAdminStore()
const { nodes, edges } = useAdminGraph()

const sceneCount = computed(() => Object.keys(admin.scenes).length)
const choiceCount = computed(() =>
  Object.values(admin.scenes).reduce((sum, s) => sum + s.choices.length, 0),
)

function onConnect(connection: Connection) {
  const { source, target, sourceHandle } = connection
  if (!source || !target) return
  const sceneMatch = source.match(/^scene:(.+)$/)
  const handleMatch = sourceHandle?.match(/^choice:(\d+)$/)
  const targetMatch = target.match(/^scene:(.+)$/)
  if (sceneMatch && handleMatch && targetMatch) {
    admin.updateChoiceTarget(sceneMatch[1]!, Number(handleMatch[1]), targetMatch[1]!)
  }
}

function onEdgesChange(changes: EdgeChange[]) {
  for (const change of changes) {
    if (change.type === 'remove') {
      // edge id: e-scene:{sceneId}:{idx}-scene:{targetId}
      const match = change.id.match(/^e-scene:(.+):(\d+)-scene:/)
      if (match) {
        admin.disconnectChoice(match[1]!, Number(match[2]))
      }
    }
  }
}

const saving = ref(false)
async function save() {
  saving.value = true
  try {
    await $fetch('/api/scenes', { method: 'PATCH', body: admin.scenes })
  } finally {
    saving.value = false
  }
}
</script>
