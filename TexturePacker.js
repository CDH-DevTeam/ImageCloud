

export default class TexturePacker {

    constructor() {

        // Maps a texture to a node with offsets and dimensions
        this.offsets  = WeakMap()

        // Add the root node (upper left)
        this.root = {
            x: 0,
            y: 0,
            width: undefined,
            height: undefined
        }
    }

    fit(textures) {

        // Sort by size
        // textures.sort((a, b) => area(a) - area(b))

        // Start with the largest texture
        this.root.width = textures[0].image.width;
        this.root.height = textures[0].image.height;
        

        let node;
        
        // Grow the larger rectangle, texture by texture
        for (let texture of textures) {

            if (node = this.findNode(this.root, texture.image.width, texture.image.height)) {

                this.offsets.set(texture, this.splitNode(node, texture.image.width, texture.image.height))

            } else {

                this.offsets.set(texture, this.growNode(texture.image.width, texture.image.height))

            }
        }

        return this.offsets
    }

    findNode(root, width, height) {
        if (root.taken) {
            return this.findNode(root.right, width, height) || this.findNode(root.down, width, height)
        } else if ((width <= root.width) && (height <= root.height)) {
            return root;
        } else {
            return null
        }
    }

    splitNode(node, width, height) {
        // Creates two new children nodes to the right
        // and below the current bin node

        node.taken = true;
        node.down = {
            x: node.x,
            y: node.y + height,
            width: node.width,
            height: node.height - height
        }

        node.right = {
            x: node.x + width,
            y: node.y,
            width: node.width - width,
            height: height
        }

        return node;

    }

    growNode(width, height) {
        hasSmallerWidth = (width <= this.root.width)
        hasSmallerHeight = (height <= this.root.height)

        ensureSquareRight = hasSmallerWidth && (this.root.height >= (this.root.width + width))
        ensureSquareDown  = hasSmallerHeight && (this.root.width >= (this.root.height + height))

        if (ensureSquareRight) {
            return this.growRight(width, height)
        } else if (ensureSquareDown) {
            this.growDown(width, height) 
        } else if (hasSmallerWidth) {
            this.growRight(width, height)
        } else if (hasSmallerHeight) {
            this.growDown(width, height)
        } else {
            return null
        }
        
    }

    growRight(width, height) {

        this.root = {
            taken: true,
            x: 0,
            y: 0,
            width: this.root.width + width,
            height: this.root.height,
            down: this.root,
            right: {
                x: this.root.width,
                y: 0,
                width: width,
                height: this.root.height
            }
        }

        if (node = this.findNode(this.root, width, height)) {
            return this.splitNode(node, width, height)
        } else {
            return null
        }

    }

    growDown(width, height) {
        this.root = {
            taken: true,
            x: 0,
            y: 0,
            width: this.root.width,
            height: this.root.height + height,
            down: {
                x: 0,
                y: this.root.height,
                width: this.root.width,
                height: height
            },
            right: this.root
        }

        if (node = this.findNode(this.root, width, height)) {
            return this.splitNode(node, width, height)
        } else {
            return null
        }
    }
}

function area(texture) {
    if (texture) {
        return texture.image.width * texture.image.height;
    } else {
        return 0
    }
}