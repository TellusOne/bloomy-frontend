export async function createTimeLapseControl(view, datasetLayer) {
  const [TimeSlider] = await $arcgis.import([
    "@arcgis/core/widgets/TimeSlider.js"
  ]);

  const dates = datasetLayer.config.dates;
  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[dates.length - 1]);

  const timeSlider = new TimeSlider({
    container: document.createElement("div"),
    view: view,
    mode: "instant",
    layout: "compact",
    
    fullTimeExtent: {
      start: startDate,
      end: endDate
    },
    timeExtent: {
      start: startDate,
      end: startDate
    },
    
    stops: {
      dates: dates.map(d => new Date(d))
    },
    
    playRate: 1000, 
    loop: true,
    
    timeVisible: true,
    labelsVisible: true,
    
    visibleElements: {
      playPauseButton: true,
      nextButton: true,
      previousButton: true,
      timeExtent: true
    }
  });

  view.ui.add(timeSlider, "bottom-left");

  timeSlider.watch("timeExtent", async (timeExtent) => {
    if (timeExtent && timeExtent.start) {
      const currentDate = timeExtent.start.toISOString().split('T')[0];
      
      
      const dateIndex = dates.findIndex(date => date === currentDate);
      
      if (dateIndex !== -1) {
        await datasetLayer.updateToDate(dateIndex);
      } else {
        console.warn(`⚠️ Date ${currentDate} not found on dataset`);
        
        const currentTime = timeExtent.start.getTime();
        let closestIndex = 0;
        let minDiff = Math.abs(new Date(dates[0]).getTime() - currentTime);
        
        for (let i = 1; i < dates.length; i++) {
          const diff = Math.abs(new Date(dates[i]).getTime() - currentTime);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
          }
        }
        
        await datasetLayer.updateToDate(closestIndex);
      }
    }
  });

  return {
    timeSlider,
    destroy: () => {
      view.ui.remove(timeSlider);
      timeSlider.destroy();
    }
  };
}