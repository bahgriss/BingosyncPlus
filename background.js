let config = localStorage.getItem("bsp_config");

function updateTabs(message) {
    browser.tabs.query({
        url: '*://bingosync.com/room/*'
    }).then(tabs => {
        for (const tab of tabs) {
            browser.tabs.sendMessage(tab.id, message);
        }
    });
}

browser.runtime.onMessage.addListener((message, sender, respond) => {
    switch (message.type) {
        case "config":
            console.log("new config");
            config = message.config;
            updateTabs(message);
            // save to localStorage
            localStorage.setItem("bsp_config", JSON.stringify(message.config));
            break;
        case "theme":
            console.log("new theme");
            updateTabs({
                type: 'theme',
                theme: config.theming ? message.theme : undefined
            });
            // save to localStorage
            localStorage.setItem("bsp_theme", JSON.stringify(message.theme));
            break;
        case "listsA":
            console.log("new lists A");
            updateTabs(message);
            // save to localStorage
            localStorage.setItem("bsp_listsA", message.lists);
            break;
        case "listsB":
            console.log("new lists B");
            updateTabs(message);
            // save to localStorage
            localStorage.setItem("bsp_listsB", message.lists);
            break;
        case "request":
            switch (message.content) {
                case "config":
                    respond(JSON.parse(localStorage.getItem("bsp_config")));
                    break;
                case "theme":
                    respond(config.theming ? JSON.parse(localStorage.getItem("bsp_theme")) : undefined);
                    break;
                case "listsA":
                    respond(localStorage.getItem("bsp_listsA"));
                    break;
                case "listsB":
                    respond(localStorage.getItem("bsp_listsB"));
                    break;
            }
            break;
        default:
            console.log("what is this message lol", message.type);
            break;
    }
});
