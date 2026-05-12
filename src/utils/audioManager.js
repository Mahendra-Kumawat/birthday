import birthdaySong from "../assets/Happy Birthday Song 🎂🎈 Celebrate with Music & Cake.mp3";
import memorySong from "../assets/Full Song Woh Din Film Version  Chhichhore  Sushant,Shraddha  Pritam  Amitabh  Tushar Joshi.mp3";

// Clean old comments from audioManager

class AudioManager {
  constructor() {
    this.tracks = {};
    this.currentTrack = null;
  }

  register(name, src) {
    if (!src) return;
    if (!this.tracks[name]) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 1;
      this.tracks[name] = audio;
    }
  }

  play(name) {
    // Pause all other tracks
    Object.entries(this.tracks).forEach(([key, audio]) => {
      if (key !== name) {
        audio.pause();
      }
    });

    // Play the requested track
    const track = this.tracks[name];
    if (track && track.paused) {
      track.play().catch(() => {});
    }
    this.currentTrack = name;
  }

  pause(name) {
    const track = this.tracks[name];
    if (track) {
      track.pause();
    }
  }

  pauseAll() {
    Object.values(this.tracks).forEach((audio) => audio.pause());
    this.currentTrack = null;
  }
}

// Singleton instance
const audioManager = new AudioManager();

// Pre-register tracks
audioManager.register("birthday", birthdaySong);
if (memorySong) {
  audioManager.register("memory", memorySong);
}

export default audioManager;
