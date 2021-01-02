import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "./Plyr.css";

const url = "https://ice.raptor.pizza/hls/meiosis.m3u8";

export default function ArtistStream({ createScreen }) {
  const videoRef = useRef(undefined);

  const initStream = () => {
    const video = videoRef.current;
    fetch(url)
      .then((r) => r)
      .then((d) => {
        if (d.status === 404) {
          return false;
        }
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
  };

  useEffect(() => {
    initStream();
  }, []);

  return (
    <div>
      <button onClick={initStream}>Stream</button>
      <video
        id="artist-stream"
        crossOrigin="true"
        ref={videoRef}
        playsInline
        style={{ display: false ? "none" : "block" }}
      />
    </div>
  );
}
