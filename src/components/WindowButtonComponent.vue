<script setup>
import {exit} from '@tauri-apps/api/process'
import {appWindow, getCurrent} from "@tauri-apps/api/window";
import {ref} from "vue";
import {os} from "@tauri-apps/api";

const maximizeButtonIcon = ref();

let style;

async function exitApp() {
  await exit();
}

async function minimizeApp() {
  await getCurrent().minimize();
}

async function maximizeApp() {
  if (await getCurrent().isMaximized()) {
    document.getElementById("app").style.borderRadius = "12px";
    maximizeButtonIcon.value.className = "fas fa-up-right-and-down-left-from-center";
    await getCurrent().unmaximize();
  } else {
    document.getElementById("app").style.borderRadius = "0";
    maximizeButtonIcon.value.className = "fas fa-down-left-and-up-right-to-center";
    await getCurrent().maximize();
  }
}

// MacOS全屏搜索框宽度修复
appWindow.onResized(async () => {
  if (await os.type() === "Darwin") {
    if (style === undefined) {
      style = document.createElement("style");
      document.body.appendChild(style);
    }
    if (await getCurrent().isMaximized()) {
      style.innerHTML = `
      .search {
        width: calc(100% - 10px) !important;
      }
      `;
    } else {
      style.innerHTML = "";
    }
  }
});
</script>

<template>
  <div class="window-buttons">
    <button class="window-button" @click="exitApp"><i class="fas fa-xmark"></i></button>
    <button class="window-button" @click="minimizeApp" id="window-minimize-button"><i class="fas fa-minus"></i></button>
    <button class="window-button" @click="maximizeApp" id="window-maximize-button"><i
        class="fas fa-up-right-and-down-left-from-center" ref="maximizeButtonIcon"></i></button>
  </div>
</template>

<style scoped>
.window-buttons {
  position: fixed;
  top: 5px;
  left: 5px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80px;
}

.window-button {
  width: 24px;
  height: 24px;
  padding: 2px;
  background-color: #fff;
  border: 1px solid #fff;
  font-weight: bold;
  font-size: 12px;
  border-radius: 8px;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(100, 100, 111, 0.2) 0 0 10px 0;
}

.window-button:hover {
  border: 1px solid #ccc;
}
</style>