'use strict'

import {join} from 'path'
import {tmpdir} from 'os'
import {realpathSync} from'fs'

const getCacheDirectory = () => {
  const {getuid} = process
  const tmpdirPath = join(realpathSync(tmpdir()), 'jest')
  if (getuid == null) {
    return tmpdirPath
  }
  // On some platforms tmpdir() is `/tmp`, causing conflicts between different
  // users and permission issues. Adding an additional subdivision by UID can
  // help.
  return `${tmpdirPath}_${getuid.call(process).toString(36)}`
}

module.exports = {
  'reporter': ['json', 'lcov', 'text', 'clover'],
  'temp-dir': getCacheDirectory(),
  'check-coverage': true,
  'branches': 80,
  'lines': 80,
  'functions': 80,
  'statements': 80
}