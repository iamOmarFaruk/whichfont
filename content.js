(() => {
     // আগের কোড একই, শুধু position: fixed আর z-index বড় করে দাও
  if (window.__FONT_FINDER_ALREADY_LOADED) {
    console.log("Font Finder script is already loaded.");
    return;
  }
  window.__FONT_FINDER_ALREADY_LOADED = true;

  let tooltip = document.createElement("div");
  tooltip.id = "font-tooltip";
  tooltip.style.cssText = `
    position: fixed;
    background: rgba(0,0,0,0.9);
    color: white;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 5px;
    z-index: 2147483647;
    display: none;
    pointer-events: none;
    white-space: nowrap;
  `;
  document.body.appendChild(tooltip);

  let exitButton = document.createElement("button");
  exitButton.id = "exit-button";
  exitButton.textContent = "Exit Font Finder";
  exitButton.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: red;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 2147483647;
  `;
  document.body.appendChild(exitButton);
  
    // 🔹 সঠিকভাবে ব্যবহৃত ফন্ট চেক করার ফাংশন
    // function getRenderedFont(fontFamily) {
    //     const testElement = document.createElement("span");
    //     testElement.style.fontSize = "72px";
    //     testElement.style.position = "absolute";
    //     testElement.style.visibility = "hidden";
    //     document.body.appendChild(testElement);
  
    //     const fonts = fontFamily.split(",");
    //     for (let font of fonts) {
    //         font = font.trim().replace(/["']/g, "");
    //         testElement.style.fontFamily = font + ", monospace";
  
    //         const widthWithFont = testElement.offsetWidth;
    //         testElement.style.fontFamily = "monospace";
    //         const widthWithoutFont = testElement.offsetWidth;
  
    //         if (widthWithFont !== widthWithoutFont) {
    //             document.body.removeChild(testElement);
    //             return font;
    //         }
    //     }
    //     document.body.removeChild(testElement);
    //     return "Default (System Font)";
    // }

    function getFirstFont(fontFamily) {
      // প্রথমে ফন্ট স্ট্যাকটিকে কমা দিয়ে ভাগ করি
      const fonts = fontFamily.split(",");
  
      // প্রথম আইটেম নিলাম
      let firstFont = fonts[0].trim();
  
      // কোয়েট (") বা (') থাকলে সরিয়ে ফেলি
      firstFont = firstFont.replace(/["']/g, "");
  
      return firstFont;
  }

  
    // 🔹 মাউস মুভ করলে ফন্ট দেখানো এবং টুলটিপ কার্সরের সাথে মুভ করানো
    const mouseMoveHandler = (event) => {
        const element = event.target;
        const computedStyle = window.getComputedStyle(element);
        const fontFamily = computedStyle.fontFamily;
        // const detectedFont = getRenderedFont(fontFamily);
        const detectedFont = getFirstFont(fontFamily);
  
        if (detectedFont) {
            tooltip.textContent = `Font: ${detectedFont}`;
            tooltip.style.display = "block";
            tooltip.style.top = `${event.clientY + 10}px`;
            tooltip.style.left = `${event.clientX + 10}px`;
        }
    };
  
    // 🔹 মাউস সরলে টুলটিপ হাইড করা
    const mouseOutHandler = () => {
        tooltip.style.display = "none";
    };
  
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseout", mouseOutHandler);
  
    // 🔹 Exit করলে সবকিছু বন্ধ করা
    exitButton.addEventListener("click", () => {
        tooltip.remove();
        exitButton.remove();
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseout", mouseOutHandler);
        window.__FONT_FINDER_ALREADY_LOADED = false;
    });
  })();


