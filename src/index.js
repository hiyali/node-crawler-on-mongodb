import path from 'path'
import childProcess from 'child_process'
import phantomjs from 'phantomjs-prebuilt'

const binPath = phantomjs.path
const globalArg = 'https://www.so.com' || 'some other argument (passed to phantomjs script)'

/*
  */
const runSpider = (file = 'phantom.js') => {
  const childArgs = [
    path.join(__dirname, file),
    globalArg
  ]
  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    console.log(err, stdout, stderr)
  })
}
runSpider()

/*
const runPhantom = (file = 'src/phantom.js') => {
  const program = phantomjs.exec(file, globalArg)

  program.stdout.pipe(process.stdout)
  program.stderr.pipe(process.stderr)

  program.on('exit', code => {
    console.log('exits phantomjs')
  })
}

runPhantom()
*/
