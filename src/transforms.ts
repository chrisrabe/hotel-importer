import readline from 'readline';

export const transformEntryToJson = (entry: any, onComplete: () => void) => {
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
      } else {
        constructedObj.push(trimmedLine);
      }
    }
  });
  lineReader.on('close', () => {
    onComplete();
  });
};
