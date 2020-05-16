import { text, div, h2 } from '../../Framework/Framework'

export default (number) => {
    return div()
        .children([
            h2().children([
                text('child ' + number)
            ]),
            text(`I am a child component with prop: ${number}`)
        ])
}
