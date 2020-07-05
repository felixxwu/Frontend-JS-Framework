import State from './state.js'

export default {
    tag: 'h1',
    onCreate: function() {
        State.subscribe(this, 'totalCount')
    },
    children: function() { return [
        {
            tag: null,
            text: 'Total count: ' + State.state.totalCount
        }
    ]},
}
