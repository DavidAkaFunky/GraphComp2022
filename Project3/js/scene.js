/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh, vertices;

var clock;

var firstStage, secondStage, thirdStage;

var increaseAngleFirstStage, decreaseAngleFirstStage, increaseAngleSecondStage, decreaseAngleSecondStage, increaseAngleThirdStage, decreaseAngleThirdStage;

var firstSpotlight, secondSpotlight, thirdSpotlight, globalLight;

var firstSpotlightOn, secondSpotlightOn, thirdSpotlightOn, globalLightOn;

var lambertMaterial, phongMaterial;

var shadingMode, illuminationCalculation;

var perpsectiveCamera, orthographicCamera;

var usingPerspectiveCamera, usingOrthographicCamera, changedCamera;

const sheetDiagonal = 25;

const podiumWidth = 150, podiumHeight = 30, podiumDepth = 100;

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(50));

    createPodium();
    createFirstStage();
    createSecondStage();
    createThirdStage();
    //createGlobalLight();
}

function createPodium(){
    createParallelepiped(podiumWidth, podiumHeight, podiumDepth, 0, 0, 0);
    createParallelepiped(podiumWidth, 2 * podiumHeight / 3, 10, 0, - podiumHeight / 6, podiumDepth / 2 + 5);
    createParallelepiped(podiumWidth, podiumHeight / 3, 10, 0, - podiumHeight / 3, podiumDepth / 2 + 15);
}

function createParallelepiped(width, height, depth, x, y, z){
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
    geometry = new THREE.BoxGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);

    scene.add(mesh);
}

function createFirstStageFace(vertices, material){

    //const texture = new THREE.TextureLoader().load('https://www.3dwallpaperarts.com/wp-content/uploads/2021/05/ahegao-wallpaper-0043-1536x864.jpg');
    //material = new THREE.MeshBasicMaterial({map: texture});
    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    mesh = new THREE.Mesh(geometry, material);
    firstStage.add(mesh);
}

function createFirstStage(){
    'use strict';

    firstStage = new THREE.Object3D();

    vertices = new Float32Array([0, - sheetDiagonal / 2, -1,
                                 sheetDiagonal / 2, 0, 1,
                                 0, sheetDiagonal / 2, -1,
 
                                 0, sheetDiagonal / 2, -1,
                                 - sheetDiagonal / 2, 0, 1,
                                 0, - sheetDiagonal / 2, -1]);
    
    material = new THREE.MeshLambertMaterial({color: "red"});
    createFirstStageFace(vertices, material);

    vertices = new Float32Array([0, - sheetDiagonal / 2, -1,
                                 - sheetDiagonal / 2, 0, 1,
                                 0, sheetDiagonal / 2, -1,
                                 
                                 0, sheetDiagonal / 2, -1,
                                 sheetDiagonal / 2, 0, 1,
                                 0, - sheetDiagonal / 2, -1]);

    material = new THREE.MeshBasicMaterial({color: "blue"});
    createFirstStageFace(vertices, material);

    createSpotlight(firstSpotlight, - podiumWidth / 3, 20, 0);
    firstStage.position.set(- podiumWidth / 3, (podiumHeight + sheetDiagonal) / 2, 0);
    scene.add(firstStage);
}

function createSecondStage(){
    // createSpotlight(secondSpotlight, ??, ??, ??)
    // scene.add(secondStage, coordinates);
}

function createThirdStage(){
    // createSpotlight(thirdSpotlight, ??, ??, ??)
    // scene.add(thirdStage, coordinates);
}

function createSpotlight(spotlight, x, y, z){
    spotlight = new THREE.SpotLight("white");
    spotlight.position.set(x, y, z);

    spotlight.castShadow = true;

    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;

    spotlight.shadow.camera.near = 500;
    spotlight.shadow.camera.far = 4000;
    spotlight.shadow.camera.fov = 30;

    const spotter = new THREE.SpotLightHelper(spotlight, 10);
    scene.add(spotter);
    scene.add(spotlight);
}

function createGlobalLight(){
    
    globalLight = new THREE.DirectionalLight("white", 1);
    globalLight.position.set(50, 0, 0);
    // globalLight.rotation.set(0, 0, - Math.PI / 4);
    globalLight.target = firstStage;
    const spotter = new THREE.DirectionalLightHelper(globalLight, 10);
    scene.add(spotter);
    scene.add(globalLight);
}

function createPerspectiveCamera() {
    'use strict';
    perpsectiveCamera = new THREE.PerspectiveCamera(60,
                                                    window.innerWidth / window.innerHeight,
                                                    1,
                                                    1000);
                                                    
    perpsectiveCamera.position.set(0, 20, 200);
    perpsectiveCamera.lookAt(new THREE.Vector3(0, 0, 0));
}

function createOrthographicCamera() {
    'use strict';
    orthographicCamera = new THREE.OrthographicCamera(- 65 * window.innerWidth / window.innerHeight,
                                                      65 * window.innerWidth / window.innerHeight,
                                                      65,
                                                      - 65,
                                                      - 1000,
                                                      1000);
        
    orthographicCamera.position.set(0, 0, 50);
    orthographicCamera.lookAt(new THREE.Vector3(0, 0, 0));
}

function onResizeOrthographicCamera() {
    'use strict';

    camera.left = - 65 * window.innerWidth / window.innerHeight;
    camera.right = 65 * camera.aspect;
    camera.top = 65;
    camera.bottom = - 65;
}

function onResize() {
    'use strict';
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        if (usingOrthographicCamera){
            onResizeOrthographicCamera();
        }
        camera.updateProjectionMatrix();
    }

}

function onKeyDown(e) {
    'use strict';

    // Choose camera
    if (e.keyCode == 49) {  // 1
        changedCamera = true;
        usingPerspectiveCamera = true;
        usingOrthographicCamera = false;
    }
    else if (e.keyCode == 50) {  // 2
        changedCamera = true;
        usingPerspectiveCamera = false;
        usingOrthographicCamera = true;
    }

    // Rotate origami figures
    if (e.keyCode == 81 || e.keyCode == 113)  // Q, q
        increaseAngleFirstStage = true;

    if (e.keyCode == 87 || e.keyCode == 119)  // W, w
        decreaseAngleFirstStage = true;

    if (e.keyCode == 69 || e.keyCode == 101)  // E, e
        increaseAngleSecondStage = true;

    if (e.keyCode == 82 || e.keyCode == 114)  // R, r
        decreaseAngleSecondStage = true;

    if (e.keyCode == 84 || e.keyCode == 116)  // T, t
        increaseAngleThirdStage = true;

    if (e.keyCode == 89 || e.keyCode == 121)  // Y, y
        decreaseAngleThirdStage = true;

        
    // Shading mode
    if (e.keyCode == 65 || e.keyCode == 97)   // A, a
        shadingMode = !shadingMode;


    // Illumination calculation
    if (e.keyCode == 83 || e.keyCode == 115)  // S, s
        illuminationCalculation = !illuminationCalculation;
    

    // Turn spotlights on/off
    if (e.keyCode == 90 || e.keyCode == 122)  // Z, z
        firstSpotlightOn = !firstSpotlightOn;

    if (e.keyCode == 88 || e.keyCode == 120)  // X, x
        secondSpotlightOn = !secondSpotlightOn;

    if (e.keyCode == 67 || e.keyCode == 99)   // C, c
        thirdSpotlightOn = !thirdSpotlightOn;


    // Turn global directional light on/off
    if (e.keyCode == 68 || e.keyCode == 100)  // D, d
        globalLightOn = !globalLightOn;

}

function onKeyUp(e) {
    'use strict';

    // Rotate origami figures
    if (e.keyCode == 81 || e.keyCode == 113)  // Q, q
        increaseAngleFirstStage = false;

    if (e.keyCode == 87 || e.keyCode == 119)  // W, w
        decreaseAngleFirstStage = false;

    if (e.keyCode == 69 || e.keyCode == 101)  // E, e
        increaseAngleSecondStage = false;

    if (e.keyCode == 82 || e.keyCode == 114)  // R, r
        decreaseAngleSecondStage = false;

    if (e.keyCode == 84 || e.keyCode == 116)  // T, t
        increaseAngleThirdStage = false;

    if (e.keyCode == 89 || e.keyCode == 121)  // Y, y
        decreaseAngleThirdStage = false;
}

function resetUpdateFlags(){
    'use strict';
    increaseAngleFirstStage = false;
    decreaseAngleFirstStage = false;
    increaseAngleSecondStage = false;
    decreaseAngleSecondStage = false;
    increaseAngleThirdStage = false;
    decreaseAngleThirdStage = false;
    changedCamera = true;
    usingPerspectiveCamera = true;
    shadingMode = true;
    illuminationCalculation = true;
    firstSpotlight = true;
    secondSpotlight = true;
    thirdSpotlight = true;
    globalLight = true;
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    resetUpdateFlags();
    createPerspectiveCamera();
    createOrthographicCamera();

    clock = new THREE.Clock();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function chooseCameraMode(){
    'use strict';

    if (usingPerspectiveCamera)
        camera = perpsectiveCamera;
    else if (usingOrthographicCamera)
        camera = orthographicCamera;
}

function animate() {
    'use strict';
    
    const deltaClock = clock.getDelta();
    const deltaAngle = Math.PI * deltaClock / 2; 

    // TODO: Implement global light intensity
    // globalLightOn ? globalLight.intensity = 0.5 : globalLight.intensity = 0;

    if (changedCamera){
        chooseCameraMode();
        changedCamera = false;
    }

    firstStage.rotateY((increaseAngleFirstStage - decreaseAngleFirstStage) * deltaAngle);

    render();

    requestAnimationFrame(animate);
}