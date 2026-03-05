const { chromium, firefox, webkit } = require("@playwright/test");

const options = {
    headless: false,
    args: ["--start-maximized"]
};

const invokeBrowser = () => {
    const browserType = process.env.npm_config_BROWSER || "chrome";
    switch (browserType) {
        case "chrome":
            return chromium.launch(options);
        case "firefox":
            return firefox.launch(options);
        case "webkit":
            return webkit.launch(options);
        default:
            throw new Error("Please set the proper browser!");
    }
};

module.exports = { invokeBrowser };
