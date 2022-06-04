
const DatabaseName = "1937"

module.exports = {
    apps: [
    {
        name: `${DatabaseName}-davet`,
        script: "./davet/main.js",
        watch: true
    },
    {
        name: `${DatabaseName}-mod`,
        script: "./Moderasyon/main.js",
        watch: false
    },
    {
        name: `${DatabaseName}-stat`,
        script: "./Stat/main.js",
        watch: true
    },
    {
        name: `${DatabaseName}-level`,
        script: "./LevelBotu/main.js",
        watch: true
    },
    {
        name: `${DatabaseName}-otomasyon`,
        script: "./Otomasyon/main.js",
        watch: true
    },
     ]
};
