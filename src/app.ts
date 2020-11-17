const logger = require('dva-logger')
const plugins = () => {
  let res = []
  if (process.env.NODE_ENV !== 'production') {
    //@ts-ignore
    res.push(logger())
  }
  return res
}
export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault()
      console.error(err.message)
    }
  },
  plugins: plugins()
}
