chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0 && details.url.toLowerCase().endsWith('.pdf')) {
    if (details.url.includes('chrome-extension://')) return;

    const viewerUrl = chrome.runtime.getURL(`pdfjs/web/viewer.html?file=${encodeURIComponent(details.url)}`);
    
    chrome.tabs.update(details.tabId, { url: viewerUrl });
  }
});