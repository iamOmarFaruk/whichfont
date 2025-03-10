let whichFontisOn = false;

// এক্সটেনশন লোড হলে আগের স্টেট লোড করো
chrome.storage.local.get(["whichFontisOn"], (result) => {
  if (typeof result.whichFontisOn !== "undefined") {
    whichFontisOn = result.whichFontisOn;
  }
});

// Content script ইনজেক্ট করার ফাংশন
async function injectContentScript(tabId, tab) {
  try {
    // শুধুমাত্র http বা https পেজে ইনজেক্ট করো
    if (!tab.url || !tab.url.startsWith('http')) return;
    
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"],
    });
  } catch (error) {
    console.warn("Script Injection Failed:", error);
  }
}

// পেজ রিলোড হলে আবার content.js ইনজেক্ট করো (যদি আগে অন থাকে)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local.get(["whichFontisOn"], (result) => {
      if (result.whichFontisOn) {
        injectContentScript(tabId, tab);
      }
    });
  }
});

// Message Listener - Content Script থেকে মেসেজ ধরার জন্য
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "EXIT_WHICH_FONT") {
    whichFontisOn = false;
    chrome.storage.local.set({ whichFontisOn: false }, () => {
      sendResponse({ success: true });
    });
    return true; // Async response নিশ্চিত করার জন্য
  }
});

// এক্সটেনশন আইকনে ক্লিক করলে টগল করবে
chrome.action.onClicked.addListener(async (tab) => {
  if (!whichFontisOn) {
    // ON - Inject content.js
    await injectContentScript(tab.id, tab);
    whichFontisOn = true;
    chrome.storage.local.set({ whichFontisOn });
  } else {
    // OFF - প্রথমে চেক করবো content.js অ্যাক্টিভ আছে কিনা, তারপর মেসেজ পাঠাবো
    chrome.tabs.sendMessage(tab.id, { command: "whichfontexit" }).catch((error) => {
      console.warn("Content script missing, skipping message:", error);
    });

    whichFontisOn = false;
    chrome.storage.local.set({ whichFontisOn });
  }
});
