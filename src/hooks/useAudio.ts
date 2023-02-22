import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect } from "react";
import { storage } from "../../firebase";
import { useRequestReview } from "../hooks/useRequestReview";
import { useAudioStore } from "../Store";

type Signature = {
  stopSound: () => Promise<void>;
  pauseSound: () => Promise<void>;
  playSound: () => Promise<void>;
};

export function useAudio(): Signature {
  const {
    sound,
    setSound,
    playingAudioObject,
    setPlayingAudioObject,
    setIsPlaying,
  } = useAudioStore();
  const { requestReview } = useRequestReview();

  // Initialize audio mode
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
    });
  }, []);

  // Unload sound when unmounting
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading sound...");
          sound.unloadAsync();
          setPlayingAudioObject(null);
          setIsPlaying(false);
        }
      : undefined;
  }, [sound]);

  // Whenever the audio to be played is set, play it
  useEffect(() => {
    if (!!playingAudioObject) {
      playSound();
    } else {
      stopSound();
    }
  }, [JSON.stringify(playingAudioObject)]);

  async function pauseSound() {
    console.log("Pausing sound...");
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  async function stopSound(): Promise<void> {
    if (sound) {
      const soundStatus = await sound.getStatusAsync();
      if (soundStatus.isLoaded) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      setSound(null);
      setPlayingAudioObject(null);
      setIsPlaying(false);
    }
  }

  const onPlaybackStatusUpdate = (playbackStatus: any) => {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.error(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
      }
    } else {
      // TODO: Refactor play/pause handlers into these
      if (playbackStatus.isPlaying) {
        //console.log("Playing...");
      } else {
        //console.log("Paused...");
      }

      // TODO: Properly handle buffering state
      if (playbackStatus.isBuffering) {
        //console.log("Buffering...");
      }

      // TODO: Figure out why we have to manually setSound etc
      //       stopSound doesn't do the trick because sound is null
      //       but playingFilename isn't? Weird
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        console.log("Finished playing");
        setSound(null);
        setPlayingAudioObject(null);
        setIsPlaying(false);
        requestReview();
      }
    }
  };

  async function playSound(): Promise<void> {
    console.log("Playing sound...");
    if (sound) {
      console.log("Sound is loaded, resuming...");
      sound.playAsync();
    } else {
      if (!playingAudioObject) {
        console.error("Cannot play sound, no filename is set");
        return;
      }

      console.log("Sound is not loaded, loading...");
      const filename = ref(storage, playingAudioObject.filename);
      const uri = await getDownloadURL(filename);
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(playbackObject);
      // Call stopSound when audio finishes playing
      playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
    setIsPlaying(true);
  }

  return { stopSound, pauseSound, playSound };
}
