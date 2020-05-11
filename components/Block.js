import State from './State'

export default (number) => {
    let className = 'block'
    if (number === State.selected) className += ' selected'
    
    return {
        tag: 'div',
        attrs: {
            class: className
        },
        events: {
            click: () => State.dispatch('select', number)
        },
        children: [
            {text: `block ${number}`},
            {tag: 'br'},
            {text: `selected ${State.selected}`},
        ]
    }
}
