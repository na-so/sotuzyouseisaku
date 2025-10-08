/**
 * TextAlive App API script tag example
 * https://github.com/TextAliveJp/textalive-app-script-tag
 *
 * 発声中の歌詞をフレーズ単位で表示します。
 * また、このアプリが TextAlive ホストと接続されていなければ再生コントロールを表示します。
 *
 * `script` タグで TextAlive App API を読み込んでいること以外は https://github.com/TextAliveJp/textalive-app-phrase と同内容です。
 */

const { Player, Ease } = TextAliveApp;

const player = new Player({
  app: {
    token:"ez7TWBRb7XW823qz",
    appAuthor: "Jun Kato",
    appName: "Basic example"
  },
  mediaElement: document.querySelector("#media")
});

player.addListener({
  onAppReady,
  onTimerReady,
  onTimeUpdate,
  onThrottledTimeUpdate
});

const playBtn = document.querySelector("#play");
const jumpBtn = document.querySelector("#jump");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");
const positionEl = document.querySelector("#position strong");

const artistSpan = document.querySelector("#artist span");
const songSpan = document.querySelector("#song span");
const phraseEl = document.querySelector("#container p");
const beatbarEl = document.querySelector("#beatbar");

function onAppReady(app) {
  if (!app.managed) {
    document.querySelector("#control").style.display = "block";
    playBtn.addEventListener("click", () => player.video && player.requestPlay());
    jumpBtn.addEventListener("click", () => player.video && player.requestMediaSeek(player.video.firstPhrase.startTime));
    pauseBtn.addEventListener("click", () => player.video && player.requestPause());
    rewindBtn.addEventListener("click", () => player.video && player.requestMediaSeek(0));
  }
  if (!app.songUrl) {
    player.createFromSongUrl("https://www.nicovideo.jp/watch/sm12825985");
  }
}

function onTimerReady() {
  artistSpan.textContent = player.data.song.artist.name;
  songSpan.textContent = player.data.song.name;

  document
    .querySelectorAll("button")
    .forEach((btn) => (btn.disabled = false));

  let p = player.video.firstPhrase;
  jumpBtn.disabled = !p;

  // set `animate` method
  while (p && p.next) {
    p.animate = animatePhrase;
    p = p.next;
  }
}

function onTimeUpdate(position) {

  // show beatbar
  const beat = player.findBeat(position);
  if (!beat) {
    return;
  }
  beatbarEl.style.width = `${Math.ceil(Ease.circIn(beat.progress(position)) * 100)}%`;
}

function onThrottledTimeUpdate(position) {
  positionEl.textContent = String(Math.floor(position));
}

function animatePhrase(now, unit) {
// テストぉ
  // フレーズ中なら表示
  if (unit.contains(now)) {
    phraseEl.textContent = unit.text;
    phraseEl.style.opacity = 1;
    phraseEl.style.transform = "scale(1.2)";
    phraseEl.style.transition = "all 0.4s ease-out";

    // 少し遅れて元のサイズに戻す
    setTimeout(() => {
      phraseEl.style.transform = "scale(1)";
    }, 200);
  } else {
    // フレーズが終わったらフェードアウト
    phraseEl.style.opacity = 0;
  }
  // ここまでぇ


  // show current phrase
  // if (unit.contains(now)) {
  //   phraseEl.textContent = unit.text;
  // }
};