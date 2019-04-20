function playBell() {
  var audio = document.getElementById("bell");
  if (audio.paused) {
    audio.play();
  } else {
    audio.currentTime = 0;
  }
}
