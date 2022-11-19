export default function (textData) {
  const textLines = [];
  const lines = textData.split("\t").join("").split("\r\n");

  let line = 0;
  for (let i = 0; i < lines.length; i = i + 2) {
    const el = {
      prefix: lines[i],
      text: lines[i + 1],
    };
    if (el.prefix && el.text) textLines.push(el);
  }
  return textLines;
}
