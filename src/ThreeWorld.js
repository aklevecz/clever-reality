import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ArtistStream from "./ArtistStream";
import VidjuRoom from "./VidjuRoom";
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
// const randomF = (max) => Math.random() * max;

export default function ThreeWorld() {
  const [phase, setPhase] = useState(0);
  const [vidjuRoomOn, toggleVidjuRoomOn] = useState(false);
  const worldContainerRef = useRef(undefined);
  const videoRef = useRef(undefined);

  useEffect(() => {
    if (phase === 1) {
      toggleVidjuRoomOn(true);
    }
  }, [phase]);

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const { x, y, z } = CAMERA_START;
    camera.position.set(x, y, z);
    const controls = new OrbitControls(camera, worldContainerRef.current);
    // controls.autoRotate = true;
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    worldContainerRef.current.appendChild(renderer.domElement);
    worldContainerRef.current.appendChild(stats.dom);
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
    document.body.addEventListener("mousedown", checkClick, true);

    var clickAnimationRunning = false;
    function checkClick(e) {
      mouseVector(e);
      ray.setFromCamera(mouse, camera);
      const intersections = ray.intersectObjects([startButtonObject]);
      if (intersections.length > 0) {
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
      for (let i = 0; i < orbs.length; i++) {
        orbs[i].rotation.y += 0.01;
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
      <ArtistStream
        createScreen={createScreen}
        videoRef={videoRef}
        test={test}
      />
      {(vidjuRoomOn || test) && <VidjuRoom />}
    </div>
  );
}
