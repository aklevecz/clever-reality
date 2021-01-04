import { OpenVidu } from "openvidu-browser";
import { getToken } from "./services";
import { useEffect, useState } from "react";
import { createOrb, removeOrb } from "./ThreeFuncs";

var mySessionId = "TEST_SESSION";
var myUserName = "cutie" + Math.floor(Math.random() * 100);
const VIDEO_CONTAINER = "video-container";

function VidjuRoom() {
  const [session, setSession] = useState(undefined);

  const init = () => {
    const OV = new OpenVidu();
    const session = OV.initSession();

    session.on("streamCreated", (event) => {
      const subscriber = session.subscribe(event.stream, VIDEO_CONTAINER);

      subscriber.on("videoElementCreated", (event) => {
        createOrb(event.element);
      });
    });

    session.on("streamDestroyed", (event) => {
      removeOrb(event);
    });

    getToken(mySessionId).then((token) => {
      session.connect(token, { clientData: myUserName }).then(() => {
        const publisher = OV.initPublisher(VIDEO_CONTAINER, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: false,
          publishVideo: true,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: false,
        });

        publisher.on("videoElementCreated", (event) => {
          event.element.id = "master";
          createOrb(event.element, "pink");
          // Will this work in iOS?
          event.element.oncanplay = () => event.element.play();
        });

        session.publish(publisher);
      });
    });

    setSession(session);
    return session;
  };

  window.addEventListener("beforeunload", () => session.disconnect());

  useEffect(() => {
    return () => session && session.disconnect();
  }, [session]);

  const leaveSession = () => {
    session.disconnect();
  };

  return (
    <div>
      <button onClick={init}>Init</button>
      <div id={VIDEO_CONTAINER} />
      <button onClick={leaveSession}>Leave Session</button>
    </div>
  );
}

export default VidjuRoom;
