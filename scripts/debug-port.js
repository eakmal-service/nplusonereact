const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
    host: '72.61.229.171',
    port: 22,
    username: 'root',
    password: ')vbofQi/lHXSMqF?Nk8E',
};

const commands = [
    'netstat -nlp | grep 3000',
    'docker ps',
    'lsof -i :3000',
    'ps aux | grep node'
];

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');

    let cmdIndex = 0;

    function executeNext() {
        if (cmdIndex >= commands.length) {
            console.log('All debug commands executed');
            conn.end();
            return;
        }

        const cmd = commands[cmdIndex];
        console.log(`\n>>> Executing: ${cmd}`);

        conn.exec(cmd, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
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
