import { div, text } from '../Framework/Framework'

export default (handler) => {
    return div()
        .class('a8 grid3x3')
        .style(function() {
            return `
                width: 100px;
                height: 50px;
                border: 1px solid grey;
                cursor: pointer;
            `
        })
        .event.click(handler)
        .children([
            div().children([text('exit')])
        ])
}
