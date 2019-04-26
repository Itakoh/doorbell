// vim:set sw=2 ts=2 sts=2 expandtab:

const camera = document.getElementById("camera");

async function bindCamera() {
  const constraints = {
    audio: false,
    video: true
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    camera.srcObject = stream;
  } catch(err) {
    alert(err);
  }
}

function playBell() {
  const bell = document.getElementById("bell");
  if (bell.paused) {
    bell.play();
  } else {
    bell.currentTime = 0;
  }
}

async function toBlob(dataURL) {
  return (await fetch(dataURL)).blob();
}

function takePhoto() {
  const photo = document.getElementById("photo");
  photo.getContext("2d").drawImage(camera, 0, 0, photo.width, photo.height);
  return toBlob(photo.toDataURL("image/jpeg"));
}

function notifyToSlack() {
  const token = location.search.substring(1);
}

async function ring() {
  playBell();
  console.log(await takePhoto());
  notifyToSlack();
}

bindCamera();
