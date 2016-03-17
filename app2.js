Object.prototype.copy = function () {
  return JSON.parse(JSON.stringify(this))
};
Array.prototype.next = function () {
  if(this.length == 0) return null
  return this.splice(0,1)[0]
};
var file;
//REGEX
var rinteger = '([^((A-Z)\,)][0-9]+[^\,^\;^\)])'
var rfloat = '('+rinteger+'\,'+rinteger+')'
var rnumber = '('+rinteger+'|'+rfloat+')'
var rspecial = '(\(|\)|\;|\,|\.|(\=\:))'
//REGEX
var filename = process.argv[2];
var fs = require('fs');
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  var fileData = data.toUpperCase();
  console.log(fileData.match(new RegExp(rinteger, 'gi')));
  //console.log(fileData.match(new RegExp(rfloat)));
  //console.log(fileData.match(new RegExp(rnumber)));
  //console.log(fileData.match(new RegExp(rspecial)));
  return
})
