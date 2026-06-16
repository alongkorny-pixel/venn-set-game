// ==========================================
// Venn Diagram Set Operations Game - Core Logic
// ==========================================

// AST Helper Functions
const SetNode = (name) => ({ type: 'set', name });
const ComplementNode = (expr) => ({ type: 'complement', expr });
const UnionNode = (left, right) => ({ type: 'union', left, right });
const IntersectNode = (left, right) => ({ type: 'intersect', left, right });
const DifferenceNode = (left, right) => ({ type: 'difference', left, right });

// ==========================================
// Config: Online Leaderboard URL (Google Sheets Apps Script Web App)
// ==========================================
// ถ้าต้องการใช้สถิติออนไลน์ ให้วางลิงก์ Web App URL จาก Google Apps Script ที่ช่องนี้
// ตัวอย่าง: 'https://script.google.com/macros/s/AKfycbz.../exec'
// หากปล่อยเป็นค่าว่าง ระบบจะสลับไปบันทึกสถิติแบบออฟไลน์ลงเครื่อง (localStorage) แทนอัตโนมัติ
const ONLINE_LEADERBOARD_API_URL = 'https://script.google.com/macros/s/AKfycbyMWDBrZ6onZVEC_bMdvxn2A2p0pKCM1TdhuQkW0vYJGFnuuKAy3BF8FkNl9uO07F45/exec'; 

// Curated Question Pool for 3 Levels (30+ questions per level for high variety)
const QUESTION_POOL = {
  1: [
    { ast: SetNode('A'), formula: "A", thaiFormula: "เซต A", difficulty: "ง่าย" },
    { ast: SetNode('B'), formula: "B", thaiFormula: "เซต B", difficulty: "ง่าย" },
    { ast: ComplementNode(SetNode('A')), formula: "A'", thaiFormula: "คอมพลีเมนต์ของเซต A (ไม่ใช่ A)", difficulty: "ง่าย" },
    { ast: ComplementNode(SetNode('B')), formula: "B'", thaiFormula: "คอมพลีเมนต์ของเซต B (ไม่ใช่ B)", difficulty: "ง่าย" },
    { ast: SetNode('U'), formula: "U", thaiFormula: "เอกภพสัมพัทธ์ U (พื้นที่ทั้งหมด)", difficulty: "ง่าย" },
    { ast: SetNode('empty'), formula: "∅", thaiFormula: "เซตว่าง (ไม่แรเงาพื้นที่ใดเลย)", difficulty: "ง่าย" },
    { ast: IntersectNode(SetNode('A'), SetNode('B')), formula: "A ∩ B", thaiFormula: "A อินเตอร์เซกชัน B (ส่วนซ้ำ)", difficulty: "ง่าย" },
    { ast: UnionNode(SetNode('A'), SetNode('B')), formula: "A ∪ B", thaiFormula: "A ยูเนียน B (รวม A และ B)", difficulty: "ง่าย" },
    { ast: DifferenceNode(SetNode('A'), SetNode('B')), formula: "A − B", thaiFormula: "A ผลต่าง B (เอา A ไม่เอา B)", difficulty: "ง่าย" },
    { ast: DifferenceNode(SetNode('B'), SetNode('A')), formula: "B − A", thaiFormula: "B ผลต่าง A (เอา B ไม่เอา A)", difficulty: "ง่าย" },
    { ast: ComplementNode(UnionNode(SetNode('A'), SetNode('B'))), formula: "(A ∪ B)'", thaiFormula: "ไม่เอาทั้ง A และ B", difficulty: "ง่าย" },
    { ast: ComplementNode(IntersectNode(SetNode('A'), SetNode('B'))), formula: "(A ∩ B)'", thaiFormula: "ทุกพื้นที่ยกเว้นจุดซ้ำกัน", difficulty: "ง่าย" },
    { ast: UnionNode(SetNode('A'), SetNode('A')), formula: "A ∪ A", thaiFormula: "เซต A ยูเนียนตัวเอง", difficulty: "ง่าย" },
    { ast: IntersectNode(SetNode('A'), SetNode('A')), formula: "A ∩ A", thaiFormula: "เซต A อินเตอร์เซกชันตัวเอง", difficulty: "ง่าย" },
    { ast: UnionNode(SetNode('B'), SetNode('B')), formula: "B ∪ B", thaiFormula: "เซต B ยูเนียนตัวเอง", difficulty: "ง่าย" },
    { ast: IntersectNode(SetNode('B'), SetNode('B')), formula: "B ∩ B", thaiFormula: "เซต B อินเตอร์เซกชันตัวเอง", difficulty: "ง่าย" },
    { ast: DifferenceNode(SetNode('A'), SetNode('A')), formula: "A − A", thaiFormula: "เซต A หักตัวเองออก (เซตว่าง)", difficulty: "ง่าย" },
    { ast: DifferenceNode(SetNode('B'), SetNode('B')), formula: "B − B", thaiFormula: "เซต B หักตัวเองออก (เซตว่าง)", difficulty: "ง่าย" },
    { ast: UnionNode(SetNode('A'), SetNode('empty')), formula: "A ∪ ∅", thaiFormula: "เซต A รวมกับเซตว่าง", difficulty: "ง่าย" },
    { ast: IntersectNode(SetNode('A'), SetNode('empty')), formula: "A ∩ ∅", thaiFormula: "เซต A ร่วมกับเซตว่าง", difficulty: "ง่าย" },
    { ast: UnionNode(SetNode('B'), SetNode('empty')), formula: "B ∪ ∅", thaiFormula: "เซต B รวมกับเซตว่าง", difficulty: "ง่าย" },
    { ast: IntersectNode(SetNode('B'), SetNode('empty')), formula: "B ∩ ∅", thaiFormula: "เซต B ร่วมกับเซตว่าง", difficulty: "ง่าย" },
    { ast: UnionNode(SetNode('A'), SetNode('U')), formula: "A ∪ U", thaiFormula: "เซต A รวมกับเอกภพสัมพัทธ์", difficulty: "ง่าย" },
    { ast: IntersectNode(SetNode('A'), SetNode('U')), formula: "A ∩ U", thaiFormula: "เซต A ในเอกภพสัมพัทธ์", difficulty: "ง่าย" },
    { ast: UnionNode(SetNode('B'), SetNode('U')), formula: "B ∪ U", thaiFormula: "เซต B รวมกับเอกภพสัมพัทธ์", difficulty: "ง่าย" },
    { ast: IntersectNode(SetNode('B'), SetNode('U')), formula: "B ∩ U", thaiFormula: "เซต B ในเอกภพสัมพัทธ์", difficulty: "ง่าย" },
    { ast: ComplementNode(SetNode('U')), formula: "U'", thaiFormula: "คอมพลีเมนต์ของเอกภพสัมพัทธ์", difficulty: "ง่าย" },
    { ast: ComplementNode(SetNode('empty')), formula: "∅'", thaiFormula: "คอมพลีเมนต์ของเซตว่าง", difficulty: "ง่าย" },
    { ast: ComplementNode(DifferenceNode(SetNode('A'), SetNode('B'))), formula: "(A − B)'", thaiFormula: "ไม่ใช่ (A ผลต่าง B)", difficulty: "ง่าย" },
    { ast: ComplementNode(DifferenceNode(SetNode('B'), SetNode('A'))), formula: "(B − A)'", thaiFormula: "ไม่ใช่ (B ผลต่าง A)", difficulty: "ง่าย" }
  ],
  2: [
    { ast: ComplementNode(UnionNode(SetNode('A'), SetNode('B'))), formula: "(A ∪ B)'", thaiFormula: "คอมพลีเมนต์ของ A ยูเนียน B", difficulty: "ปานกลาง" },
    { ast: ComplementNode(IntersectNode(SetNode('A'), SetNode('B'))), formula: "(A ∩ B)'", thaiFormula: "คอมพลีเมนต์ของ A อินเตอร์เซกชัน B", difficulty: "ปานกลาง" },
    { ast: IntersectNode(SetNode('A'), ComplementNode(SetNode('B'))), formula: "A ∩ B'", thaiFormula: "A อินเตอร์เซกชันกับ คอมพลีเมนต์ของ B (A − B)", difficulty: "ปานกลาง" },
    { ast: IntersectNode(ComplementNode(SetNode('A')), SetNode('B')), formula: "A' ∩ B", thaiFormula: "คอมพลีเมนต์ของ A อินเตอร์เซกชันกับ B (B − A)", difficulty: "ปานกลาง" },
    { ast: IntersectNode(ComplementNode(SetNode('A')), ComplementNode(SetNode('B'))), formula: "A' ∩ B'", thaiFormula: "ไม่เอา A และไม่เอา B (ขอบนอกทั้งหมด)", difficulty: "ปานกลาง" },
    { ast: UnionNode(ComplementNode(SetNode('A')), ComplementNode(SetNode('B'))), formula: "A' ∪ B'", thaiFormula: "ไม่ใช่ A หรือไม่ใช่ B (ยกเว้นตรงกลางซ้ำ)", difficulty: "ปานกลาง" },
    { ast: UnionNode(SetNode('A'), ComplementNode(SetNode('B'))), formula: "A ∪ B'", thaiFormula: "A ยูเนียนกับ คอมพลีเมนต์ของ B", difficulty: "ปานกลาง" },
    { ast: UnionNode(ComplementNode(SetNode('A')), SetNode('B')), formula: "A' ∪ B", thaiFormula: "คอมพลีเมนต์ของ A ยูเนียนกับ B", difficulty: "ปานกลาง" },
    { ast: ComplementNode(DifferenceNode(SetNode('A'), SetNode('B'))), formula: "(A − B)'", thaiFormula: "คอมพลีเมนต์ของ A ผลต่าง B", difficulty: "ปานกลาง" },
    { ast: ComplementNode(DifferenceNode(SetNode('B'), SetNode('A'))), formula: "(B − A)'", thaiFormula: "คอมพลีเมนต์ของ B ผลต่าง A", difficulty: "ปานกลาง" },
    { ast: UnionNode(IntersectNode(SetNode('A'), SetNode('B')), ComplementNode(SetNode('A'))), formula: "(A ∩ B) ∪ A'", thaiFormula: "ส่วนซ้ำรวมกับพื้นที่ภายนอก A", difficulty: "ปานกลาง" },
    { ast: UnionNode(IntersectNode(SetNode('A'), SetNode('B')), ComplementNode(SetNode('B'))), formula: "(A ∩ B) ∪ B'", thaiFormula: "ส่วนซ้ำรวมกับพื้นที่ภายนอก B", difficulty: "ปานกลาง" },
    { ast: IntersectNode(UnionNode(SetNode('A'), SetNode('B')), ComplementNode(SetNode('A'))), formula: "(A ∪ B) ∩ A'", thaiFormula: "ผลรวม A, B ส่วนที่อยู่นอก A", difficulty: "ปานกลาง" },
    { ast: IntersectNode(UnionNode(SetNode('A'), SetNode('B')), ComplementNode(SetNode('B'))), formula: "(A ∪ B) ∩ B'", thaiFormula: "ผลรวม A, B ส่วนที่อยู่นอก B", difficulty: "ปานกลาง" },
    { ast: UnionNode(DifferenceNode(SetNode('A'), SetNode('B')), SetNode('B')), formula: "(A − B) ∪ B", thaiFormula: "A ผลต่าง B รวมกับ B (A ∪ B)", difficulty: "ปานกลาง" },
    { ast: UnionNode(DifferenceNode(SetNode('B'), SetNode('A')), SetNode('A')), formula: "(B − A) ∪ A", thaiFormula: "B ผลต่าง A รวมกับ A (A ∪ B)", difficulty: "ปานกลาง" },
    { ast: IntersectNode(DifferenceNode(SetNode('A'), SetNode('B')), SetNode('B')), formula: "(A − B) ∩ B", thaiFormula: "A ผลต่าง B ร่วมกับ B (เซตว่าง)", difficulty: "ปานกลาง" },
    { ast: IntersectNode(DifferenceNode(SetNode('B'), SetNode('A')), SetNode('A')), formula: "(B − A) ∩ A", thaiFormula: "B ผลต่าง A ร่วมกับ A (เซตว่าง)", difficulty: "ปานกลาง" },
    { ast: DifferenceNode(ComplementNode(SetNode('A')), SetNode('B')), formula: "A' − B", thaiFormula: "ไม่เอา A และหักเซต B ออก", difficulty: "ปานกลาง" },
    { ast: DifferenceNode(ComplementNode(SetNode('B')), SetNode('A')), formula: "B' − A", thaiFormula: "ไม่เอา B และหักเซต A ออก", difficulty: "ปานกลาง" },
    { ast: DifferenceNode(SetNode('A'), ComplementNode(SetNode('B'))), formula: "A − B'", thaiFormula: "A หักส่วนที่ไม่ใช่ B ออก (A ∩ B)", difficulty: "ปานกลาง" },
    { ast: DifferenceNode(SetNode('B'), ComplementNode(SetNode('A'))), formula: "B − A'", thaiFormula: "B หักส่วนที่ไม่ใช่ A ออก (A ∩ B)", difficulty: "ปานกลาง" },
    { ast: ComplementNode(DifferenceNode(ComplementNode(SetNode('A')), SetNode('B'))), formula: "(A' − B)'", thaiFormula: "ไม่ใช่ (A' ผลต่าง B)", difficulty: "ปานกลาง" },
    { ast: ComplementNode(DifferenceNode(ComplementNode(SetNode('B')), SetNode('A'))), formula: "(B' − A)'", thaiFormula: "ไม่ใช่ (B' ผลต่าง A)", difficulty: "ปานกลาง" },
    { ast: DifferenceNode(ComplementNode(SetNode('A')), ComplementNode(SetNode('B'))), formula: "A' − B'", thaiFormula: "พื้นที่นอก A หักส่วนนอก B (B − A)", difficulty: "ปานกลาง" },
    { ast: DifferenceNode(ComplementNode(SetNode('B')), ComplementNode(SetNode('A'))), formula: "B' − A'", thaiFormula: "พื้นที่นอก B หักส่วนนอก A (A − B)", difficulty: "ปานกลาง" },
    { ast: ComplementNode(IntersectNode(ComplementNode(SetNode('A')), SetNode('B'))), formula: "(A' ∩ B)'", thaiFormula: "ไม่ใช่ (A' อินเตอร์เซกชัน B)", difficulty: "ปานกลาง" },
    { ast: ComplementNode(IntersectNode(SetNode('A'), ComplementNode(SetNode('B')))), formula: "(A ∩ B')'", thaiFormula: "ไม่ใช่ (A อินเตอร์เซกชัน B')", difficulty: "ปานกลาง" },
    { ast: ComplementNode(UnionNode(ComplementNode(SetNode('A')), SetNode('B'))), formula: "(A' ∪ B)'", thaiFormula: "ไม่ใช่ (A' ยูเนียน B)", difficulty: "ปานกลาง" },
    { ast: ComplementNode(UnionNode(SetNode('A'), ComplementNode(SetNode('B')))), formula: "(A ∪ B')'", thaiFormula: "ไม่ใช่ (A ยูเนียน B')", difficulty: "ปานกลาง" }
  ],
  3: [
    { ast: IntersectNode(IntersectNode(SetNode('A'), SetNode('B')), SetNode('C')), formula: "A ∩ B ∩ C", thaiFormula: "จุดร่วมตรงกลางสุดของสามเซต", difficulty: "ท้าทาย" },
    { ast: UnionNode(UnionNode(SetNode('A'), SetNode('B')), SetNode('C')), formula: "A ∪ B ∪ C", thaiFormula: "พื้นที่วงกลมทั้งหมดรวมกัน", difficulty: "ท้าทาย" },
    { ast: ComplementNode(UnionNode(UnionNode(SetNode('A'), SetNode('B')), SetNode('C'))), formula: "(A ∪ B ∪ C)'", thaiFormula: "พื้นที่นอกวงกลมทั้งหมด", difficulty: "ท้าทาย" },
    { ast: DifferenceNode(IntersectNode(SetNode('A'), SetNode('B')), SetNode('C')), formula: "(A ∩ B) − C", thaiFormula: "ส่วนซ้ำของ A และ B หักเซต C ออก", difficulty: "ท้าทาย" },
    { ast: DifferenceNode(UnionNode(SetNode('A'), SetNode('B')), SetNode('C')), formula: "(A ∪ B) − C", thaiFormula: "ยูเนียนของ A และ B หักเซต C ออก", difficulty: "ท้าทาย" },
    { ast: DifferenceNode(SetNode('A'), UnionNode(SetNode('B'), SetNode('C'))), formula: "A − (B ∪ C)", thaiFormula: "เซต A หักพื้นที่ของ B และ C ออก", difficulty: "ท้าทาย" },
    { ast: DifferenceNode(SetNode('B'), UnionNode(SetNode('A'), SetNode('C'))), formula: "B − (A ∪ C)", thaiFormula: "เซต B หักพื้นที่ของ A และ C ออก", difficulty: "ท้าทาย" },
    { ast: DifferenceNode(SetNode('C'), UnionNode(SetNode('A'), SetNode('B'))), formula: "C − (A ∪ B)", thaiFormula: "เซต C หักพื้นที่ของ A และ B ออก", difficulty: "ท้าทาย" },
    { ast: IntersectNode(ComplementNode(SetNode('A')), IntersectNode(SetNode('B'), SetNode('C'))), formula: "A' ∩ (B ∩ C)", thaiFormula: "ส่วนร่วม B, C ที่อยู่นอกวง A", difficulty: "ท้าทาย" },
    { ast: IntersectNode(SetNode('A'), ComplementNode(UnionNode(SetNode('B'), SetNode('C')))), formula: "A ∩ (B ∪ C)'", thaiFormula: "A ร่วมกับพื้นที่นอก B และ C", difficulty: "ท้าทาย" },
    { ast: UnionNode(IntersectNode(SetNode('A'), SetNode('C')), IntersectNode(SetNode('B'), SetNode('C'))), formula: "(A ∩ C) ∪ (B ∩ C)", thaiFormula: "(A ซ้ำ C) รวมกับ (B ซ้ำ C)", difficulty: "ท้าทาย" },
    { ast: ComplementNode(IntersectNode(IntersectNode(SetNode('A'), SetNode('B')), SetNode('C'))), formula: "(A ∩ B ∩ C)'", thaiFormula: "ทุกพื้นที่ยกเว้นตรงกลางสุด", difficulty: "ท้าทาย" },
    { ast: UnionNode(IntersectNode(SetNode('A'), SetNode('B')), SetNode('C')), formula: "(A ∩ B) ∪ C", thaiFormula: "ส่วนร่วม A, B รวมกับเซต C ทั้งวง", difficulty: "ท้าทาย" },
    { ast: IntersectNode(ComplementNode(UnionNode(SetNode('A'), SetNode('B'))), SetNode('C')), formula: "(A ∪ B)' ∩ C", thaiFormula: "อยู่ใน C แต่ไม่อยู่ใน A และ B", difficulty: "ท้าทาย" },
    { ast: IntersectNode(IntersectNode(ComplementNode(SetNode('A')), ComplementNode(SetNode('B'))), ComplementNode(SetNode('C'))), formula: "A' ∩ B' ∩ C'", thaiFormula: "พื้นที่นอกวงกลมทั้งหมด", difficulty: "ท้าทาย" },
    { ast: DifferenceNode(UnionNode(UnionNode(SetNode('A'), SetNode('B')), SetNode('C')), IntersectNode(IntersectNode(SetNode('A'), SetNode('B')), SetNode('C'))), formula: "(A ∪ B ∪ C) − (A ∩ B ∩ C)", thaiFormula: "วงกลมสามวงลบส่วนร่วมตรงกลางสุดออก", difficulty: "ท้าทาย" },
    { ast: UnionNode(UnionNode(IntersectNode(SetNode('A'), SetNode('B')), IntersectNode(SetNode('B'), SetNode('C'))), IntersectNode(SetNode('A'), SetNode('C'))), formula: "(A ∩ B) ∪ (B ∩ C) ∪ (A ∩ C)", thaiFormula: "พื้นที่ซ้ำของทุกคู่เซต", difficulty: "ท้าทาย" },
    { ast: IntersectNode(IntersectNode(SetNode('A'), ComplementNode(SetNode('B'))), ComplementNode(SetNode('C'))), formula: "A ∩ B' ∩ C'", thaiFormula: "พื้นที่ที่เป็นของเซต A เท่านั้น", difficulty: "ท้าทาย" },
    { ast: IntersectNode(IntersectNode(ComplementNode(SetNode('A')), SetNode('B')), ComplementNode(SetNode('C'))), formula: "A' ∩ B ∩ C'", thaiFormula: "พื้นที่ที่เป็นของเซต B เท่านั้น", difficulty: "ท้าทาย" },
    { ast: IntersectNode(IntersectNode(ComplementNode(SetNode('A')), ComplementNode(SetNode('B'))), SetNode('C')), formula: "A' ∩ B' ∩ C", thaiFormula: "พื้นที่ที่เป็นของเซต C เท่านั้น", difficulty: "ท้าทาย" },
    { ast: UnionNode(ComplementNode(UnionNode(UnionNode(SetNode('A'), SetNode('B')), SetNode('C'))), IntersectNode(IntersectNode(SetNode('A'), SetNode('B')), SetNode('C'))), formula: "(A ∪ B ∪ C)' ∪ (A ∩ B ∩ C)", thaiFormula: "พื้นที่รอบนอกสุด รวมกับตรงกลางสุด", difficulty: "ท้าทาย" },
    { ast: IntersectNode(DifferenceNode(SetNode('A'), SetNode('B')), SetNode('C')), formula: "(A − B) ∩ C", thaiFormula: "อยู่ใน A แต่ไม่อยู่ใน B และอยู่ใน Cด้วย", difficulty: "ท้าทาย" },
    { ast: IntersectNode(DifferenceNode(SetNode('B'), SetNode('C')), SetNode('A')), formula: "(B − C) ∩ A", thaiFormula: "อยู่ใน B แต่ไม่อยู่ใน C และอยู่ใน Aด้วย", difficulty: "ท้าทาย" },
    { ast: IntersectNode(DifferenceNode(SetNode('C'), SetNode('A')), SetNode('B')), formula: "(C − A) ∩ B", thaiFormula: "อยู่ใน C แต่ไม่อยู่ใน A และอยู่ใน Bด้วย", difficulty: "ท้าทาย" },
    { ast: UnionNode(SetNode('A'), IntersectNode(SetNode('B'), SetNode('C'))), formula: "A ∪ (B ∩ C)", thaiFormula: "เซต A รวมกับส่วนซ้ำของ B และ C", difficulty: "ท้าทาย" },
    { ast: UnionNode(SetNode('B'), IntersectNode(SetNode('A'), SetNode('C'))), formula: "B ∪ (A ∩ C)", thaiFormula: "เซต B รวมกับส่วนซ้ำของ A และ C", difficulty: "ท้าทาย" },
    { ast: UnionNode(SetNode('C'), IntersectNode(SetNode('A'), SetNode('B'))), formula: "C ∪ (A ∩ B)", thaiFormula: "เซต C รวมกับส่วนซ้ำของ A และ B", difficulty: "ท้าทาย" },
    { ast: IntersectNode(UnionNode(SetNode('A'), SetNode('B')), SetNode('C')), formula: "(A ∪ B) ∩ C", thaiFormula: "ผลรวม A, B ส่วนที่ทับซ้อนกับ C", difficulty: "ท้าทาย" },
    { ast: IntersectNode(UnionNode(SetNode('B'), SetNode('C')), SetNode('A')), formula: "(B ∪ C) ∩ A", thaiFormula: "ผลรวม B, C ส่วนที่ทับซ้อนกับ A", difficulty: "ท้าทาย" },
    { ast: IntersectNode(UnionNode(SetNode('A'), SetNode('C')), SetNode('B')), formula: "(A ∪ C) ∩ B", thaiFormula: "ผลรวม A, C ส่วนที่ทับซ้อนกับ B", difficulty: "ท้าทาย" },
    { ast: UnionNode(UnionNode(DifferenceNode(SetNode('A'), SetNode('B')), DifferenceNode(SetNode('B'), SetNode('C'))), DifferenceNode(SetNode('C'), SetNode('A'))), formula: "(A − B) ∪ (B − C) ∪ (C − A)", thaiFormula: "ผลรวมของผลต่างวนสามรอบ", difficulty: "ท้าทาย" },
    { ast: IntersectNode(ComplementNode(IntersectNode(SetNode('A'), SetNode('B'))), SetNode('C')), formula: "(A ∩ B)' ∩ C", thaiFormula: "อยู่ใน C และอยู่นอกพื้นที่ซ้ำ A, B", difficulty: "ท้าทาย" },
    { ast: UnionNode(ComplementNode(SetNode('A')), ComplementNode(IntersectNode(SetNode('B'), SetNode('C')))), formula: "A' ∪ (B ∩ C)'", thaiFormula: "พื้นที่ภายนอก A หรือพื้นที่นอกจุดซ้ำ B, C", difficulty: "ท้าทาย" },
    { ast: UnionNode(DifferenceNode(SetNode('A'), SetNode('B')), SetNode('C')), formula: "(A − B) ∪ C", thaiFormula: "(A หัก B) รวมกับเซต C ทั้งหมด", difficulty: "ท้าทาย" },
    { ast: UnionNode(ComplementNode(IntersectNode(SetNode('A'), SetNode('B'))), ComplementNode(SetNode('C'))), formula: "(A ∩ B)' ∪ C'", thaiFormula: "พื้นที่นอกจุดซ้ำ A, B หรือพื้นที่นอก C", difficulty: "ท้าทาย" }
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
let activeQuestions = []; // Shuffled active questions for the current session (10 items)

// Fisher-Yates Shuffle Utility
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Initialize Active Shuffled Questions for Level
function initActiveQuestions() {
  const pool = QUESTION_POOL[currentLevel];
  const shuffled = shuffleArray(pool);
  activeQuestions = shuffled.slice(0, 10); // Select 10 random questions per session
}


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
  
  // Handle both mouse events and touch events
  if (event.touches && event.touches.length > 0) {
    point.x = event.touches[0].clientX;
    point.y = event.touches[0].clientY;
  } else if (event.changedTouches && event.changedTouches.length > 0) {
    point.x = event.changedTouches[0].clientX;
    point.y = event.changedTouches[0].clientY;
  } else {
    point.x = event.clientX;
    point.y = event.clientY;
  }
  
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
  // Mouse events (desktop)
  svg2Set.addEventListener('mousemove', (e) => handleSVGMove(e, svg2Set, false));
  svg2Set.addEventListener('mouseleave', () => handleSVGLeave(svg2Set));
  svg2Set.addEventListener('click', (e) => handleSVGClick(e, svg2Set, false));
  
  svg3Set.addEventListener('mousemove', (e) => handleSVGMove(e, svg3Set, true));
  svg3Set.addEventListener('mouseleave', () => handleSVGLeave(svg3Set));
  svg3Set.addEventListener('click', (e) => handleSVGClick(e, svg3Set, true));
  
  // Touch events (mobile / tablet)
  svg2Set.addEventListener('touchstart', (e) => {
    e.preventDefault(); // prevent scroll/zoom when tapping SVG
    handleSVGClick(e, svg2Set, false);
  }, { passive: false });
  
  svg2Set.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleSVGMove(e, svg2Set, false);
  }, { passive: false });
  
  svg2Set.addEventListener('touchend', () => handleSVGLeave(svg2Set));
  
  svg3Set.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleSVGClick(e, svg3Set, true);
  }, { passive: false });
  
  svg3Set.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleSVGMove(e, svg3Set, true);
  }, { passive: false });
  
  svg3Set.addEventListener('touchend', () => handleSVGLeave(svg3Set));
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
  
  const levelQuestions = activeQuestions;
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
  const levelQuestions = activeQuestions;
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
    if (timerEnabled && timeLeft >  // Fallback to localStorage
  const data = localStorage.getItem('venn_set_leaderboard');
  return data ? JSON.parse(data) : [];
}

async function savePlayerScore(name, classroom, scoreVal, maxLevel, maxStreak) {
  if (!name || name.trim() === '') return;
  
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
  
  // 1. Save locally first (reliable local back-up)
  try {
    const localData = localStorage.getItem('venn_set_leaderboard');
    const leaderboard = localData ? JSON.parse(localData) : [];
    leaderboard.push(record);
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.streak - a.streak;
    });
    localStorage.setItem('venn_set_leaderboard', JSON.stringify(leaderboard));
  } catch (e) {
    console.error("Local storage save failed:", e);
  }
  
  // 2. Save online if API URL is configured
  if (ONLINE_LEADERBOARD_API_URL && ONLINE_LEADERBOARD_API_URL.trim() !== '') {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout
      
      // Use text/plain type to bypass Google Apps Script CORS Preflight options check
      const response = await fetch(ONLINE_LEADERBOARD_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(record),
        signal: controller.signal
      });
      clearTimeout(id);
      
      if (response.ok) {
        console.log("ส่งบันทึกสถิติไปยังระบบออนไลน์สำเร็จ!");
        return;
      }
    } catch (e) {
      console.warn("ไม่สามารถบันทึกสถิติออนไลน์ได้:", e);
      throw new Error("offline_fallback");
    }
  }
}

async function updateClassroomFilterDropdown(currentFilterValue) {
  const leaderboard = await getLeaderboard();
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

async function renderLeaderboard(filterClass = 'all') {
  const tableBody = document.getElementById('leaderboard-table-body');
  const noRecordsMsg = document.getElementById('no-records-msg');
  
  // Show loading indicator
  tableBody.innerHTML = `
    <tr>
      <td colspan="7" style="text-align: center; padding: 30px; font-weight: 500; color: var(--text-muted);">
        <span style="display: inline-block; animation: spin 1s linear infinite; margin-right: 8px; font-size: 16px;">⏳</span> 
        กำลังเชื่อมต่อตารางคะแนนออนไลน์...
      </td>
    </tr>
  `;
  noRecordsMsg.classList.add('hidden');
  
  let leaderboard = [];
  try {
    leaderboard = await getLeaderboard();
  } catch (e) {
    console.error("Failed to load leaderboard:", e);
  }
  
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

async function exportLeaderboardToCSV() {
  let leaderboard = [];
  try {
    leaderboard = await getLeaderboard();
  } catch (e) {
    console.error("Failed to load leaderboard for CSV export:", e);
  }
  
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
    const dateStr = (rec.date || '').replace(/"/g, '""');
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

// Helper: offer to save score before resetting (used by replay/level-change mid-game)
function offerSaveBeforeReset() {
  return new Promise((resolve) => {
    if (score <= 0) {
      resolve();
      return;
    }
    // Show the game-over overlay so the player can save
    showGameOver();
    // We resolve immediately — the player can save from the overlay
    // The replay/next-level buttons inside the overlay will handle the actual reset
    resolve('showed_overlay');
  });
}

function handleLevelSelect(level, fromOverlay = false) {
  currentLevel = level;
  currentQuestionIndex = 0;
  
  // Reset score & streak only when selecting a new level from the level bar (not from overlay)
  if (!fromOverlay) {
    score = 0;
    streak = 0;
    maxStreak = 0;
    scoreValue.textContent = 0;
    streakCount.textContent = 0;
  }
  
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
  
  initActiveQuestions(); // Shuffling questions dynamically for the level
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
    const question = activeQuestions[currentQuestionIndex];
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
      if (lvl === currentLevel) return; // same level, do nothing
      
      if (score > 0 && currentQuestionIndex > 0) {
        const confirmMsg = `คุณมีคะแนน ${score} คะแนนที่ยังไม่ได้บันทึก!\n\nหากเปลี่ยนระดับ คะแนนจะถูกรีเซ็ต\nต้องการบันทึกคะแนนก่อนหรือไม่?\n\n• กด "ตกลง" เพื่อเปิดหน้าบันทึกคะแนนก่อน\n• กด "ยกเลิก" เพื่อเปลี่ยนระดับทันที (คะแนนหาย)`;
        if (confirm(confirmMsg)) {
          showGameOver();
          return; // Let them save, then manually select level
        }
      }
      
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
    maxStreak = 0;
    scoreValue.textContent = 0;
    streakCount.textContent = 0;
    currentQuestionIndex = 0;
    initActiveQuestions(); // Shuffle questions for replay
    loadQuestion();
  });
  
  nextLevelBtn.addEventListener('click', () => {
    gameOverOverlay.classList.add('hidden');
    if (currentLevel < 3) {
      handleLevelSelect(currentLevel + 1, true);
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
  
  viewLeaderboardBtn.addEventListener('click', async () => {
    await updateClassroomFilterDropdown('all');
    await renderLeaderboard('all');
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
  
  classFilter.addEventListener('change', async (e) => {
    await renderLeaderboard(e.target.value);
  });
  
  saveScoreBtn.addEventListener('click', async () => {
    const name = playerNameInput.value.trim();
    const classroom = playerClassInput.value.trim();
    
    if (name === '') {
      alert('กรุณากรอกชื่อผู้เล่นก่อนบันทึกคะแนน!');
      return;
    }
    
    if (score <= 0) {
      alert('คะแนนเป็น 0 ไม่สามารถบันทึกได้ ลองเล่นอีกครั้งนะ!');
      return;
    }
    
    try {
      await savePlayerScore(name, classroom, score, currentLevel, maxStreak);
      
      // Hide input section and show success msg
      document.getElementById('leaderboard-save-section').classList.add('hidden');
      document.getElementById('save-status-msg').classList.remove('hidden');
      
      // Show leaderboard immediately after saving
      setTimeout(async () => {
        await updateClassroomFilterDropdown('all');
        await renderLeaderboard('all');
        leaderboardModal.classList.remove('hidden');
      }, 800);
    } catch (e) {
      console.error('Error saving score to localStorage/Online API:', e);
      if (e.message === "offline_fallback") {
        alert('บันทึกคะแนนลงในเครื่องเรียบร้อยแล้ว! (หมายเหตุ: ระบบเชื่อมต่อออนไลน์ขัดข้องชั่วคราว ข้อมูลนี้จึงถูกเก็บแบบออฟไลน์บนเครื่องนี้ก่อน)');
        setTimeout(async () => {
          await updateClassroomFilterDropdown('all');
          await renderLeaderboard('all');
          leaderboardModal.classList.remove('hidden');
        }, 800);
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกคะแนน! กรุณาลองอีกครั้ง');
      }
    }
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
  initActiveQuestions(); // Shuffle questions for initial load
  loadQuestion();
}

// Run App
window.addEventListener('DOMContentLoaded', initApp);
