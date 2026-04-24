<template>
  <div class="bg-amber-900 border border-amber-600 rounded-lg px-2 py-1 flex items-center gap-1 shadow nodrag">
    <input
      :value="data.text"
      class="bg-transparent text-amber-100 text-xs w-full outline-none focus:text-white"
      @blur="onTextBlur"
      @mousedown.stop
    />
    <button
      class="text-amber-500 hover:text-red-400 text-xs leading-none shrink-0 transition-colors"
      title="Delete choice"
      @click.stop="admin.removeChoice(data.sceneId, data.idx)"
    >×</button>
  </div>
  <Handle type="target" :position="Position.Left" />
  <Handle type="source" :position="Position.Right" />
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const props = defineProps<{ data: { text: string; sceneId: string; idx: number } }>()
const admin = useAdminStore()

function onTextBlur(e: FocusEvent) {
  admin.updateChoiceText(props.data.sceneId, props.data.idx, (e.target as HTMLInputElement).value)
}
</script>
