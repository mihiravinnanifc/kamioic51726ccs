const axios = require("axios");
const yts = require("yt-search");
const { cmd } = require("../command");

const replyCache = new Map();

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
TEL;waid=94762095304:+94762095304
END:VCARD`
        }
    }
};

cmd({
    pattern: "video",
    alias: "ytvideo",
    react: "🎬",
    desc: "Download YouTube MP4",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        let query = q?.trim();
        if (!query && m?.quoted) {
            query =
                m.quoted.message?.conversation ||
                m.quoted.message?.extendedTextMessage?.text;
        }
        if (!query) return reply("⚠️ Give a video name or link");

        if (query.includes("youtube.com/shorts/")) {
            const id = query.split("/shorts/")[1].split(/[?&]/)[0];
            query = `https://www.youtube.com/watch?v=${id}`;
        }

        const search = await yts(query);
        if (!search.videos.length) return reply("❌ No results");

        const data = search.videos[0];

        const formats = {
            "240p": `https://api.nekolabs.my.id/downloader/youtube/v1?url=${data.url}&format=240`,
            "360p": `https://api.nekolabs.my.id/downloader/youtube/v1?url=${data.url}&format=360`,
            "480p": `https://api.nekolabs.my.id/downloader/youtube/v1?url=${data.url}&format=480`,
            "720p": `https://api.nekolabs.my.id/downloader/youtube/v1?url=${data.url}&format=720`
        };

        const caption = `🎬 *${data.title}*

Reply:
1.1–1.4 ▶ Video
2.1–2.4 ▶ Document`;

        const sent = await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption
        }, { quoted: fakevCard });

        replyCache.set(sent.key.id, {
            formats,
            from
        });

    } catch (e) {
        console.error(e);
        reply("❌ Error");
    }
});

// ================= ONE GLOBAL LISTENER =================
module.exports = (conn) => {
    conn.ev.on("messages.upsert", async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg?.message?.extendedTextMessage) return;

            const ctx = msg.message.extendedTextMessage.contextInfo;
            const replyTo = ctx?.stanzaId;
            if (!replyCache.has(replyTo)) return;

            const text = msg.message.extendedTextMessage.text.trim();
            const { formats, from } = replyCache.get(replyTo);

            let res, doc = false;
            if (text === "1.1") res = "240p";
            else if (text === "1.2") res = "360p";
            else if (text === "1.3") res = "480p";
            else if (text === "1.4") res = "720p";
            else if (text === "2.1") res = "240p", doc = true;
            else if (text === "2.2") res = "360p", doc = true;
            else if (text === "2.3") res = "480p", doc = true;
            else if (text === "2.4") res = "720p", doc = true;
            else return;

            replyCache.delete(replyTo);

            await conn.sendMessage(from, { react: { text: "⬇️", key: msg.key } });

            const { data } = await axios.get(formats[res]);
            const url = data?.result?.downloadUrl || data?.result?.download;
            if (!url) return;

            await conn.sendMessage(from, { react: { text: "⬆️", key: msg.key } });

            await conn.sendMessage(from,
                doc
                    ? { document: { url }, mimetype: "video/mp4", fileName: "video.mp4" }
                    : { video: { url }, mimetype: "video/mp4" },
                { quoted: msg }
            );

            await conn.sendMessage(from, { react: { text: "✔️", key: msg.key } });

        } catch (e) {
            console.error("Listener error:", e);
        }
    });
};
