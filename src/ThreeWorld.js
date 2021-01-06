import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import ArtistStream from "./ArtistStream";
import PressStart from "./PressStart";
import {
  CAMERA_START,
  collisionObjects,
  createFloor,
  createLight,
  createOrb,
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
    camera.lookAt(0, 0, 0);
    var controls;
    // CONTROLS
    // ORBIT
    // const controls = new OrbitControls(camera, worldContainerRef.current);
    // controls.maxPolarAngle = Math.PI / 2;
    // POINTER
    var moveForward = false,
      moveBackward = false,
      moveLeft = false,
      moveRight = false;
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const setupPointerControls = () => {
      controls = new PointerLockControls(camera, worldContainerRef.current);
      worldContainerRef.current.addEventListener("click", () =>
        controls.lock()
      );
      scene.add(controls.getObject());

      function onKeyDown(e) {
        switch (e.key) {
          case "w":
            moveForward = true;
            break;
          case "a":
            moveLeft = true;
            break;
          case "s":
            moveBackward = true;
            break;
          case "d":
            moveRight = true;
            break;
          case " ":
            if (canJump) velocity.y += 200;
            canJump = false;
            break;
        }
      }
      function onKeyUp(e) {
        switch (e.key) {
          case "w":
            moveForward = false;
            break;
          case "a":
            moveLeft = false;
            break;
          case "s":
            moveBackward = false;
            break;
          case "d":
            moveRight = false;
            break;
        }
      }

      document.addEventListener("keydown", onKeyDown, false);
      document.addEventListener("keyup", onKeyUp, false);
    };

    // END OF CONTROLS SETUP

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

    worldContainerRef.current.addEventListener("touchstart", checkClick, true);
    worldContainerRef.current.addEventListener("click", checkClick, true);

    var analyser;
    var dataArray;
    const setupAudioContext = () => {
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

    var started = false;
    var clickAnimationRunning = false;
    function checkClick(e) {
      mouseVector(e);
      ray.setFromCamera(mouse, camera);
      const intersections = ray.intersectObjects([startButtonObject]);
      if (intersections.length > 0) {
        // controls.autoRotate = true;
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

            setPhase(1);
            if (now > 2) {
              started = true;
              setupPointerControls();
              try {
                controls.lock();
              } catch (err) {
                // Simulate pointer lock to start falling
                controls.isLocked = true;
              }

              createOrb({ n: 1000 });

              return cancelAnimationFrame(frame);
            }
            frame = requestAnimationFrame(buttonAnimation);
          };
          buttonAnimation();
        }
      }
      worldContainerRef.current.removeEventListener(
        "touchstart",
        checkClick,
        true
      );
      worldContainerRef.current.removeEventListener("click", checkClick, true);
    }

    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchend", handleTouchEnd, false);
    document.addEventListener("touchmove", handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
      return (
        evt.touches || // browser API
        evt.originalEvent.touches
      ); // jQuery
    }

    const rotateStart = new THREE.Vector2();
    var looking = false;
    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
      looking = true;
      rotateStart.set(evt.touches[0].clientX, evt.touches[0].clientY);
    }

    const rotateEnd = new THREE.Vector2();
    const rotateDelta = new THREE.Vector2();
    var phi = 0;
    var theta = (1 * Math.PI) / 180;
    function handleTouchMove(evt) {
      rotateEnd.set(evt.touches[0].clientX, evt.touches[0].clientY);
      rotateDelta.subVectors(rotateEnd, rotateStart);
      rotateStart.copy(rotateEnd);
      phi =
        phi +
        ((2 * Math.PI * rotateDelta.y) / renderer.domElement.height) * 0.3;
      theta +=
        ((2 * Math.PI * rotateDelta.x) / renderer.domElement.width) * 0.5;
      if (!xDown || !yDown) {
        return;
      }
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          /* left swipe */
          // look(evt);
        } else {
          /* right swipe */
          // look(evt);
        }
      } else {
        if (yDiff > 0) {
          /* up swipe */
          moveBackward = true;
        } else {
          /* down swipe */
          moveForward = true;
        }
      }
      /* reset values */
      xDown = null;
      yDown = null;
    }

    function handleTouchEnd(evt) {
      moveForward = false;
      moveBackward = false;
      looking = false;
    }

    var scope = {};
    scope.minPolarAngle = 0;
    scope.maxPolarAngle = Math.PI;
    var euler = new THREE.Euler(0, 0, 0, "YXZ");

    const bbox = new THREE.Box3();
    let frame;
    var canJump = true;
    var prevTime;
    var orientation = new THREE.Quaternion();
    var previousPhi;
    var previousTheta;
    function animate() {
      frame = requestAnimationFrame(animate);

      if (phi === previousPhi && theta === previousTheta) {
      } else if (started) {
        previousPhi = phi;
        previousTheta = theta;
        euler.set(phi, theta, 0, "YXZ");
        orientation.setFromEuler(euler);
        camera.quaternion.copy(orientation);
      }

      // camera.position.x = radius * Math.cos(angle);
      // camera.position.z = radius * Math.sin(angle);
      // POINTER CONTROLS MOVEMENTS
      const time = performance.now();
      if (controls && controls.isLocked) {
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        const delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        // find intersections
        const controlObject = controls.getObject();
        const oldPosition = new THREE.Vector3();
        oldPosition.copy(controlObject.position);

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if (moveForward || moveBackward)
          velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        const sphere = new THREE.Sphere(controlObject.position, 2);

        // intersection
        if (collisionObjects.length > 0) {
          const object = collisionObjects[0];
          object.geometry.computeBoundingBox();
          bbox
            .copy(object.geometry.boundingBox)
            .applyMatrix4(object.matrixWorld);
          const intersections = sphere.intersectsBox(bbox);
          if (intersections) {
            velocity.y = Math.max(0, velocity.y);
            if (controls.getObject().position.y === 0)
              controlObject.position.copy(oldPosition);
            canJump = true;
          }
        }
        controls.getObject().position.y += velocity.y * delta; // new behavior
        if (controls.getObject().position.y < 0) {
          velocity.y = 0;
          controls.getObject().position.y = 0;

          canJump = true;
        }
      }
      prevTime = time;

      // END OF POINTER CONTROLS MOVEMENTS

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      }
      for (let i = 0; i < orbs.length; i++) {
        orbs[i].rotation.y += 0.01;
        const wave = Math.sin(time * 0.001 + i);
        orbs[i].scale.set(wave, wave, wave);
        if (analyser) {
          const d = dataArray[i % 256] / 100;
          orbs[i].scale.set(d, d, d);
        }
      }

      renderer.render(scene, camera);
      stats.update();
      //controls.update();
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
