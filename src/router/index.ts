import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import SpriteView from "@/views/SpriteView.vue";
import NoteView from "@/views/NoteView.vue";
import path from "path";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/sprite",
      name: "sprite",
      component: SpriteView,
    },
    {
      path: "/note",
      name: "note",
      component: NoteView,
    },
  ],
});

export default router;
