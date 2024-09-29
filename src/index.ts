import type { App } from 'vue'
import { setupDevtools } from './devtools'
import { onDevToolsClientConnected } from '@vue/devtools-api'

export const VueMessDetectorVueDevtools = {
    install(app: App, options = {}) {
        console.log(`install called`, { options })
        setupDevtools()

        onDevToolsClientConnected(() => {
            console.log('devtools client connected')
        })

    },
}
