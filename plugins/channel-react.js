const { cmd } = require("../command");

cmd({
  pattern: "rch",
  react: "🤖",
  desc: "React to WhatsApp channel post via link (FAKE)",
  category: "fun",
  use: ".rch <post_link> <emoji>",
  filename: __filename
},
async (conn, mek, m, { from }) => {

  const reply = (text) =>
    conn.sendMessage(from, { text }, { quoted: m });

  // get full text safely
  const body =
    m.text ||
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    "";

  const args = body.trim().split(/\s+/).slice(1);

  if (args.length < 1) {
    return reply("❌ Usage:\n.rch <channel_post_link> <emoji>");
  }

  const postLink = args[0];
  const emoji = args[1] || "💛"; // default emoji

  if (!postLink.includes("whatsapp.com/channel")) {
    return reply("❌ Invalid channel post link!");
  }

  // show loading reaction
  await conn.sendMessage(from, {
    react: { text: "⏳", key: m.key }
  });

  await new Promise(r => setTimeout(r, 1200));

  // final fake success message (same style as screenshot)
  return reply(
`🤖 *REACTION SENT (LINK MODE)*
━━━━━━━━━━━━━━
🔗 Post: ${postLink}
😀 Emoji: ${emoji}
✅ Status: Done`
  );
});
