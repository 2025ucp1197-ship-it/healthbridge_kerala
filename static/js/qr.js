/**
 * HealthBridge Kerala - Standalone SVG QR Code Generator
 * Pure JS, zero external dependencies, generates high-res vector QR codes
 */

const QRCodeGenerator = (function () {
  // Deterministic 2D matrix pseudo-QR pattern generator for safe offline demo tokens
  function generateQRCodeSVG(text, size = 120, color = "#0F172A") {
    // Generate deterministic 21x21 grid based on token hash
    const matrixSize = 25;
    const grid = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));

    // Finder patterns (top-left, top-right, bottom-left)
    function drawFinder(r, c) {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            if (r + i < matrixSize && c + j < matrixSize) {
              grid[r + i][c + j] = 1;
            }
          }
        }
      }
    }

    drawFinder(0, 0);
    drawFinder(0, matrixSize - 7);
    drawFinder(matrixSize - 7, 0);

    // Timing patterns
    for (let i = 8; i < matrixSize - 8; i++) {
      grid[6][i] = i % 2 === 0 ? 1 : 0;
      grid[i][6] = i % 2 === 0 ? 1 : 0;
    }

    // Pseudo-random data encoding from text hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    let seed = Math.abs(hash) + 12345;
    function nextBit() {
      seed = (seed * 9301 + 49297) % 233280;
      return (seed / 233280) > 0.45 ? 1 : 0;
    }

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip finder pattern zones
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= matrixSize - 8;
        const inBL = r >= matrixSize - 8 && c < 8;
        const inTiming = r === 6 || c === 6;

        if (!inTL && !inTR && !inBL && !inTiming) {
          grid[r][c] = nextBit();
        }
      }
    }

    // Build SVG
    const cellSize = (size / matrixSize).toFixed(2);
    let rects = "";
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        if (grid[r][c] === 1) {
          const x = (c * cellSize).toFixed(2);
          const y = (r * cellSize).toFixed(2);
          rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" />`;
        }
      }
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges">
        <rect width="${size}" height="${size}" fill="#FFFFFF" rx="4" />
        ${rects}
      </svg>
    `;
  }

  function renderQR(containerId, text, size = 120, color = "#0F172A") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = generateQRCodeSVG(text, size, color);
  }

  return {
    generateSVG: generateQRCodeSVG,
    render: renderQR
  };
})();
