(() => {
  let markedElement = null;
  let originalOutline = "";
  let originalOutlineOffset = "";

  browser.runtime.onMessage.addListener((message) => {
    if (message.action !== "mark-target") return;
    if (typeof message.targetElementId === "undefined") return;

    const el = browser.menus.getTargetElement(message.targetElementId);
    if (!el) return;

    markElement(el);
  });

  function markElement(el) {
    resetMark();

    markedElement = el;
    originalOutline = el.style.outline;
    originalOutlineOffset = el.style.outlineOffset;

    el.style.outline = "3px solid red";
    el.style.outlineOffset = "-3px";

    document.addEventListener("click", handleClick, true);
  }

  function handleClick(event) {
    if (!markedElement) return;

    if (markedElement.contains(event.target)) {
      // Second click on the marked element: remove it.
      event.preventDefault();
      event.stopPropagation();
      markedElement.remove();
      markedElement = null;
      document.removeEventListener("click", handleClick, true);
    } else {
      // Click outside the frame: clear the mark, resume normal display.
      resetMark();
    }
  }

  function resetMark() {
    if (markedElement) {
      markedElement.style.outline = originalOutline;
      markedElement.style.outlineOffset = originalOutlineOffset;
    }
    markedElement = null;
    document.removeEventListener("click", handleClick, true);
  }
})();
