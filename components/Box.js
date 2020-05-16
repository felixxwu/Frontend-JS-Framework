import { div, text } from '../Framework/Framework'
import State from '../state'
import Counter from './Counter'
import ExitButton from './ExitButton'
import Button from './Button'

const states = Object.freeze({START: 1, EXPANDING: 2, EXPANDED: 3})
const dimensions = {START: [100, 50], EXPANDED: [500, 300]}
const animationTime = 0.5

export default div()
    .class('box grid3x3')
    .style(function() {
        return `
            width: ${this.data.dimensions[0]}px;
            height: ${this.data.dimensions[1]}px;
            transition: ${animationTime}s;
            cursor: ${this.data.state === states.START ? 'pointer' : 'initial'};
            opacity: ${this.data.opacity};
        `
    })
    .$data({
        dimensions: dimensions.START,
        state: states.START,
        opacity: 0,
        text: 'start'
    })
    .$event.click(function() {
        if (this.data.state === states.EXPANDED) return

        this.data.dimensions = dimensions.EXPANDED
        this.data.state = states.EXPANDING
        
        State.state.setBoxExpanding(true)
        setTimeout(() => {
            this.data.state = states.EXPANDED
            State.state.setBoxExpanding(false)
        }, animationTime * 1000);
    })
    .$onCreate(function() {
        this.data.opacity = 1
        State.subscribe(this, 'boxExpanding')
    })
    .$children(function() {
        const start = [div().$children([text('start')])]
        const exitHandler = () => {
            this.data.dimensions = dimensions.START
            this.data.state = states.EXPANDING
            
            State.state.resetCount()
            State.state.setBoxExpanding(true)
            setTimeout(() => {
                this.data.state = states.START
                State.state.setBoxExpanding(false)
            }, animationTime * 1000);
        }
        const buttons = [Counter, Button(1), Button(2), Button(3), ExitButton(exitHandler)]
        
        if (this.data.state === states.START) return start
        if (this.data.state === states.EXPANDING) return []
        if (this.data.state === states.EXPANDED) return buttons
    })
