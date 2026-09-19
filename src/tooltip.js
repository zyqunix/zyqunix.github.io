(() => {
  const WS = window.WS || { settings: {} };

  const raw = WS.settings.tooltipMap || '';
  const position = String(WS.settings.position || 'top').trim().toLowerCase();
  const delay = WS.settings.delay || 0;
  const followMouse = WS.settings.followMouse === true || WS.settings.followMouse === 'true';

  const bgColor = WS.settings.bgColor || 'rgba(0,0,0,0.85)';
  const fgColor = WS.settings.fgColor || '#ffffff';
  const fontFamily = WS.settings.fontFamily || 'inherit';
  const fontSize = WS.settings.fontSize || 13;
  const fontWeight = WS.settings.fontWeight || 'normal';
  const fontStyle = WS.settings.fontStyle || 'normal';
  const textDecoration = WS.settings.textDecoration || 'none';
  const letterSpacing = WS.settings.letterSpacing ?? 0;
  const borderWidth = WS.settings.borderWidth ?? 0;
  const borderStyle = WS.settings.borderStyle || 'solid';
  const borderColor = WS.settings.borderColor || '#000000';
  const borderRadius = WS.settings.borderRadius ?? 4;
  const borderImage = WS.settings.borderImage;
  const borderImageSlice = WS.settings.borderImageSlice || 30;
  const borderImageWidth = WS.settings.borderImageWidth || 10;
  const borderImageOutset = WS.settings.borderImageOutset || 0;

  const rules = raw.split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const idx = line.indexOf('|');
      if (idx === -1) return null;
      return {
        selector: line.slice(0, idx).trim(),
        text: line.slice(idx + 1).trim()
      };
    })
    .filter(Boolean);

  const tooltip = document.createElement('div');
  tooltip.className = 'ws-tooltip';
  Object.assign(tooltip.style, {
    position: 'fixed',
    padding: '4px 8px',
    background: bgColor,
    color: fgColor,
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    textDecoration: textDecoration,
    letterSpacing: `${letterSpacing}px`,
    borderRadius: `${borderRadius}px`,
    pointerEvents: 'none',
    opacity: '0',
    transition: 'opacity 0.15s ease',
    zIndex: '999999',
    maxWidth: '240px',
    display: 'none'
  });

  if (borderImage && borderImage.url) {
    Object.assign(tooltip.style, {
      borderStyle: 'solid',
      borderWidth: `${borderImageWidth}px`,
      borderImageSource: `url(${borderImage.url})`,
      borderImageSlice: `${borderImageSlice}`,
      borderImageRepeat: 'stretch',
      borderImageOutset: `${borderImageOutset}`
    });
  } else if (borderWidth > 0) {
    Object.assign(tooltip.style, {
      borderStyle: borderStyle,
      borderWidth: `${borderWidth}px`,
      borderColor: borderColor
    });
  }

  document.body.appendChild(tooltip);

  let showTimer = null;
  const CURSOR_OFFSET = 14;

  function placeTooltip(target) {
    const rect = target.getBoundingClientRect();
    const tRect = tooltip.getBoundingClientRect();
    let top, left;
    switch (position) {
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2 - tRect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tRect.height / 2;
        left = rect.left - tRect.width - 8;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tRect.height / 2;
        left = rect.right + 8;
        break;
      default:
        top = rect.top - tRect.height - 8;
        left = rect.left + rect.width / 2 - tRect.width / 2;
    }
    tooltip.style.top = `${Math.max(4, top)}px`;
    tooltip.style.left = `${Math.max(4, left)}px`;
  }

  function placeAtCursor(x, y) {
    const tRect = tooltip.getBoundingClientRect();
    let top, left;

    switch (position) {
      case 'bottom':
        top = y + CURSOR_OFFSET;
        left = x - tRect.width / 2;
        break;
      case 'left':
        top = y - tRect.height / 2;
        left = x - tRect.width - CURSOR_OFFSET;
        break;
      case 'right':
        top = y - tRect.height / 2;
        left = x + CURSOR_OFFSET;
        break;
      default:
        top = y - tRect.height - CURSOR_OFFSET;
        left = x - tRect.width / 2;
    }

    if (left + tRect.width > window.innerWidth) left = window.innerWidth - tRect.width - 4;
    if (left < 0) left = 4;
    if (top + tRect.height > window.innerHeight) top = window.innerHeight - tRect.height - 4;
    if (top < 0) top = 4;

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  function bind(el, text) {
    let lastX = 0, lastY = 0;

    el.addEventListener('mouseenter', (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      clearTimeout(showTimer);
      showTimer = setTimeout(() => {
        tooltip.textContent = text;
        tooltip.style.opacity = '0';
        tooltip.style.display = 'block';
        if (followMouse) {
          placeAtCursor(lastX, lastY);
        } else {
          placeTooltip(el);
        }
        requestAnimationFrame(() => { tooltip.style.opacity = '1'; });
      }, delay);
    });

    if (followMouse) {
      el.addEventListener('mousemove', (e) => {
        if (tooltip.style.opacity === '1') {
          placeAtCursor(e.clientX, e.clientY);
        }
      });
    }

    el.addEventListener('mouseleave', () => {
      clearTimeout(showTimer);
      tooltip.style.opacity = '0';
    });
  }

  rules.forEach(({ selector, text }) => {
    document.querySelectorAll(selector).forEach(el => bind(el, text));
  });
})();
