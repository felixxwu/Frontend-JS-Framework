import { div, br } from '../../Framework/Framework'
import ExampleChild from './Example5child'

export default div()
    .class('example')
    .children([
        ExampleChild(1),
        br(),
        ExampleChild(2),
    ])
