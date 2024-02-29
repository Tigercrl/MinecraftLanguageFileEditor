<script setup>
import {
  translatedFileContent,
  originalFileContent
} from "../main.js";
import {getCurrentInstance, onMounted, onRenderTriggered, onUpdated, ref} from "vue";

const errorMessage = ref();
let hasError = false;

const props = defineProps({
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

function error(ctx, message) {
  if (!errorMessage.value.innerText.includes(message)) {
    hasError = true;
    errorMessage.value.innerText += (errorMessage.value.innerText === "" ? "" : "\n") + message;
    if (!ctx.$parent.errorKeys.includes(props.myKey)) {
      ctx.$parent.errorKeys.push(props.myKey);
      ctx.$parent.refreshKeyList();
      ctx.$parent.$forceUpdate();
      ctx.$parent.$forceUpdate();
    }
    ctx.$forceUpdate();
  }
}

let latestMyKey;

function detectError() {
  if (latestMyKey !== props.myKey) {
    latestMyKey = props.myKey;
    const ctx = getCurrentInstance().ctx;
    if (originalFileContent[props.myKey] === undefined) {
      error(ctx, "原文本不包含此键！");
      return;
    }
    if (translatedFileContent[props.myKey] === undefined) {
      error(ctx, "翻译文本不包含此键！");
      return;
    }
    hasError = false;
    errorMessage.value.innerText = "";
    ctx.$forceUpdate();
  }
}

onMounted(detectError);
onUpdated(detectError);
</script>

<template>
  <div class="component-container"
       :class="{'component-container-selected': myKey === selectedKey && !hasError, 'component-container-error': hasError, 'component-container-error-selected': hasError && myKey === selectedKey}"
       @click="$emit('select')">
    <p>键：<span class="font-minecraft">{{ myKey }}</span></p>
    <p>原文本：<span class="font-minecraft">{{ originalFileContent[myKey] }}</span></p>
    <p>
      {{ originalFileContent[myKey] === translatedFileContent[myKey] ? "暂未翻译" : "已翻译文本：" }}
      <span class="font-minecraft">{{
          originalFileContent[myKey] === translatedFileContent[myKey] ? "" : translatedFileContent[myKey]
        }}</span>
    </p>
    <p class="errorMessage" ref="errorMessage"></p>
  </div>
</template>

<style scoped>
.component-container {
  border-radius: 5px;
  background-color: var(--main-bg-color);
  border: 1px solid var(--border-color-lightgray);
  padding: 5px;
  margin: 5px;
  transition: 0.3s ease-in-out;
}

.component-container:hover {
  transform: scale(1.005);
  box-shadow: var(--shadow-small);
}

.component-container:active {
  transition: 0.1s ease-in-out;
  transform: scale(0.95);
}

.component-container-selected {
  border: 1px solid var(--primary-color);
  background-color: var(--selected-bg-color);
}

.component-container-selected:hover {
  border-color: var(--primary-color-dark);
  box-shadow: var(--shadow-primary-color);
}

.component-container-error {
  border-color: var(--error-color);
}

.component-container-error-selected {
  border: 1px solid var(--error-color);
  background-color: var(--error-selected-bg-color);
}

.component-container-error-selected:hover {
  border-color: var(--error-color-dark);
  box-shadow: var(--shadow-error-color);
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