// ==========================================
// Venn Diagram Set Operations Game - Core Logic
// ==========================================

// AST Helper Functions
const SetNode = (name) => ({ type: 'set', name });
const ComplementNode = (expr) => ({ type: 'complement', expr });
const UnionNode = (left, right) => ({ type: 'union', left, right });
const IntersectNode = (left, right) => ({ type: 'intersect', left, right });
const DifferenceNode = (left, right) => ({ type: 'difference', left, right });

// Curated Question Pool for 3 Levels
const QUESTION_POOL = {
  1: [
    {
      ast: SetNode('A'),
      formula: "A",
      thaiFormula: "เซต A",
      difficulty: "ง่าย"
    },
    {
      ast: SetNode('B'),
      formula: "B",
      thaiFormula: "เซต B",
      difficulty: "ง่าย"
    },
    {
      ast: ComplementNode(SetNode('A')),
      formula: "A'",
      thaiFormula: "คอมพลีเมนต์ของเซต A (ไม่ใช่ A)",
      difficulty: "ง่าย"
    },
    {
      ast: ComplementNode(SetNode('B')),
      formula: "B'",
      thaiFormula: "คอมพลีเมนต์ของเซต B (ไม่ใช่ B)",
      difficulty: "ง่าย"
    },
    {
      ast: SetNode('U'),
      formula: "U",
      thaiFormula: "เอกภพสัมพัทธ์ U (พื้นที่ทั้งหมด)",
      difficulty: "ง่าย"
    },
    {
      ast: SetNode('empty'),
      formula: "∅",
      thaiFormula: "เซตว่าง (ไม่แรเงาพื้นที่ใดเลย)",
      difficulty: "ง่าย"
    },
    {
      ast: IntersectNode(SetNode('A'), SetNode('B')),
      formula: "A ∩ B",
      thaiFormula: "A อินเตอร์เซกชัน B (พื้นที่ส่วนซ้ำของ A และ B)",
      difficulty: "ง่าย"
    },
    {
      ast: UnionNode(SetNode('A'), SetNode('B')),
      formula: "A ∪ B",
      thaiFormula: "A ยูเนียน B (พื้นที่ของ A และ B รวมกัน)",
      difficulty: "ง่าย"
    },
    {
      ast: DifferenceNode(SetNode('A'), SetNode('B')),
      formula: "A − B",
      thaiFormula: "A ผลต่าง B (เอาสมาชิกของ A แต่ไม่เอา B)",
      difficulty: "ง่าย"
    },
    {
      ast: DifferenceNode(SetNode('B'), SetNode('A')),
      formula: "B − A",
      thaiFormula: "B ผลต่าง A (เอาสมาชิกของ B แต่ไม่เอา A)",
      difficulty: "ง่าย"
    }
  ],
  2: [
    {
      ast: ComplementNode(UnionNode(SetNode('A'), SetNode('B'))),
      formula: "(A ∪ B)'",
      thaiFormula: "คอมพลีเมนต์ของ A ยูเนียน B (ไม่เอาทั้ง A และ B)",
      difficulty: "ปานกลาง"
    },
    {
      ast: ComplementNode(IntersectNode(SetNode('A'), SetNode('B'))),
      formula: "(A ∩ B)'",
      thaiFormula: "คอมพลีเมนต์ของ A อินเตอร์เซกชัน B (ทุกส่วนยกเว้นพื้นที่ซ้ำ)",
      difficulty: "ปานกลาง"
    },
    {
      ast: IntersectNode(SetNode('A'), ComplementNode(SetNode('B'))),
      formula: "A ∩ B'",
      thaiFormula: "A อินเตอร์เซกชันกับ คอมพลีเมนต์ของ B (ซึ่งเท่ากับ A − B)",
      difficulty: "ปานกลาง"
    },
    {
      ast: IntersectNode(ComplementNode(SetNode('A')), SetNode('B')),
      formula: "A' ∩ B",
      thaiFormula: "คอมพลีเมนต์ของ A อินเตอร์เซกชันกับ B (ซึ่งเท่ากับ B − A)",
      difficulty: "ปานกลาง"
    },
    {
      ast: IntersectNode(ComplementNode(SetNode('A')), ComplementNode(SetNode('B'))),
      formula: "A' ∩ B'",
      thaiFormula: "ไม่เอา A และไม่เอา B (พื้นที่รอบนอกทั้งหมด)",
      difficulty: "ปานกลาง"
    },
    {
      ast: UnionNode(ComplementNode(SetNode('A')), ComplementNode(SetNode('B'))),
      formula: "A' ∪ B'",
      thaiFormula: "ไม่ใช่ A หรือไม่ใช่ B (ทุกพื้นที่ยกเว้นจุดร่วมกัน)",
      difficulty: "ปานกลาง"
    },
    {
      ast: UnionNode(SetNode('A'), ComplementNode(SetNode('B'))),
      formula: "A ∪ B'",
      thaiFormula: "A ยูเนียนกับ คอมพลีเมนต์ของ B (วงกลม A และพื้นที่นอก B)",
      difficulty: "ปานกลาง"
    },
    {
      ast: UnionNode(ComplementNode(SetNode('A')), SetNode('B')),
      formula: "A' ∪ B",
      thaiFormula: "คอมพลีเมนต์ของ A ยูเนียนกับ B (วงกลม B และพื้นที่นอก A)",
      difficulty: "ปานกลาง"
    },
    {
      ast: ComplementNode(DifferenceNode(SetNode('A'), SetNode('B'))),
      formula: "(A − B)'",
      thaiFormula: "คอมพลีเมนต์ของ A ผลต่าง B (ทุกพื้นที่ยกเว้น A ฝั่งซ้าย)",
      difficulty: "ปานกลาง"
    },
    {
      ast: ComplementNode(DifferenceNode(SetNode('B'), SetNode('A'))),
      formula: "(B − A)'",
      thaiFormula: "คอมพลีเมนต์ของ B ผลต่าง A (ทุกพื้นที่ยกเว้น B ฝั่งขวา)",
      difficulty: "ปานกลาง"
    }
  ],
  3: [
    {
      ast: IntersectNode(IntersectNode(SetNode('A'), SetNode('B')), SetNode('C')),
      formula: "A ∩ B ∩ C",
      thaiFormula: "อินเตอร์เซกชันของทั้งสามเซต (จุดร่วมตรงกลางสุด)",
      difficulty: "ท้าทาย"
    },
    {
      ast: UnionNode(UnionNode(SetNode('A'), SetNode('B')), SetNode('C')),
      formula: "A ∪ B ∪ C",
      thaiFormula: "ยูเนียนของทั้งสามเซต (พื้นที่วงกลมทั้งหมดรวมกัน)",
      difficulty: "ท้าทาย"
    },
    {
      ast: ComplementNode(UnionNode(UnionNode(SetNode('A'), SetNode('B')), SetNode('C'))),
      formula: "(A ∪ B ∪ C)'",
      thaiFormula: "คอมพลีเมนต์ของยูเนียนสามเซต (พื้นที่นอกวงกลมทั้งหมด)",
      difficulty: "ท้าทาย"
    },
    {
      ast: DifferenceNode(IntersectNode(SetNode('A'), SetNode('B')), SetNode('C')),
      formula: "(A ∩ B) − C",
      thaiFormula: "ส่วนซ้ำของ A และ B หักเซต C ออก",
      difficulty: "ท้าทาย"
    },
    {
      ast: DifferenceNode(UnionNode(SetNode('A'), SetNode('B')), SetNode('C')),
      formula: "(A ∪ B) − C",
      thaiFormula: "ยูเนียนของ A และ B หักเซต C ออก",
      difficulty: "ท้าทาย"
    },
    {
      ast: DifferenceNode(SetNode('A'), UnionNode(SetNode('B'), SetNode('C'))),
      formula: "A − (B ∪ C)",
      thaiFormula: "เซต A หักยูเนียนของ B และ C (พื้นที่ A เท่านั้น)",
      difficulty: "ท้าทาย"
    },
    {
      ast: DifferenceNode(SetNode('B'), UnionNode(SetNode('A'), SetNode('C'))),
      formula: "B − (A ∪ C)",
      thaiFormula: "เซต B หักยูเนียนของ A และ C (พื้นที่ B เท่านั้น)",
      difficulty: "ท้าทาย"
    },
    {
      ast: DifferenceNode(SetNode('C'), UnionNode(SetNode('A'), SetNode('B'))),
      formula: "C − (A ∪ B)",
      thaiFormula: "เซต C หักยูเนียนของ A และ B (พื้นที่ C เท่านั้น)",
      difficulty: "ท้าทาย"
    },
    {
      ast: IntersectNode(ComplementNode(SetNode('A')), IntersectNode(SetNode('B'), SetNode('C'))),
      formula: "A' ∩ (B ∩ C)",
      thaiFormula: "ไม่ใช่ A และอยู่ในอินเตอร์เซกชันของ B และ C",
      difficulty: "ท้าทาย"
    },
    {
      ast: IntersectNode(SetNode('A'), ComplementNode(UnionNode(SetNode('B'), SetNode('C')))),
      formula: "A ∩ (B ∪ C)'",
      thaiFormula: "เซต A ร่วมกับพื้นที่ภายนอกของ B และ C (เทียบเท่า A − (B ∪ C))",
      difficulty: "ท้าทาย"
    },
    {
      ast: UnionNode(IntersectNode(SetNode('A'), SetNode('C')), IntersectNode(SetNode('B'), SetNode('C'))),
      formula: "(A ∩ C) ∪ (B ∩ C)",
      thaiFormula: "ส่วนซ้ำของ A และ C รวมกับส่วนซ้ำของ B และ C",
      difficulty: "ท้าทาย"
    },
    {
      ast: ComplementNode(IntersectNode(IntersectNode(SetNode('A'), SetNode('B')), SetNode('C'))),
      formula: "(A ∩ B ∩ C)'",
      thaiFormula: "คอมพลีเมนต์ของส่วนร่วมทั้งสามเซต (ทุกพื้นที่ยกเว้นตรงกลางสุด)",
      difficulty: "ท้าทาย"
    },
    {
      ast: UnionNode(IntersectNode(SetNode('A'), SetNode('B')), SetNode('C')),
      formula: "(A ∩ B) ∪ C",
      thaiFormula: "ส่วนร่วมของ A และ B รวมกับเซต C ทั้งวง",
      difficulty: "ท้าทาย"
    },
    {
      ast: IntersectNode(ComplementNode(UnionNode(SetNode('A'), SetNode('B'))), SetNode('C')),
      formula: "(A ∪ B)' ∩ C",
      thaiFormula: "ไม่ใช่ทั้ง A และ B แต่เป็นสมาชิกของ C (เทียบเท่า C − (A ∪ B))",
      difficulty: "ท้าทาย"
    },
    {
      ast: IntersectNode(IntersectNode(ComplementNode(SetNode('A')), ComplementNode(SetNode('B'))), ComplementNode(SetNode('C'))),
      formula: "A' ∩ B' ∩ C'",
      thaiFormula: "ไม่เอา A และไม่เอา B และไม่เอา C (พื้นที่นอกวงกลมทั้งหมด)",
      difficulty: "ท้าทาย"
    }
  ]
};

// State Variables
let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let timeLeft = 60;
let timerInterval = null;
let timerEnabled = true;
let studentShaded = new Set(); // Stores shaded region codes, e.g., '10', '001'

// DOM Elements
const svg2Set = document.getElementById('svg-2-set');
const svg3Set = document.getElementById('svg-3-set');
const formulaDisplay = document.getElementById('formula-display');
const thaiFormulaDisplay = document.getElementById('thai-formula-display');
const levelBadge = document.getElementById('level-badge');
const questionIndexDisplay = document.getElementById('question-index-display');
const streakCount = document.getElementById('streak-count');
const scoreValue = document.getElementById('score-value');
const timerValue = document.getElementById('timer-value');
const timerDisplay = document.getElementById('timer-display');
const timerIcon = document.getElementById('timer-icon');
const timerSwitch = document.getElementById('timer-switch');

const clearBtn = document.getElementById('clear-btn');
const hintBtn = document.getElementById('hint-btn');
const submitBtn = document.getElementById('submit-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const replayBtn = document.getElementById('replay-btn');
const nextLevelBtn = document.getElementById('next-level-btn');

const feedbackPanel = document.getElementById('feedback-panel');
const feedbackBanner = document.getElementById('feedback-banner');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackDesc = document.getElementById('feedback-desc');
const explanationSteps = document.getElementById('explanation-steps');

const gameOverOverlay = document.getElementById('game-over-overlay');
const finalScore = document.getElementById('final-score');
const finalStreak = document.getElementById('final-streak');

// ==========================================
// 1. Math Evaluator (AST Evaluator)
// ==========================================
function evaluateAST(node, inA, inB, inC) {
  switch (node.type) {
    case 'set':
      if (node.name === 'A') return inA;
      if (node.name === 'B') return inB;
      if (node.name === 'C') return inC;
      if (node.name === 'U') return true;
      if (node.name === 'empty') return false;
      return false;
    case 'complement':
      return !evaluateAST(node.expr, inA, inB, inC);
    case 'union':
      return evaluateAST(node.left, inA, inB, inC) || evaluateAST(node.right, inA, inB, inC);
    case 'intersect':
      return evaluateAST(node.left, inA, inB, inC) && evaluateAST(node.right, inA, inB, inC);
    case 'difference':
      return evaluateAST(node.left, inA, inB, inC) && !evaluateAST(node.right, inA, inB, inC);
    default:
      return false;
  }
}

// Get correct shaded region codes for an AST
function getRegionsForAST(node, isThreeSet) {
  const regions = [];
  const keys = isThreeSet ? 
    ['000', '100', '010', '001', '110', '101', '011', '111'] : 
    ['00', '10', '01', '11'];
  
  for (const key of keys) {
    const inA = key[0] === '1';
    const inB = key[1] === '1';
    const inC = isThreeSet ? (key[2] === '1') : false;
    if (evaluateAST(node, inA, inB, inC)) {
      regions.push(key);
    }
  }
  return regions;
}

// Convert AST to mathematical string
function getFormulaString(node) {
  switch (node.type) {
    case 'set':
      if (node.name === 'empty') return '∅';
      return node.name;
    case 'complement':
      if (node.expr.type === 'set') {
        return getFormulaString(node.expr) + "'";
      }
      return '(' + getFormulaString(node.expr) + ")'";
    case 'union':
      return getFormulaString(node.left) + ' ∪ ' + getFormulaString(node.right);
    case 'intersect':
      let leftStr = getFormulaString(node.left);
      let rightStr = getFormulaString(node.right);
      if (node.left.type === 'union' || node.left.type === 'difference') leftStr = `(${leftStr})`;
      if (node.right.type === 'union' || node.right.type === 'difference') rightStr = `(${rightStr})`;
      return leftStr + ' ∩ ' + rightStr;
    case 'difference':
      let dLeftStr = getFormulaString(node.left);
      let dRightStr = getFormulaString(node.right);
      if (node.left.type === 'union' || node.left.type === 'intersect') dLeftStr = `(${dLeftStr})`;
      if (node.right.type === 'union' || node.right.type === 'intersect') dRightStr = `(${dRightStr})`;
      return dLeftStr + ' − ' + dRightStr;
  }
}

// Convert AST to Thai terminology string
function getThaiFormulaString(node) {
  switch (node.type) {
    case 'set':
      if (node.name === 'empty') return 'เซตว่าง';
      if (node.name === 'U') return 'เอกภพสัมพัทธ์ U';
      return 'เซต ' + node.name;
    case 'complement':
      if (node.expr.type === 'set') {
        return 'คอมพลีเมนต์ของ' + getThaiFormulaString(node.expr);
      }
      return 'คอมพลีเมนต์ของ (' + getThaiFormulaString(node.expr) + ')';
    case 'union':
      return getThaiFormulaString(node.left) + ' ยูเนียน ' + getThaiFormulaString(node.right);
    case 'intersect':
      return getThaiFormulaString(node.left) + ' อินเตอร์เซกชัน ' + getThaiFormulaString(node.right);
    case 'difference':
      return 'ผลต่างของ ' + getThaiFormulaString(node.left) + ' และ ' + getThaiFormulaString(node.right);
  }
}

// ==========================================
// 2. Explanation Engine (Thai)
// ==========================================
function generateExplanationSteps(node, isThreeSet, steps = [], visited = new Set()) {
  if (node.type === 'set') {
    return steps;
  }

  // Traverse children first (post-order)
  if (node.type === 'complement') {
    generateExplanationSteps(node.expr, isThreeSet, steps, visited);
  } else {
    generateExplanationSteps(node.left, isThreeSet, steps, visited);
    generateExplanationSteps(node.right, isThreeSet, steps, visited);
  }

  const formula = getFormulaString(node);
  if (visited.has(formula)) return steps;
  visited.add(formula);

  let desc = '';
  const leftName = node.left ? getFormulaString(node.left) : '';
  const rightName = node.right ? getFormulaString(node.right) : '';

  switch (node.type) {
    case 'complement':
      const innerFormula = getFormulaString(node.expr);
      desc = `หาคอมพลีเมนต์ของ <strong>${innerFormula}</strong> (สัญลักษณ์ <strong>'</strong>) หมายถึงการเลือกทุกพื้นที่ในกรอบ Universe ที่อยู่นอกขอบเขตของ ${innerFormula}`;
      break;
    case 'union':
      desc = `หายูเนียนระหว่าง <strong>${leftName}</strong> กับ <strong>${rightName}</strong> (สัญลักษณ์ <strong>∪</strong>) หมายถึงการเอาพื้นที่ของสองส่วนมารวมกันทั้งหมด`;
      break;
    case 'intersect':
      desc = `หาอินเตอร์เซกชันระหว่าง <strong>${leftName}</strong> กับ <strong>${rightName}</strong> (สัญลักษณ์ <strong>∩</strong>) หมายถึงการหาพื้นที่ทับซ้อนหรือพื้นที่ร่วมกันของสองส่วน`;
      break;
    case 'difference':
      desc = `หาผลต่างระหว่าง <strong>${leftName}</strong> กับ <strong>${rightName}</strong> (สัญลักษณ์ <strong>−</strong>) หมายถึงการเอาพื้นที่ฝั่งซ้าย (${leftName}) ตั้งต้น แล้วลบพื้นที่ส่วนที่ไปทับซ้อนกับฝั่งขวา (${rightName}) ออกไป`;
      break;
  }

  steps.push({
    formula: formula,
    thaiFormula: getThaiFormulaString(node),
    desc: desc,
    regions: getRegionsForAST(node, isThreeSet)
  });

  return steps;
}

function buildExplanationSteps(node, isThreeSet) {
  const steps = [];
  const visited = new Set();
  generateExplanationSteps(node, isThreeSet, steps, visited);
  
  if (steps.length === 0) {
    // If it's a simple, single set
    const formula = getFormulaString(node);
    let desc = '';
    if (node.name === 'U') {
      desc = 'เอกภพสัมพัทธ์ U หมายถึงขอบเขตพื้นที่ทั้งหมดในกรอบสี่เหลี่ยม';
    } else if (node.name === 'empty') {
      desc = 'เซตว่าง ∅ หมายถึงเซตที่ไม่มีสมาชิกใด ๆ เลย (ดังนั้นจึงไม่ต้องแรเงาในพื้นที่ใด)';
    } else {
      desc = `เซต ${node.name} หมายถึงขอบเขตพื้นที่ทั้งหมดภายในวงกลมของเซต ${node.name}`;
    }
    steps.push({
      formula: formula,
      thaiFormula: getThaiFormulaString(node),
      desc: desc,
      regions: getRegionsForAST(node, isThreeSet)
    });
  }
  return steps;
}

// ==========================================
// 3. SVG Coordinate & Interaction Handlers
// ==========================================
function getSVGCoordinates(event, svgElement) {
  const point = svgElement.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const svgPoint = point.matrixTransform(svgElement.getScreenCTM().inverse());
  return { x: svgPoint.x, y: svgPoint.y };
}

// Math detection of hover/click regions using Euclidean Distance
function getRegionKeyAtCoords(x, y, isThreeSet) {
  if (isThreeSet) {
    // 3-Set layout parameters:
    // Circle A: cx=200, cy=190, r=100
    // Circle B: cx=300, cy=190, r=100
    // Circle C: cx=250, cy=270, r=100
    // Universe borders: x=[5,495], y=[5,435]
    if (x < 5 || x > 495 || y < 5 || y > 435) return null;
    
    const distA = Math.hypot(x - 200, y - 190);
    const distB = Math.hypot(x - 300, y - 190);
    const distC = Math.hypot(x - 250, y - 270);
    
    const inA = distA <= 100;
    const inB = distB <= 100;
    const inC = distC <= 100;
    
    return (inA ? '1' : '0') + (inB ? '1' : '0') + (inC ? '1' : '0');
  } else {
    // 2-Set layout parameters:
    // Circle A: cx=200, cy=170, r=100
    // Circle B: cx=300, cy=170, r=100
    // Universe borders: x=[5,495], y=[5,335]
    if (x < 5 || x > 495 || y < 5 || y > 335) return null;
    
    const distA = Math.hypot(x - 200, y - 170);
    const distB = Math.hypot(x - 300, y - 170);
    
    const inA = distA <= 100;
    const inB = distB <= 100;
    
    return (inA ? '1' : '0') + (inB ? '1' : '0');
  }
}

function handleSVGMove(event, svgElement, isThreeSet) {
  const coords = getSVGCoordinates(event, svgElement);
  const regionKey = getRegionKeyAtCoords(coords.x, coords.y, isThreeSet);
  
  // Clear hover class from all regions
  const regions = svgElement.querySelectorAll('.region');
  regions.forEach(r => r.classList.remove('hover'));
  
  if (regionKey) {
    const activeRegion = svgElement.querySelector(`[data-region="${regionKey}"]`);
    if (activeRegion) {
      activeRegion.classList.add('hover');
    }
  }
}

function handleSVGLeave(svgElement) {
  const regions = svgElement.querySelectorAll('.region');
  regions.forEach(r => r.classList.remove('hover'));
}

function handleSVGClick(event, svgElement, isThreeSet) {
  const coords = getSVGCoordinates(event, svgElement);
  const regionKey = getRegionKeyAtCoords(coords.x, coords.y, isThreeSet);
  
  if (regionKey) {
    const regionEl = svgElement.querySelector(`[data-region="${regionKey}"]`);
    if (regionEl) {
      if (studentShaded.has(regionKey)) {
        studentShaded.delete(regionKey);
        regionEl.classList.remove('shaded');
      } else {
        studentShaded.add(regionKey);
        regionEl.classList.add('shaded');
      }
    }
  }
}

// Bind SVG events
function initSVGListeners() {
  svg2Set.addEventListener('mousemove', (e) => handleSVGMove(e, svg2Set, false));
  svg2Set.addEventListener('mouseleave', () => handleSVGLeave(svg2Set));
  svg2Set.addEventListener('click', (e) => handleSVGClick(e, svg2Set, false));
  
  svg3Set.addEventListener('mousemove', (e) => handleSVGMove(e, svg3Set, true));
  svg3Set.addEventListener('mouseleave', () => handleSVGLeave(svg3Set));
  svg3Set.addEventListener('click', (e) => handleSVGClick(e, svg3Set, true));
}

// ==========================================
// 4. Game Control & UI Updates
// ==========================================
function loadQuestion() {
  // Clear timer and previous state
  clearInterval(timerInterval);
  studentShaded.clear();
  feedbackPanel.classList.add('hidden');
  
  // Reset SVGs visually
  const activeSvg = currentLevel === 3 ? svg3Set : svg2Set;
  activeSvg.querySelectorAll('.region').forEach(r => {
    r.classList.remove('shaded', 'hover');
  });
  
  const levelQuestions = QUESTION_POOL[currentLevel];
  if (currentQuestionIndex >= levelQuestions.length) {
    // Finished all questions in level
    showGameOver();
    return;
  }
  
  const question = levelQuestions[currentQuestionIndex];
  
  // Update UI Elements
  levelBadge.textContent = `ระดับ ${currentLevel}: ${currentLevel === 3 ? 'ดำเนินการ 3 เซต' : currentLevel === 2 ? 'ดำเนินการ 2 เซต' : 'พื้นฐาน 2 เซต'}`;
  questionIndexDisplay.textContent = `ข้อที่ ${currentQuestionIndex + 1} / ${levelQuestions.length}`;
  formulaDisplay.textContent = question.formula;
  thaiFormulaDisplay.textContent = `(${question.thaiFormula})`;
  
  // Manage Timer limit by level
  if (currentLevel === 1) timeLeft = 45;
  else if (currentLevel === 2) timeLeft = 60;
  else timeLeft = 90;
  
  timerValue.textContent = timeLeft;
  timerIcon.classList.remove('pulse');
  
  if (timerEnabled) {
    timerDisplay.classList.remove('hidden');
    startTimer();
  } else {
    timerDisplay.classList.add('hidden');
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerValue.textContent = timeLeft;
    
    if (timeLeft <= 10) {
      timerIcon.classList.add('pulse');
    }
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeOut();
    }
  }, 1000);
}

function handleTimeOut() {
  // Submit whatever they have shaded
  checkAnswer(true);
}

// Check if two sets of strings are equal
function setsEqual(setA, setB) {
  if (setA.size !== setB.size) return false;
  for (const a of setA) {
    if (!setB.has(a)) return false;
  }
  return true;
}

function checkAnswer(isTimeOut = false) {
  clearInterval(timerInterval);
  
  const isThreeSet = currentLevel === 3;
  const levelQuestions = QUESTION_POOL[currentLevel];
  const question = levelQuestions[currentQuestionIndex];
  
  // Correct regions calculated mathematically
  const correctArray = getRegionsForAST(question.ast, isThreeSet);
  const correctSet = new Set(correctArray);
  
  const isCorrect = setsEqual(correctSet, studentShaded);
  
  // Compute points and feedback
  let earnedPoints = 0;
  if (isCorrect && !isTimeOut) {
    // Correct logic
    streak++;
    if (streak > maxStreak) maxStreak = streak;
    
    // Base score: Level 1: 100, Level 2: 200, Level 3: 300
    const baseScore = currentLevel * 100;
    
    // Multiplier for streak
    let streakMultiplier = 1;
    if (streak >= 5) streakMultiplier = 2;
    else if (streak >= 3) streakMultiplier = 1.5;
    
    earnedPoints = Math.round(baseScore * streakMultiplier);
    
    // Time bonus
    const maxTime = currentLevel === 1 ? 45 : currentLevel === 2 ? 60 : 90;
    if (timerEnabled && timeLeft > maxTime / 2) {
      // 50% extra points for quick response
      const timeBonus = Math.round(earnedPoints * 0.5);
      earnedPoints += timeBonus;
    }
    
    score += earnedPoints;
    
    // Update displays
    scoreValue.textContent = score;
    streakCount.textContent = streak;
    
    // Banner styling
    feedbackBanner.className = "feedback-banner correct";
    feedbackIcon.textContent = "check_circle";
    feedbackTitle.textContent = "คำตอบถูกต้อง!";
    feedbackDesc.textContent = `ยินดีด้วย! คุณได้รับ +${earnedPoints} คะแนน (คอมโบ x${streakMultiplier})`;
  } else {
    // Incorrect logic
    streak = 0;
    streakCount.textContent = streak;
    
    feedbackBanner.className = "feedback-banner incorrect";
    feedbackIcon.textContent = "cancel";
    if (isTimeOut) {
      feedbackTitle.textContent = "หมดเวลาแล้ว!";
      feedbackDesc.textContent = "อย่าเพิ่งยอมแพ้! ลองทำความเข้าใจแนวคิดด้านล่างนี้ดูนะ";
    } else {
      feedbackTitle.textContent = "คำตอบยังไม่ถูกต้อง";
      feedbackDesc.textContent = "ไม่เป็นไรนะ! ลองศึกษาคำอธิบายและรูปเปรียบเทียบในแผงเฉลยดูนะ";
    }
  }
  
  // Populate explanation steps
  const steps = buildExplanationSteps(question.ast, isThreeSet);
  explanationSteps.innerHTML = '';
  
  steps.forEach((step, idx) => {
    const card = document.createElement('div');
    card.className = 'step-card';
    
    const num = document.createElement('div');
    num.className = 'step-num';
    num.textContent = idx + 1;
    
    const info = document.createElement('div');
    info.className = 'step-info';
    
    const formula = document.createElement('span');
    formula.className = 'step-formula';
    formula.textContent = `${step.formula} (${step.thaiFormula})`;
    
    const desc = document.createElement('span');
    desc.className = 'step-desc';
    desc.innerHTML = step.desc;
    
    info.appendChild(formula);
    info.appendChild(desc);
    card.appendChild(num);
    card.appendChild(info);
    explanationSteps.appendChild(card);
  });
  
  // Render mini diagrams
  updateMiniDiagrams(correctSet, studentShaded, isThreeSet);
  
  // Show Panel
  feedbackPanel.classList.remove('hidden');
  
  // Smooth scroll
  feedbackPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateMiniDiagrams(correctRegions, studentRegions, isThreeSet) {
  const originalSvg = document.getElementById(isThreeSet ? 'svg-3-set' : 'svg-2-set');
  
  const setupClone = (shadedSet, type) => {
    const clone = originalSvg.cloneNode(true);
    clone.removeAttribute('id');
    clone.classList.remove('hidden');
    
    // Update region classes in the clone
    const regions = clone.querySelectorAll('.region');
    regions.forEach(region => {
      const regKey = region.getAttribute('data-region');
      region.classList.remove('shaded', 'hover');
      
      if (type === 'correct') {
        if (shadedSet.has(regKey)) {
          region.classList.add('correct-shaded');
        }
      } else if (type === 'student') {
        if (shadedSet.has(regKey)) {
          region.classList.add('student-shaded');
        }
      } else if (type === 'comparison') {
        const inStudent = studentRegions.has(regKey);
        const inCorrect = correctRegions.has(regKey);
        
        if (inStudent && inCorrect) {
          region.classList.add('correct-shaded');
        } else if (!inStudent && inCorrect) {
          // Student missed it
          region.classList.add('incorrect-missing');
        } else if (inStudent && !inCorrect) {
          // Student shaded extra
          region.classList.add('incorrect-extra');
        }
      }
    });
    return clone;
  };
  
  const correctContainer = document.getElementById('correct-mini-diagram');
  const studentContainer = document.getElementById('student-mini-diagram');
  correctContainer.innerHTML = '';
  studentContainer.innerHTML = '';
  
  // 1. Correct diagram clone
  const correctClone = setupClone(correctRegions, 'correct');
  correctContainer.appendChild(correctClone);
  
  // 2. Comparison/Student diagram clone
  const isCorrect = setsEqual(correctRegions, studentRegions);
  const studentVisualBox = document.getElementById('student-visual-box');
  const studentLabel = studentVisualBox.querySelector('.visual-label');
  
  if (isCorrect) {
    studentLabel.textContent = 'คำตอบของคุณ (ถูกต้อง)';
    const studentClone = setupClone(studentRegions, 'correct');
    studentContainer.appendChild(studentClone);
  } else {
    studentLabel.textContent = 'จุดที่ผิดพลาดของคุณ (แดง: เกินมา, เหลือง: ขาดไป)';
    const studentClone = setupClone(studentRegions, 'comparison');
    studentContainer.appendChild(studentClone);
  }
}

// ==========================================
// Passcode Verification Modal Logic [Added]
// ==========================================
const TEACHER_PASSCODE = 'VennTeacher2026';
let pendingTeacherAction = null; // 'clear' or 'export'

function showPasscodeModal(action) {
  pendingTeacherAction = action;
  const modal = document.getElementById('passcode-modal');
  const input = document.getElementById('teacher-passcode-input');
  input.value = '';
  modal.classList.remove('hidden');
  input.focus();
}

function hidePasscodeModal() {
  const modal = document.getElementById('passcode-modal');
  modal.classList.add('hidden');
  pendingTeacherAction = null;
}

function handleConfirmPasscode() {
  const input = document.getElementById('teacher-passcode-input');
  if (input.value === TEACHER_PASSCODE) {
    hidePasscodeModal();
    executePendingAction();
  } else {
    alert('รหัสผ่านคุณครูไม่ถูกต้อง! ไม่สามารถอนุมัติสิทธิ์ได้');
    input.select();
  }
}

function executePendingAction() {
  if (pendingTeacherAction === 'clear') {
    if (confirm('คุณต้องการลบสถิติตารางคะแนนทั้งหมดใช่หรือไม่? (การดำเนินการนี้ไม่สามารถย้อนกลับได้)')) {
      localStorage.removeItem('venn_set_leaderboard');
      updateClassroomFilterDropdown('all');
      renderLeaderboard('all');
      alert('ล้างข้อมูลตารางคะแนนสำเร็จ!');
    }
  } else if (pendingTeacherAction === 'export') {
    exportLeaderboardToCSV();
  }
}

// ==========================================
// Leaderboard Management Functions [Added]
// ==========================================
function getLeaderboard() {
  const data = localStorage.getItem('venn_set_leaderboard');
  return data ? JSON.parse(data) : [];
}

function savePlayerScore(name, classroom, scoreVal, maxLevel, maxStreak) {
  if (!name || name.trim() === '') return;
  const leaderboard = getLeaderboard();
  
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  
  const record = {
    name: name.trim(),
    classroom: classroom && classroom.trim() !== '' ? classroom.trim() : '-',
    score: scoreVal,
    level: maxLevel,
    streak: maxStreak,
    date: dateStr
  };
  
  leaderboard.push(record);
  
  // Sort: Score descending, then streak descending
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.streak - a.streak;
  });
  
  localStorage.setItem('venn_set_leaderboard', JSON.stringify(leaderboard));
}

function updateClassroomFilterDropdown(currentFilterValue) {
  const leaderboard = getLeaderboard();
  const classFilter = document.getElementById('leaderboard-class-filter');
  
  // Extract unique classrooms
  const classrooms = new Set();
  leaderboard.forEach(rec => {
    if (rec.classroom && rec.classroom.trim() !== '' && rec.classroom.trim() !== '-') {
      classrooms.add(rec.classroom.trim());
    }
  });
  
  classFilter.innerHTML = '<option value="all">ทั้งหมด</option>';
  
  const sortedClasses = Array.from(classrooms).sort();
  sortedClasses.forEach(cls => {
    const opt = document.createElement('option');
    opt.value = cls;
    opt.textContent = cls;
    classFilter.appendChild(opt);
  });
  
  if (currentFilterValue && (classrooms.has(currentFilterValue) || currentFilterValue === 'all')) {
    classFilter.value = currentFilterValue;
  } else {
    classFilter.value = 'all';
  }
}

function renderLeaderboard(filterClass = 'all') {
  const leaderboard = getLeaderboard();
  const tableBody = document.getElementById('leaderboard-table-body');
  const noRecordsMsg = document.getElementById('no-records-msg');
  
  tableBody.innerHTML = '';
  
  let filtered = leaderboard;
  if (filterClass !== 'all') {
    filtered = leaderboard.filter(rec => rec.classroom && rec.classroom.trim() === filterClass.trim());
  }
  
  if (filtered.length === 0) {
    noRecordsMsg.classList.remove('hidden');
    return;
  }
  
  noRecordsMsg.classList.add('hidden');
  
  // Display top 20
  const top20 = filtered.slice(0, 20);
  top20.forEach((record, index) => {
    const row = document.createElement('tr');
    const rank = index + 1;
    
    let rankClass = 'rank-other';
    if (rank === 1) rankClass = 'rank-1';
    else if (rank === 2) rankClass = 'rank-2';
    else if (rank === 3) rankClass = 'rank-3';
    
    row.className = rankClass;
    
    const scoreFormatted = Number(record.score).toLocaleString();
    const clsName = record.classroom || '-';
    
    row.innerHTML = `
      <td style="text-align: center;"><span class="rank-badge">${rank}</span></td>
      <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${escapeHtml(record.name)}</td>
      <td style="padding: 12px; text-align: center; font-weight: 600; color: var(--text-muted);">${escapeHtml(clsName)}</td>
      <td style="padding: 12px; text-align: center; font-family: var(--font-en); font-weight: 600;">ระดับ ${record.level}</td>
      <td style="padding: 12px; text-align: right; font-family: var(--font-en); font-weight: 700; color: var(--primary);">${scoreFormatted}</td>
      <td style="padding: 12px; text-align: center; font-family: var(--font-en); font-weight: 600; color: var(--warning);">${record.streak}</td>
      <td style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 11px;">${record.date}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

function exportLeaderboardToCSV() {
  const leaderboard = getLeaderboard();
  if (leaderboard.length === 0) {
    alert('ไม่มีข้อมูลคะแนนที่จะส่งออก!');
    return;
  }
  
  let csvContent = '\uFEFF'; // UTF-8 BOM for Thai language Excel support
  csvContent += 'อันดับ,ชื่อผู้เล่น,ห้องเรียน,ระดับสูงสุดที่เล่น,คะแนนรวม,ตอบถูกต่อเนื่องสูงสุด,วันที่เล่น\n';
  
  leaderboard.forEach((rec, idx) => {
    const rank = idx + 1;
    const name = rec.name.replace(/"/g, '""');
    const classroom = (rec.classroom || '-').replace(/"/g, '""');
    const levelStr = `ระดับ ${rec.level}`;
    const dateStr = rec.date.replace(/"/g, '""');
    csvContent += `${rank},"${name}","${classroom}","${levelStr}",${rec.score},${rec.streak},"${dateStr}"\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'สถิติคะแนนเวนน์บอร์ด.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showGameOver() {
  finalScore.textContent = score;
  finalStreak.textContent = maxStreak;
  
  // Show save section and reset input
  document.getElementById('leaderboard-save-section').classList.remove('hidden');
  document.getElementById('save-status-msg').classList.add('hidden');
  document.getElementById('player-name-input').value = '';
  document.getElementById('player-class-input').value = '';
  
  // Control "Next Level" button visibility in Overlay
  if (currentLevel < 3) {
    nextLevelBtn.classList.remove('hidden');
    nextLevelBtn.textContent = `ไปยังระดับ ${currentLevel + 1}`;
  } else {
    nextLevelBtn.classList.add('hidden');
  }
  
  gameOverOverlay.classList.remove('hidden');
}

function handleLevelSelect(level) {
  currentLevel = level;
  currentQuestionIndex = 0;
  
  // Toggle active button style
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.getAttribute('data-level')) === level) {
      btn.classList.add('active');
    }
  });
  
  // Show appropriate SVG Venn diagram
  if (level === 3) {
    svg2Set.classList.add('hidden');
    svg3Set.classList.remove('hidden');
  } else {
    svg2Set.classList.remove('hidden');
    svg3Set.classList.add('hidden');
  }
  
  loadQuestion();
}

// ==========================================
// 5. App Initializations
// ==========================================
function initApp() {
  // Bind Buttons
  clearBtn.addEventListener('click', () => {
    const activeSvg = currentLevel === 3 ? svg3Set : svg2Set;
    studentShaded.clear();
    activeSvg.querySelectorAll('.region').forEach(r => r.classList.remove('shaded'));
  });
  
  hintBtn.addEventListener('click', () => {
    // Deduct 25 points to reveal correct shading
    if (score >= 25) {
      score -= 25;
      scoreValue.textContent = score;
    }
    
    // Automatically shade the correct regions
    const activeSvg = currentLevel === 3 ? svg3Set : svg2Set;
    const question = QUESTION_POOL[currentLevel][currentQuestionIndex];
    const correctArray = getRegionsForAST(question.ast, currentLevel === 3);
    
    studentShaded.clear();
    correctArray.forEach(reg => studentShaded.add(reg));
    
    activeSvg.querySelectorAll('.region').forEach(r => {
      const regKey = r.getAttribute('data-region');
      if (studentShaded.has(regKey)) {
        r.classList.add('shaded');
      } else {
        r.classList.remove('shaded');
      }
    });
  });
  
  submitBtn.addEventListener('click', () => checkAnswer(false));
  
  nextQuestionBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Level selection buttons
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lvl = parseInt(btn.getAttribute('data-level'));
      handleLevelSelect(lvl);
    });
  });
  
  // Timer switch toggles
  timerSwitch.addEventListener('change', (e) => {
    timerEnabled = e.target.checked;
    if (timerEnabled) {
      timerDisplay.classList.remove('hidden');
      // reload timer
      clearInterval(timerInterval);
      loadQuestion();
    } else {
      clearInterval(timerInterval);
      timerDisplay.classList.add('hidden');
    }
  });
  
  // Overlay buttons
  replayBtn.addEventListener('click', () => {
    gameOverOverlay.classList.add('hidden');
    score = 0;
    streak = 0;
    scoreValue.textContent = 0;
    streakCount.textContent = 0;
    currentQuestionIndex = 0;
    loadQuestion();
  });
  
  nextLevelBtn.addEventListener('click', () => {
    gameOverOverlay.classList.add('hidden');
    if (currentLevel < 3) {
      handleLevelSelect(currentLevel + 1);
    }
  });

  // Leaderboard DOM bindings [Added/Updated]
  const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
  const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
  const leaderboardModal = document.getElementById('leaderboard-modal');
  const clearLeaderboardBtn = document.getElementById('clear-leaderboard-btn');
  const exportLeaderboardBtn = document.getElementById('export-leaderboard-btn');
  const saveScoreBtn = document.getElementById('save-score-btn');
  const playerNameInput = document.getElementById('player-name-input');
  const playerClassInput = document.getElementById('player-class-input');
  const classFilter = document.getElementById('leaderboard-class-filter');
  
  // Passcode Modal Bindings [Added]
  const cancelPasscodeBtn = document.getElementById('cancel-passcode-btn');
  const confirmPasscodeBtn = document.getElementById('confirm-passcode-btn');
  const passcodeField = document.getElementById('teacher-passcode-input');
  
  viewLeaderboardBtn.addEventListener('click', () => {
    updateClassroomFilterDropdown('all');
    renderLeaderboard('all');
    leaderboardModal.classList.remove('hidden');
  });
  
  closeLeaderboardBtn.addEventListener('click', () => {
    leaderboardModal.classList.add('hidden');
  });
  
  // Protected by Passcode Modal
  clearLeaderboardBtn.addEventListener('click', () => {
    showPasscodeModal('clear');
  });

  // Protected by Passcode Modal
  exportLeaderboardBtn.addEventListener('click', () => {
    showPasscodeModal('export');
  });
  
  classFilter.addEventListener('change', (e) => {
    renderLeaderboard(e.target.value);
  });
  
  saveScoreBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    const classroom = playerClassInput.value.trim();
    
    if (name === '') {
      alert('กรุณากรอกชื่อผู้เล่นก่อนบันทึกคะแนน!');
      return;
    }
    
    savePlayerScore(name, classroom, score, currentLevel, maxStreak);
    
    // Hide input section and show success msg
    document.getElementById('leaderboard-save-section').classList.add('hidden');
    document.getElementById('save-status-msg').classList.remove('hidden');
    
    // Show leaderboard immediately after saving
    setTimeout(() => {
      updateClassroomFilterDropdown('all');
      renderLeaderboard('all');
      leaderboardModal.classList.remove('hidden');
    }, 800);
  });
  
  // Passcode Modal Button Events
  cancelPasscodeBtn.addEventListener('click', hidePasscodeModal);
  confirmPasscodeBtn.addEventListener('click', handleConfirmPasscode);
  passcodeField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleConfirmPasscode();
    }
  });
  
  // SVG Listeners for exact coordinates
  initSVGListeners();
  
  // Initial load
  loadQuestion();
}

// Run App
window.addEventListener('DOMContentLoaded', initApp);
