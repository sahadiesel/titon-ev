const state = { cat: "all", q: "", battery: "", addons: {}, photo: 0 };

const baht = (n) => "฿" + n.toLocaleString("en-US");
const catLabel = (id) => (CATEGORIES.find((c) => c.id === id) || {}).label || "";
const byId = (id) => MODELS.find((m) => m.id === id);
const startPrice = (m) => m.batteries[0].price;

function parseHash() {
  const raw = (location.hash || "#/").replace(/^#/, "");
  const [path, query] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(query || "");
  if (!parts.length) return { page: "home" };
  if (parts[0] === "models" && parts[1]) return { page: "detail", id: parts[1] };
  if (parts[0] === "models") return { page: "models", cat: params.get("cat") || state.cat };
  if (parts[0] === "about") return { page: "about" };
  if (parts[0] === "contact") return { page: "contact" };
  if (parts[0] === "admin") return { page: "admin" };
  return { page: "home" };
}

function setNav(page) {
  document.querySelectorAll("[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === page || (page === "detail" && a.dataset.nav === "models"));
  });
}

function card(m) {
  const img = m.images[0];
  return `<a class="model-card" href="#/models/${m.id}">
    <div class="shot"><img src="${img.src}" alt="${img.alt}"></div>
    <div class="card-body">
      <div class="card-top">
        <span class="tag">${catLabel(m.category)}</span>
        <div class="price">${baht(startPrice(m))}<small>ราคาเริ่ม รวมแบต</small></div>
      </div>
      <h3>${m.name}</h3>
      <p>${m.blurb}</p>
      <div class="spec-pills">
        <span>มอเตอร์ ${m.motor}</span>
        <span>รับน้ำหนัก ${m.load}</span>
        <span>วิ่ง ${m.range}</span>
      </div>
    </div>
  </a>`;
}

function home() {
  const picks = ["titan-1-1-m", "titan-1-6-m", "titan-1-8-m", "food-truck-v1", "titan-1-6-cap", "ranger-6-0"].map(byId);
  return `<section class="wrap hero">
      <div>
        <div class="kicker">HATYAI · TITAN EV</div>
        <h1>รถสามล้อไฟฟ้า<br>ราคาจริง สเปกครบ</h1>
        <p class="lede">ตัวแทน TITAN EV ที่หาดใหญ่ รวม 12 รุ่นสำหรับขนของ รับส่งคน และขายอาหาร เลือกแบตตะกั่วหรือลิเธียมแล้วเห็นราคาทันที</p>
        <div class="hero-actions">
          <a class="btn btn-dark" href="#/models">ดู 12 รุ่น</a>
          <a class="btn btn-ghost" href="tel:${CONTACTS.joe.tel}">โทร${CONTACTS.joe.name} ${CONTACTS.joe.phone}</a>
        </div>
        <ul class="hero-points">
          <li>ประกันมอเตอร์ 3 ปีทุกเครื่อง</li>
          <li>แบตลิเธียมประกัน 3 ปี</li>
          <li>ดูคันจริงก่อนตัดสินใจ</li>
        </ul>
      </div>
      <div class="hero-frame">
        <img src="assets/vehicles/titan-18m-life.jpg" alt="TITAN 1.8 M กระบะแดงบนถนนดิน">
        <div class="hero-chip"><span>เริ่มที่ TITAN 1.1 M</span><strong>${baht(23900)}</strong></div>
      </div>
    </section>
    <section class="wrap band">
      <div><strong>12 รุ่น</strong><span>กระบะ กล่อง แคป ฟู้ดทรัก</span></div>
      <div><strong>${baht(23900)}</strong><span>ราคาเริ่ม รวมแบตเตอรี่</span></div>
      <div><strong>300–1,000 กก.</strong><span>ช่วงรับน้ำหนักตามรุ่น</span></div>
      <div><strong>2 สาย</strong><span>คุณโจ้ และคุณปุ๊</span></div>
    </section>
    <section class="wrap section">
      <div class="section-head">
        <div>
          <div class="kicker">เลือกตามงาน</div>
          <h2>สี่แบบการใช้งาน</h2>
        </div>
        <p>กรองต่อในหน้ารุ่นทั้งหมดได้ทันที</p>
      </div>
      <div class="use-grid">
        ${CATEGORIES.map((c) => `<a class="use-card" href="#/models?cat=${c.id}"><em>${MODELS.filter((m) => m.category === c.id).length} รุ่น</em><div><strong>${c.label}</strong><span>${c.text}</span></div></a>`).join("")}
      </div>
    </section>
    <section class="wrap section">
      <div class="section-head">
        <div>
          <div class="kicker">รุ่นที่ถูกถามบ่อย</div>
          <h2>เริ่มดูจากงานที่ใกล้ตัว</h2>
        </div>
        <a href="#/models">ดูทั้งหมด</a>
      </div>
      <div class="card-grid">${picks.map(card).join("")}</div>
    </section>
    <section class="wrap section">
      <div class="section-head"><div><div class="kicker">ก่อนโทร</div><h2>เลือกให้ตรงงานในสามขั้น</h2></div></div>
      <div class="reason-grid">
        <article class="reason"><span class="num">01</span><strong>ดูขนาดกระบะกับน้ำหนัก</strong><p>ของเบาใช้ 1.1–1.3 ของหนักขยับไป 1.6 Pro หรือ 1.8 ที่รับได้ถึง 1,000 กก.</p></article>
        <article class="reason"><span class="num">02</span><strong>เลือกก้อนแบตตามระยะ</strong><p>ราคาในแต่ละแถวรวมแบตเตอรี่ก้อนนั้นแล้ว ตะกั่วประกัน 1 ปี ลิเธียมประกัน 3 ปี</p></article>
        <article class="reason"><span class="num">03</span><strong>นัดดูคันจริง</strong><p>โทรคุณโจ้หรือคุณปุ๊ บอกชื่อรุ่นและก้อนแบตที่เล็งไว้ จะได้คุยสีและของเสริมให้ตรง</p></article>
      </div>
    </section>
    <section class="wrap cta-band">
      <div>
        <h2>พร้อมให้ช่วยเลือกคันที่ตรงงาน</h2>
        <p>จันทร์–เสาร์ 08:30–17:30 น. หรือทัก LINE @hatyai-ev</p>
      </div>
      <div class="cta-actions">
        <a class="btn btn-line" href="${CONTACTS.lineUrl}" target="_blank" rel="noopener">LINE ${CONTACTS.line}</a>
        <a class="btn btn-ghost" href="tel:${CONTACTS.pu.tel}" style="color:#101820">คุณปุ๊ ${CONTACTS.pu.phone}</a>
      </div>
    </section>`;
}

function modelsPage() {
  return `<section class="wrap page-intro">
      <div class="kicker">แคตตาล็อก</div>
      <h1>รถสามล้อไฟฟ้า 12 รุ่น</h1>
      <p class="sub">ราคาเริ่มต้นรวมแบตเตอรี่ก้อนมาตรฐานแล้ว เข้าไปในรุ่นเพื่อเปลี่ยนเป็นลิเธียมหรือเพิ่มดัมพ์</p>
    </section>
    <section class="wrap">
      <div class="toolbar">
        <div class="chips" id="chips">
          <button class="chip" data-cat="all" type="button">ทั้งหมด</button>
          ${CATEGORIES.map((c) => `<button class="chip" data-cat="${c.id}" type="button">${c.label}</button>`).join("")}
        </div>
        <input class="search" id="q" placeholder="ค้นหาชื่อรุ่น เช่น 1.6, BOX, อาหาร" value="${escapeHtml(state.q)}">
      </div>
      <div class="card-grid" id="grid"></div>
    </section>`;
}

function paintCards() {
  const q = state.q.trim().toLowerCase();
  const list = MODELS.filter((m) => (state.cat === "all" || m.category === state.cat) && (!q || (m.name + m.blurb + m.motor).toLowerCase().includes(q)));
  const grid = document.getElementById("grid");
  if (!grid) return;
  grid.innerHTML = list.length ? list.map(card).join("") : `<div class="empty">ไม่พบรุ่นที่ตรงกับคำค้น ลองค้นด้วย 1.1, 1.8, BOX หรือ อาหาร</div>`;
  document.querySelectorAll("#chips .chip").forEach((btn) => btn.classList.toggle("active", btn.dataset.cat === state.cat));
}

function quoteOf(m) {
  const battery = m.batteries.find((b) => b.id === state.battery) || m.batteries[0];
  const picked = m.addons.filter((a) => state.addons[a.id]);
  const total = battery.price + picked.reduce((s, a) => s + a.price, 0);
  return { battery, picked, total };
}

const FLYER = {
  "titan-1-1-m": ["จอดิจิตอล", "ไฟหน้า LED", "สวิตช์ไฟสูง-ต่ำ", "สวิตช์เดินหน้า-ถอย", "เกียร์สโลว์", "แท่นวางโทรศัพท์"],
  "titan-1-1-m-plus": ["จอดิจิตอล", "ไฟหน้า LED", "สวิตช์ไฟสูง-ต่ำ", "ประตูเปิดข้าง", "สวิตช์เดินหน้า-ถอยหลัง", "กระบะข้าง", "เกียร์สโลว์ ช่วยขึ้นเนิน", "เปิด-ปิดไฟสูง-ต่ำ"],
  "titan-1-3-m": ["จอดิจิตอล", "ไฟหน้า LED", "สวิตช์ไฟสูง-ต่ำ", "เกียร์ขึ้นเนิน", "สวิตช์เดินหน้า-ถอยหลัง", "แท่นใส่โทรศัพท์", "เปลี่ยนเป็นแบตลิเธียมได้", "ความเร็ว 40–50 กม./ชม."],
  "titan-1-6-m": ["จอดิจิตอล", "ไฟหน้า LED", "สวิตช์ไฟสูง-ต่ำ", "ล้อ 12 นิ้ว", "มอเตอร์ 1,600 วัตต์", "แท่นใส่โทรศัพท์", "เกียร์สโลว์", "เปิดฝากระบะได้รอบคัน"],
  "titan-1-6-m-pro": ["จอดิจิตอล", "ไฟหน้า LED", "สวิตช์ไฟสูง-ต่ำ", "ล้อ 12 นิ้ว", "มอเตอร์ 2,000 วัตต์", "ไฟเสริมข้างรถ", "เกียร์สโลว์", "ดัมพ์ไฟฟ้าสั่งเพิ่มได้"],
  "titan-1-8-m": ["จอดิจิตอล", "ไฟหน้า LED", "สวิตช์ไฟสูง-ต่ำ", "ล้อ 12 นิ้ว", "มอเตอร์ 2,000/3,000 วัตต์", "ไฟเสริมข้างรถ", "เกียร์สโลว์", "ดัมพ์ไฟฟ้าสั่งเพิ่มได้"],
  "titan-1-6-box": ["จอดิจิตอล", "ไฟหน้า LED", "สวิตช์ไฟสูง-ต่ำ", "ล้อ 12 นิ้ว", "มอเตอร์ 1,600 วัตต์", "เปิดได้ 2 ด้าน", "ส่งของ ขายของเคลื่อนที่ หรือฟู้ดทรัคขนาดเล็ก", "ใช้ได้ทั้งหน่วยงานรัฐและเอกชน"],
  "titan-1-6-cap": ["จอดิจิตอล", "ไฟหน้า LED", "สวิตช์ไฟสูง-ต่ำ", "ล้อ 12 นิ้ว", "มอเตอร์ 2,000 วัตต์", "กระบะ 2 แถว", "ยาวประมาณ 310 ซม.", "สูง 180 ซม.", "กว้างเบาะนั่ง 120 ซม.", "ใช้ได้ทั้งหน่วยงานรัฐและเอกชน"],
  "ranger-6-0": ["ดิสก์เบรก 4 ล้อ", "ยาง 205/50-10", "ยาว 280 × สูง 190 × กว้าง 100 ซม.", "กล่องท้ายพร้อมพัดลม", "หลังคาและราวหลังคา"],
  "food-truck-v1": ["จอดิจิตอล", "ไฟหน้า LED", "สวิตช์ไฟสูง-ต่ำ", "ล้อ 12 นิ้ว", "มอเตอร์ 1,600 วัตต์", "แท่นใส่โทรศัพท์", "ปิดปีกได้ 3 ด้าน", "เกียร์สโลว์", "สูงถึงเพดาน 125 ซม."],
  "food-truck-v2": ["โครงสร้างสแตนเลส", "มอเตอร์ 2,000 วัตต์", "รับน้ำหนัก 800 กก.", "กระบะ 150 × 120 ซม.", "เกียร์สโลว์"],
  "food-truck-v3": ["จอดิจิตอล", "ไฟหน้า LED", "สวิตช์ไฟสูง-ต่ำ", "ล้อ 12 นิ้ว", "มอเตอร์ 2,000 วัตต์", "แท่นใส่โทรศัพท์", "แถมเคาน์เตอร์และพัดลม", "ตู้สูง 196 ซม.", "ยาวรวมประมาณ 330 ซม.", "เกียร์สโลว์"]
};

function detail(m) {
  const img = m.images[state.photo] || m.images[0];
  const q = quoteOf(m);
  const index = MODELS.findIndex((x) => x.id === m.id);
  const related = [1, 2, 3].map((step) => MODELS[(index + step) % MODELS.length]);
  return `<section class="wrap page-intro">
      <div class="crumb"><a href="#/">หน้าแรก</a> / <a href="#/models">รุ่นทั้งหมด</a> / ${m.name}</div>
    </section>
    <section class="wrap detail">
      <div>
        <div class="gallery-main"><img id="heroImg" src="${img.src}" alt="${img.alt}"></div>
        <div class="thumbs">
          ${m.images.map((image, i) => `<button type="button" data-photo="${i}" class="${i === state.photo ? "active" : ""}"><img src="${image.src}" alt=""></button>`).join("")}
        </div>
        <p class="caption" id="caption">${img.caption || ""}</p>
        <div class="block">
          <h2>สเปกตามใบราคา</h2>
          <table class="spec-table">
            ${m.specs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
            <tr><th>สีที่มีในภาพ</th><td>${m.colors.join(" · ")} · ยืนยันสต็อกตอนโทร</td></tr>
          </table>
        </div>
        <div class="block">
          <h2>อุปกรณ์ตามใบปลิว</h2>
          <div class="gear">${(FLYER[m.id] || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        </div>
        <div class="block">
          <h2>อุปกรณ์และลักษณะรถ</h2>
          <ul class="feature-list">${m.features.map((f) => `<li>${f}</li>`).join("")}</ul>
          <p class="fine">ถ้าตัวเลขบนใบปลิวไม่ตรงกับตารางนี้ ให้ยึดราคาและสเปกในหน้านี้ ซึ่งมาจากใบราคาขาย</p>
        </div>
      </div>
      <aside class="buy">
        <span class="tag">${catLabel(m.category)} · ${m.kicker}</span>
        <h1>${m.name}</h1>
        <p class="sub">${m.blurb}</p>
        <div class="block">
          <strong>เลือกแบตเตอรี่</strong>
          ${m.batteries.map((b) => `<label class="choice"><input type="radio" name="battery" value="${b.id}" ${b.id === q.battery.id ? "checked" : ""}> ${b.name} <b>${baht(b.price)}</b><small>${b.warranty}</small></label>`).join("")}
        </div>
        ${m.addons.length ? `<div class="block"><strong>อุปกรณ์เสริม</strong>${m.addons.map((a) => `<label class="choice"><input type="checkbox" data-addon="${a.id}" ${state.addons[a.id] ? "checked" : ""}> ${a.name} <b>+${baht(a.price)}</b></label>`).join("")}</div>` : ""}
        <div class="quote">
          <span>ราคารวมที่เลือก</span>
          <strong id="total">${baht(q.total)}</strong>
          <ul id="quoteLines">
            <li>${q.battery.name} · ${q.battery.warranty}</li>
            ${q.picked.map((a) => `<li>${a.name} +${baht(a.price)}</li>`).join("") || (m.addons.length ? "<li>ยังไม่เลือกอุปกรณ์เสริม</li>" : "")}
          </ul>
        </div>
        <div class="buy-actions">
          <a class="btn btn-dark btn-block" href="tel:${CONTACTS.joe.tel}">โทร${CONTACTS.joe.name} ${CONTACTS.joe.phone}</a>
          <a class="btn btn-ghost btn-block" href="tel:${CONTACTS.pu.tel}">โทร${CONTACTS.pu.name} ${CONTACTS.pu.phone}</a>
          <a class="btn btn-line btn-block" href="${CONTACTS.lineUrl}" target="_blank" rel="noopener">ทัก LINE ${CONTACTS.line}</a>
        </div>
        <p class="fine">ราคาเป็นราคาขายตามใบราคา รวมแบตเตอรี่ก้อนที่เลือก ยังไม่รวมค่าจัดส่งถ้ามี นัดดูรถได้ที่หาดใหญ่</p>
      </aside>
    </section>
    <section class="wrap section">
      <div class="panel lead-panel">${leadForm(m)}</div>
    </section>
    ${related.length ? `<section class="wrap section"><div class="section-head"><h2>รุ่นในกลุ่มเดียวกัน</h2></div><div class="card-grid">${related.map(card).join("")}</div></section>` : ""}`;
}

function about() {
  return `<section class="wrap page-intro">
      <div class="kicker">เกี่ยวกับเรา</div>
      <h1>ตัวแทน TITAN EV<br>ที่หาดใหญ่</h1>
      <p class="lede">TRITON EV ช่วยเลือกสามล้อไฟฟ้าให้ตรงงาน ตั้งแต่กระบะเล็กไปจนถึงตู้ขายอาหาร พร้อมอธิบายความต่างของแบตก่อนตัดสินใจ</p>
    </section>
    <section class="wrap split section">
      <div>
        <img src="assets/vehicles/titan-16cap-life.jpg" alt="แคปโดยสาร TITAN 1.6 CAP" style="border-radius:24px;width:100%;height:420px;object-fit:contain;background:#f4f7fa">
      </div>
      <div>
        <h2>ดูรถให้เป็นก่อนจ่าย</h2>
        <p class="sub" style="margin-top:8px">ใบราคาขายมีทั้งก้อนแบตและของเสริมแยกไว้ชัด เราใช้ตัวเลขชุดนั้นทั้งเว็บ เพื่อไม่ให้ราคาบนหน้าเว็บกับราคาที่คุยโทรคลาดกัน</p>
        <ol class="steps">
          <li><strong>บอกงานที่ใช้</strong><br>ขนของกี่กิโล รับกี่คน หรือเปิดร้านแบบไหน</li>
          <li><strong>เทียบก้อนแบต</strong><br>ตะกั่วราคาเริ่มถูกกว่า ลิเธียมประกันแบต 3 ปี</li>
          <li><strong>นัดดูคันจริง</strong><br>โทรคุณโจ้ 083-541-5007 หรือคุณปุ๊ 091-038-3636</li>
        </ol>
      </div>
    </section>
    <section class="wrap section">
      <div class="section-head"><div><div class="kicker">ประกัน</div><h2>มอเตอร์ 3 ปีทุกรุ่น</h2></div></div>
      <div class="reason-grid">
        <article class="reason"><strong>มอเตอร์</strong><p>รับประกัน 3 ปีทุกเครื่องในใบราคา ทั้งกระบะ กล่อง แคป เรนเจอร์ และฟู้ดทรัก</p></article>
        <article class="reason"><strong>แบตตะกั่ว</strong><p>ประกัน 1 ปี เป็นก้อนตั้งต้นของแต่ละรุ่น และเป็นราคาที่ขึ้นไว้บนการ์ด</p></article>
        <article class="reason"><strong>แบตลิเธียม</strong><p>ประกัน 3 ปี ในรุ่นที่มีตัวเลือก ราคาบนปุ่มเลือกคือราคาตัวรถพร้อมก้อนนั้น</p></article>
      </div>
    </section>`;
}

function contact() {
  return `<section class="wrap page-intro">
      <div class="kicker">ติดต่อ</div>
      <h1>คุยกับคนขายก่อนตัดสินใจ</h1>
      <p class="sub">บอกงานที่ใช้ รุ่นที่เล็ง และก้อนแบตที่สนใจ จะได้คุยต่อได้ตรง</p>
    </section>
    <section class="wrap contact-grid">
      <div class="panel">
        <h2 style="margin-bottom:12px">สองเบอร์โดยตรง</h2>
        <div class="person" style="margin-bottom:10px">
          <span class="tag">ฝ่ายขาย</span>
          <a class="big" href="tel:${CONTACTS.joe.tel}">${CONTACTS.joe.phone}</a>
          <p>${CONTACTS.joe.name}</p>
        </div>
        <div class="person">
          <span class="tag">ฝ่ายขาย</span>
          <a class="big" href="tel:${CONTACTS.pu.tel}">${CONTACTS.pu.phone}</a>
          <p>${CONTACTS.pu.name}</p>
        </div>
        <p class="hours" style="margin-top:14px">${CONTACTS.hours}<br>โทรนัดหมายล่วงหน้า</p>
        <a class="btn btn-line" style="margin-top:14px" href="${CONTACTS.lineUrl}" target="_blank" rel="noopener">เพิ่มเพื่อน LINE ${CONTACTS.line}</a>
        <p class="note" style="margin-top:14px">ไม่มีหน้าร้านบนแผนที่ในหน้านี้ นัดหมายทางโทรศัพท์หรือ LINE ก่อนเข้าดูรถที่หาดใหญ่</p>
      </div>
      <div class="panel">
        ${leadForm(null)}
        <h2 style="margin-top:22px">เตรียมข้อมูลก่อนโทร</h2>
        <ol class="prepare">
          <li>งานที่ใช้ เช่น ส่งสินค้า รับคน หรือขายอาหาร</li>
          <li>น้ำหนักโดยประมาณ หรือจำนวนผู้โดยสาร</li>
          <li>ระยะทางต่อวัน และทางชันหรือไม่</li>
          <li>งบ และต้องการแบตตะกั่วหรือลิเธียม</li>
        </ol>
        <div class="faq" style="margin-top:16px">
          <details open>
            <summary>ราคาที่แสดงรวมแบตเตอรี่แล้วหรือยัง?</summary>
            <p>รวมแล้ว ราคาแต่ละแถวคือราคาตัวรถพร้อมแบตเตอรี่ก้อนนั้น หลังคา ดัมพ์ และโครงข้างที่ติ๊กเพิ่ม จะบวกเข้าไปในยอดรวม</p>
          </details>
          <details>
            <summary>เปลี่ยนจากแบตตะกั่วเป็นลิเธียมได้ไหม?</summary>
            <p>ได้ในรุ่นที่มีตัวเลือกสีเขียวบนหน้านี้ แบตลิเธียมประกัน 3 ปี แบตตะกั่วประกัน 1 ปี</p>
          </details>
          <details>
            <summary>ขอดูรถก่อนตัดสินใจได้ไหม?</summary>
            <p>ได้ โทรนัดคุณโจ้หรือคุณปุ๊ แล้วบอกชื่อรุ่นไว้ก่อน จะได้เตรียมคันที่ใกล้เคียงให้ดู</p>
          </details>
          <details>
            <summary>สีตรงกับภาพทุกคันไหม?</summary>
            <p>สีในภาพเป็นสีที่มีในใบราคาและใบปลิว สต็อกแต่ละรอบไม่เท่ากัน ยืนยันสีอีกครั้งตอนโทร</p>
          </details>
        </div>
      </div>
    </section>
    <section class="wrap section"></section>`;
}

function leadForm(model) {
  const options = [`<option value="">ยังไม่ระบุรุ่น</option>`]
    .concat(MODELS.map((item) => `<option value="${item.id}" ${model && item.id === model.id ? "selected" : ""}>${item.name}</option>`))
    .join("");
  return `<form class="lead-form" id="leadForm" data-source="${model ? "model" : "contact"}">
    <h2>ฝากข้อมูลให้โทรกลับ</h2>
    <p class="sub">ชื่อและเบอร์จะถูกเก็บใน Firebase เพื่อให้คุณโจ้หรือคุณปุ๊ติดต่อกลับ</p>
    <label>ชื่อ<input name="name" required maxlength="80" autocomplete="name"></label>
    <label>เบอร์โทร<input name="phone" required inputmode="tel" maxlength="20" autocomplete="tel" placeholder="08x-xxx-xxxx"></label>
    <label>LINE ถ้ามี<input name="line" maxlength="40" placeholder="@ชื่อไลน์"></label>
    <label>รุ่นที่สนใจ<select name="modelId">${options}</select></label>
    <label>ข้อความเพิ่มเติม<textarea name="note" maxlength="500" rows="3" placeholder="งานที่ใช้ ช่วงเวลาที่สะดวกให้โทร"></textarea></label>
    <button class="btn btn-dark" type="submit">ส่งข้อมูล</button>
    <p class="form-status" role="status"></p>
  </form>`;
}

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

async function submitLead(form) {
  const status = form.querySelector(".form-status");
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = digits(data.get("phone"));
  const line = String(data.get("line") || "").trim();
  const note = String(data.get("note") || "").trim();
  const model = byId(String(data.get("modelId") || ""));
  status.className = "form-status";
  if (name.length < 2) {
    status.classList.add("err");
    status.textContent = "กรอกชื่ออย่างน้อย 2 ตัวอักษร";
    return;
  }
  if (phone.length < 9 || phone.length > 10) {
    status.classList.add("err");
    status.textContent = "กรอกเบอร์โทรศัพท์ให้ครบ";
    return;
  }
  const payload = {
    name,
    phone,
    line,
    note,
    modelId: model ? model.id : "",
    modelName: model ? model.name : "",
    battery: "",
    addons: [],
    total: null,
    source: form.dataset.source || "contact"
  };
  if (model && state.modelId === model.id) {
    const quote = quoteOf(model);
    payload.battery = quote.battery.name;
    payload.addons = quote.picked.map((item) => item.name);
    payload.total = quote.total;
  }
  const button = form.querySelector("button");
  button.disabled = true;
  status.textContent = "กำลังบันทึก...";
  try {
    if (!window.TitanFirebase) throw Object.assign(new Error("Firebase ยังโหลดไม่เสร็จ"), { code: "not-ready" });
    await window.TitanFirebase.saveInquiry(payload);
    form.reset();
    if (model) form.querySelector("[name=modelId]").value = model.id;
    status.classList.add("ok");
    status.textContent = "บันทึกแล้ว จะมีคนขายโทรกลับตามเบอร์ที่ให้ไว้";
  } catch (error) {
    status.classList.add("err");
    status.textContent = error.code === "permission-denied"
      ? "บันทึกไม่สำเร็จ โทร 083-541-5007 ได้เลย"
      : "ส่งไม่สำเร็จ ลองอีกครั้งหรือโทร 083-541-5007";
  } finally {
    button.disabled = false;
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function render(scroll) {
  const route = parseHash();
  const app = document.getElementById("app");
  setNav(route.page);
  document.getElementById("nav").classList.remove("open");
  if (route.page === "models" && route.cat) state.cat = route.cat;
  if (route.page === "home") {
    document.title = "TRITON EV หาดใหญ่ | รถสามล้อไฟฟ้า TITAN EV";
    app.innerHTML = home();
  } else if (route.page === "models") {
    document.title = "รุ่นทั้งหมด | TRITON EV หาดใหญ่";
    app.innerHTML = modelsPage();
    paintCards();
  } else if (route.page === "detail") {
    const m = byId(route.id);
    if (!m) {
      app.innerHTML = `<section class="wrap page-intro"><h1>ไม่พบรุ่นนี้</h1><p><a href="#/models">กลับไปหน้ารุ่นทั้งหมด</a></p></section>`;
    } else {
      if (state.modelId !== m.id) {
        state.modelId = m.id;
        state.battery = m.batteries[0].id;
        state.addons = {};
        state.photo = 0;
      }
      document.title = `${m.name} ${baht(startPrice(m))} | TRITON EV`;
      app.innerHTML = detail(m);
    }
  } else if (route.page === "about") {
    document.title = "เกี่ยวกับเรา | TRITON EV หาดใหญ่";
    app.innerHTML = about();
  } else if (route.page === "admin") {
    document.title = "ข้อมูลลูกค้า | TRITON EV หาดใหญ่";
    app.innerHTML = `<section class="wrap page-intro">
      <div class="kicker">เจ้าของเว็บ</div>
      <h1>ข้อมูลที่ลูกค้าฝากไว้</h1>
      <p class="sub">เข้าด้วยบัญชีเจ้าของเว็บเท่านั้น ลูกค้าทั่วไปเปิดหน้านี้แล้วจะยังไม่เห็นรายชื่อ</p>
    </section>
    <section class="wrap section"><div id="adminRoot" class="panel">กำลังตรวจการเข้าสู่ระบบ...</div></section>`;
    fillAdmin();
  } else {
    document.title = "ติดต่อคุณโจ้ คุณปุ๊ | TRITON EV หาดใหญ่";
    app.innerHTML = contact();
  }
  if (scroll) window.scrollTo(0, 0);
}

function adminLoginForm(message) {
  return `<form class="lead-form" id="adminLogin">
    <h2>เข้าสู่ระบบเจ้าของเว็บ</h2>
    <p class="sub">ใช้อีเมล ${escapeHtml(window.OWNER_EMAIL || "")}</p>
    <label>อีเมล<input name="email" type="email" required autocomplete="username" value="${escapeHtml(window.OWNER_EMAIL || "")}"></label>
    <label>รหัสผ่าน<input name="password" type="password" required autocomplete="current-password"></label>
    <button class="btn btn-dark" type="submit">เข้าดูข้อมูลลูกค้า</button>
    <p class="form-status ${message ? "err" : ""}">${message ? escapeHtml(message) : ""}</p>
  </form>`;
}

function inquiryTime(value) {
  if (!value) return "";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

function inquiryCard(row) {
  const addons = Array.isArray(row.addons) && row.addons.length ? row.addons.join(", ") : "";
  const price = Number.isFinite(row.total) ? baht(row.total) : "";
  const bits = [row.modelName, row.battery, addons, price].filter(Boolean);
  return `<article class="inquiry">
    <header>
      <strong>${escapeHtml(row.name || "")}</strong>
      <time>${escapeHtml(inquiryTime(row.createdAt))}</time>
    </header>
    <a href="tel:${escapeHtml(row.phone || "")}">${escapeHtml(row.phone || "")}</a>
    ${row.line ? `<p>LINE ${escapeHtml(row.line)}</p>` : ""}
    ${bits.length ? `<p>${escapeHtml(bits.join(" · "))}</p>` : ""}
    ${row.note ? `<p class="inquiry-note">${escapeHtml(row.note)}</p>` : ""}
  </article>`;
}

async function fillAdmin() {
  const root = document.getElementById("adminRoot");
  if (!root || parseHash().page !== "admin") return;
  const fb = window.TitanFirebase;
  if (!fb || !fb.ready) {
    root.innerHTML = `<p class="form-status err">ยังเชื่อม Firebase ไม่ได้</p>`;
    return;
  }
  const user = fb.currentUser();
  if (!user) {
    root.innerHTML = adminLoginForm("");
    return;
  }
  if (window.OWNER_EMAIL && user.email !== window.OWNER_EMAIL) {
    root.innerHTML = `<p class="form-status err">บัญชี ${escapeHtml(user.email || "")} ไม่มีสิทธิ์ดูข้อมูลลูกค้า</p>
      <button class="btn btn-ghost" id="adminLogout" type="button">ออกจากระบบ</button>`;
    return;
  }
  root.innerHTML = `<p class="form-status">กำลังโหลดรายชื่อ...</p>`;
  try {
    const rows = await fb.listInquiries();
    if (!document.getElementById("adminRoot") || parseHash().page !== "admin") return;
    const list = rows.length
      ? rows.map(inquiryCard).join("")
      : `<p class="sub">ยังไม่มีลูกค้าฝากข้อมูล</p>`;
    document.getElementById("adminRoot").innerHTML = `<div class="admin-bar">
        <p class="sub">${rows.length} รายการ · ${escapeHtml(user.email || "")}</p>
        <button class="btn btn-ghost" id="adminLogout" type="button">ออกจากระบบ</button>
      </div>
      <div class="inquiry-list">${list}</div>`;
  } catch (error) {
    if (!document.getElementById("adminRoot")) return;
    const denied = error.code === "permission-denied";
    document.getElementById("adminRoot").innerHTML = `<p class="form-status err">${denied ? "บัญชีนี้ยังไม่มีสิทธิ์อ่านข้อมูล" : "โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง"}</p>
      <button class="btn btn-ghost" id="adminLogout" type="button">ออกจากระบบ</button>`;
  }
}

async function signInAdmin(form) {
  const status = form.querySelector(".form-status");
  const data = new FormData(form);
  const button = form.querySelector("button");
  button.disabled = true;
  status.className = "form-status";
  status.textContent = "กำลังเข้าสู่ระบบ...";
  try {
    await window.TitanFirebase.signIn(String(data.get("email") || ""), String(data.get("password") || ""));
    fillAdmin();
  } catch (error) {
    status.classList.add("err");
    status.textContent = error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-email"
      ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
      : error.code === "auth/unauthorized-domain"
        ? "โดเมนนี้ยังไม่ได้รับอนุญาตใน Firebase Authentication"
        : "เข้าสู่ระบบไม่สำเร็จ ลองอีกครั้ง";
    button.disabled = false;
  }
}

document.getElementById("menuBtn").addEventListener("click", () => {
  const nav = document.getElementById("nav");
  const open = nav.classList.toggle("open");
  document.getElementById("menuBtn").setAttribute("aria-expanded", open ? "true" : "false");
});

document.addEventListener("click", (e) => {
  const chip = e.target.closest("#chips .chip");
  if (chip) {
    state.cat = chip.dataset.cat;
    history.replaceState(null, "", "#/models" + (state.cat === "all" ? "" : "?cat=" + state.cat));
    paintCards();
    return;
  }
  const photo = e.target.closest("[data-photo]");
  if (photo) {
    state.photo = Number(photo.dataset.photo);
    const m = byId(state.modelId);
    const img = m.images[state.photo];
    const hero = document.getElementById("heroImg");
    hero.src = img.src;
    hero.alt = img.alt;
    hero.className = "";
    document.getElementById("caption").textContent = img.caption || "";
    document.querySelectorAll("[data-photo]").forEach((b) => b.classList.toggle("active", b === photo));
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.id === "leadForm") {
    e.preventDefault();
    submitLead(e.target);
  }
  if (e.target.id === "adminLogin") {
    e.preventDefault();
    signInAdmin(e.target);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.id !== "adminLogout") return;
  window.TitanFirebase.signOut().then(() => fillAdmin());
});

document.addEventListener("input", (e) => {
  if (e.target.id === "q") {
    state.q = e.target.value;
    paintCards();
  }
});

document.addEventListener("change", (e) => {
  const m = byId(state.modelId);
  if (!m) return;
  if (e.target.name === "battery") state.battery = e.target.value;
  if (e.target.dataset.addon) state.addons[e.target.dataset.addon] = e.target.checked;
  if (e.target.name === "battery" || e.target.dataset.addon) {
    const q = quoteOf(m);
    document.getElementById("total").textContent = baht(q.total);
    document.getElementById("quoteLines").innerHTML = `<li>${q.battery.name} · ${q.battery.warranty}</li>` + (q.picked.map((a) => `<li>${a.name} +${baht(a.price)}</li>`).join("") || (m.addons.length ? "<li>ยังไม่เลือกอุปกรณ์เสริม</li>" : ""));
  }
});

window.addEventListener("hashchange", () => render(true));

function boot() {
  if (window.TitanFirebase) {
    window.TitanFirebase.onAuth(() => {
      if (parseHash().page === "admin") fillAdmin();
    });
  }
  render(false);
}

if (window.TitanFirebase) boot();
else window.addEventListener("titan-firebase-ready", boot, { once: true });
