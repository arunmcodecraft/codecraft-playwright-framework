import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

export class readFromDataFileUtils {

    // ✅ Read Excel data
    public static async readData(filePath: string, sheetName: string): Promise<any[]> {
        try {
            const workbook = XLSX.readFile(filePath);
            const worksheet = workbook.Sheets[sheetName];
            if (!worksheet) {
                throw new Error(`Sheet with name '${sheetName}' not found in the workbook.`);
            }
            const data = XLSX.utils.sheet_to_json(worksheet);
            return data;
        } catch (error) {
            console.error(`Error reading Excel file or sheet: ${error}`);
            throw error;
        }
    }

    // ✅ Read CSV data
    public static async readCSV(filePath: string): Promise<any[]> {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`CSV file '${filePath}' not found.`);
            }

            const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
            const records = parse(fileContent, {
                columns: true,   // use first row as headers
                skip_empty_lines: true
            });

            return records;
        } catch (error) {
            console.error(`Error reading CSV file: ${error}`);
            throw error;
        }
    }
}
