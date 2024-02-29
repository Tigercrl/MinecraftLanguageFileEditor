<script setup>
import {
  closeFile,
  exportFile,
  originalFileContent,
  translatedFileContent
} from "../main.js";
import SidebarComponent from "../components/SidebarComponent.vue";
import {onMounted, ref} from "vue";
import {diffChars} from "diff";

let errorKeys = [];
let keyList = getKeyList();
let selectedKey = keyList[0];
const searchElement = ref();
const diffInfo = ref();

function getKeyList() {
  let tempList = Object.keys(originalFileContent).concat(Object.keys(translatedFileContent));
  tempList = tempList.filter((item, index) => {
    return tempList.indexOf(item) === index && !errorKeys.includes(item);
  });
  return errorKeys.concat(tempList);
}

function refreshKeyList() {
  keyList = getKeyList().filter(item => {
    return item.includes(searchElement.value.value) ||
        (originalFileContent[item] !== undefined && originalFileContent[item].toLowerCase().includes(searchElement.value.value.toLowerCase())) ||
        (translatedFileContent[item] !== undefined && translatedFileContent[item].toLowerCase().includes(searchElement.value.value.toLowerCase()));
  });
}

function updateDiff() {
  diffInfo.value.innerHTML = "";
  diffChars(originalFileContent[selectedKey], translatedFileContent[selectedKey]).forEach((part) => {
    const color = part.added ? 'green' :
        part.removed ? 'red' : 'gray';
    const span = document.createElement('span');
    span.classList.add("diff-color-" + color);
    span.appendChild(document.createTextNode(part.value));
    diffInfo.value.appendChild(span);
  })
}

defineExpose({
  errorKeys,
  refreshKeyList
});

onMounted(() => {
  selectedKey = keyList[0];
});
</script>

<template>
  <div class="container">
    <div class="sidebar">
      <input class="search" type="text" placeholder="搜索" @input="refreshKeyList();$forceUpdate()"
             ref="searchElement"/>
      <div class="translations" ref="translations">
        <SidebarComponent v-for="key of keyList" :my-key="key" :selected-key="selectedKey"
                          @select="selectedKey = key;updateDiff();$forceUpdate()"/>
      </div>
      <div class="buttons">
        <button @click="exportFile">导出文件</button>
        <button @click="closeFile">关闭文件</button>
      </div>
    </div>
    <div class="editor">
      <div class="editor-info">
        <p>键：<span class="font-minecraft">{{ selectedKey }}</span></p>
        <p>原文本：<span class="font-minecraft">{{ originalFileContent[selectedKey] }}</span></p>
        <p>Diff：<span ref="diffInfo" class="font-minecraft"></span></p>
      </div>
      <textarea placeholder="请输入翻译..." :value="translatedFileContent[selectedKey]"
                @input="translatedFileContent[selectedKey] = $event.target.value;updateDiff()"></textarea>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.sidebar {
  width: 18%;
  height: 100%;
  border-right: 1px solid var(--border-color-gray);
  padding: 6px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: 0.5s ease-in-out both fadeInLeft;
}

.search {
  height: 20px;
  align-self: flex-end;
  border-radius: 5px;
  border: 1px solid var(--border-color-gray);
  padding-left: 5px;
  font-size: 12px;
  transition: 0.3s ease-in-out;
  opacity: 0;
  animation: 0.5s ease-in-out 0.4s both fadeInDown;
}

.search:hover {
  border-color: var(--primary-color);
}

.search:focus {
  border-color: var(--primary-color-dark);
}

.translations {
  height: calc(100% - 110px);
  margin: 10px 0;
  overflow-y: auto;
  opacity: 0;
  animation: 0.5s ease-in-out 0.4s both fadeInLeft;
}

.buttons {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.buttons button {
  width: 105px;
  height: 40px;
  border-radius: 5px;
  box-shadow: var(--shadow-small);
  transition: 0.3s ease-in-out;
  background: var(--primary-color);
  border: none;
  color: var(--text-color-light);
  font-size: 18px;
  opacity: 0;
  animation: 0.5s ease-in-out 0.4s both fadeInUp;
  margin: 5px;
}

.buttons button:hover {
  box-shadow: var(--shadow-primary-color);
}

.buttons button:active {
  transition: 0.1s ease-in-out;
  transform: scale(0.9);
}

.editor {
  width: calc(82% - 40px);
  padding: 10px;
}

.editor-info, .editor textarea {
  height: calc(50% - 20px);
  width: calc(100% - 20px);
  margin: 5px;
  padding: 5px;
  font-size: 16px;
}

.editor-info {
  opacity: 0;
  animation: 0.5s ease-in-out both fadeInDown;
}

.editor textarea {
  resize: none;
  border-radius: 10px;
  border: 1px solid var(--border-color-gray);
  color: var(--text-color);
  opacity: 0;
  animation: 0.5s ease-in-out both fadeInUp;
}

.editor textarea:hover {
  border-color: var(--primary-color);
}

.editor textarea:focus {
  border-color: var(--primary-color-dark);
}

.font-minecraft {
  color: var(--text-color-gray);
}
</style>