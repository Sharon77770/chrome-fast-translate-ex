chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0 && details.url.toLowerCase().endsWith('.pdf')) {
    if (details.url.includes('chrome-extension://')) return;

    const viewerUrl = chrome.runtime.getURL(`pdfjs/web/viewer.html?file=${encodeURIComponent(details.url)}`);
    
    chrome.tabs.update(details.tabId, { url: viewerUrl });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.endsWith('.pdf')) {
    // 이미 우리 뷰어로 열려있는지 확인 (무한 루프 방지)
    if (!changeInfo.url.includes('chrome-extension://')) {
      const viewerUrl = chrome.runtime.getURL('pdfjs/web/viewer.html');
      const newUrl = `${viewerUrl}?file=${encodeURIComponent(changeInfo.url)}`;
      chrome.tabs.update(tabId, { url: newUrl });
    }
  }
});

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