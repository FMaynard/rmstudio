// Generates a real playable WAV binary (Base64 encoded) with warm chords, bassline, and subtle vinyl crackle
export function generateVinylRipWavBase64(options: {
  durationSec?: number;
  baseFreq: number;
  chordType: "maj7" | "min7" | "dom7" | "m9";
  tempoBpm: number;
  crackleAmount?: number;
}): { base64: string; byteLength: number; durationSeconds: number } {
  const sampleRate = 22050; // 22.05kHz 16-bit mono WAV for fast DB storage & crisp warm playback
  const durationSec = options.durationSec ?? 14;
  const numSamples = sampleRate * durationSec;
  const bytesPerSample = 2;
  const dataSize = numSamples * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // fmt subchunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // PCM
  buffer.writeUInt16LE(1, 20); // AudioFormat 1 = PCM
  buffer.writeUInt16LE(1, 22); // NumChannels 1
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28); // ByteRate
  buffer.writeUInt16LE(bytesPerSample, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  const intervals =
    options.chordType === "maj7"
      ? [1, 1.25, 1.5, 1.875]
      : options.chordType === "min7"
        ? [1, 1.2, 1.5, 1.78]
        : options.chordType === "dom7"
          ? [1, 1.25, 1.5, 1.75]
          : [1, 1.2, 1.5, 1.78, 2.25];

  const progressionMultipliers = [1, 0.8409, 1.1224, 0.9438]; // I - VI - II - V turnaround
  const beatDuration = 60 / options.tempoBpm;
  const barDuration = beatDuration * 4;
  const crackle = options.crackleAmount ?? 0.018;

  // Deterministic pseudo-random for authentic vinyl surface dust/crackle
  let seed = Math.floor(options.baseFreq * 100);
  const nextRand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const barIndex = Math.floor(t / barDuration) % progressionMultipliers.length;
    const beatInBar = (t % barDuration) / beatDuration;
    const rootFreq = options.baseFreq * progressionMultipliers[barIndex];

    // Warm electric piano / organ pad chord
    let chordSignal = 0;
    for (let idx = 0; idx < intervals.length; idx++) {
      const freq = rootFreq * intervals[idx];
      const vibrato = Math.sin(2 * Math.PI * 4.8 * t) * 0.0025;
      chordSignal +=
        Math.sin(2 * Math.PI * freq * (1 + vibrato) * t) * (0.2 / intervals.length);
      // Warm 2nd harmonic (analog tube saturation feel)
      chordSignal +=
        Math.sin(2 * Math.PI * freq * 2 * t) * (0.045 / intervals.length);
    }

    // Upright / analog bassline on beats
    const bassFreq = rootFreq * 0.5;
    const beatEnv = Math.exp(-((beatInBar % 1) * 3.8));
    const bassSignal =
      (Math.sin(2 * Math.PI * bassFreq * t) * 0.34 +
        Math.sin(2 * Math.PI * bassFreq * 2 * t) * 0.08) *
      beatEnv;

    // Melodic arpeggio note
    const arpStep = Math.floor(beatInBar * 2) % intervals.length;
    const arpFreq = rootFreq * 2 * intervals[arpStep];
    const arpEnv = Math.exp(-(((beatInBar * 2) % 1) * 5.2));
    const melodySignal = Math.sin(2 * Math.PI * arpFreq * t) * 0.14 * arpEnv;

    // Subtle analog vinyl surface hiss + occasional needle pop
    const r = nextRand();
    const vinylHiss = (r - 0.5) * crackle;
    const needlePop = r > 0.9992 ? (r - 0.5) * 0.42 : 0;

    // Smooth fade-in and fade-out
    let masterEnv = 1;
    if (t < 0.35) masterEnv = t / 0.35;
    if (t > durationSec - 0.8) masterEnv = Math.max(0, (durationSec - t) / 0.8);

    const sampleFloat = Math.max(
      -0.96,
      Math.min(
        0.96,
        (chordSignal + bassSignal + melodySignal + vinylHiss + needlePop) *
          masterEnv
      )
    );
    const pcmVal = Math.floor(sampleFloat * 32767);
    buffer.writeInt16LE(pcmVal, 44 + i * 2);
  }

  return {
    base64: buffer.toString("base64"),
    byteLength: buffer.byteLength,
    durationSeconds: durationSec,
  };
}

export function generateVinylCoverDataUri(options: {
  title: string;
  author: string;
  genre: string;
  year: number;
  catalog: string;
  accentColor: string;
  secondaryColor: string;
  formatLabel: "SVG" | "JPG" | "PNG" | "GIF";
}): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0d0d10"/>
        <stop offset="55%" stop-color="${options.secondaryColor}"/>
        <stop offset="100%" stop-color="#050507"/>
      </linearGradient>
      <radialGradient id="glow" cx="72%" cy="28%" r="55%">
        <stop offset="0%" stop-color="${options.accentColor}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${options.accentColor}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="vinyl" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1a1a1f"/>
        <stop offset="85%" stop-color="#09090b"/>
        <stop offset="100%" stop-color="#27272a"/>
      </radialGradient>
    </defs>
    <rect width="600" height="600" fill="url(#bg)"/>
    <rect width="600" height="600" fill="url(#glow)"/>
    
    <!-- Retro Sleeve Frame -->
    <rect x="24" y="24" width="552" height="552" fill="none" stroke="${options.accentColor}" stroke-opacity="0.32" stroke-width="1.5"/>
    <rect x="34" y="34" width="532" height="532" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>

    <!-- Vinyl Groove Art Illustration -->
    <g transform="translate(330, 320)">
      <circle r="190" fill="url(#vinyl)" stroke="#3f3f46" stroke-width="1.5"/>
      <circle r="170" fill="none" stroke="#27272a" stroke-width="1" stroke-dasharray="12 6"/>
      <circle r="148" fill="none" stroke="#3f3f46" stroke-width="0.8"/>
      <circle r="125" fill="none" stroke="#27272a" stroke-width="1" stroke-dasharray="20 8"/>
      <circle r="102" fill="none" stroke="#3f3f46" stroke-width="0.8"/>
      <circle r="66" fill="${options.accentColor}"/>
      <circle r="54" fill="none" stroke="#09090b" stroke-width="1.5" stroke-opacity="0.45"/>
      <text x="0" y="-18" text-anchor="middle" fill="#09090b" font-family="monospace" font-weight="bold" font-size="11" letter-spacing="2">RM STUDIO</text>
      <text x="0" y="34" text-anchor="middle" fill="#09090b" font-family="monospace" font-weight="bold" font-size="10">33⅓ RPM</text>
      <circle r="11" fill="#050507"/>
    </g>

    <!-- Top Label Stamp -->
    <rect x="48" y="48" width="168" height="28" rx="4" fill="#09090b" fill-opacity="0.8" stroke="${options.accentColor}" stroke-opacity="0.5"/>
    <text x="132" y="66" text-anchor="middle" fill="${options.accentColor}" font-family="monospace" font-size="11" font-weight="bold" letter-spacing="1.5">${options.catalog} • ${options.year}</text>

    <text x="548" y="68" text-anchor="end" fill="#a1a1aa" font-family="monospace" font-size="12" letter-spacing="2">VINYL RIP HI-FI</text>

    <!-- Typography Block -->
    <rect x="44" y="405" width="512" height="142" rx="8" fill="#050507" fill-opacity="0.84" stroke="#ffffff" stroke-opacity="0.1"/>
    <text x="64" y="440" fill="${options.accentColor}" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="2.5">${options.genre.toUpperCase()} • ${options.year}</text>
    <text x="64" y="482" fill="#f4f4f5" font-family="serif" font-size="30" font-weight="bold">${escapeXml(options.title)}</text>
    <text x="64" y="518" fill="#a1a1aa" font-family="sans-serif" font-size="18" font-weight="500">${escapeXml(options.author)}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf-8").toString("base64")}`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
