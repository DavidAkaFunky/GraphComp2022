/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh;

var clock;

var usingFixedOrthogonalCamera, usingFixedPerspectiveCamera, usingRocketPerspectiveCamera;

const earthRadius = 50;

const spaceRadius = 1.2 * earthRadius;

const rocketLength = earthRadius / 11;

var decreaseLat, decreaseLong;

var increaseLat, increaseLong;

var rocketLat, rocketLong;

var crosshairLat, crosshairLong;

var quadrants;

var collisionDetected;

var rocket;

var crosshair;

function getRandomSize(min, max) {
    'use strict';
    return Math.random() * (max - min + 0.0001) + min + 0.0001;
}

function getRandomAngle() {
    return Math.random() * 2 * Math.PI;
}

function convertFromSpherical(radius, lat, long) {
    const n = Math.sin(lat) * radius;
    return new THREE.Vector3(n * Math.sin(long), Math.cos(lat)* radius, n * Math.cos(long));
}

function setPosition(meshOrObject, lat, long){
    meshOrObject.position.copy(convertFromSpherical(spaceRadius, lat, long));
}

function findQuadrant(lat, long) {
    if (0 <= lat && lat < Math.PI / 2){
        if (0 <= long && long < Math.PI)
            return 0;
        else if (Math.PI <= long && long <= 2 * Math.PI)
            return 1;
    }
    else if (Math.PI / 2 <= lat && lat <= Math.PI){
        if (0 <= long && long < Math.PI)
            return 2;
        else if (Math.PI <= long && long <= 2 * Math.PI)
            return 3;
    }
}

function addToQuadrant(lat, long, radius, object) {
    quadrants[findQuadrant(lat, long)].push([convertFromSpherical(spaceRadius, lat, long), radius, false, object]);
}

function isOverlapping(lat, long, radius) {
    'use strict';

    for (var quadrant = 0; quadrant < quadrants.length; ++quadrant) {
        var vectorEuclidian = convertFromSpherical(spaceRadius, lat, long);
        for (var i = 0; i < quadrants[quadrant].length; ++i){
            const dist = vectorEuclidian.distanceTo(quadrants[quadrant][i][0]);
            const radiiSum = radius + quadrants[quadrant][i][1];
            if (dist <= radiiSum)
                return true;
        }
    }
    return false;
}

// Assuming there is only one collision
function detectCollision(deltaLat, deltaLong) {
    var quadrant = findQuadrant(rocketLat, rocketLong);
    var vectorEuclidian = convertFromSpherical(spaceRadius, rocketLat + deltaLat, rocketLong + deltaLong);
    for (var i = 0; i < quadrants[quadrant].length; ++i){
        const dist = vectorEuclidian.distanceTo(quadrants[quadrant][i][0]);
        const radiiSum = rocketLength/2 + quadrants[quadrant][i][1];
        if (dist <= radiiSum){
            collisionDetected = true;
            quadrants[quadrant][i][2] = true;
            return vectorEuclidian.multiplyScalar(1 - quadrants[quadrant][i][1] / dist);
        }
    }
    return vectorEuclidian;
}

function removeDebris() {
    var quadrant = findQuadrant(rocketLat, rocketLong);
    for (var i = 0; i < quadrants[quadrant].length; i++) {
        if (quadrants[quadrant][i][2]){
            scene.remove(quadrants[quadrant][i][3]);
            quadrants[quadrant].splice(i, 1);
        }
    }
}

function createEarth() {
    'use strict';

    const texture = new THREE.TextureLoader().load('https://static.wikia.nocookie.net/planet-texture-maps/images/a/aa/Earth_Texture_Full.png/revision/latest?cb=20190401163425');

    material = new THREE.MeshBasicMaterial({map: texture});
    geometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    mesh = new THREE.Mesh(geometry, material);
    
    var object = new THREE.Object3D();
    object.add(mesh);
    scene.add(object);
}

function createCube() {
    'use strict';

    const size = (2 / Math.sqrt(3)) * getRandomSize(earthRadius/24, earthRadius/20);
    material = new THREE.MeshBasicMaterial({color: 'green'});
    geometry = new THREE.BoxGeometry(size, size, size);
    mesh = new THREE.Mesh(geometry, material);

    var lat, long;
    do {
        lat = getRandomAngle() / 2;
        long = getRandomAngle();
        setPosition(mesh, lat, long);
    } while (isOverlapping(lat, long, size));

    var object = new THREE.Object3D();
    object.add(mesh);
    scene.add(object);

    addToQuadrant(lat, long, size*Math.sqrt(3), object);
}

function createCone(color, segments = 16) {

    const size = (3 / Math.sqrt(5)) * getRandomSize(earthRadius/24, earthRadius/20);
    material = new THREE.MeshBasicMaterial({color: color})
    geometry = new THREE.ConeGeometry(size/2, size, segments);
    mesh = new THREE.Mesh(geometry, material);
    
    var lat, long;
    do {
        lat = getRandomAngle() / 2;
        long = getRandomAngle();
        setPosition(mesh, lat, long);
    } while (isOverlapping(lat, long, size));

    var object = new THREE.Object3D();
    object.add(mesh);
    scene.add(object);

    addToQuadrant(lat, long, size, object);
}

function createPyramid(){
    createCone('orange', segments = 4);
}

function createCylinder(radius, height, x, y, z, color){
    'use strict';

    material = new THREE.MeshBasicMaterial({color: color})
    geometry = new THREE.CylinderGeometry(radius, radius, height, 16);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    
    rocket.add(mesh);
}

function createCapsule(radius, length, x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({color: 'red'})
    geometry = new THREE.CapsuleGeometry(radius, length, 10, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    rocket.add(mesh);
}

function createRocket() {
    'use strict';

    rocket = new THREE.Object3D();

    createCylinder(rocketLength / 4, (3/4) * rocketLength, 0, - rocketLength / 8, 0, 'yellow');
    createCylinder(rocketLength / 8, rocketLength / 4, 0, (3/8) * rocketLength, 0, 'red');
    createCapsule(rocketLength / 8, (1/4) * rocketLength, - (3/8) * rocketLength, - rocketLength / 4, 0);
    createCapsule(rocketLength / 8, (1/4) * rocketLength, (3/8) * rocketLength, - rocketLength / 4, 0);
    createCapsule(rocketLength / 8, (1/4) * rocketLength, 0, - rocketLength / 4, - (3/8) * rocketLength);
    createCapsule(rocketLength / 8, (1/4) * rocketLength, 0, - rocketLength / 4, (3/8) * rocketLength);

    // Initial latitute and longitude
    do {
        rocketLat = getRandomAngle() / 2;
        rocketLong = getRandomAngle();
        setPosition(rocket, rocketLat, rocketLong);
    } while (isOverlapping(rocketLat, rocketLong, rocketLength / 2));

    scene.add(rocket);
}

function createCrosshair() {
    'use strict';

    crosshair = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({color: 'purple'});
    geometry = new THREE.BoxGeometry(2, 2, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, (3/8) * rocketLength, 0);

    setPosition(crosshair, rocketLat, rocketLong);

    crosshair.add(mesh);

    scene.add(crosshair);
}

function createEnvironment() {
    'use strict';

    scene = new THREE.Scene();

    for (var i = 0; i < 7; ++i) { // The debris cannot be overlapped
        createCube();
        createCone('red');
        createPyramid();
    }

    // Create Earth
    createEarth();

    // Create Rocket
    createRocket();

    // Create Crosshair
    createCrosshair();

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
    camera = new THREE.PerspectiveCamera(60,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.set(0, 0, 125);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function useRocketPerspectiveCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(60,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);

    camera.position.copy(convertFromSpherical(spaceRadius + 40, rocketLat, rocketLong));
    camera.lookAt(new THREE.Vector3(0, 0, 0));
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
    collisionDetected = false;
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

    quadrants = [[], [], [], []];
    createEnvironment();
    resetUpdateFlags();
    usingFixedOrthogonalCamera = true;

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
    const deltaAngle = Math.PI * deltaClock / 10; 

    const deltaRocketLat = (increaseLat - decreaseLat);
    const deltaRocketLong = (increaseLong - decreaseLong);
    const norm = Math.sqrt(deltaRocketLat ** 2 + deltaRocketLong ** 2); 

    if (norm > 0) {
        rocketLat = (rocketLat + deltaRocketLat * deltaAngle / norm);
        rocketLong = (rocketLong + deltaRocketLong * deltaAngle / norm) % (2 * Math.PI);

        crosshairLat = rocketLat + (deltaRocketLat * deltaAngle / norm) * 50;
        crosshairLong = rocketLong + ((deltaRocketLong * deltaAngle / norm)) * 50 % (2 * Math.PI); 

        if (rocketLat < 0){
            rocketLat = 0;
            crosshairLat = 0;
        }
        
        else if (rocketLat > Math.PI){
            rocketLat = Math.PI;
            crosshairLat = Math.PI;
        }
        if (rocketLong < 0){
            rocketLong = 2 * Math.PI;
            crosshairLong = 2 * Math.PI;
        }
    }

    setPosition(rocket, rocketLat, rocketLong);
    console.log(crosshairLat, crosshairLong);
    setPosition(crosshair, crosshairLat, crosshairLong);

    if (norm > 0){
        rocket.position.copy(detectCollision(deltaRocketLat * deltaAngle / norm, deltaRocketLong * deltaAngle / norm));
        crosshair.position.copy(detectCollision(deltaRocketLat * deltaAngle / norm, deltaRocketLong * deltaAngle / norm));
    }
    if (collisionDetected)
        removeDebris();

    collisionDetected = false;

    render();

    requestAnimationFrame(animate);
}