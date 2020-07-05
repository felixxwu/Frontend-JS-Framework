export default class State {
    constructor(state) {
        this.state = new Proxy(state, {
            set: (target, key, value) => {
                target[key] = value;
                console.log('Global State', key, '=', value)
                this.updateSubscribers(key)
                return true;
            }
        })
        this.subscriptions = {}
    }
    subscribe(component, variable) {
        console.log(`Subscribed component to variable ${variable}. Component:`, component)
        if (!this.subscriptions[variable]) this.subscriptions[variable] = []
        if (this.subscriptions[variable].includes(component)) return
        this.subscriptions[variable].push(component)
    }
    updateSubscribers(variable) {
        const subscribed = this.subscriptions[variable]
        subscribed && subscribed.forEach(component => {
            component.rerender()
        })
    }
}
