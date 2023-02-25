import { storage } from "@src/firebase";
import { useRequestReview } from "@src/hooks/useRequestReview";
import useStore, { useAudioStore } from "@src/Store";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect } from "react";

type Signature = {
  stopSound: () => Promise<void>;
  pauseSound: () => Promise<void>;
  playSound: (fileToPlay: string | null) => Promise<void>;
};

export function useAudio(): Signature {
  const { sound, setSound, setPlayingAudioObject, setIsPlaying } =
    useAudioStore();
  const { setError } = useStore();
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

  async function pauseSound() {
    console.log("Pausing sound...");
    try {
      if (sound) {
        await sound.pauseAsync();
      }
    } catch (err: any) {
      console.warn("Error pausing sound:");
      console.error(err);
      setError(err.message);
    }
  }

  async function stopSound(): Promise<void> {
    console.log("Stopping sound...");
    try {
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
    } catch (err: any) {
      console.warn("Error stopping sound:");
      console.error(err);
      setError(err.message);
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
      if (playbackStatus.isPlaying) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
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

  async function playSound(fileToPlay: string | null = null): Promise<void> {
    console.log("Playing sound...");
    try {
      if (sound && fileToPlay !== null) {
        console.error("Cannot play sound, another sound is already playing");
        return;
      }

      if (sound && fileToPlay === null) {
        console.log("Sound is loaded, resuming...");
        sound.playAsync();
      } else {
        if (!fileToPlay) {
          console.error("Cannot play sound, no filename is set");
          return;
        }

        console.log("Sound is not loaded, loading...");
        const filename = ref(storage, fileToPlay);
        const uri = await getDownloadURL(filename);
        const { sound: playbackObject } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        setSound(playbackObject);
        // Call stopSound when audio finishes playing
        playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }
    } catch (err: any) {
      console.warn("Error playing sound:");
      console.error(err);
      setError(err.message);
    }
  }

  return { stopSound, pauseSound, playSound };
}
