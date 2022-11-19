export default function (textLines, lineNumbers = false) {
  const lines = textLines;

  const maxLines = lines.length + 1;
  const lineNumberLength = maxLines.toString().length;

  const prefixLength = lines.reduce((length, currentLine) => {
    const str = currentLine.prefix ? currentLine.prefix : "";
    const strLen = str.length;
    return Math.max(length, strLen);
  }, 0);

  const fileStream = lines.reduce(
    (accumulator, currentLine, i) =>
      accumulator.concat(
        lineNumbers ? (i + 1).toString().padStart(lineNumberLength) + ": " : "",
        currentLine.prefix !== ""
          ? currentLine.prefix.padEnd(prefixLength)
          : "".padEnd(prefixLength),
        currentLine.prefix ? ": " : lineNumbers ? ": " : "",
        currentLine.text,
        "\n"
      ),
    ""
  );
  return fileStream;
}
