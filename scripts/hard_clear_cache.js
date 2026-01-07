#!/usr/bin/env node

const { Client } = require('ssh2');
require('dotenv').config({ path: '.env.local' });

const conn = new Client();

conn.on('ready', () => {
    console.log('Connected to VPS');

    // Commands to:
    // 1. Stop the app
    // 2. Delete the Next.js cache folder (this is the key step!)
    // 3. Start the app again
    const command = 'pm2 stop nplusone && rm -rf /var/www/nplusone/.next/cache && pm2 start nplusone && pm2 save';

    console.log('Executing:', command);

    conn.exec(command, (err, stream) => {
        if (err) throw err;

        stream.on('close', (code) => {
            console.log('✅ Cache deleted and server restarted successfully');
            conn.end();
        }).on('data', (data) => {
            console.log(data.toString());
        }).stderr.on('data', (data) => {
            console.error(data.toString());
        });
    });
}).connect({
    host: process.env.VPS_HOST,
    port: 22,
    username: process.env.VPS_USER,
    password: process.env.VPS_PASSWORD
});
