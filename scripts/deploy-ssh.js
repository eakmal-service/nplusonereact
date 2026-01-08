const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables locally
const envPath = path.resolve(__dirname, '../.env.local');
let envContent = '';
if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    // Simple manual parsing to populate process.env for this script execution
    envContent.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.join('=').trim();
        }
    });
}

const config = {
    host: process.env.VPS_HOST || '72.61.229.171',
    port: 22,
    username: process.env.VPS_USER || 'root',
    password: process.env.VPS_PASSWORD,
};

const commands = [
    'apt-get update -y',
    'apt-get install -y curl git debian-keyring debian-archive-keyring apt-transport-https',
    // Install Caddy (if not exists)
    'if ! command -v caddy &> /dev/null; then curl -1sLf "https://dl.cloudsmith.io/public/caddy/stable/gpg.key" | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg; curl -1sLf "https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt" | tee /etc/apt/sources.list.d/caddy-stable.list; apt-get update; apt-get install caddy -y; fi',
    // Install Node.js 20 if not exists
    'if ! command -v node &> /dev/null; then curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs; fi',
    // Install PM2
    'npm install -g pm2',
    // Setup Directory
    'mkdir -p /var/www',
    // Clone or Pull
    'if [ -d "/var/www/nplusone" ]; then cd /var/www/nplusone && git remote set-url origin https://github.com/eakmal-service/Nplus-final-.git && git reset --hard HEAD && git pull; else git clone https://github.com/eakmal-service/Nplus-final-.git /var/www/nplusone; fi',
    'cd /var/www/nplusone',
    // Write .env.local (This is tricky via shell, using printf)
    `printf "${envContent.replace(/\n/g, '\\n').replace(/"/g, '\\"')}" > /var/www/nplusone/.env.local`,
    // Install Dependencies
    'cd /var/www/nplusone && npm install',
    // Build (Clean first)
    'cd /var/www/nplusone && rm -rf .next && npm run build',
    // Copy static files for standalone mode
    'cp -r /var/www/nplusone/public /var/www/nplusone/.next/standalone/public',
    'cp -r /var/www/nplusone/.next/static /var/www/nplusone/.next/standalone/.next/static',
    'cp /var/www/nplusone/.env.local /var/www/nplusone/.next/standalone/.env.local', // Ensure env vars are loaded
    // Restart PM2 (ON PORT 3000 now)
    'pm2 delete nplusone || true',
    'fuser -k -n tcp 3000 || true', // Ensure port 3000 is free
    'cd /var/www/nplusone && PORT=3000 pm2 start node --name "nplusone" -- .next/standalone/server.js',
    'pm2 save',
    // Configure Caddy
    'printf "nplusonefashion.com {\\n    reverse_proxy localhost:3000\\n}" > /etc/caddy/Caddyfile',
    'systemctl reload caddy'
];

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');

    // Chain commands
    let cmdIndex = 0;

    function executeNext() {
        if (cmdIndex >= commands.length) {
            console.log('All commands executed successfully');
            conn.end();
            return;
        }

        const cmd = commands[cmdIndex];
        console.log(`Executing: ${cmd.substring(0, 50)}...`);

        conn.exec(cmd, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                if (code !== 0 && !cmd.includes('pm2 delete')) {
                    console.error(`Command failed: ${cmd}`);
                    conn.end();
                    process.exit(1);
                }
                cmdIndex++;
                executeNext();
            }).on('data', (data) => {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }

    executeNext();

}).connect(config);
