const fs = require("fs/promises");

class DataProviderError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "DataProviderError";
        this.cause = cause;
    }
}

class CSVParser {
    static async parseData(filePath, separator = "|") {
        if (!filePath || filePath.trim().length === 0) {
            throw new DataProviderError("filePath must be a non-empty string.");
        }

        let fileContent;
        try {
            fileContent = await fs.readFile(filePath, "utf8");
            fileContent = fileContent.replace(/^\uFEFF/, "");
        } catch (err) {
            throw new DataProviderError(`Error reading CSV file ${filePath}`, err);
        }

        const data = [];
        const lines = fileContent
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

        let headers = [];

        for (const line of lines) {
            if (line.startsWith("#") || line.startsWith("!")) {
                continue;
            }

            const cols = line.split(separator).map((c) => c.trim());

            if (cols.some((c) => c.toLowerCase() === "key") && cols.some((c) => c.toLowerCase() === "env")) {
                headers = cols;
                continue;
            }

            if (!headers.length) {
                continue;
            }

            const row = {};
            headers.forEach((h, i) => {
                row[h] = cols[i] || "";
            });
            data.push(row);
        }

        return data;
    }
}

module.exports = { CSVParser, DataProviderError };
