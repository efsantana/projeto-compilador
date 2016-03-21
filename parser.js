var scanner = require('./scanner.js')
function Parser(data){
  return {
    Scanner : scanner(data)
  }
}
module.exports = Parser
