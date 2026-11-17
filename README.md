# Syndex

A Chrome extension that provides an easy, straightforward way to swap synonyms in Gmail.

Syndex is especially useful when sending a professional email. It provides support for finding superior word fit without relying on generative AI. This extension will also will help with learning new vocabulary.

## Functions

When activated in Gmail, users can access Syndex's features automatically with no key binds. When typing an email, the user can use their cursor to select a word, either via a double left click or a left click-and-drag. Once the word is selected, hold down the left click for a short moment and then release. There should be a small box below the selected word. On hover, you can scroll through this box and be shown synonyms of the selected word. There will be a counter from 1-100, and it will say what number synonym you are on.

## Code

```js
background.js
...
let selectedWord = null;
let selectedRange = null;
let mouseDownTime = 0;
let holdThreshold = 300;
let lastWheelTime = 0;


document.addEventListener('mousedown', (e) => {
  mouseDownTime = Date.now();
  console.log('mousedown fired');
});

document.addEventListener('mouseup', (e) => {
  const holdDuration = Date.now() - mouseDownTime;
  console.log('mouseup fired, duration:', holdDuration, 'selected:', window.getSelection().toString());
```

## Important notes

1. As of now, this project only works for Gmail.
2. Syndex is an on-going project, more updates are planned.

## Links for Download

Chrome Web Store: <https://chromewebstore.google.com/detail/syndex/fkfodeopodhhojomgfgbblpledidlibf>

Google Docs: Coming Soon

## Privacy Policy

Syndex is an open-source Chrome extension designed to help users find synonyms within Gmail. Syndex does not collect, store, log, or transmit any personal user data, emails, or browsing history to any external servers. All text processing occurs locally within the active browser tab, and requests sent to the Datamuse API are anonymous and stateless.
