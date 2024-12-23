const config = require('./config');
const browserSync = require('browser-sync');
const exec = require('child_process').exec;

const PRODUCTION = process.env.NODE_ENV === 'production';

const startServer = () => {
  const bs = browserSync.create();
  bs.watch(config.server.root_path).on('change', function (file) {
    console.log('[bs] file changed: ', file);
  });
  return bs.init(
    {
      server   : {
        baseDir  : config.server.root_path,
        directory: true,
      },
      port     : config.server.port,
      ui       : {
        port: config.server.port + 1,
      },
      files    : [
        config.server.root_path,
      ],
      startPath: config.server.start_path,
      open     : config.server.open,
      ghostMode: false,
    },
    (err) => {
      if (err) return console.error('[browser-sync] error', err);
    },
  );
};

const webpack = ()=> {
  if(PRODUCTION) {
    //build
    return exec([
      'NODE_ENV=production',
      'webpack',
      '--mode production',
      '--progress',
    ].join(' '));
  } else {
    //watch
    return exec([
      'webpack',
      '--mode development',
      '--progress',
      '--watch',
    ].join(' '));
  }
}

const main = () => {
  startServer();
  webpack();
  return true;
};

module.exports = main();
