/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh, vertices, uvVertices;

var clock;

var text;

var podium;

var globalLight, globalLightOn;

var basicSimpleMaterial, basicTexturedMaterial, basicPodiumMaterial;

var lambertSimpleMaterial, lambertTexturedMaterial, lambertPodiumMaterial;

var phongSimpleMaterial, phongTexturedMaterial, phongPodiumMaterial;

var podiumCurrentMaterial, podiumLastMaterial;

var shadingMode, changedShadingMode;

var illuminationCalculation, changedIlluminationCalculation;

var perpsectiveCamera, orthographicCamera, VRPerspectiveCamera;

var usingPerspectiveCamera, usingOrthographicCamera, usingVRPerspectiveCamera, changedCamera;

var timeStopped, reset;

var origamiStages = [];

const sheetDiagonal = 21 * Math.SQRT2;

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
    createText();
}

function createPodium(){
    podium = new THREE.Object3D();
    createParallelepiped(podiumWidth, podiumHeight, podiumDepth, 0, 0, 0);
    createParallelepiped(podiumWidth, podiumHeight / 3, 10, 0, 0, podiumDepth / 2 + 5);
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
    
    material = new THREE.MeshPhongMaterial({color: '#6988a3'});
    material.needsUpdate = true;
    geometry = new THREE.ConeGeometry(5, 10, 32);
    mesh = new THREE.Mesh(geometry, material);

    lamp.add(mesh);

    material = new THREE.MeshBasicMaterial({color: '#efdfbb'});
    geometry = new THREE.SphereGeometry(2, 8, 8);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0, - 5, 0);
    
    lamp.add(mesh);

    lamp.position.set(x, y, z);
    lamp.rotateX(rotX);
    scene.add(lamp);
}

function createPolygon(isTextured, material){
    'use strict';

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    if (isTextured)
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvVertices, 2));
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

function createOrigamiStage(frontMesh, backMesh, x, y, z){
    'use strict';
    const spotlight = createSpotlight(x, 2*y, 10);
    const spotlightHelper = new THREE.SpotLightHelper(spotlight);
    const origamiStage = new OrigamiStage(spotlight, spotlightHelper, frontMesh, backMesh);
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

    uvVertices = new Float32Array([0, 0,
                                   0, 1,
                                   1, 0,
                                    
                                   1, 0,
                                   1, 1,
                                   0, 0]);
    
    const frontMesh = createPolygon(true, lambertTexturedMaterial);

    vertices = new Float32Array([0, - sheetDiagonal / 2, -1,
                                 - sheetDiagonal / 2, 0, 1,
                                 0, sheetDiagonal / 2, -1,
                                 
                                 0, sheetDiagonal / 2, -1,
                                 sheetDiagonal / 2, 0, 1,
                                 0, - sheetDiagonal / 2, -1]);

    const backMesh = createPolygon(false, lambertSimpleMaterial);

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
    
    uvVertices = new Float32Array([   1,    0,
                                    0.4, 0.85,
                                    0.2,  0.8,   

                                      1,    0,
                                    0.2,  0.8,
                                   0.15,  0.6,
                                    
                                      1,    0,
                                   0.25,    1,
                                      0,    1,   
 
                                      1,    0,
                                      0,    1,
                                      0, 0.75,   
 
                                    0.2,  0.8,
                                    0.4, 0.85,
                                      1,    0,   
 
                                    0.15, 0.6,
                                     0.2, 0.8,
                                       1,   0]);

    const frontMesh = createPolygon(true, lambertTexturedMaterial);

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

    const backMesh = createPolygon(false, lambertSimpleMaterial);

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
  
                                  // R and Q omitted as they seem to be hidden 
                                  ]);

    uvVertices = new Float32Array([
                                    // Face A1
                                    0.170,    0.396,
                                    0.391, 0.730,
                                    0.730,  0.732,   

                                    // Face A2
                                    0.170,  0.396,
                                    0.730,  0.732,
                                    0.243,  0.242,
                                    
                                    // Face B1
                                    0.243,  0.242,
                                    0.730,  0.732,
                                    0.397,  0.170, 

                                    // Face B2
                                    0.730,  0.732,
                                    0.397,  0.170,
                                    0.730,  0.393,
 
                                    // Face C1
                                        0,  0.398,
                                    0.170,  0.396,
                                    0.147,  0.727,   
 
                                    // Face C2
                                    0.170,  0.396,
                                    0.147,  0.727, 
                                    0.280,  0.569,

                                    // Face D1
                                    0.397,  0.170,
                                    0.729,  0.149, 
                                        0,  0.400,

                                    // Face D2
                                    0.397,  0.170,
                                    0.729,  0.149, 
                                    0.570,  0.281,

                                    // Face E1
                                    0.570,  0.281,
                                    0.730,  0.393, 
                                    0.729,  0.149,

                                    // Face E2
                                    0.397,  0.170,
                                    0.729,  0.149, 
                                        0,  0.400,

                                    // Face E3
                                    0.397,  0.170,
                                    0.729,  0.149, 
                                    0.570,  0.281,

                                    // Face F1
                                    0.147,  0.727,
                                    0.391,  0.730,
                                    0.280,  0.569,

                                    // Face F2
                                    0,  0.398,
                                    0.170,  0.396,
                                    0.147,  0.727,   

                                    // Face F3
                                    0.170,  0.396,
                                    0.147,  0.727, 
                                    0.280,  0.569,

                                    // Face G
                                    0.639,  0.866,
                                    0.637,  0.987, 
                                    0.797,  1.000,

                                    // Face I
                                    0.639,  0.866,
                                    0.637,  0.746,
                                    0.757,  0.732,

                                    // Face J
                                    0.639,  0.866,
                                    0.637,  0.987, 
                                    0.797,  1.000,

                                    // Face H
                                    0.639,  0.866,
                                    0.637,  0.746,
                                    0.757,  0.732,

                                    // Face K1
                                    0.168, 0.866,
                                    0.186, 0.920,
                                    0.639, 0.866,

                                    // Face K2
                                    0.186, 0.920,
                                    0.639, 0.866,
                                    0.637, 0.987,

                                    // Face L1
                                    0.168, 0.866,
                                    0.186, 0.812,
                                    0.639, 0.866,

                                    // Face L2
                                    0.186, 0.812,
                                    0.639, 0.866,
                                    0.637, 0.746,

                                    // Face M1
                                    0.168, 0.866,
                                    0.186, 0.920,
                                    0.639, 0.866,

                                    // Face M2
                                    0.186, 0.920,
                                    0.639, 0.866,
                                    0.637, 0.987,

                                    // Face N1
                                    0.168, 0.866,
                                    0.186, 0.812,
                                    0.639, 0.866,

                                    // Face N2
                                    0.186, 0.812,
                                    0.639, 0.866,
                                    0.637, 0.746,

                                    // Face O
                                        0, 0.866,
                                    0.168, 0.866,
                                    0.186, 0.920,

                                    // Face P
                                        0, 0.866,
                                    0.168, 0.866,
                                    0.186, 0.812,

                        ]);
    
    const frontMesh = createPolygon(true, lambertTexturedMaterial);

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

    const backMesh = createPolygon(false, lambertSimpleMaterial);

    createOrigamiStage(frontMesh, backMesh, podiumWidth / 3, (podiumHeight + sheetDiagonal) / 2, 0);
}

function createSpotlight(x, y, z){
    'use strict';

    const spotlight = new THREE.SpotLight("white", 20, 60, Math.PI / 6, 0.5, 0);
    spotlight.position.set(x, y, z);
    spotlight.castShadow = true;
    
    scene.add(spotlight);
    scene.add(spotlight.target);

    return spotlight;
}

function createGlobalLight(){
    'use strict';

    globalLight = new THREE.DirectionalLight("white", 0.5);

    globalLight.position.set(40, 80, 40);
    globalLight.castShadow = true;

    const spotter = new THREE.DirectionalLightHelper(globalLight, 10);
    scene.add(spotter);
    scene.add(globalLight);
}

function createText(){
    const texture = new THREE.TextureLoader().load('textures/text.png');
    const material = new THREE.MeshBasicMaterial({map: texture});
    text = new THREE.Mesh(new THREE.PlaneGeometry(100, 40), material);
    text.position.set(0, 20, 80);
    text.material.transparent = true;
    text.material.needsUpdate = true;
    text.material.opacity = 0;
    scene.add(text);
}

function createMaterials(){
    'use strict';

    const origamiTexture = new THREE.TextureLoader().load('textures/origami-texture.jpg');
    const podiumTexture = new THREE.TextureLoader().load('textures/wood2.jpg');
    
    basicSimpleMaterial = new THREE.MeshBasicMaterial({color: "#eeeeee"});
    basicSimpleMaterial.needsUpdate = true;

    lambertSimpleMaterial = new THREE.MeshLambertMaterial({color: "#eeeeee"});
    lambertSimpleMaterial.needsUpdate = true;

    phongSimpleMaterial = new THREE.MeshPhongMaterial({color: "#eeeeee"});
    phongSimpleMaterial.needsUpdate = true;

    basicTexturedMaterial = new THREE.MeshBasicMaterial({map: origamiTexture});
    basicTexturedMaterial.needsUpdate = true;

    lambertTexturedMaterial = new THREE.MeshLambertMaterial({map: origamiTexture});
    lambertTexturedMaterial.needsUpdate = true;
    
    phongTexturedMaterial = new THREE.MeshPhongMaterial({map: origamiTexture});
    phongTexturedMaterial.needsUpdate = true;

    basicPodiumMaterial = new THREE.MeshBasicMaterial({map: podiumTexture});
    basicPodiumMaterial.needsUpdate = true;

    lambertPodiumMaterial = new THREE.MeshLambertMaterial({map: podiumTexture});
    lambertPodiumMaterial.needsUpdate = true;

    phongPodiumMaterial = new THREE.MeshPhongMaterial({map: podiumTexture});
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
    VRPerspectiveCamera = new THREE.StereoCamera();
    VRPerspectiveCamera.update(perpsectiveCamera);
}

function createOrthographicCamera() {
    'use strict';
    orthographicCamera = new THREE.OrthographicCamera(- 65 * window.innerWidth / window.innerHeight,
                                                      65 * window.innerWidth / window.innerHeight,
                                                      65,
                                                      - 65,
                                                      - 1000,
                                                      1000);
        
    orthographicCamera.position.set(0, 40, 60);
    orthographicCamera.lookAt(new THREE.Vector3(0, 20, 0));
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
    if (e.keyCode == 49 && !usingVRPerspectiveCamera) {                    // 1
        changedCamera = true;
        usingPerspectiveCamera = true;
        usingOrthographicCamera = false;
        usingVRPerspectiveCamera = false;
    }
    else if (e.keyCode == 50 && !usingVRPerspectiveCamera) {               // 2
        changedCamera = true;
        usingPerspectiveCamera = false;
        usingOrthographicCamera = true;
        usingVRPerspectiveCamera = false;
    }

    // Reset scene
    if (e.keyCode == 51 && timeStopped)                      // 3
        reset = true;

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
    if (e.keyCode == 65 || e.keyCode == 97){  // A, a
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
        timeStopped = !timeStopped;

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
    reset = false;
    changedCamera = true;
    usingPerspectiveCamera = true;
    usingOrthographicCamera = false;
    usingVRPerspectiveCamera = false;
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
    createVRPerspectiveCamera();
    createOrthographicCamera();
    initVR();

    clock = new THREE.Clock();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function resetScene(){
    'use strict';
    //Reset scene
    scene.clear();
    origamiStages = [];
    createScene();
    resetUpdateFlags();
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

function animate() {
    'use strict';

    const deltaClock = clock.getDelta();

    const deltaAngle = Math.PI * deltaClock / 2; 

    if (reset)
        resetScene();

    else{
        if (changedCamera){
            chooseCameraMode();
            changedCamera = false;
        }
    
        for (let i = 0; i < origamiStages.length; i++) {
            const origamiStage = origamiStages[i];
            origamiStage.spotlightOn ? origamiStage.spotlight.intensity = 1 : origamiStage.spotlight.intensity = 0;
            origamiStage.spotlightHelper.update();
    
            if (!timeStopped)
                origamiStage.origami.rotateY((origamiStage.increaseAngle - origamiStage.decreaseAngle) * deltaAngle);
    
            if (changedIlluminationCalculation){
                [origamiStage.frontMesh, origamiStage.frontLastMesh] = [origamiStage.frontLastMesh, origamiStage.frontMesh];
                [origamiStage.backMesh, origamiStage.backLastMesh] = [origamiStage.backLastMesh, origamiStage.backMesh];
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
            [podiumCurrentMaterial, podiumLastMaterial] = [podiumLastMaterial, podiumCurrentMaterial];
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
        
        if (timeStopped && deltaClock != 0){
            clock.stop();
            text.material.opacity = 1;
        }
            
        if (!timeStopped && deltaClock == 0){
            clock.start();
            text.material.opacity = 0;
        }
    }
      
    render();

    if (usingVRPerspectiveCamera)
        renderer.setAnimationLoop(animate);
    else
        requestAnimationFrame(animate);
}
