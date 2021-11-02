import * as THREE from 'three';

class TextureRectangle {

    constructor(x, y, width, height, finalX = null, finalY = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.finalX = finalX ? finalX : x + width;
        this.finalY = finalY ? finalY : y + height;
    }

    fits(texture) {
        return (texture.image.width <= this.width) && 
               (texture.image.height <= this.height) 
    }

    perfectFits(texture) {
        return (texture.image.width == this.width) && 
               (texture.image.height == this.height)
    }

    overlaps(rectangle) {
        return (this.x < rectangle.x + rectangle.width && 
                this.x + this.width > rectangle.x && 
                this.y < rectangle.y + rectangle.height && 
                this.y + this.height > rectangle.y)
    }
}


class TextureAtlas {

    constructor(textures, max_texture_size=8192) {

        this.textures = textures;
        this.max_texture_size = max_texture_size;

        // Computed members
        this.urls = this.collectURLs(textures);
        this.inserted = new WeakMap();
        this.canvas = document.createElement('canvas')
        
    }

    build() {

        let maxWidth = 0, 
            maxHeight = 0;

        for (let texture of this.textures) {            
            // Calculate current max dimensions
            maxWidth = (texture.image.width > maxWidth) ? texture.image.width : maxWidth;
            maxHeight = (texture.image.height > maxHeight) ? texture.image.height : maxHeight;

        }

        const node = {};

        node.rectangle = new TextureRectangle(0, 0, maxWidth * this.textures.length, maxHeight * this.textures.length)


    }

    insert(node, texture) {

        if (this.inserted.get(texture)) {

        }

    }

    isTextureInserted(texture) {




        return false;


    }

    collectURLs(textures) {

        const dataURLs = new WeakMap();

        for (let texture of textures) {

            if (texture instanceof THREE.CompressedTexture){
                throw new Error("CompressedTextures are not supported.");
            }

            if (texture.image.toDataURL === undefined) {
                const canvas = document.createElement('canvas')

                canvas.width = texture.image.naturalWidth;
                canvas.height = texture.image.naturalHeight;

                canvas.getContext('2d').drawImage(texture.image, 0, 0);

                this.dataURLs.set(texture, canvas.toDataURL())
            } else {
                this.dataURLs.set(texture, texture.image.toDataURL())
            }
        }

        return dataURLs;
    }
    

}
