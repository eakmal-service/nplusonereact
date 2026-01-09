const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

// Hardcoded Credentials
const config = {
    host: '72.61.229.171',
    port: 22,
    username: 'root',
    password: ')vbofQi/lHXSMqF?Nk8E',
};

// Load environment variables for .env.local
const envPath = path.resolve(__dirname, '../.env.local');
let envContent = '';
if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
}

const commands = [
    'echo "Starting PM2 Deployment Fix (Robust Mode)..."',
    'mkdir -p /var/www',
    // Robust Git Logic
    'if [ -d "/var/www/nplusone/.git" ]; then echo "Repo exists, pulling..."; cd /var/www/nplusone && git remote set-url origin https://github.com/eakmal-service/Nplus-final-.git && git reset --hard HEAD && git pull; else echo "Repo missing or invalid, cloning..."; rm -rf /var/www/nplusone; git clone https://github.com/eakmal-service/Nplus-final-.git /var/www/nplusone; fi',

    // Write .env.local
    `printf "${envContent.replace(/\n/g, '\\n').replace(/"/g, '\\"')}" > /var/www/nplusone/.env.local`,

    // Clean Install
    'echo "Cleaning node_modules and .next..."',
    'cd /var/www/nplusone && rm -rf node_modules .next',
    'echo "Installing dependencies..."',
    'cd /var/www/nplusone && npm install',

    // Build
    'echo "Building..."',
    'cd /var/www/nplusone && npm run build',

    // Copy standalone assets
    'echo "Copying standalone assets..."',
    'cp -r /var/www/nplusone/public /var/www/nplusone/.next/standalone/public',
    'cp -r /var/www/nplusone/.next/static /var/www/nplusone/.next/standalone/.next/static',
    'cp /var/www/nplusone/.env.local /var/www/nplusone/.next/standalone/.env.local',

    // Restart PM2
    'echo "Restarting PM2..."',
    'pm2 delete nplusone || true',
    'fuser -k -n tcp 3000 || true',
    'cd /var/www/nplusone && PORT=3000 pm2 start node --name "nplusone" -- .next/standalone/server.js',
    'pm2 save',
    'echo "Deployment Complete!"'
];

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');
    let cmdIndex = 0;

    function executeNext() {
        if (cmdIndex >= commands.length) {
            console.log('All commands executed successfully');
            conn.end();
            return;
        }

        const cmd = commands[cmdIndex];
        if (cmd.startsWith('printf')) {
            console.log(`Executing: printf "..." > .env.local`);
        } else {
            console.log(`Executing: ${cmd.substring(0, 100)}...`);
        }

        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.error('Exec error: ' + err);
                conn.end();
                return;
            }
            stream.on('close', (code, signal) => {
                if (code !== 0 && !cmd.includes('pm2 delete') && !cmd.includes('fuser')) {
                    console.error(`Command failed with code ${code}`);
                    conn.end();
                    return;
                }
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
