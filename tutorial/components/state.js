import { State } from '../../Framework/Framework'

export default new State({
    totalCount: 0,
    incrementCount(amount) {
        this.totalCount += amount
    },
})
