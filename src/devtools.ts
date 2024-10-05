import { setupDevtoolsPlugin } from '@vue/devtools-api'
import type { App } from 'vue'
import { createRpcServer, createRpcClient } from '@vue/devtools-kit'

const serverFunctions = {
    runAnalysis: async () => {
        // Your analysis logic here
        // For now, we'll return a mock result
        return [{ info: 'Analysis result' }]
    },
    myServerFunction: async () => {
        console.log("This is running on the server!")
        return "Server function executed"
    },
}

// Set up RPC server
createRpcServer(serverFunctions, {
    preset: 'iframe',
})

const inspectorId = 'vue-mess-detector-vue-devtools'

export const setupDevtools = (app: App) => {
    setupDevtoolsPlugin({
        id: 'vue-mess-detector-vue-devtools',
        label: 'Vue Mess Detector',
        logo: 'https://raw.githubusercontent.com/rrd108/vue-mess-detector/refs/heads/main/docs/public/logo.png',
        packageName: 'vue-mess-detector-vue-devtools',
        homepage: 'https://github.com/rrd108/vue-mess-detector-vue-devtools',
        app,
    }, api => {
        // Create an RPC client with the correct type
        const rpcClient = createRpcClient(api)

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

        api.on.getInspectorState(async (payload) => {
            if (payload.inspectorId === inspectorId) {
                if (payload.nodeId === 'mess-summary') {
                    const result = await rpcClient.myServerFunction()
                    console.log(result) // This will log "Server function executed"

                    payload.state = {
                        'Mess Score': [{
                            key: 'overview',
                            value: {
                                score: 95,
                                message: `Analysis in progress. Server says: ${result}`,
                            },
                        }],
                    }
                }
            }
        })
    })
}
