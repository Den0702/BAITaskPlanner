const fsp = require('fs').promises;
const { modifyFileContents, execAsync,  } = require('./__utils');

(async () => {
  await fsp.access('./www').catch(async () => await fsp.mkdir('./www/'));
  await fsp.access('./www/index.html').catch(async () => await fsp.writeFile('./www/index.html',''));

  require('dns').lookup(require('os').hostname(), async function (err, addr, fam) {
    
    await fsp.copyFile('./config-template.xml','./config.xml');

    await modifyFileContents('./config.xml', (contents) => contents.replace(/192\.168\.\d+\.\d+/g, addr))

    await modifyFileContents('./plugins/cordova-universal-links-plugin/hooks/lib/android/manifestWriter.js', contents => contents.replace(
      `var pathToManifest = path.join(cordovaContext.opts.projectRoot, 'platforms', 'android', 'AndroidManifest.xml');`,
      `var pathToManifest = path.join(
        cordovaContext.opts.projectRoot, 
        'platforms', 
        'android', 
        'app', 
        'src', 
        'main', 
        'AndroidManifest.xml');`
    ));
    console.log('addr: '+addr);
  })
})()