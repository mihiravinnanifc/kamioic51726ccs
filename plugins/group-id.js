const { cmd } = require('../command');
const { getBuffer } = require('../lib/functions');

// Fake vCard
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
  alias: ["groupid"],
  react: "🖼️",
  desc: "Get Group info from invite link",
  category: "whatsapp",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {

  try {

    if (!q) {
      return reply("Provide group link.\nExample:\n.gid https://chat.whatsapp.com/xxxx");
    }

    const match = q.match(/chat\.whatsapp\.com\/([\w-]+)/);
    if (!match) return reply("Invalid group link.");

    const inviteCode = match[1];

    // Get invite info
    const inviteInfo = await conn.groupGetInviteInfo(inviteCode);

    if (!inviteInfo?.id) {
      return reply("Group not found.");
    }

    const groupJid = inviteInfo.id;

    // 🔥 IMPORTANT: Get full metadata using JID
    const metadata = await conn.groupMetadata(groupJid);

    const text = `*「 Group Link Info 」*\n
🔥 Name: ${metadata.subject}
🆔 ID: ${metadata.id}
👥 Members: ${metadata.size}
👑 Owner: ${metadata.owner || "Unknown"}
📃 Description: ${metadata.desc || "No description"}
📅 Created: ${metadata.creation ? new Date(metadata.creation * 1000).toLocaleString() : "Unknown"}

> © Powered by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

    // 🔥 Get profile picture (NOW WORKS)
    let pp;
    try {
      const ppUrl = await conn.profilePictureUrl(groupJid, "image");
      pp = await getBuffer(ppUrl);
    } catch {
      pp = await getBuffer("https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png");
    }

    await conn.sendMessage(from, {
      image: pp,
      caption: text
    }, { quoted: fakevCard });

  } catch (err) {
    console.log(err);
    reply("Error fetching group info.");
  }

});
