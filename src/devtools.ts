import { addCustomTab } from '@vue/devtools-api'
import { h } from 'vue'

export const setupDevtools = () => {
    console.log(`setupDevtools called`)

    addCustomTab({
        name: 'vue-mess-detector',
        title: 'Vue Mess Detector',
        icon: 'https://raw.githubusercontent.com/rrd108/vue-mess-detector/refs/heads/main/docs/public/logo.png',
        category: 'modules',
        view: {
            type: 'vnode',
            vnode: h('section', [
                h('h1', 'Vue Mess Detector Analysis'),
                h('p', 'This is a custom tab for Vue Mess Detector')
            ])
        },
    })
}