import { addCustomTab } from '@vue/devtools-api'
import { h } from 'vue'
import VueMessDetectorTab from './VueMessDetectorTab.vue'

export const setupDevtools = () => {
    console.log(`setupDevtools called`)

    const vnode = h(VueMessDetectorTab)
    /*const vnode1 = h('section', [
        h('h1', 'Vue Mess Detector Analysis'),
        h('p', 'This is a custom tab for Vue Mess Detector'),
    ])*/

    addCustomTab({
        name: 'vue-mess-detector',
        title: 'Vue Mess Detector',
        icon: 'https://raw.githubusercontent.com/rrd108/vue-mess-detector/refs/heads/main/docs/public/logo.png',
        category: 'modules',
        view: {
            type: 'vnode',
            vnode,
        },
    })

    console.log('VueMessDetectorTab', vnode)
}
