const { Client } = require('ssh2');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env just to get credentials
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const config = {
    host: process.env.VPS_HOST || '72.61.229.171',
    port: 22,
    username: process.env.VPS_USER || 'root',
    password: process.env.VPS_PASSWORD,
};

const commands = [
    // Print first and last characters of the key (safe to see if it's corrupted)
    'echo "Checking SUPABASE_SERVICE_ROLE_KEY on server:"',
    'cat /var/www/nplusone/.env.local | grep SUPABASE_SERVICE_ROLE_KEY | head -c 40',
    'echo "..."',
    'cat /var/www/nplusone/.env.local | grep SUPABASE_SERVICE_ROLE_KEY | tail -c 20',
    'echo ""',
    // Fetch logs
    'pm2 logs nplusone --lines 50 --nostream'
];

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');
    let cmdIndex = 0;

    function executeNext() {
        if (cmdIndex >= commands.length) {
            conn.end();
            return;
        }
        const cmd = commands[cmdIndex];
        console.log(`\n\n=== EXECUTING: ${cmd} ===`);
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
