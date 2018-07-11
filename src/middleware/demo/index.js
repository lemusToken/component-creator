import MiddleWare from '../index'

class Some {
  run (context, next) {
    context.state += '!'
    console.log(context.state, context)
  }
}

const middle = new MiddleWare()
middle.use((context, next) => {
  context.state = 'start'
  console.log(context.state, context)
  next(context)
}).use((context, next) => {
  context.state += ' to'
  console.log(context.state, context)
  next(context)
}).use((context, next) => {
  context.state += ' end'
  console.log(context.state, context)
  next(context)
}).use(new Some(), 'run')
