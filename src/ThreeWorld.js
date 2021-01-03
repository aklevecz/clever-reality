import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ArtistStream from "./ArtistStream";
import VidjuRoom from "./VidjuRoom";

const test = false;
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
  const [vidjuRoomOn, toggleVidjuRoomOn] = useState(false);
  const worldContainerRef = useRef(undefined);
  const orbGeoRef = useRef(new THREE.SphereGeometry(1, 30, 30)).current;
  const scene = useRef(new THREE.Scene()).current;
  const stats = useRef(new Stats()).current;
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
    camera.position.set(0, 20, 50);
    const controls = new OrbitControls(camera, worldContainerRef.current);
    controls.autoRotate = true;
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    worldContainerRef.current.appendChild(renderer.domElement);
    // worldContainerRef.current.appendChild(stats.dom);
    worldContainerRef.current.worldCreated = true;
    createFloor();
    createLight();
    let frame;
    function animate() {
      frame = requestAnimationFrame(animate);
      for (let i = 0; i < orbs.current.length; i++) {
        orbs.current[i].rotation.y += 0.01;
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
  }, [scene]);

  const createFloor = () => {
    var geometry = new THREE.PlaneBufferGeometry(200, 200, 100, 100);
    geometry.rotateX(-Math.PI / 2);
    geometry = geometry.toNonIndexed();
    const material = new THREE.MeshStandardMaterial({ color: "white" });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -2;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
  };

  const createLight = () => {
    const color = 0xffffff;
    const intensity = 1.9;
    const light = new THREE.DirectionalLight(color, intensity, 100);
    light.position.set(0, 70, 30);
    light.target.position.set(0, 0, -10);
    light.castShadow = true;
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 2048; // default
    light.shadow.mapSize.height = 2048; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    console.log(light.shadow.camera);
    const shadowF = 50;
    light.shadow.camera.left = -shadowF;
    light.shadow.camera.right = shadowF;
    light.shadow.camera.top = shadowF;
    light.shadow.camera.bottom = -shadowF;
    // const helper = new THREE.DirectionalLightHelper(light, 5);
    // scene.add(helper);
    scene.add(light);
    scene.add(light.target);

    // const shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
    // scene.add(shadowCameraHelper);
  };

  const createScreen = (video) => {
    const vertexShader = require("./shaders/screen-vertex.js").default;
    const fragmentShader = require("./shaders/screen-fragment.js").default;
    const videoTexture = new THREE.VideoTexture(video);
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        resolution: { value: new THREE.Vector2(1, 16 / 9) },
        videoTexture: { value: videoTexture },
      },
      transparent: true,
      vertexShader,
      fragmentShader,
      depthWrite: true,
      depthTest: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -10;
    mesh.position.y = 0.5;
    scene.add(mesh);

    const backGeo = new THREE.BoxBufferGeometry(10, 6.5, 2);
    const backMaterial = new THREE.MeshStandardMaterial({ color: "black" });
    const backMesh = new THREE.Mesh(backGeo, backMaterial);
    backMesh.castShadow = true;
    backMesh.position.z = -11.1;
    scene.add(backMesh);
  };

  const r = 30;
  const createOrb = (video = gVideo(), color) => {
    const rColor = randomColor();
    const geometry = orbGeoRef;
    // const texture = new THREE.VideoTexture(video);
    const material = new THREE.MeshPhysicalMaterial({
      // map: texture,
      color: color ? color : rColor,
      // transparent: true,
      // opacity: 0.7,
    });
    const mesh = new THREE.Mesh(geometry, material);
    // Use actual math for calculating the particle boundary space
    const max = 20;
    // const x = randomIntFromInterval(-max - 1, max + 1);
    // const y = randomIntFromInterval(-max, max);
    // const z = randomIntFromInterval(-30, -5);

    const x = Math.random() * 2 * r - (2 * r) / 2;
    const y = Math.random() * r;
    const z = Math.random() * r * 3;
    mesh.position.set(x, y, z);
    mesh.rotation.y = Math.PI * 1.5;

    if (video) mesh.vId = video.id.replace("remote-video-", "");
    // mesh.castShadow = true;
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
      <button onClick={() => toggleVidjuRoomOn(!vidjuRoomOn)}>
        Toggle Room
      </button>
      <button onClick={() => createOrb()}>Orb</button>
      {(vidjuRoomOn || test) && <div>TESTING</div>}
      {(vidjuRoomOn || test) && (
        <ArtistStream createScreen={createScreen} test={test} />
      )}
      {(vidjuRoomOn || test) && (
        <VidjuRoom createOrb={createOrb} removeOrb={removeOrb} />
      )}
    </div>
  );
}
