// SANS 347 Graph Data - All 9 Figures
// Each graph uses log-log scale with PS (Design Pressure) on Y-axis
// and V (Volume) or DN (Nominal Diameter) on X-axis

export interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  labelPosition?: 'start' | 'middle' | 'end';
  color?: string;
}

export interface CategoryZone {
  label: string;
  x: number;
  y: number;
}

export interface GraphConfig {
  id: number;
  title: string;
  subtitle: string;
  equipmentType: string;
  fluidType: string;
  xAxisLabel: string;
  yAxisLabel: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  lines: LineSegment[];
  categoryZones: CategoryZone[];
  footerText: string;
  applicationText: string;
  xVariable: 'V' | 'DN';
}

// Figure 1 - Vessels - Dangerous Gas
const figure1: GraphConfig = {
  id: 1,
  title: 'Pressure Vessels',
  subtitle: 'Dangerous gas',
  equipmentType: 'Pressure Vessels',
  fluidType: 'Dangerous gas',
  xAxisLabel: 'Volume (V) L',
  yAxisLabel: 'Design pressure (PS) kPa',
  xMin: 0.1,
  xMax: 10000,
  yMin: 0.1,
  yMax: 400000,
  lines: [
    // PS = 100,000 horizontal
    { x1: 0.1, y1: 100000, x2: 1, y2: 100000, label: 'PS = 100 000', color: '#dc2626' },
    // PS*V = 100,000 diagonal
    { x1: 1, y1: 100000, x2: 2000, y2: 50, label: 'PS×V = 100 000', color: '#dc2626' },
    // PS = 20,000 horizontal
    { x1: 0.1, y1: 20000, x2: 1, y2: 20000, label: 'PS = 20 000', color: '#dc2626' },
    // PS*V = 20,000 diagonal
    { x1: 1, y1: 20000, x2: 400, y2: 50, label: 'PS×V = 20 000', color: '#dc2626' },
    // V = 1 vertical
    { x1: 1, y1: 2000, x2: 1, y2: 100000, label: 'V = 1', color: '#dc2626' },
    // PS*V = 5,000 diagonal
    { x1: 1, y1: 5000, x2: 100, y2: 50, label: 'PS×V = 5 000', color: '#dc2626' },
    // PS = 50 horizontal
    { x1: 0.1, y1: 50, x2: 100000, y2: 50, label: 'PS = 50', color: '#dc2626' },
    // PS*V = 2,000 diagonal
    { x1: 1, y1: 2000, x2: 40, y2: 50, label: 'PS×V = 2 000', color: '#dc2626' },
  ],
  categoryZones: [
    { label: 'SEP', x: 0.3, y: 300 },
    { label: 'Not regulated', x: 30, y: 5 },
    { label: 'I', x: 30, y: 55 },
    { label: 'II', x: 200, y: 55 },
    { label: 'III', x: 2000, y: 55 },
    { label: 'IV', x: 2000, y: 30000 },
  ],
  footerText: 'Figure 1 — Graph for vessels — Dangerous gas',
  applicationText: 'Vessels that fall within categories I or II and that are intended to contain an unstable gas, shall be classified as category III (see figure 1).',
  xVariable: 'V',
};

// Figure 2 - Vessels - Non-dangerous Gas
const figure2: GraphConfig = {
  id: 2,
  title: 'Pressure Vessels',
  subtitle: 'Nondangerous gas',
  equipmentType: 'Pressure Vessels',
  fluidType: 'Nondangerous gas',
  xAxisLabel: 'Volume (V) L',
  yAxisLabel: 'Design pressure (PS) kPa',
  xMin: 0.1,
  xMax: 10000,
  yMin: 0.1,
  yMax: 500000,
  lines: [
    // PS = 300,000 horizontal
    { x1: 0.1, y1: 300000, x2: 1, y2: 300000, label: 'PS = 300 000', color: '#dc2626' },
    // PS*V = 300,000 diagonal
    { x1: 1, y1: 300000, x2: 750, y2: 400, label: 'PS×V = 300 000', color: '#dc2626' },
    // PS = 100,000 horizontal
    { x1: 0.1, y1: 100000, x2: 1, y2: 100000, label: 'PS = 100 000', color: '#dc2626' },
    // PS*V = 100,000 diagonal
    { x1: 1, y1: 100000, x2: 2000, y2: 50, label: 'PS×V = 100 000', color: '#dc2626' },
    // PS = 50 horizontal
    { x1: 0.1, y1: 50, x2: 10000, y2: 50, label: 'PS = 50', color: '#dc2626' },
    // PS*V = 20,000 diagonal from PS=50 up
    { x1: 1, y1: 20000, x2: 400, y2: 50, label: 'PS×V = 20 000', color: '#dc2626' },
    // PS = 400 horizontal
    { x1: 750, y1: 400, x2: 10000, y2: 400, label: 'PS = 400', color: '#dc2626' },
    // PS*V = 5,000 diagonal
    { x1: 1, y1: 5000, x2: 100, y2: 50, label: 'PS×V = 5 000', color: '#dc2626' },
    // V = 1 vertical
    { x1: 1, y1: 5000, x2: 1, y2: 100000, label: 'V = 1', color: '#dc2626' },
  ],
  categoryZones: [
    { label: 'SEP', x: 0.3, y: 300 },
    { label: 'Not regulated', x: 30, y: 5 },
    { label: 'I', x: 30, y: 55 },
    { label: 'II', x: 200, y: 55 },
    { label: 'III', x: 2000, y: 55 },
    { label: 'IV', x: 2000, y: 30000 },
  ],
  footerText: 'Figure 2 — Graph for vessels — Nondangerous gas',
  applicationText: 'Portable fire extinguishers up to 3 000 kPa shall be classified as at least category III (see figure 2).',
  xVariable: 'V',
};

// Figure 3 - Vessels - Dangerous Liquids
const figure3: GraphConfig = {
  id: 3,
  title: 'Pressure Vessels',
  subtitle: 'Dangerous liquids',
  equipmentType: 'Pressure Vessels',
  fluidType: 'Dangerous liquids',
  xAxisLabel: 'Volume (V) L',
  yAxisLabel: 'Design pressure (PS) kPa',
  xMin: 0.1,
  xMax: 10000,
  yMin: 0.1,
  yMax: 500000,
  lines: [
    // PS = 50,000 horizontal
    { x1: 0.1, y1: 50000, x2: 10000, y2: 50000, label: 'PS = 50 000', color: '#dc2626' },
    // PS*V = 20,000 diagonal
    { x1: 1, y1: 20000, x2: 400, y2: 50, label: 'PS×V = 20 000', color: '#dc2626' },
    // PS = 1,000 horizontal
    { x1: 20, y1: 1000, x2: 10000, y2: 1000, label: 'PS = 1 000', color: '#dc2626' },
    // PS = 50 horizontal
    { x1: 0.1, y1: 50, x2: 10000, y2: 50, label: 'PS = 50', color: '#dc2626' },
    // V = 1 vertical
    { x1: 1, y1: 20000, x2: 1, y2: 500000, label: 'V = 1', color: '#dc2626' },
  ],
  categoryZones: [
    { label: 'SEP', x: 0.3, y: 300 },
    { label: 'Not regulated', x: 30, y: 5 },
    { label: 'I', x: 500, y: 100 },
    { label: 'II', x: 500, y: 5000 },
    { label: 'III', x: 3000, y: 50000 },
  ],
  footerText: 'Figure 3 — Graph for vessels — Dangerous liquids',
  applicationText: 'Figure 3 shows the various categories for dangerous liquids contained in vessels.',
  xVariable: 'V',
};

// Figure 4 - Vessels - Non-dangerous Liquids
const figure4: GraphConfig = {
  id: 4,
  title: 'Pressure Vessels',
  subtitle: 'Nondangerous liquids',
  equipmentType: 'Pressure Vessels',
  fluidType: 'Nondangerous liquids',
  xAxisLabel: 'Volume (V) L',
  yAxisLabel: 'Design pressure (PS) kPa',
  xMin: 0.1,
  xMax: 100000,
  yMin: 0.1,
  yMax: 500000,
  lines: [
    // PS = 50 horizontal
    { x1: 0.1, y1: 50, x2: 100000, y2: 50, label: 'PS = 50', color: '#dc2626' },
    // PS*V = 1,000,000 diagonal
    { x1: 10, y1: 100000, x2: 1000, y2: 1000, label: 'PS×V = 1 000 000', color: '#dc2626' },
    // PS = 100,000 horizontal
    { x1: 0.1, y1: 100000, x2: 10, y2: 100000, label: 'PS = 100 000', color: '#dc2626' },
    // PS = 1,000 horizontal
    { x1: 1000, y1: 1000, x2: 100000, y2: 1000, label: 'PS = 1 000', color: '#dc2626' },
    // PS = 50,000 horizontal
    { x1: 20, y1: 50000, x2: 100000, y2: 50000, label: 'PS = 50 000', color: '#dc2626' },
    // V = 10 vertical
    { x1: 10, y1: 100000, x2: 10, y2: 500000, label: 'V = 10', color: '#dc2626' },
  ],
  categoryZones: [
    { label: 'SEP', x: 0.3, y: 300 },
    { label: 'Not regulated', x: 30, y: 5 },
    { label: 'I', x: 5000, y: 100 },
    { label: 'II', x: 5000, y: 5000 },
    { label: 'III', x: 50000, y: 50000 },
  ],
  footerText: 'Figure 4 — Graph for vessels — Nondangerous liquids',
  applicationText: 'Assemblies intended for generating warm water shall be subjected to a type approval. See table 2 category 3 for warm water.',
  xVariable: 'V',
};

// Figure 5 - Steam Generators
const figure5: GraphConfig = {
  id: 5,
  title: 'Steam generators',
  subtitle: '',
  equipmentType: 'Steam Generator',
  fluidType: '',
  xAxisLabel: 'Volume (V) L',
  yAxisLabel: 'Design pressure (PS) kPa',
  xMin: 0.1,
  xMax: 10000,
  yMin: 0.1,
  yMax: 100000,
  lines: [
    // PS = 50 horizontal
    { x1: 0.1, y1: 50, x2: 10000, y2: 50, label: 'PS = 50', color: '#dc2626' },
    // PS*V = 300,000 diagonal
    { x1: 93.75, y1: 3200, x2: 1000, y2: 300, label: 'PS×V = 300 000', color: '#dc2626' },
    // PS = 3,200 horizontal
    { x1: 2, y1: 3200, x2: 93.75, y2: 3200, label: 'PS = 3 200', color: '#dc2626' },
    // PS*V = 20,000 diagonal
    { x1: 6.25, y1: 3200, x2: 400, y2: 50, label: 'PS×V = 20 000', color: '#dc2626' },
    // V = 2 vertical
    { x1: 2, y1: 2500, x2: 2, y2: 100000, label: 'V = 2', color: '#dc2626' },
    // PS*V = 5,000 diagonal
    { x1: 2, y1: 2500, x2: 100, y2: 50, label: 'PS×V = 5 000', color: '#dc2626' },
    // V = 1000 vertical
    { x1: 1000, y1: 50, x2: 1000, y2: 300, label: 'V = 1 000', color: '#dc2626' },
  ],
  categoryZones: [
    { label: 'SEP', x: 0.3, y: 300 },
    { label: 'Not regulated', x: 30, y: 5 },
    { label: 'I', x: 20, y: 55 },
    { label: 'II', x: 100, y: 55 },
    { label: 'III', x: 300, y: 200 },
    { label: 'IV', x: 200, y: 10000 },
  ],
  footerText: 'Figure 5 — Graph for steam generators',
  applicationText: 'The design of jacketed pressure cookers shall be subjected to a conformity assessment procedure equivalent to at least one of the category III modules (see figure 5).',
  xVariable: 'V',
};

// Figure 6 - Piping - Dangerous Gas
const figure6: GraphConfig = {
  id: 6,
  title: 'Piping',
  subtitle: 'Dangerous gas',
  equipmentType: 'Piping',
  fluidType: 'Dangerous gas',
  xAxisLabel: 'DN',
  yAxisLabel: 'Design pressure (PS) kPa',
  xMin: 1,
  xMax: 2000,
  yMin: 1,
  yMax: 100000,
  lines: [
    // PS = 50 horizontal
    { x1: 1, y1: 50, x2: 2000, y2: 50, label: 'PS = 50', color: '#dc2626' },
    // PS*DN = 350,000 diagonal
    { x1: 350, y1: 1000, x2: 100, y2: 3500, label: 'PS×DN = 350 000', color: '#dc2626' },
    // DN = 25 vertical (red)
    { x1: 25, y1: 50, x2: 25, y2: 100000, label: 'DN = 25', color: '#dc2626' },
    // PS*DN = 100,000 diagonal
    { x1: 100, y1: 1000, x2: 25, y2: 4000, label: 'PS×DN = 100 000', color: '#dc2626' },
    // DN = 100 top vertical
    { x1: 100, y1: 3500, x2: 100, y2: 100000, label: 'DN = 100', color: '#dc2626' },
    // DN = 350 vertical
    { x1: 350, y1: 50, x2: 350, y2: 1000, label: 'DN = 350', color: '#dc2626' },
    // DN = 100 bottom vertical
    { x1: 100, y1: 50, x2: 100, y2: 1000, color: '#dc2626' },
  ],
  categoryZones: [
    { label: 'SEP', x: 5, y: 300 },
    { label: 'Not regulated', x: 50, y: 5 },
    { label: 'I', x: 60, y: 100 },
    { label: 'II', x: 200, y: 100 },
    { label: 'III', x: 500, y: 5000 },
  ],
  footerText: 'Figure 6 — Graph for piping — Dangerous gas',
  applicationText: 'Piping that is intended for unstable gases that fall within categories I or II shall be classified as category III (see figure 6).',
  xVariable: 'DN',
};

// Figure 7 - Piping - Non-dangerous Gas
const figure7: GraphConfig = {
  id: 7,
  title: 'Piping',
  subtitle: 'Nondangerous gas',
  equipmentType: 'Piping',
  fluidType: 'Nondangerous gas',
  xAxisLabel: 'DN',
  yAxisLabel: 'Design pressure (PS) kPa',
  xMin: 1,
  xMax: 20000,
  yMin: 1,
  yMax: 200000,
  lines: [
    // PS = 50 horizontal
    { x1: 0.1, y1: 50, x2: 20000, y2: 50, label: 'PS = 50', color: '#dc2626' },
    // PS*DN = 500,000 diagonal
    { x1: 250, y1: 2000, x2: 10000, y2: 50, label: 'PS×DN = 500 000', color: '#dc2626' },
    // DN = 32 vertical (red)
    { x1: 32, y1: 3125, x2: 32, y2: 200000, label: 'DN = 32', color: '#dc2626' },
    // PS*DN = 350,000 diagonal
    { x1: 100, y1: 3500, x2: 7000, y2: 50, label: 'PS×DN = 350 000', color: '#dc2626' },
    // DN = 100 vertical
    { x1: 100, y1: 3500, x2: 100, y2: 200000, label: 'DN = 100', color: '#dc2626' },
    // PS*DN = 100,000 diagonal
    { x1: 32, y1: 3125, x2: 2000, y2: 50, label: 'PS×DN = 100 000', color: '#dc2626' },
    // DN = 250 vertical (red)
    { x1: 250, y1: 2000, x2: 250, y2: 200000, label: 'DN = 250', color: '#dc2626' },
  ],
  categoryZones: [
    { label: 'SEP', x: 5, y: 300 },
    { label: 'Not regulated', x: 50, y: 5 },
    { label: 'I', x: 60, y: 100 },
    { label: 'II', x: 500, y: 100 },
    { label: 'III', x: 5000, y: 5000 },
  ],
  footerText: 'Figure 7 — Graph for piping — Nondangerous gas',
  applicationText: 'All piping that contains fluids at a temperature greater than 350 °C (not applicable to nonmetallic piping) and that falls into category II shall be classified as category III (see figure 7).',
  xVariable: 'DN',
};

// Figure 8 - Piping - Dangerous Liquids
const figure8: GraphConfig = {
  id: 8,
  title: 'Piping',
  subtitle: 'Dangerous liquids',
  equipmentType: 'Piping',
  fluidType: 'Dangerous liquids',
  xAxisLabel: 'DN',
  yAxisLabel: 'Design pressure (PS) kPa',
  xMin: 1,
  xMax: 10000,
  yMin: 1,
  yMax: 200000,
  lines: [
    // PS = 50,000 horizontal
    { x1: 25, y1: 50000, x2: 10000, y2: 50000, label: 'PS = 50 000', color: '#dc2626' },
    // PS*DN = 200,000 diagonal
    { x1: 25, y1: 8000, x2: 2000, y2: 100, label: 'PS×DN = 200 000', color: '#dc2626' },
    // PS = 1,000 horizontal
    { x1: 200, y1: 1000, x2: 10000, y2: 1000, label: 'PS = 1 000', color: '#dc2626' },
    // PS = 50 horizontal
    { x1: 0.1, y1: 50, x2: 10000, y2: 50, label: 'PS = 50', color: '#dc2626' },
    // PS = 100 horizontal
    { x1: 2000, y1: 100, x2: 10000, y2: 100, label: 'PS = 100', color: '#dc2626' },
    // DN = 25 vertical
    { x1: 25, y1: 8000, x2: 25, y2: 200000, label: 'DN = 25', color: '#dc2626' },
  ],
  categoryZones: [
    { label: 'SEP', x: 5, y: 300 },
    { label: 'Not regulated', x: 50, y: 5 },
    { label: 'I', x: 500, y: 200 },
    { label: 'II', x: 500, y: 5000 },
    { label: 'III', x: 3000, y: 50000 },
  ],
  footerText: 'Figure 8 — Graph for piping — Dangerous liquids',
  applicationText: 'Figure 8 shows the various categories for dangerous liquids contained in piping.',
  xVariable: 'DN',
};

// Figure 9 - Piping - Non-dangerous Liquids
const figure9: GraphConfig = {
  id: 9,
  title: 'Piping',
  subtitle: 'Nondangerous liquids',
  equipmentType: 'Piping',
  fluidType: 'Nondangerous liquids',
  xAxisLabel: 'DN',
  yAxisLabel: 'Design pressure (PS) kPa',
  xMin: 1,
  xMax: 10000,
  yMin: 1,
  yMax: 200000,
  lines: [
    // PS = 50 horizontal
    { x1: 1, y1: 50, x2: 10000, y2: 50, label: 'PS = 50', color: '#dc2626' },
    // PS*DN = 500,000 diagonal
    { x1: 200, y1: 2500, x2: 500, y2: 1000, label: 'PS×DN = 500 000', color: '#dc2626' },
    // PS = 1,000 horizontal
    { x1: 500, y1: 1000, x2: 10000, y2: 1000, label: 'PS = 1 000', color: '#dc2626' },
    // DN = 200 vertical
    { x1: 200, y1: 2500, x2: 200, y2: 200000, label: 'DN = 200', color: '#dc2626' },
    // PS = 50,000 horizontal
    { x1: 200, y1: 50000, x2: 10000, y2: 50000, label: 'PS = 50 000', color: '#dc2626' },
  ],
  categoryZones: [
    { label: 'SEP', x: 5, y: 300 },
    { label: 'Not regulated', x: 30, y: 5 },
    { label: 'I', x: 500, y: 200 },
    { label: 'II', x: 1000, y: 5000 },
    { label: 'III', x: 3000, y: 50000 },
  ],
  footerText: 'Figure 9 — Graph for piping — Nondangerous liquids',
  applicationText: 'Figure 9 shows the various categories for nondangerous liquids contained in piping.',
  xVariable: 'DN',
};

export const allGraphs: GraphConfig[] = [
  figure1, figure2, figure3, figure4, figure5,
  figure6, figure7, figure8, figure9,
];

// Table 1 - Figure selection logic
// Equipment Type -> State of Contents -> Fluid Group -> Figure number
export function selectFigure(
  equipmentType: 'Pressure Vessels' | 'Piping',
  stateOfContents: 'Gas' | 'Liquid',
  fluidGroup: 'Dangerous' | 'Non-Dangerous'
): number {
  if (equipmentType === 'Pressure Vessels') {
    if (stateOfContents === 'Gas') {
      return fluidGroup === 'Dangerous' ? 1 : 2;
    } else {
      return fluidGroup === 'Dangerous' ? 3 : 4;
    }
  } else {
    // Piping
    if (stateOfContents === 'Gas') {
      return fluidGroup === 'Dangerous' ? 6 : 7;
    } else {
      return fluidGroup === 'Dangerous' ? 8 : 9;
    }
  }
}

// Determine the category based on PS, V/DN and figure
export function determineCategory(
  figureId: number,
  ps: number, // Design Pressure in kPa
  vOrDn: number // Volume in L or DN
): string {
  const product = ps * vOrDn;

  switch (figureId) {
    case 1: // Vessels - Dangerous Gas
      if (ps < 50) return 'Not regulated';
      if (vOrDn < 1 && ps < 20000) return 'SEP';
      if (vOrDn < 1 && ps >= 20000 && ps < 100000) return 'SEP';
      if (vOrDn < 1 && ps >= 100000) return 'IV';
      if (product <= 2000 && ps >= 50) return 'SEP';
      if (product > 2000 && product <= 5000 && ps >= 50) return 'I';
      if (product > 5000 && product <= 20000 && ps >= 50) return 'II';
      if (product > 20000 && product <= 100000 && ps >= 50) return 'III';
      if (product > 100000) return 'IV';
      return 'SEP';

    case 2: // Vessels - Non-dangerous Gas
      if (ps < 50) return 'Not regulated';
      if (vOrDn < 1 && ps < 100000) return 'SEP';
      if (vOrDn < 1 && ps >= 100000 && ps < 300000) return 'SEP';
      if (vOrDn < 1 && ps >= 300000) return 'IV';
      if (product <= 5000 && ps >= 50 && ps < 400) return 'SEP';
      if (product <= 5000 && ps >= 400) return 'SEP';
      if (product > 5000 && product <= 20000 && ps >= 50) return 'I';
      if (product > 20000 && product <= 100000 && ps >= 50) return 'II';
      if (product > 100000 && product <= 300000 && ps >= 50) return 'III';
      if (product > 300000 || (ps > 400 && product > 300000)) return 'IV';
      return 'SEP';

    case 3: // Vessels - Dangerous Liquids
      if (ps < 50) return 'Not regulated';
      if (vOrDn < 1) return 'SEP';
      if (ps >= 50 && ps < 1000 && product <= 20000) return 'SEP';
      if (product <= 20000 && ps >= 50 && ps < 1000) return 'SEP';
      if (ps >= 50 && ps < 1000 && product > 20000) return 'I';
      if (ps >= 1000 && ps < 50000) return 'II';
      if (ps >= 50000) return 'III';
      if (product > 20000 && ps < 1000) return 'I';
      return 'SEP';

    case 4: // Vessels - Non-dangerous Liquids
      if (ps < 50) return 'Not regulated';
      if (vOrDn < 10) return 'SEP';
      if (ps >= 50 && ps < 1000 && product <= 1000000) return 'SEP';
      if (product > 1000000 && ps < 1000) return 'I';
      if (ps >= 1000 && ps < 50000) return 'II';
      if (ps >= 50000) return 'III';
      return 'SEP';

    case 5: // Steam Generators
      if (ps < 50) return 'Not regulated';
      if (vOrDn < 2) return 'SEP';
      if (product <= 5000 && ps >= 50 && ps < 3200) return 'SEP';
      if (product > 5000 && product <= 20000 && ps >= 50) return 'I';
      if (product > 20000 && ps >= 50 && ps <= 3200) return 'II';
      if ((product > 20000 && ps > 3200) || product > 300000) return 'III';
      if (vOrDn > 1000 && ps > 300) return 'IV';
      if (product > 300000) return 'IV';
      return 'II';

    case 6: // Piping - Dangerous Gas
      if (ps < 50) return 'Not regulated';
      if (vOrDn < 25) return 'SEP';
      if (vOrDn >= 25 && vOrDn < 100 && ps >= 50 && product <= 100000) return 'I';
      if (vOrDn >= 25 && vOrDn < 100 && product > 100000) return 'II';
      if (vOrDn >= 100 && vOrDn < 350 && ps < 3500 && product <= 350000) return 'II';
      if (vOrDn >= 100 && ps >= 3500) return 'III';
      if (vOrDn >= 350 || product > 350000) return 'III';
      return 'I';

    case 7: // Piping - Non-dangerous Gas
      if (ps < 50) return 'Not regulated';
      if (vOrDn < 32) return 'SEP';
      if (vOrDn >= 32 && vOrDn < 100 && product <= 100000) return 'SEP';
      if (vOrDn >= 32 && product > 100000 && product <= 350000) return 'I';
      if (vOrDn >= 100 && vOrDn < 250 && product > 350000) return 'II';
      if (vOrDn >= 250 || product > 500000) return 'III';
      if (product > 350000 && vOrDn >= 100) return 'II';
      return 'I';

    case 8: // Piping - Dangerous Liquids
      if (ps < 50) return 'Not regulated';
      if (vOrDn < 25) return 'SEP';
      if (ps >= 50 && ps < 100 && vOrDn >= 25) return 'SEP';
      if (ps >= 100 && ps < 1000 && product <= 200000) return 'I';
      if (ps >= 1000 && ps < 50000) return 'II';
      if (ps >= 50000) return 'III';
      if (product > 200000) return 'II';
      return 'I';

    case 9: // Piping - Non-dangerous Liquids
      if (ps < 50) return 'Not regulated';
      if (vOrDn < 200) return 'SEP';
      if (ps >= 50 && ps < 1000 && product <= 500000) return 'SEP';
      if (product > 500000 && ps < 1000) return 'I';
      if (ps >= 1000 && ps < 50000) return 'II';
      if (ps >= 50000) return 'III';
      return 'I';

    default:
      return 'Not regulated';
  }
}

// Get conformity assessment modules for a category
export function getConformityModules(category: string): {
  withoutQuality: string;
  withQuality: string;
} {
  switch (category) {
    case 'I':
      return { withoutQuality: 'A', withQuality: 'A' };
    case 'II':
      return { withoutQuality: 'A2', withQuality: 'A2 or D1 or E1' };
    case 'III':
      return {
        withoutQuality: 'B (design type) + F or B (production type) + C2',
        withQuality: 'H or B (production type) + E or B (design type) + D',
      };
    case 'IV':
      return {
        withoutQuality: 'G or B (production type) + F',
        withQuality: 'H1 or B (production type) + D',
      };
    default:
      return { withoutQuality: 'N/A', withQuality: 'N/A' };
  }
}

// Category color mapping
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'SEP': return '#10b981';
    case 'I': return '#3b82f6';
    case 'II': return '#eab308';
    case 'III': return '#f97316';
    case 'IV': return '#ef4444';
    default: return '#6b7280';
  }
}

export function getCategoryRisk(category: string): string {
  switch (category) {
    case 'SEP': return 'Sound Engineering Practice';
    case 'Not regulated': return 'Below regulation threshold';
    case 'I': return 'Low Risk';
    case 'II': return 'Medium Risk';
    case 'III': return 'High Risk';
    case 'IV': return 'Very High Risk';
    default: return '';
  }
}
