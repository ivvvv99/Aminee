/**
 * Warn Command - Warn a user
 */

const database = require('../../database');
const config = require('../../config');

module.exports = {
  name: 'warn',
  aliases: ['warning'],
  category: 'admin',
  description: 'Warn a user',
  usage: '.warn @user <reason>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,
  async execute(sock, msg, args, extra) {
    try {
      let target;
      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const mentioned = ctx?.mentionedJid || [];

      if (mentioned && mentioned.length > 0) {
        target = mentioned[0];
      } else if (ctx?.participant && ctx.stanzaId && ctx.quotedMessage) {
        target = ctx.participant;
      } else {
        return extra.reply('❌ Please mention or reply to the user to warn!\n\nExample: .warn @user Breaking rules');
      }

      // Reason typed after .warn command
      const reason = args.slice(mentioned.length > 0 ? 1 : 0).join(' ') || 'No reason specified';

      // Cannot warn admins
      const foundParticipant = extra.groupMetadata.participants.find(
        p => (p.id === target || p.lid === target) && (p.admin === 'admin' || p.admin === 'superadmin')
      );

      if (foundParticipant) {
        return extra.reply('❌ Cannot warn an admin!');
      }

      // Add warning in database
      const warnings = database.addWarning(extra.from, target, reason);

      // Customized warn message
      let text = `@${target.split('@')[0]} ¡wax ba4ini nhbt tbonmok!🤓\n`;
      text += `Reason: ${reason}\n`;
      text += `Warnings: ${warnings.count}/${config.maxWarnings}`;

      await sock.sendMessage(extra.from, {
        text,
        mentions: [target]
      }, { quoted: msg });

      // If user reached max warnings, remove from group
      if (warnings.count >= config.maxWarnings && extra.isBotAdmin) {
        await sock.groupParticipantsUpdate(extra.from, [target], 'remove');
        database.clearWarnings(extra.from, target);
      }

    } catch (error) {
      await extra.reply(`❌ Error: ${error.message}`);
    }
  }
};
