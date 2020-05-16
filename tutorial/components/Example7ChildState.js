import { text, div, h1 } from '../../Framework/Framework'
import State from './Example7State'

export default h1()
    .onCreate(function() {
        State.subscribe(this, 'totalCount')
    })
    .children(function() { return [
        text('Total count: ' + State.state.totalCount)
    ]})
