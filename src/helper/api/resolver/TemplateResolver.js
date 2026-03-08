class TemplateResolver {
    static resolveString(input, context = {}) {
        if (typeof input !== "string") {
            return input;
        }

        return input.replace(/\$\{ctx\.([a-zA-Z0-9_]+)\}/g, (_, key) => {
            const value = context[key];
            return value === undefined || value === null ? "" : String(value);
        });
    }

    static resolveObject(input, context = {}) {
        if (Array.isArray(input)) {
            return input.map((x) => TemplateResolver.resolveObject(x, context));
        }
        if (input && typeof input === "object") {
            const out = {};
            for (const [k, v] of Object.entries(input)) {
                out[k] = TemplateResolver.resolveObject(v, context);
            }
            return out;
        }
        return TemplateResolver.resolveString(input, context);
    }
}

module.exports = { TemplateResolver };
