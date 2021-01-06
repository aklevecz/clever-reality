import React from "react";
import { createOrb } from "./ThreeFuncs";
import Volume from "./Volume";

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

export default function StreamControls({
  videoRef,
  isPlaying,
  isMuted,
  toggleMute,
}) {
  const changeVolume = (volume) =>
    (videoRef.current.volume = clamp(volume, 0, 1));

  const togglePlay = () => {
    const video = videoRef.current;
    console.log(isPlaying);
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const goToLive = () => {
    const video = videoRef.current;
    video.currentTime = video.seekable.end(0);
  };

  return (
    <div id="controls-container">
      <div onClick={goToLive}>Go To Live</div>
      <div onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</div>
      <div onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</div>
      <div onClick={createOrb}>Orb</div>
      {navigator.platform !== "iPhone" && (
        <Volume changeVolume={changeVolume} />
      )}
    </div>
  );
}
