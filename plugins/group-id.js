const { cmd } = require('../command');

// Fake ChatGPT vCard
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© Mr Hiruka",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:Meta
ORG:META AI;
TEL;type=CELL;type=VOICE;waid=94762095304:+94762095304
END:VCARD`
        }
    }
};

cmd({
  pattern: "gid",
  alias: ["groupid", "grouplinkinfo"],
  react: "🔎",
  desc: "Get Group info from invite link",
  category: "whatsapp",
  filename: __filename
}, async (conn, mek, m, {
  from,
  q,
  reply
}) => {

  try {

    if (!q) {
      return reply("*Please provide a WhatsApp Group link.*\n\nExample:\n.gid https://chat.whatsapp.com/xxxxxxxx");
    }

    // Extract Invite Code
    const match = q.match(/chat\.whatsapp\.com\/([\w-]+)/);

    if (!match) {
      return reply("⚠️ *Invalid group link format.*\n\nMake sure it looks like:\nhttps://chat.whatsapp.com/xxxxxxxx");
    }

    const inviteCode = match[1];

    let metadata;
    try {
      metadata = await conn.groupGetInviteInfo(inviteCode);
    } catch (e) {
      return reply("*❌ Failed to fetch group info. The link may be invalid or expired.*");
    }

    if (!metadata || !metadata.id) {
      return reply("❌ Group not found or inaccessible.");
    }

    const infoText = `*— 乂 Group Link Info —*\n\n` +
      `🆔 *Group ID:* ${metadata.id}\n` +
      `📛 *Name:* ${metadata.subject}\n` +
      `📝 *Description:* ${metadata.desc || "No description"}\n` +
      `👑 *Owner:* ${metadata.owner || "Unknown"}\n` +
      `👥 *Members:* ${metadata.size || "Unknown"}\n` +
      `📅 *Created:* ${metadata.creation ? new Date(metadata.creation * 1000).toLocaleString("id-ID") : "Unknown"}\n\n` +
      `> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

    // Send with group profile picture if available
    let pp;
    try {
      pp = await conn.profilePictureUrl(metadata.id, "image");
    } catch {
      pp = null;
    }

    if (pp) {
      await conn.sendMessage(from, {
        image: { url: pp },
        caption: infoText
      }, { quoted: fakevCard });
    } else {
      await reply(infoText);
    }

  } catch (error) {
    console.error("❌ Error in gid plugin:", error);
    reply("*Error fetching group link info*");
  }

});
