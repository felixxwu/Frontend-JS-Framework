import { div, br } from '../../Framework/Framework'
import ExampleChild from './Example7Child'
import ExampleCountDisplay from './Example7CountDisplay'

export default div()
    .class('example')
    .children([
        ExampleCountDisplay,
        ExampleChild(1),
        br(),
        ExampleChild(2),
    ])
