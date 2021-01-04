import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

const randomI = (max) => Math.floor(Math.random() * max);
// function randomIntFromInterval(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }
export function lerp(x, a, b) {
  return x * (b - a) + a;
}

const randomColor = () =>
  new THREE.Color(
    `rgb(${randomI(255) + 20}, ${randomI(255) + 20}, ${randomI(255) + 20})`
  );
const gVideo = () => document.querySelector("#master");

export const CAMERA_START = { x: 0, y: 20, z: 50 };

const orbGeoRef = new THREE.SphereGeometry(1, 30, 30);
export const scene = new THREE.Scene();
var gui = new GUI();
export const stats = new Stats();
export const ray = new THREE.Raycaster();
export const mouse = new THREE.Vector2(9999, 9999);
export var orbs = [];

export const startButton = () => {
  const geometry = new THREE.SphereGeometry(1, 20, 20);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(1, 0, 0),
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "start-button";
  const { x, y, z } = CAMERA_START;
  const buttonState = {
    x,
    y: y - 1.4,
    z: z - 5,
    widthSegments: 1,
    heightSegments: 1,
  };
  mesh.position.set(buttonState.x, buttonState.y, buttonState.z);
  scene.add(mesh);
  const folder = gui.addFolder("Start Button");
  folder
    .add(buttonState, "x", -20, 20, 0.1)
    .onChange((e) => (mesh.position.x = e));
  folder
    .add(buttonState, "y", -20, 20, 0.1)
    .onChange((e) => (mesh.position.y = e));
  folder
    .add(buttonState, "z", buttonState.z - 20, buttonState.z + 20, 0.1)
    .onChange((e) => (mesh.position.z = e));

  return mesh;
};

export const createFloor = () => {
  var geometry = new THREE.PlaneBufferGeometry(200, 200, 100, 100);
  geometry.rotateX(-Math.PI / 2);
  geometry = geometry.toNonIndexed();
  const material = new THREE.MeshStandardMaterial({ color: "white" });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -2;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.name = "floor";
  scene.add(mesh);
};

export const createLight = () => {
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

export const createScreen = (video) => {
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
export const createOrb = (video = gVideo(), color) => {
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
  // const max = 20;
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

export const removeOrb = (event) => {
  const vId = event.stream.streamId;
  orbs = orbs.filter((o) => o.vId !== vId);
  for (let i = 0; i < scene.children.length; i++) {
    const orb = scene.children[i];
    if (orb.vId === vId) {
      scene.remove(orb);
    }
  }
};
