var Scanner = require('./scanner.js')
function Parser(data){
  return {
    tokens : [],
    lexer : function(){
      var scanner = Scanner(data)
      this.tokens = []
      while(token = scanner.get()){
        this.tokens.push(token.copy())
      }
      return this.tokens.length > 0
    },
    parser : function(){
      var tokens = this.tokens.map(function(item){
        return item.token
      })
      console.log(tokens);
      /*var ID = 'ID'
      var TIPO = 'INTEGER|REAL|STRING'
      var DECL_VAR = TIPO+'\s'+ID+'(\,'+ID+')*'
      var PROGRAMA = '(PROGRAMA\sID\s\;()BEGIN\sEND)'
      var VAL = '('+ID+'|INTEGER|REAL)'
      var EXP_REL = VAL+OP_REL+VAL+'|'+'\('+VAL+OP_REL+VAL+'\)'
      var OP_REL = '(<|>|<=|>=|=|<>)'
      var OP_BOOL = '(AND|OR)'
      var OP_ARIT = '(+|-|*|/)'*/

      function programa(tokens){
        return bloco_principal(tokens)
      }
      function bloco_principal(tokens){
        if(tokens.next() == 'PROGRAMA'){
          if(tokens.next() == 'ID'){
            if(tokens.next() == ';'){
              while(tokens[0] != 'BEGIN'){
                dec_var(tokens)
              }
              bloco(tokens)
              if(tokens[0] == 'END' && tokens[1] == '.'){
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
        return ['INTEGER', 'REAL', 'STRING'].indexOf(token) > -1
      }
      function id(tokens){
        //var token = this.tokens.next()
        return tokens.next() == 'ID'
      }
      function val(tokens){
        return ['ID', 'NUMERICO'].indexOf(tokens.next()) > -1
      }
      function op_arit(tokens){
        return ['+', '-', '*', '/'].indexOf(tokens.next())
      }
      function op_rel(tokens){
        return ['<', '>', '<=', '>=', '=', '<>'].indexOf(tokens.next())
      }
      function op_bool(tokens){
        return ['OR', 'AND'].indexOf(tokens.next())
      }
      function dec_var(tokens){
        var token = tokens.next()
        if(tipo(token)){
          token = tokens.next()
          if(id(token)){
            token = tokens.next()
            while(token == ','){
              if(!id(tokens.next())){
                return false;
              }
              token = tokens.next()
            }
            if(token == ';'){
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
        var tokensCopy = tokens.copy()
        if(val(tokensCopy) && op_rel(tokensCopy) && val(tokensCopy)){
          return val(tokens) && op_rel(tokens) && val(tokens)
        }
        tokensCopy = tokens.copy()
        if(tokensCopy.next().token == '(' && exp_rel(tokensCopy) && tokensCopy.next().token == ')'){
          return tokens.next().token == '(' && exp_rel(tokens) && tokens.next().token == ')'
        }
        tokensCopy = tokens.copy()
        if(tokensCopy.next().token == '(' && exp_rel(tokensCopy) && tokensCopy.next().token == ')' && op_bool(tokensCopy.next()) && tokensCopy.next().token == '(' && exp_rel(tokensCopy) && tokensCopy.next().token == ')'){
          return tokens.next().token == '(' && exp_rel(tokens) && tokens.next().token == ')' && op_bool(tokens.next()) && tokens.next().token == '(' && exp_rel(tokens) && tokens.next().token == ')'
        }
      }
      function exp_arit(tokens){

      }
      function atri(tokens){
        return id(tokens) && tokens.next().token == ':=' && exp_arit(tokens)
      }
      function comando_basico(tokens){
        var tokensCopy = tokens.copy()
        if(atri(tokensCopy)){
          return atri(tokens)
        }
        if(bloco(tokensCopy)){
          return bloco(tokens)
        }
        if(all(tokensCopy)){
          return all(tokens)
        }
      }
      function all(tokens){
        if(tokens.next().token == 'ALL' && tokens.next().token== '(' && tokens.next().token== 'ID'){
          var tokensCopy = tokens.copy()
        }

        return
      }
    }
  }
}
module.exports = Parser
//PROGRAMA\s+[a-z]+[a-z0-9]*\;\s*(\s*(INTEGER|STRING|REAL)\s+[a-z]+[a-z0-9]*(\s*\,\s*[a-z]+[a-z0-9]*)*\;)*\s*BEGIN\s*BEGIN\s*
