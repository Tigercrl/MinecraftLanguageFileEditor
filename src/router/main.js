import {createRouter, createWebHistory} from "vue-router";
import HomepageView from "../views/HomepageView.vue";
import EditorView from "../views/EditorView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "homepage",
            component: HomepageView
        },
        {
            path: "/editor",
            name: "editor",
            component: EditorView
        }
    ],
});

export default router;
