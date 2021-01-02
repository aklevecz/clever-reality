const fragmentShader = `
uniform vec4 resolution;
uniform sampler2D videoTexture;
varying vec2 vUv;

void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(.5);
    vec4 tex = texture2D(videoTexture, newUV);
    gl_FragColor = tex;
}`;

export default fragmentShader;
