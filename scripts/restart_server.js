#!/usr/bin/env node

const { Client } = require('ssh2');
require('dotenv').config({ path: '.env.local' });

const conn = new Client();

conn.on('ready', () => {
    console.log('Connected to VPS');

    conn.exec('pm2 restart nplusone && pm2 save', (err, stream) => {
        if (err) throw err;

        stream.on('close', (code) => {
            console.log('✅ PM2 restarted - cache cleared');
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
