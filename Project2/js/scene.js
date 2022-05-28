/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh;

var clock;

var usingFixedOrthogonalCamera, usingFixedPerspectiveCamera, usingRocketPerspectiveCamera;

var wireframe;

const earthRadius = 50;

const spaceRadius = 1.2 * earthRadius;

var decreaseLat, decreaseLong;

var increaseLat, increaseLong;

var rocketLat, rocketLong; // Should it still move after we leave the key up?

var object1, object2;

function getRandomSize(min, max) {
    'use strict';
    return Math.random() * (max - min + 0.0001) + min + 0.0001;
}

function getRandomAngle() {
    return Math.random() * 2 * Math.PI;
}

function setPosition(meshOrObject, lat, long){
    meshOrObject.position = new THREE.Vector3();
    meshOrObject.position.setFromSpherical(THREE.Spherical(spaceRadius, lat, long));
}

function createSphere() {
    'use strict';

    material = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true })
    geometry = new THREE.SphereGeometry(earthRadius, 16, 16);
    mesh = new THREE.Mesh(geometry, material);
    
    object1.add(mesh);
}

function createCube() {
    'use strict';

    const size = getRandomSize(earthRadius/(24*Math.sqrt(3)), earthRadius/(20*Math.sqrt(3)));
    material = new THREE.MeshBasicMaterial({ color: 'green', wireframe: true });
    geometry = new THREE.BoxGeometry(size, size, size);
    mesh = new THREE.Mesh(geometry, material);

    setPosition(mesh, getRandomAngle(), getRandomAngle());
    object1.add(mesh);
}

function createCone() {
    'use strict';

    const size = getRandomSize(earthRadius/24, earthRadius/20);
    material = new THREE.MeshBasicMaterial({color: 'red', wireframe: true })
    geometry = new THREE.ConeGeometry(size/2, size, 8);
    mesh = new THREE.Mesh(geometry, material);
    
    setPosition(mesh, getRandomAngle(), getRandomAngle());
    object1.add(mesh);
}

function createParallelepiped(length, width, height, x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({color: 'yellow', wireframe: true })
    geometry = new THREE.BoxGeometry(length, width, height);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    object2.add(mesh);

}

function createCapsule() {
    'use strict';
}

function createRocket() {
    'use strict';

    createParallelepiped((3/88) * earthRadius, (3/44) * earthRadius, (3/88) * earthRadius, 0, 0, 0);
    createParallelepiped(earthRadius / 88, earthRadius / 44, earthRadius / 88, 0, earthRadius/22, 0);
    createCapsule();
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    //scene.add(new THREE.AxisHelper(50));
    
    object1 = new THREE.Object3D();
    object2 = new THREE.Object3D();

    for (var i = 0; i < 7; ++i) { // Can the debris be overlapped?
        createCube();
        createCone();
    }

    // Create Earth
    createSphere();

    // Create Rocket
    createRocket();
    rocketLat = getRandomAngle(), rocketLong = getRandomAngle(); // Initial latitute and longitude
    setPosition(object2, rocketLat, rocketLong);

    object1.add(object2);
    scene.add(object1);
}

function useFixedOrthogonalCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(-window.innerWidth / 10,
                                          window.innerWidth / 10,
                                          window.innerHeight / 10,
                                          -window.innerHeight / 10,
                                          -1000,
                                          1000);

    camera.position.set(0, 0, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function useFixedPerspectiveCamera() {
    'use strict';
    
    // TODO
}

function useRocketPerspectiveCamera() {
    'use strict';

    // TODO
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
        usingFixedOrthogonalCamera = true;
        usingFixedPerspectiveCamera = false;
        usingRocketPerspectiveCamera = false;
    }
    else if (e.keyCode == 50) {  // 2
        usingFixedOrthogonalCamera = false;
        usingFixedPerspectiveCamera = true;
        usingRocketPerspectiveCamera = false;
    }
    else if (e.keyCode == 51) {  // 3
        usingFixedOrthogonalCamera = false;
        usingFixedPerspectiveCamera = false;
        usingRocketPerspectiveCamera = true;
    }


    // Alternate between solid and wireframe material

    if (e.keyCode == 52)  // 4
        wireframe = !wireframe;


    // Change object's latitude and longitude

    if (e.keyCode == 37)  // Arrow left
        decreaseLong = true;

    if (e.keyCode == 39)  // Arrow right
        increaseLong = true;

    if (e.keyCode == 40)  // Arrow down
        increaseLat = true;

    if (e.keyCode == 38)  // Arrow up
        decreaseLat = true;
}

function onKeyUp(e) {
    'use strict';

    if (e.keyCode == 37)  // Arrow left
        decreaseLong = false;

    if (e.keyCode == 39)  // Arrow right
        increaseLong = false;

    if (e.keyCode == 40)  // Arrow down
        increaseLat = false;

    if (e.keyCode == 38)  // Arrow up
        decreaseLat = false;
}

function resetUpdateFlags(){
    'use strict';

    decreaseLat = false;   increaseLat = false;
    decreaseLong = false;  increaseLong = false;
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
    useFixedOrthogonalCamera();
    usingFixedOrthogonalCamera = true;
    wireframe = true;

    clock = new THREE.Clock();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function chooseCameraMode(){
    'use strict';

    if (usingFixedOrthogonalCamera)
        useFixedOrthogonalCamera();
    else if (usingFixedPerspectiveCamera)
        useFixedPerspectiveCamera();
    else if (usingRocketPerspectiveCamera)
        useRocketPerspectiveCamera();
}

function animate() {
    'use strict';

    chooseCameraMode();
    
    const deltaClock = clock.getDelta();
    const deltaAngle = Math.PI * deltaClock / 20; 

    scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = wireframe;
        }
    });

    rocketLat = (rocketLat + (increaseLat - decreaseLat) * deltaAngle) % (2 * Math.PI);
    rocketLong = (rocketLong + (increaseLong - decreaseLong) * deltaAngle) % (2 * Math.PI);

    setPosition(object2, rocketLat, rocketLong);

    render();

    requestAnimationFrame(animate);
}