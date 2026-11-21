const state = { cat: "all", q: "", battery: "", addons: {}, photo: 0 };
let loginNotice = "";

const baht = (n) => "฿" + n.toLocaleString("en-US");
const catLabel = (id) => (CATEGORIES.find((c) => c.id === id) || {}).label || "";
const byId = (id) => MODELS.find((m) => m.id === id);
const startPrice = (m) => (m.batteries && m.batteries[0] ? m.batteries[0].price : 0);

function coverOf(m) {
  const image = (m.images || []).find((item) => item.src);
  return image || { src: "assets/vehicles/titan-11m.jpg", alt: m.name || "", caption: "" };
}

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
  if (parts[0] === "admin") return { page: "admin", section: parts[1] || "customers" };
  return { page: "home" };
}

function setNav(page) {
  document.querySelectorAll("[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === page || (page === "detail" && a.dataset.nav === "models"));
  });
}

function card(m) {
  const img = coverOf(m);
  return `<a class="model-card" href="#/models/${m.id}">
    <div class="shot"><img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || m.name)}"></div>
    <div class="card-body">
      <div class="card-top">
        <span class="tag">${catLabel(m.category)}</span>
        <div class="price">${baht(startPrice(m))}<small>ราคาเริ่ม รวมแบต</small></div>
      </div>
      <h3>${escapeHtml(m.name)}</h3>
      <p>${escapeHtml(m.blurb || "")}</p>
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
        <p class="lede">ตัวแทน TITAN EV ที่หาดใหญ่ รวม ${MODELS.length} รุ่นสำหรับขนของ รับส่งคน และขายอาหาร เลือกแบตตะกั่วหรือลิเธียมแล้วเห็นราคาทันที</p>
        <div class="hero-actions">
          <a class="btn btn-dark" href="#/models">ดู ${MODELS.length} รุ่น</a>
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
      <div><strong>${MODELS.length} รุ่น</strong><span>กระบะ กล่อง แคป ฟู้ดทรัก</span></div>
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
        <p>จันทร์–เสาร์ 08:30–17:30 น. โทร ทัก LINE หรือส่งเมล</p>
      </div>
      <div class="cta-actions">
        <a class="btn btn-line" href="${CONTACTS.lineUrl}" target="_blank" rel="noopener">LINE ${CONTACTS.line}</a>
        <a class="btn btn-ghost" href="mailto:${CONTACTS.email}" style="color:#101820">${CONTACTS.email}</a>
      </div>
    </section>`;
}

function modelsPage() {
  return `<section class="wrap page-intro">
      <div class="kicker">แคตตาล็อก</div>
      <h1>รถสามล้อไฟฟ้า ${MODELS.length} รุ่น</h1>
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
  const battery = (m.batteries || []).find((b) => b.id === state.battery) || (m.batteries || [])[0] || { id: "", name: "", price: 0, warranty: "" };
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

function addonFields(m) {
  const roofs = m.addons.filter((a) => a.group === "roof");
  const rest = roofs.length > 1 ? m.addons.filter((a) => a.group !== "roof") : m.addons;
  const picked = roofs.find((a) => state.addons[a.id]);
  const checks = rest.map((a) => `<label class="choice"><input type="checkbox" data-addon="${escapeHtml(a.id)}" ${state.addons[a.id] ? "checked" : ""}> ${escapeHtml(a.name)} <b>+${baht(a.price)}</b></label>`).join("");
  const roof = roofs.length > 1 ? `<div class="block"><strong>เสริมหลังคา เลือกได้หนึ่งแบบ</strong>
      <label class="choice"><input type="radio" name="roof" value="" ${picked ? "" : "checked"}> ไม่เสริมหลังคา</label>
      ${roofs.map((a) => `<label class="choice"><input type="radio" name="roof" value="${escapeHtml(a.id)}" ${state.addons[a.id] ? "checked" : ""}> ${escapeHtml(a.name)} <b>+${baht(a.price)}</b></label>`).join("")}
    </div>` : "";
  const extra = checks ? `<div class="block"><strong>อุปกรณ์เสริม</strong>${checks}</div>` : "";
  return roof + extra;
}

function detail(m) {
  const gallery = (m.images || []).filter((image) => image.src);
  const photos = gallery.length ? gallery : [coverOf(m)];
  const img = photos[state.photo] || photos[0];
  const q = quoteOf(m);
  const index = MODELS.findIndex((x) => x.id === m.id);
  const related = [1, 2, 3].map((step) => MODELS[(index + step) % MODELS.length]);
  return `<section class="wrap page-intro">
      <div class="crumb"><a href="#/">หน้าแรก</a> / <a href="#/models">รุ่นทั้งหมด</a> / ${escapeHtml(m.name)}</div>
    </section>
    <section class="wrap detail">
      <div>
        <div class="gallery-main"><img id="heroImg" src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || m.name)}"></div>
        <div class="thumbs">
          ${photos.map((image, i) => `<button type="button" data-photo="${i}" class="${i === state.photo ? "active" : ""}"><img src="${escapeHtml(image.src)}" alt=""></button>`).join("")}
        </div>
        <p class="caption" id="caption">${escapeHtml(img.caption || "")}</p>
        <div class="block">
          <h2>สเปกตามใบราคา</h2>
          <table class="spec-table">
            ${m.specs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
            <tr><th>สีที่มีในภาพ</th><td>${(m.colors || []).join(" · ")}${m.colors && m.colors.length ? " · " : ""}ยืนยันสต็อกตอนโทร</td></tr>
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
        <h1>${escapeHtml(m.name)}</h1>
        <p class="sub">${escapeHtml(m.blurb || "")}</p>
        <div class="block">
          <strong>เลือกแบตเตอรี่</strong>
          ${(m.batteries || []).map((b) => `<label class="choice"><input type="radio" name="battery" value="${escapeHtml(b.id)}" ${b.id === q.battery.id ? "checked" : ""}> ${escapeHtml(b.name)} <b>${baht(b.price)}</b><small>${escapeHtml(b.warranty || "")}</small></label>`).join("")}
        </div>
        ${addonFields(m)}
        <div class="quote">
          <span>ราคารวมที่เลือก</span>
          <strong id="total">${baht(q.total)}</strong>
          <ul id="quoteLines">
            <li>${escapeHtml(q.battery.name)} · ${escapeHtml(q.battery.warranty || "")}</li>
            ${q.picked.map((a) => `<li>${escapeHtml(a.name)} +${baht(a.price)}</li>`).join("") || (m.addons.length ? "<li>ยังไม่เลือกอุปกรณ์เสริม</li>" : "")}
          </ul>
        </div>
        <div class="buy-actions">
          <a class="btn btn-phone btn-block" href="tel:${CONTACTS.joe.tel}">โทร${CONTACTS.joe.name} ${CONTACTS.joe.phone}</a>
          <a class="btn btn-phone btn-block" href="tel:${CONTACTS.pu.tel}">โทร${CONTACTS.pu.name} ${CONTACTS.pu.phone}</a>
          <a class="btn btn-line btn-block" href="${CONTACTS.lineUrl}" target="_blank" rel="noopener">ทัก LINE ${CONTACTS.line}</a>
          <a class="btn btn-ghost btn-block" href="mailto:${CONTACTS.email}">เมล ${CONTACTS.email}</a>
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
        <div class="person" style="margin-top:10px">
          <span class="tag">อีเมล</span>
          <a class="big mail" href="mailto:${CONTACTS.email}">${CONTACTS.email}</a>
        </div>
        <p class="hours" style="margin-top:14px">${CONTACTS.hours}<br>โทรนัดหมายล่วงหน้า</p>
        <a class="btn btn-line" style="margin-top:14px" href="${CONTACTS.lineUrl}" target="_blank" rel="noopener">เพิ่มเพื่อน LINE ${CONTACTS.line}</a>
        <a class="btn btn-ghost" style="margin-top:10px" href="mailto:${CONTACTS.email}">${CONTACTS.email}</a>
        <p class="note" style="margin-top:14px">ไม่มีหน้าร้านบนแผนที่ในหน้านี้ นัดหมายทางโทรศัพท์ LINE หรืออีเมลก่อนเข้าดูรถที่หาดใหญ่</p>
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
            <p>รวมแล้ว ราคาแต่ละแถวคือราคาตัวรถพร้อมแบตเตอรี่ก้อนนั้น หลังคาหน้าหรือหลังคายาวเลือกได้หนึ่งแบบ และดัมพ์ที่ติ๊กเพิ่ม จะบวกเข้าไปในยอดรวม</p>
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
    <p class="sub">ชื่อและเบอร์จะถูกเก็บไว้ เพื่อให้คุณโจ้หรือคุณปุ๊ติดต่อกลับ</p>
    <div class="lead-grid">
      <label>ชื่อ<input name="name" required maxlength="80" autocomplete="name"></label>
      <label>เบอร์ติดต่อ<input name="phone" required inputmode="tel" maxlength="20" autocomplete="tel" placeholder="08x-xxx-xxxx"></label>
      <label>พื้นที่ที่ใช้งาน<input name="area" maxlength="80" placeholder="เช่น หาดใหญ่ ส่งของในเมือง"></label>
    </div>
    <div class="lead-grid lead-grid-2">
      <label>รุ่นที่สนใจ<select name="modelId">${options}</select></label>
      <label>ข้อความเพิ่มเติม<textarea name="note" maxlength="500" rows="2" placeholder="งานที่ใช้ ช่วงเวลาที่สะดวกให้โทร"></textarea></label>
    </div>
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
  const area = String(data.get("area") || "").trim();
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
    line: "",
    area,
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
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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
        state.battery = (m.batteries[0] && m.batteries[0].id) || "";
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
    document.title = "เข้าสู่ระบบ | TRITON EV หาดใหญ่";
    app.innerHTML = `<section class="wrap section"><div id="adminRoot" class="panel">กำลังตรวจการเข้าสู่ระบบ...</div></section>`;
    fillAdmin();
  } else {
    document.title = "ติดต่อคุณโจ้ คุณปุ๊ | TRITON EV หาดใหญ่";
    app.innerHTML = contact();
  }
  if (scroll) window.scrollTo(0, 0);
}

function adminLoginForm(message) {
  return `<form class="lead-form" id="adminLogin">
    <h2>เข้าสู่ระบบ</h2>
    <label>อีเมล<input name="email" type="email" required autocomplete="username"></label>
    <label>รหัสผ่าน<input name="password" type="password" required autocomplete="current-password"></label>
    <button class="btn btn-dark" type="submit">เข้าสู่ระบบ</button>
    <button class="btn btn-google" id="googleLogin" type="button">เข้าสู่ระบบด้วย Gmail</button>
    <p class="form-status ${message ? "err" : ""}">${message ? escapeHtml(message) : ""}</p>
  </form>`;
}

function adminTabs(section, role) {
  const items = [];
  if (role === "admin" || role === "viewer") items.push(["site", "จัดการเว็บ"]);
  items.push(["cashbook", "สมุดเงินสด"], ["customers", "ข้อมูลลูกค้า"]);
  if (role === "admin") items.push(["users", "จัดการผู้ใช้งาน"]);
  const order = ["site", "cashbook", "customers", "users"];
  items.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  return `<div class="admin-head">
      <div class="admin-tabs">${items.map(([id, label]) => `<a href="#/admin/${id}" class="${section === id ? "active" : ""}">${label}</a>`).join("")}</div>
      <button class="btn btn-ghost" id="adminLogout" type="button">ออกจากระบบ</button>
    </div>`;
}

function todayKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(new Date());
}

function todayLabel() {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Bangkok" }).format(new Date());
}

function stampMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function latestActivity(row) {
  const notes = (row.notes || []).map((note) => stampMillis(note.createdAt));
  return Math.max(stampMillis(row.createdAt), ...notes, 0);
}

function inquiryTime(value) {
  if (!value) return "";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

function inquiryCard(row, canEdit) {
  const addons = Array.isArray(row.addons) && row.addons.length ? row.addons.join(", ") : "";
  const price = Number.isFinite(row.total) ? baht(row.total) : "";
  const bits = [row.modelName, row.battery, addons, price].filter(Boolean);
  const notes = (row.notes || []).map((note) => `<p class="note-line">${escapeHtml(note.date || inquiryTime(note.createdAt))} · ${escapeHtml(note.text || "")}${note.recordedBy ? ` · ${escapeHtml(note.recordedBy)}` : ""}${canEdit ? ` <button type="button" data-delete-note="${row.id}|${note.id}">ลบ</button>` : ""}</p>`).join("");
  return `<article class="inquiry">
    <header>
      <strong>${escapeHtml(row.name || "")}</strong>
      <time>${escapeHtml(inquiryTime(row.createdAt))}</time>
    </header>
    <a href="tel:${escapeHtml(row.phone || "")}">${escapeHtml(row.phone || "")}</a>
    ${row.area ? `<p>พื้นที่ ${escapeHtml(row.area)}</p>` : ""}
    ${row.line ? `<p>LINE ${escapeHtml(row.line)}</p>` : ""}
    ${bits.length ? `<p>${escapeHtml(bits.join(" · "))}</p>` : ""}
    ${row.note ? `<p class="inquiry-note">${escapeHtml(row.note)}</p>` : ""}
    <div class="notes">${notes || `<p class="sub">ยังไม่มีบันทึกติดตาม</p>`}</div>
    ${canEdit ? `<div class="note-add">
      <button class="btn btn-dark" type="button" data-add-note>เพิ่มบรรทัด</button>
      <form class="note-form" data-inquiry="${row.id}" hidden>
        <input value="${escapeHtml(todayLabel())}" readonly tabindex="-1">
        <input name="text" maxlength="300" required placeholder="ติดต่อลูกค้ากลับ">
        <button class="btn btn-dark" type="submit">บันทึก</button>
      </form>
    </div>` : ""}
  </article>`;
}

function categoryOptions(selected, canEdit) {
  return `<select name="category" ${canEdit ? "" : "disabled"}>${CATEGORIES.map((item) => `<option value="${item.id}" ${item.id === selected ? "selected" : ""}>${item.label}</option>`).join("")}</select>`;
}

function imageSlot(image, canEdit) {
  const src = image.src || "";
  return `<div class="slot-row" data-image-slot>
    <img src="${escapeHtml(src || "assets/vehicles/titan-11m.jpg")}" alt="">
    <input type="hidden" name="image-src" value="${escapeHtml(src)}">
    <input type="hidden" name="image-alt" value="${escapeHtml(image.alt || "")}">
    <input type="hidden" name="image-caption" value="${escapeHtml(image.caption || "")}">
    <input type="hidden" name="image-clip" value="${image.clip ? "1" : ""}">
    ${canEdit ? `<input type="file" accept="image/*">` : ""}
    ${canEdit ? `<button class="text-btn" type="button" data-remove-image>ลบรูป</button>` : ""}
  </div>`;
}

function batterySlot(battery, canEdit) {
  const lock = canEdit ? "" : "readonly";
  return `<div class="item-row" data-battery-row>
    <input name="battery-id" type="hidden" value="${escapeHtml(battery.id || "")}">
    <input name="battery-name" maxlength="80" required placeholder="ชื่อแบตเตอรี่" value="${escapeHtml(battery.name || "")}" ${lock}>
    <input name="battery-price" type="number" min="0" step="100" required value="${Number(battery.price) || 0}" ${lock}>
    <input name="battery-warranty" maxlength="40" placeholder="ประกันแบต 1 ปี" value="${escapeHtml(battery.warranty || "")}" ${lock}>
    ${canEdit ? `<button class="text-btn" type="button" data-remove-battery>ลบ</button>` : ""}
  </div>`;
}

function addonSlot(addon, canEdit) {
  const lock = canEdit ? "" : "readonly";
  return `<div class="item-row addon-row" data-addon-row>
    <input name="addon-id" type="hidden" value="${escapeHtml(addon.id || "")}">
    <input name="addon-group" type="hidden" value="${escapeHtml(addon.group || "")}">
    <input name="addon-name" maxlength="80" required placeholder="ชื่ออุปกรณ์" value="${escapeHtml(addon.name || "")}" ${lock}>
    <input name="addon-price" type="number" min="0" step="100" required value="${Number(addon.price) || 0}" ${lock}>
    ${canEdit ? `<button class="text-btn" type="button" data-remove-addon>ลบ</button>` : ""}
  </div>`;
}

function siteEditor(canEdit) {
  const lock = canEdit ? "" : "readonly";
  const create = canEdit ? `<form id="newModelForm" class="model-create">
      <label>ชื่อรุ่น<input name="name" maxlength="80" required placeholder="เช่น TITAN 2.0"></label>
      <label>หมวดหมู่${categoryOptions("cargo", true)}</label>
      <button class="btn btn-dark" type="submit">เพิ่มรุ่น</button>
      <p class="form-status"></p>
    </form>` : "";
  const cards = MODELS.map((model) => `<form class="editor-card" data-model="${escapeHtml(model.id)}">
      <h2>${escapeHtml(model.name)}</h2>
      <div class="model-fields">
        <label>ชื่อรุ่น<input name="name" maxlength="80" required value="${escapeHtml(model.name)}" ${lock}></label>
        <label>หมวดหมู่${categoryOptions(model.category, canEdit)}</label>
      </div>
      <h3>รูปภาพ</h3>
      <div data-images>${(model.images || []).map((image) => imageSlot(image, canEdit)).join("")}</div>
      ${canEdit ? `<div class="editor-actions"><button class="btn btn-ghost" type="button" data-add-image>เพิ่มรูป</button></div>` : ""}
      <h3>แบตเตอรี่</h3>
      <div data-batteries>${(model.batteries || []).map((battery) => batterySlot(battery, canEdit)).join("")}</div>
      ${canEdit ? `<div class="editor-actions"><button class="btn btn-ghost" type="button" data-add-battery>เพิ่มแบตเตอรี่</button></div>` : ""}
      <h3>อุปกรณ์เสริม</h3>
      <div data-addons>${(model.addons || []).map((addon) => addonSlot(addon, canEdit)).join("")}</div>
      ${canEdit ? `<div class="editor-actions"><button class="btn btn-ghost" type="button" data-add-addon>เพิ่มอุปกรณ์เสริม</button></div>` : ""}
      <p class="form-status"></p>
      ${canEdit ? `<button class="btn btn-dark" type="submit">บันทึก</button>` : `<p class="sub">ดูได้อย่างเดียว</p>`}
    </form>`).join("");
  return create + `<div class="editor">${cards}</div>`;
}

function cashDateLabel(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value || "");
}

function cashMonthKey(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}` : "";
}

function cashMonthLabel(key) {
  const [year, month] = key.split("-");
  return new Intl.DateTimeFormat("th-TH", { month: "long", year: "numeric" }).format(new Date(Number(year), Number(month) - 1, 1));
}

function applyCashFilter() {
  const search = document.getElementById("cashSearch");
  const month = document.getElementById("cashMonth");
  if (!search || !month) return;
  const query = search.value.trim().toLowerCase();
  const selected = month.value;
  let shown = 0;
  document.querySelectorAll(".cash-line[data-cash-note]").forEach((row) => {
    const hit = (!query || row.dataset.cashNote.toLowerCase().includes(query)) && (!selected || row.dataset.cashMonth === selected);
    row.hidden = !hit;
    if (hit) shown += 1;
  });
  const empty = document.getElementById("cashEmpty");
  if (empty) {
    empty.hidden = shown > 0;
    empty.textContent = document.querySelector(".cash-line[data-cash-note]") ? "ไม่พบรายการ" : "ยังไม่มีรายการ";
  }
}

function cashView(rows, canEdit) {
  const inn = rows.filter((row) => row.direction === "in").reduce((sum, row) => sum + row.amount, 0);
  const out = rows.filter((row) => row.direction === "out").reduce((sum, row) => sum + row.amount, 0);
  const months = [...new Set(rows.map((row) => cashMonthKey(row.date)).filter(Boolean))].sort().reverse();
  const list = rows.map((row) => `<div class="cash-line" data-cash-note="${escapeHtml(`${row.note || ""} ${row.recordedBy || ""}`)}" data-cash-month="${escapeHtml(cashMonthKey(row.date))}">
      <span>${escapeHtml(cashDateLabel(row.date))}</span>
      <span>${escapeHtml(row.note || "")}${row.recordedBy ? `<small> · ${escapeHtml(row.recordedBy)}</small>` : ""}</span>
      <span class="cash-in">${row.direction === "in" ? baht(row.amount) : ""}</span>
      <span class="cash-out">${row.direction === "out" ? baht(row.amount) : ""}</span>
      ${canEdit ? `<button type="button" data-delete-cash="${row.id}">ลบ</button>` : `<span></span>`}
    </div>`).join("");
  return `<div class="cash-top">
      <div class="cash-summary">
        <div><span>เงินเข้า</span><strong class="cash-in">${baht(inn)}</strong></div>
        <div><span>เงินออก</span><strong class="cash-out">${baht(out)}</strong></div>
        <div><span>คงเหลือ</span><strong>${baht(inn - out)}</strong></div>
      </div>
      <div class="cash-tools">
        <label>ค้นหารายการ<input id="cashSearch" type="search" placeholder="พิมพ์รายการ"></label>
        <label>ปี/เดือน<select id="cashMonth"><option value="">ทั้งหมด</option>${months.map((key) => `<option value="${key}">${escapeHtml(cashMonthLabel(key))}</option>`).join("")}</select></label>
      </div>
    </div>
    ${canEdit ? `<form id="cashForm" class="cash-row">
      <label>วันที่<input value="${escapeHtml(todayLabel())}" readonly tabindex="-1"></label>
      <label>ประเภท<select name="direction"><option value="in">เงินเข้า</option><option value="out">เงินออก</option></select></label>
      <label>รายการ<input name="note" maxlength="200" required placeholder="เช่น มัดจำ TITAN 1.1 M"></label>
      <label>จำนวนเงิน<input name="amount" type="number" min="1" step="1" required></label>
      <button class="btn btn-dark" type="submit">บันทึก</button>
    </form>
    <p class="form-status" id="cashStatus"></p>
    <div class="modal" id="cashModal" hidden>
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="cashModalTitle">
        <h2 id="cashModalTitle">ยืนยันรายการ</h2>
        <p id="cashModalText"></p>
        <div class="user-actions">
          <button class="btn btn-dark" id="cashModalOk" type="button">ตกลง</button>
          <button class="btn btn-ghost" id="cashModalCancel" type="button">ยกเลิก</button>
        </div>
      </div>
    </div>` : `<p class="sub">ดูได้อย่างเดียว</p>`}
    <div class="cash-table">
      <div class="cash-line cash-head"><span>วันที่</span><span>รายการ</span><span>เงินเข้า</span><span>เงินออก</span><span></span></div>
      ${list || ""}
      <p class="sub" id="cashEmpty" ${rows.length ? "hidden" : ""}>ยังไม่มีรายการ</p>
    </div>`;
}

function roleOptions(selected, locked) {
  const items = [
    ["admin", "admin จัดการทุกอย่าง"],
    ["partner", "Partner สมุดเงินสดและข้อมูลลูกค้า"],
    ["viewer", "Viewer ดูอย่างเดียว"]
  ];
  if (locked) return `<input type="hidden" name="role" value="admin"><p>บทบาท admin จัดการทุกอย่าง</p>`;
  return `<label>บทบาท<select name="role">${items.map(([id, label]) => `<option value="${id}" ${id === selected ? "selected" : ""}>${label}</option>`).join("")}</select></label>`;
}

function statusOptions(selected, locked) {
  const items = [["active", "ใช้งาน"], ["inactive", "ระงับ"]];
  if (locked) return `<input type="hidden" name="status" value="active"><p>สถานะ ใช้งาน</p>`;
  return `<label>สถานะ<select name="status">${items.map(([id, label]) => `<option value="${id}" ${id === selected ? "selected" : ""}>${label}</option>`).join("")}</select></label>`;
}

function roleText(role) {
  return { admin: "admin จัดการทุกอย่าง", partner: "Partner สมุดเงินสดและข้อมูลลูกค้า", viewer: "Viewer ดูอย่างเดียว" }[role] || role || "";
}

function statusText(status) {
  return status === "inactive" ? "ระงับ" : "ใช้งาน";
}

function usersView(rows) {
  const cards = rows.map((row) => {
    const locked = row.email === window.OWNER_EMAIL;
    return `<article class="inquiry user-card">
      <div class="user-summary">
        <strong>${escapeHtml(row.name || "")}</strong>
        <span>${escapeHtml(row.phone || "—")}</span>
        <span>${escapeHtml(row.email || "")}</span>
        <span>${escapeHtml(roleText(row.role))}</span>
        <span>${escapeHtml(statusText(row.status))}</span>
      </div>
      <form class="user-form reg-row" data-uid="${row.id}" hidden>
        <label>ชื่อ-นามสกุล<input name="name" required maxlength="80" value="${escapeHtml(row.name || "")}"></label>
        <label>เบอร์โทร<input name="phone" maxlength="12" value="${escapeHtml(row.phone || "")}"></label>
        <label>อีเมลสำหรับเข้าระบบ<input name="email" type="email" value="${escapeHtml(row.email || "")}" readonly></label>
        ${roleOptions(row.role, locked)}
        ${statusOptions(row.status, locked)}
        <div class="user-actions">
          <button class="btn btn-dark" type="submit">บันทึก</button>
          <button class="btn btn-ghost" type="button" data-cancel-user>ยกเลิก</button>
        </div>
        <p class="form-status"></p>
      </form>
      <div class="user-actions view-actions">
        <button class="btn btn-ghost" type="button" data-edit-user>แก้ไข</button>
        <button class="btn btn-ghost" type="button" data-reset-email="${escapeHtml(row.email || "")}">ส่งลิงก์กำหนดรหัสผ่านใหม่</button>
        <button class="btn btn-ghost" type="button" data-delete-user="${row.id}" data-user-role="${escapeHtml(row.role || "")}" data-user-email="${escapeHtml(row.email || "")}" data-user-name="${escapeHtml(row.name || "")}">ลบ</button>
      </div>
    </article>`;
  }).join("");
  return `<form id="userForm" class="reg-row">
      <h2 class="reg-title">ลงทะเบียนผู้ใช้งาน</h2>
      <label>ชื่อ-นามสกุล<input name="name" required maxlength="80"></label>
      <label>เบอร์โทร<input name="phone" required maxlength="12" placeholder="08xxxxxxxx"></label>
      <label>อีเมลสำหรับเข้าระบบ<input name="email" type="email" required maxlength="120"></label>
      ${roleOptions("viewer", false)}
      ${statusOptions("active", false)}
      <button class="btn btn-dark" type="submit">บันทึกและส่งอีเมลตั้งรหัสผ่าน</button>
      <p class="form-status"></p>
    </form>
    <div class="inquiry-list">${cards}</div>
    <div class="modal" id="userModal" hidden>
      <div class="modal-card" role="dialog" aria-modal="true">
        <h2 id="userModalTitle">ลบผู้ใช้งาน</h2>
        <p id="userModalText"></p>
        <label id="userModalPassWrap">รหัสผ่าน<input id="userModalPass" type="password" autocomplete="off"></label>
        <p class="form-status err" id="userModalErr"></p>
        <div class="user-actions">
          <button class="btn btn-dark" id="userModalYes" type="button">ใช่</button>
          <button class="btn btn-ghost" id="userModalNo" type="button">ไม่ใช่</button>
        </div>
      </div>
    </div>`;
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
    root.innerHTML = adminLoginForm(loginNotice);
    loginNotice = "";
    return;
  }
  const role = fb.role();
  if (!role) {
    loginNotice = "บัญชีนี้ยังไม่ได้รับสิทธิ์ หรือถูกระงับ";
    await fb.signOut();
    return;
  }
  const allowed = role === "admin"
    ? ["site", "cashbook", "customers", "users"]
    : role === "partner" ? ["cashbook", "customers"] : ["site", "cashbook", "customers"];
  let section = parseHash().section || allowed[0];
  if (!allowed.includes(section)) section = allowed[0];
  const canEditSite = role === "admin";
  const canEditCash = role === "admin" || role === "partner";
  const canEditNotes = role === "admin" || role === "partner";
  root.innerHTML = adminTabs(section, role) + `<div id="adminPane"><p class="form-status">กำลังโหลด...</p></div>`;
  const pane = document.getElementById("adminPane");
  try {
    if (section === "site") {
      pane.innerHTML = siteEditor(canEditSite);
      return;
    }
    if (section === "cashbook") {
      const rows = await fb.listCash();
      if (parseHash().page !== "admin") return;
      pane.innerHTML = cashView(rows, canEditCash);
      return;
    }
    if (section === "users") {
      const people = await fb.listUsers();
      if (parseHash().page !== "admin") return;
      pane.innerHTML = usersView(people);
      return;
    }
    const rows = await fb.listInquiries();
    const withNotes = (await Promise.all(rows.map(async (row) => ({
      ...row,
      notes: await fb.listNotes(row.id).catch(() => [])
    })))).sort((a, b) => latestActivity(b) - latestActivity(a));
    if (parseHash().page !== "admin") return;
    pane.innerHTML = withNotes.length ? `<div class="inquiry-list">${withNotes.map((row) => inquiryCard(row, canEditNotes)).join("")}</div>` : `<p class="sub">ยังไม่มีลูกค้าฝากข้อมูล</p>`;
  } catch (error) {
    if (!pane) return;
    pane.innerHTML = `<p class="form-status err">${error.code === "permission-denied" ? "บัญชีนี้ยังไม่มีสิทธิ์" : "โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง"}</p>`;
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

async function signInGoogle(button) {
  const status = button.form.querySelector(".form-status");
  button.disabled = true;
  status.className = "form-status";
  status.textContent = "กำลังเปิดหน้าต่าง Gmail...";
  try {
    await window.TitanFirebase.signInWithGoogle();
    fillAdmin();
  } catch (error) {
    status.classList.add("err");
    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData && error.customData.email;
      const emailInput = button.form.querySelector("[name=email]");
      if (emailInput && email) emailInput.value = email;
      status.textContent = "เมลนี้เคยใช้รหัสผ่าน กรอกรหัสผ่านด้านบนหนึ่งครั้ง ระบบจะเชื่อม Gmail ให้";
    } else if (error.code === "auth/popup-closed-by-user") {
      status.textContent = "ยกเลิกหน้าต่าง Gmail";
    } else if (error.code === "auth/popup-blocked") {
      status.textContent = "เบราว์เซอร์ปิดหน้าต่าง Gmail อนุญาตป๊อปอัปแล้วลองใหม่";
    } else if (error.code === "auth/unauthorized-domain") {
      status.textContent = "โดเมนนี้ยังไม่ได้รับอนุญาตใน Firebase Authentication";
    } else {
      status.textContent = "เข้าด้วย Gmail ไม่สำเร็จ";
    }
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
    const photos = (m.images || []).filter((image) => image.src);
    const gallery = photos.length ? photos : [coverOf(m)];
    const img = gallery[state.photo] || gallery[0];
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
  if (e.target.id === "cashForm") {
    e.preventDefault();
    openCashConfirm(e.target);
  }
  if (e.target.classList.contains("note-form")) {
    e.preventDefault();
    saveNote(e.target);
  }
  if (e.target.id === "newModelForm") {
    e.preventDefault();
    createModel(e.target);
  }
  if (e.target.classList.contains("editor-card") && !e.target.classList.contains("user-form")) {
    e.preventDefault();
    saveModelForm(e.target);
  }
  if (e.target.id === "userForm") {
    e.preventDefault();
    saveNewUser(e.target);
  }
  if (e.target.classList.contains("user-form")) {
    e.preventDefault();
    saveExistingUser(e.target);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.id === "cashModalCancel" || e.target.id === "cashModal") closeCashConfirm();
  if (e.target.id === "cashModalOk") confirmCash();
  if (e.target.id === "googleLogin") {
    signInGoogle(e.target);
    return;
  }
  if (e.target.id === "adminLogout") {
    window.TitanFirebase.signOut().then(() => fillAdmin());
  }
  const remove = e.target.dataset ? e.target.dataset.deleteCash : "";
  if (remove) {
    window.TitanFirebase.deleteCash(remove).then(() => fillAdmin());
  }
  if (e.target.id === "userModalNo" || e.target.id === "userModal") closeUserDelete();
  if (e.target.id === "userModalYes") confirmUserDelete();
  if (e.target.hasAttribute("data-delete-user")) {
    openUserDelete(e.target);
    return;
  }
  if (e.target.hasAttribute("data-add-image")) {
    e.target.closest("form").querySelector("[data-images]").insertAdjacentHTML("beforeend", imageSlot({}, true));
    return;
  }
  if (e.target.hasAttribute("data-remove-image")) {
    e.target.closest("[data-image-slot]").remove();
    return;
  }
  if (e.target.hasAttribute("data-add-battery")) {
    const id = "b" + Date.now().toString(36);
    e.target.closest("form").querySelector("[data-batteries]").insertAdjacentHTML("beforeend", batterySlot({ id, name: "", price: 0, warranty: "ประกันแบต 1 ปี" }, true));
    return;
  }
  if (e.target.hasAttribute("data-remove-battery")) {
    e.target.closest("[data-battery-row]").remove();
    return;
  }
  if (e.target.hasAttribute("data-add-addon")) {
    const id = "a" + Date.now().toString(36);
    e.target.closest("form").querySelector("[data-addons]").insertAdjacentHTML("beforeend", addonSlot({ id, name: "", price: 0 }, true));
    return;
  }
  if (e.target.hasAttribute("data-remove-addon")) {
    e.target.closest("[data-addon-row]").remove();
    return;
  }
  if (e.target.hasAttribute("data-add-note")) {
    const box = e.target.closest(".note-add");
    e.target.hidden = true;
    const form = box.querySelector(".note-form");
    form.hidden = false;
    form.querySelector("[name=text]").focus();
    return;
  }
  if (e.target.hasAttribute("data-edit-user")) {
    const card = e.target.closest(".user-card");
    card.querySelector(".user-summary").hidden = true;
    card.querySelector(".view-actions").hidden = true;
    card.querySelector(".user-form").hidden = false;
    return;
  }
  if (e.target.hasAttribute("data-cancel-user")) {
    const card = e.target.closest(".user-card");
    card.querySelector(".user-form").hidden = true;
    card.querySelector(".user-summary").hidden = false;
    card.querySelector(".view-actions").hidden = false;
    return;
  }
  const removeNote = e.target.dataset ? e.target.dataset.deleteNote : "";
  if (removeNote) {
    const [inquiryId, noteId] = removeNote.split("|");
    window.TitanFirebase.deleteNote(inquiryId, noteId).then(() => fillAdmin());
  }
  const resetEmail = e.target.dataset ? e.target.dataset.resetEmail : "";
  if (resetEmail) sendResetLink(e.target, resetEmail);
});

document.addEventListener("input", (e) => {
  if (e.target.id === "q") {
    state.q = e.target.value;
    paintCards();
  }
  if (e.target.id === "cashSearch") applyCashFilter();
});

document.addEventListener("change", (e) => {
  if (e.target.id === "cashMonth") applyCashFilter();
  if (e.target.closest("[data-image-slot]") && e.target.type === "file" && e.target.files && e.target.files[0]) {
    replaceModelImage(e.target);
    return;
  }
  const m = byId(state.modelId);
  if (!m) return;
  if (e.target.name === "battery") state.battery = e.target.value;
  if (e.target.name === "roof") {
    m.addons.filter((a) => a.group === "roof").forEach((a) => { state.addons[a.id] = false; });
    if (e.target.value) state.addons[e.target.value] = true;
  }
  if (e.target.dataset.addon) state.addons[e.target.dataset.addon] = e.target.checked;
  if (e.target.name === "battery" || e.target.dataset.addon || e.target.name === "roof") {
    const q = quoteOf(m);
    document.getElementById("total").textContent = baht(q.total);
    document.getElementById("quoteLines").innerHTML = `<li>${escapeHtml(q.battery.name)} · ${escapeHtml(q.battery.warranty || "")}</li>` + (q.picked.map((a) => `<li>${escapeHtml(a.name)} +${baht(a.price)}</li>`).join("") || (m.addons.length ? "<li>ยังไม่เลือกอุปกรณ์เสริม</li>" : ""));
  }
});

window.addEventListener("hashchange", () => render(true));

function money(value) {
  const amount = Math.round(Number(value));
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function uniqueId(seed, used) {
  let id = String(seed || "").replace(/[^a-z0-9-]/gi, "").slice(0, 40);
  if (!id) id = "x" + Date.now().toString(36);
  while (used.has(id)) id = (id + "x").slice(0, 40);
  used.add(id);
  return id;
}

function readModelForm(form) {
  const name = String(new FormData(form).get("name") || "").trim();
  const category = String(new FormData(form).get("category") || "");
  if (name.length < 2) return { error: "ใส่ชื่อรุ่นอย่างน้อย 2 ตัวอักษร" };
  if (!CATEGORIES.some((item) => item.id === category)) return { error: "เลือกหมวดหมู่" };
  const images = [...form.querySelectorAll("[data-image-slot]")].map((slot) => ({
    src: slot.querySelector("[name=image-src]").value.trim(),
    alt: slot.querySelector("[name=image-alt]").value.trim() || name,
    caption: slot.querySelector("[name=image-caption]").value.trim(),
    clip: slot.querySelector("[name=image-clip]").value === "1"
  }));
  if (images.some((image) => !image.src)) return { error: "เลือกรูปให้ครบ หรือลบช่องรูปที่ยังว่าง" };
  const batteryIds = new Set();
  const batteries = [...form.querySelectorAll("[data-battery-row]")].map((row) => ({
    id: uniqueId(row.querySelector("[name=battery-id]").value, batteryIds),
    name: row.querySelector("[name=battery-name]").value.trim(),
    price: money(row.querySelector("[name=battery-price]").value),
    warranty: row.querySelector("[name=battery-warranty]").value.trim()
  }));
  if (!batteries.length) return { error: "ต้องมีแบตเตอรี่อย่างน้อย 1 รายการ" };
  if (batteries.some((battery) => battery.name.length < 2 || battery.price == null)) return { error: "กรอกชื่อและราคาแบตเตอรี่ให้ครบ" };
  const addonIds = new Set();
  const addons = [...form.querySelectorAll("[data-addon-row]")].map((row) => {
    const item = {
      id: uniqueId(row.querySelector("[name=addon-id]").value, addonIds),
      name: row.querySelector("[name=addon-name]").value.trim(),
      price: money(row.querySelector("[name=addon-price]").value)
    };
    const group = row.querySelector("[name=addon-group]").value.trim();
    if (group) item.group = group;
    return item;
  });
  if (addons.some((addon) => addon.name.length < 2 || addon.price == null)) return { error: "กรอกชื่อและราคาอุปกรณ์เสริมให้ครบ" };
  return { name, category, images, batteries, addons };
}

async function createModel(form) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const category = String(data.get("category") || "");
  const status = form.querySelector(".form-status");
  status.className = "form-status";
  if (name.length < 2) {
    status.classList.add("err");
    status.textContent = "ใส่ชื่อรุ่นอย่างน้อย 2 ตัวอักษร";
    return;
  }
  if (!CATEGORIES.some((item) => item.id === category)) {
    status.classList.add("err");
    status.textContent = "เลือกหมวดหมู่";
    return;
  }
  const model = {
    id: "m" + Date.now().toString(36),
    name,
    category,
    kicker: "รุ่นเพิ่มเอง",
    blurb: "",
    motor: "-",
    load: "-",
    range: "-",
    speed: "-",
    bed: "-",
    colors: [],
    images: [],
    batteries: [{ id: "b1", name: "แบตเตอรี่", price: 0, warranty: "ประกันแบต 1 ปี" }],
    addons: [],
    specs: [],
    features: []
  };
  status.className = "form-status";
  status.textContent = "กำลังบันทึก...";
  form.querySelector("button").disabled = true;
  try {
    await window.TitanFirebase.saveModel(model);
    MODELS.push(model);
    fillAdmin();
  } catch (error) {
    form.querySelector("button").disabled = false;
    status.className = "form-status err";
    status.textContent = "เพิ่มรุ่นไม่สำเร็จ";
  }
}

async function saveModelForm(form) {
  const status = form.querySelector(".form-status");
  const model = byId(form.dataset.model);
  const draft = readModelForm(form);
  status.className = "form-status";
  if (!model) return;
  if (draft.error) {
    status.classList.add("err");
    status.textContent = draft.error;
    return;
  }
  model.name = draft.name;
  model.category = draft.category;
  model.images = draft.images.map((image) => ({
    src: image.src,
    alt: image.alt,
    caption: image.caption,
    ...(image.clip ? { clip: true } : {})
  }));
  model.batteries = draft.batteries;
  model.addons = draft.addons;
  status.textContent = "กำลังบันทึก...";
  try {
    await window.TitanFirebase.saveModel(model);
    status.className = "form-status ok";
    status.textContent = "บันทึกแล้ว หน้าเว็บใช้ข้อมูลชุดนี้";
    form.querySelector("h2").textContent = model.name;
  } catch (error) {
    status.className = "form-status err";
    status.textContent = "บันทึกไม่สำเร็จ";
  }
}

function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const local = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1100;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(local);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("image"));
      }, "image/jpeg", 0.72);
    };
    img.onerror = () => {
      URL.revokeObjectURL(local);
      reject(new Error("image"));
    };
    img.src = local;
  });
}

async function replaceModelImage(input) {
  const form = input.form;
  const model = byId(form.dataset.model);
  const slot = input.closest("[data-image-slot]");
  const index = [...form.querySelectorAll("[data-image-slot]")].indexOf(slot);
  const status = form.querySelector(".form-status");
  status.className = "form-status";
  status.textContent = "กำลังอัปโหลดรูป...";
  try {
    const blob = await shrinkImage(input.files[0]);
    if (blob.size > 8 * 1024 * 1024) throw new Error("large");
    const url = await window.TitanFirebase.saveModelImage(model.id, index, blob);
    slot.querySelector("img").src = url;
    slot.querySelector("[name=image-src]").value = url;
    if (!slot.querySelector("[name=image-alt]").value) slot.querySelector("[name=image-alt]").value = model.name;
    const sameSlots = form.querySelectorAll("[data-image-slot]").length === model.images.length;
    if (sameSlots && model.images[index]) {
      model.images[index].src = url;
      model.images[index].alt = model.images[index].alt || model.name;
      await window.TitanFirebase.saveModel(model);
    }
    status.className = "form-status ok";
    status.textContent = sameSlots ? "เปลี่ยนรูปแล้ว" : "อัปโหลดรูปแล้ว กดบันทึกเพื่อเก็บจำนวนรูป";
  } catch (error) {
    status.className = "form-status err";
    status.textContent = error.message === "large" ? "รูปใหญ่เกินไป ลองรูปที่เล็กกว่า" : "อัปโหลดรูปไม่สำเร็จ";
  }
}

async function saveNote(form) {
  const text = new FormData(form).get("text");
  const value = String(text || "").trim();
  if (!value) return;
  form.querySelector("button").disabled = true;
  try {
    const person = window.TitanFirebase.currentUser();
    const who = window.TitanFirebase.currentProfile();
    await window.TitanFirebase.addNote(form.dataset.inquiry, {
      text: value,
      date: todayLabel(),
      recordedBy: (who && who.name) || person.email,
      recordedByEmail: person.email,
      recordedByUid: person.uid
    });
    form.reset();
    fillAdmin();
  } catch (error) {
    form.querySelector("button").disabled = false;
  }
}

function authMessage(error) {
  if (error.code === "auth/email-already-in-use") return "อีเมลนี้มีบัญชีแล้ว";
  if (error.code === "auth/invalid-email") return "อีเมลไม่ถูกต้อง";
  if (error.code === "auth/too-many-requests") return "ส่งอีเมลบ่อยเกินไป ลองใหม่ภายหลัง";
  if (error.code === "permission-denied") return "ไม่มีสิทธิ์ทำรายการนี้";
  return "ทำรายการไม่สำเร็จ";
}

function userPayload(form, requirePhone) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = digits(data.get("phone"));
  const email = String(data.get("email") || "").trim().toLowerCase();
  const role = String(data.get("role") || "");
  const status = String(data.get("status") || "");
  if (name.length < 2) return { error: "กรอกชื่อ-นามสกุล" };
  if ((requirePhone || phone) && (phone.length < 9 || phone.length > 10)) return { error: "กรอกเบอร์โทรให้ครบ" };
  if (!email.includes("@")) return { error: "กรอกอีเมลสำหรับเข้าระบบ" };
  if (!["admin", "partner", "viewer"].includes(role) || !["active", "inactive"].includes(status)) return { error: "เลือกบทบาทและสถานะ" };
  return { name, phone, email, role, status };
}

async function saveNewUser(form) {
  const status = form.querySelector(".form-status");
  const payload = userPayload(form, true);
  status.className = "form-status";
  if (payload.error) {
    status.classList.add("err");
    status.textContent = payload.error;
    return;
  }
  status.textContent = "กำลังบันทึกและส่งอีเมล...";
  form.querySelector("button").disabled = true;
  try {
    await window.TitanFirebase.registerUser(payload);
    status.className = "form-status ok";
    status.textContent = "บันทึกแล้ว และส่งอีเมลให้กำหนดรหัสผ่าน";
    fillAdmin();
  } catch (error) {
    status.className = "form-status err";
    status.textContent = authMessage(error);
    form.querySelector("button").disabled = false;
  }
}

async function saveExistingUser(form) {
  const status = form.querySelector(".form-status");
  const payload = userPayload(form, false);
  status.className = "form-status";
  if (payload.error) {
    status.classList.add("err");
    status.textContent = payload.error;
    return;
  }
  status.textContent = "กำลังบันทึก...";
  try {
    await window.TitanFirebase.updateUser(form.dataset.uid, payload);
    status.className = "form-status ok";
    status.textContent = "บันทึกผู้ใช้งานแล้ว";
  } catch (error) {
    status.className = "form-status err";
    status.textContent = authMessage(error);
  }
}

async function sendResetLink(button, email) {
  const status = button.form ? button.form.querySelector(".form-status") : null;
  button.disabled = true;
  if (status) {
    status.className = "form-status";
    status.textContent = "กำลังส่งอีเมล...";
  }
  try {
    await window.TitanFirebase.sendPasswordLink(email);
    if (status) {
      status.className = "form-status ok";
      status.textContent = "ส่งลิงก์กำหนดรหัสผ่านใหม่แล้ว";
    }
  } catch (error) {
    if (status) {
      status.className = "form-status err";
      status.textContent = authMessage(error);
    }
  } finally {
    button.disabled = false;
  }
}

let pendingUserDelete = null;

function openUserDelete(button) {
  pendingUserDelete = {
    id: button.dataset.deleteUser,
    role: button.dataset.userRole,
    email: button.dataset.userEmail,
    name: button.dataset.userName
  };
  const admin = pendingUserDelete.role === "admin";
  document.getElementById("userModalTitle").textContent = admin ? "ลบผู้ดูแล" : "ลบผู้ใช้งาน";
  document.getElementById("userModalText").textContent = admin
    ? "ใส่รหัสผ่านเพื่อลบผู้ดูแลคนนี้"
    : "จะลบผู้ใช้งานผู้นี้จริงหรือไม่ ?";
  document.getElementById("userModalPassWrap").hidden = !admin;
  document.getElementById("userModalPass").value = "";
  document.getElementById("userModalErr").textContent = "";
  document.getElementById("userModal").hidden = false;
}

function closeUserDelete() {
  pendingUserDelete = null;
  const modal = document.getElementById("userModal");
  if (modal) modal.hidden = true;
}

async function confirmUserDelete() {
  const item = pendingUserDelete;
  const err = document.getElementById("userModalErr");
  if (!item) return;
  if (item.role === "admin" && document.getElementById("userModalPass").value !== "2515") {
    err.textContent = "รหัสไม่ถูกต้อง";
    return;
  }
  if (item.email === window.OWNER_EMAIL || item.id === window.TitanFirebase.currentUser()?.uid) {
    err.textContent = "ลบบัญชีที่กำลังใช้งานอยู่ไม่ได้";
    return;
  }
  try {
    await window.TitanFirebase.deleteUser(item.id);
    closeUserDelete();
    fillAdmin();
  } catch (error) {
    err.textContent = "ลบไม่สำเร็จ";
  }
}

let pendingCash = null;

function openCashConfirm(form) {
  const status = document.getElementById("cashStatus");
  const data = new FormData(form);
  const amount = Number(data.get("amount"));
  const note = String(data.get("note") || "").trim();
  const direction = String(data.get("direction")) === "out" ? "out" : "in";
  status.className = "form-status";
  if (!note) {
    status.classList.add("err");
    status.textContent = "ใส่รายการ";
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    status.classList.add("err");
    status.textContent = "ใส่จำนวนเงินให้มากกว่า 0";
    return;
  }
  pendingCash = { direction, amount, note };
  document.getElementById("cashModalText").textContent = `${todayLabel()} · ${direction === "in" ? "เงินเข้า" : "เงินออก"} · ${note} · ${baht(amount)}`;
  document.getElementById("cashModal").hidden = false;
}

function closeCashConfirm() {
  pendingCash = null;
  const modal = document.getElementById("cashModal");
  if (modal) modal.hidden = true;
}

async function confirmCash() {
  const entry = pendingCash;
  closeCashConfirm();
  if (!entry) return;
  await saveCash(entry);
}

async function saveCash(entry) {
  const status = document.getElementById("cashStatus");
  if (status) status.textContent = "กำลังบันทึก...";
  try {
    const person = window.TitanFirebase.currentUser();
    const who = window.TitanFirebase.currentProfile();
    await window.TitanFirebase.addCash({
      direction: entry.direction,
      amount: entry.amount,
      note: entry.note,
      date: todayKey(),
      recordedBy: (who && who.name) || person.email,
      recordedByEmail: person.email,
      recordedByUid: person.uid
    });
    fillAdmin();
  } catch (error) {
    status.className = "form-status err";
    status.textContent = "บันทึกรายการไม่สำเร็จ";
  }
}

async function boot() {
  if (window.TitanFirebase) {
    window.TitanFirebase.onAuth(() => {
      if (parseHash().page === "admin") fillAdmin();
    });
    if (window.TitanFirebase.ready) {
      try { await window.TitanFirebase.applyCatalog(MODELS); } catch (error) { /* ใช้ราคาในไฟล์ถ้ายังไม่มีข้อมูลที่บันทึก */ }
    }
  }
  render(false);
}

if (window.TitanFirebase) boot();
else window.addEventListener("titan-firebase-ready", boot, { once: true });
