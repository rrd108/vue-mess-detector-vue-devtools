import type { App } from 'vue'
import { setupDevtools } from './devtools'

export const VueMessDetectorVueDevtools = {
    install(app: App, options = {}) {
        console.log(`install called`, { options })
        setupDevtools(app)
    },
}
