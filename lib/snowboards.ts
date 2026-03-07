export interface Snowboard {
  id: string;
  name: string;
  brand: string;
  priceRange: { min: number; max: number };
  skillLevels: SkillLevel[];
  terrainTypes: TerrainType[];
  specs: {
    length: number[];
    shape: string;
    flex: string;
    camberProfile: string;
  };
  description: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type TerrainType = 'all-mountain' | 'freestyle' | 'powder' | 'carving';

export const SNOWBOARDS: Snowboard[] = [
  {
    id: 'burton-custom',
    name: 'Burton Custom',
    brand: 'Burton',
    priceRange: { min: 500, max: 700 },
    skillLevels: ['intermediate', 'advanced', 'expert'],
    terrainTypes: ['all-mountain'],
    specs: {
      length: [150, 154, 156, 158, 160, 162, 164, 166],
      shape: 'Directional Twin',
      flex: 'Medium (5/10)',
      camberProfile: 'Camber',
    },
    description: 'The most popular board in snowboarding history. Perfect all-mountain ripper.',
  },
  {
    id: 'lib-tech-skate-banana',
    name: 'Lib Tech Skate Banana',
    brand: 'Lib Tech',
    priceRange: { min: 400, max: 550 },
    skillLevels: ['beginner', 'intermediate'],
    terrainTypes: ['freestyle', 'all-mountain'],
    specs: {
      length: [149, 153, 156, 159, 162],
      shape: 'Twin',
      flex: 'Soft-Medium (4/10)',
      camberProfile: 'Banana (Rocker)',
    },
    description: 'Forgiving and playful. The original rocker board - perfect for park and progression.',
  },
  {
    id: 'jones-flagship',
    name: 'Jones Flagship',
    brand: 'Jones',
    priceRange: { min: 550, max: 700 },
    skillLevels: ['advanced', 'expert'],
    terrainTypes: ['all-mountain', 'powder'],
    specs: {
      length: [154, 158, 161, 164, 167],
      shape: 'Directional',
      flex: 'Stiff (7/10)',
      camberProfile: 'Camber',
    },
    description: 'Aggressive all-mountain board built for charging. Excels in powder and crud.',
  },
  {
    id: 'capita-doa',
    name: 'Capita DOA',
    brand: 'Capita',
    priceRange: { min: 500, max: 650 },
    skillLevels: ['intermediate', 'advanced'],
    terrainTypes: ['all-mountain', 'freestyle'],
    specs: {
      length: [150, 152, 154, 156, 158, 160],
      shape: 'Directional Twin',
      flex: 'Medium (5/10)',
      camberProfile: 'Hybrid Camber',
    },
    description: 'Defenders of Awesome. Versatile freestyle-focused all-mountain board.',
  },
  {
    id: 'rome-artifact',
    name: 'Rome Artifact',
    brand: 'Rome',
    priceRange: { min: 350, max: 500 },
    skillLevels: ['beginner', 'intermediate'],
    terrainTypes: ['all-mountain'],
    specs: {
      length: [148, 151, 154, 157, 160],
      shape: 'Directional Twin',
      flex: 'Soft-Medium (4/10)',
      camberProfile: 'Flat Top',
    },
    description: 'Forgiving and stable. Great for learning and progression.',
  },
  {
    id: 'never-summer-proto-synthesis',
    name: 'Never Summer Proto Synthesis',
    brand: 'Never Summer',
    priceRange: { min: 550, max: 700 },
    skillLevels: ['intermediate', 'advanced', 'expert'],
    terrainTypes: ['all-mountain'],
    specs: {
      length: [151, 154, 157, 160, 163],
      shape: 'Directional Twin',
      flex: 'Medium-Stiff (6/10)',
      camberProfile: 'Rocker-Camber-Rocker',
    },
    description: 'Bulletproof construction. Versatile all-mountain destroyer.',
  },
  {
    id: 'gnu-riders-choice',
    name: 'GNU Riders Choice',
    brand: 'GNU',
    priceRange: { min: 450, max: 600 },
    skillLevels: ['intermediate', 'advanced'],
    terrainTypes: ['freestyle', 'all-mountain'],
    specs: {
      length: [150, 153, 156, 159, 162],
      shape: 'Twin',
      flex: 'Medium (5/10)',
      camberProfile: 'C2 Hybrid',
    },
    description: 'Classic freestyle board with modern tech. Park and pipe focused.',
  },
  {
    id: 'arbor-element',
    name: 'Arbor Element',
    brand: 'Arbor',
    priceRange: { min: 300, max: 450 },
    skillLevels: ['beginner'],
    terrainTypes: ['all-mountain'],
    specs: {
      length: [148, 151, 154, 157, 160],
      shape: 'Directional',
      flex: 'Soft (3/10)',
      camberProfile: 'Rocker',
    },
    description: 'Perfect first board. Forgiving rocker profile for easy turning.',
  },
  {
    id: 'k2-party-platter',
    name: 'K2 Party Platter',
    brand: 'K2',
    priceRange: { min: 450, max: 600 },
    skillLevels: ['intermediate', 'advanced', 'expert'],
    terrainTypes: ['powder'],
    specs: {
      length: [142, 148, 154],
      shape: 'Directional Tapered',
      flex: 'Medium (5/10)',
      camberProfile: 'Rocker',
    },
    description: 'Volume-shifted powder slayer. Ride it 10cm shorter for deep days.',
  },
  {
    id: 'salomon-assassin',
    name: 'Salomon Assassin',
    brand: 'Salomon',
    priceRange: { min: 400, max: 550 },
    skillLevels: ['intermediate', 'advanced'],
    terrainTypes: ['all-mountain', 'freestyle'],
    specs: {
      length: [151, 155, 158, 161, 164],
      shape: 'Twin',
      flex: 'Medium (5/10)',
      camberProfile: 'Rock Out Camber',
    },
    description: 'Playful all-mountain twin. Great for butters and freestyle riding.',
  },
  {
    id: 'ride-twinpig',
    name: 'Ride Twinpig',
    brand: 'Ride',
    priceRange: { min: 450, max: 600 },
    skillLevels: ['intermediate', 'advanced'],
    terrainTypes: ['all-mountain', 'powder'],
    specs: {
      length: [142, 148, 151, 154],
      shape: 'Twin',
      flex: 'Medium (5/10)',
      camberProfile: 'Hybrid',
    },
    description: 'Volume-shifted short-fat design. Surf-inspired all-mountain fun.',
  },
  {
    id: 'korua-otto',
    name: 'Korua Otto',
    brand: 'Korua',
    priceRange: { min: 600, max: 800 },
    skillLevels: ['advanced', 'expert'],
    terrainTypes: ['carving', 'all-mountain'],
    specs: {
      length: [153, 157, 161, 165],
      shape: 'Directional',
      flex: 'Stiff (7/10)',
      camberProfile: 'Camber',
    },
    description: 'Premium carving machine. Built for euro-carving and high-speed turns.',
  },
];
