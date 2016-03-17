/(BEGIN)|(END)|(IF)|(THEN)|(ELSE)|(WHILE)|(DO)|(UNTIL)|(REPEAT)|(INTEGER)|(REAL)|(ALL)|(AND)|(OR)|(STRING)|(PROGRAM)/

var _integer = /[0-9]+/
var _real = /_integer\._integer/
var _number = /_integer|_real/


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
  var scanner = Scanner(fileData)
  var token
  while(token = scanner.get()){
    console.log(token);
  }
  return
  var position = {
    line : 1,
    column : 1
  }
  var readingComment = false;
  var comment = {
    text : ''
  };
  for(c in fileData){
    var letter = fileData[c];
    if(letter == '}'){
      readingComment = false;
      comments.push(comment)
      comment = {}
    }
    if(readingComment){
      comment.text += letter;
    }
    if(letter == '{'){
      readingComment = true;
      comment.position = position.copy()
    }
    if(['\n', '\t', '\r', ' '].indexOf(letter) == -1){
      console.log(letter, position);
      position.column++
    }else{
      switch(letter){
        case ' ':
          position.column++;
          break;
        case '\r':
          position.line++;
          position.column=1;
          break;
        case '\t':
          position.column+=4;
          break;
      }
    }
  }
  //console.log(fileData.match(/[^\s]*/gi))

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
      return letter.match(/[A-Z0-9]+/) != null
    },
    isFloat : function(token){
      return token.match(/[0-9]+\.[0-9]+/) != null
    },
    isNumber : function(token){
      return this.isFloat(token) || this.isInteger(token)
    },
    isInteger : function(token){
      return token.match(/[0-9]+/) != null
    },
    isOp : function(token){
      return
        this.isRelational(token) ||
        this.isReserved(token) ||
        this.isSpecial(token) ||
        this.isBoolean(token) ||
        this.isArithmetic(token)
    },
    isRelational : function(token){
      return this.op.relational.indexOf(token) > -1
    },
    isReserved : function(token){
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
      var readingComment = false;
      var readingToken = false;
      while(letter = this.data.next()){
        this.walk(letter)
        if(this.isSpace(letter)){
          continue;
        }
        if(letter == '}'){
          readingComment = false;
        }
        if(letter == '{'){
          readingComment = true;
        }
        if(!readingComment){

          if(this.isAlphaNum(letter)){
            token += letter
            while(this.isAlphaNum(letter = this.data.next())){
              token += letter
              this.walk(letter)
            }
            if(letter != null){
              this.walk(letter)
            }else{
              return null
            }
            if(letter == '.'){
              if(this.isInteger(token)){
                token += letter
                this.walk(letter)
                while(this.isAlphaNum(letter = this.data.next())){
                  token += letter
                  this.walk(letter)
                }
              }else{
                throw new Error('\nErro 01: Símbolo "'+token+'" inválido na linha '+this.position.line+', coluna '+this.position.column+' \n');
              }
            }
          }else{
            if(this.isSpecial(letter)){
              token = letter
            }else{
              while(letter && !this.isAlphaNum(letter) && !this.isSpace(letter) && !this.isSpecial(letter)){
                token += letter
                letter = this.data.next()
                this.walk(letter)
                if(this.isOp(token+letter)){
                  continue;
                }else{
                  if(this.isOp(token)){
                    break;
                  }
                }
              }
            }
          }
          if(this.isAlphaNum(token)){
            if(this.isInteger(token)){
              valor = parseInt(token)
              token = 'NUMERICO'
            }else{
              if(!this.isReserved(token) && !this.isBoolean(token)){
                if(this.isInteger(token.split('.')[0])){
                  throw new Error('ERRO_1 \nErro 01: Símbolo "'+token+'" inválido na linha '+this.position.line+', coluna '+this.position.column+' \n')
                }else{
                  lexema = token
                  token = 'ID'
                }
              }
            }
          }else{

            if(this.isFloat(token)){
              valor = parseFloat(token)
              token = 'NUMERICO'
            }else{
              throw new Error('ERRO_1 \nErro 01: Símbolo "'+token+'" inválido na linha '+this.position.line+', coluna '+this.position.column+' \n')
            }
          }
        }
      }
      if(!letter)
        return null
      return {
        lexema : lexema,
        valor : valor,
        token : token
      }
    }
  }
}
