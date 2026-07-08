console.log('SynoSwap content script loaded');

let selectedWord = null;
let selectedRange = null;
let mouseDownTime = 0;
let holdThreshold = 300;

document.addEventListener('mousedown', (e) => {
  mouseDownTime = Date.now();
  console.log('mousedown fired');
});

document.addEventListener('mouseup', (e) => {
  const holdDuration = Date.now() - mouseDownTime;
  console.log('mouseup fired, duration:', holdDuration, 'selected:', window.getSelection().toString());

  if (holdDuration >= holdThreshold && window.getSelection().toString().length > 0) {
    const selection = window.getSelection();
    selectedWord = selection.toString().trim();
    selectedRange = selection.getRangeAt(0);
    console.log('Selected word:', selectedWord);

    if (selectedWord.length > 0) {
      const rect = selectedRange.getBoundingClientRect();
      console.log('Rect:', rect);

      // Call actual background script for synonyms
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage(
          { action: 'getSynonyms', word: selectedWord },
          (response) => {
            if (response && response.synonyms && response.synonyms.length > 0) {
              showPopup(response.synonyms, rect);
            }
          }
        );
      }
    }
  }
});

function showPopup(synonyms, position) {
  const existing = document.getElementById('synoswap-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'synoswap-popup';
  popup.style.cssText = `
    position: fixed;
    top: ${position.bottom + 10}px;
    left: ${position.left}px;
    background: #2a2a2a;
    border: 2px solid #444;
    border-radius: 8px;
    padding: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    color: #fff;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    min-width: 200px;
    cursor: pointer;
    user-select: none;
  `;

  let currentIndex = 0;

  const updateDisplay = (index) => {
    popup.textContent = synonyms[index] + ` (${index + 1}/${synonyms.length})`;
    popup.style.backgroundColor = '#333';
  };

  updateDisplay(0);
  document.body.appendChild(popup);

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      currentIndex = (currentIndex + 1) % synonyms.length;
    } else {
      currentIndex = (currentIndex - 1 + synonyms.length) % synonyms.length;
    }
    updateDisplay(currentIndex);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    replaceWord(synonyms[currentIndex]);
    popup.remove();
    document.removeEventListener('click', handleClickOff);
    popup.removeEventListener('wheel', handleWheel);
  };

  const handleClickOff = (e) => {
    if (e.target !== popup) {
      popup.remove();
      document.removeEventListener('click', handleClickOff);
      popup.removeEventListener('wheel', handleWheel);
    }
  };

  popup.addEventListener('wheel', handleWheel);
  popup.addEventListener('click', handleClick);

  setTimeout(() => {
    document.addEventListener('click', handleClickOff);
  }, 100);
}

function replaceWord(newWord) {
  if (!selectedRange) return;

  try {
    const startContainer = selectedRange.startContainer;
    const startOffset = selectedRange.startOffset;
    const endOffset = selectedRange.endOffset;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      // Direct text node replacement
      const text = startContainer.textContent;
      const newText = text.substring(0, startOffset) + newWord + text.substring(endOffset);
      startContainer.textContent = newText;
    } else {
      // Fallback: delete and insert
      selectedRange.deleteContents();
      const textNode = document.createTextNode(newWord);
      selectedRange.insertNode(textNode);
    }
  } catch (error) {
    console.error('Error replacing word:', error);
  }
}