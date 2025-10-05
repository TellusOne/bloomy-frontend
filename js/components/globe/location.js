export async function getDeviceLocationOrDefault(timeout = 5000) {
    return new Promise(resolve => {
      if ("geolocation" in navigator) {
        let resolved = false;
        const timer = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve({ longitude: 0, latitude: 0 });
          }
        }, timeout);
  
        navigator.geolocation.getCurrentPosition(
          pos => {
            if (!resolved) {
              clearTimeout(timer);
              resolved = true;
              resolve({ longitude: pos.coords.longitude, latitude: pos.coords.latitude });
            }
          },
          () => {
            if (!resolved) {
              clearTimeout(timer);
              resolved = true;
              resolve({ longitude: 0, latitude: 0 });
            }
          }
        );
      } else {
        resolve({ longitude: 0, latitude: 0 });
      }
    });
  }
  