const storeErrorSchema = {
    type: "object",
    required: ["code", "type", "message"],
    properties: {
        code: { type: "number" },
        type: { type: "string" },
        message: { type: "string" }
    },
    additionalProperties: true
};

module.exports = { storeErrorSchema };
