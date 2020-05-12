export default {
    state: {
        count: 0,
        boxExpanding: false
    },
    actions(state) {
        return {
            incrementCount: amount => state.count += amount,
            setBoxExpanding: bool => state.boxExpanding = bool
        }
    }
}