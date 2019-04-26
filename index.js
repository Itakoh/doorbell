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

function toBlob(dataURL, mimeType) {
  const bin = atob(dataURL.split(",")[1]);
  const array = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    array[i] = bin.charCodeAt(i);
  }
  return new Blob([array], {type: mimeType});
}

function takePhoto() {
  const photo = document.getElementById("photo");
  photo.getContext("2d").drawImage(camera, 0, 0, photo.width, photo.height);
  const mimeType = "image/jpeg";
  return toBlob(photo.toDataURL(mimeType), mimeType);
}

function notifyToSlack() {
  const token = location.search.substring(1);
}

function ring() {
  playBell();
  console.log(takePhoto());
  notifyToSlack();
}

bindCamera();
