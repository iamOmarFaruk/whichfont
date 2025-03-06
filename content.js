(() => {
  // Prevent multiple script injections
  if (window.__WHICH_FONT_ALREADY_LOADED) {
    // If already loaded, do nothing
    return;
  }

  // Set flag - by default it's false, true means it's on and injected
  window.__WHICH_FONT_ALREADY_LOADED = true;

  // Create tooltip element
  let which_font_tooltip = document.createElement("div");
  which_font_tooltip.id = "which_font_tooltip";
  which_font_tooltip.style.cssText = `
    position: fixed;
    background-image: linear-gradient(180deg, #009AFF 0, rgb(18, 132, 208) 100%);
    color: white;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 5px;
    z-index: 2147483647;
    display: none;
    pointer-events: none;
    white-space: nowrap;
    font-weight: 600;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  `;
  // inject the tooltip element into the DOM
  document.body.appendChild(which_font_tooltip);

  // Create exit button
  let which_font_exitButton = document.createElement("button");
  which_font_exitButton.id = "which_font_exitButton";
  which_font_exitButton.style.cssText = `
    position: fixed;
    top: -60px; /* Initially hidden above */
    left: 50%;
    transform: translateX(-50%);
    background-image: linear-gradient(180deg, #009AFF 0, rgb(18, 132, 208) 100%);
    color: white;
    border: none;
    padding: 8px 16px 8px 12px;
    border-radius: 24px;
    cursor: pointer;
    z-index: 2147483647;
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    transition: 
      top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
      transform 0.3s ease,
      box-shadow 0.3s ease;
  `;

  // Show exit button after a short delay
  setTimeout(() => {
    which_font_exitButton.style.top = '20px';
  }, 100);

  // Exit button content with SVG icon and text
  which_font_exitButton.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s ease">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
    <span style="transition: color 0.3s ease">(esc) Exit Which Font</span>
  `;

  // Inject the exit button into the DOM
  document.body.appendChild(which_font_exitButton);

  // Add hover effect to the exit button - flag
  let which_font_isHoveringExit = false;

  // Add event listeners for hover effect
  which_font_exitButton.addEventListener('mouseover', () => {
    which_font_isHoveringExit = true;
    which_font_exitButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    which_font_exitButton.style.transform = 'translateX(-50%) scale(1.05)';
    which_font_exitButton.querySelector('svg').style.transform = 'rotate(90deg)';
    which_font_exitButton.querySelector('span').style.color = '#fff';
    which_font_tooltip.style.display = 'none';
  });

  // Add event listener for mouseout - means when the mouse leaves the button
  which_font_exitButton.addEventListener('mouseout', () => {
    which_font_isHoveringExit = false;
    which_font_exitButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    which_font_exitButton.style.transform = 'translateX(-50%) scale(1)';
    which_font_exitButton.querySelector('svg').style.transform = 'rotate(0deg)';
    which_font_exitButton.querySelector('span').style.color = 'white';
  });


  // Function to get the first font from the fontFamily string.
  // Helper function.
  function which_font_getFirstFont(fontFamily) {
    const fonts = fontFamily.split(",");
    let firstFont = fonts[0].trim().replace(/["']/g, "");
    return firstFont;
  }

  // Event handler for mousemove event - will show the tooltip.
  function which_font_mouseMoveHandler(event) {
    if (which_font_isHoveringExit) {
      which_font_tooltip.style.display = 'none';
      return;
    }

    const element = event.target;
    const computedStyle = window.getComputedStyle(element);
    const fontFamily = computedStyle.fontFamily;
    const detectedFont = which_font_getFirstFont(fontFamily);

    if (detectedFont) {
      which_font_tooltip.textContent = `Font Name: ${detectedFont}`;
      which_font_tooltip.style.display = "block";
      
      let x = event.clientX + 10;
      let y = event.clientY + 10;

      if (x + which_font_tooltip.offsetWidth > window.innerWidth) {
        x = event.clientX - 10 - which_font_tooltip.offsetWidth;
      }
      if (y + which_font_tooltip.offsetHeight > window.innerHeight) {
        y = event.clientY - 10 - which_font_tooltip.offsetHeight;
      }

      which_font_tooltip.style.left = `${x}px`;
      which_font_tooltip.style.top = `${y}px`;
    }
  }

  // Event handler for mouseout event - will hide the tooltip if hovering over the exit button.
  function which_font_mouseOutHandler() {
    if (!which_font_isHoveringExit) {
      which_font_tooltip.style.display = "none";
    }
  }

  // Function to exit the extension. call this function to exit the extension.
  function which_font_exit() {
    which_font_exitButton.style.top = '-60px';
    which_font_exitButton.addEventListener('transitionend', () => {
      which_font_tooltip.remove();
      which_font_exitButton.remove();
      document.removeEventListener("mousemove", which_font_mouseMoveHandler);
      document.removeEventListener("mouseout", which_font_mouseOutHandler);
      document.removeEventListener("keydown", which_font_exitKeyListener);
      window.__WHICH_FONT_ALREADY_LOADED = false; // means , make it ready next injection
      chrome.runtime.sendMessage({ type: 'EXIT_WHICH_FONT' }); // send message to background.js to update local storage flag value
    }, { once: true });
  }

  // esc key listener helper function.
  function which_font_exitKeyListener(event) {
    if (event.key === "Escape") {
      which_font_exit();
    }
  }

  // Add event listeners to the document for mousemove and mouseout events.
  document.addEventListener("mousemove", which_font_mouseMoveHandler);
  document.addEventListener("mouseout", which_font_mouseOutHandler);

  // Add event listener for keydown event - will exit the extension if esc key is pressed.
  document.addEventListener("keydown", which_font_exitKeyListener);
  which_font_exitButton.addEventListener("click", which_font_exit);


  // send message to background.js to exit the extension by clicking the icon
  chrome.runtime.onMessage.addListener((message) => {
    if (message.command === "whichfontexit") {
      which_font_exit();
    }
  });
})();
