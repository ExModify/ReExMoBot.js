var vars = require('./../global/vars.js');
var wc = require('./../modules/waifuCloud.js');

module.exports = {
    name: 'update',
    canPrivate: true,
    requirePrefix: true,
    minimumLevel: 3,
    type: "Fun - Images",
    execute: (bot, message, prefix, command, parameter, language) => {
        if (vars.IsOwner(message.author.id)){
            message.channel.send(language.ExecuteNoPermission);
            return;
        }
        var tags = [];
        var from = "";
        var toFolder = "";

        if (parameter.toLowerCase() == "hibiki") {
            tags.push("verniy_hibiki", "hibiki_(kantai_collection)");
            from = vars.HibikiPath;
            toFolder = "verniy_hibiki";
        }
        else if (parameter.toLowerCase() == "chino") {
            tags.push("kafuu_chino");
            from = vars.ChinoPath;
            toFolder = "kafuu_chino";
        }
        else if (parameter.toLowerCase() == "momiji") {
            tags.push("inubashiri_momiji");
            from = vars.MomijiPath;
            toFolder = "inubashiri_momiji";
        }
        else if (parameter.toLowerCase() == "nsfw") {
            tags.push("rating:explicit");
            from = vars.NSFWPath
            toFolder = "rating_explicit";
        }
        else if (parameter.toLowerCase() == "sfw") {
            tags.push("raging:safe");
            from = vars.SFWPath;
            toFolder = "rating_safe";
        }
        else if (parameter.toLowerCase() == "neko"){
            tags.push("neko");
            from = vars.NekoPath;
            toFolder = "neko";
        }

        message.channel.send(language.WaifuCloudUpdatePosts.getPrepared('type', parameter.toLowerCase())).then(msg => {
            wc.fill(from, tags, toFolder).then((count) => {
                if (count == 0){
                    message.channel.send(language.WaifuCloudTypeUpToDate.getPrepared('type', parameter.toLowerCase()));
                }
                else{
                    message.channel.send(language.WaifuCloudUploaded.getPrepared(['type', 'count'], [parameter.toLowerCase(), count]));
                }
            });
        });
    }
};