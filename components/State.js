export default {
    // initial values
    init(framework) {
        this.framework = framework
        this.selected = null;
        this.appOpacity = 1;
        this.page = '1'
    },

    get actions() {
        return {
            select: number => {
                if (number === this.selected) {
                    this.selected = null
                } else {
                    this.selected = number
                }
            },
            setOpaque: () => this.appOpacity = 1,
            setTransparent: () => this.appOpacity = 0,
            switch: () => this.page = this.page === '1' ? '2' : '1'
        }
    },

    get cssVars() {
        return {
            bg: (
                this.selected === 0 && 'red' ||
                this.selected === 1 && 'green' ||
                this.selected === 2 && 'blue' ||
                'white'
            ),
            width: `${500 + this.selected * 100}px`,
            opacity: this.appOpacity,
            transitionSpeed: '0.5s',
            transitionSpeedMS: 500
        }
    },

    dispatch(action, arg) {
        this.actions[action](arg)
        this.framework.render()
    }
}