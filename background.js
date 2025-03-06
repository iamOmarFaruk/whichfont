let isOn = false;

chrome.action.onClicked.addListener(async (tab) => {
  if (!isOn) {
    // অন (inject) – content.js চালু করব
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    isOn = true;
  } else {
    // অফ (বন্ধ) – content.js-কে জানাব যে "exit" হয়ে যাও
    // আমরা একটি ম্যাসেজ পাঠাব
    await chrome.tabs.sendMessage(tab.id, { command: "exitFontFinder" });
    isOn = false;
  }
});
