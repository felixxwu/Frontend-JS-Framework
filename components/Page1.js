import Block from './Block'
import SwitchButton from './SwitchButton'

export default () => {
    return {
        tag: 'div',
        children: [
            Block(0),
            Block(1),
            Block(2),
            SwitchButton()
        ]
    }
}
