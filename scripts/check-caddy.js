const { Client } = require('ssh2');

const config = {
    host: '72.61.229.171',
    port: 22,
    username: 'root',
    password: ')vbofQi/lHXSMqF?Nk8E',
};

const commands = [
    'curl -v http://localhost:3000',
    'cat /var/log/caddy/access.log | tail -n 5' // detailed logs if configured, else just skip
];

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');

    let cmdIndex = 0;

    function executeNext() {
        if (cmdIndex >= commands.length) {
            console.log('Caddy check executed');
            conn.end();
            return;
        }

        const cmd = commands[cmdIndex];
        console.log(`\n>>> Executing: ${cmd}`);

        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.log('Error executing command: ' + err.message);
                cmdIndex++;
                executeNext();
                return;
            }
            stream.on('close', (code, signal) => {
                // console.log('Command finished with code ' + code);
                cmdIndex++;
                executeNext();
            }).on('data', (data) => {
                console.log(data.toString());
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }

    executeNext();

}).connect(config);
