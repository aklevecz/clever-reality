import React, { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "./Plyr.css";

const url = "https://ice.raptor.pizza/hls/meiosis.m3u8";

export default function ArtistStream({ createScreen }) {
  const [loading, setLoading] = useState(true);
  const [retryCounter, setRetryCounter] = useState(0);
  const videoRef = useRef(undefined);

  const initStream = useCallback(() => {
    const video = videoRef.current;
    fetch(url)
      .then((r) => r)
      .then((d) => {
        if (d.status === 404) {
          return false;
        }
        setLoading(false);
        const source = url;
        new Plyr(video);
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
        createScreen(video);
      });
  }, [createScreen]);

  useEffect(() => {
    initStream();
  }, [initStream]);

  const incrementCounter = useCallback(
    () => setRetryCounter(retryCounter + 1),
    [retryCounter]
  );
  useEffect(() => {
    if (!loading) return;
    if (retryCounter > 15) {
      setRetryCounter(0);
      return initStream();
    }
    setTimeout(incrementCounter, 1000);
  }, [initStream, incrementCounter, retryCounter, loading]);

  return (
    <div>
      <button onClick={initStream}>Stream</button>
      {loading && <div>loading... {retryCounter}</div>}
      <video
        id="artist-stream"
        crossOrigin="true"
        ref={videoRef}
        playsInline
        style={{ display: loading ? "none" : "block" }}
      />
    </div>
  );
}
