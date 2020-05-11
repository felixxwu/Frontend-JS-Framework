import State from './State'
import Page1 from './Page1'
import Page2 from './Page2'

export default () => {
    if (State.page === '1') {
        return Page1()
    } else {
        return Page2()
    }
}
