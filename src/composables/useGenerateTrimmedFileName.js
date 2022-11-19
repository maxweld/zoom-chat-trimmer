export default function (sourceFile) {
  const workArray = sourceFile.split(".");
  workArray.pop();
  workArray.push("trimmed.txt");
  return workArray.join(".");
}
