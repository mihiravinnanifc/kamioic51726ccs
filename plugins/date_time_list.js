const { cmd } = require('../command');

// 🌍 Countries grouped (SIDE MENU feel)
const regions = {
    "🌏 Asia": [
        { name:"Sri Lanka",zone:"Asia/Colombo"},
        { name:"India",zone:"Asia/Kolkata"},
        { name:"Japan",zone:"Asia/Tokyo"},
        { name:"China",zone:"Asia/Shanghai"},
        { name:"UAE",zone:"Asia/Dubai"}
    ],
    "🌍 Europe": [
        { name:"United Kingdom",zone:"Europe/London"},
        { name:"Germany",zone:"Europe/Berlin"},
        { name:"France",zone:"Europe/Paris"},
        { name:"Italy",zone:"Europe/Rome"}
    ],
    "🌎 America": [
        { name:"United States",zone:"America/New_York"},
        { name:"Canada",zone:"America/Toronto"},
        { name:"Brazil",zone:"America/Sao_Paulo"}
    ],
    "🌍 Africa": [
        { name:"South Africa",zone:"Africa/Johannesburg"},
        { name:"Nigeria",zone:"Africa/Lagos"},
        { name:"Egypt",zone:"Africa/Cairo"}
    ]
};

// 🔍 find country
function findCountry(name){
    for (let region in regions){
        const found = regions[region].find(c =>
            c.name.toLowerCase() === name.toLowerCase()
        );
        if(found) return found;
    }
    return null;
}

// 🕒 CMD
cmd({
pattern:"time",
desc:"Side menu world clock",
category:"utility",
react:"🌍",
filename:__filename
},
async(conn,mek,m,{args,reply})=>{

// 👉 SELECTED COUNTRY
if(args[0]){
const input=args.join(" ");
const country=findCountry(input);

if(!country) return reply("❌ Country not found!");

const now=new Date();

const date=now.toLocaleDateString("en-GB",{timeZone:country.zone,weekday:"long",year:"numeric",month:"long",day:"numeric"});
const time=now.toLocaleTimeString("en-GB",{timeZone:country.zone,hour:"2-digit",minute:"2-digit",second:"2-digit"});

return reply(`
╭───〔 🌍 WORLD CLOCK 〕───╮
│
│ 📍 ${country.name}
│ 📅 ${date}
│ 🕒 ${time}
│
╰────────────────────╯
`);
}

// 👉 MAIN MENU (SIDE STYLE)
const buttons = Object.keys(regions).map(r => ({
buttonId: `.timeregion ${r}`,
buttonText: { displayText: r },
type: 1
}));

return conn.sendMessage(m.chat,{
text:"🌍 *Select Region*",
footer:"Time Bot",
buttons: buttons,
headerType:1
},{quoted:mek});

});

// 🌍 REGION HANDLER
cmd({
pattern:"timeregion",
category:"utility"
},
async(conn,mek,m,{args,reply})=>{

const regionName = args.join(" ");
const list = regions[regionName];

if(!list) return reply("❌ Region not found!");

const buttons = list.map(c => ({
buttonId: `.time ${c.name}`,
buttonText: { displayText: c.name },
type: 1
}));

return conn.sendMessage(m.chat,{
text:`📍 *${regionName} Countries*`,
footer:"Select Country",
buttons: buttons,
headerType:1
},{quoted:mek});

});
