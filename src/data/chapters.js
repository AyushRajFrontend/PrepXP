/**
 * chapters.js — Chapter + lecture seed data.
 *
 * Structure:
 *   CHAPTERS[subjectId] → Chapter[]
 *
 * Chapter shape:
 *   id            — unique key
 *   number        — display number
 *   name          — chapter title
 *   status        — 'completed' | 'in-progress' | 'not-started'
 *   doneLectures  — lectures watched
 *   totalLectures — total lectures in chapter
 *   lectures      — Lecture[] (shown in expandable view)
 *
 * Lecture shape:
 *   id, number, title, duration (minutes), done (bool)
 *
 * This represents a sample of each subject's syllabus.
 * Phase 3+ will load the full list from a backend / JSON bundle.
 */

/* ─── Duration pool — varies across lectures ─── */
const DUR = [32, 45, 38, 55, 28, 42, 35, 50, 60, 25, 48, 36, 40, 52, 30]
const d   = (i) => DUR[i % DUR.length]

/**
 * Build a lecture array from a titles list.
 * doneCount — first N lectures are marked done.
 */
function makeLectures(chapterId, titles, doneCount = 0) {
  return titles.map((title, i) => ({
    id:       `${chapterId}_l${i + 1}`,
    number:   i + 1,
    title,
    duration: d(i),
    done:     i < doneCount,
  }))
}

/* ════════════════════════════════════════
   PHYSICS
   ════════════════════════════════════════ */
const physicsChapters = [
  {
    id:            'phy_ch01',
    number:        1,
    name:          'Units & Measurements',
    status:        'completed',
    doneLectures:  5,
    totalLectures: 5,
    lectures: makeLectures('phy_ch01', [
      'Physical Quantities & SI Units',
      'Dimensional Analysis',
      'Significant Figures',
      'Errors in Measurement',
      'PYQ Problems & Shortcuts',
    ], 5),
  },
  {
    id:            'phy_ch02',
    number:        2,
    name:          'Motion in a Straight Line',
    status:        'completed',
    doneLectures:  6,
    totalLectures: 6,
    lectures: makeLectures('phy_ch02', [
      'Position, Path Length & Displacement',
      'Velocity & Speed',
      'Acceleration',
      'Kinematic Equations',
      'Motion Under Gravity',
      'Graphs & PYQs',
    ], 6),
  },
  {
    id:            'phy_ch03',
    number:        3,
    name:          'Motion in a Plane',
    status:        'completed',
    doneLectures:  7,
    totalLectures: 7,
    lectures: makeLectures('phy_ch03', [
      'Scalars & Vectors',
      'Vector Addition & Resolution',
      'Projectile Motion — Theory',
      'Projectile Motion — Problems',
      'Uniform Circular Motion',
      'Relative Motion',
      'PYQ Masterclass',
    ], 7),
  },
  {
    id:            'phy_ch04',
    number:        4,
    name:          'Laws of Motion',
    status:        'in-progress',
    doneLectures:  3,
    totalLectures: 7,
    lectures: makeLectures('phy_ch04', [
      "Newton's First Law & Inertia",
      "Newton's Second Law — F = ma",
      "Newton's Third Law & Reactions",
      'Free Body Diagrams',
      'Connected Bodies & Pulleys',
      'Friction — Static & Kinetic',
      'Advanced Problems & PYQs',
    ], 3),
  },
  {
    id:            'phy_ch05',
    number:        5,
    name:          'Work, Energy & Power',
    status:        'in-progress',
    doneLectures:  2,
    totalLectures: 6,
    lectures: makeLectures('phy_ch05', [
      'Work Done by a Force',
      'Kinetic & Potential Energy',
      'Work-Energy Theorem',
      'Conservative Forces',
      'Power & Efficiency',
      'Collisions & PYQs',
    ], 2),
  },
  {
    id:            'phy_ch06',
    number:        6,
    name:          'System of Particles & Rotation',
    status:        'not-started',
    doneLectures:  0,
    totalLectures: 8,
    lectures: makeLectures('phy_ch06', [
      'Centre of Mass',
      'Motion of COM',
      'Linear Momentum & Conservation',
      'Angular Velocity & Acceleration',
      'Torque & Moment of Inertia',
      'Theorems of MI',
      'Rolling Motion',
      'Problems & PYQs',
    ], 0),
  },
  {
    id:            'phy_ch07',
    number:        7,
    name:          'Gravitation',
    status:        'not-started',
    doneLectures:  0,
    totalLectures: 5,
    lectures: makeLectures('phy_ch07', [
      "Kepler's Laws",
      "Newton's Law of Gravitation",
      'Gravitational Field & Potential',
      'Satellites & Escape Velocity',
      'PYQs & Shortcuts',
    ], 0),
  },
  {
    id:            'phy_ch08',
    number:        8,
    name:          'Oscillations',
    status:        'not-started',
    doneLectures:  0,
    totalLectures: 6,
    lectures: makeLectures('phy_ch08', [
      'Periodic Motion & SHM',
      'SHM — Energy & Dynamics',
      'Simple Pendulum',
      'Spring-Mass System',
      'Damped & Forced Oscillations',
      'PYQs',
    ], 0),
  },
]


/* ════════════════════════════════════════
   CHEMISTRY
   ════════════════════════════════════════ */
const chemistryChapters = [
  {
    id:            'chem_ch01',
    number:        1,
    name:          'Basic Concepts of Chemistry',
    status:        'completed',
    doneLectures:  4,
    totalLectures: 4,
    lectures: makeLectures('chem_ch01', [
      'Matter & Its Classification',
      'Mole Concept & Avogadro',
      'Stoichiometry & Limiting Reagent',
      'Concentration Terms',
    ], 4),
  },
  {
    id:            'chem_ch02',
    number:        2,
    name:          'Structure of the Atom',
    status:        'completed',
    doneLectures:  6,
    totalLectures: 6,
    lectures: makeLectures('chem_ch02', [
      "Thomson's & Rutherford's Model",
      "Bohr's Model & Hydrogen Spectrum",
      'Quantum Numbers',
      'Electronic Configuration',
      'Shapes of Orbitals',
      'PYQs',
    ], 6),
  },
  {
    id:            'chem_ch03',
    number:        3,
    name:          'Chemical Bonding & Molecular Structure',
    status:        'completed',
    doneLectures:  7,
    totalLectures: 7,
    lectures: makeLectures('chem_ch03', [
      'Ionic Bonding & Lattice Energy',
      'Covalent Bonding & Lewis Structures',
      'VSEPR Theory',
      'Hybridisation',
      'Molecular Orbital Theory',
      'Bond Parameters',
      'PYQs',
    ], 7),
  },
  {
    id:            'chem_ch04',
    number:        4,
    name:          'Thermodynamics',
    status:        'in-progress',
    doneLectures:  3,
    totalLectures: 6,
    lectures: makeLectures('chem_ch04', [
      'System, Surroundings & State Functions',
      'First Law — Internal Energy & Enthalpy',
      'Hess\'s Law & Standard Enthalpies',
      'Second Law & Entropy',
      'Gibbs Free Energy',
      'Spontaneity & PYQs',
    ], 3),
  },
  {
    id:            'chem_ch05',
    number:        5,
    name:          'Equilibrium',
    status:        'in-progress',
    doneLectures:  2,
    totalLectures: 7,
    lectures: makeLectures('chem_ch05', [
      'Law of Chemical Equilibrium',
      'Kp, Kc & their Relation',
      "Le Chatelier's Principle",
      'Ionic Equilibrium & pH',
      'Buffer Solutions',
      'Solubility Product',
      'PYQs',
    ], 2),
  },
  {
    id:            'chem_ch06',
    number:        6,
    name:          'Aldehydes, Ketones & Carboxylic Acids',
    status:        'in-progress',
    doneLectures:  1,
    totalLectures: 5,
    lectures: makeLectures('chem_ch06', [
      'Nomenclature & Physical Properties',
      'Preparation of Carbonyl Compounds',
      'Chemical Reactions — Addition & Oxidation',
      'Carboxylic Acids & Derivatives',
      'PYQs & Named Reactions',
    ], 1),
  },
  {
    id:            'chem_ch07',
    number:        7,
    name:          'Electrochemistry',
    status:        'not-started',
    doneLectures:  0,
    totalLectures: 5,
    lectures: makeLectures('chem_ch07', [
      'Electrochemical Cells & EMF',
      "Nernst Equation",
      'Electrolysis & Faraday\'s Laws',
      'Conductance',
      'Batteries, Fuel Cells & Corrosion',
    ], 0),
  },
  {
    id:            'chem_ch08',
    number:        8,
    name:          'Coordination Compounds',
    status:        'not-started',
    doneLectures:  0,
    totalLectures: 4,
    lectures: makeLectures('chem_ch08', [
      'Werner\'s Theory & Terminology',
      'Nomenclature & Isomerism',
      'Bonding — VBT & CFT',
      'Stability, Applications & PYQs',
    ], 0),
  },
]


/* ════════════════════════════════════════
   MATHEMATICS
   ════════════════════════════════════════ */
const mathematicsChapters = [
  {
    id:            'math_ch01',
    number:        1,
    name:          'Relations & Functions',
    status:        'completed',
    doneLectures:  5,
    totalLectures: 5,
    lectures: makeLectures('math_ch01', [
      'Types of Relations',
      'Functions & Their Types',
      'Composition & Inverse Functions',
      'Binary Operations',
      'Problems & PYQs',
    ], 5),
  },
  {
    id:            'math_ch02',
    number:        2,
    name:          'Inverse Trigonometric Functions',
    status:        'completed',
    doneLectures:  4,
    totalLectures: 4,
    lectures: makeLectures('math_ch02', [
      'Domain & Range of Inverse Trig',
      'Principal Values & Properties',
      'Identities & Simplification',
      'PYQs',
    ], 4),
  },
  {
    id:            'math_ch03',
    number:        3,
    name:          'Matrices',
    status:        'completed',
    doneLectures:  5,
    totalLectures: 5,
    lectures: makeLectures('math_ch03', [
      'Types of Matrices',
      'Matrix Operations',
      'Transpose & Symmetric Matrices',
      'Elementary Row Operations',
      'PYQs',
    ], 5),
  },
  {
    id:            'math_ch04',
    number:        4,
    name:          'Determinants',
    status:        'in-progress',
    doneLectures:  3,
    totalLectures: 6,
    lectures: makeLectures('math_ch04', [
      'Determinant & Its Properties',
      'Minors & Cofactors',
      'Area of Triangle & Applications',
      'Adjoint & Inverse of a Matrix',
      'Cramer\'s Rule',
      'Problems & PYQs',
    ], 3),
  },
  {
    id:            'math_ch05',
    number:        5,
    name:          'Continuity & Differentiability',
    status:        'in-progress',
    doneLectures:  2,
    totalLectures: 7,
    lectures: makeLectures('math_ch05', [
      'Continuity of a Function',
      'Differentiability',
      'Derivatives — Chain Rule',
      'Implicit & Logarithmic Differentiation',
      'Parametric Differentiation',
      'Higher Order Derivatives',
      'PYQs',
    ], 2),
  },
  {
    id:            'math_ch06',
    number:        6,
    name:          'Application of Derivatives',
    status:        'not-started',
    doneLectures:  0,
    totalLectures: 6,
    lectures: makeLectures('math_ch06', [
      'Rate of Change & Tangents/Normals',
      'Increasing & Decreasing Functions',
      'Maxima & Minima — First Derivative Test',
      'Maxima & Minima — Second Derivative Test',
      'Approximations',
      'PYQs & Problems',
    ], 0),
  },
  {
    id:            'math_ch07',
    number:        7,
    name:          'Integrals',
    status:        'not-started',
    doneLectures:  0,
    totalLectures: 8,
    lectures: makeLectures('math_ch07', [
      'Integration by Substitution',
      'Integration by Parts',
      'Partial Fractions',
      'Definite Integrals — Properties',
      'Area Under Curves',
      'Special Integrals',
      'ILATE Rule & Applications',
      'PYQs',
    ], 0),
  },
  {
    id:            'math_ch08',
    number:        8,
    name:          'Differential Equations',
    status:        'not-started',
    doneLectures:  0,
    totalLectures: 5,
    lectures: makeLectures('math_ch08', [
      'Order, Degree & Formation',
      'Variable Separable Method',
      'Homogeneous Equations',
      'Linear Differential Equations',
      'Applications & PYQs',
    ], 0),
  },
]


/* ════════════════════════════════════════
   EXPORT
   ════════════════════════════════════════ */
export const CHAPTERS = {
  physics:     physicsChapters,
  chemistry:   chemistryChapters,
  mathematics: mathematicsChapters,
}
