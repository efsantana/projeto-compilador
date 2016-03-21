var p = require('./parser.js')
var filename = process.argv[2];
var fs = require('fs');
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  var fileData = data;
  var parser = p(fileData)
  var token
  i=0;
  while(token = parser.Scanner.get()){
    console.log(i++,token);
  }
});
