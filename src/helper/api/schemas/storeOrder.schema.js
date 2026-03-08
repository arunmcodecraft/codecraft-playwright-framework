const storeOrderSchema = {
    type: "object",
    required: ["id", "petId", "quantity", "shipDate", "status", "complete"],
    properties: {
        id: { type: "number" },
        petId: { type: "number" },
        quantity: { type: "number" },
        shipDate: { type: "string", minLength: 1 },
        status: { type: "string", enum: ["placed", "approved", "delivered"] },
        complete: { type: "boolean" }
    },
    additionalProperties: false
};

module.exports = { storeOrderSchema };
