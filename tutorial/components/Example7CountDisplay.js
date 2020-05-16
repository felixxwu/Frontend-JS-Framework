import { text, div, h1 } from '../../Framework/Framework'
import State from './state'

export default h1()
    .onCreate(function() {
        State.subscribe(this, 'totalCount')
    })
    .children(function() { return [
        text('Total count: ' + State.state.totalCount)
    ]})
