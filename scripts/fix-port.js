const { Client } = require('ssh2');

const config = {
    host: '72.61.229.171',
    port: 22,
    username: 'root',
    password: ')vbofQi/lHXSMqF?Nk8E',
};

const commands = [
    'fuser -k -n tcp 3000', // Kill whatever is on port 3000
    'sleep 2',
    'pm2 restart nplusone',
    'pm2 save'
];

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');

    let cmdIndex = 0;

    function executeNext() {
        if (cmdIndex >= commands.length) {
            console.log('Fix commands executed');
            conn.end();
            return;
        }

        const cmd = commands[cmdIndex];
        console.log(`\n>>> Executing: ${cmd}`);

        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.log('Error executing command (might be okay if nothing to kill): ' + err.message);
            }
            if (stream) {
                stream.on('close', (code, signal) => {
                    console.log('Command finished with code ' + code);
                    cmdIndex++;
                    executeNext();
                }).on('data', (data) => {
                    console.log(data.toString());
                }).stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
            } else {
                cmdIndex++;
                executeNext();
            }
        });
    }

    executeNext();

}).connect(config);
