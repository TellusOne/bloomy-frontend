import { getDeviceLocationOrDefault } from "./location.js";
import { createMarkerLayer } from "./graphics.js";
import { waitForStableRender } from "./utils.js";
const [Map, SceneView] = await $arcgis.import([
  "@arcgis/core/Map.js",
  "@arcgis/core/views/SceneView.js",
]);


const map = new Map({
  basemap: "satellite",
  ground: "world-elevation"
});

const markerLayer = createMarkerLayer();
map.add(markerLayer);

const view = new SceneView({
  container: "viewDiv",
  map,
  center: [0, 0],
  ui: { components: [] },
  qualityProfile: "high",
  camera: { position: { longitude: 0, latitude: 0, z: 25000000 }, tilt: 0 }
});

// Logo
const logoDiv = document.createElement("div");
logoDiv.id = "logo-global";
logoDiv.innerHTML = `<img src="./public/logo.svg" style="width:100px;">`;
view.ui.add(logoDiv, "top-left");

view.when(async () => {
  console.log("SceneView inicializada — aguardando render estável...");
  await waitForStableRender(view);
  console.log("Tiles realmente carregados!");

  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.transition = "opacity 0.5s ease";
    loading.style.opacity = "0";
    setTimeout(() => loading.remove(), 600);
  }

  const coords = await getDeviceLocationOrDefault(3000);
  console.log("Usando coordenadas:", coords);

  await view.goTo({
    position: { longitude: coords.longitude, latitude: coords.latitude, z: 10000000 },
    tilt: 1,
    duration: 4000
  }, { easing: "ease-out-in" });
});
