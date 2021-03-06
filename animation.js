import * as utils from './utils'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
// import TextureMerger from '../components/TextureMerger/TextureMerger'
import TextureAtlas from './TextureAtlas'

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

        const textures = [];
            
        for (let [idx, image] of images.entries()) {

            idx;

            // Load texture
            loader.load(image.url, (texture) => {
                
                // Set positions
                texture.x = image.x
                texture.y = image.y

                textures.push(texture);
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
        // const textureMerger = new TextureMerger(textures);

        const textureMerger = new TextureAtlas(textures)
        const meshes = [];


        for (const [idx, texture] of textures.entries()) {


            // Create a material texture from the image
            const material = new THREE.MeshBasicMaterial( {
                // map: texture,
                // transparent: texture
            } );        // Set image dimensions
    
            const geometry = new THREE.PlaneBufferGeometry(1, 1);
    
            // Create a mesh object for the image
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(utils.scale(texture.x), utils.scale(texture.y), 0);
            mesh.material.map = textureMerger.mergedTexture;
            mesh.material.depthTest = false;
            mesh.renderOrder = idx;

            // const range = textureMerger.ranges[idx.toString()]
            const range = textureMerger.ranges.get(texture) // TODO: Should be image or the like. Refactor above
            updateMeshUV(mesh, range)
    
            meshes.push(mesh);
        }

        return meshes

    });

}


export function merged(images) {

    return load(images).then(textures => {
        // const textureMerger = new TextureMerger(textures);

        const textureMerger = new TextureAtlas(textures)

        const material = new THREE.MeshBasicMaterial( {
            map: textureMerger.mergedTexture,
            // transparent: texture
        } );        // Set image dimensions

        const geometry = new THREE.PlaneBufferGeometry(1, 1);

        // Create a mesh object for the image
        const mesh = new THREE.Mesh(geometry, material);

        console.log(textureMerger.mergedTexture)

        return [mesh]

    });

}