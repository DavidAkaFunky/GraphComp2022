/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh;

var clock;

var firstStage, secondStage, thirdStage;

var increaseAngleFirstStage, decreaseAngleFirstStage, increaseAngleSecondStage, decreaseAngleSecondStage, increaseAngleThirdStage, decreaseAngleThirdStage;

var firstSpotlight, secondSpotlight, thirdSpotlight, globalLight;

var firstSpotlightOn, secondSpotlightOn, thirdSpotlightOn, globalLightOn;

var lambertMaterial, phongMaterial;

var shadingMode, illuminationCalculation;

var perpsectiveCamera, orthographicCamera;

var usingPerspectiveCamera, usingOrthographicCamera, changedCamera;

const sheetDiagonal = 100;

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(50));

    createFloor();
    createFirstStage();
    createSecondStage();
    createThirdStage();
    createSpotlights();
    createGlobalLight();
}

function createFloor(){

}

function createPodium(){

}

function createFirstStage(){
    // createPodium(coordinates);

    // TODO: Not working!
    const vertices = new Float32Array([0, - sheetDiagonal / 2, - sheetDiagonal / 100,
                                       sheetDiagonal / 2, 0, sheetDiagonal / 100,
                                       0, sheetDiagonal / 2, - sheetDiagonal / 100,
                                       0, sheetDiagonal / 2, - sheetDiagonal / 100,
                                       - sheetDiagonal / 2, 0, sheetDiagonal / 100,
                                       0, - sheetDiagonal / 2, - sheetDiagonal / 100]);
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    material = new THREE.MeshBasicMaterial( { color: "red" } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);
}

function createSecondStage(){
    // createPodium(coordinates);
    // scene.add(secondStage, coordinates);
}

function createThirdStage(){
    // createPodium(coordinates);
    // scene.add(thirdStage, coordinates);
}

function createSpotlights(){
    
}

function createGlobalLight(){

}

function createPerspectiveCamera() {
    'use strict';
    perpsectiveCamera = new THREE.PerspectiveCamera(60,
                                                    window.innerWidth / window.innerHeight,
                                                    1,
                                                    1000);
                                                    
    perpsectiveCamera.position.set(0, 0, 0);
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
        
    orthographicCamera.position.set(0, 0, 0);
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
    const deltaAngle = Math.PI * deltaClock / 10; 

    // TODO: Implement rotations

    if (changedCamera){
        chooseCameraMode();
        changedCamera = false;
    }

    render();

    requestAnimationFrame(animate);
}