import { setupDevtoolsPlugin } from '@vue/devtools-api'
import type { App } from 'vue'
//import { analyze, FLAT_RULES } from 'vue-mess-detector'

const inspectorId = 'vue-mess-detector-vue-devtools'

// const runAnalysis = async () => {
//     results = await analyze({ dir: './', apply: FLAT_RULES })
//     console.log({ results })
// }

export const setupDevtools = (app: App) => {
    setupDevtoolsPlugin({
        id: 'vue-mess-detector-vue-devtools',
        label: 'Vue Mess Detector',
        logo: 'https://raw.githubusercontent.com/rrd108/vue-mess-detector/refs/heads/main/docs/public/logo.png',
        packageName: 'vue-mess-detector-vue-devtools',
        homepage: 'https://github.com/rrd108/vue-mess-detector-vue-devtools',
        app,
    }, api => {
        api.addInspector({
            id: inspectorId,
            label: 'Vue Mess Detector',
            icon: 'data-usage',
        })

        api.on.getInspectorTree((payload) => {
            if (payload.inspectorId === inspectorId) {
                payload.rootNodes = [{
                    id: 'mess-summary',
                    label: 'Mess Summary',
                }]
            }
        })

        api.on.getInspectorState((payload) => {
            if (payload.inspectorId === inspectorId) {
                if (payload.nodeId === 'mess-summary') {
                    payload.state = {
                        'Mess Score': [{
                            key: 'overview',
                            value: {
                                score: 95,
                                message: 'Analysis in progress',
                            },
                        }],
                        'Components Analyzed': [{
                            key: 'analysisReport',
                            value: 'XYZ Analyzing...',
                        }],
                        'Code Health': [{
                            key: 'codeHealth',
                            value: 'GHJ Analyzing...',
                        }],
                    }
                }
            }
        })
    })

    console.log('VueMessDetectorTab', vnode)
}
