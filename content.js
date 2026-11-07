(() => {
  let markedElement = null;
  let originalOutline = "";
  let originalOutlineOffset = "";
  let active = false;

  browser.runtime.onMessage.addListener((message) => {
    if (message.action !== "mark-target") return;
    if (typeof message.targetElementId === "undefined") return;

    const el = browser.menus.getTargetElement(message.targetElementId);
    if (!el) return;

    startMarking(el);
  });

  function startMarking(el) {
    stopMarking();
    markElement(el);
    active = true;
    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
  }

  function markElement(el) {
    if (el === markedElement) return;
    unmarkElement();

    markedElement = el;
    originalOutline = el.style.outline;
    originalOutlineOffset = el.style.outlineOffset;

    el.style.outline = "3px solid red";
    el.style.outlineOffset = "-3px";
  }

  function unmarkElement() {
    if (markedElement) {
      markedElement.style.outline = originalOutline;
      markedElement.style.outlineOffset = originalOutlineOffset;
    }
    markedElement = null;
  }

  function handleMouseOver(event) {
    if (!active) return;
    const el = event.target;
    if (!(el instanceof Element)) return;
    if (el === document.documentElement || el === document.body) return;
    markElement(el);
  }

  function handleClick(event) {
    if (!active || !markedElement) return;

    // Click removes the element currently under the red frame.
    event.preventDefault();
    event.stopPropagation();
    const el = markedElement;
    stopMarking();
    el.remove();
  }

  function handleContextMenu(event) {
    if (!active) return;
    event.preventDefault();
    event.stopPropagation();
    stopMarking();
  }

  function stopMarking() {
    unmarkElement();
    active = false;
    document.removeEventListener("mouseover", handleMouseOver, true);
    document.removeEventListener("click", handleClick, true);
    document.removeEventListener("contextmenu", handleContextMenu, true);
  }
})();
