import readline from 'readline';

type TransformFunction = (
  entry: any,
  onData: (data: Record<string, any>) => void,
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
  lineReader.on('close', () => {
    onComplete();
  });
};
