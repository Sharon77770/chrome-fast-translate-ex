document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.section');
  
  function switchTab(tabName) {
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
    targetTab.classList.add('active');
    document.getElementById(`${tabName}-section`).classList.add('active');
    if(tabName === 'history') renderHistory();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === "SWITCH_TAB_NEXT") {
      const activeTab = document.querySelector('.tab-btn.active');
      let nextTab = activeTab.nextElementSibling || document.querySelector('.tab-btn:first-child');
      nextTab.click();
    }
    
    if (request.type === 'TRANSLATE_THIS' && request.text) {
      document.getElementById('scroll-placeholder').style.display = 'none';
      document.getElementById('scroll-result').style.display = 'none';
      document.getElementById('scroll-loading').style.display = 'block';
      document.getElementById('scroll-original').innerText = request.text;
      translate(request.text, 'scroll');
    }
  });

  document.getElementById('btn-input-translate').addEventListener('click', () => {
    const text = document.getElementById('input-text').value.trim();
    if (text) translate(text, 'input');
  });

  async function translate(text, mode) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      let translated = "";
      data[0].forEach(part => { if (part[0]) translated += part[0]; });

      if (mode === 'scroll') {
        document.getElementById('scroll-translated').innerText = translated;
        document.getElementById('scroll-loading').style.display = 'none';
        document.getElementById('scroll-result').style.display = 'block';
      } else {
        document.getElementById('input-translated').innerText = translated;
        document.getElementById('input-result-card').style.display = 'block';
      }
      saveToHistory(text, translated);
    } catch (e) { console.error(e); }
  }

  function saveToHistory(original, translated) {
    chrome.storage.local.get({ history: [] }, (data) => {
      let history = data.history.filter(item => item.original !== original);
      history.unshift({ original, translated });
      if (history.length > 50) history.pop();
      chrome.storage.local.set({ history });
    });
  }

  function renderHistory() {
    const list = document.getElementById('history-list');
    chrome.storage.local.get({ history: [] }, (data) => {
      if (data.history.length === 0) {
        list.innerHTML = '<p style="padding:20px; text-align:center; color:#94a3b8; font-size:13px;">저장된 단어가 없습니다.</p>';
        return;
      }
      list.innerHTML = data.history.map(item => `
        <div class="history-item">
          <div class="history-q">${item.original}</div>
          <div class="history-a">${item.translated}</div>
        </div>
      `).join('');
    });
  }

  document.getElementById('btn-clear-history').addEventListener('click', () => {
    if(confirm("단어장을 비울까요?")) chrome.storage.local.set({ history: [] }, renderHistory);
  });
});