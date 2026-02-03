const { Client } = require('ssh2');

const config = {
    host: '72.61.229.171',
    port: 22,
    username: 'root',
    password: ')vbofQi/lHXSMqF?Nk8E',
    readyTimeout: 30000,
};

const commands = [
    'echo "=== MEMORY/CPU ==="',
    'free -h',
    'uptime',
    'echo',
    'echo "=== NGINX STATUS ==="',
    'systemctl status nginx --no-pager',
    'echo',
    'echo "=== PM2 LIST ==="',
    'pm2 list',
    'echo',
    'echo "=== APP CONNECTIVITY ==="',
    'curl -I http://localhost:3000 || echo "Curl failed"',
    'echo',
    'echo "=== PM2 LOGS (Last 50 lines) ==="',
    'tail -n 50 /root/.pm2/logs/nplusone-error.log || echo "Log file not found of nplusone"',
    'tail -n 50 /root/.pm2/logs/nplusone-web-error.log || echo "Log file not found of nplusone-web"',
];

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');
    let cmdIndex = 0;

    function executeNext() {
        if (cmdIndex >= commands.length) {
            console.log('Done');
            conn.end();
            return;
        }
        const cmd = commands[cmdIndex];
        console.log(`\n> ${cmd}`);

        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.error('Exec error:', err);
                conn.end();
                return;
            }
            stream.on('close', (code, signal) => {
                cmdIndex++;
                executeNext();
            }).on('data', (data) => {
                process.stdout.write(data);
            }).stderr.on('data', (data) => {
                process.stderr.write(data);
            });
        });
    }

    executeNext();
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(config);
