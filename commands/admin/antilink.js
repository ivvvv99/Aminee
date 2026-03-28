const database = require('../../database');

// 🧠 Ultra regex (normal + known platforms)
const urlRegex = /((https?:\/\/|www\.)[^\s]+)|(chat\.whatsapp\.com|wa\.me|t\.me|discord\.gg|instagram\.com|tiktok\.com|youtube\.com|youtu\.be|facebook\.com|fb\.watch)/i;

// 🧠 Extract text from ALL layers
function extractText(msg) {
  const m = msg.message;
  if (!m) return '';

  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.templateMessage?.hydratedTemplate?.hydratedContentText ||
    m.buttonsResponseMessage?.selectedDisplayText ||
    m.listResponseMessage?.title ||
    m.ephemeralMessage?.message?.extendedTextMessage?.text ||
    m.viewOnceMessage?.message?.imageMessage?.caption ||
    m.viewOnceMessage?.message?.videoMessage?.caption ||
    ''
  );
}

// 🧠 Extract context (ALL possible containers)
function getContext(msg) {
  const m = msg.message;

  return (
    m?.extendedTextMessage?.contextInfo ||
    m?.imageMessage?.contextInfo ||
    m?.videoMessage?.contextInfo ||
    m?.viewOnceMessage?.message?.imageMessage?.contextInfo ||
    m?.viewOnceMessage?.message?.videoMessage?.contextInfo ||
    m?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo ||
    m?.ephemeralMessage?.message?.imageMessage?.contextInfo ||
    m?.ephemeralMessage?.message?.videoMessage?.contextInfo ||
    null
  );
}

// 🧠 Deep link detection engine (multi-layer)
function hasLink(msg) {
  const text = extractText(msg);

  // 1️⃣ direct regex
  if (urlRegex.test(text)) return true;

  const ctx = getContext(msg);

  if (ctx) {
    // 2️⃣ preview links (Instagram / TikTok / etc)
    if (ctx.externalAdReply?.sourceUrl) return true;
    if (ctx.externalAdReply?.mediaUrl) return true;

    // 3️⃣ hidden WhatsApp parsed links
    if (ctx.matchedText) return true;
    if (ctx.canonicalUrl) return true;

    // 4️⃣ invite detection
    if (ctx.groupInviteLink) return true;
  }

  return false;
}

module.exports = {
  name: 'antilink',
  category: 'admin',
  description: 'Ultimate antilink system',
  usage: '.antilink <on/off/set/get>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      const settings = database.getGroupSettings(extra.from);

      if (!args[0]) {
        return extra.reply(
`🔗 *Antilink Status*
Status: *${settings.antilink ? 'ON' : 'OFF'}*
Action: *${settings.antilinkAction || 'delete'}*`
        );
      }

      const opt = args[0].toLowerCase();

      if (opt === 'on') {
        database.updateGroupSettings(extra.from, { antilink: true });
        return extra.reply('*Antilink ON*');
      }

      if (opt === 'off') {
        database.updateGroupSettings(extra.from, { antilink: false });
        return extra.reply('*Antilink OFF*');
      }

      if (opt === 'set') {
        const action = args[1];
        if (!['delete', 'kick'].includes(action))
          return extra.reply('*Use: delete | kick*');

        database.updateGroupSettings(extra.from, {
          antilink: true,
          antilinkAction: action
        });

        return extra.reply(`*Action set to ${action}*`);
      }

    } catch (e) {
      await extra.reply(`❌ ${e.message}`);
    }
  },

  // 🔥 REAL-TIME DETECTION ENGINE
  listen: async function(sock) {
    sock.ev.on('messages.upsert', async (m) => {
      const msg = m.messages[0];

      if (!msg.message || msg.key.fromMe) return;
      if (!msg.key.remoteJid.endsWith('@g.us')) return;

      const jid = msg.key.remoteJid;
      const sender = msg.key.participant;

      const settings = database.getGroupSettings(jid);
      if (!settings?.antilink) return;

      // 🧠 DETECT
      if (!hasLink(msg)) return;

      // 👑 GET ADMINS
      const metadata = await sock.groupMetadata(jid);
      const admins = metadata.participants
        .filter(p => p.admin)
        .map(p => p.id);

      if (admins.includes(sender)) return;

      const action = settings.antilinkAction || 'delete';

      // 🧹 DELETE
      await sock.sendMessage(jid, { delete: msg.key });

      // ⚠️ WARN
      await sock.sendMessage(jid, {
        text: `🚫 @${sender.split("@")[0]} mamno3 links 😭`,
        mentions: [sender]
      });

      // 💀 KICK
      if (action === 'kick') {
        await sock.groupParticipantsUpdate(jid, [sender], 'remove');
      }
    });
  }
};
