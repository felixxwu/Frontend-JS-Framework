import SwitchButton from './SwitchButton'
import SmallSquare from './SmallSquare'

export default () => {
    const numSquares = 50_000
    return {
        tag: 'div',
        children: [
            {text: `Page 2 with ${numSquares} squares. check console for render time`},
            {tag: 'br'},
            SwitchButton(),
            {tag: 'br'},
            ...(new Array(numSquares)).fill(SmallSquare()),
        ]
    }
}
