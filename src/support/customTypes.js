const { defineParameterType } = require("@cucumber/cucumber");

defineParameterType({
    name: "list",
    regexp: /"([^"]+?)"/,
    transformer: (input) => input.replace(/^\[|\]$/g, "").split(",").map((item) => item.trim())
});
