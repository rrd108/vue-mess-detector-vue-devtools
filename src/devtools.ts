import { setupDevtoolsPlugin } from '@vue/devtools-api'
import type { App } from 'vue'

const inspectorId = 'vue-mess-detector-vue-devtools'

export const setupDevtools = (app: App) => {
    console.log(`setupDevtools called`)
    setupDevtoolsPlugin({
        id: 'vue-mess-detector-vue-devtools',
        label: 'Vue Mess Detector',
        logo: 'https://raw.githubusercontent.com/rrd108/vue-mess-detector/refs/heads/main/docs/public/logo.png',
        packageName: 'vue-mess-detector-vue-devtools',
        homepage: 'https://github.com/rrd108/vue-mess-detector-vue-devtools',
        app
    }, api => {
        api.addInspector({
            id: inspectorId,
            label: 'Vue Mess Detector',
            icon: 'data-usage',
        })

        console.log(`before inspectComponent`)
        api.on.inspectComponent((payload: any) => {
            console.log(`inspectComponent called`)
            payload.instanceData.state.push({
                type: 'VMD',
                key: 'hello',
                value: 'data.message'
            })

            payload.instanceData.state.push({
                type: 'VMD',
                key: 'time_counter',
                value: [1, 2, 3]
            })
        })
    })
}