// 웹페이지에서 마우스 버튼을 뗐을 때 실행
document.addEventListener('mouseup', () => {
  // 사용자가 드래그한 텍스트 가져오기
  const selectedText = window.getSelection().toString().trim();
  
  // 텍스트가 비어있지 않다면 사이드 패널로 전송!
  if (selectedText.length > 0) {
    chrome.runtime.sendMessage({ 
      type: 'TRANSLATE_THIS', 
      text: selectedText 
    }).catch(err => {
      // 사이드 패널이 닫혀있을 때 발생하는 에러 무시
      // console.log("사이드 패널이 닫혀있습니다."); 
    });
  }
});