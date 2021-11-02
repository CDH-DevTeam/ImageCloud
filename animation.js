import * as utils from './utils'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import TextureMerger from '../components/TextureMerger/TextureMerger'

window.THREE = THREE;

export function scene () {
    const scene = new THREE.Scene();

    return scene
}


export function camera(fieldOfView, aspectRatio, nearPlane, farPlane, zPosition) {

    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
    // camera.position.z = 20500;
    // camera.position.y = -100;
    camera.position.z = zPosition;

    return camera
}

export function renderer(pixelRatio, width, height, antialias=true, alpha=true) {

    const renderer = new THREE.WebGLRenderer({
        antialias: antialias,
        alpha: alpha
    })

    renderer.setPixelRatio(pixelRatio);

    renderer.setSize(width, height)

    return renderer

}

export function light(color, intensity, distance, position) {

    const light = new THREE.PointLight(color, intensity, distance)
    light.position.set(...position)

    return light

}

export function raycaster() {

    const raycaster = new THREE.Raycaster();

    return raycaster
}

export function controls(camera, renderer) {
    
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;

    controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    controls.mouseButtons.MIDDLE = THREE.MOUSE.ZOOM;
    controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

    return controls
}

export function mouse() {
    const mouse = new THREE.Vector2();

    return mouse

}

export function load(images) {

    
    return new Promise((resolve, reject)=>{
        reject;
        const manager = new THREE.LoadingManager(()=>resolve(textures));

        manager.onProgress = function ( url, itemsLoaded ) {
            console.log(url + ', ' + (itemsLoaded / images.length * 100) + '%');
        };

        const loader = new THREE.TextureLoader(manager);

        const textures = {};
            
        for (const [idx, image] of images.entries()) {

            // Load texture
            loader.load(image.url, (texture) => {
                textures[idx.toString()] = texture;
            })
        }
        
        return textures;
    });
    
}


function updateMeshUV(mesh, range){

    var uv = mesh.geometry.attributes.uv.array;
    for (var i = 0; i < uv.length; i += 2){
        uv[i] = (uv[i] * (range.endU - range.startU) + range.startU);
        uv[i + 1] = (uv[i + 1] * (range.startV - range.endV) + range.endV);
    }

    mesh.geometry.attributes.uv.needsUpdate = true;
  }

export function meshes(images) {

    return load(images).then(textures => {
        const textureMerger = new TextureMerger(textures);
        const meshes = [];

        for (const [idx, image] of images.entries()) {


            // Create a material texture from the image
            const material = new THREE.MeshBasicMaterial( {
                // map: texture,
                // transparent: texture
            } );        // Set image dimensions
    
            const geometry = new THREE.PlaneBufferGeometry(1, 1);
    
            // Create a mesh object for the image
            const mesh = new THREE.Mesh(geometry, material);
    
            mesh.position.set(utils.scale(image.x), utils.scale(image.y), 0);
            mesh.material.map = textureMerger.mergedTexture;
            mesh.material.depthTest = false;
            mesh.renderOrder = idx;

            updateMeshUV(mesh, textureMerger.ranges[idx.toString()])
    
            meshes.push(mesh);
        }

        return meshes

    });

}