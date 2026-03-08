const path = require("path");
const { spawn } = require("child_process");

function runNodeScript(scriptPath, args = [], env = process.env) {
    return new Promise((resolve) => {
        const child = spawn(process.execPath, [scriptPath, ...args], {
            stdio: "inherit",
            env,
            shell: false
        });

        child.on("close", (code) => resolve(code ?? 1));
        child.on("error", () => resolve(1));
    });
}

function readAndStripCustomKeyArg(args) {
    const cleaned = [];
    let keyValue;

    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (!arg) {
            continue;
        }

        if (arg.startsWith("--testKey=") || arg.startsWith("--testkey=") || arg.startsWith("--runKey=") || arg.startsWith("--key=")) {
            keyValue = arg.split("=")[1];
            continue;
        }

        if (arg === "--testKey" || arg === "--testkey" || arg === "--runKey" || arg === "--key") {
            keyValue = args[i + 1];
            i += 1;
            continue;
        }

        cleaned.push(arg);
    }

    return { keyValue, cleanedArgs: cleaned };
}

function getArgValue(args, flagName) {
    const exact = `--${flagName}`;
    const prefixed = `--${flagName}=`;
    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (arg === exact) {
            return args[i + 1];
        }
        if (arg && arg.startsWith(prefixed)) {
            return arg.slice(prefixed.length);
        }
    }
    return undefined;
}

function inferRunType({ keyInput, finalArgs }) {
    if (keyInput) {
        if (/^api$/i.test(keyInput) || /^api[-_:]/i.test(keyInput)) {
            return "api";
        }
        if (/^ui$/i.test(keyInput)) {
            return "ui";
        }
    }

    const tagsValue = getArgValue(finalArgs, "tags");
    const tags = String(tagsValue || "");

    if (/not\s+@api/i.test(tags)) {
        return "ui";
    }
    if (/@api/i.test(tags)) {
        return "api";
    }

    return "mixed";
}

async function main() {
    const env = { ...process.env };
    const { keyValue: cliKey, cleanedArgs } = readAndStripCustomKeyArg(process.argv.slice(2));
    const cucumberArgs = cleanedArgs;

    const initScript = path.resolve(__dirname, "init.js");
    const reportScript = path.resolve(__dirname, "report.js");
    const cucumberBin = path.resolve(
        __dirname,
        "../../../node_modules/@cucumber/cucumber/bin/cucumber.js"
    );

    const finalCucumberArgs = cucumberArgs.length
        ? [...cucumberArgs]
        : ["--config=config/cucumber.js"];

    const hasTagsArg = finalCucumberArgs.includes("--tags");
    if (!hasTagsArg) {
        const keyInput = cliKey || env.npm_config_testkey || env.npm_config_testKey || env.TEST_KEY || env.npm_config_key || env.npm_config_KEY || env.KEY;
        const tagsInput = env.npm_config_tags || env.npm_config_TAGS || env.TAGS;

        if (tagsInput && String(tagsInput).trim()) {
            finalCucumberArgs.push("--tags", String(tagsInput).trim());
        } else if (keyInput && String(keyInput).trim()) {
            const key = String(keyInput).trim();
            let derivedTags = "";

            if (/^api$/i.test(key)) {
                derivedTags = "@api and not @chain";
            } else if (/^ui$/i.test(key)) {
                derivedTags = "not @api";
            } else if (/^api[-_:]/i.test(key)) {
                derivedTags = `@api and @Key:${key}`;
            } else {
                derivedTags = `not @api and @Key:${key}`;
            }

            finalCucumberArgs.push("--tags", derivedTags);
        }
    }

    env.TEST_RUN_TYPE = inferRunType({
        keyInput: cliKey || env.npm_config_testkey || env.npm_config_testKey || env.TEST_KEY || env.npm_config_key || env.npm_config_KEY || env.KEY,
        finalArgs: finalCucumberArgs
    });

    const initExitCode = await runNodeScript(initScript, [], env);
    if (initExitCode !== 0) {
        process.exit(initExitCode);
    }

    const cucumberExitCode = await runNodeScript(cucumberBin, finalCucumberArgs, env);
    const reportExitCode = await runNodeScript(reportScript, [], env);

    process.exit(cucumberExitCode !== 0 ? cucumberExitCode : reportExitCode);
}

main();
