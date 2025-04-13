// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	if (message.command === "redirectAndSave") {
// 	  chrome.tabs.query({}, (tabs) => {
// 		let tabUrls = [];
// 		for (let tab of tabs) {
// 		  if (!tab.url.startsWith("chrome://")) {
// 			tabUrls.push({ id: tab.id, url: tab.url });
// 			chrome.tabs.update(tab.id, { url: "https://example.com/redirected.html" });
// 		  }
// 		}
  
// 		chrome.storage.local.set({ savedTabs: tabUrls }, () => {
// 		  console.log("Original tabs saved.");
// 		});
// 	  });
// 	}
  
// 	if (message.command === "restoreTabs") {
// 	  chrome.storage.local.get("savedTabs", (data) => {
// 		if (data.savedTabs) {
// 		  for (let entry of data.savedTabs) {
// 			chrome.tabs.update(entry.id, { url: entry.url }, () => {
// 			  if (chrome.runtime.lastError) {
// 				chrome.tabs.create({ url: entry.url }); // If original tab is gone
// 			  }
// 			});
// 		  }
// 		  chrome.storage.local.remove("savedTabs");
// 		}
// 	  });
// 	}
//   });
  