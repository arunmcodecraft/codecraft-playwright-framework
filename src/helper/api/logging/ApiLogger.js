function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function maskValue(value) {
    if (typeof value !== "string") {
        return "***";
    }
    if (value.length <= 4) {
        return "*".repeat(value.length);
    }
    return `${value.slice(0, 2)}***${value.slice(-2)}`;
}

function sanitize(data, blockedFields) {
    if (Array.isArray(data)) {
        return data.map((item) => sanitize(item, blockedFields));
    }

    if (!isObject(data)) {
        return data;
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        const normalizedKey = key.toLowerCase();
        if (blockedFields.has(normalizedKey)) {
            sanitized[key] = maskValue(value);
        } else {
            sanitized[key] = sanitize(value, blockedFields);
        }
    }
    return sanitized;
}

function buildBlockedFields() {
    const defaults = [
        "password",
        "token",
        "authorization",
        "secret",
        "apikey",
        "api_key",
        "access_token",
        "refresh_token"
    ];

    const custom = (process.env.MASK_FIELDS || "")
        .split(",")
        .map((x) => x.trim().toLowerCase())
        .filter(Boolean);

    return new Set([...defaults, ...custom]);
}

class ApiLogger {
    static logTransaction(logger, request, response) {
        if (!logger) {
            return;
        }

        const blockedFields = buildBlockedFields();
        const safeRequest = sanitize(request || {}, blockedFields);
        const safeResponse = sanitize(response || {}, blockedFields);

        logger.info(`[API][REQUEST] ${JSON.stringify(safeRequest)}`);
        logger.info(`[API][RESPONSE] ${JSON.stringify(safeResponse)}`);
    }
}

module.exports = { ApiLogger };
