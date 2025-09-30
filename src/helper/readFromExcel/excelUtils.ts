import * as XLSX from 'xlsx';

export class ExcelUtils {

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
            throw error; // Re-throw the error to be handled in the step definition
        }
    }
}