<template>
  <div class="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden flex flex-col shadow-lg min-w-[220px]">
    <div class="drag-handle flex items-center px-2 py-1 bg-gray-700 hover:bg-gray-600 cursor-grab active:cursor-grabbing transition-colors">
      <span class="text-gray-400 text-xs tracking-widest select-none flex-1 text-center">⠿</span>
      <button
        class="text-gray-500 hover:text-red-400 text-xs transition-colors nodrag"
        title="Delete scene"
        @click.stop="admin.deleteScene(data.id)"
        @mousedown.stop
      >✕</button>
    </div>
    <div class="p-2 flex flex-col gap-1">
    <input
      :value="scene?.title ?? data.id"
      class="bg-transparent text-white text-sm font-semibold w-full outline-none border-b border-gray-700 pb-1 focus:border-amber-500 placeholder-gray-500"
      placeholder="Scene title"
      @blur="onTitleBlur"
      @mousedown.stop
    />
    <span class="text-gray-600 font-mono text-[10px] select-all">{{ data.id }}</span>
    <textarea
      ref="textareaRef"
      v-model="localText"
      class="bg-transparent text-gray-200 text-xs w-full outline-none resize-none focus:text-white overflow-hidden"
      @input="autoResize"
      @blur="onTextBlur"
      @mousedown.stop
    />

    <div class="flex flex-col gap-1 mt-1">
      <div
        v-for="(choice, idx) in choices"
        :key="idx"
        class="relative flex items-center gap-1 bg-amber-900 border border-amber-700 rounded px-2 py-1"
      >
        <input
          :value="choice.text"
          class="bg-transparent text-amber-100 text-xs w-full outline-none focus:text-white"
          @blur="onChoiceBlur(idx, $event)"
          @mousedown.stop
        />
        <button
          class="text-amber-500 hover:text-red-400 text-xs shrink-0 transition-colors"
          title="Delete choice"
          @click.stop="admin.removeChoice(data.id, idx)"
        >×</button>
        <Handle
          :id="`choice:${idx}`"
          type="source"
          :position="Position.Right"
          class="!right-[-8px]"
        />
      </div>
    </div>

    <button
      class="mt-1 text-xs text-gray-500 hover:text-amber-400 transition-colors text-left"
      @click.stop="admin.addChoice(data.id)"
      @mousedown.stop
    >
      + Add Choice
    </button>
    </div>
  </div>
  <Handle type="target" :position="Position.Left" />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { Handle, Position } from '@vue-flow/core'

const props = defineProps<{ data: { id: string; text: string } }>()
const admin = useAdminStore()

const scene = computed(() => admin.scenes[props.data.id])
const choices = computed(() => scene.value?.choices ?? [])

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const localText = ref(props.data.text)

watch(() => scene.value?.text, (v) => { if (v !== undefined) localText.value = v })

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = '0'
  el.style.height = el.scrollHeight + 'px'
}

onMounted(autoResize)
watch(localText, () => nextTick(autoResize))

function onTitleBlur(e: FocusEvent) {
  admin.updateSceneTitle(props.data.id, (e.target as HTMLInputElement).value)
}

function onTextBlur() {
  admin.updateSceneText(props.data.id, localText.value)
}

function onChoiceBlur(idx: number, e: FocusEvent) {
  admin.updateChoiceText(props.data.id, idx, (e.target as HTMLInputElement).value)
}
</script>
