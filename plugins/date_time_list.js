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


// 🌍 GENERATE 195 COUNTRIES (ISO)
const countries = Intl.supportedValuesOf("timeZone")
    .map(tz => {
        const parts = tz.split("/");
        const country = parts[parts.length - 1].replace(/_/g, " ");
        return { name: country, zone: tz };
    })
    .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)
    .slice(0, 195);

cmd({
    pattern: "timelist",
    desc: "World time list (195 countries)",
    category: "utility",
    react: "🫯",
    filename: __filename
},
async (conn, mek, m, { reply }) => {

    let txt = "🌍 *\`WORLD TIME LIST\`* ⏰\n\n";
    const now = new Date();

    for (let i = 0; i < countries.length; i++) {

        const c = countries[i];

        const date = now.toLocaleDateString("en-GB", {
            timeZone: c.zone,
            day: "2-digit",
            month: "short"
        });

        const time = now.toLocaleTimeString("en-GB", {
            timeZone: c.zone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"   // ✅ seconds added
        });

        txt += `*${i + 1}.* ${c.name}\n📅 \`${date}\` | 🕒 \`${time}\`\n\n`;

        if ((i + 1) % 25 === 0) {
            await conn.sendMessage(m.chat, { text: txt }, { quoted: fakevCard });
            txt = "";
        }
    }

    if (txt.trim()) {
        await conn.sendMessage(m.chat, { text: txt }, { quoted: fakevCard });
    }

});
