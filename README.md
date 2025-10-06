<div align="center">
  <img src="./public/logo.svg" alt="Bloomy Logo" width="200"/>
  
  # 🌸 Detect. Protect. Bloom.
  
  **Interactive Vegetation & Bloom Visualization Platform**
  
  [![NASA Space Apps Challenge 2025](https://img.shields.io/badge/NASA-Space%20Apps%202025-blue.svg)](https://www.spaceappschallenge.org/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Built with ArcGIS](https://img.shields.io/badge/Built%20with-ArcGIS%20Maps%20SDK-orange.svg)](https://developers.arcgis.com/)
  
  *Making complex vegetation data accessible to everyone - from scientists to children*
  
  [🚀 Live Demo](#) | [🔗 Bloomy ETL](https://github.com/TellusOne/bloomy-etl)
</div>

---

## 🌍 Overview

**Bloomy** is an interactive 3D globe visualization platform developed for the **NASA Space Apps Challenge 2025**. It transforms complex satellite vegetation data into beautiful, easy-to-understand visualizations that anyone can explore.

### ✨ Key Features

- 🗺️ **Interactive 3D Globe** - Explore Earth with smooth navigation and beautiful satellite imagery
- 📊 **Time-Lapse Visualization** - Watch vegetation changes over time with our intuitive time slider
- 🌱 **NDVI/EVI Analysis** - View vegetation health through scientifically accurate color maps
- 🎯 **Smart Markers** - Dataset locations marked with flower icons that adapt to zoom level
- 📱 **Mobile Responsive** - Full functionality on desktop, tablet, and mobile devices
- 🔍 **Polygon Analysis** - Draw custom areas to analyze vegetation statistics
- ⚡ **Performance Optimized** - Preloading and caching for smooth transitions

---

## 🎯 Mission

**Bridge the gap between complex Earth observation data and public understanding.**

Scientists use satellite data daily to monitor vegetation, crop health, and climate change. But this data is often inaccessible to the public, educators, and decision-makers. Bloomy changes that by:

- 🧑‍🔬 **For Scientists**: Quick visualization of processed datasets with temporal analysis
- 👨‍🏫 **For Educators**: Interactive tool to teach remote sensing and environmental science
- 🧒 **For Students**: Engaging way to explore Earth science and satellite technology
- 🌾 **For Farmers**: Visual insights into crop health and seasonal patterns
- 🌍 **For Everyone**: Understanding our changing planet through beautiful data

---

## 🛠️ Technology Stack

### Core Technologies
- **[ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/)** - 3D globe and mapping engine
- **[GeoTIFF.js](https://geotiffjs.github.io/)** - Client-side GeoTIFF parsing
- **Vanilla JavaScript** - Lightweight, no heavy frameworks
- **[NASA Earth Observatory](https://earthobservatory.nasa.gov/)** - Daily satellite imagery and stories


### Data Processing
- **[Bloomy ETL](https://github.com/TellusOne/bloomy-etl)** - Python pipeline for Sentinel-2 and Landsat processing
- **NDVI/EVI Indices** - Normalized vegetation health metrics
- **GeoTIFF Format** - Industry-standard geospatial rasters

### Features
- 📍 Custom SVG markers with dynamic visibility
- 🎞️ Frame preloading for smooth animations
- 💾 Client-side caching with Map API
- 🎨 Scientific color ramps for vegetation indices
- ⚡ GPU-accelerated rendering

---

## 🚀 Quick Start

### Prerequisites

**any webserver(nginx)**


### Installation

1. **Clone the repository**
```bash
git clone https://github.com/TellusOne/bloomy-frontend
```

2. **Install dependencies**
```bash
copy or paste all files on nginx index.html folder 
```


3. **Add your datasets**
```bash
# Place processed GeoTIFF files in:
public/datasets/01/
  ├── index.json        # Dataset metadata
  ├── 2024-01-07.tif   # Daily NDVI/EVI rasters
  ├── 2024-01-12.tif
  └── ...
```


6. **Open in browser**
```
http://localhost:0000?
```

---

## 📁 Project Structure

```
bloomy-frontend/
├── public/
│   ├── datasets/           # GeoTIFF datasets
│   │   └── 01/
│   │       ├── index.json  # Dataset config
│   │       └── *.tif       # Daily rasters
│   ├── logo.svg
│   └── favicon.ico
├── js/
│   └── components/
│       └── globe/
│           ├── globe.js       # Main 3D scene
│           ├── dataset.js     # Dataset loading & rendering
│           ├── timelapse.js   # Time slider control
│           ├── graphics.js    # Markers & symbols
│           ├── sketch.js      # Polygon drawing
│           └── location.js    # Geolocation
├── styles/
│   └── main.css
├── index.html
└── README.md
```

---

## 📊 Dataset Format

Bloomy expects datasets in the following format:

### `index.json`
```json
{
  "format": "GeoTIFF",
  "crs": "EPSG:4326",
  "transform": [
    0.00027, 0.0, -51.998,
    0.0, -0.00027, -29.449,
    0, 0, 1
  ],
  "dimensions": {
    "height": 41,
    "width": 19
  },
  "center": {
    "lon": -51.995817,
    "lat": -29.455162
  },
  "bounds": {
    "west": -51.998382,
    "south": -29.460697,
    "east": -51.993252,
    "north": -29.449627
  },
  "bands": [
    { "name": "NDVI", "description": "Normalized Difference Vegetation Index" },
    { "name": "EVI", "description": "Enhanced Vegetation Index" }
  ],
  "nodata": -9999,
  "dates": [
    "2024-01-07",
    "2024-01-12",
    "2024-02-01"
  ]
}
```

### GeoTIFF Files
- **Format**: Cloud-Optimized GeoTIFF (COG)
- **Bands**: 2 (NDVI, EVI)
- **Data Type**: Float32
- **NoData Value**: -9999
- **CRS**: EPSG:4326 (WGS84)

---

## 🎨 Features in Detail

### 🌍 Interactive 3D Globe
- Smooth camera transitions
- High-quality satellite basemap
- Elevation-aware terrain
- Touch and mouse navigation

### 📈 Time-Lapse Animation
- Scrub through dates with slider
- Auto-play with loop option
- Frame preloading for smooth playback
- Date-specific data loading

### 🌱 Vegetation Indices
**NDVI Color Scale:**
- 🔴 Red (-0.2 to 0): Water/Bare soil
- 🟡 Yellow (0 to 0.2): Sparse vegetation
- 🟢 Light Green (0.2 to 0.4): Moderate vegetation
- 🟢 Green (0.4 to 0.6): Healthy vegetation
- 🌲 Dark Green (0.6 to 1): Dense vegetation

### 🎯 Smart Markers
- Flower-shaped SVG icons
- Yellow petals with white center
- Scale-dependent visibility
- Elevated with callout lines

### 📐 Polygon Analysis
- Draw custom areas of interest
- Calculate average NDVI/EVI
- Pixel count and statistics
- Export results

---



## 🎓 Educational Use Cases

### 🏫 Classroom Activities
1. **Seasonal Changes** - Compare vegetation across seasons
2. **Crop Monitoring** - Track agricultural areas over time
3. **Deforestation** - Identify areas of vegetation loss
4. **Urban Growth** - Observe city expansion impact on green spaces

### 📚 Learning Objectives
- Understanding remote sensing
- Interpreting vegetation indices
- Analyzing temporal data
- Geographic information systems (GIS)
- Environmental monitoring

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NASA** - For the Space Apps Challenge
- **ESA** - Sentinel-2 satellite data
- **USGS** - Landsat satellite data
- **Esri** - ArcGIS Maps SDK for JavaScript
- **GeoTIFF.js** - Client-side geospatial processing

---

## 📬 Contact

**Bloomy Team** - NASA Space Apps Challenge 2025


---

## 🌟 Support the Project

If you find Bloomy useful, please:
- ⭐ Star this repository
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📣 Share with others
- 🤝 Contribute code

---

<div align="center">
  
  **Made with 💚 for our planet**
  
  *Visualizing Earth's vegetation, one pixel at a time*
  
  [⬆ Back to Top](#-bloomy)
  
</div>