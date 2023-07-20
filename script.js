window.addEventListener("DOMContentLoaded", () => {
  const drums = document.querySelectorAll(".drum");
  const volumeController = document.querySelector("#volume_slider");
  const autoMusicBtn = document.querySelector("#util_btn-auto");
  const themeBtn = document.querySelector("#util_btn-theme");
  const bgBtn = document.querySelector('#util_btn-bg');
  const container = document.querySelector(".container");
  const firstTheme = { bg: "#091921", txt: "#00fff1", darken: "rgba(9,25,33,0.6)" };
  const secondTheme = { bg: "#f7c340", txt: "#2d2d2d", darken: 'rgba(247,195,64,0.6)' };
  const sounds = [
    { key: "w", path: "sounds/sound-1.mp3" },
    { key: "a", path: "sounds/sound-2.mp3" },
    { key: "s", path: "sounds/sound-3.mp3" },
    { key: "d", path: "sounds/sound-4.mp3" },
    { key: "j", path: "sounds/sound-5.mp3" },
    { key: "k", path: "sounds/sound-6.mp3" },
    { key: "l", path: "sounds/sound-7.mp3" },
  ];
  let audioVolume = 0.6;
  let musicInterval = null;
  let isMusicOn = false;
  let isThemeChanged = false;
  let imgUrl = null;

  document.addEventListener("keypress", (e) => makeSound(e.key));

  themeBtn.addEventListener("click", () => {
    isThemeChanged = !isThemeChanged;
    changeTheme(isThemeChanged);
  });

  bgBtn.addEventListener('click', getRandomPhoto);

  function getRandomPhoto() {
    fetch("https://api.unsplash.com/photos/random?query=nature", {
      headers: {
        Authorization: "Client-ID 5qXisaWqFLCjwVX2IMgvTYqgY3jmBE23ANWeD5FFmgM",
      },
    })
      .then((data) => data.json())
      .then((res) => {
        imgUrl = res?.urls?.regular;
        changeBg(imgUrl);
      })
      .catch((error) => console.log(error));
  }

  function changeBg(imgUrl) {
    if (!isThemeChanged) {
      container.style.background = `linear-gradient(300deg, ${firstTheme.darken},${firstTheme.darken}),url(${imgUrl})`;
    } else {
      container.style.background = `linear-gradient(300deg, ${secondTheme.darken},${secondTheme.darken}),url(${imgUrl})`;
    }
  }

  function changeTheme(isThemeChanged) {
    changeBg(imgUrl);
    if (!isThemeChanged) {
      document.documentElement.style.setProperty("--bg", firstTheme.bg);
      document.documentElement.style.setProperty("--text", firstTheme.txt);
    } else {
      document.documentElement.style.setProperty("--bg", secondTheme.bg);
      document.documentElement.style.setProperty("--text", secondTheme.txt);
    }
  }

  volumeController.oninput = (e) => audioVolume = e.target.value / 100;

  autoMusicBtn.addEventListener("click", () => {
    isMusicOn = !isMusicOn;
    if (isMusicOn) {
      autoMusicBtn.innerText = "Stop Auto Music";
      autoMusicBtn.classList.add("activeBtn");
      musicInterval = setInterval(startAutoMusic, 215);
    } else {
      autoMusicBtn.innerText = "Start Auto Music";
      autoMusicBtn.classList.remove("activeBtn");
      clearInterval(musicInterval);
    }
  });

  function startAutoMusic() {
    const { key } = sounds[Math.floor(Math.random() * sounds.length)];
    makeSound(key);
  }

  function animate(selector) {
    const pressedEl = document.querySelector(`.${selector}`);
    pressedEl.classList.add("pressed");
    setTimeout(() => pressedEl.classList.remove("pressed"), 250);
  }

  function playMusic(path) {
    const audio = new Audio(path);
    audio.volume = audioVolume;
    audio.play();
  }

  function makeSound(key) {
    sounds.forEach((item) => {
      if (item.key === key) {
        playMusic(item.path);
        animate(key);
      }
    });
  }

  function handleDrumClick(e) {
    makeSound(e.target.innerHTML);
  }

  drums.forEach((drum) => drum.addEventListener("click", handleDrumClick));
});
