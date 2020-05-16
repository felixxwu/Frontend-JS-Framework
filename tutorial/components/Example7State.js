import State from '../../Framework/State'

export default new State({
    totalCount: 0,
    incrementCount(amount) {
        this.totalCount += amount
    },
})
