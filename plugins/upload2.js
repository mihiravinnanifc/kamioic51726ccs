const { cmd } = require("../command");
const FormData = require("form-data");

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
    pattern: "upload2",
    alias: "url2",
    desc: "Upload media using WhiteShadow API",
    category: "tools",
    react: "📤",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        if (!quoted) {
            return reply("❌ Reply to an image or video!");
        }

        const mime = quoted.mtype || "";
        if (!mime.includes("image") && !mime.includes("video")) {
            return reply("❌ Only image/video supported!");
        }

        reply("⏳ Downloading...");

        // download buffer
        const buffer = await quoted.download();

        reply("📤 Uploading...");

        // create formdata (same as your example)
        const fd = new FormData();
        fd.append("file", buffer, {
            filename: `upload_${Date.now()}.jpg`
        });

        // send request (IMPORTANT: full URL)
        const res = await fetch("https://whiteshadow-uploader.vercel.app/api/upload", {
            method: "POST",
            body: fd,
            headers: fd.getHeaders()
        });

        const data = await res.json();

        if (!data.status) {
            return reply("❌ Upload failed!");
        }

        const url = data.result.url;

        // send result
        return conn.sendMessage(from, {
            text: `✅ Upload Success!\n\n🔗 ${url}\n\n> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`
        }, { quoted: fakevCard });

    } catch (err) {
        console.error(err);
        reply("❌ Error: " + err.message);
    }
});
