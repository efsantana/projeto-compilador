var Scanner = require('./scanner.js')
function Parser(data){
  return {
    tokens : [],
    lexer : function(){
      var scanner = Scanner(data)
      while(token = scanner.get()){
        this.tokens.push(token.copy())
      }
      return this.tokens.length > 0
    }
  }
}
module.exports = Parser
