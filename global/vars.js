var DefaultSettings = `{
    "Owner": {
        "id": "000",
        "password": ""
    },
    "GlobalAdmins": [
        {
            "id": "0000",
            "password": ""
        }
    ],
    "BoltzmannHostname": "Boltzmann",
    "JunkChannelID": "342989459609878538",
    "GloballyBlocked": [],
    "SFWPath": "D:\\Saves\\Stuffs\\Imgs\\",
    "NSFWPath": "D:\\Saves\\Stuffs\\Imgs\\nsfw\\",
    "NekoPath": "D:\\Saves\\Stuffs\\Imgs\\neko\\",
    "ChinoPath": "D:\\Saves\\Stuffs\\Imgs\\Chino\\",
    "MomijiPath": "D:\\Saves\\Stuffs\\Imgs\\Momiji\\",
    "HibikiPath": "D:\\Saves\\Stuffs\\Imgs\\Hibiki\\",
    "DiscordTokenPath": "D:\\txt\\APIToken\\DiscordToken.txt",
    "osuAPIPath": "D:\\txt\\APIToken\\osu!API.txt",
    "osuIRCPath": "D:\\txt\\APIToken\\osu!IRC.txt",
    "WaifuCloudCredentials": "D:\\txt\\APIToken\\WaifuCloudCredentials.txt",
    "WaifuCloudServer": "ws://boltzmann.cf:4243",
    "DefaultWaifuCloudPath": "D:\\waifucloud\\images\\",
    "WSServer": "ws://localhost:2465/"
}`;

var fs = require('fs');
var GuildSettings = [];

var Settings = undefined;
function LoadSettings(){
    if(fs.existsSync('./data/Settings.json'))
    {
        Settings = JSON.parse(fs.readFileSync('./data/Settings.json').toString());
    }
    else{
        Settings = JSON.parse(DefaultSettings);
        SaveSettings();
    }
}

LoadSettings();

var Streams = new Map();

function LoadImages(){
    if(fs.existsSync(Settings.SFWPath)){
        var SFWFiles = fs.readdirSync(Settings.SFWPath).filter((v, i, a) => {
            if (fs.statSync(Settings.SFWPath + v).isDirectory())
                return false;
            return true;
        });
        module.exports.SFWFiles = SFWFiles;
        module.exports.SFWCount = SFWFiles.length;
    }
    if(fs.existsSync(Settings.NSFWPath)){
        var NSFWFiles = fs.readdirSync(Settings.NSFWPath).filter((v, i, a) => {
            if (fs.statSync(Settings.NSFWPath + v).isDirectory())
                return false;
            return true;
        });
        module.exports.NSFWFiles = NSFWFiles;
        module.exports.NSFWCount = NSFWFiles.length;
    }
    if(fs.existsSync(Settings.NekoPath)){
        var NekoFiles = fs.readdirSync(Settings.NekoPath).filter((v, i, a) => {
            if (fs.statSync(Settings.NekoPath + v).isDirectory())
                return false;
            return true;
        });
        module.exports.NekoFiles = NekoFiles;
        module.exports.NekoCount = NekoFiles.length;
    }
    if(fs.existsSync(Settings.ChinoPath)){
        var ChinoFiles = fs.readdirSync(Settings.ChinoPath).filter((v, i, a) => {
            if (fs.statSync(Settings.ChinoPath + v).isDirectory())
                return false;
            return true;
        });
        module.exports.ChinoFiles = ChinoFiles;
        module.exports.ChinoCount = ChinoFiles.length;
    }
    if(fs.existsSync(Settings.MomijiPath)){
        var MomijiFiles = fs.readdirSync(Settings.MomijiPath).filter((v, i, a) => {
            if (fs.statSync(Settings.MomijiPath + v).isDirectory())
                return false;
            return true;
        });
        module.exports.MomijiFiles = MomijiFiles;
        module.exports.MomijiCount = MomijiFiles.length;
    }
    if(fs.existsSync(Settings.HibikiPath)){
        var HibikiFiles = fs.readdirSync(Settings.HibikiPath).filter((v, i, a) => {
            if (fs.statSync(Settings.HibikiPath + v).isDirectory())
                return false;
            return true;
        });
        module.exports.MomijiFiles = MomijiFiles;
        module.exports.HibikiCount = HibikiFiles.length;
    }

    module.exports.AllCount = SFWFiles.length + NSFWFiles.length + NekoFiles.length + ChinoFiles.length + MomijiFiles.length + HibikiFiles.length;

    console.log(JSON.stringify({
        type: "Images",
        message: "All images have been loaded!"
    }));
}

var DiscordToken = fs.readFileSync(Settings.DiscordTokenPath).toString();
var osuAPI = fs.readFileSync(Settings.osuAPIPath).toString();

var IRC = fs.readFileSync(Settings.osuIRCPath).toString().split('\n');
var IRCUsername = IRC[0];
var IRCPassword = IRC[1];

var WaifuCloud = fs.readFileSync(Settings.WaifuCloudCredentials).toString().split('\n');;
var WaifuCloudUsername = WaifuCloud[0].trim();
var WaifuCloudPassword = WaifuCloud[1].trim();

function LoadGuildSettings(){
    if(fs.existsSync('./data/GuildSettings.json'))
        GuildSettings = JSON.parse(fs.readFileSync('./data/GuildSettings.json').toString());
}
function SaveGuildSettings(){
    if(fs.existsSync('./data/GuildSettings.json'))
        fs.unlinkSync('./data/GuildSettings.json');
    fs.writeFileSync('./data/GuildSettings.json', JSON.stringify(GuildSettings));
}
function SaveSettings(){
    if(fs.existsSync('./data/Settings.json'))
        fs.unlinkSync('./data/Settings.json');
    fs.writeFileSync('./data/Settings.json', JSON.stringify(Settings));
}
function Get(guildID){
    var baseConfig = {
        GuildID: guildID,
        Prefix: '$',
        Language: 'en',
        Admins: [],
        Volume: 50,
        Query: [],
        Blocked: [],
        MusicCurrent: "",
        MusicIsPlaying: false,
        MusicStopped: false,
        QueryPlaying: false,
        QueryIndex: 0,
        MusicPosition: 0
    };
    if (guildID == undefined){
        return baseConfig;
    }
    var Base = undefined;
    
    var index = GuildSettings.findIndex((e, i, a) => {
        return e.GuildID == guildID;
    });

    if(index >= 0)
        Base = GuildSettings[index];
    
    if(Base == undefined){
        Base = baseConfig;
        GuildSettings.push(Base);
        SaveGuildSettings();
    }
    return Base;
}
function AddOrSet(guildID, property, value, value2){
    var Base = Get(guildID);

    if(property == "Query" || property == "Blocked"){
        Base[property].push(value);
    }
    else if (property == "Admins"){
        Base[property].push({id:value, password:value2});
    }
    else{
        Base[property] = value;
    }
    var index = GuildSettings.findIndex((e, i, a) => {
        return e.GuildID == guildID;
    });
    
    GuildSettings[index] = Base;
    SaveGuildSettings();
}
function Remove(guildID, property, value){
    var Base = Get(guildID);
    if (property == "Admins"){
        var index = Base[property].findIndex((v, i, a) => v.id == value);
        if(index >= 0)
        {
            Base[property].splice(index, 1);
        }
    }
    if(Base[property] instanceof Array){
        var index = Base[property].indexOf(value);
        if(index >= 0)
        {
            Base[property].splice(index, 1);
        }
    }
    var index = GuildSettings.findIndex((e, i, a) => {
        return e.GuildID == guildID;
    });
    
    GuildSettings[index] = Base;
    SaveGuildSettings();
}
function RemoveAt(guildID, property, at){
    var Base = Get(guildID);
    if(Base[property] instanceof Array){
        Base[property].slice(at, 1);
    }
    var index = GuildSettings.findIndex((e, i, a) => {
        return e.GuildID == guildID;
    });
    
    GuildSettings[index] = Base;
    SaveGuildSettings();
}
function RemoveAll(guildID, property){
    var Base = Get(guildID);
    if(Base[property] instanceof Array){
        Base[property] = [];
    }
    var index = GuildSettings.findIndex((e, i, a) => {
        return e.GuildID == guildID;
    });
    
    GuildSettings[index] = Base;
    SaveGuildSettings();
}
function IsOwner(UserID){
    return Settings.Owner.id == UserID;
}
function IsGlobalAdmin(userID){
    var index = Settings.GlobalAdmins.findIndex((v, i, a) => v.id == userID);
    return index >= 0;
}
function IsGuildAdmin(guildID, userID){
    var Settings = Get(guildID);
    if (Settings.Admins.length >= 0){
        var index = Settings.Admins.findIndex((v, i, a) => v.id == userID);
        return index >= 0;
    }
    return false;
}

module.exports = {
    Load: () => {
        LoadSettings();
        LoadGuildSettings();
        LoadImages();        
    },
    ReloadImages: () => LoadImages(),
    DiscordToken: DiscordToken,
    osuAPI: osuAPI,
    IRCUsername: IRCUsername,
    IRCPassword: IRCPassword,
    WaifuCloudServer: Settings.WaifuCloudServer,
    WaifuCloudPassword: WaifuCloudPassword,
    WaifuCloudUsername: WaifuCloudUsername,
    WaifuCloudImagePath: Settings.DefaultWaifuCloudPath,
    Settings: (guildID) => Get(guildID),
    Streams: Streams,
    SetPrefix: (guildID, prefix) => AddOrSet(guildID, "Prefix", prefix),
    SetLanguage: (guildID, languageID) => AddOrSet(guildID, "Language", languageID),
    SetVolume: (guildID, volume) => AddOrSet(guildID, "Volume", volume),
    AddQueryLink: (guildID, title, link) => AddOrSet(guildID, "Query", {"title": title, "link": link}),
    RemoveQueryLink: (guildID, link) => Remove(guildID, "Query", link),
    RemoveQueryAt: (guildID, index) => RemoveAt(guildID, "Query", index),
    ClearQuery: (guildID) => RemoveAll(guildID, "Query"),
    SetPlaying: (guildID, isPlaying) => AddOrSet(guildID, "MusicIsPlaying", isPlaying),
    SetCurrentPlaying: (guildID, current) => AddOrSet(guildID, "MusicCurrent", current),
    SetStopped: (guildID, stopped) => AddOrSet(guildID, "MusicStopped", stopped),
    SetQueryPlaying: (guildID, playing) => AddOrSet(guildID, "QueryPlaying", playing),
    SetQueryIndex: (guildID, index) => AddOrSet(guildID, "QueryIndex", index),
    SetMusicPosition: (guildID, position) => AddOrSet(guildID, "MusicPosition", position),
    GetAdminNames: (bot, guildID) => {
        var Names = [];
        var Admins = Get(guildID)["Admins"];

        Names.push(bot.users.get(Settings.Owner.id).username);

        Settings["GlobalAdmins"].forEach((v, i, a) => {
            Names.push(bot.users.get(v.id).username);
        });

        Admins.forEach((v, n, a) => {
            Names.push(bot.users.get(v.id).username);
        });
        return Names;
    },
    IsBlocked: (userID, guildID) => {
        if (Settings.GloballyBlocked.indexOf(userID) >= 0){
            return true;
        }
        if (guildID != undefined){
            var GuildSettings = Get(guildID);
            if(GuildSettings.Blocked.indexOf(userID) >= 0){
                return true;
            }
        }

        return false;
    },
    IsGloballyBlocked: (userID) => {
        return Settings.GloballyBlocked.indexOf(userID) >= 0;
    },
    IsBlockedGuild: (userID, guildID) => {
        var GuildSettings = Get(guildID);
        return GuildSettings.Blocked.indexOf(userID) >= 0;
    },
    AddBlocked: (userID, guildID) => AddOrSet(guildID, "Blocked", userID),
    RemoveBlocked: (userID, guildID) => Remove(guildID, "Blocked", userID),
    AddGloballyBlocked: (userID) => {
        if(Settings.GloballyBlocked.indexOf(userID) < 0){
            Settings.GloballyBlocked.push(userID);
            SaveSettings();
        }
    },
    RemoveGloballyBlocked: (userID) => {
        var Index = Settings.GloballyBlocked.indexOf(userID);
        if(Index >= 0){
            Settings.GloballyBlocked.splice(Index);
            SaveSettings();
        }
    },
    AddAdmin: (guildID, userID, passwordHash) => AddOrSet(guildID, "Admins", userID, passwordHash),
    AddGlobalAdmin: (userID, passwordHash) => {
        GuildSettings.forEach((v, i, a) => {
            if(v["Admins"].indexOf(userID) >= 0){
                Remove(v.GuildID, "Admins", userID);
            }
        });
        Settings["GlobalAdmins"].push({id:userID, password:passwordHash});
        SaveGuildSettings();
        SaveSettings();
    },
    HasAnyAdmin: (userID) => {
        if(IsOwner(userID))
            return true;

        if(IsGlobalAdmin(userID))
            return true;

        var isAdmin = false;
        GuildSettings.forEach((v, i, a) => {
            if (IsGuildAdmin(v.guildID, userID)) {
                isAdmin = true;
                return;
            }
        });
        return isAdmin;
    },
    GetLoginCredentials: (userID) => {
        if(IsOwner(userID)){
            return Settings.Owner;
        }
        if (IsGlobalAdmin(userID))
            return Settings.GlobalAdmins[Settings.GlobalAdmins.index(userID)];
        else if (GuildSettings.map((v, i, a) => v.Admins.map((va, ind, ar) => va.id).indexOf(userID) >= 0).indexOf(true) >= 0){
            for(var Setting in GuildSettings){
                for(var Admin in Setting.Admins){
                    if(Admin.id == userID)
                        return Admin;
                }
            }
        }
        else
            return false;
    },
    GetAdminIDs: (userID) => {
        var ids = [];
        GuildSettings.forEach((v, i, a) => {
            v.Admins.forEach((val, ind, arr) => {
                if(val.id == userID)
                    ids.push(userID);
            });
        });
        return ids;
    },
    RemoveAdmin: (guildID, userID) => Remove(guildID, "Admins", userID),
    RemoveGlobalAdmin: (userID) => {
        var index = Settings["GlobalAdmins"].indexOf(userID);
        if(index >= 0)
            Settings["GlobalAdmins"].splice(index, 1);
        SaveSettings();
    },
    HasAdmin: (guild, userID) => {
        if(IsOwner(userID))
            return true;
        else if(guild == undefined)
            return false;
        else
            return IsGuildAdmin(guild.id, userID)
                || IsGlobalAdmin(userID)
                || guild.ownerID == userID;
    },
    IsOwner: (userID) => IsOwner(userID),
    OwnerID: Settings.Owner.id,
    IsGlobalAdmin: (userID) => Settings.GlobalAdmins.indexOf(userID) >= 0,
    SFWPath: Settings.SFWPath,
    NSFWPath: Settings.NSFWPath,
    NekoPath: Settings.NekoPath,
    ChinoPath: Settings.ChinoPath,
    MomijiPath: Settings.MomijiPath,
    HibikiPath: Settings.HibikiPath,
    NSFWExists: (file) => fs.existsSync(Settings.NSFWPath + file),
    NSFWDelete: (file) => fs.unlinkSync(Settings.NSFWPath + file),
    WSServer: Settings.WSServer,
    Characters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
     'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    Numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    GetLevel: (userID, guild) => {
        if (IsOwner(userID))
            return 4;
        if (IsGlobalAdmin(userID))
            return 3;

        var guildID;
        if (guild){
            if (guild.owner.id == userID)
                return 2;
            guildID = guild.id;
        }
        
        if (guildID)
            if (IsGuildAdmin(guildID, userID))
                return 1;
        return 0;
    },
    JunkChannelID: Settings.JunkChannelID,
    BoltzmannHostname: Settings.BoltzmannHostname
}
