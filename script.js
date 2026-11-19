const WORK = [
  { m: "tv", real: true, lead: true, role: "produce", note: "Kat secured the exclusive interview with Sandi Harvey.", title: "Mother's heartbreak after accused killer dies before verdict", outlet: "A Current Affair", desc: "Leisl Smith was 23 when she went missing in 2012. For almost ten years her mother, Sandi Harvey, searched for answers, only for the man charged with Leisl's murder to die before a verdict was reached.", date: "2022", dur: "Producer", link: "https://www.youtube.com/watch?v=kkdqNk1nP8c" },
  { m: "tv", real: true, role: "report", title: "Iconic Sydney suburb becoming a ghost town", outlet: "A Current Affair", desc: "Why so many shopfronts in a once-popular Sydney suburb now sit empty, and the local man who believes he can bring businesses back.", date: "Jan 2023", dur: "Reporter", link: "https://www.youtube.com/watch?v=8h7M1-hjSDQ&t=209s" },
  { m: "tv", real: true, role: "produce", title: "Following police as they try to catch online predators", outlet: "A Current Affair", desc: "Inside a specialist police team tracking down online predators to protect children.", date: "May 2023", dur: "Producer", link: "https://www.youtube.com/watch?v=TJx0LLp4RYI" },
  { m: "tv", real: true, role: "produce", title: "Welcome development for woman dudded by her own bank", outlet: "A Current Affair", desc: "After the story aired, ANZ agreed to refund the $144,000 in life savings a retired widow lost to a banking scam.", date: "May 2023", dur: "Producer", link: "https://www.youtube.com/watch?v=sUFJr8ke4x0" },
  { m: "tv", real: true, role: "produce", title: "Woman's fight for justice decades after alleged rape", outlet: "A Current Affair", desc: "A Sydney woman's 18-year fight for justice, after she first went to police at the age of 14 to report that she had been raped.", date: "2022", dur: "Producer", link: "https://www.youtube.com/watch?v=uU7ky_pM9R0&t=144s" },
  { m: "tv", real: true, role: "produce", note: "Kat secured the exclusive interview with Patrick Conolly.", title: "Mayor stabbed after alleged home invasion", outlet: "A Current Affair", desc: "As mayor, Patrick Conolly led his community through the worst floods in recent memory. Then he was stabbed in an alleged home invasion.", date: "Sep 2022", dur: "Producer", link: "https://www.facebook.com/ACurrentAffair9/videos/493103598850232/" },
  { m: "radio", title: "Breakfast show live reports", desc: "Weekly live two-ways from the scene of the morning's lead story.", date: "Jan 2026", dur: "Series", link: "#" },
  { m: "digital", title: "Long-read feature", desc: "A 2,500-word investigation published online with an accompanying short video.", date: "Nov 2025", dur: "12 min read", link: "#" },
  { m: "mc", title: "Industry awards night", desc: "Hosted a 400-guest ceremony, scripted links and interviewed winners on stage.", date: "Oct 2025", dur: "3 hrs", link: "#" },
  { m: "radio", title: "Documentary feature", desc: "Produced and presented a half-hour audio documentary.", date: "Jun 2025", dur: "28:40", link: "#" },
  { m: "digital", title: "Social video series", desc: "Six-part explainer series for short-form video platforms.", date: "Apr 2025", dur: "6 × 60s", link: "#" },
  { m: "mc", title: "Conference panel chair", desc: "Chaired a panel on the future of local news.", date: "Feb 2025", dur: "60 min", link: "#" }
];
const LABEL = { tv: "Television", radio: "Radio", digital: "Digital", mc: "MC / Live" };
const ROLE = { report: "Reporter", produce: "Producer" };

// YouTube helpers: video ID and start time from a link
function ytInfo(url) {
  const m = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/.exec(url || "");
  if (!m) return null;
  const t = /[?&#]t=(\d+)/.exec(url);
  return { id: m[1], start: t ? +t[1] : 0 };
}
function watchLabel(w) {
  if (!w.link || w.link === "#") return "";
  if (w.link.includes("facebook.com")) return "Watch on Facebook";
  if (ytInfo(w.link)) return "Watch on YouTube";
  return "Watch / listen / read";
}
// Thumbnail that turns into a player when clicked (YouTube), or a link card (Facebook)
function videoEl(w) {
  const yt = ytInfo(w.link);
  if (yt) {
    const box = document.createElement("div");
    box.className = "video";
    box.innerHTML = `<img src="https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><button class="play" type="button"><span></span></button>`;
    const btn = box.querySelector(".play");
    btn.setAttribute("aria-label", "Play: " + w.title);
    btn.addEventListener("click", () => {
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${yt.id}?autoplay=1&rel=0${yt.start ? "&start=" + yt.start : ""}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      box.querySelector("iframe").title = w.title;
    });
    return box;
  }
  if (w.link && w.link.includes("facebook.com")) {
    const a = document.createElement("a");
    a.className = "video fb";
    a.href = w.link; a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = `<div class="fb-in"><span class="play" style="position:static;background:none"><span></span></span><small>Watch on Facebook</small></div>`;
    a.setAttribute("aria-label", "Watch on Facebook: " + w.title);
    return a;
  }
  return null;
}

// Home page: top story plus three cards
const features = document.getElementById("features");
WORK.filter(w => w.real).slice(0, 4).forEach(w => {
  const el = document.createElement("article");
  el.className = "feature" + (w.lead ? " lead" : "");
  const v = videoEl(w);
  if (v) el.appendChild(v);
  el.insertAdjacentHTML("beforeend", `${w.lead ? '<span class="toptag">Top story</span>' : ""}<span class="outlet"></span><h3></h3><p></p>`);
  el.querySelector(".outlet").textContent = (w.outlet || "") + " · " + (ROLE[w.role] || LABEL[w.m]);
  el.querySelector("h3").textContent = w.title;
  el.querySelector("p").textContent = w.desc + (w.note ? " " + w.note : "");
  if (watchLabel(w)) {
    const a = document.createElement("a");
    a.href = w.link; a.target = "_blank"; a.rel = "noopener"; a.textContent = watchLabel(w);
    el.appendChild(a);
  }
  features.appendChild(el);
});

// Portfolio page: Reporting / Producing / Radio, digital & live
const worklist = document.getElementById("worklist");
const GROUPS = [
  { key: "report", title: "Reporting", test: w => w.role === "report" },
  { key: "produce", title: "Producing", test: w => w.role === "produce" },
  { key: "other", title: "Radio, digital & live", test: w => !w.role }
];
let filter = "all";
function itemEl(w) {
  const el = document.createElement("article");
  el.className = "item";
  const v = videoEl(w);
  const thumb = document.createElement("div");
  if (v) thumb.appendChild(v);
  el.appendChild(thumb);
  const body = document.createElement("div");
  body.innerHTML = `<span class="medium"></span><h3></h3><p></p>${w.note ? '<span class="role"></span>' : ""}`;
  body.querySelector(".medium").textContent = ROLE[w.role] || LABEL[w.m];
  body.querySelector("h3").textContent = w.title;
  if (!w.real) body.querySelector("h3").insertAdjacentHTML("beforeend", '<span class="sample">Sample</span>');
  body.querySelector("p").textContent = w.desc;
  if (w.note) body.querySelector(".role").textContent = w.note;
  if (watchLabel(w)) {
    const a = document.createElement("a");
    a.className = "watch"; a.href = w.link; a.target = "_blank"; a.rel = "noopener"; a.textContent = watchLabel(w);
    body.appendChild(a);
  }
  el.appendChild(body);
  const meta = document.createElement("span");
  meta.className = "meta"; meta.textContent = w.outlet || LABEL[w.m];
  el.appendChild(meta);
  return el;
}
function renderWork() {
  worklist.innerHTML = "";
  GROUPS.filter(g => filter === "all" || g.key === filter).forEach(g => {
    const items = WORK.filter(g.test);
    if (!items.length) return;
    const sec = document.createElement("section");
    sec.className = "group";
    sec.innerHTML = `<div class="group-head"><h3></h3></div>`;
    sec.querySelector("h3").textContent = g.title;
    items.forEach(w => sec.appendChild(itemEl(w)));
    worklist.appendChild(sec);
  });
}
document.querySelectorAll(".filters button").forEach(b => b.addEventListener("click", () => setFilter(b.dataset.filter)));
function setFilter(f) {
  filter = f;
  document.querySelectorAll(".filters button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.filter === f)));
  renderWork();
}

// Simple page switching (Home / About / Portfolio / Contact)
const VIEWS = ["home", "about", "work", "contact"];
function route() {
  const h = location.hash.replace("#", "");
  const v = VIEWS.includes(h) ? h : "home";
  VIEWS.forEach(id => document.getElementById("view-" + id).classList.toggle("active", id === v));
  document.querySelectorAll("header a[href^='#']").forEach(a => {
    if (a.getAttribute("href") === "#" + v && !a.classList.contains("mono")) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
document.getElementById("yr").textContent = new Date().getFullYear();

// Contact form: opens the visitor's email app with the enquiry ready to send
const CONTACT_EMAIL = "k.stefanovic12@gmail.com";
const form = document.getElementById("enquiry");
form.addEventListener("submit", e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const err = document.getElementById("f-err");
  if (!d.name.trim() || !d.message.trim() || !/^\S+@\S+\.\S+$/.test(d.email)) {
    err.textContent = "Please add your name, a valid email and a message.";
    return;
  }
  err.textContent = "";
  const subject = `Enquiry: ${d.type}${d.org ? " – " + d.org : ""}`;
  const body = `Name: ${d.name}\nEmail: ${d.email}\nOrganisation: ${d.org || "-"}\nEnquiry type: ${d.type}\nDate(s): ${d.date || "-"}\n\n${d.message}`;
  const addr = document.getElementById("mail-addr");
  addr.textContent = CONTACT_EMAIL; addr.href = "mailto:" + CONTACT_EMAIL;
  document.getElementById("thanks").classList.add("show");
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

renderWork();
route();
