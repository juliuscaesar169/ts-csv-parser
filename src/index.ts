import fs from "node:fs"
import path from "node:path";
import { Readable } from 'stream';

/**
 * MAIN FUNCTION
 */
function csvParser(inputStream: Readable): Promise<Array<Record<string, string>>> {
  return new Promise((res, rej) => {
    const records: Array<Record<string, string>> = [];  
    let header: string[] | undefined;
    let currentRecord: string[] | any = [];
    let currentField: string = '';
    let inQuotes = false;
    let counter = 0
    
    const processRecord = () => {
      // set header (first iteration)
      if (header === undefined) {
        header = currentRecord
        currentRecord = []
        return
      }
      
      // validate record fields
      if (currentRecord.length !== header.length) rej(new Error(`Invalid number of fields in ${header.length > currentRecord.length ? 'header' : 'record'} at line ${counter + 1}`))
      
      // format record
      const formatedRecord:any = {}
      for (let j = 0; j < currentRecord.length; j++) formatedRecord[header[j]] = currentRecord[j]
      records.push(formatedRecord);
      currentRecord = [];
      counter++
    }

    const processField = () => {
      currentRecord.push(currentField);
      currentField = '';
    }

    inputStream.on('data', (chunk: Buffer) => {
      for (let i = 0; i < chunk.length; i++) {
        const char = String.fromCharCode(chunk[i]);
        const nextChar = String.fromCharCode(chunk[i + 1]);

        if (inQuotes) {
          if (char === '"' && nextChar === '"') {
            currentField += '"';
            i++; // skip next double quote
          } else if (char === '"') {
            inQuotes = false;
          } else {
            currentField += char;
          }
        } else {
          if (char === ',') {
            processField();
          } else if (char === '\n') {
            processField();
            processRecord();
          } else if (char === '"') {
            inQuotes = true;
          } else {
            currentField += char;
          }
        }
      }
    });

    // resolve
    inputStream.on('end', () => res(records));

    // reject
    inputStream.on('error', (err) => rej(err));
  });
}

/** Create Stream */
let stream

/**
 * From Command Line Argument as first option
 */
const filePathFromCommandLine = process.argv[2] || undefined
if (filePathFromCommandLine?.match(/\.csv$/)) stream = fs.createReadStream(filePathFromCommandLine)

/**
 * From folder csvToParse as alternative
 */
if (!filePathFromCommandLine?.match(/\.csv$/)) {
  // Directory with the csv files to parse
  const __dirname =  "src/csvToParse";
  
  // Get all the relevant files (.csv)
  const filesToParse = fs.readdirSync(__dirname)?.filter(file => /\.csv$/.test(file));
  
  // File path. Use only the first one
  const filePath = filesToParse?.[0] ? path.join(__dirname, filesToParse?.[0]) : null;
  
  // Create Stream
  stream = filePath ? fs.createReadStream(filePath) : null;
}

/** Demo purpose */
if(stream) {
  csvParser(stream)
    .then((parsedCSV) => console.log('parsedCSV: ', parsedCSV))
    .catch((err) => console.error(err));
}

export { csvParser }
