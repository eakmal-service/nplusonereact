const { Client } = require('ssh2');

const config = {
    host: '72.61.229.171',
    port: 22,
    username: 'root',
    password: ')vbofQi/lHXSMqF?Nk8E',
};

const commands = [
    'echo "=== DOCKER PROCESSES ==="',
    'docker ps -a',
    'echo "=== DOCKER LOGS (nplusone-web) ==="',
    'docker logs --tail 50 nplusone-web',
    'echo "=== PM2 PROCESSES ==="',
    'pm2 list',
    'echo "=== PM2 LOGS (nplusone) ==="',
    'pm2 logs nplusone --lines 50 --nostream',
    'echo "=== CADDY STATUS ==="',
    'systemctl status caddy | head -n 10',
    'echo "=== CHECKING PORT 80/443 USAGE ==="',
    'netstat -tulpn | grep -E ":80|:443|:3000"'
];

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');
    let cmdIndex = 0;

    function executeNext() {
        if (cmdIndex >= commands.length) {
            console.log('All commands executed');
            conn.end();
            return;
        }

        const cmd = commands[cmdIndex];
        console.log(`\n\n>>> EXECUTING: ${cmd} <<<`);

        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.error('Exec error: ' + err);
                cmdIndex++;
                executeNext();
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
}).connect(config);
