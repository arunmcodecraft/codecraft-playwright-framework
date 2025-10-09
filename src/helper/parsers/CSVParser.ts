import * as fs from 'fs/promises';

export class DataProviderError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
        super(message);
        this.name = 'DataProviderError';
    }
}

export class CSVParser {
    /**
     * Parses a CSV file into an array of data rows.
     * @param filePath Path to CSV file
     * @param separator Separator (default: '|')
     * @param uniqColName Column to detect header row (default: 'Key')
     */
    static async parseData(
        filePath: string,
        separator: string = '|',
        uniqColName: string = 'Key'
    ): Promise<Record<string, string>[]> {
        if (!filePath || filePath.trim().length === 0) {
            throw new DataProviderError('filePath must be a non-empty string.');
        }

        let fileContent: string;
        try {
            fileContent = await fs.readFile(filePath, 'utf8');
            fileContent = fileContent.replace(/^\uFEFF/, ''); // remove BOM if present
        } catch (err) {
            throw new DataProviderError(`Error reading CSV file ${filePath}`, err);
        }

        const rows: Record<string, string>[] = [];
        const lines = fileContent
            .split(/\r?\n/)
            .map(l => l.trim())
            .filter(l => l.length > 0); // remove blank lines

        let headers: string[] | null = null;

        for (let i = 0; i < lines.length; i++) {
            const lineNumber = i + 1;
            const line = lines[i];

            // Skip comments
            if (line.startsWith('#') || line.startsWith('!')) continue;

            // Detect header row robustly
            if (!headers) {
                const columns = CSVParser.parseLine(line, separator);
                const hasKeyColumn = columns.some(c => c.trim().toLowerCase() === uniqColName.toLowerCase());
                if (hasKeyColumn) {
                    headers = columns;
                    continue;
                }
            }

            if (!headers) {
                throw new DataProviderError(
                    `Header row (containing '${uniqColName}') not found before data at line ${lineNumber}.`
                );
            }

            const values = CSVParser.parseLine(line, separator);

            if (values.length !== headers.length) {
                console.warn(
                    `Header/Value mismatch at line ${lineNumber}. Expected ${headers.length}, got ${values.length}. Skipping row.`
                );
                continue;
            }

            const map: Record<string, string> = {};
            headers.forEach((h, idx) => {
                map[h.trim()] = values[idx].trim();
            });

            rows.push(map);
        }

        return rows;
    }

    static parseLine(line: string, sep: string): string[] {
        return line.split(sep).map(c => c.trim());
    }
}
