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
  const formData = new FormData();
  formData.append("token", token);
  formData.append("filename", "photo.jpg");
  formData.append("length", photoBlob.size);

  const r = await fetch("https://slack.com/api/files.getUploadURLExternal", {
    method: "POST",
    body: formData
  });
  const j = await r.json();

  const formData2 = new FormData();
  formData2.append("token", token);
  formData2.append("filename", "photo.jpg");
  formData2.append("file", photoBlob);

  console.log("GO2");
  const r2 = await fetch(j.upload_url, {
    method: "POST",
    body: formData2,
    mode: 'no-cors'
  });
  console.log(r2);
  //const j2 = await r2.json();
  //console.log(j2);

  const formData3 = new FormData();
  formData3.append("token", token);
  formData3.append("files", JSON.stringify([{"id":j.file_id}]));
  formData3.append("channel_id", "GJ7SH8L5T");
  formData3.append("initial_comment", message);

  const r3 = await fetch("https://slack.com/api/files.completeUploadExternal", {
    method: "POST",
    body: formData3
  });
  console.log(r3);
  const j3 = await r3.json();
  console.log(j3);
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
