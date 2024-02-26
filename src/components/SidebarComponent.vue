<script setup>
import {editedFile, openedFileContent} from "../main.js";

defineProps({
  myKey: {
    type: String,
    required: true
  },
  selectedKey: {
    type: String,
    required: true
  }
});

defineEmits([
  "select"
]);
</script>

<template>
  <div class="component-container" :class="{'component-container-selected': myKey === selectedKey}"
       @click="$emit('select')">
    <p>键：<span class="font-minecraft">{{ myKey }}</span></p>
    <p>原文本：<span class="font-minecraft">{{ openedFileContent[myKey] }}</span></p>
    <p>
      {{ openedFileContent[myKey] === editedFile[myKey] ? "暂未翻译" : "已翻译文本：" }}
      <span class="font-minecraft">{{
          openedFileContent[myKey] === editedFile[myKey] ? "" : editedFile[myKey]
        }}</span>
    </p>
  </div>
</template>

<style scoped>
.component-container {
  border-radius: 5px;
  background-color: var(--main-bg-color);
  border: 1px solid var(--border-color-lightgray);
  padding: 5px;
  margin: 5px;
}

.component-container-selected {
  border: 1px solid var(--border-color-gray);
  background-color: var(--selected-bg-color);
}

p {
  font-size: 14px;
  color: var(--text-color);
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.font-minecraft {
  font-size: 10px;
}
</style>