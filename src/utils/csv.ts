export const parseCSV = (content: string): Record<string, string>[] => {
  const [headerLine, ...lines] = content.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((item) => item.trim());
  return lines
    .map((line) => line.split(",").map((item) => item.trim()))
    .filter((line) => line.length === headers.length)
    .map((line) =>
      headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = line[index];
        return acc;
      }, {})
    );
};
