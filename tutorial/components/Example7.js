import { div, br } from '../../Framework/Framework'
import ExampleChild from './Example7child'
import ExampleChildState from './Example7ChildState'

export default div()
    .class('example')
    .children([
        ExampleChildState,
        ExampleChild(1),
        br(),
        ExampleChild(2),
    ])
