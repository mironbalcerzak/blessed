var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var dir = __dirname;
var target = process.argv[2];

var files = target ? [target] : fs.readdirSync(dir).filter(function(file) {
  return file.slice(-3) === '.js' && file.indexOf('widget') === 0;
});

files.forEach(function(file) {
  if (file.slice(-3) !== '.js') file += '.js';
  var filepath = path.join(dir, file);
  if (!fs.existsSync(filepath)) {
    console.error('Test not found: ' + file);
    return;
  }
  console.log('\n>>> Running: ' + file + ' (Press "q" or "C-c" to exit widget) <<<');
  cp.spawnSync(process.execPath, [filepath], { stdio: 'inherit' });
});