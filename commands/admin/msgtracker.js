const userMessages = new Map();

function trackMessage(msg) {
  try {
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!sender) return;

    if (!userMessages.has(sender)) {
      userMessages.set(sender, []);
    }

    userMessages.get(sender).push(msg.key);

    // 🧠 limit cache باش مايتفجرش RAM
    if (userMessages.get(sender).length > 50) {
      userMessages.get(sender).shift();
    }

  } catch (e) {
    console.error('Tracking error:', e);
  }
}

function getMessages(user) {
  return userMessages.get(user) || [];
}

function clearMessages(user) {
  userMessages.delete(user);
}

module.exports = { trackMessage, getMessages, clearMessages };
