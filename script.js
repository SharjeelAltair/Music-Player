console.log("lets write a JS");

let currentSong = new Audio();
let currFolder;
let songs;

let tide;

function secondsToMinutesSeconds(seconds) {
  // Round seconds to the nearest whole number
  const roundedSeconds = Math.round(seconds);

  // Calculate minutes and seconds
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  // Format minutes and seconds as two digits
  const minutesFormatted = minutes.toString().padStart(2, "0");
  const secondsFormatted = remainingSeconds.toString().padStart(2, "0");

  // Return the formatted string
  return `${minutesFormatted}:${secondsFormatted}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/assets/songs/${currFolder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let library = document.querySelector(".songs").getElementsByTagName("ul")[0];
  library.innerHTML = "";
  for (const song of songs) {
    songName = song;
    library.innerHTML =
      library.innerHTML +
      `(
          <li>
            <i class="fa-solid fa-music"></i>
            <div class="info">
              <p class="songName" >${songName.replaceAll("%20", " ")}</p>
              <p>SharjeelAC</p>
            </div>
            <i class="fa-solid fa-circle-play"></i>
          </li>
        )`;
  }
  Array.from(
    document.querySelector(".songs").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.getElementsByClassName("songName")[0].innerHTML.trim());
      playMusic(e.getElementsByClassName("songName")[0].innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/assets/songs/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "assets/SVGS/pause.svg";
  }
  document.querySelector(".songinfos").innerText = decodeURI(track);
  document.querySelector(".duration");
};

async function displayAlbums() {
  console.log("displaying albums");
  let a = await fetch(`assets/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".albums");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];
      // Get the metadata of the folder
      let a = await fetch(`assets/songs/${folder}/info.json`);
      tide = await a.json();
     
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="album">
          <img src="assets/songs/${folder}/cover.jpg" alt="">
          <i class="fa-regular fa-circle-play"></i>
          <p>${tide.title}</p>
          <p class="des">${tide.description}</p>
        </div>`;
    }
  }

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("album")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log("Fetching Songs");
      songs = await getSongs(`${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getSongs("chill");
  playMusic(songs[1], true);

  // display alibums
  displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/SVGS/pause.svg";
    } else {
      currentSong.pause();
      play.src = "assets/SVGS/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".bars").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".footer").style.left = "0";
  });

  document.querySelector(".x-mark").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-80vw";
    document.querySelector(".footer").style.left = "-80vw";
  });

  // document.querySelector(".banner", ".albums").addEventListener("click", () => {
  //   document.querySelector(".left").style.left = "-80vw";
  //   document.querySelector(".footer").style.left = "-80vw";
  // });

  previous.addEventListener("click", () => {
    console.log("previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) playMusic(songs[index - 1]);
  });
  next.addEventListener("click", () => {
    console.log("Next clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) playMusic(songs[index + 1]);
  });

  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = e.target.value / 100;
    });

  Array.from(document.getElementsByClassName("album")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      console.log(item.currentTarget.dataset.folder);
      songs = await getSongs(item.currentTarget.dataset.folder);
      console.log("Songs:", songs);
    });
  });

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      console.log(e.target);
      e.target.scr = e.target.src = "assets/SVGS/mute.svg";
      currentSong.volume = 0;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.scr = e.target.src = "assets/SVGS/volume.svg";
      currentSong.volume = 0.1;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 20;
    }
  });
}
main();
