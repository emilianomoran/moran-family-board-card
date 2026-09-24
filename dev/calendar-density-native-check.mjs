/** Native browser input verifies range behavior; page-side checks cover layout/state. */
export async function runNativeDensityChecks(cdp, delay) {
  const evaluate = async (expression) =>
    (
      await cdp.send("Runtime.evaluate", {
        expression,
        returnByValue: true,
      })
    ).result.value;
  const state = () =>
    evaluate(`(() => {
    const root = document.querySelector('moran-family-board-card').shadowRoot;
    const button = root.querySelector('.wall-density-toggle');
    const input = root.querySelector('#wall-calendar-density');
    const rect = e => {const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};};
    return {button:rect(button),slider:rect(input),value:input.valueAsNumber,min:Number(input.min),max:Number(input.max),
      hidden:root.querySelector('.wall-density-panel').hidden,
      focused:root.activeElement === button ? 'button' : root.activeElement === input ? 'slider' : 'other'};
  })()`);
  const click = async (x, y) => {
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      x,
      y,
      button: "left",
      clickCount: 1,
    });
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      x,
      y,
      button: "left",
      clickCount: 1,
    });
    await delay(100);
  };
  const press = async (key, windowsVirtualKeyCode) => {
    await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key, windowsVirtualKeyCode });
    await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, windowsVirtualKeyCode });
    await delay(100);
  };
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  let current = await state();
  const { min, max } = current;
  await click(current.button.x + current.button.w / 2, current.button.y + current.button.h / 2);
  current = await state();
  assert(!current.hidden && current.focused === "slider", "Native zoom activation/focus failed.");
  await press("Home", 36);
  assert((await state()).value === min, "Native Home key did not zoom out.");
  await press("End", 35);
  assert((await state()).value === max, "Native End key did not zoom in.");
  await press("ArrowLeft", 37);
  assert((await state()).value === max - 1, "Native Arrow key did not adjust density.");
  const { slider } = await state();
  const y = slider.y + slider.h / 2;
  await click(slider.x + slider.w / 4, y);
  assert((await state()).value < (min + max) / 2, "Native pointer cannot set compact density.");
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: slider.x + slider.w / 4, y, id: 1 }],
  });
  for (let step = 1; step <= 8; step++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: slider.x + slider.w * (0.25 + step / 16), y, id: 1 }],
    });
    await delay(25);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await delay(100);
  assert(
    (await state()).value > (min + max) / 2,
    "Native touch drag cannot zoom toward more detail.",
  );
  await press("Escape", 27);
  current = await state();
  assert(
    current.hidden && current.focused === "button",
    "Native Escape failed to dismiss and return focus.",
  );
}
