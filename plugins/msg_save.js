const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");
const { getContentType } = require("@whiskeysockets/baileys");

// save folder
const SAVE_DIR = "./saved_messages";

// create folder if not exists
if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR);
}

// get quoted message (same as your forward cmd)
function getQuoted(message) {
    if (!message) return null;

    const type = getContentType(message);
    if (!type) return null;

    const content = message[type];

    if (type === "ephemeralMessage") {
        return getQuoted(content.message);
    }

    return content?.contextInfo?.quotedMessage || null;
}

cmd({
    pattern: "svx",
    desc: "Save message as JSON",
    category: "tools",
    react: "💾",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        let quoted = getQuoted(mek.message);

        // if no reply → save current message
        let msgToSave;

        if (quoted) {
            msgToSave = quoted;
        } else if (mek.message) {
            msgToSave = mek.message;
        } else {
            return reply("❌ Message ekak hoyaganna ba");
        }

        // create file name
        const fileName = `${Date.now()}_${mek.key.id}.json`;
        const filePath = path.join(SAVE_DIR, fileName);

        // save
        fs.writeFileSync(filePath, JSON.stringify(msgToSave, null, 2));

        reply(`✅ Message saved!\n📁 File: ${fileName}`);

    } catch (err) {
        console.log(err);
        reply("❌ Error saving message");
    }
});
