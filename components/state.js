import State from '../Framework/State.js'

export default new State({
    count: 0,
    boxExpanding: false,
    incrementCount(amount) {
        this.count += amount
    },
    resetCount() {
        this.count = 0
    },
    setBoxExpanding(bool) {
        this.boxExpanding = bool
    }
})
