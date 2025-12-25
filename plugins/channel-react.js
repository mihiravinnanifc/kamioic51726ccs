const { cmd } = require("../command");

cmd({
  pattern: "creact",
  react: "📢",
  desc: "React to channel message (link + space + emojis)",
  category: "channel",
  use: ".creact <link> 🙂,🙃,😊",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) {
      return reply(
        "❌ Use:\n.creact <channel_link> 🙂,🙃,😊"
      );
    }

    // split by first space
    const splitIndex = q.indexOf(" ");
    if (splitIndex === -1)
      return reply("❌ Space ekak one link ekata passe");

    const link = q.slice(0, splitIndex).trim();
    const emojiText = q.slice(splitIndex + 1).trim();

    const emojis = emojiText
      .split(",")
      .map(e => e.trim())
      .filter(Boolean);

    if (!emojis.length)
      return reply("❌ Emoji list eka hari naha");

    // extract channel + message id
    const match = link.match(
      /whatsapp\.com\/channel\/([A-Za-z0-9_-]+)\/([0-9]+)/
    );

    if (!match)
      return reply("❌ Invalid WhatsApp channel message link");

    const channelId = match[1];
    const messageId = match[2];

    const channelJid = `${channelId}@newsletter`;

    const key = {
      remoteJid: channelJid,
      id: messageId,
      fromMe: false
    };

    // send reactions one by one
    for (const emoji of emojis) {
      await conn.sendMessage(channelJid, {
        react: {
          text: emoji,
          key
        }
      });
      await new Promise(r => setTimeout(r, 700));
    }

    reply(`✅ React sent: ${emojis.join(" ")}`);

  } catch (err) {
    console.error("Channel react error:", err);
    reply(
      "❌ React failed\n\nReasons:\n• Bot not channel admin\n• Old message\n• WhatsApp/Baileys limitation"
    );
  }
});
