import { div } from '../Framework/Framework.js'
import Box from './Box.js'

export default div()
    .class('app grid3x3')
    .localState({
        opacity: 0
    })
    .style(function() { return `
        opacity: ${this.localState.opacity};
        transition: 1s;
    `})
    .onCreate(function() {
        setTimeout(() => {
            this.localState.opacity = 1
            
        }, 100);
    })
    .children([Box])
