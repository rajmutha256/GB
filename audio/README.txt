Audio folder
============

Background music for the floating “Music” button:

  1. Add an MP3 file here, for example: birthday.mp3
  2. The site expects: audio/birthday.mp3

If you use a different filename, update index.html:
  Find <audio id="bg-music"> and change:
    <source src="audio/birthday.mp3" type="audio/mpeg" />

Browsers usually block autoplay with sound; the play button is required so
listeners can start music after one tap.
