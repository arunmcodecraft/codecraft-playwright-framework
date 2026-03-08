module.exports = {
    default: {
        tags: process.env.npm_config_TAGS || "",
        formatOptions: {
            snippetInterface: "async-await"
        },
        paths: [
            "src/test/features/**/*.feature"
        ],
        publishQuiet: true,
        dryRun: false,
        require: [
            "src/support/customTypes.js",
            "src/support/hooks.js",
            "src/test/steps/**/*.js"
        ],
        format: [
            "progress-bar",
            "json:test-results/cucumber-report.json",
            "./src/support/allureReporter.js",
            "rerun:@rerun.txt"
        ],
        parallel: 1
    },
    rerun: {
        formatOptions: {
            snippetInterface: "async-await"
        },
        publishQuiet: true,
        dryRun: false,
        require: [
            "src/support/customTypes.js",
            "src/support/hooks.js",
            "src/test/steps/**/*.js"
        ],
        format: [
            "progress-bar",
            "json:test-results/cucumber-report.json",
            "./src/support/allureReporter.js",
            "rerun:@rerun.txt"
        ],
        parallel: 1
    }
};
