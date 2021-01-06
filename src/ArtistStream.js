import React, { useCallback, useEffect, useState } from "react";
import Hls from "hls.js";
import fire from "./fire.mp4";
import StreamControls from "./StreamControls";
const url = "https://ice.raptor.pizza/hls/meiosis.m3u8";
const MAX_RETRIES = 15;
export default function ArtistStream({
  createScreen,
  phase,
  videoRef,
  test = false,
}) {
  const [loading, setLoading] = useState(!test);
  const [retryCounter, setRetryCounter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const initStream = useCallback(async () => {
    const video = videoRef.current;
    await fetch(url)
      .then((r) => r)
      .then((d) => {
        if (d.status === 404) {
          return false;
        }
        setLoading(false);
        const source = url;
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      });
  }, [videoRef]);

  useEffect(() => {
    initStream();
  }, [initStream]);

  const incrementCounter = useCallback(
    () => setRetryCounter(retryCounter + 1),
    [retryCounter]
  );
  useEffect(() => {
    if (!loading) return;
    if (retryCounter > MAX_RETRIES) {
      setRetryCounter(0);
      return initStream();
    }
    setTimeout(incrementCounter, 1000);
  }, [initStream, incrementCounter, retryCounter, loading]);

  useEffect(() => {
    videoRef.current.src = fire;
    createScreen(videoRef.current);
    videoRef.current.onplay = () => setIsPlaying(true);
    videoRef.current.onpause = () => setIsPlaying(false);
    //  eslint-disable-next-line
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (isMuted) {
      video.muted = true;
    } else {
      video.muted = false;
    }
  }, [isMuted, videoRef]);

  const toggleMute = (e) => {
    console.log(e);
    setIsMuted(!isMuted);
  };

  return (
    <div>
      <video
        id="artist-stream"
        className="video-js"
        crossOrigin="true"
        ref={videoRef}
        playsInline
        autoPlay
        loop
        controls
        muted
      />
      {/* {phase > 0 && ( */}
      <StreamControls
        videoRef={videoRef}
        isPlaying={isPlaying}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />
      {/* )} */}
    </div>
  );
}
