const dotenv = require("dotenv");

const getEnv = () => {
    console.log(`process.env.ENV is ${process.env.ENV}`);
    if (process.env.ENV) {
        dotenv.config({
            override: true,
            path: `src/helper/env/.env.${process.env.ENV}`
        });
    } else {
        console.error("NO ENV PASSED!");
    }
};

module.exports = { getEnv };
