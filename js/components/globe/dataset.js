export async function loadDatasetConfig(datasetId) {
  const response = await fetch(`./public/datasets/${datasetId}/index.json`);
  if (!response.ok) {
    throw new Error(`Error loading dataset ${datasetId}`);
  }
  const config = await response.json();
  
  return {
    ...config,
    id: datasetId
  };
}

export async function createDatasetLayer(view, config) {
  const [GraphicsLayer, Graphic, Polygon, Point] = await $arcgis.import([
    "@arcgis/core/layers/GraphicsLayer.js",
    "@arcgis/core/Graphic.js",
    "@arcgis/core/geometry/Polygon.js",
    "@arcgis/core/geometry/Point.js"
  ]);

  const layer = new GraphicsLayer({
    title: `Dataset ${config.id}`,
    opacity: 1.0
  });

  // Marker layer with scale-dependent visibility
  const markerLayer = new GraphicsLayer({
    title: `Dataset ${config.id} Marker`,
    minScale: 0,
    maxScale: 0
  });

  // Create elevated marker at dataset center
  const markerPoint = new Point({
    longitude: config.center.lon,
    latitude: config.center.lat,
    z: 8000,
    spatialReference: { wkid: 4326 }
  });

  const marker = new Graphic({
    geometry: markerPoint,
    symbol: {
      type: "point-3d",
      symbolLayers: [{
        type: "icon",
        size: 32,
        resource: { primitive: "circle" },
        material: { color: [255, 200, 0, 0.9] },
        outline: {
          color: [255, 255, 255, 1],
          size: 1
        }
      }],
      verticalOffset: {
        screenLength: 80,
        maxWorldLength: 20000,
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
    }
  });

  markerLayer.add(marker);

  const tiffCache = new Map();
  let isPreloading = false;

  const controller = {
    layer,
    markerLayer,
    config,
    currentIndex: 0,
    
    async loadTiffData(date) {
      if (tiffCache.has(date)) {
        console.log(`Using cached data for ${date}`);
        return tiffCache.get(date);
      }

      const filename = `${date}.tif`;
      const url = `./public/datasets/${config.id}/${filename}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
        const image = await tiff.getImage();
        const rasters = await image.readRasters();
        
        const data = {
          ndvi: rasters[0],
          evi: rasters[1],
          width: image.getWidth(),
          height: image.getHeight()
        };

        tiffCache.set(date, data);
        
        return data;
      } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        throw error;
      }
    },

    async preloadNextFrames(currentIndex, count = 3) {
      if (isPreloading) return;
      isPreloading = true;

      const promises = [];
      for (let i = 1; i <= count; i++) {
        const nextIndex = (currentIndex + i) % config.dates.length;
        const date = config.dates[nextIndex];
        
        if (!tiffCache.has(date)) {
          promises.push(
            this.loadTiffData(date).catch(err => {
              console.warn(`Preload failed for ${date}:`, err.message);
            })
          );
        }
      }

      await Promise.all(promises);
      isPreloading = false;
      console.log(`Preloaded ${promises.length} frames. Cache size: ${tiffCache.size}`);
    },
    
    async updateToDate(dateIndex, skipPreload = false) {
      const date = config.dates[dateIndex];
      console.log(`Loading date ${dateIndex + 1}/${config.dates.length}: ${date}`);
      
      try {
        const data = await this.loadTiffData(date);
        
        const [pixelWidth, , xMin, , pixelHeight, yMax] = config.transform;
        
        const graphics = [];
        
        for (let row = 0; row < data.height; row++) {
          for (let col = 0; col < data.width; col++) {
            const index = row * data.width + col;
            const ndviValue = data.ndvi[index];
            
            if (ndviValue === config.nodata || isNaN(ndviValue)) continue;
            
            const lon = xMin + col * pixelWidth;
            const lat = yMax + row * pixelHeight;
            
            const corners = [
              [lon, lat],
              [lon + pixelWidth, lat],
              [lon + pixelWidth, lat + pixelHeight],
              [lon, lat + pixelHeight],
              [lon, lat]
            ];
            
            const polygon = new Polygon({
              rings: [corners],
              spatialReference: { wkid: 4326 }
            });
            
            const color = getNDVIColor(ndviValue);
            
            const graphic = new Graphic({
              geometry: polygon,
              symbol: {
                type: "simple-fill",
                color: color,
                outline: { 
                  width: 0
                }
              },
              attributes: {
                ndvi: ndviValue,
                evi: data.evi[index],
                date: date,
                row: row,
                col: col
              }
            });
            
            graphics.push(graphic);
          }
        }
        
        layer.removeAll();
        layer.addMany(graphics);
        
        console.log(`✓ Loaded ${graphics.length} pixels for ${date}`);
        this.currentIndex = dateIndex;

        if (!skipPreload) {
          this.preloadNextFrames(dateIndex);
        }
        
      } catch (error) {
        console.error("Error processing TIFF:", error);
        throw error;
      }
      
      return date;
    },

    watchMarkerVisibility() {
      view.watch("scale", (scale) => {
        if (scale > 100000) {
          markerLayer.visible = true;
        } else if (scale < 50000) {
          markerLayer.visible = false;
        }
      });
    }
  };
  
  controller.watchMarkerVisibility();
  
  return controller;
}

function getNDVIColor(ndvi) {
  if (ndvi < -0.2) return [120, 30, 30];
  if (ndvi < 0) return [160, 120, 80];
  if (ndvi < 0.2) return [200, 180, 100];
  if (ndvi < 0.4) return [150, 200, 50];
  if (ndvi < 0.6) return [80, 160, 50];
  if (ndvi < 0.8) return [40, 120, 40];
  return [20, 80, 20];
}