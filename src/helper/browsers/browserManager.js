const { chromium, firefox, webkit } = require("@playwright/test");

const toBoolean = (value, defaultValue = true) => {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }
    return String(value).toLowerCase() === "true";
};

const invokeBrowser = () => {
    const browserType = process.env.npm_config_BROWSER || process.env.BROWSER || "chrome";
    const headless = toBoolean(process.env.HEAD, true);
    const options = {
        headless,
        args: headless ? [] : ["--start-maximized"]
    };

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
