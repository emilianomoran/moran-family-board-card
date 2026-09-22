/** Run after date-strip checks at every responsive fixture width, including embedded cards. */
export async function runViewSwitcherChecks(card, nextRender) {
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const root = card.shadowRoot;
  const themeRoot = document.documentElement;
  const originalTheme = themeRoot.dataset.theme;
  const originalHass = card.hass;
  const originalConfig = card._config;
  const views = ["day", "timeline", "week", "month", "agenda"];
  const panels = [".board", ".tlwrap", ".weekwrap", ".monthwrap", ".agenda"];
  const checkGeometry = () => {
    const track = root.querySelector(".switch");
    const trackRect = track.getBoundingClientRect();
    const trackStyle = getComputedStyle(track);
    assert(trackRect.height<=40, 'View capsule exceeds the requested 40px cap.');
    const buttons = [...track.querySelectorAll("button")];
    assert(
      parseFloat(trackStyle.borderRadius) >= trackRect.height / 2,
      "View track is not a capsule.",
    );
    assert(parseFloat(trackStyle.paddingTop) >= 2, "Selected pill is not inset from its track.");
    for (const button of buttons) {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      assert(rect.width >= 48 && rect.height >= 34 && rect.height <= 40, "View mode target is outside compact dimensions.");
      assert(Math.abs(rect.top - buttons[0].getBoundingClientRect().top) < 1, "View tabs wrapped.");
      assert(
        rect.top > trackRect.top && rect.bottom < trackRect.bottom,
        "View pill escapes its track.",
      );
      assert(
        button.scrollWidth <= button.clientWidth + 1,
        "View label is clipped inside its pill.",
      );
      assert(parseFloat(style.borderRadius) >= rect.height / 2, "View button lost its pill shape.");
    }
    return { track, buttons };
  };

  try {
    // A long title yields space to the capsule without adding another fixed row.
    for (const title of ["Family Board · Preview", "A long household calendar dashboard title"]) {
      card.setConfig({ ...originalConfig, title });
      await nextRender();
      const { track, buttons } = checkGeometry();
      const outer = track.getBoundingClientRect();
      const header = root.querySelector(".moran-wall-header").getBoundingClientRect();
      assert(header.height<=49, 'Long title creates another fixed header row.');
      for (const button of buttons) {
        button.scrollIntoView({block:'nearest',inline:'nearest'}); await nextRender();
        const rect = button.getBoundingClientRect();
        assert(rect.left >= outer.left && rect.right <= outer.right, "Long title hides a view.");
        assert(rect.top >= header.top && rect.bottom <= header.bottom, "Compact menu escapes header.");
      }
      buttons[4].click();
      await nextRender();
      assert(root.querySelector(".agenda"), "Agenda is not usable after header wrapping.");
    }
    card.setConfig(originalConfig);
    await nextRender();
    for (const theme of ["light", "dark"]) {
      themeRoot.dataset.theme = theme;
      await nextRender();
      for (let index = 0; index < views.length; index++) {
        const { track, buttons } = checkGeometry();
        buttons[index].click();
        await nextRender();
        await Promise.all(
          track
            .getAnimations({ subtree: true })
            .map((animation) => animation.finished.catch(() => {})),
        );
        assert(
          card._view === views[index] && root.querySelector(panels[index]),
          "View click did not render its panel.",
        );
        assert(
          track.querySelectorAll('[aria-selected="true"]').length === 1,
          "View selection is not exclusive.",
        );
        const selected = track.querySelector('[aria-selected="true"]');
        const style = getComputedStyle(selected);
        assert(selected === buttons[index], "The selected pill did not follow the clicked view.");
        assert(
          style.color === getComputedStyle(root.querySelector(".moran-wall-shell")).color,
          "Selected tab did not use neutral theme text.",
        );
        assert(
          style.backgroundColor !== getComputedStyle(track).backgroundColor,
          "Selected pill blends into its track.",
        );
        assert(style.boxShadow !== "none", "Selected pill lost its raised edge.");
        for (let i = 0; i < buttons.length; i++) {
          const divider = getComputedStyle(buttons[i], "::before");
          const expected = i > 0 && i !== index && i - 1 !== index;
          assert(
            (divider.content !== "none") === expected,
            "Dividers must appear only between unselected views.",
          );
        }
        selected.focus();
        await nextRender();
        const focus = getComputedStyle(selected);
        assert(
          root.activeElement === selected &&
            parseFloat(focus.outlineWidth) >= 2 &&
            parseFloat(focus.outlineOffset) < 0,
          `View keyboard focus is missing or clipped: ${views[index]}, active=${root.activeElement?.textContent?.trim()}, width=${focus.outlineWidth}, offset=${focus.outlineOffset}, focused=${selected.matches(':focus')}, document=${document.hasFocus()}.`,
        );
      }
    }

    // Longer localized labels must remain reachable without wrapping or page overflow.
    card.hass = { ...originalHass, locale: { ...originalHass.locale, language: "de" } };
    await nextRender();
    const { track, buttons } = checkGeometry();
    assert(
      buttons[0].textContent.trim() === "Tag",
      "Localized switcher labels were not exercised.",
    );
    for (const button of buttons) {
      button.scrollIntoView({ block: "nearest", inline: "nearest" });
      await nextRender();
      const rect = button.getBoundingClientRect();
      const outer = track.getBoundingClientRect();
      assert(
        rect.left >= outer.left && rect.right <= outer.right,
        "Localized view tab cannot be reached.",
      );
    }
    assert(
      themeRoot.scrollWidth <= themeRoot.clientWidth + 1,
      "Localized switcher overflowed the page.",
    );

    card.setConfig({ ...originalConfig, views: ["day", "week"] });
    await nextRender();
    assert(checkGeometry().buttons.length === 2, "View capsule ignored the enabled view subset.");
    card.setConfig({ ...originalConfig, views: ["day"] });
    await nextRender();
    assert(!root.querySelector(".switch"), "A single view rendered an unnecessary switcher.");
  } finally {
    themeRoot.dataset.theme = originalTheme;
    card.hass = originalHass;
    card.setConfig(originalConfig);
    await nextRender();
  }
}
