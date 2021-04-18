import { createApp } from 'vue'

import App from './App';

import { setupAntd } from './ant-design-vue'

import router from './router'
import '../mock/mock'
import store from './store'


const app = createApp(App);
setupAntd(app);
app.use(router);
app.use(store);
app.mount('#app');
