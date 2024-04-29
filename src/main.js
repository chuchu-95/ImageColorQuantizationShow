import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router' 
import './assets/global.css';

const app = createApp(App).use(router)

app.use(router) 

app.mount('#app')