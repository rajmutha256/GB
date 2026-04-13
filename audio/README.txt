Audio folder
============

Background music for the floating “Music” button:

  1. Add an MP3 file here.
  2. In index.html, find <audio id="bg-music"> and set <source src="...">
     to your file. Use URL encoding for spaces in the filename (e.g. %20).

Current project uses a long filename; you can rename to e.g. see-you-again.mp3
for simpler paths.

Browsers usually block autoplay with sound; the play button is required so
listeners can start music after one tap.
