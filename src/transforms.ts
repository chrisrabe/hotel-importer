import readline from 'readline';

type TransformFunction = (
  entry: any,
  onData: (data: any) => void,
  onComplete: () => void
) => void;

export const transformEntryToJson: TransformFunction = (
  entry,
  onData,
  onComplete
) => {
  const ignored = ['[', ']'];
  let constructedObj: string[] = [];
  const lineReader = readline.createInterface({
    input: entry,
  });
  lineReader.on('line', (line) => {
    const trimmedLine = line.trim();
    if (!ignored.includes(trimmedLine)) {
      if (trimmedLine === '}' || trimmedLine === '},') {
        constructedObj.push('}');
        const jsonObj = JSON.parse(constructedObj.join(''));
        constructedObj = [];
        onData(jsonObj);
      } else {
        constructedObj.push(trimmedLine);
      }
    }
  });
  lineReader.on('close', onComplete);
};

export const transformEntryToCSV: TransformFunction = (
  entry,
  onData,
  onComplete
) => {
  const delimiter = '|';
  let headers: string[] | undefined = undefined;
  const lineReader = readline.createInterface({
    input: entry,
  });
  lineReader.on('line', (line) => {
    const data = line.split(delimiter);
    if (!headers) {
      headers = data.map((key) => key.trim());
    } else {
      const record: Record<string, any> = {};
      for (let i = 0; i < data.length; i++) {
        record[headers[i]] = data[i];
      }
      onData(record);
    }
  });
  lineReader.on('close', onComplete);
};
