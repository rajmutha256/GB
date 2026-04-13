Audio folder
============

Background music for the floating “Music” button:

  1. Add your MP3 as: audio/bg-music.mp3  (simple name = fewer URL bugs)
  2. In index.html, <audio id="bg-music"> should point at audio/bg-music.mp3

To use a different name, change the <source src="..."> and keep the filename
short (no spaces) if possible.

Browsers usually block autoplay with sound; the play button is required so
listeners can start music after one tap.
