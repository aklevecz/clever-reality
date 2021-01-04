import React, { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import videojs from "video.js";
const url = "https://ice.raptor.pizza/hls/meiosis.m3u8";
const MAX_RETRIES = 15;
export default function ArtistStream({ createScreen, videoRef, test = false }) {
  const [loading, setLoading] = useState(!test);
  const [retryCounter, setRetryCounter] = useState(0);
  const vjRef = useRef(undefined);

  const initStream = useCallback(async () => {
    const video = videoRef.current;
    var vj;
    if (!test) {
      await fetch(url)
        .then((r) => r)
        .then((d) => {
          if (d.status === 404) {
            return false;
          }
          setLoading(false);
          const source = url;
          vjRef.current = videojs(video, { width: 500 });

          window.videojs = vj;
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(source);
            hls.attachMedia(video);
          } else {
            video.src = source;
          }
          video.onloadeddata = () => {
            vjRef.current.liveTracker.seekToLiveEdge();
          };
        });
    }
    createScreen(video);
  }, [createScreen, videoRef, test]);

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

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 100,
          fontFamily: "monospace",
          fontWeight: "bold",
          fontSize: 20,
          cursor: "pointer",
        }}
        onClick={() => vjRef.current.liveTracker.seekToLiveEdge()}
      >
        Go To Live
      </div>
      <video
        id="artist-stream"
        className="video-js"
        crossOrigin="true"
        ref={videoRef}
        playsInline
        autoPlay
        loop
        width="500"
        controls
        src={test ? require("./test_static/video.mp4").default : ""}
      />
    </div>
  );
}
