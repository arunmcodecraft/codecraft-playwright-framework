const fs = require("fs");
const path = require("path");
const { transports, format } = require("winston");

function sanitizeScenarioName(name) {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").replace(/\s+/g, "_");
}

function options(scenarioName) {
    const safeScenarioName = sanitizeScenarioName(scenarioName);
    const logDir = path.join("test-results", "logs", safeScenarioName);

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const commonFormat = format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
    );

    return {
        transports: [
            new transports.Console({
                level: "info",
                format: commonFormat
            }),
            new transports.File({
                filename: path.join(logDir, "log.log"),
                level: "info",
                format: commonFormat
            })
        ]
    };
}

module.exports = { options };
