

var reserved = {
  words : ["BEGIN", "END", "IF", "THEN", "ELSE", "WHILE", "DO", "UNTIL", "REPEAT", "INTEGER", "REAL", "ALL", "AND", "OR", "STRING", "PROGRAMA"],
  special : [".", ",", ";", ")", "(", ":="],
  relational : ["<", ">", "<=", ">=", "=", "<>"],
  boolean : ["OR", "AND"],
  aritm : ["+", "-", "*", "/"]
}

var file;
Object.prototype.copy = function () {
  return JSON.parse(JSON.stringify(this))
};
Array.prototype.next = function () {
  if(this.length == 0) return null
  return this.splice(0,1)[0]
};
var symbols = []
var comments = []

var filename = process.argv[2];
var fs = require('fs');
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  var fileData = data;
  var parser = Parser(fileData)
  //var scanner = Scanner(fileData)
  var token
<<<<<<< HEAD
  while(token = parser.sint()){
    console.log(token);
=======
  i=0;
  while(token = scanner.get()){
    console.log(i++,token);
>>>>>>> cd39187a6d3867aa80b3a7cc1e1c526d766d6a9f
  }
});

function Scanner(data){
  return {
    op : {
      special : [".", ",", ";", ")", "(", ":="],
      reserved : ["BEGIN", "END", "IF", "THEN", "ELSE", "WHILE", "DO", "UNTIL", "REPEAT", "INTEGER", "REAL", "ALL", "AND", "OR", "STRING", "PROGRAMA"],
      relational : ["<", ">", "<=", ">=", "=", "<>"],
      boolean : ["OR", "AND"],
      arithmetic : ["+", "-", "*", "/"]
    },
    data : data.copy().toUpperCase().split(''),
    position : {
      line : 1,
      column : 1
    },
    isReadingComment : false,
    walk : function(letter){
      switch(letter){
        case ' ':
          this.position.column++;
          break;
        case '\r':
          this.position.line++;
          this.position.column=1;
          break;
        case '\t':
          this.position.column+=4;
          break;
        default:
          this.position.column++;
      }
    },
    isSpace : function(letter){
      if(!letter)
        return null
      return ['\n', '\t', '\r', ' '].indexOf(letter) > -1
    },
    isAlphaNum : function(letter){
      if(!letter || this.isSpace(letter))
        return null
      return letter.match(/^[A-Z0-9]+$/) != null
    },
    isAlpha : function(letter){
      if(!letter || this.isSpace(letter))
        return null
      return letter.match(/^[A-Z]+$/) != null
    },
    isFloat : function(token){
      return token.match(/^[0-9]+\.[0-9]+$/) != null
    },
    isNumber : function(token){
      return this.isFloat(token) || this.isInteger(token)
    },
    isInteger : function(token){
      return token.match(/^[0-9]+$/) != null
    },
    isOp : function(token){
      return this.isRelational(token) || this.isReserved(token) || this.isSpecial(token) || this.isBoolean(token) || this.isArithmetic(token)
    },
    lookForNumerico : function(token, letter){
      if(this.isInteger(token)){
        if(this.isInteger(letter)){
          token += letter
        }else{
          this.data.unshift(letter)
        }
        while(this.isInteger(letter = this.data.next())){
          token += letter
          this.walk(letter)
        }
        if(letter == '.'){
          token += letter;
          this.walk(letter)
          while(this.isInteger(letter = this.data.next())){
            token += letter
            this.walk(letter)
          }
          if(!this.isOp(letter) && !this.isSpace(letter)){
            throw new Error('\nErro 01: Símbolo "'+token+'" inválido na linha '+this.position.line+', coluna '+this.position.column+' \n');
          }else{
            this.data.unshift(letter)
            return {
              valor : parseFloat(token),
              token : 'NUMERICO',
              lexema : ''
            }
          }
        }else{
          if(!this.isOp(letter) && !this.isSpace(letter)){
            throw new Error('\nErro 01: Símbolo "'+token+'" inválido na linha '+this.position.line+', coluna '+this.position.column+' \n');
          }else{
            this.data.unshift(letter)
            return {
              valor : parseInt(token),
              token : 'NUMERICO',
              lexema : ''
            }
          }
        }
      }
    },
    lookForReserved : function(token, letter){
      if(this.isAlpha(token)){
        if(this.isAlpha(letter)){
          token += letter
        }else{
          this.data.unshift(letter)
        }
        while(this.isAlpha(letter = this.data.next()) && token.length < 9){
          token += letter
          this.walk(letter)
        }
        if(this.isReserved(token)){
          this.data.unshift(letter)
          return {
            valor : '',
            token : token,
            lexema : ''
          }
        }else{
          this.walk(letter)
          return this.lookForId(token, letter)
        }
      }else{
        return this.lookForId(token, letter)
      }
    },
    lookForId : function(token, letter){
      if(this.isAlpha(token[0]) && this.isAlphaNum(token)){
        if(this.isAlphaNum(letter)){
          token += letter
        }else{
          this.data.unshift(letter)
        }

        while(this.isAlphaNum(letter = this.data.next())){
          token += letter
          this.walk(letter)
        }
        if(!this.isOp(letter) && !this.isSpace(letter)){
          throw new Error('\nErro 01: Símbolo "'+token+'" inválido na linha '+this.position.line+', coluna '+this.position.column+' \n');
        }else{
          this.data.unshift(letter)
          return {
            valor : '',
            token : 'ID',
            lexema : token
          }
        }
      }
    },
    lookForOp : function(token, letter){
      //console.log('oi',token, letter);
      if(this.isOp(token) || token == ':' || token == "<" || token == ">"){
        if(this.isOp(token+letter)){
          token += letter
        }else{
          this.data.unshift(letter)
        }
        while(this.isOp(token + (letter = this.data.next()))){
          token += letter
          this.walk(letter)
        }
        /*if(!this.isOp(letter) && !this.isSpace(letter) && letter != null){
          throw new Error('\nErro 01: Símbolo "'+token+'" inválido na linha '+this.position.line+', coluna '+this.position.column+' \n');
        }else{
          this.data.unshift(letter)
          return {
            valor : '',
            token : token,
            lexema : ''
          }
        }*/
        if(!this.isOp(token)){
          throw new Error('\nErro 01: Símbolo "'+token+'" inválido na linha '+this.position.line+', coluna '+this.position.column+' \n');
        }
        this.data.unshift(letter)
        return {
          valor : '',
          token : token,
          lexema : ''
        }
      }
    },
    isRelational : function(token){
      return this.op.relational.indexOf(token) > -1
    },
    isReserved : function(token){
      /*filtered = this.op.reserved.filter(function(item){
        if(item.indexOf(token) > -1)
          return true
      })
      return filtered.length > 0*/
      return this.op.reserved.indexOf(token) > -1
    },
    isBoolean : function(token){
      return this.op.boolean.indexOf(token) > -1
    },
    isSpecial : function(token){
      return this.op.special.indexOf(token) > -1
    },
    isArithmetic : function(token){
      return this.op.arithmetic.indexOf(token) > -1
    },
    get : function(){
      var token = '';
      var valor = '';
      var lexema = '';
      //var readingComment = false;
      var readingToken = false;
      while(letter = this.data.next()){
        this.walk(letter)
        if(this.isSpace(letter)){
          continue;
        }
        if(letter == '}'){
          this.isReadingComment = false;
          continue;
        }
        if(letter == '{'){
          this.isReadingComment = true;
        }
        if(!this.isReadingComment){
          //new code
          if(token != ''){
            var result = this.lookForNumerico(token, letter) || this.lookForOp(token, letter) || this.lookForReserved(token, letter)
            if(result){
              result.position = this.position.copy()
            }
            return result
          }else{
            token += letter;
          }
        }
      }
      if(token != null){
        var result = this.lookForNumerico(token, letter) || this.lookForOp(token, letter) || this.lookForReserved(token, letter)
        if(result){
          result.position = this.position.copy()
        }
        return result
      }


    }
  }
}

function Parser(data){
  return {
    sint : function(){
      var tokenArray = [];
      var token1 = {
        lexema: '',
        valor: '',
        token: '<'
      }
      var token2 = {
        lexema: '',
        valor: '',
        token: '-'
      }
      var token3 = {
        lexema: '',
        valor: 3,
        token: 'BEGIN'
      }
      tokenArray.push(token1);
      tokenArray.push(token2);
      tokenArray.push(token3);

      var i = tokenArray.length - 1;
      if(i==1){
        //chama a função de pegar token novo
      }
      else{
        var nextToken = tokenArray[i];
        var previousToken = tokenArray[i-1];

        if((previousToken.token ==  '>')||(previousToken.token ==  '>')||(previousToken.token ==  '<=')||(previousToken.token ==  '>=')||(previousToken.token ==  '=')||(previousToken.token ==  '<>')){
          if((nextToken.token =='NUMÉRICO')||(nextToken.token =='ID')||(nextToken.token =='(')){
            //Tudo OK, chama a função do token novo
          }
          else{
            throw new Error('ERRO_2 \nErro 02: Símbolo "'+nextToken.token+'" inesperado. Esperando: ID, valor numérico ou "(". Linha '+'1'+', coluna '+'2'+' \n')
          }
        }
        else if((previousToken.token == '+')||(previousToken.token == '-')||(previousToken.token == '*')||(previousToken.token == '/')){
          if((nextToken.token =='NUMÉRICO')||(nextToken.token =='ID')||(nextToken.token =='(')){
            //Tudo OK, chama a função do token novo
            }
          else{
            throw new Error('ERRO_2 \nErro 02: Símbolo "'+nextToken.token+'" inesperado. Esperando: ID, valor numérico ou "(". Linha '+'1'+', coluna '+'2'+' \n')
          }
        }
        else if(previousToken.token == '.'){
          if(nextToken.token == 'NUMÉRICO'){
            //Tudo OK, chama a função do token novo
          }
          else{
            throw new Error('ERRO_2 \nErro 02: Símbolo "'+nextToken.token+'" inesperado. Esperando: Valor numérico. Linha '+'1'+', coluna '+'2'+' \n')
          }
        }
        else if(previousToken.token == ','){
          if(nextToken.token == 'ID'){
            //Tudo OK, chama a função do token novo
          }
          else{
            throw new Error('ERRO_2 \nErro 02: Símbolo "'+nextToken.token+'" inesperado. Esperando: ID. Linha '+'1'+', coluna '+'2'+' \n')
          }
        }
      }
    }
  }
}
