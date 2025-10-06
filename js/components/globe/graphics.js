const [GraphicsLayer, Graphic] = await $arcgis.import([
  "@arcgis/core/layers/GraphicsLayer.js",
  "@arcgis/core/Graphic.js"
]);

export function createMarkerLayer() {
  const layer = new GraphicsLayer();

  const flowerSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <!-- Top petal -->
      <circle cx="50" cy="20" r="18" fill="#FFC800" stroke="white" stroke-width="3"/>
      <!-- Right petal -->
      <circle cx="80" cy="50" r="18" fill="#FFC800" stroke="white" stroke-width="3"/>
      <!-- Bottom petal -->
      <circle cx="50" cy="80" r="18" fill="#FFC800" stroke="white" stroke-width="3"/>
      <!-- Left petal -->
      <circle cx="20" cy="50" r="18" fill="#FFC800" stroke="white" stroke-width="3"/>
      <!-- White center -->
      <circle cx="50" cy="50" r="16" fill="white" stroke="#FFC800" stroke-width="3"/>
    </svg>
  `;

  const markerSymbol = {
    type: "point-3d",
    symbolLayers: [{
      type: "icon",
      resource: {
        href: "data:image/svg+xml;base64," + btoa(flowerSVG)
      },
      size: 40
    }],
    verticalOffset: { 
      screenLength: 150, 
      maxWorldLength: 15000,
      minWorldLength: 5000
    },
    callout: {
      type: "line",
      size: 2,
      color: [255, 200, 0, 0.8],
      border: {
        color: [255, 255, 255, 0.8]
      }
    }
  };

  const pointGraphic = new Graphic({
    geometry: { type: "point", longitude: -144.731, latitude: 63.975, z: 0 },
    symbol: markerSymbol,
    popupTemplate: {
      title: "A Golden Moment for Boreal Forests",
      content: `
        <div>
          <p>Hillsides in Alaska's interior showed their changing colors ahead of the autumnal equinox.</p>
          <img src="https://eoimages.gsfc.nasa.gov/images/imagerecords/154000/154821/alaskafall_20250918.jpg" style="width:200px; height:auto;" />
        </div>
      `
    }
  });

  layer.add(pointGraphic);
  return layer;
}