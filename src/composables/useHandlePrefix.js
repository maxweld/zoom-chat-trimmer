export default function (dividedChat, fullName, shortName) {
  //
  // dividedChat = [
  //   {
  //     prefix: String
  //     text: String
  //   }
  // ]
  //
  return dividedChat.map((el) => {
    const nameFrom = el.prefix.indexOf(" From ");
    const nameTo = el.prefix.indexOf("To Everyone:");
    let prefix = el.prefix.substring(nameFrom + 6, nameTo).trim();

    if (shortName) {
      if (fullName === prefix) {
        prefix = shortName;
      } else {
        prefix = "";
      }
    } else if (fullName) {
      if (fullName !== prefix) {
        prefix = "";
      }
    }

    const text = el.text;
    return { prefix, text };
  });
}
