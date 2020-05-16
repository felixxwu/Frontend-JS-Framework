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
    .localState({
        dimensions: dimensions.START,
        state: states.START,
        opacity: 0,
        text: 'start'
    })
    .style(function() {
        return `
            width: ${this.localState.dimensions[0]}px;
            height: ${this.localState.dimensions[1]}px;
            transition: ${animationTime}s;
            cursor: ${this.localState.state === states.START ? 'pointer' : 'initial'};
            opacity: ${this.localState.opacity};
        `
    })
    .event.click(function() {
        if (this.localState.state === states.EXPANDED) return

        this.localState.dimensions = dimensions.EXPANDED
        this.localState.state = states.EXPANDING
        
        State.state.setBoxExpanding(true)
        setTimeout(() => {
            this.localState.state = states.EXPANDED
            State.state.setBoxExpanding(false)
        }, animationTime * 1000);
    })
    .onCreate(function() {
        this.localState.opacity = 1
        State.subscribe(this, 'boxExpanding')
    })
    .children(function() {
        const start = [div().children([text('start')])]
        const exitHandler = () => {
            this.localState.dimensions = dimensions.START
            this.localState.state = states.EXPANDING
            
            State.state.resetCount()
            State.state.setBoxExpanding(true)
            setTimeout(() => {
                this.localState.state = states.START
                State.state.setBoxExpanding(false)
            }, animationTime * 1000);
        }
        const buttons = [Counter, Button(1), Button(2), Button(3), ExitButton(exitHandler)]
        
        if (this.localState.state === states.START) return start
        if (this.localState.state === states.EXPANDING) return []
        if (this.localState.state === states.EXPANDED) return buttons
    })
