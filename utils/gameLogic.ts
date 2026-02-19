import { Tile, GridSize } from '../types';

export const GRID_SIZE = 3; // 3x3 Puzzle

/**
 * Creates the initial solved state of tiles.
 */
export const createSolvedTiles = (): Tile[] => {
  const tiles: Tile[] = [];
  // For a 3x3 grid, we have 9 positions. The last one (index 8) is empty.
  // Tiles are 0-7.
  for (let i = 0; i < GRID_SIZE * GRID_SIZE - 1; i++) {
    tiles.push({
      id: i,
      currentPos: i,
      correctPos: i,
    });
  }
  return tiles;
};

/**
 * Shuffles the tiles using valid moves to ensure solvability.
 */
export const shuffleTiles = (tiles: Tile[]): { tiles: Tile[], emptyPos: number } => {
  let currentTiles = JSON.parse(JSON.stringify(tiles)); // Deep copy
  let emptyPos = GRID_SIZE * GRID_SIZE - 1;
  let previousPos = -1;

  // Perform a large number of random valid moves
  const moveCount = 100;

  for (let i = 0; i < moveCount; i++) {
    const validMoves = getValidMoves(emptyPos);
    // Don't undo the immediate previous move to encourage mixing
    const filteredMoves = validMoves.filter(pos => pos !== previousPos);
    const nextPos = filteredMoves.length > 0 
      ? filteredMoves[Math.floor(Math.random() * filteredMoves.length)]
      : validMoves[Math.floor(Math.random() * validMoves.length)];

    // Swap
    const tileToMove = currentTiles.find((t: Tile) => t.currentPos === nextPos);
    if (tileToMove) {
      tileToMove.currentPos = emptyPos;
      previousPos = emptyPos;
      emptyPos = nextPos;
    }
  }

  return { tiles: currentTiles, emptyPos };
};

/**
 * Returns indices of adjacent cells to the empty cell.
 */
const getValidMoves = (emptyPos: number): number[] => {
  const moves: number[] = [];
  const row = Math.floor(emptyPos / GRID_SIZE);
  const col = emptyPos % GRID_SIZE;

  if (row > 0) moves.push(emptyPos - GRID_SIZE); // Up
  if (row < GRID_SIZE - 1) moves.push(emptyPos + GRID_SIZE); // Down
  if (col > 0) moves.push(emptyPos - 1); // Left
  if (col < GRID_SIZE - 1) moves.push(emptyPos + 1); // Right

  return moves;
};

/**
 * Generates the Softplan themed puzzle image on a canvas.
 * Now async to handle image loading.
 */
export const generatePuzzleImage = (text: string): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const size = 600; // High resolution
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // Background Gradient (Softplan Blue)
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#5959F6'); // Updated to #5959F6
    gradient.addColorStop(1, '#002a5c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Abstract Geometric Shapes (Tech Feel)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(size, 0, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 181, 226, 0.1)'; // Softplan Light Blue
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(size/2, size/2);
    ctx.lineTo(size, size);
    ctx.fill();

    // Grid Lines (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    const step = size / GRID_SIZE;
    for (let i = 1; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * step, 0);
        ctx.lineTo(i * step, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * step);
        ctx.lineTo(size, i * step);
        ctx.stroke();
    }

    // Text Wrapping logic - Updated to Sora Font
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Sora, sans-serif'; // Updated to Sora
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const words = text.split(' ');
    let line = '';
    // Moved y slightly up to make room for logo
    let y = size / 2 - 60; 
    const lineHeight = 60;
    const maxWidth = size - 80;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, size / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, size / 2, y);

    // Logo Handling
    const logoUrl = "https://www.softplan.com.br/wp-content/uploads/2025/11/Logo-1.png.webp";
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Important for canvas manipulation
    
    img.onload = () => {
      try {
        const logoWidth = 200;
        const scale = logoWidth / img.width;
        const logoHeight = img.height * scale;
        
        ctx.save();
        // Make logo white to fit on blue background
        ctx.filter = 'brightness(0) invert(1)'; 
        ctx.drawImage(img, (size - logoWidth) / 2, size - logoHeight - 40, logoWidth, logoHeight);
        ctx.restore();
        
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        // Fallback if CORS fails after load or other error
        console.warn("Could not draw logo to canvas", e);
        drawFallbackLogo(ctx, size);
        resolve(canvas.toDataURL('image/png'));
      }
    };

    img.onerror = () => {
      console.warn("Failed to load Softplan logo");
      drawFallbackLogo(ctx, size);
      resolve(canvas.toDataURL('image/png'));
    };

    img.src = logoUrl;
  });
};

const drawFallbackLogo = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.font = '24px Sora, sans-serif';
    ctx.fillStyle = '#00b5e2';
    ctx.fillText("SOFTPLAN", size / 2, size - 40);
};