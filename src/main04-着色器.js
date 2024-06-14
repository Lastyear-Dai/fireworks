import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入变换控制器
import { TransformControls } from "three/addons/controls/TransformControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";


//1. 创建场景
const scene = new THREE.Scene()
//2. 创建相机 1角度;    2.视口宽高比;   3,近端0.1;   4.远端1000
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
// 位置
camera.position.set(0, 0, 20);
// 将相机添加到场景当中
scene.add(camera);

// 设置背景颜色为白色
// scene.background = new THREE.Color(0xaaaaaa);

//初始化渲染器
const renderer = new THREE.WebGLRenderer()
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer)
//将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const geometry = new THREE.PlaneGeometry(10, 10, 1024, 1024);
// const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const material = new THREE.ShaderMaterial({
  //内置的uniforms和attributes的定义会自动添加到GLSL shader代码中
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() }

  },
  //顶点着色器
  vertexShader: `
          uniform float time ;
          varying float vTime;
          varying vec2 vUv;
          varying float modelMatrix2;
          // 2D Random
float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}
                         
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}




          void main(){
          vUv=uv;
          vec4 modelMatrix1=modelMatrix * vec4( position, 1.0 ) ;
       modelMatrix1.z= (sin(modelMatrix1.x*2.0) *sin(modelMatrix1.y*1.0))*0.6;
        modelMatrix1.z+=-noise(vec2(abs((modelMatrix1.xy+time)) *2.0))   *0.6 ;
       modelMatrix2=modelMatrix1.z;
            vTime=modelMatrix1.z;
              gl_Position = projectionMatrix * viewMatrix * modelMatrix1 ;
          }
      `,
  //片元着色器
  fragmentShader: `
  uniform float time ;
 varying float modelMatrix2;
    varying vec2 vUv;
          void main(){
            float a= (modelMatrix2+4.0)/8.0;
            vec3 v= mix(vec3(0.0,0.0,0.0),vec3(1.0,1.0,1.0),a) ;
              gl_FragColor = vec4(v,1.0);
          }
    `

});


const plane = new THREE.Mesh(geometry, material);
scene.add(plane);




// 设置时钟
const clock = new THREE.Clock();
// 自定以一个函数
function render () {
  let time = clock.getElapsedTime();
  // let delta = clock.getDelta();
  material.uniforms.time.value = time * 2
  renderer.render(scene, camera);
  //做到无限渲染
  requestAnimationFrame(render);
}
render();
