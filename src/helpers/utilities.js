export const generateTrimmedFileName = function (sourceFile) {
  const workArray = sourceFile.split(".");
  workArray.pop();
  workArray.push("trimmed.txt");
  return workArray.join(".");
};

export const divideChatLines = function (textData) {
  const dividedChat = {
    prefixes: [],
    textLines: [],
  };
  const lines = textData.split("\r\n");
  lines.forEach((line) => {
    if (line[0] === `\t`) dividedChat.textLines.push(line.substring(1));
    else if (line !== "") dividedChat.prefixes.push(line);
  });
  return dividedChat;
};
