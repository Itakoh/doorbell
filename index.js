// vim:set sw=2 ts=2 sts=2 expandtab:

const camera = document.getElementById("camera");

async function bindCamera() {
  const constraints = {
    audio: false,
    video: {
      width: 320,
      frameRate: 5
    }
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

function notifyToSlack(visitor, photoBlob) {
  const token = location.hash.substring(1);
  const formData = new FormData();
  formData.append("token", token);
  formData.append("channels", "GJ7SH8L5T");
  formData.append("file", photoBlob);
  formData.append("filename", "photo.jpg");
  formData.append("initial_comment", visitor);

  fetch("https://slack.com/api/files.upload", {
    method: "POST",
    body: formData
  });
}

async function ring(visitor) {
  playBell();
  notifyToSlack(visitor, await takePhoto());
}

bindCamera();
