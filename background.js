chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSynonyms') {
    fetchSynonyms(request.word).then(synonyms => {
      sendResponse({ synonyms: synonyms });
    });
    return true; // Keep channel open for async response
  }
});

async function fetchSynonyms(word) {
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=100`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.map(item => item.word);
  } catch (error) {
    console.error('Error fetching synonyms:', error);
    return [];
  }
}
