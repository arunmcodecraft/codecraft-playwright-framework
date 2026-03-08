const Ajv = require("ajv");

class SchemaValidator {
    constructor() {
        this.ajv = new Ajv({ allErrors: true, strict: false });
    }

    validate(schema, data, schemaName = "schema") {
        const validateFn = this.ajv.compile(schema);
        const valid = validateFn(data);

        if (!valid) {
            const details = (validateFn.errors || [])
                .map((e) => `${e.instancePath || "/"} ${e.message}`)
                .join("; ");
            throw new Error(`Schema validation failed for ${schemaName}: ${details}`);
        }
    }
}

module.exports = { SchemaValidator };
