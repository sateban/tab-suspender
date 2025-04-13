console.log("Popup");

// document.addEventListener("close-tabs", () => {
// 	console.log("Close tabs event triggered");
// 	chrome.tabs.query({}, (tabs) => {
// 		let tabIds = tabs.map(tab => tab.id);
// 		chrome.tabs.remove(tabIds, () => {
// 			console.log("All tabs closed.");
// 		});
// 	});
// });

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("close-tabs");

  closeBtn.addEventListener("click", async () => {
    console.log("button");
    try {
      // const tabs = await chrome.tabs.query({});
      // const tabIds = tabs.map(tab => tab.id);
      // chrome.tabs.remove(tabIds);
      //   console.log(chrome.tabs);
      chrome.tabs.query({}, (tabs) => {
        let tabUrls = [];
        // console.log(tabs);
        for (let tab of tabs) {
          if (
            !tab.url.startsWith("chrome://") &&
            tab.url.startsWith("https://www.google.com/")
          ) {
            // if (tabUrls.includes(tab.id)) {
            let setting = "tab_" + tab.id;
            // console.log("Tab:", setting, tab.id, tab.url);

            getSetting(setting).then((value) => {
              console.log("Value is:", value);

              if (value !== undefined) {
                console.log("Already saved", tab.id, tabUrls);
                // chrome.tabs.update(tab.id, { url: "https://example.com/redirected.html" });
                chrome.tabs.update(tab.id, {
                  url: chrome.runtime.getURL("sample.html"),
                });
              } else {
                saveSetting(setting, tab);
                console.log("Settings saved", tab.id, tabUrls);
              }
            }); 

            // tabUrls.push({ id: tab.id, url: tab.url, ts: Date.now() });
            // }
          }
        }

        // console.log("tabs1", tabUrls);
        // console.log("local", chrome.storage);

        // printAllSettings().then((value) => {
        //   console.log("Data:", value);
        // }).catch((error) => {
        //   console.error("Error retrieving setting:", error);
        // });

        // chrome.storage.local.set({ savedTabs: tabUrls }, () => {
        //   console.log("Original tabs saved.");
        // });
      });
    } catch (error) {
      console.error("Failed to close tabs:", error);
    }
  });

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyExtensionDB", 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function printAllSettings() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("settings", "readonly");
      const store = transaction.objectStore("settings");
      let cursorRequest = store.openCursor();
      //   const request = store.getAll(); // Use getAll to retrieve all settings
      //   console.log(request);

      cursorRequest.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
          console.log("Setting:", cursor.key, cursor.value);
          cursor.continue();
        } else {
          console.log("All settings printed.");
        }
      };

      //   request.onsuccess = () => resolve(request.result); // Resolve with all settings
      //   request.onerror = () => reject(request.error);

      //   request.onsuccess = () => resolve(request.result?.value);
      //   request.onerror = () => reject(request.error);
    });
  }

  async function saveSetting(key, value) {
    const db = await openDatabase();
    const transaction = db.transaction("settings", "readwrite");
    const store = transaction.objectStore("settings");
    store.put({ key, value });
  }

  async function getSetting(key) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("settings", "readonly");
      const store = transaction.objectStore("settings");
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }
});
