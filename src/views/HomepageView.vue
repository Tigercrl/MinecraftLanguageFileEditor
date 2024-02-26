<script setup>
import {importFile} from "../main.js";
</script>

<template>
  <div class="container">
    <div class="logo">
      <img src="/img/icon.png" alt="">
      <h1>Minecraft Language File Editor</h1>
    </div>
    <button @click="importFile">导入文件</button>
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
  width: 150px;
  height: 40px;
  border-radius: 5px;
  box-shadow: var(--shadow-small);
  transition: 0.3s ease-in-out;
  background: var(--primary-color);
  border: none;
  color: var(--text-color-light);
  font-size: 18px;
  opacity: 0;
  animation: 0.5s ease-in-out 0.2s both fadeInUp;
}

button:hover{
  box-shadow: var(--shadow-primary-color);
}

button:active{
  transition: 0.1s ease-in-out;
  transform: scale(0.9);
}
</style>