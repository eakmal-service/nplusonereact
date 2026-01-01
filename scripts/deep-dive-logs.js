const { Client } = require('ssh2');

const config = {
    host: '72.61.229.171',
    port: 22,
    username: 'root',
    password: ')vbofQi/lHXSMqF?Nk8E',
};

const commands = [
    'echo "=== MEMORY CHECK ==="',
    'free -h',
    'echo "=== DISK SPACE ==="',
    'df -h',
    'echo "=== OOM KILLER LOGS ==="',
    'dmesg | grep -i "kill" | tail -n 10',
    'echo "=== PM2 LOGS TIMESTAMP ANALYSIS ==="',
    'ls -l /root/.pm2/logs/',
    'grep -C 2 "EADDRINUSE" /root/.pm2/logs/nplusone-error.log | tail -n 20',
    'echo "=== RECENT COMMANDS (BASH HISTORY) ==="',
    'tail -n 20 /root/.bash_history',
    'echo "=== UPTIME ==="',
    'uptime'
];

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');

    let cmdIndex = 0;

    function executeNext() {
        if (cmdIndex >= commands.length) {
            console.log('Investigation complete');
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
                cmdIndex++;
                executeNext();
            }).on('data', (data) => {
                console.log(data.toString());
            }).stderr.on('data', (data) => {
                // Warning: some legitimate commands output to stderr (like time)
                // but we print it anyway for debug
                console.log(data.toString());
            });
        });
    }

    executeNext();

}).connect(config);
