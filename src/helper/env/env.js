const dotenv = require("dotenv");

const getEnv = () => {
    const envName = process.env.ENV || "STG";
    console.log(`process.env.ENV is ${process.env.ENV || "<undefined>"}`);
    if (!process.env.ENV) {
        console.warn(`No ENV passed, defaulting to ${envName}`);
    }

    dotenv.config({
        override: true,
        path: `src/helper/env/.env.${envName}`
    });
};

module.exports = { getEnv };
