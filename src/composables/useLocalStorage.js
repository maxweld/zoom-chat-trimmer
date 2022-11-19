import localStorageAvailable from "./useCheckLocalStorageAvailable.js";

export default function (storageName, action = "get", value) {
  try {
    if (localStorageAvailable("localStorage")) {
      if (action === "get") return localStorage.getItem(storageName);
      else {
        return localStorage.setItem(storageName, value);
      }
    } else {
      console.log("no local storage available");
      return "";
    }
  } catch (error) {
    console.log(error.message);
    return "";
  }
}
