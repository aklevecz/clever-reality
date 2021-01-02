import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ArtistStream from "./ArtistStream";
import VidjuRoom from "./VidjuRoom";

// const randomF = (max) => Math.random() * max;
const randomI = (max) => Math.floor(Math.random() * max);
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const randomColor = () =>
  new THREE.Color(
    `rgb(${randomI(255) + 20}, ${randomI(255) + 20}, ${randomI(255) + 20})`
  );
const gVideo = () => document.querySelector("#master");

export default function ThreeWorld() {
  const [vidjuRoomOn, toggleVidjuRoomOn] = useState(true);
  const worldContainerRef = useRef(undefined);
  const orbGeoRef = useRef(new THREE.SphereGeometry()).current;
  const scene = useRef(new THREE.Scene()).current;
  const orbs = useRef([]);

  useEffect(() => {
    // Stupid hot module
    if (worldContainerRef.current.worldCreated) return;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    worldContainerRef.current.appendChild(renderer.domElement);
    worldContainerRef.current.worldCreated = true;
    let frame;
    function animate() {
      frame = requestAnimationFrame(animate);
      for (let i = 0; i < orbs.current.length; i++) {
        orbs.current[i].rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    }
    animate();
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [scene]);

  const createScreen = (video) => {
    const vertexShader = require("./shaders/screen-vertex.js").default;
    const fragmentShader = require("./shaders/screen-fragment.js").default;
    const videoTexture = new THREE.VideoTexture(video);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        resolution: { value: new THREE.Vector4() },
        videoTexture: { value: videoTexture },
      },
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
    });
    material.uniforms.resolution.value.x = window.innerWidth;
    material.uniforms.resolution.value.y = window.innerHeight;
    material.uniforms.resolution.value.z = 1;
    material.uniforms.resolution.value.w = 1;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  };

  const createOrb = (video = gVideo(), color) => {
    const rColor = randomColor();
    const geometry = orbGeoRef;
    const texture = new THREE.VideoTexture(video);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      color: color ? color : rColor,
      transparent: true,
      opacity: 0.7,
    });
    const mesh = new THREE.Mesh(geometry, material);
    // Use actual math for calculating the particle boundary space
    const max = 20;
    const x = randomIntFromInterval(-max - 1, max + 1);
    const y = randomIntFromInterval(-max, max);
    const z = randomIntFromInterval(-30, -5);

    mesh.position.set(x, y, z);
    mesh.rotation.y = Math.PI * 1.5;

    mesh.vId = video.id.replace("remote-video-", "");

    scene.add(mesh);
    orbs.current.push(mesh);
  };

  const removeOrb = (event) => {
    const vId = event.stream.streamId;
    orbs.current = orbs.current.filter((o) => o.vId !== vId);
    for (let i = 0; i < scene.children.length; i++) {
      const orb = scene.children[i];
      if (orb.vId === vId) {
        scene.remove(orb);
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }} ref={worldContainerRef}>
      <button onClick={() => toggleVidjuRoomOn(!vidjuRoomOn)}>Kill Room</button>
      <button onClick={() => createOrb()}>Orb</button>
      <ArtistStream createScreen={createScreen} />
      {vidjuRoomOn && <VidjuRoom createOrb={createOrb} removeOrb={removeOrb} />}
    </div>
  );
}
