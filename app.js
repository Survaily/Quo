const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const preview = document.getElementById('preview');
const transformBtn = document.getElementById('transformBtn');
const resultSection = document.getElementById('resultSection');
const resultLabel = document.getElementById('resultLabel');
const outputCanvas = document.getElementById('outputCanvas');
const downloadBtn = document.getElementById('downloadBtn');

let loadedImage = null;

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      loadedImage = img;
      preview.src = e.target.result;
      preview.hidden = false;
      uploadPrompt.hidden = true;
      transformBtn.disabled = false;
      resultSection.hidden = true;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

transformBtn.addEventListener('click', () => {
  if (!loadedImage) return;

  const modes = ['simulation', 'book', 'videogame', 'video'];
  const mode = modes[Math.floor(Math.random() * modes.length)];

  const canvas = outputCanvas;
  const ctx = canvas.getContext('2d');

  const maxW = 800;
  const scale = loadedImage.width > maxW ? maxW / loadedImage.width : 1;
  canvas.width = Math.round(loadedImage.width * scale);
  canvas.height = Math.round(loadedImage.height * scale);

  ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);

  switch (mode) {
    case 'simulation': applySimulation(ctx, canvas); break;
    case 'book':       applyBook(ctx, canvas); break;
    case 'videogame':  applyVideoGame(ctx, canvas); break;
    case 'video':      applyVideo(ctx, canvas); break;
  }

  const labels = {
    simulation: 'Simulation',
    book: 'Book',
    videogame: 'Video Game',
    video: 'Video',
  };

  resultLabel.textContent = labels[mode];
  resultLabel.className = 'result-label ' + mode;
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: 'smooth' });
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'quo-transformed.png';
  link.href = outputCanvas.toDataURL('image/png');
  link.click();
});

function applySimulation(ctx, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;

  for (let i = 0; i < d.length; i += 4) {
    d[i]     = Math.min(255, d[i] * 0.6 + 60);
    d[i + 1] = Math.min(255, d[i + 1] * 0.8 + 40);
    d[i + 2] = Math.min(255, d[i + 2] * 1.2 + 30);
    d[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.strokeStyle = 'rgba(0, 200, 255, 0.15)';
  ctx.lineWidth = 1;
  const gridSize = 30;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(0, 200, 255, 0.7)';
  ctx.font = 'bold 11px monospace';
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * (w - 100) + 10;
    const y = Math.random() * (h - 20) + 15;
    const vals = [
      `T: ${(Math.random() * 40 + 10).toFixed(1)}C`,
      `P: ${(Math.random() * 100).toFixed(1)}%`,
      `V: ${(Math.random() * 999).toFixed(0)}m/s`,
      `E: ${(Math.random() * 50).toFixed(2)}kJ`,
      `ID:${Math.floor(Math.random() * 9999)}`,
    ];
    ctx.fillText(vals[Math.floor(Math.random() * vals.length)], x, y);
  }

  drawCornerBrackets(ctx, w, h, 'rgba(0, 200, 255, 0.4)');

  ctx.fillStyle = 'rgba(0, 200, 255, 0.8)';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('SIM MODE  |  ACTIVE', 12, h - 12);

  const crossX = w / 2, crossY = h / 2;
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(crossX - 20, crossY); ctx.lineTo(crossX + 20, crossY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(crossX, crossY - 20); ctx.lineTo(crossX, crossY + 20); ctx.stroke();
  ctx.beginPath(); ctx.arc(crossX, crossY, 14, 0, Math.PI * 2); ctx.stroke();
}

function applyBook(ctx, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;

  for (let i = 0; i < d.length; i += 4) {
    const gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
    d[i]     = Math.min(255, gray * 1.1 + 30);
    d[i + 1] = Math.min(255, gray * 0.95 + 20);
    d[i + 2] = Math.min(255, gray * 0.75 + 10);
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.fillStyle = 'rgba(120, 80, 30, 0.12)';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const alpha = Math.random() * 0.08;
    ctx.fillStyle = `rgba(80, 50, 20, ${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }

  const vigGrad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7);
  vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
  vigGrad.addColorStop(1, 'rgba(30,15,0,0.5)');
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, w, h);

  const margin = 40;
  ctx.strokeStyle = 'rgba(100, 70, 30, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);
  ctx.strokeRect(margin + 6, margin + 6, w - margin * 2 - 12, h - margin * 2 - 12);

  ctx.fillStyle = 'rgba(80, 50, 20, 0.5)';
  ctx.font = 'italic 14px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Chapter I', w / 2, margin + 28);
  ctx.textAlign = 'start';

  ctx.fillStyle = 'rgba(60, 40, 15, 0.25)';
  ctx.font = '10px Georgia, serif';
  const lineH = 14;
  const textTop = h * 0.65;
  for (let i = 0; i < 8; i++) {
    const lineW = (0.5 + Math.random() * 0.4) * (w - margin * 2 - 40);
    ctx.fillRect(margin + 20, textTop + i * lineH, lineW, 2);
  }
}

function applyVideoGame(ctx, canvas) {
  const w = canvas.width;
  const h = canvas.height;

  const pixelSize = 5;
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  const sw = Math.ceil(w / pixelSize);
  const sh = Math.ceil(h / pixelSize);
  tempCanvas.width = sw;
  tempCanvas.height = sh;

  tempCtx.drawImage(canvas, 0, 0, sw, sh);
  const small = tempCtx.getImageData(0, 0, sw, sh);
  const sd = small.data;

  for (let i = 0; i < sd.length; i += 4) {
    sd[i]     = Math.round(sd[i] / 32) * 32;
    sd[i + 1] = Math.round(sd[i + 1] / 32) * 32;
    sd[i + 2] = Math.round(sd[i + 2] / 32) * 32;
    sd[i]     = Math.min(255, sd[i] * 1.3);
    sd[i + 1] = Math.min(255, sd[i + 1] * 1.3);
    sd[i + 2] = Math.min(255, sd[i + 2] * 1.3);
  }
  tempCtx.putImageData(small, 0, 0);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, w, h);

  for (let y = 0; y < h; y += 3) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, y, w, 1);
  }

  const barH = 8;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, w, 36);

  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(10, 10, 120, barH);
  ctx.fillStyle = '#2ecc71';
  ctx.fillRect(10, 22, 80, barH);

  ctx.fillStyle = '#ff4444';
  const hpW = 60 + Math.random() * 60;
  ctx.fillRect(10, 10, hpW, barH);
  ctx.fillStyle = '#44ff44';
  const mpW = 30 + Math.random() * 50;
  ctx.fillRect(10, 22, mpW, barH);

  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, 120, barH);
  ctx.strokeRect(10, 22, 80, barH);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('HP', 135, 18);
  ctx.fillText('MP', 95, 30);

  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'right';
  const score = Math.floor(Math.random() * 999999);
  ctx.fillText(`SCORE: ${score.toString().padStart(6, '0')}`, w - 10, 18);

  const level = Math.floor(Math.random() * 50) + 1;
  ctx.fillText(`LV ${level}`, w - 10, 30);
  ctx.textAlign = 'start';

  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, h - 50, w, 50);
  ctx.fillStyle = '#fff';
  ctx.font = '12px monospace';
  const messages = [
    'A wild enemy appeared!',
    'You found a rare item!',
    'Quest updated: Find the artifact.',
    'New area unlocked!',
    'Critical hit!',
  ];
  ctx.fillText('> ' + messages[Math.floor(Math.random() * messages.length)], 12, h - 20);

  drawMinimap(ctx, w, h);
}

function applyVideo(ctx, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;

  for (let i = 0; i < d.length; i += 4) {
    const boost = 1.15;
    d[i]     = clamp(((d[i] / 255 - 0.5) * boost + 0.5) * 255);
    d[i + 1] = clamp(((d[i + 1] / 255 - 0.5) * boost + 0.5) * 255);
    d[i + 2] = clamp(((d[i + 2] / 255 - 0.5) * boost + 0.5) * 255);
  }
  ctx.putImageData(imageData, 0, 0);

  const letterbox = Math.round(h * 0.1);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, letterbox);
  ctx.fillRect(0, h - letterbox, w, letterbox);

  ctx.fillStyle = 'rgba(255, 0, 0, 0.85)';
  ctx.beginPath();
  ctx.arc(w - 30, letterbox + 18, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('REC', w - 60, letterbox + 22);

  const mins = Math.floor(Math.random() * 60);
  const secs = Math.floor(Math.random() * 60);
  const frames = Math.floor(Math.random() * 30);
  const timecode = `${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  ctx.fillStyle = '#fff';
  ctx.font = '13px monospace';
  ctx.fillText(timecode, 14, letterbox + 22);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1;
  const third = w / 3;
  const thirdH = (h - letterbox * 2) / 3;
  for (let i = 1; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(third * i, letterbox);
    ctx.lineTo(third * i, h - letterbox);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, letterbox + thirdH * i);
    ctx.lineTo(w, letterbox + thirdH * i);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, h - letterbox - 30, w, 30);
  ctx.fillStyle = '#555';
  ctx.fillRect(14, h - letterbox - 22, w - 28, 4);
  const progress = Math.random() * 0.8 + 0.1;
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(14, h - letterbox - 22, (w - 28) * progress, 4);
  ctx.beginPath();
  ctx.arc(14 + (w - 28) * progress, h - letterbox - 20, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  const playX = w / 2;
  const playY = (h - letterbox * 2) / 2 + letterbox;
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.moveTo(playX - 18, playY - 22);
  ctx.lineTo(playX - 18, playY + 22);
  ctx.lineTo(playX + 22, playY);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

function drawCornerBrackets(ctx, w, h, color) {
  const s = 25;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const corners = [
    [0, 0, s, 0, 0, s],
    [w, 0, -s, 0, 0, s],
    [0, h, s, 0, 0, -s],
    [w, h, -s, 0, 0, -s],
  ];
  for (const [cx, cy, dx1, dy1, dx2, dy2] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx + dx1, cy + dy1);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx2, cy + dy2);
    ctx.stroke();
  }
}

function drawMinimap(ctx, w, h) {
  const mmW = 70, mmH = 70;
  const mmX = w - mmW - 10, mmY = h - 60 - mmH;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(mmX, mmY, mmW, mmH);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.strokeRect(mmX, mmY, mmW, mmH);

  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = ['#4a4', '#484', '#585'][Math.floor(Math.random() * 3)];
    ctx.fillRect(
      mmX + Math.random() * (mmW - 10),
      mmY + Math.random() * (mmH - 10),
      4 + Math.random() * 8,
      4 + Math.random() * 8
    );
  }

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(mmX + mmW / 2, mmY + mmH / 2, 3, 0, Math.PI * 2);
  ctx.fill();
}

function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function pad(n) {
  return n.toString().padStart(2, '0');
}
