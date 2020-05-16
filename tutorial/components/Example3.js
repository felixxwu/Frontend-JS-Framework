import { div, text } from '../../Framework/Framework'

export default div()
    .class('example')
    .localState({
        text: 'I am a text component!'
    })
    .event.click(function() {
        this.localState.text = 'I was clicked!'
    })
    .children(function() { return [
        text(this.localState.text)
    ]})
