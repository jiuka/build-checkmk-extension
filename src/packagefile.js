const exec = require('@actions/exec');
const fs = require('fs');

async function python(cmd) {
  let output = '';
  let options = {
    silent: true,
    listeners: {
      stdout: function(data) {
        output += data.toString();
      }
    }
  };

  await exec.exec('python', ['-c', cmd], options);
  return output;
}

module.exports = {
  read: async function(path) {
    let data = await python(`import json; print(json.dumps(eval(open('${path}').read())))`)
    return JSON.parse(data);
  },
  write: async function(path, data) {
    let pydata = await python(`import json; print(json.loads('${JSON.stringify(data)}'))`)
    fs.writeFileSync(path, pydata);
  }
}
