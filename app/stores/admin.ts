import { defineStore } from "pinia";
import type { Scene } from "~/stores/game";
import scenesData from "~/data/scenes.json";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    // scenes: JSON.parse(JSON.stringify(scenesData)) as Record<string, Scene>,
    scenes: structuredClone(scenesData) as Record<string, Scene>,
  }),

  actions: {
    updateSceneText(id: string, text: string) {
      if (this.scenes[id]) this.scenes[id].text = text;
    },

    updateChoiceText(sceneId: string, idx: number, text: string) {
      const choice = this.scenes[sceneId]?.choices[idx];
      if (choice) choice.text = text;
    },

    updateChoiceTarget(sceneId: string, idx: number, nextScene: string) {
      const choice = this.scenes[sceneId]?.choices[idx];
      if (choice) choice.nextScene = nextScene;
    },

    removeChoice(sceneId: string, idx: number) {
      this.scenes[sceneId]?.choices.splice(idx, 1);
    },

    addChoice(sceneId: string) {
      this.scenes[sceneId]?.choices.push({ text: "New choice", nextScene: "" });
    },

    addScene() {
      const id = `scene_${Date.now()}`;
      this.scenes[id] = { id, text: "New scene", choices: [] };
    },

    disconnectChoice(sceneId: string, idx: number) {
      const choice = this.scenes[sceneId]?.choices[idx];
      if (choice) choice.nextScene = "";
    },

    renameScene(oldId: string, newId: string) {
      const trimmed = newId.trim();
      if (!trimmed || trimmed === oldId || this.scenes[trimmed]) return;
      const scene = this.scenes[oldId];
      if (!scene) return;
      scene.id = trimmed;
      this.scenes[trimmed] = scene;
      delete this.scenes[oldId];
      for (const s of Object.values(this.scenes)) {
        for (const choice of s.choices) {
          if (choice.nextScene === oldId) choice.nextScene = trimmed;
        }
      }
    },
  },
});
