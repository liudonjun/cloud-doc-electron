const fs = require('fs').promises;
const path = require('path');

const fileHelper = {
  readFile: (path) => fs.readFile(path, { encoding: 'utf8' }),
  writeFile: (path, content) => fs.writeFile(path, content, { encoding: 'utf8' }),
};

const testPath = path.join(__dirname, 'helper.js');
const testWritePath = path.join(__dirname, 'hello.md');

fileHelper.readFile(testPath).then((data) => {
  console.log(data);
});

fileHelper.writeFile(testWritePath, '## hello world !').then(() => {
  console.log('写入成功');
});
