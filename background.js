browser.menus.create({
  id: "remove-object",
  title: "Remove Object",
  contexts: ["all"]
});

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "remove-object") return;

  browser.tabs.sendMessage(
    tab.id,
    {
      action: "mark-target",
      targetElementId: info.targetElementId
    },
    { frameId: info.frameId }
  );
});
