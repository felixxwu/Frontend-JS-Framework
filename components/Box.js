import Button from './Button'
import Counter from './Counter'
import Framework from '../Framework'
import ExitButton from './ExitButton'

const states = Object.freeze({START: 1, EXPANDING: 2, EXPANDED: 3})
const dimensions = {START: [100, 50], EXPANDED: [500, 300]}
const animationTime = 0.5

export default {
    name: 'box',
    tag: 'div',
    attrs: { class: 'grid3x3' },
    data: {
        dimensions: dimensions.START,
        state: states.START,
    },
    events: {
        click() { 
            if (this.data.state === states.EXPANDED) return Framework.flags.NO_SELF_RENDER

            this.data.dimensions = dimensions.EXPANDED
            this.data.state = states.EXPANDING
            
            Framework.dispatch('setBoxExpanding', true)
            setTimeout(() => {
                this.data.state = states.EXPANDED
                Framework.dispatch('setBoxExpanding', false)
            }, animationTime * 1000);
        }
    },
    subscribeTo: ['boxExpanding'],
    style() { 
        return `
            width: ${this.data.dimensions[0]}px;
            height: ${this.data.dimensions[1]}px;
            max-width: 100vw;
            border: 1px solid grey;
            transition: ${animationTime}s;
            cursor: ${this.data.state === states.START ? 'pointer' : 'initial'};
        `
    },
    children() {
        const start = [{
            tag: 'div',
            child: () => ({ text: 'start' })
        }]
        const exit = () => {
            this.data.dimensions = dimensions.START
            this.data.state = states.EXPANDING
            
            Framework.dispatch('resetCount')
            Framework.dispatch('setBoxExpanding', true)
            setTimeout(() => {
                this.data.state = states.START
                Framework.dispatch('setBoxExpanding', false)
            }, animationTime * 1000);
        }
        const buttons = [Counter, Button(1), Button(2), Button(3), ExitButton(exit)]
        
        if (this.data.state === states.START) return start
        if (this.data.state === states.EXPANDING) return []
        if (this.data.state === states.EXPANDED) return buttons
    }
}
