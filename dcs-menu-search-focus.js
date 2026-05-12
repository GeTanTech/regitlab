(() => {
  if (window.__REGITLAB_DCS_MENU_FOCUS__) return;
  window.__REGITLAB_DCS_MENU_FOCUS__ = true;

  const SEARCH_WRAP_CLASS = "searchInput____g_4S";
  const ACTIVE_CLASS = "active___B_A_W";

  function focusMenuInput() {
    const input = document.querySelector(
      'input.ant-input[placeholder="请输入菜单名称"]'
    );
    if (!input) return;
    requestAnimationFrame(() => {
      input.focus();
    });
  }

  function hasActiveSearchWrap(el) {
    return (
      el &&
      el.nodeType === Node.ELEMENT_NODE &&
      el.classList.contains(SEARCH_WRAP_CLASS) &&
      el.classList.contains(ACTIVE_CLASS)
    );
  }

  function scanAddedSubtree(root) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
    if (hasActiveSearchWrap(root)) {
      focusMenuInput();
      return;
    }
    const inner = root.querySelector?.(
      `.${CSS.escape(SEARCH_WRAP_CLASS)}.${CSS.escape(ACTIVE_CLASS)}`
    );
    if (inner) focusMenuInput();
  }

  function tryFocusFromAttributeTarget(target) {
    if (hasActiveSearchWrap(target)) focusMenuInput();
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes" && m.attributeName === "class") {
        tryFocusFromAttributeTarget(m.target);
        continue;
      }
      if (m.type === "childList") {
        m.addedNodes.forEach(scanAddedSubtree);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  const existing = document.querySelector(
    `.${CSS.escape(SEARCH_WRAP_CLASS)}.${CSS.escape(ACTIVE_CLASS)}`
  );
  if (existing) focusMenuInput();
})();
