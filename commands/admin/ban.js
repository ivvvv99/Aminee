const fs = require('fs');

// blacklist.json كيحتفظ بالأرقام الممنوعة
let blacklist = [];
if (fs.existsSync('./blacklist.json')) {
    blacklist = JSON.parse(fs.readFileSync('./blacklist.json', 'utf-8'));
}

// Dummy sock object for example (replace with real WhatsApp socket)
const sock = {
    sendMessage: (jid, message) => console.log(`Sending to ${jid}: ${message}`)
};

// Mock message receive
function onMessage(msg) {
    const sender = msg.from; // رقم المرسل
    if (blacklist.includes(sender)) {
        console.log(`User ${sender} is banned. Ignoring message.`);
        sock.sendMessage(sender, { text: "🚫 You are banned from using this bot!" });
        return;
    }

    // هنا كتشغل السكريبت الرئيسي
    script(msg);
}

// ban function
function banUser(jid) {
    if (!blacklist.includes(jid)) {
        blacklist.push(jid);
        fs.writeFileSync('./blacklist.json', JSON.stringify(blacklist, null, 2));
        console.log(`User ${jid} has been banned.`);
    }
}

// Example script function
function script(msg) {
    sock.sendMessage(msg.from, { text: `Hello ${msg.from}! You can use the bot.` });
}

// Example usage
onMessage({ from: '12345', body: 'hi' });   // allowed
banUser('12345');                             // banning
onMessage({ from: '12345', body: 'hi' });   // now banned
