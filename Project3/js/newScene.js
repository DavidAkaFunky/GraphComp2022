/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh, vertices;

var clock;

var origamiStages = [], podium;

var globalLight, globalLightOn;

var basicSimpleMaterial, basicTexturedMaterial, basicPodiumMaterial;

var lambertSimpleMaterial, lambertTexturedMaterial, lambertPodiumMaterial;

var phongSimpleMaterial, phongTexturedMaterial, phongPodiumMaterial;

var podiumCurrentMaterial, podiumLastMaterial;

var shadingMode, changedShadingMode;

var illuminationCalculation, changedIlluminationCalculation;

var perpsectiveCamera, orthographicCamera, VRPerspectiveCamera;

var usingPerspectiveCamera, usingOrthographicCamera, usingVRPerspectiveCamera, changedCamera;

var timeStopped;

const sheetDiagonal = 21*Math.SQRT2;

const podiumWidth = 150, podiumHeight = 30, podiumDepth = 100;

class OrigamiStage{
    constructor (spotlight, spotlightHelper, frontMesh, backMesh){
        this.origami = new THREE.Object3D();
        this.spotlight = spotlight;
        this.spotlight.target = this.origami;
        this.spotlightOn = true;
        this.spotlightHelper = spotlightHelper;
        this.frontMesh = frontMesh;
        this.frontLastMesh = new THREE.Mesh(frontMesh.geometry, basicTexturedMaterial);
        this.backMesh = backMesh;
        this.backLastMesh = new THREE.Mesh(backMesh.geometry, basicSimpleMaterial);
        this.increaseAngle = false;
        this.decreaseAngle = false;
    }
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    createPodium();
    createFirstStage();
    createSecondStage();
    createThirdStage();
    createGlobalLight();
}

function createPodium(){
    podium = new THREE.Object3D();
    createParallelepiped(podiumWidth, podiumHeight, podiumDepth, 0, 0, 0);
    createParallelepiped(podiumWidth, 2 * podiumHeight / 3, 10, 0, - podiumHeight / 6, podiumDepth / 2 + 5);
    createParallelepiped(podiumWidth, podiumHeight / 3, 10, 0, - podiumHeight / 3, podiumDepth / 2 + 15);
    podiumCurrentMaterial = lambertPodiumMaterial;
    podiumLastMaterial = basicPodiumMaterial;
    scene.add(podium);
}

function createParallelepiped(width, height, depth, x, y, z){
    'use strict';
    
    geometry = new THREE.BoxGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, lambertPodiumMaterial);
    mesh.position.set(x, y, z);
    podium.add(mesh);
}

function createLamp(x, y, z, rotX){
    'use strict';

    const lamp = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({color: '#6988a3'});
    material.needsUpdate = true;
    geometry = new THREE.ConeGeometry(5, 10, 14); //radius, height
    mesh = new THREE.Mesh(geometry, material);

    lamp.add(mesh);

    material = new THREE.MeshBasicMaterial({color: '#efdfbb'});
    geometry = new THREE.SphereGeometry(2, 64, 64);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0, - 5, 0);
    
    lamp.add(mesh);

    lamp.position.set(x, y, z);
    lamp.rotateX(rotX);
    scene.add(lamp);
}

function createPolygon(vertices, material){
    'use strict';

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

function createOrigamiStage(frontMesh, backMesh, x, y, z){
    'use strict';
    let spotlight = createSpotlight(x, 2*y, 10);
    let spotlightHelper = new THREE.SpotLightHelper(spotlight);
    let origamiStage = new OrigamiStage(spotlight, spotlightHelper, frontMesh, backMesh);
    origamiStage.origami.add(frontMesh);
    origamiStage.origami.add(backMesh);
    origamiStage.origami.position.set(x, y, z);
    origamiStages.push(origamiStage);
    scene.add(spotlightHelper);
    scene.add(origamiStage.origami);
	createLamp(x, 2*y, 10, Math.PI / 10);
}

function createFirstStage(){
    'use strict';

    vertices = new Float32Array([0, - sheetDiagonal / 2, -1,
                                 sheetDiagonal / 2, 0, 1,
                                 0, sheetDiagonal / 2, -1,
 
                                 0, sheetDiagonal / 2, -1,
                                 - sheetDiagonal / 2, 0, 1,
                                 0, - sheetDiagonal / 2, -1]);
    
    let frontMesh = createPolygon(vertices, lambertTexturedMaterial);

    vertices = new Float32Array([0, - sheetDiagonal / 2, -1,
                                 - sheetDiagonal / 2, 0, 1,
                                 0, sheetDiagonal / 2, -1,
                                 
                                 0, sheetDiagonal / 2, -1,
                                 sheetDiagonal / 2, 0, 1,
                                 0, - sheetDiagonal / 2, -1]);

    let backMesh = createPolygon(vertices, lambertSimpleMaterial);

    createOrigamiStage(frontMesh, backMesh, - podiumWidth / 3, (podiumHeight + sheetDiagonal) / 2, 0);
}

function createSecondStage(){
    'use strict';

    vertices = new Float32Array([0, - sheetDiagonal / 2, 0,
                                 3.6, sheetDiagonal / 2 - 9, - 2.5,
                                 0.2, sheetDiagonal / 2 - 7.1, 1,
 
                                 0, - sheetDiagonal / 2, 0,
                                 - 0.2, sheetDiagonal / 2 - 7.1, 1,
                                 - 3.6, sheetDiagonal / 2 - 9, - 2.5,
                             
                                 0, - sheetDiagonal / 2, 0,
                                 4, sheetDiagonal / 2 - 5, - 2.7,
                                 0, sheetDiagonal / 2, 0,
 
                                 0, - sheetDiagonal / 2, 0,
                                 0, sheetDiagonal / 2, 0,
                                 - 4, sheetDiagonal / 2 - 5, - 2.7,
                                
                                 0.2, sheetDiagonal / 2 - 9, - 0.2,
                                 3.6, sheetDiagonal / 2 - 9, - 2.5,
                                 0, - sheetDiagonal / 2, 0,

                                 - 3.6, sheetDiagonal / 2 - 9, - 2.5,
                                 - 0.2, sheetDiagonal / 2 - 9, - 0.2,
                                 0, - sheetDiagonal / 2, 0]);
    
    let frontMesh = createPolygon(vertices, lambertTexturedMaterial);

    vertices = new Float32Array([3.6, sheetDiagonal / 2 - 9, - 2.5,
                                 4, sheetDiagonal / 2 - 5, - 2.5,
                                 0.2, sheetDiagonal / 2 - 7.1, 1,
                             
                                 - 3.6, sheetDiagonal / 2 - 9, - 2.5,
                                 - 0.2, sheetDiagonal / 2 - 7.1, 1,
                                 - 4, sheetDiagonal / 2 - 5, - 2.7,
                                 
                                 0, sheetDiagonal / 2, 0,
                                 4, sheetDiagonal / 2 - 5, - 2.7,
                                 0, - sheetDiagonal / 2, 0,
                                
                                 - 4, sheetDiagonal / 2 - 5, - 2.7,
                                 0, sheetDiagonal / 2, 0,
                                 0, - sheetDiagonal / 2, 0,]);

    let backMesh = createPolygon(vertices, lambertSimpleMaterial);

    createOrigamiStage(frontMesh, backMesh, 0, (podiumHeight + sheetDiagonal) / 2, 0);
}

function createThirdStage(){

    vertices = new Float32Array([
									// Face A1
							     -4.42,        0,   -2.4,    
		                           8.5,      4.4,      0,
                                     4,        0,   -3.5, 

									// Face A2
							     -4.42,        0,   -2.4,    
                                    -6,      2.2,      0, 
		                           8.5,      4.4,      0,

									// Face B1
							     -4.42,        0,    2.4,    
                                     4,        0,    3.5, 
		                           8.5,      4.4,      0,

									// Face B2
							     -4.42,        0,    2.4,    
		                           8.5,      4.4,      0,
                                    -6,      2.2,      0, 

                                    // Face C1
                                  1.58,     3.35,   -0.7,
                                 -4.42,        0,   -2.4,
                                    -6,      2.2,      0, 

                                    // Face C2
                                  1.58,     3.35,   -0.7,
                                     0,        0,  -2.98, 
                                 -4.42,        0,   -2.4,

                                    // Face D1
                                 1.58,     3.35,     0.7,
                                    -6,      2.2,      0, 
                                 -4.42,        0,    2.4,

                                    // Face D2
                                  1.58,     3.35,    0.7,     
                                 -4.42,        0,    2.4,
                                     0,        0,   2.98, 

                                    // Face E1
                                  1.58,     3.35,   -0.7,
                                     0,        0,  -2.98,
                                     4,        0,   -3.5,

                                     // Face E2
                                  1.58,     3.35,   -0.7,
                                    -6,      2.2,      0, 
                                 -4.42,        0,   -2.4,
 
                                     // Face E3
                                  1.58,     3.35,   -0.7,    
                                 -4.42,        0,   -2.4,
                                     0,        0,  -2.98, 

                                     // Face F1
                                  1.58,     3.35,    0.7,
                                     4,        0,    3.5,
                                     0,        0,   2.98,

                                     // Face F2
                                  1.58,     3.35,    0.7,
                                 -4.42,        0,    2.4,
                                    -6,      2.2,      0, 

                                     // Face F3
                                  1.58,     3.35,    0.7,   
                                     0,        0,   2.98,   
                                 -4.42,        0,    2.4,

                                    // Face G
                                    -6,      2.2,      0,
                                 -4.42,        0,   -2.4,
                                 -5.51,      2.2,   -2.4,

                                    // Face I
                                 -6,         2.2,      0,
                                 -5.51,      2.2,   -2.4,
                                 -4.42,        0,   -2.4,

                                    // Face H
                                    -6,      2.2,      0,
                                 -5.51,      2.2,    2.4,
                                 -4.42,        0,    2.4,

                                    // Face J
                                    -6,      2.2,      0,  
                                 -4.42,        0,    2.4,
                                 -5.51,      2.2,    2.4,

                                    // Face K1
                                  -4.5,     12.2,      0,
                                    -6,      2.2,      0, 
                                 -5.51,      2.2,   -2.4,

                                    // Face K2
                                 -4.5,      12.2,      0,
                                -5.51,       2.2,   -2.4,
                                   -4,      11.2,   -0.9, 

                                    // Face L1
                                 -4.5,      12.2,      0,             
                                -5.51,       2.2,    2.4,
                                   -6,       2.2,      0,

                                    // Face L2
                                 -4.5,      12.2,      0,
                                   -4,      11.2,    0.9,
                                -5.51,       2.2,    2.4,

                                    // Face M1
                                 -4.5,      12.2,      0, 
                                -5.51,       2.2,   -2.4,
                                   -6,       2.2,      0, 
 
                                     // Face M2
                                 -4.5,      12.2,      0,
                                   -4,      11.2,   -0.9,
                                -5.51,       2.2,   -2.4, 
 
                                     // Face N1
                                 -4.5,      12.2,      0,             
                                   -6,       2.2,      0,
                                -5.51,       2.2,    2.4,
  
                                      // Face N2
                                 -4.5,      12.2,      0,
                                -5.51,       2.2,    2.4,
                                   -4,      11.2,    0.9,
  
                                      // Face O
                                 -4.5,      12.2,      0,
                                   -4,      11.2,   -0.9,
                                 -8.5,       9.7,      0,
  
                                      // Face P
                                 -4.5,      12.2,      0,
                                 -8.5,       9.7,      0,
                                   -4,      11.2,    0.9,
  
                                  // R and Q omited as they seem to be hidden 
                                  ]);
    
    let frontMesh = createPolygon(vertices, lambertTexturedMaterial);

    vertices = new Float32Array([
									// Face alfa 1
							     -4.42,        0,   -2.4,    
                                     4,        0,   -3.5, 
		                           8.5,      4.4,      0,
 
								 	// Face alfa 2
							     -4.42,        0,   -2.4,    
		                           8.5,      4.4,      0,
                                    -6,      2.2,      0, 
 
								 	// Face beta 1
							     -4.42,        0,    2.4,    
		                           8.5,      4.4,      0,
                                     4,        0,    3.5, 
 
								 	// Face beta 2
							     -4.42,        0,    2.4,    
                                    -6,      2.2,      0, 
		                           8.5,      4.4,      0,
 
                                     // Face gamma
                                  1.58,     3.35,   -0.7,
                                     4,        0,   -3.5,
                                     0,        0,  -2.98,
 
                                    // Face delta
                                  1.58,     3.35,    0.7,
                                     0,        0,   2.98,
                                     4,        0,    3.5,        

					                ]);

    let backMesh = createPolygon(vertices, lambertSimpleMaterial);

    createOrigamiStage(frontMesh, backMesh, podiumWidth / 3, (podiumHeight + sheetDiagonal) / 2, 0);
}

function createSpotlight(x, y, z){
    'use strict';

    let spotlight = new THREE.SpotLight("white", 20, 60, Math.PI / 6, 1, 0);
    spotlight.position.set(x, y, z);
    spotlight.castShadow = true;
    
    scene.add(spotlight);
    scene.add(spotlight.target);

    return spotlight;
}

function createGlobalLight(){
    'use strict';

    globalLight = new THREE.DirectionalLight("white", 1);

    globalLight.position.set(40, 80, 40);
    globalLight.castShadow = true;

    const spotter = new THREE.DirectionalLightHelper(globalLight, 10);
    scene.add(spotter);
    scene.add(globalLight);
}

function createMaterials(){
    'use strict';
    // Texture must be used eventually
    const texture = new THREE.TextureLoader().load('https://static.wikia.nocookie.net/planet-texture-maps/images/a/aa/Earth_Texture_Full.png/revision/latest?cb=20190401163425');
    basicSimpleMaterial = new THREE.MeshBasicMaterial({color: "blue"});
    basicSimpleMaterial.needsUpdate = true;

    basicTexturedMaterial = new THREE.MeshBasicMaterial({color: "red"});
    basicTexturedMaterial.needsUpdate = true;

    basicPodiumMaterial = new THREE.MeshBasicMaterial({color: "yellow"});
    basicPodiumMaterial.needsUpdate = true;   

    lambertSimpleMaterial = new THREE.MeshLambertMaterial({color: "blue"});
    lambertSimpleMaterial.needsUpdate = true;

    lambertTexturedMaterial = new THREE.MeshLambertMaterial({color: "red"});
    lambertTexturedMaterial.needsUpdate = true;

    lambertPodiumMaterial = new THREE.MeshLambertMaterial({color: "yellow"});
    lambertPodiumMaterial.needsUpdate = true;

    phongSimpleMaterial = new THREE.MeshPhongMaterial({color: "blue"});
    phongSimpleMaterial.needsUpdate = true;

    phongTexturedMaterial = new THREE.MeshPhongMaterial({color: "red"});
    phongTexturedMaterial.needsUpdate = true;
    
    phongPodiumMaterial = new THREE.MeshPhongMaterial({color: "yellow"});
    phongPodiumMaterial.needsUpdate = true;
}

function createPerspectiveCamera() {
    'use strict';
    perpsectiveCamera = new THREE.PerspectiveCamera(60,
                                                    window.innerWidth / window.innerHeight,
                                                    1,
                                                    1000);
                                                    
    perpsectiveCamera.position.set(0, 40, 150);
    perpsectiveCamera.lookAt(new THREE.Vector3(0, 20, 0));
}

function createVRPerspectiveCamera() {
    'use strict';
    VRPerspectiveCamera = new THREE.PerspectiveCamera(60,
                                                      window.innerWidth / window.innerHeight,
                                                      1,
                                                      1000);
                                                    
    VRPerspectiveCamera.position.set(0,0,0);
    VRPerspectiveCamera.lookAt(new THREE.Vector3(0, 20, 0));
}

function createOrthographicCamera() {
    'use strict';
    orthographicCamera = new THREE.OrthographicCamera(- 65 * window.innerWidth / window.innerHeight,
                                                      65 * window.innerWidth / window.innerHeight,
                                                      65,
                                                      - 65,
                                                      - 1000,
                                                      1000);
        
    orthographicCamera.position.set(0, 30, 30);
    orthographicCamera.lookAt(new THREE.Vector3(0, 30, 0));
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
        usingVRPerspectiveCamera = false;
    }
    else if (e.keyCode == 50) {  // 2
        changedCamera = true;
        usingPerspectiveCamera = false;
        usingOrthographicCamera = true;
        usingVRPerspectiveCamera = false;
    }

    // Rotate origami figures
    if (e.keyCode == 81 || e.keyCode == 113)  // Q, q
        origamiStages[0].increaseAngle = true;

    if (e.keyCode == 87 || e.keyCode == 119)  // W, w
        origamiStages[0].decreaseAngle = true;

    if (e.keyCode == 69 || e.keyCode == 101)  // E, e
        origamiStages[1].increaseAngle = true;

    if (e.keyCode == 82 || e.keyCode == 114)  // R, r
        origamiStages[1].decreaseAngle = true;

    if (e.keyCode == 84 || e.keyCode == 116)  // T, t
        origamiStages[2].increaseAngle = true;

    if (e.keyCode == 89 || e.keyCode == 121)  // Y, y
        origamiStages[2].decreaseAngle = true;

        
    // Shading mode (Lambert or Phong)
    if (e.keyCode == 65 || e.keyCode == 97){ // A, a
        changedShadingMode = true;
        shadingMode = !shadingMode;
    }
        

    // Illumination calculation
    if (e.keyCode == 83 || e.keyCode == 115){ // S, s
        changedIlluminationCalculation = true;
        illuminationCalculation = !illuminationCalculation;
    }  
    

    // Turn spotlights on/off
    if (e.keyCode == 90 || e.keyCode == 122)  // Z, z
        origamiStages[0].spotlightOn = !origamiStages[0].spotlightOn;

    if (e.keyCode == 88 || e.keyCode == 120)  // X, x
        origamiStages[1].spotlightOn = !origamiStages[1].spotlightOn;

    if (e.keyCode == 67 || e.keyCode == 99)   // C, c
        origamiStages[2].spotlightOn = !origamiStages[2].spotlightOn;


    // Turn global directional light on/off
    if (e.keyCode == 68 || e.keyCode == 100)  // D, d
        globalLightOn = !globalLightOn;

    if (e.keyCode == 32)                      // Spacebar
        timeStopped = !timeStopped; // What button should we use?
}

function onKeyUp(e) {
    'use strict';

    // Rotate origami figures
    if (e.keyCode == 81 || e.keyCode == 113)  // Q, q
        origamiStages[0].increaseAngle = false;

    if (e.keyCode == 87 || e.keyCode == 119)  // W, w
        origamiStages[0].decreaseAngle = false;

    if (e.keyCode == 69 || e.keyCode == 101)  // E, e
        origamiStages[1].increaseAngle = false;

    if (e.keyCode == 82 || e.keyCode == 114)  // R, r
        origamiStages[1].decreaseAngle = false;

    if (e.keyCode == 84 || e.keyCode == 116)  // T, t
        origamiStages[2].increaseAngle = false;

    if (e.keyCode == 89 || e.keyCode == 121)  // Y, y
        origamiStages[2].decreaseAngle = false;
}

function resetUpdateFlags(){
    'use strict';
    changedShadingMode = false;
    changedIlluminationCalculation = false;
    timeStopped = false;
    changedCamera = true;
    usingPerspectiveCamera = true;
    shadingMode = true;
    illuminationCalculation = true;
    globalLightOn = true;
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // IMPORTANT! For VR to work, the renderer.xr.enabled property must be set to true
    renderer.xr.enabled = true;  // 
    document.body.appendChild(renderer.domElement);
}

function initVR() {
    document.body.appendChild(VRButton.createButton(renderer));
}

function init() {
    'use strict';

    initRenderer();
    createMaterials();
    createScene();
    resetUpdateFlags();
    createPerspectiveCamera();
    createOrthographicCamera();
    initVR();

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
    else if (usingVRPerspectiveCamera)
        camera = VRPerspectiveCamera;
}

function swap(mesh1, mesh2){
    'use strict';

    const tempMesh = mesh1;
    mesh1 = mesh2;
    mesh2 = tempMesh;
    return [mesh1, mesh2];
}

function animate() {
    'use strict';

    const deltaClock = clock.getDelta();

    const deltaAngle = Math.PI * deltaClock / 2; 

    if (changedCamera){
        chooseCameraMode();
        changedCamera = false;
    }

    for (let i = 0; i < origamiStages.length; i++) {
        let origamiStage = origamiStages[i];
        origamiStage.spotlightOn ? origamiStage.spotlight.intensity = 1 : origamiStage.spotlight.intensity = 0;
        origamiStage.spotlightHelper.update();

        if (!timeStopped)
            origamiStage.origami.rotateY((origamiStage.increaseAngle - origamiStage.decreaseAngle) * deltaAngle);

        if (changedIlluminationCalculation){
            [origamiStage.frontMesh, origamiStage.frontLastMesh] = swap(origamiStage.frontMesh, origamiStage.frontLastMesh);
            [origamiStage.backMesh, origamiStage.backLastMesh] = swap(origamiStage.backMesh, origamiStage.backLastMesh);
            origamiStage.origami.clear();
            origamiStage.origami.add(origamiStage.frontMesh);
            origamiStage.origami.add(origamiStage.backMesh);
        }
        if (changedShadingMode && illuminationCalculation){
            if (shadingMode){
                origamiStage.frontMesh.material = lambertTexturedMaterial;
                origamiStage.backMesh.material = lambertSimpleMaterial;
            } else {
                origamiStage.frontMesh.material = phongTexturedMaterial;
                origamiStage.backMesh.material = phongSimpleMaterial;
            }
        }
    }

    if (changedIlluminationCalculation){
        [podiumCurrentMaterial, podiumLastMaterial] = swap(podiumCurrentMaterial, podiumLastMaterial);
        for (let i = 0; i < podium.children.length; i++) {
            const podiumChild = podium.children[i];
            podiumChild.material = podiumCurrentMaterial;
        }
    }
    if (changedShadingMode && illuminationCalculation){
        for (let i = 0; i < podium.children.length; i++) {
            const podiumChild = podium.children[i];
            podiumChild.material = shadingMode ? lambertPodiumMaterial : phongPodiumMaterial;
        }
    }
    
    if (changedIlluminationCalculation)
        changedIlluminationCalculation = false;
    
    if (changedShadingMode)
        changedShadingMode = false;

    globalLightOn ? globalLight.intensity = 1 : globalLight.intensity = 0;

    if (timeStopped)
        // Show pause message

    if (timeStopped && deltaClock != 0)
        clock.stop();
    if (!timeStopped && deltaClock == 0)
        clock.start();  

    render();

    renderer.setAnimationLoop(animate);
    requestAnimationFrame(animate);
}
