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

function playSound(soundId) {
  const sound = document.getElementById(soundId);
  if (sound.paused) {
    sound.play();
    return true;
  } else {
    sound.currentTime = 0;
    return false;
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

function notifyToSlack1(message, photoBlob) {
  const token = location.hash.substring(1);
  const formData = new FormData();
  formData.append("token", token);
  formData.append("channels", "GJ7SH8L5T");
  formData.append("file", photoBlob);
  formData.append("filename", "photo.jpg");
  formData.append("initial_comment", message);

  fetch("https://slack.com/api/files.upload", {
    method: "POST",
    body: formData
  });
}

async function notifyToSlack(message, photoBlob) {
  const token = location.hash.substring(1);

  const f1 = new FormData();
  f1.append("token", token);
  f1.append("filename", "photo.jpg");
  f1.append("length", photoBlob.size);
  const {upload_url, file_id} = await (await fetch("https://slack.com/api/files.getUploadURLExternal", {method: "POST", body: f1})).json();

  const f2 = new FormData();
  f2.append("token", token);
  f2.append("filename", "photo.jpg");
  f2.append("file", photoBlob);
  await fetch(upload_url, {method: "POST", body: f2, mode: "no-cors"});

  const f3 = new FormData();
  f3.append("token", token);
  f3.append("files", `[{"id":"${file_id}"}]`);
  f3.append("channel_id", "GJ7SH8L5T");
  f3.append("initial_comment", message);
  fetch("https://slack.com/api/files.completeUploadExternal", {method: "POST", body: f3});
}

async function ring(soundId, message) {
  if (playSound(soundId)) {
    notifyToSlack(message, await takePhoto());
  }
}

function getSeason() {
  const m = 1 + new Date().getMonth();
  if (1  == m)            return "newyear";
  if (2  <= m && m <=  3) return "winter";
  if (4  <= m && m <=  6) return "spring";
  if (7  <= m && m <=  9) return "summer";
  if (10 <= m && m <= 11) return "autumn";
  if (12 == m)            return "xmas";
  return "spring";
}

function refreshBackgroundImage() {
  document.body.style.backgroundImage = `url(${getSeason()}.png)`;
}


bindCamera();

refreshBackgroundImage();
setInterval(refreshBackgroundImage, 8 * 60 * 60 * 1000);
