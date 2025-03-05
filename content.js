(() => {
  // যদি আগেই লোড হয়ে থাকে, আবার লোড করব না
  if (window.__FONT_FINDER_ALREADY_LOADED) {
    console.log("Font Finder script is already loaded.");
    return;
  }
  window.__FONT_FINDER_ALREADY_LOADED = true;

  // টুলটিপ বানাই
  let tooltip = document.createElement("div");
  tooltip.id = "font-tooltip";
  tooltip.style.cssText = `
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
  `;
  document.body.appendChild(tooltip);

  // এক্সিট বাটন বানাই
  let exitButton = document.createElement("button");
  exitButton.id = "exit-button";
  exitButton.style.cssText = `
    position: fixed;
    top: -60px; /* শুরুতে উপরে লুকানো */
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
    transition: 
      top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
      transform 0.3s ease,
      box-shadow 0.3s ease;
  `;

  // কিছু পরে নিচে নিয়ে এসে (slide down) দেখাব
  setTimeout(() => {
    exitButton.style.top = '20px';
  }, 100);

  // এক্সিট বাটনের কন্টেন্ট
  exitButton.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s ease">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
    <span style="transition: color 0.3s ease">(esc) Exit Which Font</span>
  `;
  document.body.appendChild(exitButton);

  // এই ফ্ল্যাগটি বলে দেবে আমরা এক্সিট বাটনে হোভার করে আছি কিনা
  let isHoveringExit = false;

  // এক্সিট বাটনে মাউস ঢুকলে
  exitButton.addEventListener('mouseover', () => {
    isHoveringExit = true;
    exitButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    exitButton.style.transform = 'translateX(-50%) scale(1.05)';
    exitButton.querySelector('svg').style.transform = 'rotate(90deg)';
    exitButton.querySelector('span').style.color = '#fff';
    // টুলটিপ লুকিয়ে রাখি
    tooltip.style.display = 'none';
  });

  // এক্সিট বাটনে মাউস বের হয়ে গেলে
  exitButton.addEventListener('mouseout', () => {
    isHoveringExit = false;
    exitButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    exitButton.style.transform = 'translateX(-50%) scale(1)';
    exitButton.querySelector('svg').style.transform = 'rotate(0deg)';
    exitButton.querySelector('span').style.color = 'white';
    // বের হয়ে গেলে আবার টুলটিপ দেখা যাবে (পরবর্তী মাউস মুভে)
  });

  // অতিরিক্ত CSS, চাইলে রাখুন
  const style = document.createElement("style");
  style.textContent = `
    #exit-button:hover ~ #font-tooltip {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  // ফন্ট স্ট্যাক থেকে প্রথম ফন্টটি খুঁজে বের করার ফাংশন
  function getFirstFont(fontFamily) {
    const fonts = fontFamily.split(",");
    let firstFont = fonts[0].trim();
    firstFont = firstFont.replace(/["']/g, "");
    return firstFont;
  }

  // মাউস নড়লেই টুলটিপ আপডেট ও দেখানো
  function mouseMoveHandler(event) {
    // যদি এক্সিট বাটনে hover করে থাকি, সরাসরি টুলটিপ লুকিয়ে রাখি
    if (isHoveringExit) {
      tooltip.style.display = 'none';
      return;
    }

    // অন্যথায়, টুলটিপ দেখাই
    const element = event.target;
    const computedStyle = window.getComputedStyle(element);
    const fontFamily = computedStyle.fontFamily;
    const detectedFont = getFirstFont(fontFamily);

    if (detectedFont) {
      tooltip.textContent = `Font Name : ${detectedFont}`;
      tooltip.style.display = "block";
      tooltip.style.top = `${event.clientY + 10}px`;
      tooltip.style.left = `${event.clientX + 10}px`;
    }
  }

  // মাউস উপাদান থেকে বের হলে টুলটিপ হাইড করা
  function mouseOutHandler() {
    if (!isHoveringExit) {
      tooltip.style.display = "none";
    }
  }

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseout", mouseOutHandler);

  // স্ক্রিপ্ট বন্ধ করার ফাংশন
  function exitFontFinder() {
    // Slide-up অ্যানিমেশন
    exitButton.style.top = '-60px';
    // ট্রানজিশন শেষ হলে সমস্ত ইভেন্ট ও ডম এলিমেন্ট সরিয়ে ফেলি
    exitButton.addEventListener('transitionend', () => {
      tooltip.remove();
      exitButton.remove();
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseout", mouseOutHandler);
      document.removeEventListener("keydown", exitKeyListener);
      window.__FONT_FINDER_ALREADY_LOADED = false;
    }, { once: true });
  }

  // Esc প্রেস করলে, অথবা ক্লিক করলে বন্ধ
  function exitKeyListener(event) {
    if (event.key === "Escape") {
      exitFontFinder();
    }
  }

  document.addEventListener("keydown", exitKeyListener);
  exitButton.addEventListener("click", exitFontFinder);

})();