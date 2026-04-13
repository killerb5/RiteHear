(function(){
  const fallbackTracks = [
    { title: 'Late Night Frequencies', artist: 'DJ Rite', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'Unsigned Heat', artist: 'RiteHear Select', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }
  ];

  const key = 'ritehear-player-state-v2';
  let state = { index: 0, time: 0, playing: false, volume: 0.8 };
  let tracks = fallbackTracks;
  const pageKey = document.body.getAttribute('data-page') || 'home';
  const listPath = document.body.getAttribute('data-tracklist') || 'data/tracklist.json';

  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    state = { ...state, ...saved };
  } catch (_) {}

  const el = document.createElement('div');
  el.className = 'mini-player';
  el.innerHTML = '' +
    '<div class="row">' +
      '<div class="meta">' +
        '<div class="badge" aria-hidden="true"></div>' +
        '<div class="text"><div class="title"></div><div class="artist"></div></div>' +
      '</div>' +
      '<div class="controls">' +
        '<button class="prev" aria-label="Previous">&#9664;&#9664;</button>' +
        '<button class="play" aria-label="Play or pause">&#9654;</button>' +
        '<button class="next" aria-label="Next">&#9654;&#9654;</button>' +
      '</div>' +
      '<div class="time">' +
        '<span class="cur">0:00</span>' +
        '<input type="range" class="seek" min="0" max="100" value="0">' +
        '<span class="dur">0:00</span>' +
        '<div class="vol"><span>Vol</span><input type="range" class="volume" min="0" max="1" step="0.01"></div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(el);

  const audio = new Audio();
  const title = el.querySelector('.title');
  const artist = el.querySelector('.artist');
  const playBtn = el.querySelector('.play');
  const prevBtn = el.querySelector('.prev');
  const nextBtn = el.querySelector('.next');
  const seek = el.querySelector('.seek');
  const cur = el.querySelector('.cur');
  const dur = el.querySelector('.dur');
  const volume = el.querySelector('.volume');

  function fmt(s){
    if (!Number.isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return m + ':' + ss;
  }

  function save(){
    try {
      localStorage.setItem(key, JSON.stringify({
        index: state.index,
        time: audio.currentTime || 0,
        playing: !audio.paused,
        volume: audio.volume
      }));
    } catch (_) {}
  }

  function loadTrack(index, autoPlay){
    if (!tracks.length) return;
    state.index = (index + tracks.length) % tracks.length;
    const t = tracks[state.index];
    audio.src = t.src;
    title.textContent = t.title;
    artist.textContent = t.artist;
    audio.volume = typeof state.volume === 'number' ? state.volume : 0.8;
    volume.value = String(audio.volume);

    audio.addEventListener('loadedmetadata', function once(){
      audio.removeEventListener('loadedmetadata', once);
      if (Number.isFinite(state.time) && state.time > 0) {
        audio.currentTime = Math.min(state.time, audio.duration || state.time);
      }
      dur.textContent = fmt(audio.duration);
      if (autoPlay) {
        audio.play().catch(() => {
          playBtn.textContent = '▶';
        });
      }
    });

    playBtn.textContent = autoPlay ? '❚❚' : '▶';
    save();
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        playBtn.textContent = '❚❚';
        save();
      }).catch(() => {});
    } else {
      audio.pause();
      playBtn.textContent = '▶';
      save();
    }
  });

  prevBtn.addEventListener('click', () => {
    state.time = 0;
    loadTrack(state.index - 1, !audio.paused);
  });

  nextBtn.addEventListener('click', () => {
    state.time = 0;
    loadTrack(state.index + 1, !audio.paused);
  });

  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
    state.volume = audio.volume;
    save();
  });

  seek.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const p = Number(seek.value) / 100;
      audio.currentTime = p * audio.duration;
      save();
    }
  });

  audio.addEventListener('timeupdate', () => {
    cur.textContent = fmt(audio.currentTime);
    dur.textContent = fmt(audio.duration);
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      seek.value = String((audio.currentTime / audio.duration) * 100);
    }
  });

  audio.addEventListener('ended', () => {
    state.time = 0;
    loadTrack(state.index + 1, true);
  });

  window.addEventListener('beforeunload', save);

  function boot(){
    fetch(listPath)
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Tracklist not found')))
      .then(data => {
        if (Array.isArray(data[pageKey]) && data[pageKey].length) {
          tracks = data[pageKey];
        } else if (Array.isArray(data.home) && data.home.length) {
          tracks = data.home;
        }

        if (state.index >= tracks.length) {
          state.index = 0;
          state.time = 0;
        }

        loadTrack(state.index || 0, !!state.playing);
      })
      .catch(() => {
        tracks = fallbackTracks;
        loadTrack(state.index || 0, !!state.playing);
      });
  }

  boot();
})();
