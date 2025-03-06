let whichFontisOn = false;

// Get previously saved state when extension loads
chrome.storage.local.get(["whichFontisOn"], (result) => {
  if (typeof result.whichFontisOn !== "undefined") {
    whichFontisOn = result.whichFontisOn;
  }
});


// Message Listener, যেকোনো content script → background মেসেজ ধরবে
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXIT_FONT_FINDER') {
    // এখানে আমরা whichFontisOn = false সেট করব ও সেভ করব
    whichFontisOn = false;
    chrome.storage.local.set({ whichFontisOn: false }, () => {
      // সেভ সম্পন্ন হলে success:true রিসপন্স দিব
      sendResponse({ success: true });
    });
    // অ্যাসিনক্রোনাস রেসপন্স হবে বলে return true
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
    await chrome.tabs.sendMessage(tab.id, { command: "exitFontFinder" });
    whichFontisOn = false;
    chrome.storage.local.set({ whichFontisOn });
  }
});
