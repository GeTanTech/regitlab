(function () {
  "use strict";
  if (window.__EXTENSION_REGITLAB_CONFIG_LISTENER__) return;
  window.__EXTENSION_REGITLAB_CONFIG_LISTENER__ = true;
  window.__EXTENSION_REGITLAB_CONFIG = {};
  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "__EXTENSION_REGITLAB_CONFIG_UPDATE__") {
      window.__EXTENSION_REGITLAB_CONFIG = event.data.data || {};
    }
  });
})();
