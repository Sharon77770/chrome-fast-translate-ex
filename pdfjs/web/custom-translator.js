// PDF.js 뷰어 안에서 드래그를 감지하는 코드
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText.length > 0) {
    // 크롬 익스텐션 시스템을 통해 사이드 패널로 메시지 전송
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'TRANSLATE_SELECTION', text: selectedText }, () => {
        // 사이드 패널이 닫혀있을 때 발생하는 에러 무시
        void chrome.runtime.lastError;
      });
    }
  }
});

console.log("PDF 번역 스크립트가 성공적으로 로드되었습니다!");
