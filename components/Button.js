import Framework from '../Framework'

export default number => {
    let className = ''
    if (number === 1) className = 'a4'
    if (number === 2) className = 'a5'
    if (number === 3) className = 'a6'
    
    return {
        name: 'button',
        tag: 'div',
        attrs: { class: `${className} grid3x3` },
        data: {
            myCount: 0
        },
        style() {
            return `
                width: 70px;
                height: 70px;
                border: solid 1px grey;
                cursor: pointer;
            `
        },
        events: {
            click(e) {
                this.data.myCount += 1
                Framework.dispatch('incrementCount', number)
            }
        },
        child() {
            return {
                tag: 'div',
                child: () => ({text: `+${number} (${this.data.myCount})`})
            }
        }
    }
}