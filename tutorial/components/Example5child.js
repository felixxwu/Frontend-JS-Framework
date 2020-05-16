import { text, div, h1, h6 } from '../../Framework/Framework'

export default (number) => {
    return div()
        .children([
            h1().children([
                text('child ' + number)
            ]),
            text(`I am a child component with prop: ${number}`)
        ])
}
