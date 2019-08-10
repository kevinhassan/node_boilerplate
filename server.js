const chalk = require('chalk');

/* eslint-disable import/order */
const app = require('./app');
const server = require('http').Server(app);
/* eslint-enable import/order */

server.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});
