import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import Particles from "@tsparticles/vue3";
import { loadFull } from "tsparticles"; // 或者使用 loadSlim
import 'element-plus/dist/index.css'
// if you just want to import css
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(Particles, {
  init: async (engine) => {
    await loadFull(engine); // 加载完整版本
  // 或者使用 await loadSlim(engine); 加载轻量版本
},
});
app.use(createPinia())
app.use(ElementPlus)
app.mount('#app')