const pg = require('../package.json')

export default {
  outputPath:`./dist/build/${pg.version}`,
  // devtool: 'source-map',
  define: {
    'process.env.RELEASE': 'build'
  }
}
