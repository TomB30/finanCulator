import 'quasar/src/css/index.sass'
import './styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'
import quasarIconSet from 'quasar/icon-set/fontawesome-v6'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  lang: {
    rtl: true,
  },
  iconSet: quasarIconSet,
  plugins: {
    Notify,
  },
})

app.mount('#app')
