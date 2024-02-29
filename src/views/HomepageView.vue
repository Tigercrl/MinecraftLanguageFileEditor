<script setup>
import {
  clearFile,
  editor,
  importOriginalFile,
  importTranslatedFile,
  originalFileName,
  originalFileContent,
  translatedFileName
} from "../main.js";
import {onMounted, ref} from "vue";

const originalFileInput = ref();
const translatedFileInput = ref();
const editorButton = ref();

function checkEditor() {
  if (originalFileContent === undefined)
    editorButton.value.classList.add("button-disabled");
  else
    editorButton.value.classList.remove("button-disabled");
  originalFileInput.value.innerText = originalFileName === undefined ? "导入原始文件" : originalFileName;
  translatedFileInput.value.innerText = translatedFileName === undefined ? "导入已翻译文件（可选）" : translatedFileName;
}

onMounted(() => {
  checkEditor();
})
</script>

<template>
  <div class="container">
    <div class="logo">
      <img src="/img/icon.png" alt="">
      <h1>Minecraft Language File Editor</h1>
    </div>
    <button @click="importOriginalFile().then(() => { checkEditor() })" ref="originalFileInput"></button>
    <button @click="importTranslatedFile().then(() => { checkEditor() })" ref="translatedFileInput"></button>
    <button @click="editor()" @contextmenu.prevent.stop="clearFile();checkEditor();" ref="editorButton">
      开始编辑（右键点击清空）
    </button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  opacity: 0;
  animation: 0.5s ease-in-out both fadeInUp;
}

.logo img {
  width: 108px;
  border-radius: 15px;
  box-shadow: var(--shadow-medium);
  margin-right: 10px;
}

.logo h1 {
  color: var(--text-color);
  font-weight: 500;
  font-size: 32px;
}

button {
  width: 250px;
  height: 50px;
  border-radius: 5px;
  box-shadow: var(--shadow-small);
  transition: 0.3s ease-in-out;
  background: var(--primary-color);
  border: none;
  color: var(--text-color-light);
  font-size: 18px;
  opacity: 0;
  animation: 0.5s ease-in-out 0.2s both fadeInUp;
  margin: 10px;
}

button:hover {
  box-shadow: var(--shadow-primary-color);
}

button:active {
  transition: 0.1s ease-in-out;
  transform: scale(0.9);
}

.button-disabled {
  background: var(--border-color-gray);
}

.button-disabled:hover {
  box-shadow: var(--shadow-medium);
}
</style>