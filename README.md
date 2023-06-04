# TypeScript CSV Parser

CSV parser 

## Requirements

- Node 18 LTS or above

## Installation

1. Clone repository

```
    git clone https://github.com/juliuscaesar169/ts-csv-parser.git
```

2. Go to the project

```
    cd ts-csv-parser
```

3. Install dependencies

```
    npm install
```

4. Build parser

```
    npm run build 
```

## Usage

You can check the feature by running the following command:

```
    npm start
```

It will parse the csv file in csvToParse folder and display it by console. Also, you can add a csv file path as argument after it.

Example of adding a file path as argument:

```
    npm start src/csvToParse/example.csv
```

## CSV Format

1. Each record is located on a separate line, delimited by a line break (LF).
2. The last record in the file may or may not have an ending line break.
3. There is a header line appearing as the first line of the file with the same format as normal record lines. This header will contain names corresponding to the fields in the file and should contain the same number of fields as the records in the rest of the file.
4. Within the header and each record, there may be one or more fields, separated by commas. Each line should contain the same number of fields throughout the file. Spaces are considered part of a field and should not be ignored. The last field in the record must not be followed by a comma.
5. Each field may or may not be enclosed in double quotes. If fields are not enclosed with double quotes, then double quotes may not appear inside the fields.
6. Fields containing line breaks (LF), double quotes, and commas should be enclosed in double-quotes.
7. If double-quotes are used to enclose fields, then a double-quote appearing inside a field must be escaped by preceding it with another double quote.
