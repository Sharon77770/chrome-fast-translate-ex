chrome.commands.onCommand.addListener((command) => {
  if (command === "open_side_panel") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) chrome.sidePanel.open({ tabId: tabs[0].id });
    });
  } else if (command === "switch_tab_next") {
    chrome.runtime.sendMessage({ type: "SWITCH_TAB_NEXT" });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRANSLATE_THIS') {
    chrome.runtime.sendMessage(message);
  }
});