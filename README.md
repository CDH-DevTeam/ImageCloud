# ImageCloud
An image visualization application displaying images in the browser based on a 2D projection.

The ImageCloud application displays images on a two-dimensional canvas, requiring pre-computed positions. The application is thus versatile enough to use in a number of scenarios, for example:
- Virtual galleries and exhibitions
- Arrangements of images
- Projections of images, for example similarities or embeddings

ImageCloud is written in pure Javscript and only dependent on the TextureAtlas, a tool used to concatenate multiple images into a single texture, which drastically reduces memory consumption in browsers. 

## Installation
To install, simply clone the repository and include in your project.

```bash
git clone https://github.com/CDH-DevTeam/ImageCloud.git
```

## Usage and operation

The ``ImageCloud`` class is initialized with an array of image objects
```javascript
const container = //... some js/html element in the view
const images = //... image loading logic
const imageCloud = new ImageCloud(images)
```
and then requires building and rendering:
```javascript
// Add to the view of your container
container.appendChild(imageCloud.renderer.domElement)

// Constructs the scene and adds the images
imageCloud.build()

// Renders the scene with images
imageCloud.render()
```

### Image format
The images need to have the following schema:
```javascript
// Image
{
  url: String, // The local or API url to the image
  x: Number, // Position on the horizontal axis
  y: Number // Position on the vertical axis
}
```
