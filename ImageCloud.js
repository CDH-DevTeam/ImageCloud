import * as animation from './animation.js';

class ImageCloud {

    constructor( 
        images,
        fieldOfView = 75,
        nearPlane = 0.1,    // Closest rendering distance
        farPlane = 10000,  // Farthest rendering distance
        lightPosition = [1, 1, 100],
        lightColor = 0xffffff,
        lightIntensity = 0.7,
        lightDistance = 0,
        zPosition = 50) {

        this.images     = images;

        const aspectRatio = window.innerWidth/window.innerHeight;

        this.scene      = animation.scene();
        this.camera     = animation.camera(fieldOfView, aspectRatio, nearPlane, farPlane, zPosition);
        this.light      = animation.light(lightColor, lightIntensity, lightDistance, lightPosition);
        this.renderer   = animation.renderer(window.devicePixelRatio, window.innerWidth, window.innerHeight);
        this.raycaster  = animation.raycaster();

        this.mouseX = 0;
        this.mouseY = 0;
        this.loading_progress = 0;
        this.initialized = false; 
    }


    clear() {

        this.scene.children.forEach(child => {
            if (child.geometry) {

                // Remove textures
                child.geometry.dispose();
                child.material.dispose();
      
                // Remove mesh object
                this.scene.remove(child);
      
              }
        });

    }

    build() {

        this.loading_progress = 0;
        this.initialized = false;

        // Add controls
        this.controls   = animation.controls(this.camera, this.renderer);
        this.mouse      = animation.mouse();

        // Make sure the image cloud is empty
        if (!ImageCloud.isClear(this)) {
            this.clear();
        }

        // Add images as meshes
        animation.meshes(this.images).then((meshes) => {
            
            meshes.forEach((mesh) => {
                this.scene.add(mesh)
            })

        })

        // Add some light
        this.scene.add(this.light)

        // Update the controls
        this.controls.update();

        this.initialized = true;

        return this;
    }

    render () {
        requestAnimationFrame(this.render.bind(this));

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Render the scene
        this.renderer.render(this.scene, this.camera);

        // Update the controls
        this.controls.update();

    }

    static isClear (imageCloud) {
        return imageCloud.scene.children.length === 0;
    }
    
}

export default ImageCloud