const { transports, format } = require("winston");

function options(scenarioName) {
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
                filename: `test-results/logs/${scenarioName}/log.log`,
                level: "info",
                format: commonFormat
            })
        ]
    };
}

module.exports = { options };
