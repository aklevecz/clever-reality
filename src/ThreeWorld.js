import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ArtistStream from "./ArtistStream";
import PressStart from "./PressStart";
import {
  CAMERA_START,
  createFloor,
  createLight,
  createScreen,
  lerp,
  mouse,
  orbs,
  ray,
  scene,
  startButton,
  stats,
} from "./ThreeFuncs";

const test = false;

export default function ThreeWorld() {
  const [phase, setPhase] = useState(0);
  const worldContainerRef = useRef(undefined);
  const videoRef = useRef(undefined);

  useEffect(() => {
    if (phase === 1) {
    }
  }, [phase]);

  useEffect(() => {
    if (worldContainerRef.current === undefined) return;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const { x, y, z } = CAMERA_START;
    camera.position.set(x, y, z);
    const controls = new OrbitControls(camera, worldContainerRef.current);
    controls.maxPolarAngle = Math.PI / 2;
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    worldContainerRef.current.appendChild(renderer.domElement);
    // worldContainerRef.current.appendChild(stats.dom);
    const startButtonObject = startButton();
    createFloor();
    createLight();

    function mouseVector(e) {
      const coords = { x: 0, y: 0 };
      if (e instanceof TouchEvent) {
        coords.x = e.touches[0].clientX;
        coords.y = e.touches[0].clientY;
      } else {
        coords.x = e.clientX;
        coords.y = e.clientY;
      }
      mouse.x = (coords.x / window.innerWidth) * 2 - 1;
      mouse.y = -(coords.y / window.innerHeight) * 2 + 1;
    }

    document
      .querySelector("canvas")
      .addEventListener("touchstart", checkClick, true);
    document.body.addEventListener("click", checkClick, true);

    var analyser;
    var dataArray;
    const setupAudioContext = () => {
      return;
      alert(navigator.platform);
      if (navigator.platform === "iPhone" || navigator.platform === "Android")
        return;
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      var source = audioCtx.createMediaElementSource(videoRef.current);
      source.connect(analyser);
      source.connect(audioCtx.destination);
      analyser.fftSize = 512;
      var bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    };

    var clickAnimationRunning = false;
    function checkClick(e) {
      mouseVector(e);
      ray.setFromCamera(mouse, camera);
      const intersections = ray.intersectObjects([startButtonObject]);
      if (intersections.length > 0) {
        controls.autoRotate = true;
        setupAudioContext();
        videoRef.current.play();
        if (!clickAnimationRunning) {
          clickAnimationRunning = true;
          const start = performance.now();
          const currentColor = startButtonObject.material.color;
          var frame;
          const buttonAnimation = () => {
            const now = (performance.now() - start) * 0.001;

            startButtonObject.material.color.set(
              currentColor.lerp(new THREE.Color(0, 0, 1), now)
            );

            startButtonObject.material.opacity = lerp(now - 1, 1, 0);

            if (now > 1) {
              setPhase(1);
            }
            if (now > 2) {
              return cancelAnimationFrame(frame);
            }
            frame = requestAnimationFrame(buttonAnimation);
          };
          buttonAnimation();
        }
      }
    }

    let frame;
    function animate() {
      frame = requestAnimationFrame(animate);
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      }
      for (let i = 0; i < orbs.length; i++) {
        orbs[i].rotation.y += 0.01;
        if (analyser) {
          const d = dataArray[i % 256] / 100;
          // orbs[i].scale.set(d, d, d);
        }
      }

      renderer.render(scene, camera);
      stats.update();
      controls.update();
    }
    animate();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onWindowResize, false);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }} ref={worldContainerRef}>
      <PressStart phase={phase} />
      <ArtistStream
        createScreen={createScreen}
        phase={phase}
        videoRef={videoRef}
        test={test}
      />
    </div>
  );
}
