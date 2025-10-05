const [GraphicsLayer, Graphic] = await $arcgis.import([
    "@arcgis/core/layers/GraphicsLayer.js",
    "@arcgis/core/Graphic.js"
  ]);

export function createMarkerLayer() {
  const layer = new GraphicsLayer();

  const markerSymbol = {
    type: "point-3d",
    symbolLayers: [{
      type: "icon",
      resource: { primitive: "circle" },
      size: 20,
      material: { color: "#DBFF00" }
    }],
    verticalOffset: { screenLength: 40, maxWorldLength: 200000 }
  };

  const pointGraphic = new Graphic({
    geometry: { type: "point", longitude: 0, latitude: 60, z: 10000 },
    symbol: markerSymbol,
    popupTemplate: {
      title: "A Golden Moment for Boreal Forests",
      content: `
        <div>
          <p>Hillsides in Alaska’s interior showed their changing colors ahead of the autumnal equinox.</p>
          <img src="https://eoimages.gsfc.nasa.gov/images/imagerecords/154000/154821/alaskafall_20250918.jpg" style="width:200px; height:auto;" />
        </div>
      `
    }
  });

  layer.add(pointGraphic);
  return layer;
}
