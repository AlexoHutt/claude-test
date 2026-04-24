<template>
  <div class="bg-gray-800 border border-gray-600 rounded-lg p-2 flex flex-col gap-1 shadow-lg nodrag">
    <input
      :value="data.id"
      class="bg-transparent text-amber-400 font-mono text-xs font-bold w-full outline-none border-b border-gray-700 pb-1 focus:border-amber-500"
      readonly
      title="Scene ID"
    />
    <textarea
      :value="data.text"
      rows="3"
      class="bg-transparent text-gray-200 text-xs w-full outline-none resize-none focus:text-white"
      @blur="onTextBlur"
      @mousedown.stop
    />
  </div>
  <Handle type="target" :position="Position.Left" />
  <Handle type="source" :position="Position.Right" />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { Handle, Position } from '@vue-flow/core'

const props = defineProps<{ data: { id: string; text: string } }>()
const admin = useAdminStore()

function onTextBlur(e: FocusEvent) {
  admin.updateSceneText(props.data.id, (e.target as HTMLTextAreaElement).value)
}
</script>
