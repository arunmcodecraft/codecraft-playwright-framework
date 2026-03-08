const inventorySchema = {
    type: "object",
    minProperties: 1,
    additionalProperties: {
        type: "integer",
        minimum: 0
    }
};

module.exports = { inventorySchema };
