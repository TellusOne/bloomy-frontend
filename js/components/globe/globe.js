import { getDeviceLocationOrDefault } from "./location.js";
import { createMarkerLayer } from "./graphics.js";
import { createPolygonSketch, createSketchButton } from "./sketch.js";
import { loadDatasetConfig, createDatasetLayer } from "./dataset.js";
import { createTimeLapseControl } from "./timelapse.js";

const [Map, SceneView, GraphicsLayer] = await $arcgis.import([
  "@arcgis/core/Map.js",
  "@arcgis/core/views/SceneView.js",
  "@arcgis/core/layers/GraphicsLayer.js"
]);

const map = new Map({
  basemap: "satellite",
  ground: "world-elevation"
});

const markerLayer = createMarkerLayer();
map.add(markerLayer);
const sketchLayer = new GraphicsLayer();
map.add(sketchLayer);
const processedLayer = new GraphicsLayer();
map.add(processedLayer);

const view = new SceneView({
  container: "viewDiv",
  map,
  ui: { components: [] },
  qualityProfile: "high",
  camera: { 
    position: { 
      longitude: -52, 
      latitude: -29, 
      z: 10000000 
    }, 
    tilt: 0 
  }
});

const logoDiv = document.createElement("div");
logoDiv.id = "logo-global";
logoDiv.innerHTML = `<img src="./public/logo.svg" style="width:100px;">`;
view.ui.add(logoDiv, "top-left");

// Wait for tiles to load with timeout
async function waitForStableRender(view, maxWait = 5000) {
  console.log("Waiting for tiles to load...");
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const checkUpdating = () => {
      if (!view.updating || (Date.now() - startTime) > maxWait) {
        console.log("Tiles loaded or timeout reached");
        resolve();
      } else {
        requestAnimationFrame(checkUpdating);
      }
    };
    checkUpdating();
  });
}

view.when(async () => {
  console.log("SceneView ready");

  // Wait for initial tiles
  await waitForStableRender(view);

  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.transition = "opacity 0.5s ease";
    loading.style.opacity = "0";
    setTimeout(() => loading.remove(), 600);
  }

  try {
    const config = await loadDatasetConfig("01");
    console.log("Config loaded:", config.center);
    
    const datasetController = await createDatasetLayer(view, config);
    console.log("Dataset controller created");
    
    map.add(datasetController.layer);
    map.add(datasetController.markerLayer);
    console.log("Layers added");

    await datasetController.updateToDate(0);
    console.log("First frame loaded");
    
    createTimeLapseControl(view, datasetController);
    console.log("TimeLapse control created");
    
    // Navigate to dataset location
    await view.goTo({
      center: [config.center.lon, config.center.lat],
      zoom: 16,
      tilt: 45
    }, {
      duration: 3000
    });
    console.log("Navigation complete");
    
  } catch (error) {
    console.error("ERROR WHEN DATASET LOADED:");
    console.error("  - Message:", error.message);
    console.error("  - Stack:", error.stack);
  }

  const sketch = await createPolygonSketch(view, sketchLayer, processedLayer);
  createSketchButton(view, sketch);
});