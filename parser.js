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
    },
    parser : function(){
      function programa(tokens){
        return bloco_principal(tokens)
      }
      function bloco_principal(tokens){
        if(tokens.next().token == 'PROGRAMA'){
          if(tokens.next().token == 'ID'){
            if(tokens.next().token == ';'){
              while(tokens[0].token != 'BEGIN'){
                dec_var(tokens)
              }
              bloco(tokens)
              if(tokens[0].token == 'END' && tokens[1].token == '.'){
                return true;
              }else{
                return false;
              }
            }else{
              return false;
            }
          }else{
            return false;
          }
        }else{
          return false;
        }
      }
      function tipo(token){
        //var token = this.tokens.next()
        return ['INTEGER', 'REAL', 'STRING'].indexOf(token.token) > -1
      }
      function id(tokens){
        //var token = this.tokens.next()
        return tokens.next().token == 'ID'
      }
      function val(tokens){
        return ['ID', 'NUMERICO'].indexOf(tokens.next().token) > -1
      }
      function op_arit(tokens){
        return ['+', '-', '*', '/'].indexOf(tokens.next().token)
      }
      function op_rel(tokens){
        return ['<', '>', '<=', '>=', '=', '<>'].indexOf(tokens.next().token)
      }
      function op_bool(tokens){
        return ['OR', 'AND'].indexOf(tokens.next().token)
      }
      function dec_var(tokens){
        var token = tokens.next()
        if(tipo(token)){
          token = tokens.next()
          if(id(token)){
            token = tokens.next()
            while(token.token == ','){
              if(!id(tokens.next())){
                return false;
              }
              token = tokens.next()
            }
            if(token.token == ';'){
              return true;
            }else{
              return false
            }
          }else{
            return false;
          }
        }else{
          return false;
        }
      }
      function exp_rel(tokens){
        return (val(tokens) && op_rel(tokens) && val(tokens)) || (tokens.next().token == '(' && exp_rel(tokens) && tokens.next().token == ')')
      }
      var i=0;
      while(i<this.tokens.length){
        //topo = self.pilha[-1]
        //token = self.tabela[contador]
        //self.pilha.pop()
      }
    }
  }
}
module.exports = Parser
//PROGRAMA\s+[a-z]+[a-z0-9]*\;\s*(\s*(INTEGER|STRING|REAL)\s+[a-z]+[a-z0-9]*(\s*\,\s*[a-z]+[a-z0-9]*)*\;)*\s*BEGIN\s*BEGIN\s*
