export async function createPolygonSketch(view, graphicsLayer, processedLayer) {
    const [SketchViewModel, webMercatorUtils] = await $arcgis.import([
        "@arcgis/core/widgets/Sketch/SketchViewModel.js",
        "@arcgis/core/geometry/support/webMercatorUtils.js"

    ]);

    const sketch = new SketchViewModel({
        view: view,
        layer: graphicsLayer,
        polygonSymbol: {
            type: "polygon-3d",
            symbolLayers: [{
                type: "fill",
                material: { color: [255, 219, 0, 0.3] },
                outline: {
                    color: [255, 219, 0, 1],
                    size: 2
                }
            }]
        },
        defaultCreateOptions: {
            mode: "click",
            hasZ: false
        }
    });

    let processButton = null;

    sketch.on("create", (event) => {
        if (event.state === "complete") {
            const graphic = event.graphic;
            if (graphic.geometry.type === "polygon") {
                graphic.symbol = {
                    type: "polygon-3d",
                    symbolLayers: [{
                        type: "fill",
                        material: { color: [255, 219, 0, 0.4] },
                        outline: {
                            color: [255, 219, 0, 1],
                            size: 3
                        }
                    }]
                };

                // Selecionar o gráfico para edição
                sketch.update(graphic);
            }
        }
    });

    // Adicionar botão quando entrar em modo de atualização
    sketch.on("update", (event) => {
        if (event.state === "start" && !processButton) {
            createProcessButton(view, sketch, graphicsLayer, processedLayer, event.graphics[0]);
        }

        if (event.state === "complete" || event.state === "cancel") {
            removeProcessButton();
        }
    });

    function createProcessButton(view, sketch, graphicsLayer, processedLayer, graphic) {
        processButton = document.createElement("button");
        processButton.id = "process-polygon-button";
        processButton.innerHTML = "Process";
        processButton.style.cssText = `
        padding: 8px 16px;
        margin: 16px;
        background: #DBFF00;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        color: #000;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      `;

        processButton.onclick = async () => {
            // Clonar o gráfico com nova cor
            const processedGraphic = graphic.clone();
            processedGraphic.symbol = {
                type: "polygon-3d",
                symbolLayers: [{
                    type: "fill",
                    material: { color: [0, 122, 255, 0.4] },
                    outline: {
                        color: [0, 122, 255, 1],
                        size: 3
                    }
                }]
            };

            // Remover o gráfico do layer do sketch
            graphicsLayer.remove(graphic);

            // Adicionar ao layer de processados (não editável)
            processedLayer.add(processedGraphic);

            // Cancelar edição
            sketch.cancel();

            // Converter para GeoJSON
            const geometry = processedGraphic.geometry;
            const geoGeometry = webMercatorUtils.webMercatorToGeographic(geometry);

            const geojson = {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: geoGeometry.rings
                },
                properties: {
                    processedAt: new Date().toISOString()
                }
            };

            console.log("Polígono processado (GeoJSON):");
            console.log(JSON.stringify(geojson, null, 2));

            removeProcessButton();
        };

        view.ui.add(processButton, "top-right");
    }

    function removeProcessButton() {
        if (processButton) {
            view.ui.remove(processButton);
            processButton = null;
        }
    }

    return sketch;
}

export function createSketchButton(view, sketch) {
    const button = document.createElement("button");
    button.id = "sketch-button";
    button.title = "Select Region";

    const polygonSVG = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linejoin="round"/>
      </svg>
    `;

    const cancelSVG = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              stroke-width="2.5" 
              stroke-linecap="round"/>
      </svg>
    `;

    button.innerHTML = polygonSVG;

    let isDrawing = false;

    button.onclick = () => {
        if (!isDrawing) {
            // Iniciar desenho
            isDrawing = true;
            button.innerHTML = cancelSVG;
            button.style.background = "rgba(220, 38, 38, 0.50)";
            button.title = "Cancel";
            sketch.create("polygon", { mode: "click" });
        } else {
            sketch.cancel();
            isDrawing = false;
            button.innerHTML = polygonSVG;
            button.style.background = "rgba(255, 255, 255, 0.60)";
            button.title = "Select Region";
        }
    };

    sketch.on("create", (event) => {
        if (event.state === "complete" || event.state === "cancel") {
            isDrawing = false;
            button.innerHTML = polygonSVG;
            button.style.background = "rgba(255, 255, 255, 0.60)";
            button.title = "Select Region";
        }
    });

    view.ui.add(button, "bottom-right");
    return button;
}