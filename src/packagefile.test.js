const packagefile= require('./packagefile');
const fs = require('fs');

test('reading a packege file', async() => {
  pkg = await packagefile.read('test/package');

  expect(pkg.name).toBe('test');
});

test('writes python file', async() => {
  let  data = {
    key: 'value'
  };

  await packagefile.write('test/package2', data);
  let stat = fs.statSync('test/package2');
  fs.unlinkSync('test/package2')

  expect(stat.isFile()).toBe(true);
  expect(stat.size).toBeGreaterThan(10);
});
