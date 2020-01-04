const core = require('@actions/core');
const fs = require('fs')
const wait = require('./wait');
const packagefile = require('./packagefile');
const cmkcontainer = require('./cmkcontainer');

async function run() {
  try {
    const cmkVersion = core.getInput('cmk-version');
    const pkgFile = core.getInput('package-file');
    const basedir = `${process.env['GITHUB_WORKSPACE']}/${core.getInput('directory')}`

    const metadata = await core.group('Parse package file', async () => {
      let metadata = await packagefile.read(`${basedir}/${pkgFile}`)
      core.setOutput('name', metadata.name);
      core.setOutput('version', metadata.version);
      core.setOutput('pkgfile', `${metadata.name}-${metadata.version}.mkp`);
      return metadata;
    });

    console.log(`Package name: ${metadata.name}`)
    console.log(`Package version: ${metadata.version}`)
    console.log(`Checkmk version: ${cmkVersion}`)

    let container = new cmkcontainer(cmkVersion)

    await core.group('Pull checkmk Image', async function() {
      await container.pull()
    });

    try {
      await core.group('Start checkmk container', async function() {
        await container.start()
      });

      await core.group('Wait for checkmk container startup', async function() {
        for (var backoff = 0; backoff < 50; backoff += 5) {
          if (await container.health() == 'healthy') {
            console.log(`Container is healthy!`)
            break;
          }
          console.log(`Container is not yet healthy, wait for ${backoff}s`)
          await wait(backoff*1000);
        }
      });

      await core.group('Copy files', async function() {
        let dirs = ['checkman','checks'];
        for (let dir of dirs) {
          let path = `${basedir}/${dir}`
          if (fs.existsSync(path)) {
            console.log(`Copy: ${dir}`)
            await container.copy(path, 'cmk:/omd/sites/cmk/local/share/check_mk');
          } else {
            console.log(`Skip: ${dir}`)
          }
        }
        await container.copy(`${basedir}/${pkgFile}`, `cmk:/omd/sites/cmk/var/check_mk/packages/${metadata.name}`)
      });

      await core.group('Build package', async function() {
        await container.run(`mkp -v pack ${metadata.name}`)
      });

      await core.group('Fetch package', async function() {
        await container.copy(`cmk:/omd/sites/cmk/${metadata.name}-${metadata.version}.mkp`, basedir)
      });
    } finally {
      await core.group('Stop checkmk container', async function() {
        await container.stop()
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
