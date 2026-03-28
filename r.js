// index.js
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const handler = require('./handler');
const config = require('./config');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(`./${config.sessionName}`);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ['Chrome', 'Linux', '1.0'],
        syncFullHistory: false,
        markOnlineOnConnect: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) qrcode.generate(qr, { small: true });
        if (connection === 'open') console.log('✅ Connected as:', sock.user.id);
        if (connection === 'close') startBot();
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const msg = messages[0];
        if (!msg.message) return;
        await handler.handleMessage(sock, msg).catch(console.error);
    });

    sock.ev.on('group-participants.update', async (update) => {
        await handler.handleGroupUpdate(sock, update).catch(console.error);
    });

    return sock;
}

console.log('🚀 Starting bot...');
startBot().catch(console.error);
