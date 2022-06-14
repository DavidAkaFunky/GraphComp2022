/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh, vertices;

var clock;

var firstStage, secondStage, thirdStage, podium;

var increaseAngleFirstStage, decreaseAngleFirstStage, increaseAngleSecondStage, decreaseAngleSecondStage, increaseAngleThirdStage, decreaseAngleThirdStage;

var firstSpotlight, secondSpotlight, thirdSpotlight, globalLight;

var firstSpotlightOn, secondSpotlightOn, thirdSpotlightOn, globalLightOn;

var lambertSimpleMaterial, lambertTexturedMaterial, phongSimpleMaterial, phongTexturedMaterial;

var shadingMode, illuminationCalculation;

var perpsectiveCamera, orthographicCamera;

var usingPerspectiveCamera, usingOrthographicCamera, changedCamera;

var firstSpotlightHelper, secondSpotlightHelper, thirdSpotlightHelper;

var timeStopped;

const sheetDiagonal = 21*Math.SQRT2;

const podiumWidth = 150, podiumHeight = 30, podiumDepth = 100;

class OrigamiStage{
    constructor(spotlight, spotlightOn, spotlightHelper, frontMesh, backMesh){
        this.origami = new THREE.Object3D();
        this.origami.add(frontMesh);
        this.origami.add(backMesh);
        this.spotlight;
        this.spotlightOn;
        this.spotlightHelper;
        this.frontMesh;
        this.frontRegularMesh = this.frontMesh;
        this.backMesh;
        this.backRegularMesh = this.backMesh;
    }
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(50));

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

function createPolygon(object, vertices, material){
    'use strict';

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);

    object.add(mesh);
}

function createLamp(x, y, z){
    'use strict';
    
	//Lamps are being created locally, perhaps they should be global?
    material = new THREE.MeshBasicMaterial({color: 'cyan'})
    geometry = new THREE.ConeGeometry(5, 10, 14); //radius, height
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);

    mesh.rotateX( Math.PI/10)
    
    scene.add(mesh);

    material = new THREE.MeshBasicMaterial({color: 'cyan'});
    geometry = new THREE.SphereGeometry(2, 64, 64);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y - 5, z);
    
    scene.add(mesh);
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
    createPolygon(firstStage, vertices, material);

    vertices = new Float32Array([0, - sheetDiagonal / 2, -1,
                                 - sheetDiagonal / 2, 0, 1,
                                 0, sheetDiagonal / 2, -1,
                                 
                                 0, sheetDiagonal / 2, -1,
                                 sheetDiagonal / 2, 0, 1,
                                 0, - sheetDiagonal / 2, -1]);

    material = new THREE.MeshLambertMaterial({color: "blue"});
    createPolygon(firstStage, vertices, material);

    firstStage.position.set(- podiumWidth / 3, (podiumHeight + sheetDiagonal) / 2, 0);
    [firstSpotlight, firstSpotlightHelper] = createSpotlight(firstSpotlight, firstStage, firstSpotlightHelper, - podiumWidth / 3, podiumHeight + sheetDiagonal, 10);
	createLamp(- podiumWidth / 3, podiumHeight + sheetDiagonal, 10);
    scene.add(firstStage);
}

function createSecondStage(){
    'use strict';

    secondStage = new THREE.Object3D();

    /**/

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
    
    material = new THREE.MeshLambertMaterial({color: "red"});
    createPolygon(secondStage, vertices, material);

    /**/
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

    material = new THREE.MeshLambertMaterial({color: "blue"});
    createPolygon(secondStage, vertices, material);

    secondStage.position.set(0, (podiumHeight + sheetDiagonal) / 2, 0);
    [secondSpotlight, secondSpotlightHelper] = createSpotlight(secondSpotlight, secondStage, secondSpotlightHelper, 0, podiumHeight + sheetDiagonal, 10);
	createLamp(0, podiumHeight + sheetDiagonal, 10);
    scene.add(secondStage);
}

function createThirdStage(){

    thirdStage = new THREE.Object3D();

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
    
    material = new THREE.MeshLambertMaterial({color: "red"});
    createPolygon(thirdStage, vertices, material);

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

    material = new THREE.MeshLambertMaterial({color: "blue"});
    createPolygon(thirdStage, vertices, material);

    thirdStage.position.set(podiumWidth / 3, (podiumHeight + sheetDiagonal) / 2, 0);
    [thirdSpotlight, thirdSpotlightHelper] = createSpotlight(thirdSpotlight, thirdStage, thirdSpotlightHelper, podiumWidth / 3, podiumHeight + sheetDiagonal, 10);
	createLamp(podiumWidth / 3, podiumHeight + sheetDiagonal, 10);
    scene.add(thirdStage);
}

function createSpotlight(spotlight, object, spotlightHelper, x, y, z){
    'use strict';
    spotlight = new THREE.SpotLight(new THREE.Color("white"), 20, 0, Math.PI / 6, 1, 0);
    spotlight.position.set(x, y, z);
    spotlight.castShadow = true;

    spotlight.target = object; //why the fuck is this not working
 
    scene.add(spotlight);
    scene.add(spotlight.target);

    spotlightHelper = new THREE.SpotLightHelper(spotlight);
    scene.add(spotlightHelper);

    return [spotlight, spotlightHelper];
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
    const texture = new THREE.TextureLoader().load('https://static.wikia.nocookie.net/planet-texture-maps/images/a/aa/Earth_Texture_Full.png/revision/latest?cb=20190401163425');
    lambertSimpleMaterial = new THREE.MeshLambertMaterial({color: 0xee0000});
    lambertTexturedMaterial = new THREE.MeshLambertMaterial({map: texture});
    phongSimpleMaterial = new THREE.MeshPhongMaterial({color: 0xee0000});
    phongTexturedMaterial = new THREE.MeshPhongMaterial({map: texture});
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

    if (e.keyCode == 70 || e.keyCode == 102)  // F, f
        timeStopped = !timeStopped; // What button should we use?
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
    timeStopped = false;
    changedCamera = true;
    usingPerspectiveCamera = true;
    shadingMode = true;
    illuminationCalculation = true;
    firstSpotlightOn = true;
    secondSpotlightOn = true;
    thirdSpotlightOn = true;
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

function checkToggles(clockDelta){
    globalLightOn ? globalLight.intensity = 1 : globalLight.intensity = 0;

    firstSpotlightOn ? firstSpotlight.intensity = 1 : firstSpotlight.intensity = 0;

    secondSpotlightOn ? secondSpotlight.intensity = 1 : secondSpotlight.intensity = 0;

    thirdSpotlightOn ? thirdSpotlight.intensity = 1 : thirdSpotlight.intensity = 0;

    if (!illuminationCalculation)
        //firstStage.material = new THREE.MeshBasicMaterial
        
    if (timeStopped && clockDelta != 0)
        clock.stop();
    if (!timeStopped && clockDelta == 0)
        clock.start();      
}

function animate() {
    'use strict';

    if (!timeStopped){
        const deltaClock = clock.getDelta();
        const deltaAngle = Math.PI * deltaClock / 2; 

        if (changedCamera){
            chooseCameraMode();
            changedCamera = false;
        }

        firstStage.rotateY((increaseAngleFirstStage - decreaseAngleFirstStage) * deltaAngle);
        secondStage.rotateY((increaseAngleSecondStage - decreaseAngleSecondStage) * deltaAngle);
        thirdStage.rotateY((increaseAngleThirdStage - decreaseAngleThirdStage) * deltaAngle);

        render();

        checkToggles();

        firstSpotlightHelper.update();
        secondSpotlightHelper.update();
        thirdSpotlightHelper.update();

    }
    
    requestAnimationFrame(animate);
}
