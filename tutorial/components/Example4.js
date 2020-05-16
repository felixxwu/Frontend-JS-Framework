import { div, text } from '../../Framework/Framework'

export default div()
    .class('example')
    .localState({
        text: 'I am a text component!',
        dimensions: [200, 300]
    })
    .style(function() {
        return `
            height: ${this.localState.dimensions[0]}px;
            width: ${this.localState.dimensions[1]}px;
            transition: 1s;
        `
    })
    .event.click(function() {
        this.localState.text = 'I was clicked!'
        this.localState.dimensions = [300, 500]
    })
    .children(function() { return [
        text(this.localState.text)
    ]})
