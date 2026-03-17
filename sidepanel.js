document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('placeholder');
  const loading = document.getElementById('loading');
  const resultContainer = document.getElementById('resultContainer');
  const originalTextEl = document.getElementById('originalText');
  const translatedTextEl = document.getElementById('translatedText');

  const FREE_SERVERS = [
    'https://translate.argosopentech.com/translate',
    'https://libretranslate.pussthecat.org/translate',
    'https://libretranslate.de/translate'
  ];

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'TRANSLATE_THIS' && request.text) {
      placeholder.style.display = 'none';
      resultContainer.style.display = 'none';
      loading.style.display = 'block';

      originalTextEl.innerText = request.text;
      startTranslation(request.text);
    }
  });

  
  async function startTranslation(text) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`HTTP 에러: ${response.status}`);
      
      const data = await response.json();
      
      if (data && data[0]) {
        let fullTranslation = "";
        data[0].forEach(part => {
          if (part[0]) fullTranslation += part[0];
        });
        translatedTextEl.innerText = fullTranslation;
      } else {
        throw new Error("번역 데이터를 분석할 수 없습니다.");
      }

    } catch (error) {
      console.error("번역 실패:", error);
      translatedTextEl.innerText = `🚨 에러: 번역 서버와 연결할 수 없습니다. (${error.message})`;
    } finally {
      loading.style.display = 'none';
      resultContainer.style.display = 'block';
    }
  }


  async function fetchTranslation(url, text) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'ko',
        format: 'text',
        api_key: ""
      })
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("Rate limit exceeded");
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText || null;
  }
});