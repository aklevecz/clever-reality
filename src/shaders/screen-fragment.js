const fragmentShader = `
uniform vec4 resolution;
uniform sampler2D videoTexture;
varying vec2 vUv;

void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.xy + vec2(.5);
    vec4 tex = texture2D(videoTexture, newUV);
    gl_FragColor = tex;
}`;

const fshader = `
varying vec2 vUv;

uniform sampler2D videoTexture;
uniform vec2 resolution;

void main()
{
  vec2 uv = vec2(0.5) + vUv * resolution.xy - resolution.xy*0.5;
  vec4 color = vec4(0.);
  if (uv.x>=0.0 && uv.y>=0.0 && uv.x<1.0 && uv.y<1.0) color = vec4(texture2D(videoTexture, uv).rgb, 1.0);
  gl_FragColor = color;
}
`;

export default fshader;
