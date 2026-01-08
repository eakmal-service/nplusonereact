const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

// Load environment variables locally
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.join('=').trim();
        }
    });
}

// Configuration
const config = {
    host: process.env.VPS_HOST || '109.106.255.234',
    port: 22,
    username: process.env.VPS_USER || 'root',
    password: process.env.VPS_PASSWORD
};

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('pm2 logs nplusone --lines 100 --nostream', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).connect(config);
