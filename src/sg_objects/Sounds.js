import shot from './sounds/shot.wav';
import ding from './sounds/ding.wav';
import miss from './sounds/miss.wav';
import disappear from './sounds/disappear.wav';
import track01F from './sounds/track01.mp3';
import track02F from './sounds/track02.mp3';
import track03F from './sounds/track03.mp3';
import track04F from './sounds/track04.mp3';
import track05F from './sounds/track05.mp3';

class Sounds {
    NUM_TRACKS = 5;
    INTRO_TRACK_INDEX = 0;

    tracks;

    currentTrack;

    // Always play track 01 the first time the game is loaded.
    firstPlaythrough;

    shouldPlayMusic;
    shouldPlaySounds;

    lastKnownCurrentTime;

    constructor() {
        // Puts in cache?
        new Audio(shot).load();
        new Audio(miss).load();
        new Audio(ding).load();
        new Audio(disappear).load();

        this.tracks = [];

        let track01 = new Audio(track01F);
        this.loadTrack(track01, 0.5);
        this.tracks.push(track01);

        let track02 = new Audio(track02F);
        this.loadTrack(track02, 0.5);
        this.tracks.push(track02);

        let track03 = new Audio(track03F);
        this.loadTrack(track03, 0.5);
        this.tracks.push(track03);

        let track04 = new Audio(track04F);
        this.loadTrack(track04, 0.5);
        this.tracks.push(track04);

        let track05 = new Audio(track05F);
        this.loadTrack(track05, 0.5);
        this.tracks.push(track05);

        this.currentTrack = 0;
        this.firstPlaythrough = true;

        this.shouldPlayMusic = true;
        this.shouldPlaySounds = true;

        this.lastKnownCurrentTime = 0;
    }

    loadTrack = (trackObj, volume) => {
        trackObj.load();
        trackObj.loop = true;
        trackObj.volume = volume;
    }

    #playSound = (soundRsrc, volume) => {
        try {
            let audioElem = new Audio(soundRsrc);

            if (volume !== undefined)
                audioElem.volume = volume;
            
            audioElem.play().catch(console.warn);
        } catch (error) {
            console.log("Error playing sound!");
            console.log(error);
        }
    }

    #playTrack = (track) => {
        console.log("Playing music track.");
        track.play().catch(console.warn);
    }

    playShot = () => {
        if (this.shouldPlaySounds === false)
            return;

        this.#playSound(shot, 0.6);
    }

    playMiss = () => {
        if (this.shouldPlaySounds === false)
            return;

        this.#playSound(miss);
    }

    playHit = () => {
        if (this.shouldPlaySounds === false)
            return;

        this.#playSound(ding);
    }

    playDisappear = () => {
        if (this.shouldPlaySounds === false)
            return;

        this.#playSound(disappear, 0.4);
    }

    playMusic = () => {
        if (this.shouldPlayMusic === false)
            return;

        if (this.firstPlaythrough === true) {
            this.#playTrack(this.tracks[this.INTRO_TRACK_INDEX]);

            this.currentTrack = this.INTRO_TRACK_INDEX;
            this.firstPlaythrough = false;

            return;
        }

        let trackNum = 0;

        do {
            trackNum = Math.floor(Math.random() * 5);
            console.log("TrackNum selected: " + trackNum);
        } while (trackNum === this.currentTrack);

        this.#playTrack(this.tracks[trackNum]);
        this.currentTrack = trackNum;
    }

    stopMusic = () => {
        this.lastKnownCurrentTime = this.tracks[this.currentTrack].currentTime;
        console.log("currentTime: " + this.tracks[this.currentTrack].currentTime);
        this.tracks[this.currentTrack].pause();
        this.tracks[this.currentTrack].currentTime = 0;
    }

    setShouldPlayMusic = (value, startPlaying) => {
        let prevValue = this.shouldPlayMusic;
        if (prevValue === value)
            return;

        this.shouldPlayMusic = value;

        if (value === true) {
            console.log("Last known current time: " + this.lastKnownCurrentTime);
            this.tracks[this.currentTrack].currentTime = this.lastKnownCurrentTime;

            if (startPlaying === true)
                this.#playTrack(this.tracks[this.currentTrack]);
        }            

        if (value === false)
            this.stopMusic();
    }

    setShouldPlaySounds = (value) => {
        this.shouldPlaySounds = value;
    }
}

export default Sounds;