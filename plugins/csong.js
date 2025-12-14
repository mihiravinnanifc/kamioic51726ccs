const { cmd } = require("../command");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

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

function toSeconds(time) {
    if (!time) return 0;
    const p = time.split(":").map(Number);
    return (p.length === 2) ? p[0] * 60 + p[1] : parseInt(time);
}

cmd({
  pattern: "csong",
  alias: ["chsong", "channelplay"],
  react: "🍁",
  desc: "Send a YouTube song to a WhatsApp Channel",
  category: "channel",
  use: ".csong <song name or youtube link> /<channel JID>",
  filename: __filename,
}, async (conn, mek, m, { reply, q }) => {
  try {

    if (!q) return reply("⚠️ Format:\n.csong <song or link> /<channel jid>");

    let cleaned = q.trim();
    let lastSlash = cleaned.lastIndexOf("/");

    if (lastSlash === -1)
        return reply("⚠️ Format:\n.csong <song or link> /<channel jid>");

    let input = cleaned.substring(0, lastSlash).trim();
    let channelJid = cleaned.substring(lastSlash + 1).trim();

    if (!channelJid.endsWith("@newsletter"))
        return reply("❌ Invalid channel JID! Must end with @newsletter");

    const isYT = input.includes("youtu");

    let apiUrl;

    if (isYT) {
        // ⭐ WORKING YOUTUBE LINK API
        apiUrl = `https://api.vihangayt.asia/downloader/ytmp3?url=${encodeURIComponent(input)}`;
    } else {
        // ⭐ Search with Nekolabs
        apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(input)}`;
    }

    const res = await fetch(apiUrl);
    const data = await res.json();

    let meta, dlUrl;

    if (isYT) {
        if (!data?.url) return reply("❌ Invalid YouTube Link.");
        meta = {
            title: data.title,
            duration: data.duration || "0:00",
            channel: "YouTube",
            cover: data.thumbnail
        };
        dlUrl = data.url;
    } else {
        if (!data?.success) return reply("❌ Song not found.");
        meta = data.result.metadata;
        dlUrl = data.result.downloadUrl;
    }

    // Thumbnail
    let buffer;
    try {
        const thumb = await fetch(meta.cover);
        buffer = Buffer.from(await thumb.arrayBuffer());
    } catch {
        buffer = null;
    }

    const caption = `🎶 *RANUMITHA-X-MD SONG SENDER* 🎶

*🎧 Title* : ${meta.title}
*🫟 Channel*: ${meta.channel}
*🕐 Time* : ${meta.duration}

> © Powered by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

    await conn.sendMessage(channelJid, {
        image: buffer,
        caption
    }, { quoted: fakevCard });

    // Download + Convert
    const tempPath = path.join(__dirname, `../temp/${Date.now()}.mp3`);
    const voicePath = path.join(__dirname, `../temp/${Date.now()}.opus`);

    const audioData = await fetch(dlUrl);
    const audioBuffer = Buffer.from(await audioData.arrayBuffer());
    fs.writeFileSync(tempPath, audioBuffer);

    await new Promise((resolve, reject) => {
        ffmpeg(tempPath)
            .audioCodec("libopus")
            .format("opus")
            .audioBitrate("64k")
            .save(voicePath)
            .on("end", resolve)
            .on("error", reject);
    });

    const voiceBuffer = fs.readFileSync(voicePath);
    const durationSeconds = toSeconds(meta.duration);

    await conn.sendMessage(channelJid, {
        audio: voiceBuffer,
        mimetype: "audio/ogg; codecs=opus",
        ptt: true,
        seconds: durationSeconds
    }, { quoted: fakevCard });

    fs.unlinkSync(tempPath);
    fs.unlinkSync(voicePath);

    reply(`*✅ Song sent successfully!*  
🎧 *${meta.title}*  
📢 Channel: *${channelJid}*`);

  } catch (err) {
    console.error(err);
    reply("⚠️ Error while sending song.");
  }
});
