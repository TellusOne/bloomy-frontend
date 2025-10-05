export async function waitForStableRender(view, stableFor = 1000, timeout = 20000) {
    return new Promise(resolve => {
      let lastUpdating = performance.now();
      const start = performance.now();
  
      const check = () => {
        if (!view.updating) {
          if (performance.now() - lastUpdating > stableFor) return resolve();
        } else lastUpdating = performance.now();
        if (performance.now() - start > timeout) return resolve();
        requestAnimationFrame(check);
      };
      check();
    });
  }
  