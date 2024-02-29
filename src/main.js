import {createApp} from "vue";
import "./assets/css/styles.css";
import App from "./App.vue";
import router from "./router/main.js";
import {invoke, os} from "@tauri-apps/api";
import {confirm, message, open, save} from "@tauri-apps/api/dialog";

export let originalFileName;
export let translatedFileName;
let defaultFileSavingPath;
export let originalFileContent;
export let translatedFileContent;

async function main() {
    if (await os.type() === "Darwin") {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "/src/assets/css/macos.css";
        document.head.appendChild(link);
    }
}

export async function importOriginalFile() {
    const path = await open({
        title: "导入原始语言文件", filters: [{
            name: "MinecraftLanguageFile", extensions: ["json"]
        }]
    });
    if (defaultFileSavingPath === undefined) defaultFileSavingPath = path;
    originalFileName = path.substring(path.lastIndexOf("/") + 1);
    const content = await invoke("read_file", {path: path});
    originalFileContent = JSON.parse(content);
    if (translatedFileContent === undefined) translatedFileContent = JSON.parse(JSON.stringify(originalFileContent));
}

export async function importTranslatedFile() {
    const path = await open({
        title: "导入翻译语言文件", filters: [{
            name: "MinecraftLanguageFile", extensions: ["json"]
        }]
    });
    defaultFileSavingPath = path;
    translatedFileName = path.substring(path.lastIndexOf("/") + 1);
    const content = await invoke("read_file", {path: path});
    translatedFileContent = JSON.parse(content);
}

export async function editor() {
    if (originalFileContent !== undefined) await router.push("/editor");
}

export async function closeFile() {
    if (await confirm("未导出的更改将会丢失，是否确认关闭？", {title: "关闭文件", type: "warning"})) {
        clearFile();
        await router.push("/");
    }
}

export function clearFile() {
    originalFileName = translatedFileName = defaultFileSavingPath = originalFileContent = translatedFileContent = undefined;
}

export async function exportFile() {
    const text = JSON.stringify(translatedFileContent, null, 4);
    const arrayBuffer = new TextEncoder().encode(text);
    const path = await save({
        defaultPath: defaultFileSavingPath, title: "导出语言文件", filters: [{
            name: "MinecraftLanguageFile", extensions: ["json"]
        }]
    });
    await saveFile(path, arrayBuffer, async (progress) => {
        if (progress === 1) {
            await message("文件导出成功", {title: "导出文件", type: "info"});
        }
    })
}

async function saveFile(path, arrayBuffer, progressCallback) {
    await invoke("clear_file", {path: path});
    const chunkSize = 1024 * 1024 * 10;
    const numChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);
    for (let i = 0; i < numChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, arrayBuffer.byteLength);
        const chunk = arrayBuffer.slice(start, end);
        await invoke("append_chunk_to_file", {path: path, chunk: Array.from(new Uint8Array(chunk))});
        const progress = (i + 1) / numChunks;
        progressCallback(progress);
    }
    return true;
}

main().then(null);
const app = createApp(App);
app.use(router);
app.mount("#app");
