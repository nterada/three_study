'use strict';

const glob = require('glob');
const fs = require('fs');


const entries = {};
const addEntries = (srcDir, distDir) => {
  const files = fs.readdirSync(srcDir);
  files.forEach((file) => {
    if (file.startsWith('_')) return;
    entries[`${distDir}/${file.split('.')[0]}`] = `${srcDir}/${file}`;
  })
};

addEntries('./src/css', '/htdocs/assets/css');
addEntries('./src/js', '/htdocs/assets/js');

module.exports = {
  server: {
    port            : 6969,
    root_path       : 'htdocs',
    additional_paths: [],
    start_path      : '/',
    open            : 'external',
    docker_service  : '',
  },
  entries,
};


