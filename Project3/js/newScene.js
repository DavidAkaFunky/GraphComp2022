/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh, vertices;

var clock;

var origamiStages = [], podium;

var globalLight, globalLightOn;

var basicSimpleMaterial, basicTexturedMaterial;

var lambertSimpleMaterial, lambertTexturedMaterial;

var phongSimpleMaterial, phongTexturedMaterial;

var shadingMode,toggleShadingMode;

var illuminationCalculation, toggleIlluminationCalculation;

var perpsectiveCamera, orthographicCamera;

var usingPerspectiveCamera, usingOrthographicCamera, changedCamera;

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
    scene.add(podium);
}

function createParallelepiped(width, height, depth, x, y, z){
    'use strict';
    
    const texture = new THREE.TextureLoader().load('https://static.wikia.nocookie.net/planet-texture-maps/images/a/aa/Earth_Texture_Full.png/revision/latest?cb=20190401163425');

    material = new THREE.MeshLambertMaterial({color: "yellow"});

    geometry = new THREE.BoxGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    podium.add(mesh);
}

function createLamp(x, y, z){
    'use strict';
    
    material = new THREE.MeshBasicMaterial({color: 'cyan'})
    geometry = new THREE.ConeGeometry(5, 10, 14); //radius, height
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);

    mesh.rotateX(Math.PI/10);
    
    scene.add(mesh);

    material = new THREE.MeshBasicMaterial({color: 'cyan'});
    geometry = new THREE.SphereGeometry(2, 64, 64);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y - 5, z);
    
    scene.add(mesh);
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
	createLamp(x, 2*y, 10);
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

								]);

    let backMesh = createPolygon(vertices, lambertSimpleMaterial);

    createOrigamiStage(frontMesh, backMesh, podiumWidth / 3, (podiumHeight + sheetDiagonal) / 2, 0);
}

function createSpotlight(x, y, z){
    'use strict';

    let spotlight = new THREE.SpotLight(new THREE.Color("white"), 20, 0, Math.PI / 6, 1, 0);
    spotlight.position.set(x, y, z);
    spotlight.castShadow = true;
    
    scene.add(spotlight);
    scene.add(spotlight.target);

    return spotlight;
}

function createGlobalLight(){
    'use strict';

    globalLight = new THREE.DirectionalLight("white", 1);

    globalLight.position.set(50, 100, 35);
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
    basicTexturedMaterial = new THREE.MeshBasicMaterial({color: "red"});
    lambertSimpleMaterial = new THREE.MeshLambertMaterial({color: "blue"});
    lambertTexturedMaterial = new THREE.MeshLambertMaterial({color: "red"});
    phongSimpleMaterial = new THREE.MeshPhongMaterial({color: "blue"});
    phongTexturedMaterial = new THREE.MeshPhongMaterial({color: "red"});
    
}

function createPerspectiveCamera() {
    'use strict';
    perpsectiveCamera = new THREE.PerspectiveCamera(60,
                                                    window.innerWidth / window.innerHeight,
                                                    1,
                                                    1000);
                                                    
    perpsectiveCamera.position.set(0, 40, 120);
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
        origamiStages[2].increaseAngle = true;

        
    // Shading mode (Lambert or Phong)
    if (e.keyCode == 65 || e.keyCode == 97){ // A, a
        toggleShadingMode = true;
        shadingMode = !shadingMode;
    }
        

    // Illumination calculation
    if (e.keyCode == 83 || e.keyCode == 115){ // S, s
        toggleIlluminationCalculation = true;
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

    if (e.keyCode == 70 || e.keyCode == 102)  // F, f
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
    toggleShadingMode = false;
    toggleIlluminationCalculation = false;
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

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createMaterials();
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

    if (!timeStopped){
        const deltaAngle = Math.PI * deltaClock / 2; 

        if (changedCamera){
            chooseCameraMode();
            changedCamera = false;
        }

        for (let i = 0; i < origamiStages.length; i++) {
            let origamiStage = origamiStages[i];
            origamiStage.spotlightOn ? origamiStage.spotlight.intensity = 1 : origamiStage.spotlight.intensity = 0;
            origamiStage.origami.rotateY((origamiStage.increaseAngle - origamiStage.decreaseAngle) * deltaAngle);
            origamiStage.spotlightHelper.update();

            if (toggleIlluminationCalculation){
                [origamiStage.frontMesh, origamiStage.frontLastMesh] = swap(origamiStage.frontMesh, origamiStage.frontLastMesh);
                [origamiStage.backMesh, origamiStage.backLastMesh] = swap(origamiStage.backMesh, origamiStage.backLastMesh);
                origamiStage.origami.clear();
                origamiStage.origami.add(origamiStage.frontMesh);
                origamiStage.origami.add(origamiStage.backMesh);
            }
            if (toggleShadingMode && illuminationCalculation){
                if (shadingMode){
                    origamiStage.frontMesh.material = lambertTexturedMaterial;
                    origamiStage.backMesh.material = lambertSimpleMaterial;
                } else {
                    origamiStage.frontMesh.material = phongTexturedMaterial;
                    origamiStage.backMesh.material = phongSimpleMaterial;
                }
            }
        }
        
        if (toggleIlluminationCalculation)
            toggleIlluminationCalculation = false;
        
        if (toggleShadingMode)
            toggleShadingMode = false;

        globalLightOn ? globalLight.intensity = 1 : globalLight.intensity = 0;

        //firstStage.material = new THREE.MeshBasicMaterial
        
        if (timeStopped && deltaClock != 0)
            clock.stop();
        if (!timeStopped && deltaClock == 0)
            clock.start();  

        render();

    }
    
    requestAnimationFrame(animate);
}
