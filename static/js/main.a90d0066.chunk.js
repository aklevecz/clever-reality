(this["webpackJsonporb-stream"]=this["webpackJsonporb-stream"]||[]).push([[0],{18:function(e,t,n){},20:function(e,t,n){"use strict";n.r(t);t.default="\nvarying vec2 vUv;\nvoid main() {\n    vUv = uv;\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    //gl_Position = vec4(position, 1.0);\n}"},21:function(e,t,n){"use strict";n.r(t);t.default="\nvarying vec2 vUv;\n\nuniform sampler2D videoTexture;\nuniform vec2 resolution;\n\nvoid main()\n{\n  vec2 uv = vec2(0.5) + vUv * resolution.xy - resolution.xy*0.5;\n  vec4 color = vec4(0.);\n  if (uv.x>=0.0 && uv.y>=0.0 && uv.x<1.0 && uv.y<1.0) color = vec4(texture2D(videoTexture, uv).rgb, 1.0);\n  gl_FragColor = color;\n}\n"},22:function(e,t,n){"use strict";n.r(t);var r=n(2),o=n(3),i=n.n(o),c=n(9),a=n.n(c),s=(n(18),n(4)),u=n(0),d=n(10),l=n(6),v=n.n(l),h=n(11),f=n(7),w=n.n(f),m=n.p+"static/media/fire.5b252a8b.mp4",b=n(12),p=function(e){return Math.floor(Math.random()*e)},j=0,g=20,x=50,y=new u.s(1,30,30),O=new u.p,k=new b.a,M=new u.o,E=new u.t(9999,9999),S=[],C=[],P=function(e){var t=n(20).default,r=n(21).default,o=new u.v(e),i=new u.m(10,10),c=new u.q({uniforms:{resolution:{value:new u.t(1,16/9)},videoTexture:{value:o}},transparent:!0,vertexShader:t,fragmentShader:r,depthWrite:!0,depthTest:!0}),a=new u.g(i,c);a.position.z=-10,a.position.y=.5,O.add(a);var s=new u.b(10,6.5,2),d=new u.i({color:"black"}),l=new u.g(s,d);l.castShadow=!0,l.position.z=-11.1,C.push(l),O.add(l)},z=100,L=function(e){for(var t=e.video,n=void 0===t?document.querySelector("#master"):t,r=e.color,o=e.n,i=void 0===o?1:o,c=0;c<i;c++){var a=new u.c("rgb(".concat(p(255)+20,", ").concat(p(255)+20,", ").concat(p(255)+20,")")),s=y,d=new u.h({color:r||a}),l=new u.g(s,d),v=2*Math.random()*z-100,h=Math.random()*z,f=2*Math.random()*z-100;l.position.set(v,h,f),l.rotation.y=1.5*Math.PI,l.castShadow=!0,n&&(l.vId=n.id.replace("remote-video-","")),O.add(l),S.push(l)}};function A(e){var t=e.changeVolume,n=Object(o.useRef)();return Object(o.useEffect)((function(){var e=n.current,r=e.getContext("2d"),o=e.width,i=e.height;r.rect(0,0,o,i),r.fillStyle="#00ffb1",r.fill();var c=!0;e.onmousedown=function(e){c=!1},e.ontouchstart=function(){return c=!1};var a=function(n){if(!c){var r=e.getBoundingClientRect(),o=e.getContext("2d"),a={x:(n.touches?n.touches[0].clientX:n.clientX)-r.left};o.clearRect(0,0,o.canvas.width,o.canvas.height),o.beginPath(),o.rect(0,0,a.x,i),o.fill(),t(a.x/o.canvas.width)}};e.onmousemove=a,e.ontouchmove=a,document.onmouseup=function(){return c=!0}}),[t]),Object(r.jsx)("div",{id:"volume",children:Object(r.jsx)("canvas",{ref:n})})}function R(e){var t=e.videoRef,n=e.isPlaying,o=e.isMuted,i=e.toggleMute,c=e.setupAudioContext;return Object(r.jsxs)("div",{id:"controls-container",children:[Object(r.jsx)("div",{onClick:function(){var e=t.current;e.currentTime=e.seekable.end(0)},children:"Go To Live"}),Object(r.jsx)("div",{onClick:function(){var e=t.current;console.log(n),n?e.pause():e.play()},children:n?"Pause":"Play"}),Object(r.jsx)("div",{onClick:i,children:o?"Unmute":"Mute"}),Object(r.jsx)("div",{onClick:L,children:"Orb"}),Object(r.jsx)("div",{onClick:c,children:"AudioCtx"}),"iPhone"!==navigator.platform&&Object(r.jsx)(A,{changeVolume:function(e){return t.current.volume=(r=0,(n=e)>(o=1)?o:n<r?r:n);var n,r,o}})]})}var X="https://ice.raptor.pizza/hls/meiosis.m3u8";function I(e){var t=e.createScreen,n=(e.phase,e.videoRef),i=e.setupAudioContext,c=e.test,a=void 0!==c&&c,u=Object(o.useState)(!a),d=Object(s.a)(u,2),l=d[0],f=d[1],b=Object(o.useState)(0),p=Object(s.a)(b,2),j=p[0],g=p[1],x=Object(o.useState)(!1),y=Object(s.a)(x,2),O=y[0],k=y[1],M=Object(o.useState)(!0),E=Object(s.a)(M,2),S=E[0],C=E[1],P=Object(o.useCallback)(Object(h.a)(v.a.mark((function e(){var t;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.current,e.next=3,fetch(X).then((function(e){return e})).then((function(e){if(404===e.status)return!1;f(!1);var n=X;if(w.a.isSupported()){var r=new w.a;r.loadSource(n),r.attachMedia(t)}else t.src=n}));case 3:case"end":return e.stop()}}),e)}))),[n]);Object(o.useEffect)((function(){P()}),[P]);var z=Object(o.useCallback)((function(){return g(j+1)}),[j]);Object(o.useEffect)((function(){if(l)return j>15?(g(0),P()):void setTimeout(z,1e3)}),[P,z,j,l]),Object(o.useEffect)((function(){n.current.src=m,t(n.current),n.current.onplay=function(){return k(!0)},n.current.onpause=function(){return k(!1)}}),[]),Object(o.useEffect)((function(){var e=n.current;e.muted=!!S}),[S,n]);return Object(r.jsxs)("div",{children:[Object(r.jsx)("video",{id:"artist-stream",className:"video-js",crossOrigin:"true",ref:n,playsInline:!0,autoPlay:!0,loop:!0,controls:!0,muted:!0}),Object(r.jsx)(R,{videoRef:n,isPlaying:O,isMuted:S,toggleMute:function(e){console.log(e),C(!S)},setupAudioContext:i})]})}var B=n(8);function F(e){var t=e.phase,n=Object(o.useState)(),i=Object(s.a)(n,2),c=i[0],a=i[1],u=Object(o.useRef)();return Object(o.useEffect)((function(){var e=u.current.getBoundingClientRect();a({marginLeft:-e.width/2+"px",marginTop:-e.height/2+"px"})}),[]),Object(r.jsx)("div",{ref:u,style:Object(B.a)(Object(B.a)({},c),{},{opacity:1===t?0:1}),id:"press-start",children:"Press"})}var T,Y;function q(){var e=Object(o.useState)(0),t=Object(s.a)(e,2),n=t[0],i=t[1],c=Object(o.useRef)(void 0),a=Object(o.useRef)(void 0);Object(o.useEffect)((function(){}),[n]);return Object(o.useEffect)((function(){if(void 0!==c.current){var e,t=new u.k(75,window.innerWidth/window.innerHeight,.1,1e3),n=j,r=g,o=x;t.position.set(n,r,o),t.lookAt(0,0,0);var s=!1,l=!1,v=!1,h=!1,f=new u.u,w=new u.u,m=new u.w;m.setClearColor(new u.c(1,1,1)),m.setSize(window.innerWidth,window.innerHeight),m.setPixelRatio(window.devicePixelRatio),m.shadowMap.enabled=!0,m.shadowMap.type=u.j,c.current.appendChild(m.domElement);var b=function(){var e=new u.s(1,20,20),t=new u.h({color:new u.c(1,0,0),transparent:!0}),n=new u.g(e,t);n.name="start-button";var r={x:j,y:g-2,z:x-5,widthSegments:1,heightSegments:1};return n.position.set(r.x,r.y,r.z),O.add(n),n}();!function(){var e=new u.l(200,200,100,100);e.rotateX(-Math.PI/2),e=e.toNonIndexed();var t=new u.i({color:"white"}),n=new u.g(e,t);n.position.y=-2,n.receiveShadow=!0,n.castShadow=!0,n.name="floor",O.add(n)}(),function(){var e=new u.d(16777215,1.9,100);e.position.set(0,70,30),e.target.position.set(0,0,-10),e.castShadow=!0,e.shadow.mapSize.width=2048,e.shadow.mapSize.height=2048,e.shadow.camera.near=.5,e.shadow.camera.far=500,e.shadow.camera.left=-50,e.shadow.camera.right=50,e.shadow.camera.top=50,e.shadow.camera.bottom=-50,O.add(e),O.add(e.target)}(),c.current.addEventListener("touchstart",Z,!0),c.current.addEventListener("click",Z,!0);var p=!1,y=!1;document.addEventListener("touchstart",(function(e){var t=function(e){return e.touches||e.originalEvent.touches}(e)[0];P=t.clientX,z=t.clientY,A.set(e.touches[0].clientX,e.touches[0].clientY)}),!1),document.addEventListener("touchend",(function(e){s=!1,l=!1}),!1),document.addEventListener("touchmove",(function(e){if(!p)return;if(R.set(e.touches[0].clientX,e.touches[0].clientY),X.subVectors(R,A),A.copy(R),I+=2*Math.PI*X.y/m.domElement.height*.3,B+=2*Math.PI*X.x/m.domElement.width*.5,!P||!z)return;var t=e.touches[0].clientX,n=e.touches[0].clientY,r=P-t,o=z-n;Math.abs(r)>Math.abs(o)||(o>0?l=!0:s=!0);P=null,z=null}),!1);var P=null,z=null,A=new u.t,R=new u.t,X=new u.t,I=0,B=1*Math.PI/180,F={minPolarAngle:0};F.maxPolarAngle=Math.PI;var q,W,N,U,H=new u.e(0,0,0,"YXZ"),V=new u.a,D=!0,_=new u.n;!function n(){q=requestAnimationFrame(n),I===N&&B===U||p&&(N=I,U=B,H.set(I,B,0,"YXZ"),_.setFromEuler(H),t.quaternion.copy(_));var r=performance.now();if(e&&e.isLocked){w.z=Number(s)-Number(l),w.x=Number(h)-Number(v),w.normalize();var o=(r-W)/1e3;f.x-=10*f.x*o,f.z-=10*f.z*o;var i=e.getObject(),c=new u.u;c.copy(i.position),f.y-=9.8*100*o,(s||l)&&(f.z-=400*w.z*o),(v||h)&&(f.x-=400*w.x*o),e.moveRight(-f.x*o),e.moveForward(-f.z*o);var a=new u.r(i.position,2);if(C.length>0){var d=C[0];d.geometry.computeBoundingBox(),V.copy(d.geometry.boundingBox).applyMatrix4(d.matrixWorld),a.intersectsBox(V)&&(f.y=Math.max(0,f.y),0===e.getObject().position.y&&i.position.copy(c),D=!0)}e.getObject().position.y+=f.y*o,e.getObject().position.y<0&&(f.y=0,e.getObject().position.y=0,D=!0)}W=r,T&&T.getByteFrequencyData(Y);for(var b=0;b<S.length;b++){S[b].rotation.y+=.01;var j=Math.sin(.001*r+b);if(S[b].scale.set(j,j,j),T){var g=Y[b%256]/100;S[b].scale.set(g,g,g)}}m.render(O,t),k.update()}();var J=function(){t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),m.setSize(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",J,!1),function(){cancelAnimationFrame(q),window.removeEventListener("resize",J,!1)}}function Z(n){if(function(e){var t={x:0,y:0};e instanceof TouchEvent?(t.x=e.touches[0].clientX,t.y=e.touches[0].clientY):(t.x=e.clientX,t.y=e.clientY),E.x=t.x/window.innerWidth*2-1,E.y=-t.y/window.innerHeight*2+1}(n),M.setFromCamera(E,t),M.intersectObjects([b]).length>0&&(a.current.play(),!y)){y=!0;var r,o=performance.now(),w=b.material.color;!function n(){var a=.001*(performance.now()-o);if(b.material.color.set(w.lerp(new u.c(0,0,1),a)),b.material.opacity=function(e,t,n){return e*(n-t)+t}(a-1,1,0),i(1),a>2){p=!0,e=new d.a(t,c.current),c.current.addEventListener("click",(function(){return e.lock()})),O.add(e.getObject()),document.addEventListener("keydown",(function(e){switch(e.key){case"w":s=!0;break;case"a":v=!0;break;case"s":l=!0;break;case"d":h=!0;break;case" ":D&&(f.y+=200),D=!1}}),!1),document.addEventListener("keyup",(function(e){switch(e.key){case"w":s=!1;break;case"a":v=!1;break;case"s":l=!1;break;case"d":h=!1}}),!1);try{e.lock(),e.isLocked=!0}catch(m){e.isLocked=!0}return L({n:1e3}),cancelAnimationFrame(r)}r=requestAnimationFrame(n)}()}c.current.removeEventListener("touchstart",Z,!0),c.current.removeEventListener("click",Z,!0)}}),[]),Object(r.jsxs)("div",{style:{width:"100%",height:"100%"},ref:c,children:[Object(r.jsx)(F,{phase:n}),Object(r.jsx)(I,{createScreen:P,phase:n,videoRef:a,test:false,setupAudioContext:function(){if("iPhone"!==navigator.platform){var e=new(window.AudioContext||window.webkitAudioContext);T=e.createAnalyser();var t=e.createMediaElementSource(a.current);t.connect(T),t.connect(e.destination),T.fftSize=512;var n=T.frequencyBinCount;Y=new Uint8Array(n)}}})]})}function W(){return Object(r.jsx)("div",{children:Object(r.jsx)(q,{})})}a.a.render(Object(r.jsx)(i.a.StrictMode,{children:Object(r.jsx)(W,{})}),document.getElementById("root"))}},[[22,1,2]]]);
//# sourceMappingURL=main.a90d0066.chunk.js.map