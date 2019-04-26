// vim:set sw=2 ts=2 sts=2 expandtab:

const camera = document.getElementById("camera");

function bindCamera() {
  const constraints = {
    audio: false,
    video: true
  };
  const promise = navigator.mediaDevices.getUserMedia(constraints);
  promise.then(function(stream) {
    camera.srcObject = stream;
  }).catch(function(err) {
    alert(err);
  });
}

function playBell() {
  const audio = document.getElementById("bell");
  if (audio.paused) {
    audio.play();
  } else {
    audio.currentTime = 0;
  }
}

function notifyToSlack() {
  const token = location.search.substring(1);
  const ctx = document.getElementById("cameracanvas").getContext("2d");
  // impl.
}

function ring() {
  playBell();
  notifyToSlack();
}

bindCamera();
