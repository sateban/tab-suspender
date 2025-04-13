document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("redirect");

  closeBtn.addEventListener("click", async () => {
    console.log("redirect button");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        const tabId = "tab_" + tabs[0].id;

        // console.log("Current Tab ID:", tabId);
        getSetting(tabId).then((value) => {
          console.log("Current tab: ", value.url);

          history.pushState(null, null, location.href);
          window.onpopstate = function () {
            history.go(1); // Prevents going back
          };

          window.location.href = value.url;
        });
      } else {
        console.log("No active tab found.");
      }
    });

    printAllSettings();
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
          // console.log("Setting: ", cursor.key, cursor.value, cursor);
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
