const exec = require('@actions/exec');

module.exports = function (version) {
  this.version = version;
  this.image = `checkmk/check-mk-raw:${version}`;

  async function _container(cmd, ...args) {
    let output = '';
    let options = {
      listeners: {
        stdout: function(data) {
          output += data.toString();
        }
      }
    };

    await exec.exec('docker', [cmd, ...args], options);
    return output;
  }

  this.pull = async function() {
    await _container('pull', this.image)
  }

  this.start = async function() {
    await _container('run', '-dti', '--rm', '--name', 'cmk', this.image)
  }

  this.health = async function() {
    let output = await _container('inspect', '--format={{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}', 'cmk')
    return output.trim()
  }

  this.copy = async function(src, dst) {
    await _container('cp', src, dst)
  }

  this.run = async function(cmd) {
    await _container('exec', 'cmk', '/bin/su', '-l', '--command', cmd, 'cmk')
  }

  this.stop = async function() {
    await _container('stop', 'cmk')
  }
}
