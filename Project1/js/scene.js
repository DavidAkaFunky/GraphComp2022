/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh;

var clock;

var decreaseX, decreaseY, decreaseZ, decreaseV1, decreaseV2, decreaseV3;

var increaseX, increaseY, increaseZ, increaseV1, increaseV2, increaseV3;

var usingFrontViewCamera, usingTopViewCamera, usingSideViewCamera;

var wireframe;

var object1, object2, object3;

// This is the only parallelpiped, so no coordinates are needed
function createParallelepiped(){
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
    geometry = new THREE.BoxGeometry(Math.sqrt(72), Math.sqrt(512), Math.sqrt(72));
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(11, 43, 0);
    mesh.rotation.set(0, 0, Math.PI / 4);

    object1.add(mesh);
}

function createCube(){
    material = new THREE.MeshBasicMaterial({ color: 0xFFD400, wireframe: true });
    geometry = new THREE.BoxGeometry(10, 10, 10);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0, 15, 15);
    mesh.rotation.set(0, 0, - Math.PI / 4);

    object1.add(mesh);
}

// This is the only pyramid, so no coordinates are needed
function createPyramid(){
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
    geometry = new THREE.ConeGeometry(Math.sqrt(72), 10, 4);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(22, 27, 0);
    mesh.rotation.set(Math.PI, - Math.PI / 4, 0);

    object1.add(mesh);
}

function createTorus(x, y, z){
    'use strict';

    material = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: true })
    geometry = new THREE.TorusGeometry(4, 1, 16, 16);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI / 2, 0, 0);
    
    object3.add(mesh);
}

function createCone(){
    'use strict';

    material = new THREE.MeshBasicMaterial({color: 0xFF00FF, wireframe: true })
    geometry = new THREE.ConeGeometry(2, 11, 8);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0, 5.5, 0);
    
    object2.add(mesh);
}

class CustomSinCurve extends THREE.Curve {

	constructor( scale = 5 ) {

		super();

		this.scale = scale;

	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = t * 3 - 1.5;
		const ty = t * 5 + Math.sin( 2 * Math.PI * t );
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );

	}

}

function createTube(){
    'use strict';

    const path = new CustomSinCurve();

    material = new THREE.MeshBasicMaterial( { color: 0xFF6600 } );
    geometry = new THREE.TubeGeometry( path, 20, 2, 8, false );
    mesh = new THREE.Mesh( geometry, material );

    mesh.position.set(-10, 20, -20);

    object1.add(mesh);
}

function createSphere(){
    'use strict';

    material = new THREE.MeshBasicMaterial({color: 0x123456, wireframe: true })
    geometry = new THREE.SphereGeometry(5, 16, 16);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(-15, 25, 10);
    
    object1.add(mesh);
}

function createCylinder(x, y, z, ){
    'use strict';

    material = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true })
    geometry = new THREE.CylinderGeometry(1, 1, 8, 8);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    
    object3.add(mesh);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    // scene.background = new THREE.Color( 0xD5B895 );

    scene.add(new THREE.AxisHelper(50));

    object1 = new THREE.Object3D();

    object2 = new THREE.Object3D();
    object2.position.set(22, 11, 0);

    object3 = new THREE.Object3D();

    createParallelepiped();
    createPyramid();
    createTube();
    createCube();
    createSphere();
    createCone();
    for (let i = 0; i < 2; ++i){
        for (let j = 0; j < 2; ++j)
            createTorus(-7 + 14 * i, -10 + 10 * j, 0);
        createCylinder(-11 + 14 * i, -5, 0);
        createCylinder(-7 + 14 * i, -5, -4);
        createCylinder(-7 + 14 * i, -5, 4);
        createCylinder(-3 + 14 * i, -5, 0);
    }

    object2.add(object3);
    object1.add(object2);
    scene.add(object1);
}

function createCamera() {
    camera = new THREE.OrthographicCamera(-window.innerWidth / 20,
                                          window.innerWidth / 20,
                                          window.innerHeight / 20,
                                          -window.innerHeight / 20,
                                          -1000,
                                          1000);
}

function useFrontViewCamera() {
    'use strict';

    camera.position.set(0, 27, 80);
    camera.lookAt(new THREE.Vector3(0, 27, 0));
}

function useTopViewCamera() {
    'use strict';
    
    camera.position.set(22, 80, 0);
    camera.lookAt(new THREE.Vector3(22, 0, 0));
}

function useSideViewCamera() {
    'use strict';

    camera.position.set(0, 27, 0);
    camera.lookAt(new THREE.Vector3(-40, 27, 0));
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

function onKeyDown(e) {
    'use strict';

    // Choose camera (should it be given a flag to update the camera in animate()?)
    if (e.keyCode == 49) {  // 1
        usingFrontViewCamera = true;
        usingTopViewCamera = false;
        usingSideViewCamera = false;
    }
    else if (e.keyCode == 50) {  // 2
        usingFrontViewCamera = false;
        usingTopViewCamera = true;
        usingSideViewCamera = false;
    }
    else if (e.keyCode == 51) {  // 3
        usingFrontViewCamera = false;
        usingTopViewCamera = false;
        usingSideViewCamera = true;
    }

    // Alternate between solid and wireframe material
    if (e.keyCode == 52)  // 4
        wireframe = !wireframe;

    // Control v1 angle (main branch)
    if (e.keyCode == 81 || e.keyCode == 113)  // Q, q
        decreaseV1 = true;

    if (e.keyCode == 87 || e.keyCode == 119)  // W, w
        increaseV1 = true;
        

    // Control v2 angle (secondary branch)
    if (e.keyCode == 65 || e.keyCode == 97)  // A, a
        decreaseV2 = true;

    if (e.keyCode == 83 || e.keyCode == 115)  // S, s
        increaseV2 = true;
    

    // Control v3 angle (tertiary branch)
    if (e.keyCode == 90 || e.keyCode == 122)  // Z, z
        decreaseV3 = true;

    if (e.keyCode == 88 || e.keyCode == 120)  // X, x
        increaseV3 = true;

        
    // Move object along the axis (x, y and z)
    
    if (e.keyCode == 37)  // Arrow left
        decreaseX = true;

    if (e.keyCode == 39)  // Arrow right
        increaseX = true;

    if (e.keyCode == 40)  // Arrow down
        decreaseY = true;

    if (e.keyCode == 38)  // Arrow up
        increaseY = true;

    if (e.keyCode == 68 || e.keyCode == 100)  // D, d
        decreaseZ = true;

    if (e.keyCode == 67 || e.keyCode == 99)  // C, c
        increaseZ = true;

}

function onKeyUp(e) {
    'use strict';

    // Control v1 angle (main branch)
    if (e.keyCode == 81 || e.keyCode == 113)  // Q, q
        decreaseV1 = false;

    if (e.keyCode == 87 || e.keyCode == 119)  // W, w
        increaseV1 = false;
        

    // Control v2 angle (secondary branch)
    if (e.keyCode == 65 || e.keyCode == 97)  // A, a
        decreaseV2 = false;

    if (e.keyCode == 83 || e.keyCode == 115)  // S, s
        increaseV2 = false;
    

    // Control v3 angle (tertiary branch)
    if (e.keyCode == 90 || e.keyCode == 122)  // Z, z
        decreaseV3 = false;

    if (e.keyCode == 88 || e.keyCode == 120)  // X, x
        increaseV3 = false;

        
    // Move object along the axis (x, y and z)
    
    if (e.keyCode == 37)  // Arrow left
        decreaseX = false;

    if (e.keyCode == 39)  // Arrow right
        increaseX = false;

    if (e.keyCode == 40)  // Arrow down
        decreaseY = false;

    if (e.keyCode == 38)  // Arrow up
        increaseY = false;

    if (e.keyCode == 68 || e.keyCode == 100)  // D, d
        decreaseZ = false;

    if (e.keyCode == 67 || e.keyCode == 99)  // C, c
        increaseZ = false;

}

function resetUpdateFlags(){
    'use strict';

    decreaseX = false;  increaseX = false;
    decreaseY = false;  increaseY = false;
    decreaseZ = false;  increaseZ = false;
    decreaseV1 = false; increaseV1 = false;
    decreaseV2 = false; increaseV2 = false;
    decreaseV3 = false; increaseV3 = false;
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
    createCamera();
    usingFrontViewCamera = true;
    wireframe = true;

    clock = new THREE.Clock();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function chooseCameraMode(){
    'use strict';

    if (usingFrontViewCamera)
        useFrontViewCamera();
    else if (usingTopViewCamera)
        useTopViewCamera();
    else if (usingSideViewCamera)
        useSideViewCamera();
}

function animate() {
    'use strict';

    chooseCameraMode();

    const deltaClock = clock.getDelta();
    const deltaR = 100 * deltaClock;
    const deltaV = Math.PI * deltaClock / 2; 

    scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = wireframe;
        }
    });

    // Update object position
    object1.position.x += (increaseX - decreaseX) * deltaR;
    object1.position.y += (increaseY - decreaseY) * deltaR;
    object1.position.z += (increaseZ - decreaseZ) * deltaR;

    // Update rotations based on deltaV
    object1.rotateY((increaseV1 - decreaseV1) * deltaV);
    object2.rotateY((increaseV2 - decreaseV2) * deltaV);
    object3.rotateX((increaseV3 - decreaseV3) * deltaV);

    render();

    requestAnimationFrame(animate);
}