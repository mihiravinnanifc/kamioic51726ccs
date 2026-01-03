const axios = require("axios");
const { cmd } = require("../command");

// Fake vCard
const fakevCard = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
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
    pattern: "instagram",
    alias: ["insta"],
    react: "📥",
    desc: "Download Instagram Video / Audio",
    category: "download",
    use: ".instagram <url>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q || !q.startsWith("http")) return reply("❌ Please provide a valid Instagram link");
        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data.data?.length) return reply("❌ Failed to fetch Instagram media");

        const mediaList = data.data;

        let caption = "*📥 RANUMITHA-X-MD INSTAGRAM DOWNLOADER*\n\n";
        mediaList.forEach((m, i) => {
            caption += `${i + 1}️⃣ ${m.type.toUpperCase()}\n`;
        });
        caption += `\n🔢 Reply number to download\n> © RANUMITHA-X-MD 🌛`;

        const sentMsg = await conn.sendMessage(from, { image: { url: mediaList[0].thumbnail }, caption }, { quoted: fakevCard });
        const messageID = sentMsg.key.id;

        const handler = async ({ messages }) => {
            const msg = messages[0];
            if (!msg?.message) return;

            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            const isReply = msg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
            if (!isReply) return;

            conn.ev.off("messages.upsert", handler); // Remove listener

            const index = parseInt(text.trim()) - 1;
            if (isNaN(index) || !mediaList[index]) return reply("❌ Invalid option");

            const media = mediaList[index];

            await conn.sendMessage(from, { react: { text: "⬇️", key: msg.key } });
            await conn.sendMessage(from, { react: { text: "⬆️", key: msg.key } });

            if (media.type === "video") {
                await conn.sendMessage(from, { video: { url: media.url }, mimetype: "video/mp4" }, { quoted: msg });
            } else if (media.type === "image") {
                await conn.sendMessage(from, { image: { url: media.url } }, { quoted: msg });
            } else if (media.type === "audio") {
                await conn.sendMessage(from, { audio: { url: media.url, mimetype: "audio/mpeg", ptt: false } }, { quoted: msg });
            }

            await conn.sendMessage(from, { react: { text: "✔️", key: msg.key } });
        };

        conn.ev.on("messages.upsert", handler);

    } catch (e) {
        console.log(e);
        reply("❌ Error occurred");
    }
});
