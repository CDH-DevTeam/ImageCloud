import * as THREE from 'three';
import TexturePacker from './TexturePacker'

export default class TextureAtlas {

    constructor(textures, max_texture_size=8192) {

        this.textures = textures;
        this.max_texture_size = max_texture_size;
        this.packer = new TexturePacker()

        // Computed members
        // this.urls = this.collectURLs(textures);
        this.ranges = new WeakMap();
        this.canvas = document.createElement('canvas')

        // Build the textures
        this.build()
        this.draw()
        
    }

    build() {
        
        // Sort textures in descending order
        this.textures.sort((a, b) => area(b) - area(a))
        
        // Pack the textures into a rectangular shape
        this.offsets = this.packer.fit(this.textures)

        this.canvas.width  = this.packer.root.width;
        this.canvas.height = this.packer.root.height;

    }

    draw() {

        // Configure the canvas for drawing the textures
        const context = this.canvas.getContext("2d")

        // Add all textures to the atlas
        // A bin-packing problem
        for (let texture of this.textures) {

            let offset = this.offsets.get(texture)

            // Draw the images
            context.drawImage(texture.image, offset.x, offset.y, texture.image.width, texture.image.height)

            // Ranges for each of the images in the atlas
            // let range = {
            //     startU: offset.x / this.canvas.width, //contextWidth
            //     endU: (offset.x + offset.width) / this.canvas.width,
            //     startV: 1-(offset.y / this.canvas.height),
            //     endV: 1-((offset.y + offset.height) / this.canvas.height)
            // }

            // let range = {
            //     startU: offset.x,
            //     endU: offset.x + offset.width,
            //     startV: offset.y ,
            //     endV: offset.y + offset.height
            // }

            let range = {
                startU: offset.x / this.canvas.width, //contextWidth
                endU: (offset.x + texture.image.width) / this.canvas.width,
                startV: 1-(offset.y / this.canvas.height),
                endV: 1-((offset.y + texture.image.height) / this.canvas.height)
            }


            // Add to map
            this.ranges.set(texture, range)

        }

        // Set the merged texture atlas properties
        this.mergedTexture = new THREE.CanvasTexture(this.canvas);
        this.mergedTexture.wrapS = THREE.ClampToEdgeWrapping;
        this.mergedTexture.wrapT = THREE.ClampToEdgeWrapping;
        this.mergedTexture.minFilter = THREE.NearestFilter;
        this.mergedTexture.magFilter = THREE.NearestFilter;
        this.mergedTexture.needsUpdate = true;

    }


    // collectURLs(textures) {

    //     const dataURLs = new WeakMap();

    //     for (let texture of textures) {

    //         if (texture instanceof THREE.CompressedTexture){
    //             throw new Error("CompressedTextures are not supported.");
    //         }

    //         if (texture.image.toDataURL === undefined) {
    //             const canvas = document.createElement('canvas')

    //             canvas.width = texture.image.naturalWidth;
    //             canvas.height = texture.image.naturalHeight;

    //             canvas.getContext('2d').drawImage(texture.image, 0, 0);

    //             this.dataURLs.set(texture, canvas.toDataURL())
    //         } else {
    //             this.dataURLs.set(texture, texture.image.toDataURL())
    //         }
    //     }

    //     return dataURLs;
    // }
    

}

function area(texture) {
    if (texture) {
        return texture.image.width * texture.image.height;
    } else {
        return 0
    }
}

// class TextureRectangle {

//     constructor(x, y, width, height, finalX = null, finalY = null) {
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;

//         this.finalX = finalX ? finalX : x + width;
//         this.finalY = finalY ? finalY : y + height;
//     }

//     inside(texture) {
//         return (texture.image.width <= this.width) && 
//                (texture.image.height <= this.height) 
//     }

//     fits(texture) {
//         return (texture.image.width == this.width) && 
//                (texture.image.height == this.height)
//     }

//     overlaps(rectangle) {
//         return (this.x < rectangle.x + rectangle.width && 
//                 this.x + this.width > rectangle.x && 
//                 this.y < rectangle.y + rectangle.height && 
//                 this.y + this.height > rectangle.y)
//     }
// }