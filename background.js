let whichFontisOn = false;

// Get previously saved state when extension loads
chrome.storage.local.get(["whichFontisOn"], (result) => {
  if (typeof result.whichFontisOn !== "undefined") {
    whichFontisOn = result.whichFontisOn;
  }
});


// Message Listener - will catch any messages from content script to background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXIT_WHICH_FONT') {
    // Here we will set whichFontisOn = false and save it
    whichFontisOn = false;
    chrome.storage.local.set({ whichFontisOn: false }, () => {
      // After saving is complete, send success:true response
      sendResponse({ success: true });
    });
    // Return true because this is an asynchronous response
    return true;
  }
});





// Logic for toggling when clicking the extension icon
chrome.action.onClicked.addListener(async (tab) => {
  if (!whichFontisOn) {
    // ON (Inject) - Will activate content.js
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    whichFontisOn = true;
    chrome.storage.local.set({ whichFontisOn });
  } else {
    // OFF - Tell content.js to "exit"
    await chrome.tabs.sendMessage(tab.id, { command: "whichfontexit" });
    whichFontisOn = false;
    chrome.storage.local.set({ whichFontisOn });
  }
});
