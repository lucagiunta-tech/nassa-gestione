import React, { useState, useEffect, useCallback } from "react";

/* ─── ADMIN PASSWORD (change before going to production) ─── */
/* admin password replaced by Supabase user store */
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  ArrowLeft, Plus, Trash2, X, Check, Eye,
  ChevronRight, ChevronLeft, ChevronDown,
  ExternalLink, FileText, LayoutGrid, BarChart2, AlertCircle,
  Activity, Users, Zap, Clock, StickyNote, TrendingUp, Flag
} from "lucide-react";

/* ─── TOKENS ──────────────────────────────────────────────── */
const C = {
  verde:"#1A8C3F", magenta:"#C2185B",
  testo:"#1A1A1A", muted:"#6B6B6B",
  sfondo:"#F5F5F5", border:"#E0E0E0", white:"#FFFFFF",
  arancio:"#E65100", blu:"#1565C0",
};
const FONT = "Arial, sans-serif";

/* ─── CONSTANTS ───────────────────────────────────────────── */
const PACCHETTI = {
  starter:        { label:"🥉 Starter",      prezzo:490,  ore:15  },
  essential:      { label:"🥈 Essential",    prezzo:790,  ore:28  },
  professional:   { label:"🥇 Professional", prezzo:1200, ore:45  },
  premium:        { label:"💎 Premium",      prezzo:1800, ore:70  },
  "full-service": { label:"🚀 Full Service", prezzo:2800, ore:120 },
};

const FASI = [
  { id:"analisi",        emoji:"🔍", label:"Analisi",        moduli:[{id:1,nome:"Mod.1 Intervista"},{id:2,nome:"Mod.2 Document Hub"},{id:3,nome:"Mod.3 Audit & Analisi"}] },
  { id:"strategia",      emoji:"🧭", label:"Strategia",      moduli:[{id:"4a",nome:"Mod.4a Brainstorming Concept"},{id:"4b",nome:"Mod.4b Moodboard Visiva"},{id:5,nome:"Mod.5 Copy Strategy"},{id:6,nome:"Mod.6 Pilastri"},{id:7,nome:"Mod.7 Branding System"},{id:8,nome:"Mod.8 Architettura Digitale"},{id:9,nome:"Mod.9 Linea Narrativa"}] },
  { id:"produzione",     emoji:"✏️", label:"Produzione",     moduli:[{id:10,nome:"Mod.10 Shooting Brief & Shotlist"},{id:11,nome:"Mod.11 Produzione Grafica & Video"}] },
  { id:"pianificazione", emoji:"📅", label:"Pianificazione", moduli:[{id:12,nome:"Mod.12 PED Piano Editoriale"},{id:13,nome:"Mod.13 Streamtime"},{id:14,nome:"Mod.14 Pubblicazione"}] },
  { id:"monitoraggio",   emoji:"📊", label:"Monitoraggio",   moduli:[{id:15,nome:"Mod.15 ADV & Performance"},{id:16,nome:"Mod.16 Report Mensile"},{id:17,nome:"Mod.17 QBR Trimestrale"}] },
];

const STATI_MODULO = { "da-fare":"Da fare", "in-corso":"In corso", "check":"Check", "completo":"Completato" };

const PIATTAFORME = {
  instagram: { label:"Instagram", color:"#E1306C" },
  facebook:  { label:"Facebook",  color:"#1877F2" },
  linkedin:  { label:"LinkedIn",  color:"#0A66C2" },
  tiktok:    { label:"TikTok",    color:"#111111" },
};

const DOC_CAT = {
  brand:     { label:"Brand",     color:"#1A8C3F" },
  strategia: { label:"Strategia", color:"#1565C0" },
  report:    { label:"Report",    color:"#6A1B9A" },
  contratti: { label:"Contratti", color:"#E65100" },
};

// Pipeline cols (top row) — Pubblicato goes to bottom row separately
const PIPELINE_COLS = {
  idea:       { emoji:"💡", label:"Idea",       hbg:"#FFF8E1", htx:"#795548" },
  brief:      { emoji:"📝", label:"Brief",      hbg:"#E3F2FD", htx:"#1565C0" },
  produzione: { emoji:"✏️", label:"Produzione", hbg:"#FFF3E0", htx:"#E65100" },
  semaforo:   { emoji:"🚦", label:"Semaforo",   hbg:"#FFFDE7", htx:"#F57F17" },
};
const PUBBLICATO_COL = { emoji:"✅", label:"Pubblicato", hbg:"#E8F5E9", htx:"#1A8C3F" };
const FEED_COL       = { emoji:"🖼", label:"Feed",       hbg:"#F3E5F5", htx:"#6A1B9A" };

const POST_COLORS = [
  ["#2C3E50","#3498DB"],["#1A8C3F","#27AE60"],["#8E44AD","#9B59B6"],
  ["#C2185B","#E91E63"],["#D35400","#E67E22"],["#1A1A2E","#16213E"],
];

const PILASTRI = {
  brand:     { label:"Brand Identity", color:"#1A8C3F", bg:"#E8F5E9", pct:20 },
  prodotto:  { label:"Prodotto",       color:"#1565C0", bg:"#E3F2FD", pct:40 },
  rawreal:   { label:"Raw & Real",     color:"#E65100", bg:"#FFF3E0", pct:20 },
  edu:       { label:"Educazione",     color:"#6A1B9A", bg:"#F3E5F5", pct:10 },
  community: { label:"Community",      color:"#F57F17", bg:"#FFFDE7", pct:10 },
};

const FORMATI = {
  reel:     { label:"Reel",     color:"#E1306C", bg:"#FCE4EC" },
  carousel: { label:"Carousel", color:"#E65100", bg:"#FFF3E0" },
  post:     { label:"Post",     color:"#1565C0", bg:"#E3F2FD" },
  storia:   { label:"Storia",   color:"#6A1B9A", bg:"#F3E5F5" },
};

const STATI_PED = {
  idea:       { label:"Idea",         bg:"#FFF8E1", tx:"#795548" },
  brief:      { label:"Brief",        bg:"#E3F2FD", tx:"#1565C0" },
  produzione: { label:"In produzione",bg:"#FFF3E0", tx:"#E65100" },
  semaforo:   { label:"In revisione", bg:"#FFFDE7", tx:"#F57F17" },
  pubblicato: { label:"Pubblicato",   bg:"#E8F5E9", tx:"#1A8C3F" },
  feed:       { label:"🖼 Feed",      bg:"#F3E5F5", tx:"#6A1B9A" },
};

const FONTE_TIPI = {
  standalone: { label:"Task standalone",  emoji:"⚡", color:"#6B6B6B" },
  setup:      { label:"Setup One-Shot",   emoji:"⚡", color:"#E65100" },
  progresso:  { label:"Fase di progetto", emoji:"🔍", color:"#1565C0" },
  ped:        { label:"Contenuto PED",    emoji:"📅", color:"#1A8C3F" },
  documento:  { label:"Documento",        emoji:"📁", color:"#6A1B9A" },
};

/* Salva un task nel planner della settimana contenente dateISO */
async function scheduleTask(task) {
  const wk  = getWeekKey(new Date(task.dateISO));
  const cur = await store.get("team:tasks:" + wk) || [];
  // rimuovi eventuale vecchia versione con stesso fonte.refId
  const filtered = task.fonte && task.fonte.refId
    ? cur.filter(t => !(t.fonte && t.fonte.refId === task.fonte.refId && t.fonte.clienteSlug === task.fonte.clienteSlug))
    : cur;
  await store.set("team:tasks:" + wk, [...filtered, task]);
}

/* Rimuovi un task da tutte le settimane */
async function unscheduleByRef(clienteSlug, refId) {
  const keys = [];
  // cerca nelle ultime 52 settimane
  const d = new Date();
  for (let i = 0; i < 52; i++) {
    keys.push("team:tasks:" + getWeekKey(d));
    d.setDate(d.getDate() - 7);
  }
  const uniq = [...new Set(keys)];
  await Promise.all(uniq.map(async k => {
    const cur = await store.get(k);
    if (!cur) return;
    const next = cur.filter(t => !(t.fonte && t.fonte.refId === refId && t.fonte.clienteSlug === clienteSlug));
    if (next.length !== cur.length) await store.set(k, next);
  }));
}

/* Hook per leggere i task schedulati per un certo refId — usa indice veloce */
async function getTasksForRef(clienteSlug, refId) {
  // prima prova l'indice rapido
  const idx = await store.get("team:linked:" + clienteSlug);
  if (idx && idx[refId]) return idx[refId];
  // fallback: scan settimane
  const results = [];
  const d = new Date();
  const seen = new Set();
  for (let i = 0; i < 52; i++) {
    const wk = getWeekKey(d);
    if (!seen.has(wk)) {
      seen.add(wk);
      const cur = await store.get("team:tasks:" + wk) || [];
      cur.forEach(t => { if (t.fonte && t.fonte.refId === refId && t.fonte.clienteSlug === clienteSlug) results.push(t); });
    }
    d.setDate(d.getDate() - 7);
  }
  return results;
}

const SETUP_MODULI = [
  { id:"s1", nome:"Intervista Onboarding",     tag:"🎤" },
  { id:"s2", nome:"Document Hub",              tag:"📂" },
  { id:"s3", nome:"Audit & Analisi Completa",  tag:"🔎" },
  { id:"s4", nome:"Brainstorming Concept",     tag:"💡" },
  { id:"s5", nome:"Moodboard Visiva",          tag:"🎨" },
  { id:"s6", nome:"Copy Strategy",             tag:"✍️" },
  { id:"s7", nome:"Pilastri di Comunicazione", tag:"🏛" },
  { id:"s8", nome:"Firma contratto",           tag:"📝" },
  { id:"s9", nome:"Accesso canali",            tag:"🔑" },
];

/* ─── MOCK DATA ───────────────────────────────────────────── */
const MOCK_CLIENTE   = { slug:"eich-design", nome:"EICH Design", pacchetto:"professional", settore:"Design & Architettura", referente:"Marco Eich", email:"marco@eichdesign.it", dataInizio:"2026-03-01" };
const MOCK_PROGRESS  = {
  analisi:       { percentuale:100, moduli:{1:"completo",2:"completo",3:"completo"} },
  strategia:     { percentuale:100, moduli:{"4a":"completo","4b":"completo",5:"completo",6:"completo",7:"completo",8:"completo",9:"completo"} },
  produzione:    { percentuale:60,  moduli:{10:"completo",11:"in-corso"} },
  pianificazione:{ percentuale:30,  moduli:{12:"in-corso",13:"da-fare",14:"da-fare"} },
  monitoraggio:  { percentuale:0,   moduli:{15:"da-fare",16:"da-fare",17:"da-fare"} },
};
const MOCK_FEED = [
  { id:"p1", colori:POST_COLORS[0], titolo:"Brand Launch",   caption:"Quando il design parla da solo.\n\n#EICH #Design",          data:"2026-11-08", piattaforma:"instagram", stato:"pubblicato" },
  { id:"p2", colori:POST_COLORS[1], titolo:"Process",        caption:"Il processo è parte del prodotto.\n\n#BehindTheScenes",     data:"2026-11-11", piattaforma:"instagram", stato:"pubblicato" },
  { id:"p3", colori:POST_COLORS[2], titolo:"Progetto Villa", caption:"Progetto residenziale a Ragusa.\n\n#Architettura #Sicilia", data:"2026-11-14", piattaforma:"instagram", stato:"approvato"  },
  { id:"p4", colori:POST_COLORS[3], titolo:"Materiali",      caption:"La prima decisione estetica.\n\n#Materials",               data:"2026-11-18", piattaforma:"instagram", stato:"approvato"  },
  { id:"p5", colori:POST_COLORS[4], titolo:"Studio Tour",    caption:"Gli spazi influenzano il pensiero.\n\n#Studio",            data:"2026-11-22", piattaforma:"instagram", stato:"bozza"      },
  { id:"p6", colori:POST_COLORS[5], titolo:"Testimonial",    caption:"Un cliente soddisfatto.\n\n#ClientStory",                  data:"2026-11-27", piattaforma:"instagram", stato:"bozza"      },
];
const MOCK_PED = [
  { id:"ped1",  data:"2026-11-04", piattaforma:"instagram", titolo:"Brand Launch",         stato:"pubblicato", pilastro:"brand",     formato:"reel",     memberId:"paoletto" },
  { id:"ped2",  data:"2026-11-06", piattaforma:"facebook",  titolo:"Chi siamo",             stato:"pubblicato", pilastro:"brand",     formato:"post",     memberId:"hermes"   },
  { id:"ped3",  data:"2026-11-11", piattaforma:"instagram", titolo:"Process",               stato:"pubblicato", pilastro:"rawreal",   formato:"reel",     memberId:"paoletto" },
  { id:"ped4",  data:"2026-11-12", piattaforma:"linkedin",  titolo:"Case Study Villa",      stato:"pubblicato", pilastro:"prodotto",  formato:"carousel", memberId:"hermes"   },
  { id:"ped5",  data:"2026-11-14", piattaforma:"instagram", titolo:"Progetto Villa",        stato:"semaforo",   pilastro:"prodotto",  formato:"post",     memberId:"hermes"   },
  { id:"ped6",  data:"2026-11-18", piattaforma:"instagram", titolo:"Materiali",             stato:"semaforo",   pilastro:"edu",       formato:"carousel", memberId:"hermes"   },
  { id:"ped7",  data:"2026-11-20", piattaforma:"facebook",  titolo:"Offerta speciale",      stato:"produzione", pilastro:"prodotto",  formato:"post",     memberId:"hermes"   },
  { id:"ped8",  data:"2026-11-25", piattaforma:"instagram", titolo:"Studio Tour",           stato:"produzione", pilastro:"rawreal",   formato:"reel",     memberId:"paoletto" },
  { id:"ped9",  data:"2026-11-27", piattaforma:"tiktok",    titolo:"Reel dietro le quinte", stato:"brief",      pilastro:"rawreal",   formato:"storia",   memberId:"paoletto" },
  { id:"ped10", data:"2026-11-29", piattaforma:"instagram", titolo:"Lancio collezione",     stato:"idea",       pilastro:"community", formato:"post",     memberId:"hermes"   },
];
const MOCK_DOCS = [
  { id:"d1", nome:"Brand Book EICH Design", categoria:"brand",     data:"2026-04-15", dimensione:"8.2 MB", url:"#" },
  { id:"d2", nome:"Copy Strategy · V2",     categoria:"strategia", data:"2026-04-20", dimensione:"1.1 MB", url:"#" },
  { id:"d3", nome:"QBR Q3 2026",            categoria:"report",    data:"2026-10-05", dimensione:"2.4 MB", url:"#" },
];
const MOCK_KPI = {
  reach:45000, engagement:4.2, lead:28,
  topContent:[
    { titolo:"Brand Launch",    reach:12400, engagement:6.8 },
    { titolo:"Process",         reach:9800,  engagement:5.2 },
    { titolo:"Case Study Villa",reach:8100,  engagement:4.9 },
    { titolo:"Chi siamo",       reach:7600,  engagement:3.8 },
    { titolo:"Studio Tour",     reach:7100,  engagement:4.1 },
  ],
  trend:[
    {mese:"Mag",reach:18000},{mese:"Giu",reach:22000},{mese:"Lug",reach:28000},
    {mese:"Ago",reach:31000},{mese:"Set",reach:38000},{mese:"Ott",reach:45000},
  ],
};

/* ─── SUPABASE STORAGE ────────────────────────────────────── */
const SB_URL = "https://lukikbjmbqfloqczepye.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1a2lrYmptYnFmbG9xY3plcHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDEwMjcsImV4cCI6MjA5NDc3NzAyN30.dJXUDigvFVLnY3xXWQpxDZj2y3CEPuNOKWuWxlf-jNY";
const SB_HEADERS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };

/* ─── DROPBOX CONFIG ──────────────────────────────────────── */
// 1. Create an app at https://www.dropbox.com/developers/apps
//    → Scoped access · Full Dropbox · any name
// 2. Under Permissions, enable: files.content.write, files.content.read, sharing.write
// 3. Under Settings, generate an access token (short-lived) then run the OAuth flow
//    once to get a refresh_token (see README or use the Dropbox token generator tool)
const DROPBOX_APP_KEY       = "YOUR_APP_KEY";        // from App Console → Settings
const DROPBOX_REFRESH_TOKEN = "YOUR_REFRESH_TOKEN";  // long-lived refresh token
const DROPBOX_FOLDER        = "/NassaPortal";         // root folder in your Dropbox

// Internal token cache — auto-refreshes before expiry
let _dbxToken       = null;
let _dbxTokenExpiry = 0;

async function getDropboxToken() {
  if (_dbxToken && Date.now() < _dbxTokenExpiry - 60_000) return _dbxToken;
  try {
    const res  = await fetch("https://api.dropbox.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type:    "refresh_token",
        refresh_token: DROPBOX_REFRESH_TOKEN,
        client_id:     DROPBOX_APP_KEY,
      }),
    });
    const data  = await res.json();
    _dbxToken       = data.access_token;
    _dbxTokenExpiry = Date.now() + (data.expires_in || 14400) * 1000;
    return _dbxToken;
  } catch { return null; }
}

/** Strip characters Dropbox rejects from folder names */
function toFolderName(name) {
  return (name || "Cliente")
    .replace(/[<>:"\/\\|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim() || "Cliente";
}

/**
 * Pre-creates the full folder tree for a new client in Dropbox:
 *   NassaPortal/{ClientName}/Images
 *   NassaPortal/{ClientName}/Videos
 *   NassaPortal/{ClientName}/Documents
 * Called automatically when a client is added. Non-blocking — folders are
 * also created on first file upload if this call is skipped.
 */
async function createDropboxClientFolders(clientName) {
  // Folders are auto-created by the proxy on first upload.
  // This function is kept for future direct API use if needed.
  console.log("Dropbox folders will be created on first upload for:", clientName);
}

/**
 * Uploads a File to the client's named folder in Dropbox.
 *
 * Path: NassaPortal/{clientName}/Images|Videos|Documents/{timestamp.ext}
 *
 * @param {File}   file
 * @param {string} clientName  — display name of the client (becomes folder name)
 * @param {string} subfolder   — "Images" | "Videos" | "Documents"
 * @returns {Promise<string>}  direct-render URL (?raw=1)
 */
async function uploadToDropbox(file, clientName, subfolder = "Images") {
  const folder   = toFolderName(clientName);
  const sub      = subfolder.charAt(0).toUpperCase() + subfolder.slice(1).toLowerCase();
  const ext      = (file.name.split(".").pop() || "bin").toLowerCase();
  const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path     = `${DROPBOX_FOLDER}/${folder}/${sub}/${safeName}`;

  // Call our Vercel proxy instead of Dropbox directly (avoids CORS)
  const res = await fetch("/api/dropbox-upload", {
    method:  "POST",
    headers: { "x-dropbox-path": path, "Content-Type": file.type || "application/octet-stream" },
    body:    file,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Upload fallito (${res.status})`);
  }

  const data = await res.json();
  return data.url; // already ?raw=1
}

/* ─── META / FACEBOOK & INSTAGRAM CONFIG ─────────────────── */
// Get these from https://developers.facebook.com → Your App → Settings > Basic
const META_APP_ID     = "1543498264065807";     // App ID (public, safe in client)
const META_APP_SECRET = "e2f69284d7f2ea71a3752596d19e8921"; // App Secret (team-internal app only)
const META_API        = "https://graph.facebook.com/v19.0";
const META_SCOPES     = [
  "pages_manage_posts",
  "pages_read_engagement",
  "instagram_content_publish",
  "instagram_basic",
  "pages_show_list",
].join(",");

/* ── Token helpers ───────────────────────────────────────── */

/** Short-lived → Long-lived (60 days) user token */
async function metaExchangeLongLived(shortToken) {
  const r = await fetch(
    `${META_API}/oauth/access_token?grant_type=fb_exchange_token` +
    `&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}` +
    `&fb_exchange_token=${encodeURIComponent(shortToken)}`
  );
  return r.json(); // { access_token, expires_in }
}

/** Get all FB Pages (+ linked IG accounts) the user manages */
async function metaGetPages(userToken) {
  // Step 1: get all pages the user manages
  const r = await fetch(
    `${META_API}/me/accounts?fields=id,name,access_token&limit=100` +
    `&access_token=${encodeURIComponent(userToken)}`
  );
  const data = await r.json();
  if (!data.data || data.data.length === 0) return data;

  // Step 2: for each page, check if it has a linked IG Business account
  const pages = await Promise.all(data.data.map(async (page) => {
    try {
      const igR = await fetch(
        `${META_API}/${page.id}?fields=instagram_business_account{id,name,username,profile_picture_url}` +
        `&access_token=${encodeURIComponent(page.access_token)}`
      );
      const igD = await igR.json();
      return { ...page, instagram_business_account: igD.instagram_business_account || null };
    } catch {
      return { ...page, instagram_business_account: null };
    }
  }));

  return { ...data, data: pages };
}

/* ── OAuth popup (implicit grant) ───────────────────────── */

function openMetaOAuth(onPages) {
  // Server-side code flow — server fetches pages and posts them back
  const redirectUri = encodeURIComponent("https://nassa-gestione.vercel.app/api/meta-oauth");
  const url =
    `https://www.facebook.com/dialog/oauth?client_id=${META_APP_ID}` +
    `&redirect_uri=${redirectUri}&scope=${META_SCOPES}&response_type=code`;
  const popup = window.open(url, "MetaLogin", "width=620,height=720,left=200,top=80");

  function handleMsg(e) {
    if (e.data?.type === "META_OAUTH_PAGES") {
      window.removeEventListener("message", handleMsg);
      clearInterval(poll);
      onPages(e.data.pages); // array of pages with tokens already included
    }
    if (e.data?.type === "META_OAUTH_ERROR") {
      window.removeEventListener("message", handleMsg);
      clearInterval(poll);
      alert("Errore connessione Meta: " + e.data.error);
    }
  }
  window.addEventListener("message", handleMsg);
  const poll = setInterval(() => {
    try { if (popup.closed) { clearInterval(poll); window.removeEventListener("message", handleMsg); } } catch {}
  }, 800);
}

/* ── Video polling (Instagram processes videos async) ───── */

async function pollIgMedia(mediaId, token, maxAttempts = 24) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 4000));
    const r   = await fetch(`${META_API}/${mediaId}?fields=status_code&access_token=${encodeURIComponent(token)}`);
    const d   = await r.json();
    if (d.status_code === "FINISHED") return;
    if (d.status_code === "ERROR")    throw new Error("Instagram: errore elaborazione video");
  }
  throw new Error("Instagram: timeout elaborazione video (riprova tra qualche minuto)");
}

/* ── Instagram publish ───────────────────────────────────── */

async function igPublish(igUserId, token, post, scheduleUnix) {
  const tipo = post.tipo || "post";
  let creationId;

  if (tipo === "carousel") {
    // 1. Upload each image as a child container
    const childIds = [];
    for (const url of (post.immagini || [])) {
      const r = await fetch(`${META_API}/${igUserId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: url, is_carousel_item: true, access_token: token }),
      });
      const d = await r.json();
      if (d.error) throw new Error("IG carousel slide: " + d.error.message);
      childIds.push(d.id);
    }
    // 2. Create carousel container
    const r2 = await fetch(`${META_API}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "CAROUSEL",
        children: childIds.join(","),
        caption: post.caption || "",
        access_token: token,
        ...(scheduleUnix ? { scheduled_publish_time: scheduleUnix } : {}),
      }),
    });
    const d2 = await r2.json();
    if (d2.error) throw new Error("IG carousel: " + d2.error.message);
    creationId = d2.id;

  } else if (tipo === "reel") {
    const r = await fetch(`${META_API}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "REELS",
        video_url: post.videoUrl || "",
        caption: post.caption || "",
        access_token: token,
        ...(scheduleUnix ? { scheduled_publish_time: scheduleUnix } : {}),
      }),
    });
    const d = await r.json();
    if (d.error) throw new Error("IG reel: " + d.error.message);
    creationId = d.id;
    await pollIgMedia(creationId, token);

  } else if (tipo === "storia") {
    const r = await fetch(`${META_API}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "STORIES",
        image_url: post.immagineUrl || post.immagineBase64 || "",
        access_token: token,
      }),
    });
    const d = await r.json();
    if (d.error) throw new Error("IG storia: " + d.error.message);
    creationId = d.id;

  } else {
    // Single photo post
    const r = await fetch(`${META_API}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: post.immagineUrl || post.immagineBase64 || "",
        caption: post.caption || "",
        access_token: token,
        ...(scheduleUnix ? { scheduled_publish_time: scheduleUnix } : {}),
      }),
    });
    const d = await r.json();
    if (d.error) throw new Error("IG post: " + d.error.message);
    creationId = d.id;
  }

  // Publish the container
  const pub = await fetch(`${META_API}/${igUserId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: creationId, access_token: token }),
  });
  const pubData = await pub.json();
  if (pubData.error) throw new Error("IG publish: " + pubData.error.message);
  return pubData;
}

/* ── Facebook publish ────────────────────────────────────── */

async function fbPublish(pageId, token, post, scheduleUnix) {
  const tipo    = post.tipo || "post";
  const isVideo = tipo === "reel" || tipo === "storia";
  const isCarousel = tipo === "carousel";
  // For carousels we post the first image (FB carousel via API needs link_data which
  // is a different format — simple photo post is cleaner for team use)
  const imgUrl  = isCarousel
    ? (post.immagini?.[0] || post.immagineUrl || "")
    : (post.immagineUrl || post.immagineBase64 || "");

  let endpoint, body;
  if (isVideo) {
    endpoint = `${META_API}/${pageId}/videos`;
    body = {
      file_url: post.videoUrl || "",
      description: post.caption || "",
      access_token: token,
      ...(scheduleUnix ? { published: false, scheduled_publish_time: scheduleUnix } : { published: true }),
    };
  } else {
    endpoint = `${META_API}/${pageId}/photos`;
    body = {
      url: imgUrl,
      caption: (post.caption || "") + (isCarousel ? "\n\n[Vedi il carousel completo su Instagram]" : ""),
      access_token: token,
      ...(scheduleUnix ? { published: false, scheduled_publish_time: scheduleUnix } : { published: true }),
    };
  }

  const r = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const d = await r.json();
  if (d.error) throw new Error("Facebook: " + d.error.message);
  return d;
}


const store = {
  async get(key) {
    try {
      const res = await fetch(`${SB_URL}/rest/v1/kv_store?key=eq.${encodeURIComponent(key)}&select=value`, { headers: SB_HEADERS });
      const data = await res.json();
      return data.length ? data[0].value : null;
    } catch { return null; }
  },
  async set(key, val) {
    try {
      await fetch(`${SB_URL}/rest/v1/kv_store`, {
        method: "POST",
        headers: { ...SB_HEADERS, Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ key, value: val }),
      });
      return true;
    } catch { return false; }
  },
  async del(key) {
    try {
      await fetch(`${SB_URL}/rest/v1/kv_store?key=eq.${encodeURIComponent(key)}`, { method: "DELETE", headers: SB_HEADERS });
      return true;
    } catch { return false; }
  },
};

/* ─── AUTH HELPERS ────────────────────────────────────────── */
const AUTH_KEY = "nassa_admin_auth";
const DEFAULT_USERS = [{ username: "nassa", password: "nassa2026" }];

function checkAdminSession() { return sessionStorage.getItem(AUTH_KEY) === "ok"; }
function setAdminSession(username) {
  sessionStorage.setItem(AUTH_KEY, "ok");
  sessionStorage.setItem("nassa_admin_user", username);
}
function clearAdminSession() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem("nassa_admin_user");
}
function getCurrentUser() { return sessionStorage.getItem("nassa_admin_user") || ""; }

async function seed() {
  const existing = await store.get("clients:index");
  if (existing && existing.length > 0) return;
  await store.set("clients:eich-design", MOCK_CLIENTE);
  await store.set("clients:eich-design:progress", MOCK_PROGRESS);
  await store.set("clients:eich-design:feed", MOCK_FEED);
  await store.set("clients:eich-design:ped:2026-11", MOCK_PED);
  await store.set("clients:eich-design:docs", MOCK_DOCS);
  await store.set("clients:eich-design:kpi:2026-10", MOCK_KPI);
  await store.set("clients:index", ["eich-design"]);
}

/* ─── ROUTING ─────────────────────────────────────────────── */
function getRoute() {
  const raw = window.location.hash;
  // hash is "#/admin", "#/admin/slug", "#/c/slug"
  const h = raw.startsWith("#/") ? raw.slice(1) : raw.startsWith("#") ? raw.slice(1) : "/admin";
  if (!h || h === "/" || h === "/admin") return { mode:"admin", slug:null };
  if (h.startsWith("/admin/")) return { mode:"admin", slug:decodeURIComponent(h.slice(7)) };
  if (h.startsWith("/c/"))     return { mode:"client", slug:decodeURIComponent(h.slice(3)) };
  if (h === "/privacy")        return { mode:"privacy", slug:null };
  return { mode:"admin", slug:null };
}
function nav(path) { window.location.hash = path; }

/* ─── ATOMS ───────────────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:32}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:24,height:24,border:"2px solid #E0E0E0",borderTopColor:C.verde,borderRadius:"50%",animation:"spin .7s linear infinite"}} />
    </div>
  );
}

function Badge({ stato }) {
  const map = {
    pubblicato:      { bg:"#E8F5E9", tx:"#1A8C3F", label:"✅ Pubblicato"     },
    approvato:       { bg:"#E3F2FD", tx:"#1565C0", label:"✅ Approvato"      },
    "non-approvato": { bg:"#FFF0F0", tx:"#C2185B", label:"❌ Non approvato"  },
    semaforo:        { bg:"#FFFDE7", tx:"#F57F17", label:"🚦 Semaforo"       },
    produzione:      { bg:"#FFF3E0", tx:"#E65100", label:"✏️ Produzione"    },
    brief:           { bg:"#E3F2FD", tx:"#1565C0", label:"📝 Brief"          },
    idea:            { bg:"#FFF8E1", tx:"#795548", label:"💡 Idea"           },
    bozza:           { bg:"#F5F5F5", tx:"#6B6B6B", label:"Bozza"             },
    "da-fare":       { bg:"#F5F5F5", tx:"#6B6B6B", label:"Da fare"           },
    "in-corso":      { bg:"#FFF3E0", tx:"#E65100", label:"In corso"          },
    completo:        { bg:"#E8F5E9", tx:"#1A8C3F", label:"Completato"        },
    check:           { bg:"#E3F2FD", tx:"#1565C0", label:"Check"             },
  };
  const s = map[stato] || map["da-fare"];
  return (
    <span style={{background:s.bg,color:s.tx,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>
      {s.label}
    </span>
  );
}

function PTag({ p }) {
  const pl = PIATTAFORME[p];
  if (!pl) return null;
  return (
    <span style={{background:pl.color,color:"#fff",padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:700}}>
      {pl.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  SECTION HEAD (shared)                                       */
/* ─────────────────────────────────────────────────────────── */
function SectionHead({ icon, label, count }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <div style={{width:28,height:28,background:C.verde+"18",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        {icon}
      </div>
      <span style={{fontWeight:800,fontSize:14,color:C.testo}}>{label}</span>
      {count !== undefined && (
        <span style={{fontSize:11,background:C.sfondo,color:C.muted,padding:"1px 8px",borderRadius:10,fontWeight:700,marginLeft:4}}>{count}</span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  DASHBOARD                                                   */
/* ─────────────────────────────────────────────────────────── */
function Dashboard({ slugs, clientMap, progressMap, pedMap }) {
  const [notes, setNotes]       = useState({});
  const [editNote, setEditNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSaving] = useState(false);

  useEffect(() => {
    store.get("dashboard:notes").then(n => setNotes(n || {}));
  }, []);

  function openNote(slug) { setNoteText(notes[slug] || ""); setEditNote(slug); }

  async function saveNote() {
    setSaving(true);
    const updated = { ...notes, [editNote]: noteText };
    await store.set("dashboard:notes", updated);
    setNotes(updated);
    setSaving(false);
    setEditNote(null);
  }

  const crits = [];
  slugs.forEach(slug => {
    const prog = progressMap[slug] || {};
    FASI.forEach(fase => {
      const fd = prog[fase.id] || { percentuale:0, moduli:{} };
      fase.moduli.forEach(mod => {
        const stato = (fd.moduli && fd.moduli[mod.id]) || "da-fare";
        if (stato === "in-corso" || stato === "check")
          crits.push({ slug, nome:clientMap[slug]?.nome||slug, fase:fase.label, faseEmoji:fase.emoji, modulo:mod.nome, stato });
      });
    });
  });

  const today  = new Date().toISOString().split("T")[0];
  const lineup = [];
  slugs.forEach(slug => {
    (pedMap[slug] || []).forEach(p => {
      if (p.data >= today && p.stato !== "pubblicato")
        lineup.push({ ...p, slug, clienteNome:clientMap[slug]?.nome||slug });
    });
  });
  lineup.sort((a, b) => a.data.localeCompare(b.data));

  const totClienti = slugs.length;
  const totOre     = slugs.reduce((acc, s) => acc + (PACCHETTI[clientMap[s]?.pacchetto]?.ore||0), 0);
  const totValue   = slugs.reduce((acc, s) => acc + (PACCHETTI[clientMap[s]?.pacchetto]?.prezzo||0), 0);

  function fmtData(s) {
    if (!s) return "";
    const pts = s.split("-");
    const mesi = ["","Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
    return parseInt(pts[2]) + " " + mesi[parseInt(pts[1])];
  }

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px",fontFamily:FONT}}>

      {/* KPI */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:22}}>
        {[
          { icon:<Users size={15} style={{color:C.verde}}/>,       label:"Clienti attivi",   value:String(totClienti),                sub:"progetti in essere"       },
          { icon:<Clock size={15} style={{color:C.blu}}/>,         label:"Ore gestite/mese", value:totOre+"h",                        sub:"somma pacchetti retainer" },
          { icon:<TrendingUp size={15} style={{color:C.magenta}}/>,label:"Valore mensile",   value:"€"+totValue.toLocaleString("it-IT"),sub:"ricavi retainer lordi"  },
        ].map(card => (
          <div key={card.label} style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
              {card.icon}
              <span style={{fontSize:11,color:C.muted,fontWeight:700}}>{card.label}</span>
            </div>
            <div style={{fontSize:22,fontWeight:800,color:C.testo,lineHeight:1}}>{card.value}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:4}}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Progetti */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:18,marginBottom:18}}>
        <SectionHead icon={<Activity size={14} style={{color:C.verde}}/>} label="Progetti in essere" count={slugs.length} />
        {!slugs.length && <div style={{textAlign:"center",padding:24,color:C.muted,fontSize:13}}>Nessun cliente. Creane uno dalla tab Clienti.</div>}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {slugs.map(slug => {
            const cl    = clientMap[slug];
            const prog  = progressMap[slug] || {};
            const pac   = PACCHETTI[cl?.pacchetto] || PACCHETTI.professional;
            const percs = FASI.map(f => (prog[f.id] ? prog[f.id].percentuale : 0) || 0);
            const overall = Math.round(percs.reduce((a, b) => a + b, 0) / FASI.length);
            const nota  = notes[slug];
            // mini 5 dots for quick status
            const dots = FASI.map(f => {
              const p = (prog[f.id]?.percentuale||0);
              return p===100?C.verde:p>0?"#FB8C00":"#E0E0E0";
            });
            return (
              <div key={slug}
                onMouseEnter={e => {
                  const detail = e.currentTarget.querySelector(".proj-detail");
                  if (detail) { detail.style.maxHeight="220px"; detail.style.opacity="1"; }
                }}
                onMouseLeave={e => {
                  const detail = e.currentTarget.querySelector(".proj-detail");
                  if (detail) { detail.style.maxHeight="0px"; detail.style.opacity="0"; }
                }}
                style={{border:"1px solid "+C.border,borderRadius:10,overflow:"hidden",background:C.white,cursor:"default"}}>

                {/* ── HEADER (sempre visibile) ─────────────── */}
                <div style={{padding:"11px 14px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:34,height:34,background:C.verde,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{color:"#fff",fontWeight:800,fontSize:14}}>{(cl?.nome||"N")[0]}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13}}>{cl?.nome}</div>
                    <div style={{fontSize:10,color:C.muted}}>{pac.label} · {pac.ore}h/mese · €{pac.prezzo}/mese</div>
                  </div>

                  {/* 5 mini dots per fase */}
                  <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
                    {dots.map((col, i) => (
                      <div key={i} title={FASI[i].label}
                        style={{width:8,height:8,borderRadius:"50%",background:col,transition:"transform .2s"}}/>
                    ))}
                  </div>

                  <div style={{textAlign:"right",flexShrink:0,minWidth:40}}>
                    <div style={{fontSize:15,fontWeight:800,color:overall===100?C.verde:overall>50?"#FB8C00":C.magenta}}>{overall}%</div>
                  </div>
                  <button onClick={() => nav("/admin/"+slug)}
                    style={{background:C.verde,color:"#fff",border:"none",borderRadius:5,padding:"5px 11px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT,flexShrink:0}}>
                    Apri →
                  </button>
                </div>

                {/* ── DETAIL (hover reveal) ─────────────────── */}
                <div className="proj-detail"
                  style={{maxHeight:"0px",opacity:"0",overflow:"hidden",
                    transition:"max-height .28s ease, opacity .22s ease",
                    borderTop:"1px solid "+C.sfondo}}>

                  {/* fasi */}
                  <div style={{padding:"10px 14px 8px",display:"flex",flexDirection:"column",gap:6}}>
                    {FASI.map(fase => {
                      const fd   = prog[fase.id] || { percentuale:0, moduli:{} };
                      const perc = fd.percentuale || 0;
                      const wip  = Object.values(fd.moduli||{}).some(s => s==="in-corso"||s==="check");
                      return (
                        <div key={fase.id} style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:12,width:16,flexShrink:0}}>{fase.emoji}</span>
                          <span style={{fontSize:11,color:C.muted,width:88,flexShrink:0}}>{fase.label}</span>
                          <div style={{flex:1,height:5,background:"#F0F0F0",borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",width:perc+"%",background:perc===100?C.verde:wip?"#FB8C00":"#E0E0E0",borderRadius:3,transition:"width .5s ease"}} />
                          </div>
                          <span style={{fontSize:10,fontWeight:700,width:28,textAlign:"right",flexShrink:0,color:perc===100?C.verde:wip?C.arancio:C.muted}}>{perc}%</span>
                          {wip && <span style={{fontSize:9,background:"#FFF3E0",color:C.arancio,padding:"1px 5px",borderRadius:3,fontWeight:700,flexShrink:0}}>WIP</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* nota */}
                  <div style={{padding:"6px 14px 10px",borderTop:"1px solid "+C.sfondo,display:"flex",alignItems:"flex-start",gap:8}}>
                    <StickyNote size={11} style={{color:C.muted,marginTop:2,flexShrink:0}} />
                    {nota
                      ? <span style={{fontSize:11,color:C.testo,flex:1,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{nota}</span>
                      : <span style={{fontSize:11,color:C.muted,flex:1,fontStyle:"italic"}}>Nessuna nota</span>
                    }
                    <button onClick={() => openNote(slug)}
                      style={{background:"none",border:"1px solid "+C.border,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:FONT,color:C.muted,flexShrink:0}}>
                      {nota ? "Modifica" : "Aggiungi"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Criticità */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:18,marginBottom:18}}>
        <SectionHead icon={<Zap size={14} style={{color:C.magenta}}/>} label="Criticità attive" count={crits.length} />
        {!crits.length ? (
          <div style={{textAlign:"center",padding:14,color:C.verde,fontSize:13,fontWeight:700}}>✅ Tutto in ordine. Nessuna criticità.</div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {crits.map((cr, i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:7,
                background:cr.stato==="check"?"#E3F2FD":"#FFF3E0",
                border:"1px solid "+(cr.stato==="check"?"#BBDEFB":"#FFE0B2")}}>
                <span style={{fontSize:14,flexShrink:0}}>{cr.faseEmoji}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700}}>{cr.nome}</div>
                  <div style={{fontSize:11,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cr.modulo}</div>
                </div>
                <div style={{flexShrink:0,textAlign:"right"}}>
                  <Badge stato={cr.stato} />
                  <div style={{fontSize:9,color:C.muted,marginTop:3}}>{cr.fase}</div>
                </div>
                <button onClick={() => nav("/admin/"+cr.slug)}
                  style={{background:"none",border:"1px solid "+C.border,borderRadius:4,padding:"3px 8px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT,color:C.testo,flexShrink:0}}>
                  →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lineup */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:18,marginBottom:18}}>
        <SectionHead icon={<Flag size={14} style={{color:C.blu}}/>} label="Lineup pubblicazioni" count={lineup.length} />
        {!lineup.length ? (
          <div style={{textAlign:"center",padding:16,color:C.muted,fontSize:13}}>Nessuna pubblicazione in programma.</div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {lineup.slice(0, 12).map((item, i) => {
              const pil = PIATTAFORME[item.piattaforma];
              const colMap = { idea:{hbg:"#FFF8E1",htx:"#795548",emoji:"💡",label:"Idea"}, brief:{hbg:"#E3F2FD",htx:"#1565C0",emoji:"📝",label:"Brief"}, produzione:{hbg:"#FFF3E0",htx:"#E65100",emoji:"✏️",label:"Produzione"}, semaforo:{hbg:"#FFFDE7",htx:"#F57F17",emoji:"🚦",label:"Semaforo"} };
              const col = colMap[item.stato] || { hbg:"#F5F5F5", htx:"#6B6B6B", emoji:"", label:item.stato };
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:C.sfondo,borderRadius:7,border:"1px solid "+C.border}}>
                  <div style={{width:44,flexShrink:0,textAlign:"center"}}>
                    <div style={{fontSize:12,fontWeight:800,color:C.testo}}>{fmtData(item.data)}</div>
                  </div>
                  <div style={{width:1,height:26,background:C.border,flexShrink:0}} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.titolo}</div>
                    <div style={{fontSize:10,color:C.muted}}>{item.clienteNome}</div>
                  </div>
                  {pil && <span style={{background:pil.color,color:"#fff",padding:"1px 6px",borderRadius:3,fontSize:9,fontWeight:700,flexShrink:0}}>{pil.label}</span>}
                  <span style={{background:col.hbg,color:col.htx,padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:700,flexShrink:0}}>{col.emoji} {col.label}</span>
                </div>
              );
            })}
            {lineup.length > 12 && <div style={{textAlign:"center",fontSize:11,color:C.muted,padding:"4px 0"}}>+{lineup.length-12} altri in pipeline</div>}
          </div>
        )}
      </div>

      {/* Note modal */}
      {editNote && (
        <div onClick={() => setEditNote(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,padding:24,maxWidth:420,width:"100%"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <StickyNote size={16} style={{color:C.verde}} />
              <h3 style={{margin:0,fontSize:14,fontWeight:700}}>Note — {clientMap[editNote]?.nome}</h3>
            </div>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={5} autoFocus
              placeholder="Appunti interni, follow-up, alert, prossime azioni..."
              style={{width:"100%",boxSizing:"border-box",border:"1px solid "+C.border,borderRadius:7,padding:"10px 12px",fontSize:13,fontFamily:FONT,resize:"vertical",lineHeight:1.6}} />
            <div style={{display:"flex",gap:10,marginTop:14}}>
              <button onClick={() => setEditNote(null)} style={{flex:1,border:"1px solid "+C.border,background:C.white,borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Annulla</button>
              <button onClick={saveNote} disabled={savingNote} style={{flex:1,background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
                {savingNote ? "Salvataggio..." : "Salva nota"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  SETUP ONE-SHOT                                              */
/* ─────────────────────────────────────────────────────────── */
/* helper: normalizza assegnati a array */
function toMemberArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

function MultiMemberPicker({ modId, assignedIds, members, onToggle }) {
  const [open, setOpen] = useState(false);
  const ids = assignedIds || [];
  return (
    <div style={{position:"relative",display:"inline-flex",alignItems:"center",gap:3}}>
      {/* avatars */}
      {ids.slice(0,3).map(mid => {
        const m = members.find(x=>x.id===mid);
        if (!m) return null;
        return (
          <div key={mid} title={m.nome} style={{width:20,height:20,borderRadius:"50%",background:m.colore,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:"#fff",fontWeight:800,fontSize:8}}>{m.nome[0]}</span>
          </div>
        );
      })}
      {ids.length > 3 && <span style={{fontSize:9,color:C.muted}}>+{ids.length-3}</span>}
      <button onClick={e=>{e.stopPropagation();setOpen(v=>!v);}}
        style={{width:20,height:20,borderRadius:"50%",border:"1px dashed "+C.border,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Plus size={9} style={{color:C.muted}}/>
      </button>
      {open && (
        <div onClick={e=>e.stopPropagation()}
          style={{position:"absolute",top:"100%",left:0,zIndex:300,background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:8,boxShadow:"0 4px 16px rgba(0,0,0,.12)",minWidth:200,marginTop:4}}>
          {members.map(m => {
            const sel = ids.includes(m.id);
            return (
              <button key={m.id} onClick={()=>onToggle(m.id)}
                style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",width:"100%",background:sel?m.colore+"12":C.white,
                  border:"none",borderRadius:5,cursor:"pointer",fontFamily:FONT,marginBottom:2}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:m.colore,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{color:"#fff",fontWeight:800,fontSize:7}}>{m.nome[0]}</span>
                </div>
                <span style={{fontSize:11,flex:1,textAlign:"left",color:C.testo}}>{m.nome}</span>
                {sel && <Check size={10} style={{color:m.colore,flexShrink:0}}/>}
              </button>
            );
          })}
          <button onClick={()=>setOpen(false)} style={{marginTop:4,width:"100%",border:"none",background:"none",fontSize:10,color:C.muted,cursor:"pointer",fontFamily:FONT}}>chiudi</button>
        </div>
      )}
    </div>
  );
}

function SetupSection({ setup, isAdmin, onEdit, clienteSlug, members }) {
  const data = setup || { stato:"in-corso", importo:0, dataFirma:"", note:"", moduli:{}, assegnati:{} };
  const done  = SETUP_MODULI.filter(m => (data.moduli && data.moduli[m.id])==="completo").length;
  const perc  = Math.round(done / SETUP_MODULI.length * 100);
  const teamMembers = members || DEFAULT_MEMBERS;

  const statoSetup = {
    "non-avviato": { label:"Non avviato", bg:"#F5F5F5", tx:"#6B6B6B" },
    "in-corso":    { label:"In corso",    bg:"#FFF3E0", tx:"#E65100" },
    "completato":  { label:"Completato",  bg:"#E8F5E9", tx:"#1A8C3F" },
    "fatturato":   { label:"Fatturato",   bg:"#E3F2FD", tx:"#1565C0" },
  };
  const ss = statoSetup[data.stato] || statoSetup["in-corso"];

  function toggleMember(modId, memberId) {
    const cur = toMemberArray((data.assegnati||{})[modId]);
    const next = cur.includes(memberId) ? cur.filter(x=>x!==memberId) : [...cur, memberId];
    onEdit("assegna_setup_"+modId, next);
  }

  return (
    <div>
      {/* header card */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:18,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{width:42,height:42,background:"#FFF3E0",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>⚡</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:14}}>Setup Strategico One-Shot</div>
            <div style={{fontSize:11,color:C.muted}}>Fase di ingresso obbligatoria — pagamento anticipato</div>
          </div>
          <span style={{background:ss.bg,color:ss.tx,padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:700,flexShrink:0}}>{ss.label}</span>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:11,color:C.muted}}>Completamento checklist</span>
            <span style={{fontSize:12,fontWeight:700,color:perc===100?C.verde:C.arancio}}>{done}/{SETUP_MODULI.length} step · {perc}%</span>
          </div>
          <div style={{height:6,background:"#F0F0F0",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:perc+"%",background:perc===100?C.verde:"#FB8C00",borderRadius:3,transition:"width .4s"}} />
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{background:C.sfondo,borderRadius:7,padding:"8px 12px"}}>
            <div style={{fontSize:10,color:C.muted,marginBottom:2}}>Importo</div>
            {isAdmin ? (
              <input type="number" value={data.importo||""} placeholder="0"
                onChange={e => onEdit("importo", parseInt(e.target.value)||0)}
                style={{width:"100%",border:"none",background:"transparent",fontSize:14,fontWeight:700,fontFamily:FONT,color:C.testo,padding:0}} />
            ) : (
              <div style={{fontSize:14,fontWeight:700}}>€{(data.importo||0).toLocaleString("it-IT")}</div>
            )}
          </div>
          <div style={{background:C.sfondo,borderRadius:7,padding:"8px 12px"}}>
            <div style={{fontSize:10,color:C.muted,marginBottom:2}}>Data firma</div>
            {isAdmin ? (
              <input type="date" value={data.dataFirma||""}
                onChange={e => onEdit("dataFirma", e.target.value)}
                style={{width:"100%",border:"none",background:"transparent",fontSize:13,fontFamily:FONT,color:C.testo,padding:0}} />
            ) : (
              <div style={{fontSize:13,fontWeight:600}}>{data.dataFirma || "—"}</div>
            )}
          </div>
        </div>
        {isAdmin && (
          <div style={{marginTop:10}}>
            <div style={{fontSize:10,color:C.muted,marginBottom:4}}>Stato Setup</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {Object.entries(statoSetup).map(([k,v]) => (
                <button key={k} onClick={() => onEdit("stato", k)}
                  style={{padding:"4px 10px",borderRadius:5,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT,
                    border:"1px solid "+(data.stato===k?v.tx:C.border),
                    background:data.stato===k?v.bg:C.white,color:data.stato===k?v.tx:C.muted}}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* checklist */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:16,marginBottom:14}}>
        {/* colonne header */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 110px 90px 100px",gap:8,marginBottom:8,padding:"0 10px"}}>
          <span style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Step</span>
          <span style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Membri</span>
          <span style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>🗓 Pianifica</span>
          <span style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Stato</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {SETUP_MODULI.map(mod => {
            const stato   = (data.moduli && data.moduli[mod.id]) || "da-fare";
            const isDone  = stato === "completo";
            const assigned = toMemberArray((data.assegnati||{})[mod.id]);
            return (
              <div key={mod.id}
                style={{display:"grid",gridTemplateColumns:"1fr 110px 90px 100px",gap:8,
                  alignItems:"center",padding:"8px 10px",borderRadius:7,
                  background:isDone?"#F1FAF4":C.sfondo}}>
                {/* step */}
                <div style={{display:"flex",alignItems:"center",gap:7,minWidth:0}}>
                  <span style={{fontSize:15,flexShrink:0}}>{mod.tag}</span>
                  <span style={{fontSize:12,color:isDone?C.verde:C.testo,fontWeight:isDone?700:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mod.nome}</span>
                </div>
                {/* membri multi-assign */}
                <div style={{display:"flex",alignItems:"center"}}>
                  {isAdmin ? (
                    <MultiMemberPicker
                      modId={mod.id}
                      assignedIds={assigned}
                      members={teamMembers}
                      onToggle={mid => toggleMember(mod.id, mid)}
                    />
                  ) : (
                    <div style={{display:"flex",gap:3}}>
                      {assigned.map(mid => {
                        const m = teamMembers.find(x=>x.id===mid);
                        if (!m) return null;
                        return (
                          <div key={mid} title={m.nome} style={{width:20,height:20,borderRadius:"50%",background:m.colore,display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <span style={{color:"#fff",fontWeight:800,fontSize:8}}>{m.nome[0]}</span>
                          </div>
                        );
                      })}
                      {!assigned.length && <span style={{fontSize:10,color:C.border}}>—</span>}
                    </div>
                  )}
                </div>
                {/* pianifica */}
                <div>
                  {clienteSlug ? (
                    <ScheduleButton
                      clienteSlug={clienteSlug}
                      fonte={{tipo:"setup", refId:"setup_"+mod.id, refLabel:mod.nome}}
                      titolo={mod.nome}
                      members={teamMembers}
                    />
                  ) : <span style={{fontSize:10,color:C.border}}>—</span>}
                </div>
                {/* stato */}
                <div>
                  {isAdmin ? (
                    <select value={stato} onChange={e => onEdit("modulo_"+mod.id, e.target.value)}
                      style={{fontSize:11,border:"1px solid "+C.border,borderRadius:5,padding:"3px 6px",cursor:"pointer",fontFamily:FONT,background:C.white,width:"100%"}}>
                      <option value="da-fare">Da fare</option>
                      <option value="in-corso">In corso</option>
                      <option value="completo">Completato</option>
                    </select>
                  ) : (
                    <span style={{fontSize:11,fontWeight:700}}>{isDone?"✅ Completato":"⬜ Da fare"}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* note */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:16}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:8}}>Note Setup</div>
        {isAdmin ? (
          <textarea value={data.note||""} onChange={e => onEdit("note", e.target.value)} rows={3}
            placeholder="Annotazioni, materiali ricevuti, follow-up..."
            style={{width:"100%",boxSizing:"border-box",border:"1px solid "+C.border,borderRadius:6,padding:"8px 10px",fontSize:12,fontFamily:FONT,resize:"vertical",lineHeight:1.6}} />
        ) : (
          <p style={{margin:0,fontSize:12,color:data.note?C.testo:C.muted,fontStyle:data.note?"normal":"italic",lineHeight:1.6}}>
            {data.note || "Nessuna nota"}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  SCHEDULE BUTTON — pianifica task dal contesto              */
/* ─────────────────────────────────────────────────────────── */
function ScheduleButton({ clienteSlug, fonte, titolo, members, onScheduled }) {
  const [open,    setOpen]    = useState(false);
  const [dateISO, setDateISO] = useState(fmtDateISO(new Date()));
  const [memberId,setMemberId]= useState("");
  const [ore,     setOre]     = useState(2);
  const [saving,  setSaving]  = useState(false);
  const [tasks,   setTasks]   = useState([]);

  useEffect(() => {
    if (open && fonte && fonte.refId) {
      getTasksForRef(clienteSlug, fonte.refId).then(setTasks);
    }
  }, [open, clienteSlug, fonte]);

  async function schedule() {
    if (!memberId || !dateISO) return;
    setSaving(true);
    const mem = (members || DEFAULT_MEMBERS).find(m => m.id === memberId);
    const task = {
      id: "tk" + Date.now(),
      memberId, dateISO,
      titolo,
      clienteSlug,
      ore,
      colore: mem ? mem.colore : TASK_COLORS[0],
      note: "",
      fonte: { ...fonte, clienteSlug },
    };
    await scheduleTask(task);
    const updated = await getTasksForRef(clienteSlug, fonte.refId);
    setTasks(updated);
    setSaving(false);
    if (onScheduled) onScheduled(task);
  }

  async function remove(t) {
    await unscheduleByRef(clienteSlug, fonte.refId);
    setTasks([]);
  }

  const inp3 = {border:"1px solid "+C.border,borderRadius:5,padding:"5px 8px",fontSize:12,fontFamily:FONT};

  return (
    <div style={{position:"relative",display:"inline-flex"}}>
      <button onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        title="Pianifica nel Team Planner"
        style={{background:tasks.length>0?C.verde+"18":"none",border:"1px solid "+(tasks.length>0?C.verde:C.border),
          borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:FONT,
          color:tasks.length>0?C.verde:C.muted,display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
        🗓 {tasks.length > 0 ? tasks.length + " task" : "Pianifica"}
      </button>

      {open && (
        <div onClick={e => e.stopPropagation()}
          style={{position:"absolute",top:"100%",right:0,zIndex:500,background:C.white,border:"1px solid "+C.border,
            borderRadius:10,padding:16,boxShadow:"0 4px 20px rgba(0,0,0,.13)",minWidth:280,marginTop:4}}>

          <div style={{fontWeight:700,fontSize:12,marginBottom:10,color:C.testo}}>{titolo}</div>

          {/* task già pianificati */}
          {tasks.length > 0 && (
            <div style={{marginBottom:10}}>
              {tasks.map(t => {
                const mem = (members||DEFAULT_MEMBERS).find(m => m.id===t.memberId);
                return (
                  <div key={t.id} style={{background:C.sfondo,borderRadius:6,padding:"6px 9px",marginBottom:5,display:"flex",alignItems:"center",gap:7}}>
                    {mem && <div style={{width:18,height:18,borderRadius:"50%",background:mem.colore,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontSize:7,fontWeight:800}}>{mem.nome[0]}</span></div>}
                    <span style={{fontSize:11,flex:1}}>{mem?mem.nome.split(" ")[0]:"?"} · {t.dateISO} · {t.ore}h</span>
                    <button onClick={() => remove(t)} style={{background:"none",border:"none",cursor:"pointer",color:C.magenta,padding:0}}><X size={10}/></button>
                  </div>
                );
              })}
            </div>
          )}

          {/* form nuovo */}
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              <div>
                <label style={{fontSize:10,fontWeight:700,display:"block",marginBottom:2}}>Data</label>
                <input type="date" value={dateISO} onChange={e => setDateISO(e.target.value)} style={inp3}/>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:700,display:"block",marginBottom:2}}>Ore</label>
                <input type="number" min={0.5} max={16} step={0.5} value={ore} onChange={e => setOre(parseFloat(e.target.value)||1)} style={inp3}/>
              </div>
            </div>
            <div>
              <label style={{fontSize:10,fontWeight:700,display:"block",marginBottom:2}}>Membro team</label>
              <select value={memberId} onChange={e => setMemberId(e.target.value)} style={{...inp3,width:"100%",boxSizing:"border-box"}}>
                <option value="">— Seleziona —</option>
                {(members||DEFAULT_MEMBERS).map(m => <option key={m.id} value={m.id}>{m.nome} · {m.ruolo}</option>)}
              </select>
            </div>
            <button onClick={schedule} disabled={saving||!memberId||!dateISO}
              style={{background:C.verde,color:"#fff",border:"none",borderRadius:5,padding:"6px 0",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT,opacity:(!memberId||!dateISO)?0.5:1}}>
              {saving?"...":"+ Aggiungi al planner"}
            </button>
          </div>

          <button onClick={() => setOpen(false)} style={{marginTop:8,width:"100%",background:"none",border:"none",fontSize:10,color:C.muted,cursor:"pointer",fontFamily:FONT}}>chiudi</button>
        </div>
      )}
    </div>
  );
}


function MemberDot({ memberId, size, members }) {
  const m = (members || []).find(x => x.id === memberId);
  if (!m) return null;
  const sz = size || 20;
  return (
    <div title={m.nome + " · " + m.ruolo}
      style={{width:sz,height:sz,borderRadius:"50%",background:m.colore,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{color:"#fff",fontWeight:800,fontSize:Math.floor(sz*0.45)}}>{m.nome[0]}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  PROGRESS                                                    */
/* ─────────────────────────────────────────────────────────── */
function ProgressSection({ progress, isAdmin, onEdit, onOpenDocs, clienteSlug, members: teamMembers }) {
  const [open,        setOpen]        = useState({});
  const [localMembers,setLocalMembers]= useState([]);
  const [assignModal, setAssignModal] = useState(null);

  useEffect(() => {
    if (!teamMembers || teamMembers.length === 0) {
      store.get("team:members").then(m => setLocalMembers(m || DEFAULT_MEMBERS));
    }
  }, [teamMembers]);

  const membersToUse = (teamMembers && teamMembers.length > 0) ? teamMembers : (localMembers.length > 0 ? localMembers : DEFAULT_MEMBERS);

  if (!progress) return <Spinner />;

  function handleAssign(faseId, modId, memberId) {
    onEdit(faseId, "assegna_" + modId, memberId);
    setAssignModal(null);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {FASI.map(fase => {
        const fd     = progress[fase.id] || { percentuale:0, moduli:{}, assegnati:{} };
        const perc   = fd.percentuale || 0;
        const isOpen = open[fase.id];
        const assegnati = fd.assegnati || {};
        const faseMembers = [...new Set(fase.moduli.map(m => assegnati[m.id]).filter(Boolean))];

        return (
          <div key={fase.id} style={{border:"1px solid "+C.border,borderRadius:8,overflow:"hidden",background:C.white}}>
            <div onClick={() => setOpen(p => ({...p,[fase.id]:!p[fase.id]}))}
              style={{padding:"13px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <span style={{fontSize:18}}>{fase.emoji}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontWeight:700,fontSize:14}}>{fase.label}</span>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {faseMembers.length > 0 && (
                      <div style={{display:"flex",gap:2}}>
                        {faseMembers.slice(0,3).map(mid => (
                          <MemberDot key={mid} memberId={mid} size={17} members={membersToUse}/>
                        ))}
                        {faseMembers.length > 3 && <span style={{fontSize:9,color:C.muted,marginLeft:3}}>+{faseMembers.length-3}</span>}
                      </div>
                    )}
                    <span style={{fontSize:13,fontWeight:700,color:perc===100?C.verde:perc>0?"#E65100":C.muted}}>{perc}%</span>
                  </div>
                </div>
                <div style={{height:5,background:"#F0F0F0",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:perc+"%",background:perc===100?C.verde:perc>0?"#FB8C00":"#E0E0E0",borderRadius:3,transition:"width .4s"}} />
                </div>
              </div>
              <ChevronDown size={15} style={{color:C.muted,transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}} />
            </div>

            {isOpen && (
              <div style={{borderTop:"1px solid "+C.border,padding:"4px 12px 12px"}}>
                {/* header colonne */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 100px 90px 110px",gap:6,padding:"6px 8px 4px",marginBottom:2}}>
                  <span style={{fontSize:9,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Modulo</span>
                  <span style={{fontSize:9,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Membri</span>
                  <span style={{fontSize:9,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>🗓 Piano</span>
                  <span style={{fontSize:9,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Stato</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  {fase.moduli.map(mod => {
                    const stato       = (fd.moduli && fd.moduli[mod.id]) || "da-fare";
                    const assignedArr = toMemberArray(assegnati[mod.id]);
                    const isDocMod    = (mod.id === 1 || mod.id === 2);
                    return (
                      <div key={mod.id}
                        style={{display:"grid",gridTemplateColumns:"1fr 100px 90px 110px",gap:6,
                          alignItems:"center",padding:"7px 8px",borderRadius:6,
                          background:stato==="completo"?"#F1FAF4":C.sfondo}}>
                        {/* nome + doc */}
                        <div style={{display:"flex",alignItems:"center",gap:5,minWidth:0}}>
                          <span style={{fontSize:12,color:C.testo,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mod.nome}</span>
                          {isDocMod && onOpenDocs && (
                            <button onClick={e=>{e.stopPropagation();onOpenDocs();}}
                              style={{background:"none",border:"1px solid "+C.verde+"55",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700,color:C.verde,cursor:"pointer",fontFamily:FONT,flexShrink:0}}>
                              📄 Doc
                            </button>
                          )}
                        </div>
                        {/* multi-member */}
                        <div>
                          {isAdmin ? (
                            <MultiMemberPicker
                              modId={String(mod.id)}
                              assignedIds={assignedArr}
                              members={membersToUse}
                              onToggle={mid => {
                                const cur  = toMemberArray(assegnati[mod.id]);
                                const next = cur.includes(mid) ? cur.filter(x=>x!==mid) : [...cur, mid];
                                onEdit(fase.id, "assegna_"+mod.id, next);
                              }}
                            />
                          ) : (
                            <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
                              {assignedArr.map(mid => {
                                const m = membersToUse.find(x=>x.id===mid);
                                if (!m) return null;
                                return (
                                  <div key={mid} title={m.nome} style={{width:18,height:18,borderRadius:"50%",background:m.colore,display:"flex",alignItems:"center",justifyContent:"center"}}>
                                    <span style={{color:"#fff",fontWeight:800,fontSize:7}}>{m.nome[0]}</span>
                                  </div>
                                );
                              })}
                              {!assignedArr.length && <span style={{fontSize:9,color:C.border}}>—</span>}
                            </div>
                          )}
                        </div>
                        {/* pianifica */}
                        <div>
                          {clienteSlug ? (
                            <ScheduleButton
                              clienteSlug={clienteSlug}
                              fonte={{tipo:"progresso",refId:"prog_"+fase.id+"_"+mod.id,refLabel:fase.label+" · "+mod.nome}}
                              titolo={mod.nome}
                              members={membersToUse}
                            />
                          ) : <span/>}
                        </div>
                        {/* stato */}
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <Badge stato={stato}/>
                          {isAdmin && (
                            <select value={stato} onClick={e=>e.stopPropagation()} onChange={e=>onEdit(fase.id,mod.id,e.target.value)}
                              style={{fontSize:10,border:"1px solid "+C.border,borderRadius:4,padding:"2px 3px",cursor:"pointer",fontFamily:FONT,flexShrink:0}}>
                              {Object.entries(STATI_MODULO).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {assignModal && (
        <div onClick={() => setAssignModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:10,padding:20,maxWidth:300,width:"100%"}}>
            <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700}}>Assegna membro</h3>
            <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:240,overflowY:"auto"}}>
              <button onClick={() => handleAssign(assignModal.faseId, assignModal.modId, "")}
                style={{padding:"7px 10px",border:"1px solid "+C.border,borderRadius:6,background:C.white,fontSize:12,cursor:"pointer",fontFamily:FONT,textAlign:"left",color:C.muted}}>
                — Nessuno
              </button>
              {membersToUse.map(m => (
                <button key={m.id} onClick={() => handleAssign(assignModal.faseId, assignModal.modId, m.id)}
                  style={{padding:"7px 10px",border:"1px solid "+(assignModal.current===m.id?m.colore:C.border),borderRadius:6,
                    background:assignModal.current===m.id?m.colore+"15":C.white,
                    display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontFamily:FONT}}>
                  <MemberDot memberId={m.id} size={22} members={membersToUse}/>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.testo}}>{m.nome}</div>
                    <div style={{fontSize:10,color:C.muted}}>{m.ruolo}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setAssignModal(null)} style={{marginTop:10,width:"100%",border:"1px solid "+C.border,background:C.white,borderRadius:6,padding:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  FEED                                                        */
/* ─────────────────────────────────────────────────────────── */
function FeedSection({ feed }) {
  const [sel, setSel] = useState(null);
  if (!feed || !feed.length) {
    return (
      <div style={{textAlign:"center",padding:40,color:C.muted}}>
        <LayoutGrid size={28} style={{marginBottom:8,opacity:.3}} />
        <p style={{margin:0,fontSize:14}}>Nessun post nel feed</p>
      </div>
    );
  }
  return (
    <>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3}}>
        {feed.map(post => {
          const img = post.immagineUrl || post.immagineBase64;
          return (
            <div key={post.id} onClick={() => setSel(post)}
              style={{aspectRatio:"1",borderRadius:5,overflow:"hidden",cursor:"pointer",position:"relative",
                background:img?"transparent":"linear-gradient(135deg,"+(post.colori?.[0]||"#333")+","+(post.colori?.[1]||"#666")+")",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
              {img
                ? <img src={img} alt={post.titolo} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                : <span style={{color:"rgba(255,255,255,.65)",fontSize:10,textAlign:"center",padding:8,fontWeight:700}}>{post.titolo}</span>
              }
              <div style={{position:"absolute",bottom:4,right:4,background:"rgba(0,0,0,.55)",borderRadius:3,padding:"1px 5px"}}>
                <span style={{fontSize:9,color:"#fff"}}>{post.stato==="pubblicato"?"●":post.stato==="approvato"?"◑":"○"}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:12,display:"flex",gap:12,justifyContent:"center"}}>
        {[["pubblicato","●"],["approvato","◑"],["bozza","○"]].map(([s, dot]) => (
          <span key={s} style={{fontSize:11,color:C.muted}}><span style={{marginRight:4}}>{dot}</span>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
        ))}
      </div>
      {sel && (
        <div onClick={() => setSel(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,overflow:"hidden",maxWidth:440,width:"100%",maxHeight:"88vh",overflowY:"auto"}}>
            <div style={{aspectRatio:"1",background:"linear-gradient(135deg,"+(sel.colori?.[0]||"#333")+","+(sel.colori?.[1]||"#666")+")",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              {sel.immagineUrl||sel.immagineBase64
                ? <img src={sel.immagineUrl||sel.immagineBase64} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                : <span style={{color:"rgba(255,255,255,.8)",fontSize:22,fontWeight:700,textAlign:"center",padding:24}}>{sel.titolo}</span>
              }
              <button onClick={() => setSel(null)} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,.5)",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <X size={15} />
              </button>
            </div>
            <div style={{padding:20}}>
              <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
                <PTag p={sel.piattaforma} /><Badge stato={sel.stato} />
                <span style={{fontSize:12,color:C.muted,marginLeft:"auto"}}>{sel.data}</span>
              </div>
              <p style={{fontSize:14,color:C.testo,lineHeight:1.65,whiteSpace:"pre-line",margin:0}}>{sel.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  CALENDAR — vista puntini + vista griglia con anteprima     */
/* ─────────────────────────────────────────────────────────── */
function CalendarSection({ ped, feed, mese, onMeseChange }) {
  const [view,    setView]    = useState("dots");    // "dots" | "grid"
  const [selDay,  setSelDay]  = useState(null);
  const [filtro,  setFiltro]  = useState(null);      // piattaforma o pilastro
  const [filtroT, setFiltroT] = useState("piatt");   // "piatt" | "pilastro"
  const [tooltip, setTooltip] = useState(null);
  const [selPost, setSelPost] = useState(null);      // post aperto in modale griglia

  const pts = mese.split("-").map(Number);
  const y = pts[0]; const m = pts[1];
  const first   = (new Date(y, m-1, 1).getDay() + 6) % 7;
  const days    = new Date(y, m, 0).getDate();
  const label   = new Date(y, m-1, 1).toLocaleString("it-IT", {month:"long",year:"numeric"});

  // Merge feed posts (approvato) into calendar — one entry per platform
  const feedForCal = (feed||[])
    .filter(p => p.stato === "approvato" && p.data && p.data.startsWith(mese))
    .flatMap(p => {
      const plats = Array.isArray(p.piattaforme) && p.piattaforme.length
        ? p.piattaforme
        : [(p.piattaforma || "instagram")];
      return plats.map(plat => ({
        ...p,
        _fromFeed: true,
        id: p.id + "_" + plat,   // unique id per entry
        piattaforma: plat,
      }));
    });
  const combined = [...ped, ...feedForCal];

  // filtro
  const filtred = filtro
    ? filtroT==="piatt"
      ? combined.filter(p => p.piattaforma===filtro)
      : combined.filter(p => p.pilastro===filtro)
    : combined;

  const byDay = {};
  filtred.forEach(p => {
    const d = parseInt(p.data.split("-")[2]);
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(p);
  });

  function prev() { const d=new Date(y,m-2,1); onMeseChange(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")); }
  function next() { const d=new Date(y,m,1);   onMeseChange(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")); }

  function showTip(e, post) {
    e.stopPropagation();
    setTooltip({ post, cx:e.clientX, cy:e.clientY });
  }

  // colore del post: prima pilastro, poi piattaforma come fallback
  function postColor(post) {
    if (post.pilastro && PILASTRI[post.pilastro]) return PILASTRI[post.pilastro].color;
    return PIATTAFORME[post.piattaforma]?.color || "#999";
  }
  function postBg(post) {
    if (post.pilastro && PILASTRI[post.pilastro]) return PILASTRI[post.pilastro].bg;
    return "#F5F5F5";
  }

  const bb = {fontSize:11,padding:"3px 9px",borderRadius:20,border:"1px solid "+C.border,cursor:"pointer",fontWeight:700,fontFamily:FONT};
  const vb = {fontSize:11,padding:"4px 10px",borderRadius:6,border:"1px solid "+C.border,cursor:"pointer",fontWeight:700,fontFamily:FONT};

  // ─── vista puntini (classica) ──────────────────────────────
  function ViewDots() {
    return (
      <div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:10}}>
          {["Lun","Mar","Mer","Gio","Ven","Sab","Dom"].map(g => (
            <div key={g} style={{textAlign:"center",fontSize:10,fontWeight:700,color:C.muted,padding:"4px 0"}}>{g}</div>
          ))}
          {Array.from({length:first}, (_,i) => <div key={"e"+i} />)}
          {Array.from({length:days}, (_,i) => {
            const d     = i+1;
            const posts = byDay[d] || [];
            const isSel = selDay===d;
            return (
              <div key={d} onClick={() => setSelDay(isSel?null:d)}
                style={{padding:"6px 2px",textAlign:"center",borderRadius:6,cursor:"pointer",
                  background:isSel?C.verde:"transparent",border:"1px solid "+(isSel?C.verde:"transparent")}}>
                <div style={{fontSize:12,color:isSel?"#fff":C.testo,marginBottom:3}}>{d}</div>
                <div style={{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap"}}>
                  {posts.slice(0,3).map((post,idx) => (
                    <div key={idx}
                      onMouseEnter={e => showTip(e, post)}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={e => e.stopPropagation()}
                      onMouseOver={e => { e.currentTarget.style.transform="scale(1.7)"; }}
                      onMouseOut={e => { e.currentTarget.style.transform="scale(1)"; }}
                      style={{width:7,height:7,borderRadius:"50%",background:postColor(post),cursor:"pointer",transition:"transform .15s"}}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {selDay && byDay[selDay] && (
          <div style={{background:C.sfondo,borderRadius:8,padding:12}}>
            <p style={{margin:"0 0 10px",fontSize:13,fontWeight:700}}>{selDay} {label}</p>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {byDay[selDay].map(post => {
                const pil = post.pilastro ? PILASTRI[post.pilastro] : null;
                return (
                  <div key={post.id} style={{background:C.white,borderRadius:6,padding:10,display:"flex",alignItems:"center",gap:10}}>
                    {pil && <span style={{background:pil.bg,color:pil.color,padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:700,flexShrink:0}}>{pil.label}</span>}
                    <PTag p={post.piattaforma} />
                    <span style={{flex:1,fontSize:13}}>{post.titolo}</span>
                    <Badge stato={post.stato} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── vista griglia (anteprima immagini) ───────────────────
  function ViewGrid() {
    // tutti i post del mese ordinati per data
    const allPosts = [...filtred].sort((a,b) => a.data.localeCompare(b.data));
    return (
      <div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
          {!allPosts.length && (
            <div style={{gridColumn:"span 3",textAlign:"center",padding:32,color:C.muted,fontSize:13}}>Nessun contenuto per questo mese</div>
          )}
          {allPosts.map(post => {
            const pil    = post.pilastro ? PILASTRI[post.pilastro] : null;
            const pilCol = pil ? pil.color : "#999";
            const img    = post.immagineUrl || post.immagineBase64;
            const dateStr = post.data ? post.data.split("-")[2]+"/"+post.data.split("-")[1] : "";
            return (
              <div key={post.id} onClick={() => setSelPost(post)}
                style={{borderRadius:8,overflow:"hidden",cursor:"pointer",position:"relative",
                  border:"2px solid "+pilCol,boxShadow:"0 1px 6px rgba(0,0,0,.08)"}}>
                {/* immagine o gradient */}
                <div style={{aspectRatio:"1",
                  background:img?"transparent":"linear-gradient(135deg,"+(post.colori?.[0]||pilCol)+" 0%,"+(post.colori?.[1]||pilCol+"99")+" 100%)",
                  display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                  {img && <img src={img} alt={post.titolo} style={{width:"100%",height:"100%",objectFit:"cover"}} />}
                  {!img && <span style={{color:"rgba(255,255,255,.8)",fontSize:10,fontWeight:700,textAlign:"center",padding:"4px 6px",lineHeight:1.3}}>{post.titolo}</span>}
                  {/* overlay bottom */}
                  <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,.55)",padding:"12px 6px 5px",display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
                    <span style={{color:"#fff",fontSize:9,fontWeight:700,opacity:.9}}>{dateStr}</span>
                    <span style={{fontSize:9,color:"#fff"}}>{post.stato==="pubblicato"?"●":post.stato==="approvato"?"◑":"○"}</span>
                  </div>
                </div>
                {/* pilastro strip */}
                {pil && (
                  <div style={{background:pil.bg,padding:"3px 6px",display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:pil.color,flexShrink:0}} />
                    <span style={{fontSize:9,fontWeight:700,color:pil.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pil.label}</span>
                    <span style={{marginLeft:"auto",fontSize:9,color:C.muted}}>{PIATTAFORME[post.piattaforma]?.label||post.piattaforma}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* modale anteprima griglia */}
        {selPost && (
          <div onClick={() => setSelPost(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
            <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,overflow:"hidden",maxWidth:420,width:"100%",maxHeight:"88vh",overflowY:"auto"}}>
              {/* preview */}
              <div style={{aspectRatio:"1",position:"relative",
                background:"linear-gradient(135deg,"+(selPost.colori?.[0]||"#333")+","+(selPost.colori?.[1]||"#666")+")",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                {(selPost.immagineUrl||selPost.immagineBase64) && (
                  <img src={selPost.immagineUrl||selPost.immagineBase64} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                )}
                {!(selPost.immagineUrl||selPost.immagineBase64) && (
                  <span style={{color:"rgba(255,255,255,.85)",fontSize:20,fontWeight:700,textAlign:"center",padding:24}}>{selPost.titolo}</span>
                )}
                <button onClick={() => setSelPost(null)} style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,.5)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <X size={13} />
                </button>
              </div>
              {/* info */}
              <div style={{padding:18}}>
                {selPost.pilastro && PILASTRI[selPost.pilastro] && (
                  <div style={{background:PILASTRI[selPost.pilastro].bg,color:PILASTRI[selPost.pilastro].color,padding:"4px 10px",borderRadius:5,fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:5,marginBottom:10}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:PILASTRI[selPost.pilastro].color}} />
                    {PILASTRI[selPost.pilastro].label}
                  </div>
                )}
                <div style={{display:"flex",gap:7,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
                  <PTag p={selPost.piattaforma} />
                  <Badge stato={selPost.stato} />
                  <span style={{fontSize:11,color:C.muted,marginLeft:"auto"}}>{selPost.data}</span>
                </div>
                <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700}}>{selPost.titolo}</h3>
                {selPost.caption && <p style={{margin:0,fontSize:13,color:C.testo,lineHeight:1.65,whiteSpace:"pre-line"}}>{selPost.caption}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div onClick={() => setTooltip(null)}>
      {/* nav mese + toggle vista */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <button onClick={prev} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"5px 9px",cursor:"pointer"}}><ChevronLeft size={15} /></button>
        <span style={{fontWeight:700,fontSize:15,textTransform:"capitalize"}}>{label}</span>
        <button onClick={next} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"5px 9px",cursor:"pointer"}}><ChevronRight size={15} /></button>
      </div>

      {/* switch tipo filtro + vista */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,gap:8}}>
        <div style={{display:"flex",gap:4}}>
          <button onClick={() => setFiltroT("piatt")} style={{...bb,background:filtroT==="piatt"?C.testo:C.white,color:filtroT==="piatt"?"#fff":C.testo}}>Piattaforma</button>
          <button onClick={() => setFiltroT("pilastro")} style={{...bb,background:filtroT==="pilastro"?C.testo:C.white,color:filtroT==="pilastro"?"#fff":C.testo}}>Pilastro</button>
        </div>
        <div style={{display:"flex",gap:4}}>
          <button onClick={() => setView("dots")} style={{...vb,background:view==="dots"?C.testo:C.white,color:view==="dots"?"#fff":C.testo}}>📅</button>
          <button onClick={() => setView("grid")} style={{...vb,background:view==="grid"?C.testo:C.white,color:view==="grid"?"#fff":C.testo}}>⊞</button>
        </div>
      </div>

      {/* filtri */}
      <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
        <button onClick={() => setFiltro(null)} style={{...bb,background:!filtro?C.verde:C.white,color:!filtro?"#fff":C.testo}}>Tutti</button>
        {filtroT==="piatt"
          ? Object.entries(PIATTAFORME).map(([k,p]) => (
              <button key={k} onClick={() => setFiltro(filtro===k?null:k)} style={{...bb,background:filtro===k?p.color:C.white,color:filtro===k?"#fff":C.testo}}>{p.label}</button>
            ))
          : Object.entries(PILASTRI).map(([k,p]) => (
              <button key={k} onClick={() => setFiltro(filtro===k?null:k)} style={{...bb,background:filtro===k?p.color:C.white,color:filtro===k?"#fff":C.testo,border:"1px solid "+(filtro===k?"transparent":p.color+"66")}}>{p.label}</button>
            ))
        }
      </div>

      {/* vista selezionata */}
      {view==="dots" ? <ViewDots /> : <ViewGrid />}

      {/* Tooltip hover (solo vista dots) */}
      {tooltip && view==="dots" && (
        <div style={{position:"fixed",left:tooltip.cx+14,top:tooltip.cy-10,zIndex:9999,
          background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:"10px 12px",
          boxShadow:"0 4px 16px rgba(0,0,0,.14)",minWidth:190,maxWidth:250,pointerEvents:"none"}}>
          {tooltip.post.pilastro && PILASTRI[tooltip.post.pilastro] && (
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:PILASTRI[tooltip.post.pilastro].color}} />
              <span style={{fontSize:10,fontWeight:700,color:PILASTRI[tooltip.post.pilastro].color}}>{PILASTRI[tooltip.post.pilastro].label}</span>
            </div>
          )}
          <div style={{fontWeight:700,fontSize:12,color:C.testo,marginBottom:5,lineHeight:1.3}}>{tooltip.post.titolo}</div>
          <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap",marginBottom:5}}>
            <PTag p={tooltip.post.piattaforma} />
            <Badge stato={tooltip.post.stato} />
          </div>
          {tooltip.post.memberId && (
            <MemberDot memberId={tooltip.post.memberId} size={18} members={[...DEFAULT_MEMBERS]}/>
          )}
          <div style={{fontSize:10,color:C.muted,marginTop:4}}>{tooltip.post.data}</div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  DOCS                                                        */
/* ─────────────────────────────────────────────────────────── */
/* helper: rileva la sorgente da URL */
function detectSource(url) {
  if (!url) return "interno";
  if (url.includes("dropbox.com/paper") || url.includes("paper.dropbox")) return "paper";
  if (url.includes("dropbox.com")) return "dropbox";
  if (url.includes("docs.google.com") || url.includes("drive.google.com")) return "drive";
  return "link";
}

const SOURCE_META = {
  interno:  { label:"Documento interno", icon:"📝", color:"#1A8C3F",  bg:"#E8F5E9" },
  paper:    { label:"Dropbox Paper",      icon:"📄", color:"#0061FF",  bg:"#E3F0FF" },
  dropbox:  { label:"Dropbox",            icon:"📦", color:"#0061FF",  bg:"#E3F0FF" },
  drive:    { label:"Google Drive",       icon:"🗂",  color:"#1565C0",  bg:"#E3F2FD" },
  link:     { label:"Link esterno",       icon:"🔗", color:"#6B6B6B",  bg:"#F5F5F5" },
};

function DocsSection({ docs }) {
  const [filtro,   setFiltro]   = useState(null);
  const [viewDoc,  setViewDoc]  = useState(null); // doc con contenuto interno

  if (!docs || !docs.length) {
    return (
      <div style={{textAlign:"center",padding:40,color:C.muted}}>
        <FileText size={28} style={{marginBottom:8,opacity:.3}} />
        <p style={{margin:0,fontSize:14}}>Nessun documento disponibile</p>
      </div>
    );
  }

  const filtred = filtro ? docs.filter(d => d.categoria===filtro) : docs;
  const bb = {fontSize:11,padding:"3px 10px",borderRadius:20,border:"1px solid "+C.border,cursor:"pointer",fontWeight:700,fontFamily:FONT};

  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        <button onClick={() => setFiltro(null)} style={{...bb,background:!filtro?C.testo:C.white,color:!filtro?"#fff":C.testo}}>Tutti</button>
        {Object.entries(DOC_CAT).map(([k, cat]) => (
          <button key={k} onClick={() => setFiltro(filtro===k?null:k)} style={{...bb,background:filtro===k?cat.color:C.white,color:filtro===k?"#fff":C.testo}}>
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtred.map(doc => {
          const cat    = DOC_CAT[doc.categoria] || DOC_CAT.brand;
          const src    = SOURCE_META[doc.sorgente || detectSource(doc.url)];
          const isInt  = (doc.sorgente === "interno");
          return (
            <div key={doc.id} style={{border:"1px solid "+C.border,borderRadius:8,padding:"12px 16px",background:C.white,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:38,height:38,background:src.bg,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>
                {src.icon}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.nome}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{background:cat.color+"22",color:cat.color,padding:"1px 6px",borderRadius:3,fontSize:10,fontWeight:700}}>{cat.label}</span>
                  <span style={{background:src.bg,color:src.color,padding:"1px 6px",borderRadius:3,fontSize:10,fontWeight:700}}>{src.label}</span>
                  {doc.data && <span style={{fontSize:10,color:C.muted}}>{doc.data}</span>}
                </div>
              </div>
              {isInt ? (
                <button onClick={() => setViewDoc(doc)}
                  style={{color:C.verde,border:"1px solid "+C.verde+"44",borderRadius:5,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",background:"none",fontFamily:FONT,flexShrink:0}}>
                  Leggi
                </button>
              ) : (
                <a href={doc.url} target="_blank" rel="noreferrer"
                  style={{color:C.verde,display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,textDecoration:"none",flexShrink:0}}>
                  Apri <ExternalLink size={11} />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Viewer documento interno */}
      {viewDoc && (
        <div onClick={() => setViewDoc(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,width:"100%",maxWidth:620,maxHeight:"85vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>📝</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{viewDoc.nome}</div>
                <div style={{fontSize:10,color:C.muted}}>{viewDoc.data}</div>
              </div>
              <button onClick={() => setViewDoc(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.muted}}>
                <X size={16} />
              </button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
              <pre style={{margin:0,fontFamily:FONT,fontSize:13,color:C.testo,lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                {viewDoc.contenuto || "Documento vuoto."}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  PED LIST VIEW  (stile screenshot Planable)                  */
/* ─────────────────────────────────────────────────────────── */
function PedListView({ ped, mese, onMeseChange, isAdmin, onUpdate, onAdd, onDel, members, clienteSlug }) {
  const [filtPilastro, setFiltPilastro] = useState(null);
  const [editId,       setEditId]       = useState(null); // inline edit row

  const filtered = filtPilastro ? ped.filter(p => p.pilastro===filtPilastro) : ped;
  const sorted   = [...filtered].sort((a,b) => a.data.localeCompare(b.data));

  // stats
  const tot  = ped.length;
  const pub  = ped.filter(p => p.stato==="pubblicato").length;
  const prod = ped.filter(p => p.stato==="produzione").length;
  const rev  = ped.filter(p => p.stato==="semaforo").length;
  const df   = ped.filter(p => p.stato==="idea"||p.stato==="brief").length;

  function fmtD(s) {
    if (!s) return "";
    const pts = s.split("-");
    return parseInt(pts[2]) + "/" + parseInt(pts[1]);
  }

  function StatsBar() {
    return (
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:16}}>
        {[
          { label:"Totale",         val:tot,  color:C.testo },
          { label:"Pubblicati",     val:pub,  color:C.verde },
          { label:"In produzione",  val:prod, color:C.arancio },
          { label:"In revisione",   val:rev,  color:"#F57F17" },
          { label:"Da fare",        val:df,   color:C.muted },
        ].map(s => (
          <div key={s.label} style={{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:800,color:s.color,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:3}}>{s.label}</div>
          </div>
        ))}
      </div>
    );
  }

  const inp2 = {border:"1px solid "+C.border,borderRadius:4,padding:"3px 6px",fontSize:11,fontFamily:FONT};

  return (
    <div>
      {/* mese selector */}
      <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
        <input type="month" value={mese} onChange={e => onMeseChange(e.target.value)}
          style={{border:"1px solid "+C.border,borderRadius:6,padding:"6px 12px",fontSize:13,fontFamily:FONT}}/>
        {isAdmin && (
          <button onClick={onAdd} style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:FONT}}>
            <Plus size={12}/> Aggiungi
          </button>
        )}
      </div>

      <StatsBar/>

      {/* filtro pilastri */}
      <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:11,color:C.muted,fontWeight:700,marginRight:4}}>Pilastro:</span>
        <button onClick={() => setFiltPilastro(null)}
          style={{fontSize:11,padding:"3px 10px",borderRadius:20,border:"1px solid "+(filtPilastro?C.border:C.verde),cursor:"pointer",fontWeight:700,fontFamily:FONT,background:!filtPilastro?C.verde:C.white,color:!filtPilastro?"#fff":C.testo}}>
          Tutti
        </button>
        {Object.entries(PILASTRI).map(([k,p]) => (
          <button key={k} onClick={() => setFiltPilastro(filtPilastro===k?null:k)}
            style={{fontSize:11,padding:"3px 10px",borderRadius:20,border:"1px solid "+(filtPilastro===k?p.color:p.color+"55"),cursor:"pointer",fontWeight:700,fontFamily:FONT,background:filtPilastro===k?p.color:C.white,color:filtPilastro===k?"#fff":p.color}}>
            {p.label}
          </button>
        ))}
      </div>

      {/* tabella */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,overflow:"hidden"}}>
        {/* header */}
        <div style={{display:"grid",gridTemplateColumns:"50px 30px 1fr 80px 60px 80px 100px 90px",gap:0,
          padding:"8px 12px",background:C.sfondo,borderBottom:"1px solid "+C.border}}>
          {["DATA","","HOOK","FORMATO","PILASTRO","RUOLO","STATO",""].map((h,i) => (
            <span key={i} style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</span>
          ))}
        </div>

        {!sorted.length && (
          <div style={{padding:32,textAlign:"center",color:C.muted,fontSize:13}}>Nessun contenuto per questo mese</div>
        )}

        {sorted.map((post, i) => {
          const fmt     = FORMATI[post.formato] || FORMATI.post;
          const pilC    = post.pilastro && PILASTRI[post.pilastro] ? PILASTRI[post.pilastro] : null;
          const statoS  = STATI_PED[post.stato] || STATI_PED.idea;
          const mem     = members && post.memberId ? members.find(m => m.id===post.memberId) : null;
          const isEdit  = isAdmin && editId===post.id;
          const isEven  = i % 2 === 0;

          return (
            <div key={post.id}
              style={{display:"grid",gridTemplateColumns:"50px 30px 1fr 80px 60px 80px 100px 90px",gap:0,
                padding:"9px 12px",borderBottom:"1px solid "+C.sfondo,
                background:isEdit?"#F0FFF4":isEven?C.white:"#FAFAFA",
                alignItems:"center"}}>

              {/* DATA */}
              <span style={{fontSize:12,fontWeight:700,color:C.muted}}>{fmtD(post.data)}</span>

              {/* checkbox */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <input type="checkbox" readOnly checked={post.stato==="pubblicato"}
                  style={{width:14,height:14,accentColor:C.verde,cursor:"default"}}/>
              </div>

              {/* HOOK */}
              {isEdit ? (
                <input value={post.titolo||""} onChange={e => onUpdate(post.id,"titolo",e.target.value)}
                  style={{...inp2,width:"100%",boxSizing:"border-box"}} autoFocus/>
              ) : (
                <span style={{fontSize:12,color:C.testo,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:isAdmin?"pointer":"default"}}
                  onClick={() => isAdmin && setEditId(post.id)}>
                  {post.titolo || "—"}
                </span>
              )}

              {/* FORMATO */}
              {isEdit ? (
                <select value={post.formato||"post"} onChange={e => onUpdate(post.id,"formato",e.target.value)} style={inp2}>
                  {Object.entries(FORMATI).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              ) : (
                <span style={{background:fmt.bg,color:fmt.color,padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,display:"inline-block"}}>{fmt.label}</span>
              )}

              {/* PILASTRO — dot */}
              {isEdit ? (
                <select value={post.pilastro||""} onChange={e => onUpdate(post.id,"pilastro",e.target.value)} style={inp2}>
                  <option value="">—</option>
                  {Object.entries(PILASTRI).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              ) : (
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  {pilC && <div style={{width:10,height:10,borderRadius:"50%",background:pilC.color}} title={pilC.label}/>}
                </div>
              )}

              {/* RUOLO */}
              {isEdit ? (
                <select value={post.memberId||""} onChange={e => onUpdate(post.id,"memberId",e.target.value)} style={inp2}>
                  <option value="">—</option>
                  {DEFAULT_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.nome.split(" ")[0]}</option>)}
                </select>
              ) : (
                <span style={{fontSize:11,color:C.muted}}>{mem ? mem.nome.split(" ")[0] : "—"}</span>
              )}

              {/* STATO */}
              {isEdit ? (
                <select value={post.stato||"idea"} onChange={e => onUpdate(post.id,"stato",e.target.value)} style={inp2}>
                  {Object.entries(STATI_PED).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              ) : (
                <span style={{background:statoS.bg,color:statoS.tx,padding:"2px 7px",borderRadius:5,fontSize:10,fontWeight:700,display:"inline-block"}}>{statoS.label}</span>
              )}

              {/* actions */}
              <div style={{display:"flex",gap:3,justifyContent:"flex-end",alignItems:"center"}}>
                {clienteSlug && (
                  <ScheduleButton
                    clienteSlug={clienteSlug}
                    fonte={{tipo:"ped", refId:"ped_"+post.id, refLabel:post.titolo}}
                    titolo={post.titolo||"Contenuto"}
                    members={members}
                  />
                )}
                {isAdmin && (
                  isEdit ? (
                    <button onClick={() => setEditId(null)} style={{background:C.verde,border:"none",borderRadius:3,padding:"2px 6px",cursor:"pointer",color:"#fff",fontSize:10,fontFamily:FONT}}>✓</button>
                  ) : (
                    <button onClick={() => onDel(post.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.magenta,padding:2}}><Trash2 size={11}/></button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function kanbanFmtData(s) {
  if (!s) return "";
  const pts = s.split("-");
  return pts[2] + "/" + pts[1];
}

function KanbanCard({ post, col, members }) {
  const pil = PIATTAFORME[post.piattaforma];
  const mem = members && post.memberId ? members.find(m => m.id===post.memberId) : null;
  const pilC = post.pilastro && PILASTRI[post.pilastro] ? PILASTRI[post.pilastro] : null;
  return (
    <div style={{background:C.white,borderRadius:7,padding:"9px 10px",border:"1px solid "+C.border,
      borderLeft:"3px solid "+(pilC?pilC.color:col.htx),boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
      <div style={{fontSize:12,fontWeight:700,color:C.testo,marginBottom:6,lineHeight:1.35}}>{post.titolo}</div>
      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
        {pil && <span style={{background:pil.color,color:"#fff",padding:"1px 5px",borderRadius:3,fontSize:9,fontWeight:700}}>{pil.label}</span>}
        {pilC && <span style={{background:pilC.bg,color:pilC.color,padding:"1px 5px",borderRadius:3,fontSize:9,fontWeight:700}}>{pilC.label}</span>}
        {post.data && <span style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{kanbanFmtData(post.data)}</span>}
        {mem && (
          <div title={mem.nome} style={{width:16,height:16,borderRadius:"50%",background:mem.colore,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:"#fff",fontWeight:800,fontSize:7}}>{mem.nome[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanSection({ ped, feed, mese, onMeseChange }) {
  const [kView,   setKView]   = useState("board"); // "board" | "list"
  const [members, setMembers] = useState([]);

  useEffect(() => {
    store.get("team:members").then(m => setMembers(m || DEFAULT_MEMBERS));
  }, []);

  if (!ped) return <Spinner />;

  // Map feed stati to kanban columns:
  // bozza → idea, non-approvato → semaforo, pubblicato → pubblicato
  // approvato → NOT shown in kanban (shown in calendar)
  const feedForKan = (feed||[])
    .filter(p => p.stato !== "approvato")  // approvato goes to calendar only
    .map(p => ({
      ...p,
      _fromFeed: true,
      piattaforma: (Array.isArray(p.piattaforme) ? p.piattaforme[0] : p.piattaforma) || "instagram",
      stato: p.stato === "bozza" ? "bozza"
           : p.stato === "non-approvato" ? "non-approvato"
           : p.stato === "pubblicato" ? "pubblicato"
           : "bozza",
    }));

  const ALL_STATES = [...Object.keys(PIPELINE_COLS), "non-approvato", "pubblicato", "feed"];

  const byCol = {};
  ALL_STATES.forEach(k => { byCol[k] = []; });

  // PED items
  ped.forEach(p => {
    if (byCol[p.stato] !== undefined) byCol[p.stato].push(p);
    else byCol["idea"].push(p);
  });

  // Feed items mapped to their columns
  feedForKan.forEach(p => {
    const col = p.stato === "pubblicato" ? "pubblicato"
              : p.stato === "non-approvato" ? "semaforo"
              : "idea";
    byCol[col].push(p);
  });

  const allCols = { ...PIPELINE_COLS, pubblicato: PUBBLICATO_COL, feed: FEED_COL };
  const vb = {fontSize:11,padding:"4px 10px",borderRadius:6,border:"1px solid "+C.border,cursor:"pointer",fontWeight:700,fontFamily:FONT};

  // ── VISTA LISTA ─────────────────────────────────────────
  function ListView() {
    const sorted = [...ped].sort((a,b) => {
      const order = ["idea","brief","produzione","semaforo","pubblicato","feed"];
      return order.indexOf(a.stato) - order.indexOf(b.stato) || a.data.localeCompare(b.data);
    });
    return (
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {!sorted.length && <div style={{textAlign:"center",padding:24,color:C.muted,fontSize:13}}>Nessun contenuto</div>}
        {sorted.map(post => {
          const pil  = PIATTAFORME[post.piattaforma];
          const pilC = post.pilastro && PILASTRI[post.pilastro] ? PILASTRI[post.pilastro] : null;
          const col  = allCols[post.stato] || allCols.idea;
          const mem  = post.memberId ? members.find(m => m.id===post.memberId) : null;
          return (
            <div key={post.id} style={{background:C.white,border:"1px solid "+C.border,borderRadius:7,
              padding:"9px 14px",display:"flex",alignItems:"center",gap:10,
              borderLeft:"3px solid "+(pilC?pilC.color:col.htx)}}>
              <span style={{fontSize:12,flexShrink:0,width:18}}>{col.emoji}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{post.titolo}</div>
                <div style={{display:"flex",gap:5,marginTop:3,flexWrap:"wrap",alignItems:"center"}}>
                  {pil && <span style={{background:pil.color,color:"#fff",padding:"1px 5px",borderRadius:3,fontSize:9,fontWeight:700}}>{pil.label}</span>}
                  {pilC && <span style={{background:pilC.bg,color:pilC.color,padding:"1px 5px",borderRadius:3,fontSize:9,fontWeight:700}}>{pilC.label}</span>}
                  {post.data && <span style={{fontSize:10,color:C.muted}}>{post.data}</span>}
                </div>
              </div>
              {mem && (
                <div title={mem.nome} style={{width:22,height:22,borderRadius:"50%",background:mem.colore,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{color:"#fff",fontWeight:800,fontSize:9}}>{mem.nome[0]}</span>
                </div>
              )}
              <span style={{background:col.hbg,color:col.htx,padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:700,flexShrink:0}}>
                {col.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // ── VISTA BOARD ─────────────────────────────────────────
  function BoardView() {
    return (
      <div>
        {/* Pipeline 4 colonne */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
          {Object.entries(PIPELINE_COLS).map(([colKey, col]) => {
            const cards = byCol[colKey] || [];
            return (
              <div key={colKey} style={{background:C.sfondo,borderRadius:10,display:"flex",flexDirection:"column",minHeight:240,border:"1px solid "+C.border}}>
                <div style={{background:col.hbg,borderRadius:"10px 10px 0 0",padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                  <span style={{fontSize:12,fontWeight:800,color:col.htx}}>{col.emoji} {col.label}</span>
                  <span style={{fontSize:11,fontWeight:700,background:"rgba(0,0,0,.1)",color:col.htx,borderRadius:20,padding:"1px 7px"}}>{cards.length}</span>
                </div>
                <div style={{padding:8,display:"flex",flexDirection:"column",gap:7,flex:1}}>
                  {!cards.length && <div style={{border:"1.5px dashed "+C.border,borderRadius:7,padding:"12px 8px",textAlign:"center",fontSize:11,color:C.muted}}>Nessun contenuto</div>}
                  {cards.map(post => <KanbanCard key={post.id} post={post} col={col} members={members}/>)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pubblicato — griglia 4 colonne con wrap verticale */}
        <div style={{background:C.sfondo,borderRadius:10,border:"1px solid "+C.border,overflow:"hidden",marginBottom:8}}>
          <div style={{background:PUBBLICATO_COL.hbg,padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:13,fontWeight:800,color:PUBBLICATO_COL.htx}}>{PUBBLICATO_COL.emoji} {PUBBLICATO_COL.label}</span>
            <span style={{fontSize:11,fontWeight:700,background:"rgba(0,0,0,.08)",color:PUBBLICATO_COL.htx,borderRadius:20,padding:"1px 8px"}}>{byCol["pubblicato"].length}</span>
          </div>
          {!byCol["pubblicato"].length ? (
            <div style={{padding:"14px 18px",fontSize:11,color:C.muted,fontStyle:"italic"}}>Nessun contenuto pubblicato questo mese</div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,padding:"10px 12px 12px"}}>
              {byCol["pubblicato"].map(post => {
                const pil  = PIATTAFORME[post.piattaforma];
                const pilC = post.pilastro && PILASTRI[post.pilastro] ? PILASTRI[post.pilastro] : null;
                const mem  = post.memberId ? members.find(m => m.id===post.memberId) : null;
                return (
                  <div key={post.id} style={{background:C.white,borderRadius:7,padding:"9px 10px",border:"1px solid "+C.border,
                    borderLeft:"3px solid "+(pilC?pilC.color:PUBBLICATO_COL.htx),boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.testo,marginBottom:5,lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{post.titolo}</div>
                    <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                      {pil && <span style={{background:pil.color,color:"#fff",padding:"1px 4px",borderRadius:3,fontSize:8,fontWeight:700}}>{pil.label}</span>}
                      {post.data && <span style={{fontSize:9,color:C.muted,marginLeft:"auto"}}>{kanbanFmtData(post.data)}</span>}
                      {mem && (
                        <div title={mem.nome} style={{width:14,height:14,borderRadius:"50%",background:mem.colore,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
                          <span style={{color:"#fff",fontWeight:800,fontSize:6}}>{mem.nome[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Feed — griglia 3 colonne anteprima */}
        <div style={{background:C.sfondo,borderRadius:10,border:"1px solid "+C.border,overflow:"hidden"}}>
          <div style={{background:FEED_COL.hbg,padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:13,fontWeight:800,color:FEED_COL.htx}}>{FEED_COL.emoji} {FEED_COL.label}</span>
            <span style={{fontSize:11,fontWeight:700,background:"rgba(0,0,0,.08)",color:FEED_COL.htx,borderRadius:20,padding:"1px 8px"}}>{byCol["feed"].length}</span>
            <span style={{fontSize:10,color:FEED_COL.htx,marginLeft:"auto",opacity:.7}}>visibili nel Feed</span>
          </div>
          {!byCol["feed"].length ? (
            <div style={{padding:"14px 18px",fontSize:11,color:C.muted,fontStyle:"italic"}}>Nessun contenuto nel feed — segna un post come "🖼 Feed" per aggiungerlo</div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,padding:"10px 12px 12px"}}>
              {byCol["feed"].map(post => {
                const img  = post.immagineUrl || post.immagineBase64;
                const pilC = post.pilastro && PILASTRI[post.pilastro] ? PILASTRI[post.pilastro] : null;
                return (
                  <div key={post.id} style={{borderRadius:8,overflow:"hidden",border:"2px solid "+FEED_COL.htx+"44",aspectRatio:"1",position:"relative"}}>
                    <div style={{position:"absolute",inset:0,
                      background:img?"transparent":"linear-gradient(135deg,"+(post.colori?.[0]||"#8E44AD")+","+(post.colori?.[1]||"#9B59B6")+")",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {img && <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                      {!img && <span style={{color:"rgba(255,255,255,.85)",fontSize:9,fontWeight:700,textAlign:"center",padding:"4px 6px",lineHeight:1.3}}>{post.titolo}</span>}
                    </div>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,.5))",padding:"8px 5px 4px"}}>
                      <span style={{fontSize:8,color:"#fff",fontWeight:700}}>🖼 {kanbanFmtData(post.data)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header: mese + toggle vista */}
      <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
        <input type="month" value={mese} onChange={e => onMeseChange(e.target.value)}
          style={{border:"1px solid "+C.border,borderRadius:6,padding:"6px 12px",fontSize:13,fontFamily:FONT,flex:1}} />
        <span style={{fontSize:11,color:C.muted}}>{ped.length} contenuti</span>
        <div style={{display:"flex",gap:4}}>
          <button onClick={() => setKView("board")} style={{...vb,background:kView==="board"?C.testo:C.white,color:kView==="board"?"#fff":C.testo}}>⊞ Board</button>
          <button onClick={() => setKView("list")}  style={{...vb,background:kView==="list"?C.testo:C.white,color:kView==="list"?"#fff":C.testo}}>☰ Lista</button>
        </div>
      </div>

      {kView === "board" ? <BoardView /> : <ListView />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  KPI                                                         */
/* ─────────────────────────────────────────────────────────── */
function KPISection({ kpi, mese, onMeseChange }) {
  function fmt(n) { return n >= 1000 ? (n/1000).toFixed(1)+"k" : String(n); }
  return (
    <div>
      <div style={{marginBottom:16}}>
        <input type="month" value={mese} onChange={e => onMeseChange(e.target.value)}
          style={{border:"1px solid "+C.border,borderRadius:6,padding:"6px 12px",fontSize:14,fontFamily:FONT,width:"100%",boxSizing:"border-box"}} />
      </div>
      {!kpi ? (
        <div style={{textAlign:"center",padding:40,color:C.muted}}>
          <BarChart2 size={28} style={{marginBottom:8,opacity:.3}} />
          <p style={{margin:0,fontSize:14}}>Nessun dato per questo mese</p>
        </div>
      ) : (
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
            {[{label:"Reach",value:fmt(kpi.reach),icon:"👁"},{label:"Eng. Rate",value:kpi.engagement+"%",icon:"❤️"},{label:"Lead",value:kpi.lead,icon:"🎯"}].map(card => (
              <div key={card.label} style={{border:"1px solid "+C.border,borderRadius:8,padding:"12px 10px",background:C.white,textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:4}}>{card.icon}</div>
                <div style={{fontSize:20,fontWeight:800,color:C.verde,lineHeight:1}}>{card.value}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:4}}>{card.label}</div>
              </div>
            ))}
          </div>
          {kpi.trend && (
            <div style={{border:"1px solid "+C.border,borderRadius:8,padding:16,background:C.white,marginBottom:16}}>
              <p style={{margin:"0 0 12px",fontSize:13,fontWeight:700}}>Trend Reach — ultimi 6 mesi</p>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={kpi.trend} margin={{top:5,right:5,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.verde} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={C.verde} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="mese" tick={{fontSize:11,fontFamily:FONT}} />
                  <YAxis tick={{fontSize:11,fontFamily:FONT}} tickFormatter={fmt} />
                  <Tooltip formatter={v => [fmt(v),"Reach"]} contentStyle={{fontFamily:FONT,fontSize:12}} />
                  <Area type="monotone" dataKey="reach" stroke={C.verde} strokeWidth={2} fill="url(#rg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          {kpi.topContent && (
            <div style={{border:"1px solid "+C.border,borderRadius:8,background:C.white,overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.border}}>
                <p style={{margin:0,fontSize:13,fontWeight:700}}>Top 5 contenuti</p>
              </div>
              {kpi.topContent.map((item, i) => (
                <div key={i} style={{padding:"10px 16px",borderBottom:i<kpi.topContent.length-1?"1px solid "+C.border:"none",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.muted,width:16}}>#{i+1}</span>
                  <span style={{flex:1,fontSize:13}}>{item.titolo}</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.verde}}>{fmt(item.reach)} reach</div>
                    <div style={{fontSize:11,color:C.muted}}>{item.engagement}% eng.</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  CLIENT VIEW  — con back button                             */
/* ─────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────── */
/*  FEED WITH PREVIEW  — editor + anteprima Instagram         */
/* ─────────────────────────────────────────────────────────── */
function FeedWithPreview({ feed, setFeed, schedSave, isAdmin, clienteNome, slug, noPreview }) {
  const [selId,       setSelId]       = useState(null);
  const [dragOver,    setDragOver]    = useState(null);
  const [carouselIdx, setCarouselIdx] = useState({});   // postId → current index
  const [previewPlat, setPreviewPlat] = useState("instagram");
  const [teamMembers, setTeamMembers] = useState(DEFAULT_MEMBERS);
  const [teamOpen,    setTeamOpen]    = useState({});   // postId → bool
  const [uploading,   setUploading]   = useState({});   // postId → "img" | "video" | null
  const [metaData,    setMetaData]    = useState(null); // Meta tokens for this client
  const [publishPost, setPublishPost] = useState(null); // post being published

  useEffect(() => {
    if (slug) store.get("clients:" + slug + ":meta").then(m => setMetaData(m || {}));
  }, [slug]);

  useEffect(() => {
    store.get("team:members").then(m => { if (m && m.length) setTeamMembers(m); });
  }, []);

  function toggleMember(postId, memberId) {
    const post = feed.find(x => x.id === postId);
    const cur  = Array.isArray(post.memberIds) ? post.memberIds : (post.memberId ? [post.memberId] : []);
    const next = cur.includes(memberId) ? cur.filter(x => x !== memberId) : [...cur, memberId];
    updPost(postId, "memberIds", next);
  }

  /* ── helpers ─────────────────────────────────────────────── */
  function getPiattaforme(post) {
    if (Array.isArray(post.piattaforme) && post.piattaforme.length) return post.piattaforme;
    if (post.piattaforma) return [post.piattaforma];
    return ["instagram"];
  }
  function getCarIdx(id)        { return carouselIdx[id] || 0; }
  function setCarIdx(id, idx)   { setCarouselIdx(prev => ({...prev,[id]:idx})); }

  function getMainImg(post) {
    if (post.tipo === "reel" || post.tipo === "storia") return { src: post.videoUrl||post.videoBase64||post.immagineBase64||post.immagineUrl||null, isVideo: !!(post.videoUrl||post.videoBase64) };
    if (post.tipo === "carousel") {
      const imgs = post.immagini || [];
      return { src: imgs[getCarIdx(post.id)] || null, isVideo: false };
    }
    return { src: post.immagineBase64||post.immagineUrl||null, isVideo: false };
  }

  function updPost(id, field, value) {
    setFeed(prev => prev.map(x => x.id===id ? {...x,[field]:value} : x));
    schedSave();
  }
  function addPost() {
    const np = [...feed, {
      id:"p"+Date.now(), titolo:"Nuovo post",
      piattaforme:["instagram"], tipo:"post", stato:"bozza",
      data:new Date().toISOString().split("T")[0],
      caption:"", immagineUrl:"", immagineBase64:"",
      immagini:[], videoUrl:"", videoBase64:"",
      colori:POST_COLORS[feed.length%POST_COLORS.length],
    }];
    setFeed(np); schedSave(); setSelId(np[np.length-1].id);
  }
  function delPost(id) {
    setFeed(prev => prev.filter(x=>x.id!==id)); schedSave();
    if (selId===id) setSelId(null);
  }
  function togglePiattaforma(postId, k) {
    const post = feed.find(x=>x.id===postId);
    const cur  = getPiattaforme(post);
    const next = cur.includes(k) ? (cur.length>1 ? cur.filter(x=>x!==k) : cur) : [...cur,k];
    updPost(postId, "piattaforme", next);
  }

  function handleImgFile(id, file, carousel=false) {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(u => ({...u, [id]: "img"}));
    uploadToDropbox(file, clienteNome || "Cliente", "Images")
      .then(url => {
        if (carousel) {
          const post = feed.find(x => x.id === id);
          updPost(id, "immagini", [...(post.immagini || []), url]);
        } else {
          updPost(id, "immagineUrl",    url);
          updPost(id, "immagineBase64", "");
        }
      })
      .catch(e => alert("❌ Upload Dropbox fallito:\n" + e.message))
      .finally(() => setUploading(u => ({...u, [id]: null})));
  }
  function handleVideoFile(id, file) {
    if (!file || !file.type.startsWith("video/")) return;
    setUploading(u => ({...u, [id]: "video"}));
    uploadToDropbox(file, clienteNome || "Cliente", "Videos")
      .then(url => {
        updPost(id, "videoUrl",    url);
        updPost(id, "videoBase64", "");
      })
      .catch(e => alert("❌ Upload video Dropbox fallito:\n" + e.message))
      .finally(() => setUploading(u => ({...u, [id]: null})));
  }
  function triggerImg(id, carousel=false) {
    const inp = document.createElement("input"); inp.type="file"; inp.accept="image/*";
    if (carousel) inp.multiple=true;
    inp.onchange = e => Array.from(e.target.files).forEach(f => handleImgFile(id,f,carousel));
    inp.click();
  }
  function triggerVideo(id) {
    const inp = document.createElement("input"); inp.type="file"; inp.accept="video/*";
    inp.onchange = e => { if(e.target.files[0]) handleVideoFile(id,e.target.files[0]); };
    inp.click();
  }

  const selPost = feed.find(p => p.id===selId) || null;
  const inpF = {border:"1px solid "+C.border,borderRadius:6,padding:"6px 9px",fontSize:12,fontFamily:FONT,width:"100%",boxSizing:"border-box"};

  /* ── TIPO TABS ─────────────────────────────────────────── */
  function TipoTabs({ post }) {
    const tipos = [
      {id:"post",     icon:"🖼",  label:"Post"},
      {id:"carousel", icon:"📸", label:"Carousel"},
      {id:"reel",     icon:"🎬", label:"Reel"},
      {id:"storia",   icon:"📱", label:"Storia"},
    ];
    return (
      <div style={{display:"flex",gap:4,marginBottom:10}}>
        {tipos.map(t => (
          <button key={t.id} onClick={e=>{e.stopPropagation();updPost(post.id,"tipo",t.id);}}
            style={{padding:"4px 10px",borderRadius:20,border:"1px solid "+(post.tipo===t.id?C.verde:C.border),
              background:post.tipo===t.id?C.verde+"15":"#fff",color:post.tipo===t.id?C.verde:C.muted,
              fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
    );
  }

  /* ── PLATFORM PILLS ────────────────────────────────────── */
  function PlatformPills({ post }) {
    const piattaforme = getPiattaforme(post);
    return (
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
        {Object.entries(PIATTAFORME).map(([k,v]) => {
          const sel = piattaforme.includes(k);
          return (
            <button key={k} onClick={e=>{e.stopPropagation();togglePiattaforma(post.id,k);}}
              style={{padding:"3px 10px",borderRadius:20,border:"2px solid "+(sel?v.color:C.border),
                background:sel?v.color:"#fff",color:sel?"#fff":C.muted,
                fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT,transition:"all .15s"}}>
              {v.label}
            </button>
          );
        })}
      </div>
    );
  }

  /* ── CAROUSEL EDITOR ───────────────────────────────────── */
  function CarouselEditor({ post }) {
    const imgs        = post.immagini || [];
    const isUploading = uploading[post.id] === "img";
    return (
      <div style={{marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>
          Immagini carousel ({imgs.length})
        </div>
        {imgs.length > 0 && (
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
            {imgs.map((img,i) => (
              <div key={i} style={{position:"relative",width:56,height:56,borderRadius:7,overflow:"hidden",border:"2px solid "+(getCarIdx(post.id)===i?C.verde:C.border)}}>
                <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <button onClick={e=>{e.stopPropagation();
                  const next=imgs.filter((_,j)=>j!==i);
                  updPost(post.id,"immagini",next);
                  if(getCarIdx(post.id)>=next.length) setCarIdx(post.id,Math.max(0,next.length-1));
                }}
                  style={{position:"absolute",top:1,right:1,width:16,height:16,borderRadius:"50%",background:C.magenta,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <X size={9} style={{color:"#fff"}}/>
                </button>
                <div style={{position:"absolute",bottom:1,left:0,right:0,textAlign:"center",fontSize:8,color:"rgba(255,255,255,.9)",fontWeight:700}}>{i+1}</div>
              </div>
            ))}
          </div>
        )}
        {isUploading ? (
          <div style={{border:"2px solid "+C.verde,borderRadius:8,padding:"12px",textAlign:"center",background:"#F1FAF4",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <style>{`@keyframes dbx-spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{width:16,height:16,border:"2px solid #E0E0E0",borderTopColor:C.verde,borderRadius:"50%",animation:"dbx-spin .7s linear infinite"}}/>
            <span style={{fontSize:11,fontWeight:700,color:C.verde}}>⬆ Upload su Dropbox...</span>
          </div>
        ) : (
          <button onClick={e=>{e.stopPropagation();triggerImg(post.id,true);}}
            style={{width:"100%",border:"1.5px dashed "+C.border,borderRadius:8,padding:"8px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT,background:C.sfondo,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <Plus size={12}/> Aggiungi immagini <span style={{fontSize:9,color:C.verde,fontWeight:700}}>↑ Dropbox</span>
          </button>
        )}
      </div>
    );
  }

  /* ── REEL EDITOR ───────────────────────────────────────── */
  function ReelEditor({ post }) {
    const hasVideo    = post.videoUrl || post.videoBase64;
    const isUploading = uploading[post.id] === "video";
    return (
      <div style={{marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Video reel</div>
        {isUploading ? (
          <div style={{border:"2px solid "+C.magenta,borderRadius:8,padding:"20px 14px",textAlign:"center",background:"#FFF0F6",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            <style>{`@keyframes dbx-spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{width:22,height:22,border:"2px solid #F0C0D0",borderTopColor:C.magenta,borderRadius:"50%",animation:"dbx-spin .7s linear infinite"}}/>
            <div style={{fontSize:12,fontWeight:700,color:C.magenta}}>⬆ Upload video su Dropbox...</div>
            <div style={{fontSize:10,color:C.muted}}>I file grandi possono richiedere qualche secondo</div>
          </div>
        ) : hasVideo ? (
          <div style={{background:C.sfondo,borderRadius:8,padding:"8px 10px",display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{fontSize:16}}>🎬</span>
            <div style={{flex:1,fontSize:11,fontWeight:700,color:C.verde}}>✓ Video su Dropbox</div>
            <button onClick={e=>{e.stopPropagation();updPost(post.id,"videoUrl","");updPost(post.id,"videoBase64","");}}
              style={{background:"none",border:"1px solid "+C.magenta,borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:FONT,color:C.magenta}}>
              Rimuovi
            </button>
          </div>
        ) : (
          <div onClick={e=>{e.stopPropagation();triggerVideo(post.id);}}
            style={{border:"2px dashed "+C.border,borderRadius:8,padding:"14px",textAlign:"center",cursor:"pointer",background:C.sfondo}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.magenta}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{fontSize:22,marginBottom:4}}>🎬</div>
            <div style={{fontSize:12,fontWeight:700}}>Carica video</div>
            <div style={{fontSize:10,color:C.muted}}>MP4, MOV · nessun limite di dimensione</div>
            <div style={{fontSize:9,color:C.verde,marginTop:4,fontWeight:700}}>↑ Dropbox</div>
          </div>
        )}
        <div style={{marginTop:7,display:"flex",alignItems:"center",gap:6}}>
          <div style={{flex:1,height:1,background:C.border}}/>
          <span style={{fontSize:10,color:C.muted,whiteSpace:"nowrap"}}>oppure URL diretto</span>
          <div style={{flex:1,height:1,background:C.border}}/>
        </div>
        <input value={post.videoUrl||""} placeholder="https://... (Dropbox, Drive, MP4 direct link)"
          onClick={e=>e.stopPropagation()}
          onChange={e=>{updPost(post.id,"videoUrl",e.target.value); if(e.target.value) updPost(post.id,"videoBase64","");}}
          style={{...inpF,marginTop:6,fontSize:11,color:C.muted}}/>
        <div style={{fontSize:9,color:C.muted,marginTop:3}}>Dropbox: modifica link da ?dl=0 a ?raw=1 · Drive: usa link diretto mp4</div>
      </div>
    );
  }

  /* ── SINGLE IMAGE EDITOR ───────────────────────────────── */
  function SingleImgEditor({ post }) {
    const img      = post.immagineBase64 || post.immagineUrl;
    const isUploading = uploading[post.id] === "img";
    return (
      <div style={{marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Immagine post</div>
        {isUploading ? (
          <div style={{border:"2px solid "+C.verde,borderRadius:8,padding:"20px 14px",textAlign:"center",background:"#F1FAF4",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            <style>{`@keyframes dbx-spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{width:22,height:22,border:"2px solid #E0E0E0",borderTopColor:C.verde,borderRadius:"50%",animation:"dbx-spin .7s linear infinite"}}/>
            <div style={{fontSize:12,fontWeight:700,color:C.verde}}>⬆ Upload su Dropbox...</div>
          </div>
        ) : img ? (
          <div style={{display:"flex",gap:8,alignItems:"center",background:C.sfondo,borderRadius:8,padding:"8px 10px"}}>
            <img src={img} alt="" style={{width:40,height:40,borderRadius:5,objectFit:"cover",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:700,color:C.verde}}>✓ Immagine su Dropbox</div>
              {post.immagineUrl && <div style={{fontSize:9,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{post.immagineUrl}</div>}
            </div>
            <div style={{display:"flex",gap:5}}>
              <button onClick={e=>{e.stopPropagation();triggerImg(post.id,false);}}
                style={{fontSize:10,padding:"3px 8px",borderRadius:4,border:"1px solid "+C.border,background:"#fff",cursor:"pointer",fontFamily:FONT,fontWeight:700}}>
                Cambia
              </button>
              <button onClick={e=>{e.stopPropagation();updPost(post.id,"immagineBase64","");updPost(post.id,"immagineUrl","");}}
                style={{fontSize:10,padding:"3px 8px",borderRadius:4,border:"1px solid "+C.magenta,background:"#fff",cursor:"pointer",fontFamily:FONT,fontWeight:700,color:C.magenta}}>
                Rimuovi
              </button>
            </div>
          </div>
        ) : (
          <div onClick={e=>{e.stopPropagation();triggerImg(post.id,false);}}
            onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(e.dataTransfer.files[0])handleImgFile(post.id,e.dataTransfer.files[0],false);}}
            style={{border:"2px dashed "+C.border,borderRadius:8,padding:"14px",textAlign:"center",cursor:"pointer",background:C.sfondo}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.verde}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{fontSize:22,marginBottom:4}}>📷</div>
            <div style={{fontSize:12,fontWeight:700}}>Carica immagine</div>
            <div style={{fontSize:10,color:C.muted}}>Clicca o trascina · JPG, PNG, WebP</div>
            <div style={{fontSize:9,color:C.verde,marginTop:4,fontWeight:700}}>↑ Dropbox</div>
          </div>
        )}
        <div style={{marginTop:7,display:"flex",alignItems:"center",gap:6}}>
          <div style={{flex:1,height:1,background:C.border}}/>
          <span style={{fontSize:10,color:C.muted,whiteSpace:"nowrap"}}>oppure URL esterno</span>
          <div style={{flex:1,height:1,background:C.border}}/>
        </div>
        <input value={post.immagineUrl||""} placeholder="https://..."
          onClick={e=>e.stopPropagation()}
          onChange={e=>{updPost(post.id,"immagineUrl",e.target.value);if(e.target.value)updPost(post.id,"immagineBase64","");}}
          style={{...inpF,marginTop:6,fontSize:11,color:C.muted}}/>
      </div>
    );
  }

  /* ── PHONE PREVIEW HELPERS ─────────────────────────────── */
  function PlatformTabs({ post }) {
    const plats = getPiattaforme(post);
    if (plats.length <= 1) return null;
    return (
      <div style={{display:"flex",borderBottom:"1px solid #F0F0F0",overflow:"hidden"}}>
        {plats.map(k => {
          const p = PIATTAFORME[k];
          const isSel = previewPlat===k;
          return (
            <button key={k} onClick={()=>setPreviewPlat(k)}
              style={{flex:1,padding:"7px 4px",border:"none",background:isSel?"#fff":"#F8F8F8",cursor:"pointer",fontFamily:FONT,
                fontSize:10,fontWeight:700,color:isSel?p.color:C.muted,
                borderBottom:"2px solid "+(isSel?p.color:"transparent")}}>
              {p.label}
            </button>
          );
        })}
      </div>
    );
  }

  function CarouselNav({ post }) {
    const imgs = post.immagini || [];
    const idx  = getCarIdx(post.id);
    if (imgs.length < 2) return null;
    return (
      <>
        {/* arrows */}
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 4px",pointerEvents:"none",zIndex:5}}>
          {idx > 0 && (
            <button onClick={e=>{e.stopPropagation();setCarIdx(post.id,idx-1);}}
              style={{width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,.45)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"all"}}>
              <ChevronLeft size={12} style={{color:"#fff"}}/>
            </button>
          )}
          {idx < imgs.length-1 && (
            <button onClick={e=>{e.stopPropagation();setCarIdx(post.id,idx+1);}}
              style={{width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,.45)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"auto",pointerEvents:"all"}}>
              <ChevronRight size={12} style={{color:"#fff"}}/>
            </button>
          )}
        </div>
        {/* dots */}
        <div style={{position:"absolute",bottom:6,left:0,right:0,display:"flex",justifyContent:"center",gap:3,zIndex:5}}>
          {imgs.map((_,i) => (
            <div key={i} style={{height:4,width:i===idx?14:4,borderRadius:2,background:i===idx?"#fff":"rgba(255,255,255,.5)",transition:"width .2s"}}/>
          ))}
        </div>
      </>
    );
  }

  /* ── INSTAGRAM PREVIEW ─────────────────────────────────── */
  function InstaPostPreview({ post }) {
    const { src, isVideo } = getMainImg(post);
    const imgs = post.immagini||[];
    const isCarousel = post.tipo==="carousel";
    const isReel     = post.tipo==="reel";
    return (
      <div style={{display:"flex",flexDirection:"column",flex:1,overflowY:"auto"}}>
        {/* top bar */}
        <div style={{padding:"7px 10px",display:"flex",alignItems:"center",gap:7,flexShrink:0,borderBottom:"1px solid #F0F0F0"}}>
          <button onClick={()=>setSelId(null)} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",color:"#111"}}><ChevronLeft size={16}/></button>
          <div style={{width:22,height:22,borderRadius:"50%",background:C.verde,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:"#fff",fontWeight:800,fontSize:8}}>{(clienteNome||"N")[0]}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:10,lineHeight:1}}>{clienteNome}</div>
            <div style={{fontSize:8,color:C.muted}}>{PIATTAFORME["instagram"]?.label} {isCarousel?"· Carousel":isReel?"· Reel":""}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>{[0,1,2].map(i=><div key={i} style={{width:12,height:1.2,background:"#333",borderRadius:1}}/>)}</div>
        </div>
        {/* image / video */}
        <div style={{width:"100%",aspectRatio:"1",flexShrink:0,position:"relative",background:src?"#000":"linear-gradient(135deg,"+(post.colori?.[0]||"#2C3E50")+","+(post.colori?.[1]||"#3498DB")+")",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
          {isVideo && src
            ? <video src={src} controls autoPlay playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            : src
              ? <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              : <div style={{textAlign:"center",padding:12}}><div style={{fontSize:isReel?24:22,opacity:.6}}>{isReel?"🎬":"📷"}</div><div style={{color:"rgba(255,255,255,.8)",fontSize:9,marginTop:4,fontWeight:700}}>{post.titolo}</div></div>
          }
          {isCarousel && <CarouselNav post={post}/>}
          {isCarousel && imgs.length>1 && (
            <div style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.55)",borderRadius:5,padding:"2px 6px",zIndex:6}}>
              <span style={{fontSize:8,color:"#fff",fontWeight:700}}>{getCarIdx(post.id)+1}/{imgs.length}</span>
            </div>
          )}
        </div>
        {/* actions */}
        <div style={{padding:"7px 10px 3px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          {["♥","💬","✈️"].map(ico=><span key={ico} style={{fontSize:16,cursor:"pointer"}}>{ico}</span>)}
          <span style={{marginLeft:"auto",fontSize:16,cursor:"pointer"}}>🔖</span>
        </div>
        <div style={{padding:"0 10px 4px",fontSize:9,fontWeight:700,color:"#111",flexShrink:0}}>— Mi piace</div>
        <div style={{padding:"0 10px 8px",flex:1}}>
          <span style={{fontSize:9,fontWeight:700,color:"#111",marginRight:4}}>{clienteNome}</span>
          <span style={{fontSize:9,color:"#111",lineHeight:1.5,whiteSpace:"pre-line"}}>{post.caption||<span style={{color:C.muted,fontStyle:"italic"}}>Nessuna caption</span>}</span>
          {post.stato==="non-approvato"&&post.noteRifiuto&&(
            <div style={{marginTop:6,background:"#FFF0F0",borderRadius:5,padding:"5px 7px",border:"1px solid "+C.magenta+"33"}}>
              <div style={{fontSize:7,fontWeight:700,color:C.magenta}}>❌ Rifiutato</div>
              <div style={{fontSize:8,color:C.testo,lineHeight:1.4}}>{post.noteRifiuto}</div>
            </div>
          )}
        </div>
        <div style={{padding:"5px 10px",borderTop:"1px solid #F0F0F0",fontSize:8,color:C.muted,flexShrink:0}}>Aggiungi un commento...</div>
      </div>
    );
  }

  /* ── FACEBOOK PREVIEW ──────────────────────────────────── */
  function FBPostPreview({ post }) {
    const { src, isVideo } = getMainImg(post);
    const imgs = post.immagini||[];
    const isCarousel = post.tipo==="carousel";
    return (
      <div style={{display:"flex",flexDirection:"column",flex:1,overflowY:"auto",background:"#F0F2F5"}}>
        <div style={{padding:"7px 10px",display:"flex",alignItems:"center",gap:7,flexShrink:0,background:"#fff",borderBottom:"1px solid #E0E0E0"}}>
          <button onClick={()=>setSelId(null)} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",color:"#1877F2"}}><ChevronLeft size={16}/></button>
          <div style={{fontWeight:700,fontSize:11,color:"#1877F2"}}>Facebook</div>
        </div>
        <div style={{background:"#fff",margin:"8px 6px",borderRadius:8,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,.1)"}}>
          <div style={{padding:"8px 10px",display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:"#1877F2",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:"#fff",fontWeight:800,fontSize:9}}>{(clienteNome||"N")[0]}</span>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:10}}>{clienteNome}</div>
              <div style={{fontSize:8,color:C.muted}}>{post.data} · 🌐</div>
            </div>
          </div>
          {post.caption&&<div style={{padding:"0 10px 6px",fontSize:10,color:"#1C1E21",lineHeight:1.5,whiteSpace:"pre-line"}}>{post.caption}</div>}
          <div style={{position:"relative",background:src?"#000":"linear-gradient(135deg,"+(post.colori?.[0]||"#1877F2")+","+(post.colori?.[1]||"#42A5F5")+")",aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            {isVideo&&src ? <video src={src} controls autoPlay playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/> : src ? <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{textAlign:"center"}}><div style={{fontSize:20,opacity:.6}}>📷</div><div style={{color:"rgba(255,255,255,.8)",fontSize:8,marginTop:3,fontWeight:700}}>{post.titolo}</div></div>}
            {isCarousel&&<CarouselNav post={post}/>}
          </div>
          <div style={{padding:"6px 10px",borderTop:"1px solid #E0E0E0",display:"flex",justifyContent:"space-around"}}>
            {[["👍","Mi piace"],["💬","Commenta"],["↗","Condividi"]].map(([ico,lbl])=>(
              <button key={lbl} style={{background:"none",border:"none",cursor:"pointer",fontSize:9,fontWeight:700,color:"#65676B",display:"flex",alignItems:"center",gap:3,fontFamily:FONT}}>
                <span style={{fontSize:14}}>{ico}</span> {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── TIKTOK PREVIEW ────────────────────────────────────── */
  function TikTokPreview({ post }) {
    const { src, isVideo } = getMainImg(post);
    return (
      <div style={{display:"flex",flexDirection:"column",flex:1,background:"#111",position:"relative",overflow:"hidden"}}>
        <div style={{padding:"7px 10px",display:"flex",alignItems:"center",gap:7,flexShrink:0,position:"absolute",top:0,left:0,right:0,zIndex:10,background:"linear-gradient(#00000060,transparent)"}}>
          <button onClick={()=>setSelId(null)} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",color:"#fff"}}><ChevronLeft size={16}/></button>
          <div style={{flex:1,textAlign:"center",fontWeight:700,fontSize:11,color:"#fff"}}>Segui</div>
          <div style={{width:14}}/>
        </div>
        <div style={{flex:1,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {isVideo&&src ? <video src={src} autoPlay loop playsInline style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/> : src ? <img src={src} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{textAlign:"center"}}><div style={{fontSize:28,opacity:.4}}>🎬</div><div style={{color:"rgba(255,255,255,.5)",fontSize:9,marginTop:4}}>{post.titolo}</div></div>}
          {/* TikTok right sidebar */}
          <div style={{position:"absolute",right:6,bottom:40,display:"flex",flexDirection:"column",alignItems:"center",gap:12,zIndex:10}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:C.verde,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontWeight:800,fontSize:9}}>{(clienteNome||"N")[0]}</span>
            </div>
            {[["♥","28.5K"],["💬","1.2K"],["↗","4.8K"]].map(([ico,n])=>(
              <div key={n} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <span style={{fontSize:20}}>{ico}</span>
                <span style={{fontSize:7,color:"#fff",fontWeight:700}}>{n}</span>
              </div>
            ))}
          </div>
          {/* bottom caption */}
          <div style={{position:"absolute",bottom:0,left:0,right:40,padding:"8px 10px 6px",background:"linear-gradient(transparent,rgba(0,0,0,.6))",zIndex:10}}>
            <div style={{fontSize:9,fontWeight:700,color:"#fff",marginBottom:2}}>@{(clienteNome||"account").toLowerCase().replace(/\s/g,"")}</div>
            {post.caption&&<div style={{fontSize:8,color:"rgba(255,255,255,.85)",lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{post.caption}</div>}
          </div>
        </div>
      </div>
    );
  }

  /* ── LINKEDIN PREVIEW ──────────────────────────────────── */
  function LinkedInPreview({ post }) {
    const { src, isVideo } = getMainImg(post);
    return (
      <div style={{display:"flex",flexDirection:"column",flex:1,overflowY:"auto",background:"#F3F2EF"}}>
        <div style={{padding:"7px 10px",display:"flex",alignItems:"center",gap:7,flexShrink:0,background:"#fff",borderBottom:"1px solid #E0E0E0"}}>
          <button onClick={()=>setSelId(null)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",color:"#0A66C2"}}><ChevronLeft size={16}/></button>
          <div style={{fontWeight:700,fontSize:11,color:"#0A66C2"}}>LinkedIn</div>
        </div>
        <div style={{background:"#fff",margin:"8px 6px",borderRadius:4,overflow:"hidden",border:"1px solid #E0E0E0"}}>
          <div style={{padding:"8px 10px",display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:28,height:28,borderRadius:4,background:"#0A66C2",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:"#fff",fontWeight:800,fontSize:10}}>{(clienteNome||"N")[0]}</span>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:10}}>{clienteNome}</div>
              <div style={{fontSize:8,color:C.muted}}>{post.data} · 🌐</div>
            </div>
          </div>
          {post.caption&&<div style={{padding:"0 10px 8px",fontSize:10,color:"#000",lineHeight:1.55,whiteSpace:"pre-line"}}>{post.caption}</div>}
          <div style={{position:"relative",background:src?"#000":"linear-gradient(135deg,#0A66C2,#0073B1)",aspectRatio:"1.91",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            {isVideo&&src?<video src={src} controls autoPlay playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/> : src?<img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{textAlign:"center"}}><div style={{fontSize:16,opacity:.5}}>📷</div><div style={{color:"rgba(255,255,255,.7)",fontSize:8,fontWeight:700}}>{post.titolo}</div></div>}
          </div>
          <div style={{padding:"5px 10px",borderTop:"1px solid #E0E0E0",display:"flex",justifyContent:"space-around"}}>
            {[["👍","Mi piace"],["💬","Commenta"],["🔁","Ripubblica"],["↗","Invia"]].map(([ico,lbl])=>(
              <button key={lbl} style={{background:"none",border:"none",cursor:"pointer",fontSize:7,fontWeight:700,color:"#666",display:"flex",flexDirection:"column",alignItems:"center",gap:1,fontFamily:FONT}}>
                <span style={{fontSize:12}}>{ico}</span>{lbl}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── PHONE SHELL ───────────────────────────────────────── */
  function PhonePreview() {
    const plats = selPost ? getPiattaforme(selPost) : [];
    const activePlat = plats.includes(previewPlat) ? previewPlat : (plats[0]||"instagram");

    return (
      <div style={{position:"sticky",top:72}}>
        <div style={{background:"#111",borderRadius:32,padding:"10px 8px",boxShadow:"0 8px 40px rgba(0,0,0,.28)",maxWidth:340,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
            <div style={{width:80,height:5,background:"#333",borderRadius:3}}/>
          </div>
          <div style={{background:"#fff",borderRadius:22,overflow:"hidden",minHeight:560,display:"flex",flexDirection:"column"}}>

            {/* ── GRIGLIA (no post selezionato) ── */}
            {!selPost && (<>
              <div style={{padding:"10px 12px 6px",borderBottom:"1px solid #F0F0F0",display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:C.verde,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontWeight:800,fontSize:9}}>{(clienteNome||"N")[0]}</span></div>
                <span style={{fontWeight:700,fontSize:11,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{clienteNome||"Account"}</span>
                <div style={{display:"flex",gap:7}}>
                  <div style={{width:16,height:16,borderRadius:3,border:"1.5px solid #333",display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={9}/></div>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>{[0,1,2].map(i=><div key={i} style={{width:14,height:1.3,background:"#333",borderRadius:1}}/>)}</div>
                </div>
              </div>
              <div style={{padding:"9px 12px",display:"flex",justifyContent:"space-around",borderBottom:"1px solid #F0F0F0",flexShrink:0}}>
                {[{n:feed.length,l:"Post"},{n:"—",l:"Follower"},{n:"—",l:"Seguiti"}].map(s=>(
                  <div key={s.l} style={{textAlign:"center"}}>
                    <div style={{fontSize:13,fontWeight:800}}>{s.n}</div>
                    <div style={{fontSize:8,color:C.muted}}>{s.l}</div>
                  </div>
                ))}
              </div>
              {!feed.length
                ? <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,fontSize:11,flexDirection:"column",gap:6}}><span style={{fontSize:24}}>📷</span>Nessun post</div>
                : <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1.5,padding:"1.5px",alignContent:"start"}}>
                    {feed.map(post => {
                      const { src, isVideo } = getMainImg(post);
                      const isSel = post.id===selId;
                      const isDraft = post.stato==="bozza";
                      const isAppr  = post.stato==="approvato";
                      const isRej   = post.stato==="non-approvato";
                      const isCarousel = post.tipo==="carousel";
                      const isReel     = post.tipo==="reel";
                      return (
                        <div key={post.id} onClick={()=>{setSelId(isSel?null:post.id);setPreviewPlat(getPiattaforme(post)[0]||"instagram");}}
                          style={{aspectRatio:"1",position:"relative",cursor:"pointer",overflow:"hidden",outline:isSel?"2.5px solid "+C.verde:"none",outlineOffset:"-2.5px"}}>
                          <div style={{position:"absolute",inset:0,background:src?"#000":"linear-gradient(135deg,"+(post.colori?.[0]||"#2C3E50")+","+(post.colori?.[1]||"#3498DB")+")",display:"flex",alignItems:"center",justifyContent:"center"}}>
                            {isVideo&&src?<video src={src} muted style={{width:"100%",height:"100%",objectFit:"cover"}}/>:src?<img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}><span style={{fontSize:10,opacity:.5}}>{isReel?"🎬":"📷"}</span><span style={{color:"rgba(255,255,255,.6)",fontSize:5,fontWeight:700,textAlign:"center",padding:"0 2px"}}>{post.titolo}</span></div>}
                          </div>
                          {isDraft&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.2)"}}/>}
                          {isRej&&<div style={{position:"absolute",inset:0,background:"rgba(194,24,91,.1)"}}/>}
                          {isCarousel&&<div style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,.5)",borderRadius:2,padding:"1px 3px"}}><span style={{fontSize:5,color:"#fff",fontWeight:700}}>1/{(post.immagini||[]).length}</span></div>}
                          {isReel&&<div style={{position:"absolute",top:2,left:2}}><span style={{fontSize:8}}>▶️</span></div>}
                          {isDraft&&<div style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,.55)",borderRadius:2,padding:"1px 3px"}}><span style={{fontSize:5,color:"#fff",fontWeight:700}}>BOZZA</span></div>}
                          {isAppr&&<div style={{position:"absolute",top:2,right:2,background:"rgba(21,101,192,.8)",borderRadius:2,padding:"1px 3px"}}><span style={{fontSize:5,color:"#fff",fontWeight:700}}>OK</span></div>}
                          {isRej&&<div style={{position:"absolute",top:2,right:2,background:"rgba(194,24,91,.85)",borderRadius:2,padding:"1px 3px"}}><span style={{fontSize:5,color:"#fff",fontWeight:700}}>❌</span></div>}
                        </div>
                      );
                    })}
                  </div>
              }
            </>)}

            {/* ── POST DETAIL (post selezionato) ── */}
            {selPost && (<>
              <PlatformTabs post={selPost}/>
              {activePlat==="instagram" && <InstaPostPreview post={selPost}/>}
              {activePlat==="facebook"  && <FBPostPreview   post={selPost}/>}
              {activePlat==="tiktok"    && <TikTokPreview   post={selPost}/>}
              {activePlat==="linkedin"  && <LinkedInPreview post={selPost}/>}
            </>)}
          </div>
        </div>

        <div style={{textAlign:"center",marginTop:10,fontSize:10,color:C.muted,lineHeight:1.7}}>
          <div>{selPost?"← torna alla griglia":"Clicca un post per vederlo"}</div>
        </div>
      </div>
    );
  }

  /* ── MAIN RENDER ───────────────────────────────────────── */
  return (
    <div style={{display:"grid",gridTemplateColumns:noPreview?"1fr":"1fr 360px",gap:20,alignItems:"start"}}>

      {/* LEFT: EDITOR */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:14,fontWeight:700}}>Post nel feed ({feed.length})</span>
          {isAdmin && (
            <button onClick={addPost} style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"7px 13px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:FONT}}>
              <Plus size={12}/> Aggiungi
            </button>
          )}
        </div>

        {!feed.length && (
          <div style={{textAlign:"center",padding:48,color:C.muted,border:"1.5px dashed "+C.border,borderRadius:12}}>
            <div style={{fontSize:28,marginBottom:8}}>🖼</div>
            <p style={{margin:0,fontSize:13}}>Nessun post. Aggiungine uno.</p>
          </div>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {feed.map((post, i) => {
            const { src, isVideo } = getMainImg(post);
            const isSel  = post.id === selId;
            const plats  = getPiattaforme(post);
            const isCarousel = post.tipo==="carousel";
            const isReel     = post.tipo==="reel";

            return (
              <div key={post.id}
                onClick={() => setSelId(isSel?null:post.id)}
                onDragOver={e=>{e.preventDefault();setDragOver(post.id);}}
                onDragLeave={()=>setDragOver(null)}
                onDrop={e=>{e.preventDefault();setDragOver(null);if(e.dataTransfer.files[0]&&post.tipo!=="reel")handleImgFile(post.id,e.dataTransfer.files[0],isCarousel);}}
                style={{background:"#fff",border:"2px solid "+(dragOver===post.id?"#8E44AD":isSel?C.verde:C.border),
                  borderRadius:12,padding:16,display:"flex",gap:14,alignItems:"flex-start",cursor:"pointer",
                  transition:"border-color .15s",boxShadow:isSel?"0 0 0 3px "+C.verde+"22":"none"}}>

                {/* thumb */}
                <div onClick={e=>{e.stopPropagation();if(isAdmin)isReel?triggerVideo(post.id):triggerImg(post.id,isCarousel);}}
                  title={isAdmin?(isReel?"Carica video":"Clicca per caricare"):""}
                  style={{width:68,height:68,borderRadius:9,flexShrink:0,overflow:"hidden",position:"relative",
                    background:src?"#000":"linear-gradient(135deg,"+(post.colori?.[0]||"#2C3E50")+","+(post.colori?.[1]||"#3498DB")+")",
                    display:"flex",alignItems:"center",justifyContent:"center",cursor:isAdmin?"pointer":"default",flexDirection:"column",gap:2}}>
                  {uploading[post.id]
                    ? (
                      <>
                        <style>{`@keyframes dbx-spin{to{transform:rotate(360deg)}}`}</style>
                        <div style={{width:20,height:20,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"dbx-spin .7s linear infinite"}}/>
                        <span style={{color:"rgba(255,255,255,.8)",fontSize:7,fontWeight:700,textAlign:"center"}}>Dropbox</span>
                      </>
                    )
                    : isVideo&&src?<video src={src} muted style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : src?<img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <><span style={{color:"rgba(255,255,255,.7)",fontSize:18}}>{isReel?"🎬":"📷"}</span>{isAdmin&&<span style={{color:"rgba(255,255,255,.6)",fontSize:7,fontWeight:700}}>Carica</span>}{!isAdmin&&<span style={{color:"rgba(255,255,255,.8)",fontSize:10,fontWeight:800}}>#{i+1}</span>}</>
                  }
                  {isAdmin&&src&&!isVideo&&!uploading[post.id]&&(
                    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0)",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:9,transition:"background .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.4)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0)"}>
                      <span style={{color:"#fff",fontSize:14}}>📷</span>
                    </div>
                  )}
                  {post.fromPedId&&<div style={{position:"absolute",bottom:2,right:2,background:"rgba(106,27,154,.85)",borderRadius:2,padding:"1px 3px"}}><span style={{fontSize:5,color:"#fff",fontWeight:800}}>PED</span></div>}
                  {isCarousel&&(post.immagini||[]).length>0&&<div style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,.55)",borderRadius:2,padding:"1px 3px"}}><span style={{fontSize:6,color:"#fff",fontWeight:700}}>1/{(post.immagini||[]).length}</span></div>}
                  {isReel&&<div style={{position:"absolute",top:2,left:2}}><span style={{fontSize:10}}>▶️</span></div>}
                </div>

                <div style={{flex:1,minWidth:0}}>
                  {/* titolo */}
                  {isAdmin&&isSel ? (
                    <input value={post.titolo||""} onClick={e=>e.stopPropagation()} onChange={e=>updPost(post.id,"titolo",e.target.value)}
                      placeholder="Titolo post"
                      style={{border:"none",borderBottom:"1px solid "+C.border,fontSize:13,fontWeight:700,fontFamily:FONT,width:"100%",padding:"0 0 5px",marginBottom:8,background:"transparent",outline:"none"}}/>
                  ) : (
                    <div>
                      <div style={{fontWeight:700,fontSize:13,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{post.titolo||"—"}</div>
                      {post.stato==="non-approvato"&&post.noteRifiuto&&!isSel&&(
                        <div style={{background:"#FFF0F0",border:"1px solid "+C.magenta+"33",borderRadius:5,padding:"5px 8px",marginBottom:4}}>
                          <div style={{fontSize:9,fontWeight:700,color:C.magenta,marginBottom:1}}>❌ Motivo rifiuto</div>
                          <div style={{fontSize:10,color:C.testo,lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{post.noteRifiuto}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* piattaforme + stato + data (collapsed) */}
                  {(!isAdmin||!isSel) && (
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                        {plats.map(k=>{const p=PIATTAFORME[k];return p?<span key={k} style={{fontSize:9,fontWeight:700,color:p.color}}>{p.label}</span>:null;})}
                        {post.tipo&&post.tipo!=="post"&&<span style={{fontSize:9,background:C.sfondo,padding:"1px 5px",borderRadius:3,fontWeight:700,color:C.muted}}>{post.tipo==="carousel"?"📸":"🎬"} {post.tipo}</span>}
                        {post.stato==="approvato"
                          ? <span style={{background:"#E8F5E9",color:C.verde,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:800}}>✅ Approvato</span>
                          : post.stato==="non-approvato"
                          ? <span style={{background:"#FFF0F0",color:C.magenta,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:800}}>❌ Non approvato</span>
                          : <Badge stato={post.stato}/>}
                        <span style={{fontSize:9,color:C.muted}}>{post.data}</span>
                      </div>
                      {/* Rejection note always visible */}
                      {post.stato==="non-approvato"&&post.noteRifiuto&&(
                        <div style={{background:"#FFF0F0",border:"1px solid "+C.magenta+"44",borderRadius:6,padding:"7px 10px"}}>
                          <div style={{fontSize:10,fontWeight:800,color:C.magenta,marginBottom:3}}>💬 Motivo del cliente</div>
                          <div style={{fontSize:11,color:C.testo,lineHeight:1.5}}>{post.noteRifiuto}</div>
                        </div>
                      )}
                      {post.stato==="approvato"&&(
                        <div style={{fontSize:10,color:C.verde,fontWeight:700}}>
                          ✅ Approvato dal cliente
                        </div>
                      )}
                      {/* Team avatars in collapsed view */}
                      {(()=>{
                        const ids = Array.isArray(post.memberIds) ? post.memberIds : (post.memberId ? [post.memberId] : []);
                        const sel = teamMembers.filter(m => ids.includes(m.id));
                        if (!sel.length) return null;
                        return (
                          <div style={{display:"flex",gap:3,marginTop:4,alignItems:"center"}}>
                            {sel.map(m => (
                              <div key={m.id} title={m.nome}
                                style={{width:20,height:20,borderRadius:"50%",background:m.colore,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}>
                                <span style={{color:"#fff",fontWeight:800,fontSize:8}}>{m.nome[0]}</span>
                              </div>
                            ))}
                            <span style={{fontSize:10,color:C.muted,marginLeft:3}}>{sel.map(m=>m.nome.split(" ")[0]).join(", ")}</span>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* EXPANDED PANEL */}
                  {isAdmin&&isSel&&(
                    <div onClick={e=>e.stopPropagation()} style={{marginTop:10}}>
                      {/* tipo */}
                      <TipoTabs post={post}/>

                      {/* piattaforme multi-select */}
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Piattaforme</div>
                        <PlatformPills post={post}/>
                      </div>

                      {/* stato + data */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                        <select value={post.stato||"bozza"} onChange={e=>updPost(post.id,"stato",e.target.value)}
                          style={{...inpF,padding:"5px 7px",background:post.stato==="non-approvato"?"#FFF0F0":"",color:post.stato==="non-approvato"?C.magenta:"",fontWeight:post.stato==="non-approvato"?700:400}}>
                          <option value="bozza">Bozza</option>
                          <option value="approvato">✅ Approvato</option>
                          <option value="non-approvato">❌ Non approvato</option>
                          <option value="pubblicato">📢 Pubblicato</option>
                        </select>
                        <input type="date" value={post.data||""} onChange={e=>updPost(post.id,"data",e.target.value)} style={{...inpF,padding:"5px 7px"}}/>
                      </div>

                      {/* NON APPROVATO reason */}
                      {post.stato==="non-approvato"&&(
                        <div style={{marginBottom:10,background:"#FFF0F0",border:"1px solid "+C.magenta+"44",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:C.magenta,marginBottom:6}}>❌ Motivazione rifiuto</div>
                          <textarea value={post.noteRifiuto||""} onChange={e=>updPost(post.id,"noteRifiuto",e.target.value)} rows={2}
                            placeholder="Spiega cosa deve essere modificato..."
                            style={{width:"100%",boxSizing:"border-box",border:"1px solid "+C.magenta+"55",borderRadius:6,padding:"7px 10px",fontSize:12,fontFamily:FONT,resize:"vertical",lineHeight:1.6,background:"#fff"}}/>
                        </div>
                      )}

                      {/* media section */}
                      {post.tipo==="carousel" && <CarouselEditor post={post}/>}
                      {post.tipo==="reel"     && <ReelEditor post={post}/>}
                      {post.tipo==="storia"   && <SingleImgEditor post={post}/>}
                      {post.tipo==="post"     && <SingleImgEditor post={post}/>}

                      {/* ── TEAM ASSIGNMENT ── */}
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>👥 Team assegnato</div>
                        <div style={{position:"relative"}}>
                          {/* Selected avatars + toggle button */}
                          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                            {(()=>{
                              const ids = Array.isArray(post.memberIds) ? post.memberIds : (post.memberId ? [post.memberId] : []);
                              const selected = teamMembers.filter(m => ids.includes(m.id));
                              return (<>
                                {selected.map(m => (
                                  <div key={m.id} title={m.nome}
                                    style={{display:"flex",alignItems:"center",gap:5,background:m.colore+"18",
                                      border:"1.5px solid "+m.colore,borderRadius:20,padding:"3px 10px 3px 6px",cursor:"pointer"}}
                                    onClick={e=>{e.stopPropagation();toggleMember(post.id,m.id);}}>
                                    <div style={{width:18,height:18,borderRadius:"50%",background:m.colore,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                      <span style={{color:"#fff",fontWeight:800,fontSize:8}}>{m.nome[0]}</span>
                                    </div>
                                    <span style={{fontSize:11,fontWeight:700,color:m.colore}}>{m.nome.split(" ")[0]}</span>
                                    <span style={{fontSize:10,color:m.colore,opacity:.7}}>×</span>
                                  </div>
                                ))}
                                <button onClick={e=>{e.stopPropagation();setTeamOpen(p=>({...p,[post.id]:!p[post.id]}));}}
                                  style={{background:"#F5F5F5",border:"1.5px dashed #CCC",borderRadius:20,padding:"4px 12px",
                                    fontSize:11,fontWeight:700,cursor:"pointer",color:C.muted,fontFamily:FONT,
                                    display:"flex",alignItems:"center",gap:4}}>
                                  {selected.length ? "+ Aggiungi" : "+ Assegna team"}
                                </button>
                              </>);
                            })()}
                          </div>
                          {/* Dropdown picker */}
                          {teamOpen[post.id] && (
                            <div onClick={e=>e.stopPropagation()}
                              style={{position:"absolute",top:"100%",left:0,zIndex:200,marginTop:4,
                                background:"#fff",border:"1px solid "+C.border,borderRadius:10,
                                boxShadow:"0 8px 24px rgba(0,0,0,.12)",padding:8,minWidth:220,maxHeight:260,overflowY:"auto"}}>
                              <div style={{fontSize:10,fontWeight:700,color:C.muted,padding:"2px 6px 8px",textTransform:"uppercase",letterSpacing:.5}}>
                                Seleziona membri (multiplo)
                              </div>
                              {teamMembers.map(m => {
                                const ids = Array.isArray(post.memberIds) ? post.memberIds : (post.memberId ? [post.memberId] : []);
                                const isSel = ids.includes(m.id);
                                return (
                                  <div key={m.id} onClick={()=>toggleMember(post.id,m.id)}
                                    style={{display:"flex",alignItems:"center",gap:9,padding:"7px 8px",borderRadius:7,cursor:"pointer",
                                      background:isSel?m.colore+"12":"transparent",transition:"background .1s"}}>
                                    <div style={{width:24,height:24,borderRadius:"50%",background:m.colore,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                      <span style={{color:"#fff",fontWeight:800,fontSize:10}}>{m.nome[0]}</span>
                                    </div>
                                    <div style={{flex:1}}>
                                      <div style={{fontSize:12,fontWeight:700,color:isSel?m.colore:C.testo}}>{m.nome}</div>
                                      <div style={{fontSize:10,color:C.muted}}>{m.ruolo}</div>
                                    </div>
                                    {isSel && <span style={{fontSize:14,color:m.colore}}>✓</span>}
                                  </div>
                                );
                              })}
                              <button onClick={e=>{e.stopPropagation();setTeamOpen(p=>({...p,[post.id]:false}));}}
                                style={{width:"100%",marginTop:6,background:C.verde,color:"#fff",border:"none",borderRadius:7,
                                  padding:"7px 0",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
                                Fatto ✓
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* caption */}
                      <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Caption</div>
                      <textarea value={post.caption||""} rows={3} onChange={e=>updPost(post.id,"caption",e.target.value)}
                        placeholder="Caption, hashtag..."
                        style={{...inpF,resize:"vertical",lineHeight:1.6,fontSize:12,marginBottom:12}}/>

                      {/* ── EXTRA FIELDS ── */}
                      <div style={{borderTop:"1px solid "+C.border,paddingTop:12,display:"flex",flexDirection:"column",gap:10}}>

                        {/* CTA */}
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          <div>
                            <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>📣 CTA (Call to Action)</div>
                            <select value={post.cta||""} onChange={e=>updPost(post.id,"cta",e.target.value)} style={{...inpF,padding:"6px 8px"}}>
                              <option value="">— Nessuna CTA —</option>
                              <option value="Scopri di più">Scopri di più</option>
                              <option value="Acquista ora">Acquista ora</option>
                              <option value="Prenota">Prenota</option>
                              <option value="Contattaci">Contattaci</option>
                              <option value="Registrati">Registrati</option>
                              <option value="Vai al link in bio">Vai al link in bio</option>
                              <option value="Swipe up">Swipe up</option>
                              <option value="Guarda il video">Guarda il video</option>
                              <option value="Condividi">Condividi</option>
                              <option value="Commenta">Commenta</option>
                              <option value="custom">✏️ Personalizzata...</option>
                            </select>
                            {post.cta==="custom" && (
                              <input value={post.ctaCustom||""} onChange={e=>updPost(post.id,"ctaCustom",e.target.value)}
                                placeholder="Scrivi la tua CTA..."
                                style={{...inpF,marginTop:5,fontSize:11}}/>
                            )}
                          </div>

                          {/* Link */}
                          <div>
                            <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>🔗 Link da inserire</div>
                            <input value={post.linkUrl||""} onChange={e=>updPost(post.id,"linkUrl",e.target.value)}
                              placeholder="https://..."
                              style={{...inpF,fontSize:11}}/>
                            {post.linkUrl && (
                              <input value={post.linkLabel||""} onChange={e=>updPost(post.id,"linkLabel",e.target.value)}
                                placeholder="Etichetta link (es. 'landing page evento')"
                                style={{...inpF,marginTop:5,fontSize:10,color:C.muted}}/>
                            )}
                          </div>
                        </div>

                        {/* Collaborazioni */}
                        <div>
                          <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>🤝 Collaborazioni</div>
                          <input value={post.collaborazioni||""} onChange={e=>updPost(post.id,"collaborazioni",e.target.value)}
                            placeholder="@account1, @account2 — profili da taggare come collaboratori"
                            style={{...inpF,fontSize:11}}/>
                        </div>

                        {/* Tag */}
                        <div>
                          <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>🏷 TAG (menzioni)</div>
                          <input value={post.tags||""} onChange={e=>updPost(post.id,"tags",e.target.value)}
                            placeholder="@persona1, @brand2 — profili da taggare nel post"
                            style={{...inpF,fontSize:11}}/>
                          <div style={{fontSize:9,color:C.muted,marginTop:3}}>Separati da virgola</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Publish button — visible to admin, shown when post has platforms */}
                {isAdmin && (
                  <button
                    onClick={e => { e.stopPropagation(); setPublishPost(post); }}
                    title="Pubblica su Instagram / Facebook"
                    style={{ background: "none", border: "1px solid " + C.border, borderRadius: 5, cursor: "pointer", color: C.testo, padding: "2px 7px", flexShrink: 0, fontSize: 11, fontWeight: 700, fontFamily: FONT, display: "flex", alignItems: "center", gap: 3 }}>
                    📢
                  </button>
                )}
                {isAdmin&&(
                  <button onClick={e=>{e.stopPropagation();delPost(post.id);}}
                    style={{background:"none",border:"none",cursor:"pointer",color:C.magenta,padding:"2px",flexShrink:0}}>
                    <Trash2 size={14}/>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: PHONE PREVIEW */}
      {!noPreview && <PhonePreview/>}

      {/* PUBLISH MODAL */}
      {publishPost && (
        <PublishModal
          post={publishPost}
          meta={metaData}
          onClose={() => setPublishPost(null)}
          onPublished={(newStato) => {
            // Update post status in feed
            setFeed(prev => prev.map(p => p.id === publishPost.id ? { ...p, stato: newStato } : p));
            schedSave();
          }}
        />
      )}
    </div>
  );
}



/* ─────────────────────────────────────────────────────────── */
/*  UNIFIED CLIENT                                              */
/* ─────────────────────────────────────────────────────────── */
function UnifiedClient({ slug, isAdmin }) {
  const [cliente,  setCliente]  = useState(null);
  const [progress, setProgress] = useState(null);
  const [feed,     setFeed]     = useState(null);
  const [docs,     setDocs]     = useState(null);
  const [setup,    setSetup]    = useState(null);
  const [ped,      setPed]      = useState([]);
  const [kpi,      setKpi]      = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [tab,      setTab]      = useState("ped");
  const [mesePed,  setMesePed]  = useState(() => {
    const n = new Date(); return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0");
  });
  const [meseKpi,  setMeseKpi]  = useState("2026-10");
  const [pedView,  setPedView]  = useState("lista"); // "lista" | "calendario" | "kanban" | "stories" | "pilastri"
  const [members,  setMembers]  = useState([]);
  const [err,      setErr]      = useState(null);
  // admin info edit
  const [showInfo, setShowInfo] = useState(false);
  const inp = {width:"100%",boxSizing:"border-box",border:"1px solid "+C.border,borderRadius:6,padding:"8px 12px",fontSize:14,fontFamily:FONT};
  const lbl = {fontSize:12,fontWeight:700,display:"block",marginBottom:4};

  useEffect(() => {
    store.get("team:members").then(m => setMembers(m || DEFAULT_MEMBERS));
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const c = await store.get("clients:"+slug);
      if (!c) { setErr("Cliente non trovato"); setLoading(false); return; }
      setCliente(c);
      const [p, f, d, s] = await Promise.all([
        store.get("clients:"+slug+":progress"),
        store.get("clients:"+slug+":feed"),
        store.get("clients:"+slug+":docs"),
        store.get("clients:"+slug+":setup"),
      ]);
      setProgress(p||{}); setFeed(f||[]); setDocs(d||[]); setSetup(s||null);
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => { store.get("clients:"+slug+":ped:"+mesePed).then(p => setPed(p||[])); }, [slug, mesePed]);
  useEffect(() => { store.get("clients:"+slug+":kpi:"+meseKpi).then(k => setKpi(k||null)); }, [slug, meseKpi]);

  // Refs per evitare stale closure in saveAll
  const clienteRef  = React.useRef(null);
  const progressRef = React.useRef(null);
  const feedRef     = React.useRef(null);
  const docsRef     = React.useRef(null);
  const setupRef    = React.useRef(null);
  const pedRef      = React.useRef(null);
  const kpiRef      = React.useRef(null);

  useEffect(() => { clienteRef.current  = cliente;  }, [cliente]);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { feedRef.current     = feed;     }, [feed]);
  useEffect(() => { docsRef.current     = docs;     }, [docs]);
  useEffect(() => { setupRef.current    = setup;    }, [setup]);
  useEffect(() => { pedRef.current      = ped;      }, [ped]);
  useEffect(() => { kpiRef.current      = kpi;      }, [kpi]);

  // refs per mesePed/meseKpi per evitare stale closure
  const mesePedRef   = React.useRef(mesePed);
  const meseKpiRef   = React.useRef(meseKpi);
  useEffect(() => { mesePedRef.current = mesePed; }, [mesePed]);
  useEffect(() => { meseKpiRef.current = meseKpi; }, [meseKpi]);

  const saveTimerRef = React.useRef(null);

  async function saveAll() {
    if (!isAdmin) return;
    const c  = clienteRef.current;
    const pr = progressRef.current;
    const f  = feedRef.current;
    const d  = docsRef.current;
    const s  = setupRef.current;
    const p  = pedRef.current;
    const k  = kpiRef.current;
    const mp = mesePedRef.current;
    const mk = meseKpiRef.current;
    if (!c) return;
    setSaving(true);
    await Promise.all([
      store.set("clients:"+slug, c),
      store.set("clients:"+slug+":progress", pr||{}),
      store.set("clients:"+slug+":feed", f||[]),
      store.set("clients:"+slug+":docs", d||[]),
      store.set("clients:"+slug+":setup", s||{}),
      store.set("clients:"+slug+":ped:"+mp, p||[]),
    ]);
    if (k) await store.set("clients:"+slug+":kpi:"+mk, k);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function schedSave() {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(saveAll, 900);
  }

  function updSetup(field, value) {
    setSetup(prev => {
      const cur = prev || {stato:"in-corso",importo:0,dataFirma:"",note:"",moduli:{},assegnati:{}};
      if (field.startsWith("modulo_")) {
        const modId = field.replace("modulo_","");
        return {...cur, moduli:{...(cur.moduli||{}), [modId]:value}};
      }
      if (field.startsWith("assegna_setup_")) {
        const modId = field.replace("assegna_setup_","");
        return {...cur, assegnati:{...(cur.assegnati||{}), [modId]:value}};
      }
      return {...cur, [field]:value};
    });
    schedSave();
  }

  function updModulo(fId, mId, stato) {
    setProgress(prev => {
      const np = {...prev};
      if (!np[fId]) np[fId] = {percentuale:0, moduli:{}, assegnati:{}};
      if (String(mId).startsWith("assegna_")) {
        const realModId = String(mId).replace("assegna_","");
        const curA = np[fId].assegnati || {};
        if (stato && stato.length > 0) {
          np[fId] = {...np[fId], assegnati:{...curA, [realModId]: Array.isArray(stato) ? stato : [stato]}};
        } else {
          const a = {...curA}; delete a[realModId];
          np[fId] = {...np[fId], assegnati:a};
        }
        return np;
      }
      np[fId] = {...np[fId], moduli:{...np[fId].moduli,[mId]:stato}};
      const fase = FASI.find(f => f.id===fId);
      if (fase) {
        const tot  = fase.moduli.length;
        const done = fase.moduli.filter(m => np[fId].moduli[m.id]==="completo").length;
        np[fId].percentuale = Math.round(done/tot*100);
      }
      return np;
    });
    schedSave();
  }

  function updPed(id, f, v) {
    setPed(p => p.map(x => x.id===id?{...x,[f]:v}:x));
    // sincronizza con feed quando stato → "feed"
    if (f === "stato") {
      const pedEntry = (pedRef.current||[]).find(x => x.id===id);
      if (v === "feed" && pedEntry) {
        // aggiungi al feed se non già presente
        const fid = "ped_"+id;
        const curFeed = feedRef.current || [];
        if (!curFeed.find(x => x.id===fid)) {
          const newEntry = {
            id: fid,
            titolo: pedEntry.titolo || "",
            piattaforma: pedEntry.piattaforma || "instagram",
            stato: "pubblicato",
            data: pedEntry.data || "",
            caption: "",
            immagineUrl: "",
            colori: POST_COLORS[curFeed.length % POST_COLORS.length],
            fromPedId: id,
          };
          setFeed(prev => [...prev, newEntry]);
        }
      } else if (v !== "feed") {
        // rimuovi dal feed se era stato aggiunto automaticamente
        const fid = "ped_"+id;
        setFeed(prev => prev.filter(x => x.id!==fid));
      }
    }
    schedSave();
  }
  function addPed() {
    const np = [...(pedRef.current||[]), {id:"ped"+Date.now(),data:mesePed+"-01",piattaforma:"instagram",titolo:"Nuovo contenuto",stato:"idea",formato:"post",pilastro:"",memberId:""}];
    setPed(np); schedSave();
  }
  function delPed(id) {
    const np = (pedRef.current||[]).filter(x => x.id!==id);
    setPed(np); schedSave();
  }

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.sfondo,fontFamily:FONT}}><Spinner/></div>;
  if (err) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.sfondo,fontFamily:FONT,flexDirection:"column",gap:12}}><AlertCircle size={32} style={{color:C.magenta}}/><p style={{fontWeight:700}}>{err}</p></div>;

  const pac       = PACCHETTI[cliente.pacchetto] || PACCHETTI.professional;
  const fasePercs = Object.values(progress||{}).map(f => f.percentuale||0);
  const overall   = fasePercs.length ? Math.round(fasePercs.reduce((a,b)=>a+b,0)/fasePercs.length) : 0;

  const MAIN_TABS = [
    {id:"cliente",  label:"👤 Cliente"},
    {id:"ped",      label:"📅 Contenuti"},
    {id:"setup",    label:"⚡ Setup"},
    {id:"progress", label:"🔍 Progetto"},
    {id:"documenti",label:"📁 Documenti"},
    {id:"kpi",      label:"📊 Report"},
  ];

  const PED_VIEWS = [
    {id:"lista",     label:"Feed"},
    {id:"calendario",label:"Calendario"},
    {id:"kanban",    label:"Kanban"},
    {id:"stories",   label:"Stories"},
  ];

  // stories = solo formato storia
  const storiesOnly = ped.filter(p => p.formato==="storia");

  return (
    <div style={{minHeight:"100vh",background:C.sfondo,fontFamily:FONT,color:C.testo}}>

      {/* ── TOP BAR ───────────────────────────────────────── */}
      <style>{`
        @media(max-width:640px){
          .ns-uc-name{font-size:13px!important}
          .ns-uc-sub{display:none!important}
          .ns-uc-prog{display:none!important}
          .ns-uc-save span{display:none!important}
          .ns-main-tab{padding:0 10px!important;font-size:11px!important}
          .ns-sub-tab{padding:6px 8px!important;font-size:10px!important}
          .ns-info-grid{grid-template-columns:1fr!important}
          .ns-info-pin{grid-template-columns:1fr!important}
        }
      `}</style>
      <div style={{background:"#111",borderBottom:"1px solid rgba(255,255,255,.08)",padding:"0 20px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100,minHeight:56,boxShadow:"0 2px 12px rgba(0,0,0,.18)"}}>
        <button onClick={() => { sessionStorage.setItem("nassa_adminTab","clienti"); nav("/admin"); }}
          style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:FONT,flexShrink:0,padding:"4px 0"}}>
          <ArrowLeft size={14}/> <span style={{fontSize:11}}>Clienti</span>
        </button>
        <div style={{width:1,height:20,background:"rgba(255,255,255,.12)",flexShrink:0}}/>
        {/* avatar + nome */}
        <div style={{width:32,height:32,background:C.verde,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{color:"#fff",fontWeight:900,fontSize:14}}>{(cliente.nome||"N")[0]}</span>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div className="ns-uc-name" style={{fontWeight:800,fontSize:15,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cliente.nome}</div>
          <div className="ns-uc-sub" style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>{pac.label} · {overall}% completato</span>
            {[
              {key:"socialInstagram",label:"IG",color:"#E1306C",prefix:"https://instagram.com/"},
              {key:"socialFacebook", label:"FB",color:"#1877F2",prefix:"https://facebook.com/"},
              {key:"socialLinkedin", label:"LI",color:"#0A66C2",prefix:"https://linkedin.com/"},
              {key:"socialTiktok",   label:"TK",color:"#111",   prefix:"https://tiktok.com/"},
              {key:"socialWeb",      label:"🌐",color:"#555",   prefix:""},
            ].filter(sn=>cliente[sn.key]).map(sn=>{
              let href=cliente[sn.key];
              if(!href.startsWith("http")&&sn.prefix) href=sn.prefix+href.replace(/^@/,"");
              return (
                <a key={sn.key} href={href} target="_blank" rel="noreferrer"
                  style={{background:sn.color,color:"#fff",padding:"1px 7px",borderRadius:10,fontSize:9,fontWeight:700,textDecoration:"none",opacity:.85}}>
                  {sn.label}
                </a>
              );
            })}
          </div>
        </div>
        {/* progress bar */}
        <div className="ns-uc-prog" style={{width:80,height:4,background:"rgba(255,255,255,.1)",borderRadius:3,overflow:"hidden",flexShrink:0}}>
          <div style={{height:"100%",width:overall+"%",background:C.verde,borderRadius:3,transition:"width .4s"}}/>
        </div>
        {isAdmin && (
          <button className="ns-uc-save" onClick={saveAll} disabled={saving}
            style={{background:saved?"#27AE60":C.verde,color:"#fff",border:"none",borderRadius:7,padding:"8px 14px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:FONT,flexShrink:0}}>
            {saved?<Check size={13}/>:null} <span>{saving?"...":saved?"Salvato":"Salva"}</span>
          </button>
        )}
      </div>


      {/* ── MAIN TABS ─────────────────────────────────────── */}
      <div style={{background:C.white,borderBottom:"1px solid "+C.border,display:"flex",overflowX:"auto",padding:"0 8px"}}>
        {MAIN_TABS.map(t => (
          <button key={t.id} className="ns-main-tab" onClick={() => setTab(t.id)}
            style={{padding:"0 18px",height:46,fontSize:13,fontWeight:700,border:"none",background:"none",cursor:"pointer",fontFamily:FONT,
              color:tab===t.id?C.verde:C.muted,borderBottom:"3px solid "+(tab===t.id?C.verde:"transparent"),whiteSpace:"nowrap",flexShrink:0,transition:"color .15s"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SUB-VIEWS (solo tab contenuti) ─────────────── */}
      {tab==="ped" && (
        <div style={{background:"#FAFAFA",borderBottom:"1px solid "+C.border,display:"flex",overflowX:"auto",padding:"0 20px",gap:4}}>
          {PED_VIEWS.map(v => (
            <button key={v.id} className="ns-sub-tab" onClick={() => setPedView(v.id)}
              style={{padding:"8px 14px",fontSize:12,fontWeight:700,border:"none",background:"none",cursor:"pointer",fontFamily:FONT,
                color:pedView===v.id?C.testo:C.muted,borderBottom:"2px solid "+(pedView===v.id?C.testo:"transparent"),whiteSpace:"nowrap",flexShrink:0}}>
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* ── CONTENT ──────────────────────────────────────── */}
      <div style={{maxWidth:tab==="ped"&&pedView==="lista"?1200:900,margin:"0 auto",padding:"20px 16px"}}>

        {/* CLIENTE TAB */}
        {tab==="cliente" && isAdmin && cliente && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Client info fields */}
            <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:12,padding:24}}>
              <div style={{fontWeight:800,fontSize:15,marginBottom:18}}>📋 Informazioni cliente</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:16}}>
                <div><label style={lbl}>Nome</label><input style={inp} value={cliente.nome||""} onChange={e=>setCliente(p=>({...p,nome:e.target.value}))}/></div>
                <div><label style={lbl}>Referente</label><input style={inp} value={cliente.referente||""} onChange={e=>setCliente(p=>({...p,referente:e.target.value}))}/></div>
                <div><label style={lbl}>Email</label><input style={inp} type="email" value={cliente.email||""} onChange={e=>setCliente(p=>({...p,email:e.target.value}))}/></div>
                <div><label style={lbl}>Settore</label><input style={inp} value={cliente.settore||""} onChange={e=>setCliente(p=>({...p,settore:e.target.value}))}/></div>
                <div><label style={lbl}>Pacchetto</label>
                  <select style={inp} value={cliente.pacchetto||"professional"} onChange={e=>setCliente(p=>({...p,pacchetto:e.target.value}))}>
                    {Object.entries(PACCHETTI).map(([k,v])=><option key={k} value={k}>{v.label} — €{v.prezzo}/mese</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Data inizio</label><input style={inp} type="date" value={cliente.dataInizio||""} onChange={e=>setCliente(p=>({...p,dataInizio:e.target.value}))}/></div>
              </div>

              {/* ── SOCIAL MEDIA ──────────────────────────────── */}
              <div style={{borderTop:"1px solid "+C.border,paddingTop:16,marginBottom:4}}>
                <div style={{fontWeight:700,fontSize:12,marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:15}}>📲</span> Account social del cliente
                  <span style={{fontSize:10,color:C.muted,fontWeight:400}}>— usati per le pubblicazioni</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
                  {/* Instagram */}
                  <div>
                    <label style={{...lbl,display:"flex",alignItems:"center",gap:5}}>
                      <span style={{background:"#E1306C",color:"#fff",borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:700}}>IG</span> Instagram
                    </label>
                    <input style={inp} value={cliente.socialInstagram||""} placeholder="@username o URL profilo"
                      onChange={e=>setCliente(p=>({...p,socialInstagram:e.target.value}))}/>
                  </div>
                  {/* Facebook */}
                  <div>
                    <label style={{...lbl,display:"flex",alignItems:"center",gap:5}}>
                      <span style={{background:"#1877F2",color:"#fff",borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:700}}>FB</span> Facebook
                    </label>
                    <input style={inp} value={cliente.socialFacebook||""} placeholder="URL pagina o @username"
                      onChange={e=>setCliente(p=>({...p,socialFacebook:e.target.value}))}/>
                  </div>
                  {/* LinkedIn */}
                  <div>
                    <label style={{...lbl,display:"flex",alignItems:"center",gap:5}}>
                      <span style={{background:"#0A66C2",color:"#fff",borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:700}}>LI</span> LinkedIn
                    </label>
                    <input style={inp} value={cliente.socialLinkedin||""} placeholder="URL profilo o pagina"
                      onChange={e=>setCliente(p=>({...p,socialLinkedin:e.target.value}))}/>
                  </div>
                  {/* TikTok */}
                  <div>
                    <label style={{...lbl,display:"flex",alignItems:"center",gap:5}}>
                      <span style={{background:"#111",color:"#fff",borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:700}}>TK</span> TikTok
                    </label>
                    <input style={inp} value={cliente.socialTiktok||""} placeholder="@username o URL"
                      onChange={e=>setCliente(p=>({...p,socialTiktok:e.target.value}))}/>
                  </div>
                  {/* Website */}
                  <div>
                    <label style={{...lbl,display:"flex",alignItems:"center",gap:5}}>
                      <span style={{background:"#555",color:"#fff",borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:700}}>🌐</span> Sito web
                    </label>
                    <input style={inp} value={cliente.socialWeb||""} placeholder="https://..."
                      onChange={e=>setCliente(p=>({...p,socialWeb:e.target.value}))}/>
                  </div>
                </div>
                {/* Quick-open links */}
                {(cliente.socialInstagram||cliente.socialFacebook||cliente.socialLinkedin||cliente.socialTiktok||cliente.socialWeb) && (
                  <div style={{display:"flex",gap:7,marginTop:10,flexWrap:"wrap"}}>
                    <span style={{fontSize:10,color:C.muted,fontWeight:700,alignSelf:"center"}}>Apri:</span>
                    {[
                      {key:"socialInstagram",label:"Instagram",color:"#E1306C",prefix:"https://instagram.com/"},
                      {key:"socialFacebook", label:"Facebook", color:"#1877F2",prefix:"https://facebook.com/"},
                      {key:"socialLinkedin", label:"LinkedIn", color:"#0A66C2",prefix:"https://linkedin.com/"},
                      {key:"socialTiktok",   label:"TikTok",   color:"#111",   prefix:"https://tiktok.com/"},
                      {key:"socialWeb",      label:"Sito",     color:"#555",   prefix:""},
                    ].filter(s=>cliente[s.key]).map(s=>{
                      let href = cliente[s.key];
                      if (!href.startsWith("http") && s.prefix) href = s.prefix + href.replace(/^@/,"");
                      return (
                        <a key={s.key} href={href} target="_blank" rel="noreferrer"
                          style={{background:s.color,color:"#fff",padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>
                          {s.label} ↗
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{borderTop:"1px solid "+C.border,paddingTop:16,display:"grid",gridTemplateColumns:"180px 1fr",gap:12}}>
                <div>
                  <label style={lbl}>PIN cliente (opzionale)</label>
                  <input style={inp} type="password" value={cliente.pin||""} placeholder="es. 1234" onChange={e=>setCliente(p=>({...p,pin:e.target.value}))}/>
                  <div style={{fontSize:10,color:C.muted,marginTop:3}}>Protegge il link cliente</div>
                </div>
                <div>
                  <label style={lbl}>Link approvazione cliente</label>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{flex:1,border:"1px solid "+C.border,borderRadius:6,padding:"8px 12px",fontSize:12,color:C.muted,background:"#F9F9F9",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {window.location.href.split("#")[0]}#/c/{slug}
                    </div>
                    <button onClick={()=>{navigator.clipboard.writeText(window.location.href.split("#")[0]+"#/c/"+slug);setSaved(true);setTimeout(()=>setSaved(false),2000);}}
                      style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT,whiteSpace:"nowrap",flexShrink:0}}>
                      {saved?"✓ Copiato!":"📋 Copia link"}
                    </button>
                  </div>
                  <div style={{fontSize:10,color:C.muted,marginTop:3}}>Condividi con il cliente. Il PIN è separato.</div>
                </div>
              </div>
            </div>
            {/* Portal settings */}
            <PortalSettings slug={slug}/>
            {/* Meta connection */}
            <MetaConnectionSection slug={slug}/>
          </div>
        )}

        {/* FEED = editor cards + anteprima telefono (vista unificata) */}
        {tab==="ped" && pedView==="lista" && (
          <FeedWithPreview
            feed={feed} setFeed={setFeed} schedSave={schedSave}
            isAdmin={isAdmin} clienteNome={cliente?.nome||""} slug={slug}
          />
        )}

        {tab==="ped" && pedView==="calendario" && (
          <CalendarSection ped={ped} feed={feed} mese={mesePed} onMeseChange={setMesePed}/>
        )}
        {tab==="ped" && pedView==="kanban" && (
          <KanbanSection ped={ped} feed={feed} mese={mesePed} onMeseChange={setMesePed}/>
        )}
        {tab==="ped" && pedView==="stories" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <span style={{fontWeight:700,fontSize:14}}>Stories</span>
                <span style={{fontSize:11,color:C.muted,marginLeft:8}}>{storiesOnly.length} contenuti</span>
              </div>
              {isAdmin && (
                <button onClick={() => {
                  const np=[...ped,{id:"ped"+Date.now(),data:mesePed+"-01",piattaforma:"instagram",titolo:"Nuova storia",stato:"idea",formato:"storia",pilastro:"",memberId:""}];
                  setPed(np); schedSave();
                }} style={{background:"#6A1B9A",color:"#fff",border:"none",borderRadius:6,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:FONT}}>
                  <Plus size={12}/> Aggiungi storia
                </button>
              )}
            </div>
            {!storiesOnly.length ? (
              <div style={{textAlign:"center",padding:40,color:C.muted,border:"1.5px dashed "+C.border,borderRadius:10}}>
                <div style={{fontSize:28,marginBottom:8}}>📱</div>
                <p style={{margin:0,fontSize:13}}>Nessuna storia pianificata</p>
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                {storiesOnly.map(post => {
                  const pilC  = post.pilastro && PILASTRI[post.pilastro] ? PILASTRI[post.pilastro] : null;
                  const statoS= STATI_PED[post.stato] || STATI_PED.idea;
                  const mem   = members.find(m => m.id===post.memberId);
                  return (
                    <div key={post.id} style={{background:C.white,border:"1px solid "+(pilC?pilC.color+"66":C.border),borderRadius:10,overflow:"hidden"}}>
                      <div style={{aspectRatio:"9/16",maxHeight:200,background:pilC?"linear-gradient(180deg,"+pilC.color+" 0%,"+pilC.color+"88 100%)":"linear-gradient(180deg,#6A1B9A,#9C27B0)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16,position:"relative"}}>
                        <span style={{fontSize:24,marginBottom:8}}>📱</span>
                        <span style={{color:"#fff",fontWeight:700,fontSize:13,textAlign:"center",lineHeight:1.3}}>{post.titolo}</span>
                        <span style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,.2)",color:"#fff",padding:"2px 7px",borderRadius:10,fontSize:9,fontWeight:700}}>Storia</span>
                      </div>
                      <div style={{padding:"10px 12px"}}>
                        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
                          <span style={{background:statoS.bg,color:statoS.tx,padding:"2px 7px",borderRadius:5,fontSize:10,fontWeight:700}}>{statoS.label}</span>
                          {mem && <span style={{fontSize:10,color:C.muted}}>{mem.nome.split(" ")[0]}</span>}
                          <span style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{post.data}</span>
                          {isAdmin && <button onClick={()=>delPed(post.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.magenta,padding:0}}><Trash2 size={11}/></button>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab==="setup"    && <SetupSection setup={setup} isAdmin={isAdmin} onEdit={updSetup} clienteSlug={slug} members={members}/>}
        {tab==="progress" && <ProgressSection progress={progress} isAdmin={isAdmin} onEdit={updModulo} onOpenDocs={() => setTab("documenti")} clienteSlug={slug} members={members}/>}
        {tab==="documenti"&& <DocsSection docs={docs}/>}
        {tab==="kpi"      && <KPISection kpi={kpi} mese={meseKpi} onMeseChange={setMeseKpi}/>}
      </div>

      <div style={{textAlign:"center",padding:"20px 16px",color:C.muted,fontSize:11}}>
        <span style={{fontWeight:700,color:C.verde}}>NASSA STUDIO</span> · Modica (RG) · nassastudio.it
      </div>
    </div>
  );
}

/* thin wrappers backward compat */
function ClientView({ slug }) { return <UnifiedClient slug={slug} isAdmin={false}/>; }


/* ─────────────────────────────────────────────────────────── */
/*  TEAM PLANNER — costanti                                     */
/* ─────────────────────────────────────────────────────────── */
const DEFAULT_MEMBERS = [
  { id:"luca",     nome:"Luca Giunta",       ruolo:"Direzione Creativa",  colore:"#1A8C3F", tariffaMember:80, capacitaOre:40 },
  { id:"alberto",  nome:"Alberto Arcidiac.", ruolo:"Direzione Creativa",  colore:"#1565C0", tariffaMember:80, capacitaOre:40 },
  { id:"giacomo",  nome:"Giacomo Cannizzaro",ruolo:"Art Director",        colore:"#8E44AD", tariffaMember:60, capacitaOre:32 },
  { id:"paolone",  nome:"Paolone",           ruolo:"Marketing Operativo", colore:"#E65100", tariffaMember:40, capacitaOre:32 },
  { id:"akash",    nome:"Akash",             ruolo:"AI & Google",         colore:"#0A66C2", tariffaMember:50, capacitaOre:24 },
  { id:"paoletto", nome:"Paoletto",          ruolo:"Video Maker",         colore:"#C2185B", tariffaMember:40, capacitaOre:24 },
  { id:"hermes",   nome:"Hermes Cannata",    ruolo:"Grafico Junior",      colore:"#F57F17", tariffaMember:30, capacitaOre:32 },
  { id:"matteo",   nome:"Matteo Caschetto",  ruolo:"Grafico Junior",      colore:"#795548", tariffaMember:30, capacitaOre:24 },
];

const RUOLI_DISPONIBILI = [
  "Direzione Creativa","Strategia","Marketing Strategico","Art Director",
  "SMM","Grafico Senior","AI & Google","Video Maker","Fotografo",
  "Marketing Operativo","Grafico Junior","Sviluppatore","Copywriter",
];

const TASK_COLORS = ["#1A8C3F","#1565C0","#8E44AD","#C2185B","#E65100","#F57F17","#0A66C2","#795548","#37474F","#00838F"];

function getWeekKey(date) {
  const d   = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const y   = d.getFullYear();
  const w   = Math.ceil(((d - new Date(y,0,1)) / 86400000 + 1) / 7);
  return y + "-W" + String(w).padStart(2,"0");
}

function getMondayOfWeek(weekKey) {
  const parts = weekKey.split("-W");
  const y = parseInt(parts[0]);
  const w = parseInt(parts[1]);
  const jan4 = new Date(y, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (w - 1) * 7);
  return monday;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function fmtDateShort(d) {
  return String(d.getDate()).padStart(2,"0") + "/" + String(d.getMonth()+1).padStart(2,"0");
}

function fmtDateISO(d) {
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

/* ─────────────────────────────────────────────────────────── */
/*  TEAM PLANNER                                               */
/* ─────────────────────────────────────────────────────────── */
function TeamPlanner({ clientMap }) {
  const today    = new Date();
  const [weekKey,    setWeekKey]    = useState(getWeekKey(today));
  const [members,    setMembers]    = useState([]);
  const [tasks,      setTasks]      = useState([]);
  const [loadingT,   setLoadingT]   = useState(true);
  const [showAddTask,setShowAddTask]= useState(null); // { memberId, dateISO } or null
  const [showAddMem, setShowAddMem] = useState(false);
  const [editTask,   setEditTask]   = useState(null); // task object to edit
  // form stati add task
  const [fTitolo,  setFTitolo]  = useState("");
  const [fCliente, setFCliente] = useState("");
  const [fOre,     setFOre]     = useState(1);
  const [fColore,  setFColore]  = useState(TASK_COLORS[0]);
  const [fNote,    setFNote]    = useState("");
  const [fFonteTipo, setFFonteTipo] = useState("standalone");
  const [fFonteRef,  setFFonteRef]  = useState("");
  // form stati add member
  const [mNome,    setMNome]    = useState("");
  const [mRuolo,   setMRuolo]   = useState(RUOLI_DISPONIBILI[0]);
  const [mColore,  setMColore]  = useState(TASK_COLORS[4]);
  const [mTariffa, setMTariffa] = useState(40);
  const [mCap,     setMCap]     = useState(32);

  // calc week days
  const monday = getMondayOfWeek(weekKey);
  const DAYS   = Array.from({length:7}, (_,i) => {
    const d = addDays(monday, i);
    return { iso:fmtDateISO(d), short:fmtDateShort(d), label:["Lun","Mar","Mer","Gio","Ven","Sab","Dom"][i] };
  });

  // load
  useEffect(() => {
    (async () => {
      setLoadingT(true);
      const [m, t] = await Promise.all([
        store.get("team:members"),
        store.get("team:tasks:"+weekKey),
      ]);
      setMembers(m || DEFAULT_MEMBERS);
      setTasks(t || []);
      setLoadingT(false);
    })();
  }, [weekKey]);

  async function saveTasks(next) {
    setTasks(next);
    await store.set("team:tasks:"+weekKey, next);
    // aggiorna indice per cliente (quick lookup da SetupSection/ProgressSection)
    const clientSlugs = [...new Set(next.filter(t=>t.clienteSlug).map(t=>t.clienteSlug))];
    await Promise.all(clientSlugs.map(async slug => {
      // leggi tutte le settimane recenti per quel cliente e ricostruisci l'indice
      const allWeekKeys = [weekKey];
      const refMap = {};
      // aggiungi i task della settimana corrente
      next.filter(t => t.clienteSlug===slug && t.fonte && t.fonte.refId).forEach(t => {
        if (!refMap[t.fonte.refId]) refMap[t.fonte.refId] = [];
        refMap[t.fonte.refId].push({id:t.id,memberId:t.memberId,titolo:t.titolo,ore:t.ore,dateISO:t.dateISO,colore:t.colore,weekKey});
      });
      // salva indice
      const existing = await store.get("team:linked:"+slug) || {};
      const merged = {...existing};
      Object.entries(refMap).forEach(([ref, tasks]) => { merged[ref] = tasks; });
      // rimuovi ref di task eliminati
      const curIds = new Set(next.filter(t=>t.clienteSlug===slug).map(t=>t.id));
      Object.keys(merged).forEach(ref => {
        merged[ref] = (merged[ref]||[]).filter(t => !curIds.has(t.id) || refMap[ref]?.find(x=>x.id===t.id));
        if (!merged[ref].length) delete merged[ref];
      });
      await store.set("team:linked:"+slug, merged);
    }));
  }

  async function saveMembers(next) {
    setMembers(next);
    await store.set("team:members", next);
  }

  function prevWeek() {
    const d = getMondayOfWeek(weekKey);
    d.setDate(d.getDate() - 7);
    setWeekKey(getWeekKey(d));
  }
  function nextWeek() {
    const d = getMondayOfWeek(weekKey);
    d.setDate(d.getDate() + 7);
    setWeekKey(getWeekKey(d));
  }

  function openAdd(memberId, dateISO) {
    setFTitolo(""); setFCliente(""); setFOre(2); setFColore(TASK_COLORS[0]); setFNote("");
    setFFonteTipo("standalone"); setFFonteRef("");
    setEditTask(null);
    setShowAddTask({ memberId, dateISO });
  }

  function openEdit(task) {
    setFTitolo(task.titolo||""); setFCliente(task.clienteSlug||""); setFOre(task.ore||1);
    setFColore(task.colore||TASK_COLORS[0]); setFNote(task.note||"");
    setFFonteTipo(task.fonte ? task.fonte.tipo : "standalone");
    setFFonteRef(task.fonte ? task.fonte.refId : "");
    setEditTask(task);
    setShowAddTask({ memberId:task.memberId, dateISO:task.dateISO });
  }

  async function saveTask() {
    if (!fTitolo) return;
    const fonte = fFonteTipo !== "standalone"
      ? { tipo:fFonteTipo, clienteSlug:fCliente, refId:fFonteRef, refLabel:fTitolo }
      : null;
    if (editTask) {
      const next = tasks.map(t => t.id===editTask.id
        ? {...t, titolo:fTitolo, clienteSlug:fCliente, ore:fOre, colore:fColore, note:fNote, fonte}
        : t);
      await saveTasks(next);
    } else {
      const newTask = {
        id:"tk"+Date.now(), memberId:showAddTask.memberId, dateISO:showAddTask.dateISO,
        titolo:fTitolo, clienteSlug:fCliente, ore:fOre, colore:fColore, note:fNote, fonte,
      };
      await saveTasks([...tasks, newTask]);
    }
    setShowAddTask(null); setEditTask(null);
  }

  async function deleteTask(id) {
    await saveTasks(tasks.filter(t => t.id!==id));
    setShowAddTask(null); setEditTask(null);
  }

  async function addMember() {
    if (!mNome) return;
    const m = { id:"m"+Date.now(), nome:mNome, ruolo:mRuolo, colore:mColore, tariffaMember:mTariffa, capacitaOre:mCap };
    await saveMembers([...members, m]);
    setShowAddMem(false); setMNome("");
  }

  async function removeMember(id) {
    if (!confirm("Rimuovere questo membro dal planner?")) return;
    await saveMembers(members.filter(m => m.id!==id));
  }

  // helpers
  function tasksFor(memberId, dateISO) {
    return tasks.filter(t => t.memberId===memberId && t.dateISO===dateISO);
  }

  function totalOreWeek(memberId) {
    return tasks.filter(t => t.memberId===memberId).reduce((s,t) => s+(t.ore||0), 0);
  }

  function totalOreDay(dateISO) {
    return tasks.filter(t => t.dateISO===dateISO).reduce((s,t) => s+(t.ore||0), 0);
  }

  const mondayLabel = fmtDateShort(monday);
  const sundayLabel = fmtDateShort(addDays(monday,6));
  const inp = {border:"1px solid "+C.border,borderRadius:6,padding:"7px 10px",fontSize:13,fontFamily:FONT,width:"100%",boxSizing:"border-box"};

  if (loadingT) return <Spinner />;

  return (
    <div style={{padding:"16px 12px",fontFamily:FONT,maxWidth:1100,margin:"0 auto"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={prevWeek} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"5px 9px",cursor:"pointer"}}><ChevronLeft size={14}/></button>
          <div style={{fontWeight:700,fontSize:14,padding:"0 8px",whiteSpace:"nowrap"}}>
            {weekKey} &nbsp;·&nbsp; {mondayLabel} — {sundayLabel}
          </div>
          <button onClick={nextWeek} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"5px 9px",cursor:"pointer"}}><ChevronRight size={14}/></button>
        </div>
        <div style={{flex:1}}/>
        <button onClick={() => setShowAddMem(true)}
          style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"7px 13px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:FONT}}>
          <Plus size={13}/> Aggiungi membro
        </button>
      </div>

      {/* Griglia — scroll orizzontale su mobile */}
      <div style={{overflowX:"auto",borderRadius:10,border:"1px solid "+C.border,background:C.white}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
          <thead>
            <tr style={{borderBottom:"2px solid "+C.border}}>
              {/* colonna membro */}
              <th style={{width:190,padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,background:C.sfondo,position:"sticky",left:0,zIndex:2}}>
                MEMBRO
              </th>
              {DAYS.map(day => {
                const totDay = totalOreDay(day.iso);
                const isToday = day.iso === fmtDateISO(today);
                return (
                  <th key={day.iso} style={{padding:"8px 6px",textAlign:"center",fontSize:11,color:isToday?C.verde:C.muted,fontWeight:700,
                    background:isToday?"#F1FAF4":C.sfondo,borderLeft:"1px solid "+C.border,minWidth:110}}>
                    <div>{day.label}</div>
                    <div style={{fontSize:12,color:isToday?C.verde:C.testo,fontWeight:800}}>{day.short}</div>
                    {totDay > 0 && <div style={{fontSize:10,color:C.muted,marginTop:2}}>{totDay}h totali</div>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {members.map((member, mi) => {
              const ore    = totalOreWeek(member.id);
              const cap    = member.capacitaOre || 40;
              const perc   = Math.min(100, Math.round(ore / cap * 100));
              const overload = ore > cap;
              return (
                <tr key={member.id} style={{borderBottom:"1px solid "+C.border}}>
                  {/* cella membro — sticky */}
                  <td style={{padding:"10px 12px",verticalAlign:"top",background:C.white,position:"sticky",left:0,zIndex:1,borderRight:"1px solid "+C.border}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:member.colore,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{color:"#fff",fontWeight:800,fontSize:11}}>{member.nome[0]}</span>
                      </div>
                      <div style={{minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:120}}>{member.nome}</div>
                        <div style={{fontSize:10,color:C.muted}}>{member.ruolo}</div>
                      </div>
                      <button onClick={() => removeMember(member.id)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:C.muted,padding:2,flexShrink:0}}>
                        <X size={10}/>
                      </button>
                    </div>
                    {/* ore + barra */}
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:10,color:C.muted}}>
                        <span style={{color:overload?C.magenta:C.verde,fontWeight:700}}>{ore}h</span>
                        &nbsp;/&nbsp;{cap}h
                      </span>
                      <span style={{fontSize:10,fontWeight:700,color:overload?C.magenta:C.muted}}>{perc}%</span>
                    </div>
                    <div style={{height:4,background:"#F0F0F0",borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:perc+"%",background:overload?C.magenta:member.colore,borderRadius:2,transition:"width .3s"}}/>
                    </div>
                    <div style={{fontSize:9,color:C.muted,marginTop:3}}>€{member.tariffaMember}/h · {member.tariffaMember*ore}€ sett.</div>
                  </td>

                  {/* celle giorni */}
                  {DAYS.map(day => {
                    const dayTasks = tasksFor(member.id, day.iso);
                    const isToday  = day.iso === fmtDateISO(today);
                    return (
                      <td key={day.iso} onClick={() => openAdd(member.id, day.iso)}
                        style={{verticalAlign:"top",padding:"6px 5px",borderLeft:"1px solid "+C.border,
                          background:isToday?"#FAFFFE":"transparent",cursor:"pointer",minHeight:60}}>
                        <div style={{display:"flex",flexDirection:"column",gap:4}}>
                          {dayTasks.map(task => {
                            const cname = task.clienteSlug && clientMap[task.clienteSlug]
                              ? clientMap[task.clienteSlug].nome : task.clienteSlug||"";
                            return (
                              <div key={task.id}
                                onClick={e => { e.stopPropagation(); openEdit(task); }}
                                style={{background:task.colore,borderRadius:5,padding:"4px 6px",cursor:"pointer",
                                  boxShadow:"0 1px 3px rgba(0,0,0,.12)"}}>
                                {/* badge fonte */}
                                {task.fonte && task.fonte.tipo && task.fonte.tipo !== "standalone" && (
                                  <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:2,background:"rgba(0,0,0,.18)",borderRadius:3,padding:"1px 4px",width:"fit-content",maxWidth:100}}>
                                    <span style={{fontSize:8,color:"rgba(255,255,255,.9)",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                                      {FONTE_TIPI[task.fonte.tipo]?.emoji} {FONTE_TIPI[task.fonte.tipo]?.label || task.fonte.tipo}
                                    </span>
                                  </div>
                                )}
                                <div style={{fontSize:11,fontWeight:700,color:"#fff",lineHeight:1.2,marginBottom:1,
                                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:95}}>
                                  {task.titolo}
                                </div>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:3}}>
                                  {cname && (
                                    <button onClick={e => { e.stopPropagation(); nav("/admin/"+task.clienteSlug); }}
                                      style={{fontSize:9,color:"rgba(255,255,255,.8)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:65,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:FONT,textDecoration:"underline"}}>
                                      {cname}
                                    </button>
                                  )}
                                  <span style={{fontSize:9,color:"rgba(255,255,255,.9)",fontWeight:700,marginLeft:"auto",whiteSpace:"nowrap"}}>{task.ore}h</span>
                                </div>
                              </div>
                            );
                          })}
                          {/* slot vuoto visibile */}
                          {!dayTasks.length && (
                            <div style={{height:28,borderRadius:5,border:"1.5px dashed "+C.border,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <Plus size={10} style={{color:C.muted,opacity:.4}}/>
                            </div>
                          )}
                          {dayTasks.length > 0 && (
                            <div style={{height:20,borderRadius:4,border:"1px dashed "+C.border,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <Plus size={9} style={{color:C.muted,opacity:.4}}/>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer totali */}
      <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
        {members.map(m => {
          const ore = totalOreWeek(m.id);
          if (!ore) return null;
          return (
            <div key={m.id} style={{background:C.white,border:"1px solid "+C.border,borderRadius:7,padding:"6px 12px",display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:m.colore}}/>
              <span style={{fontSize:11,fontWeight:700}}>{m.nome.split(" ")[0]}</span>
              <span style={{fontSize:11,color:C.muted}}>{ore}h · €{m.tariffaMember*ore}</span>
            </div>
          );
        })}
        <div style={{background:C.verde,borderRadius:7,padding:"6px 12px",display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>
            Tot. settimana: {tasks.reduce((s,t)=>s+(t.ore||0),0)}h · €{tasks.reduce((s,t)=>s+(t.ore||0)*(members.find(m=>m.id===t.memberId)?.tariffaMember||0),0)}
          </span>
        </div>
      </div>

      {/* MODAL ADD/EDIT TASK */}
      {showAddTask && (
        <div onClick={() => { setShowAddTask(null); setEditTask(null); }}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,padding:22,maxWidth:380,width:"100%"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:fColore,flexShrink:0}}/>
              <h3 style={{margin:0,fontSize:14,fontWeight:700}}>{editTask?"Modifica task":"Nuovo task"}</h3>
              {editTask && (
                <button onClick={() => deleteTask(editTask.id)}
                  style={{marginLeft:"auto",background:"none",border:"1px solid "+C.magenta,borderRadius:5,padding:"3px 8px",fontSize:11,color:C.magenta,cursor:"pointer",fontFamily:FONT}}>
                  Elimina
                </button>
              )}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:3}}>Titolo *</label>
                <input value={fTitolo} onChange={e => setFTitolo(e.target.value)} placeholder="Es. Copy Strategy, Shooting, ADV Meta..." style={inp} autoFocus/>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:3}}>Cliente</label>
                <select value={fCliente} onChange={e => { setFCliente(e.target.value); setFFonteRef(""); }} style={inp}>
                  <option value="">— Nessun cliente —</option>
                  {Object.entries(clientMap).map(([k,v]) => <option key={k} value={k}>{v.nome}</option>)}
                </select>
              </div>
              {/* COLLEGA A SEZIONE */}
              <div style={{background:C.sfondo,borderRadius:7,padding:"10px 12px"}}>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:6}}>Collega a sezione</label>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:fFonteTipo!=="standalone"?8:0}}>
                  {Object.entries(FONTE_TIPI).map(([k,v]) => (
                    <button key={k} onClick={() => { setFFonteTipo(k); setFFonteRef(""); }}
                      style={{fontSize:10,padding:"3px 8px",borderRadius:4,border:"1px solid "+(fFonteTipo===k?v.color:C.border),
                        background:fFonteTipo===k?v.color+"18":C.white,color:fFonteTipo===k?v.color:C.muted,
                        cursor:"pointer",fontFamily:FONT,fontWeight:700}}>
                      {v.emoji} {v.label}
                    </button>
                  ))}
                </div>
                {fFonteTipo === "setup" && (
                  <div>
                    <select value={fFonteRef} onChange={e => setFFonteRef(e.target.value)} style={{...inp,fontSize:12}}>
                      <option value="">— Seleziona step —</option>
                      {SETUP_MODULI.map(m => <option key={"setup_"+m.id} value={"setup_"+m.id}>{m.tag} {m.nome}</option>)}
                    </select>
                    {fCliente && fFonteRef && (
                      <button onClick={() => nav("/admin/"+fCliente)}
                        style={{marginTop:5,fontSize:10,color:C.verde,background:"none",border:"none",cursor:"pointer",fontFamily:FONT,padding:0,textDecoration:"underline"}}>
                        → Apri Setup in {clientMap[fCliente]?.nome||fCliente}
                      </button>
                    )}
                  </div>
                )}
                {fFonteTipo === "progresso" && (
                  <div>
                    <select value={fFonteRef} onChange={e => setFFonteRef(e.target.value)} style={{...inp,fontSize:12}}>
                      <option value="">— Seleziona modulo —</option>
                      {FASI.map(fase => fase.moduli.map(mod => (
                        <option key={"prog_"+fase.id+"_"+mod.id} value={"prog_"+fase.id+"_"+mod.id}>{fase.emoji} {fase.label} · {mod.nome}</option>
                      )))}
                    </select>
                    {fCliente && fFonteRef && (
                      <button onClick={() => nav("/admin/"+fCliente)}
                        style={{marginTop:5,fontSize:10,color:C.verde,background:"none",border:"none",cursor:"pointer",fontFamily:FONT,padding:0,textDecoration:"underline"}}>
                        → Apri Progetto in {clientMap[fCliente]?.nome||fCliente}
                      </button>
                    )}
                  </div>
                )}
                {fFonteTipo === "ped" && (
                  <input value={fFonteRef} onChange={e => setFFonteRef(e.target.value)} placeholder="ID contenuto PED (opzionale)" style={{...inp,fontSize:12}}/>
                )}
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:3}}>Ore stimate</label>
                <input type="number" min={0.5} max={12} step={0.5} value={fOre} onChange={e => setFOre(parseFloat(e.target.value)||1)} style={inp}/>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:3}}>Note</label>
                <textarea value={fNote} onChange={e => setFNote(e.target.value)} rows={2} placeholder="Dettagli, link Streamtime..." style={{...inp,resize:"vertical"}}/>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:5}}>Colore</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {TASK_COLORS.map(col => (
                    <button key={col} onClick={() => setFColore(col)}
                      style={{width:24,height:24,borderRadius:"50%",background:col,border:"2px solid "+(fColore===col?"#000":"transparent"),cursor:"pointer"}}/>
                  ))}
                </div>
              </div>
            </div>

            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button onClick={() => { setShowAddTask(null); setEditTask(null); }}
                style={{flex:1,border:"1px solid "+C.border,background:C.white,borderRadius:6,padding:9,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
                Annulla
              </button>
              <button onClick={saveTask} disabled={!fTitolo}
                style={{flex:1,background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:9,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,opacity:!fTitolo?0.5:1}}>
                {editTask?"Aggiorna":"Aggiungi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD MEMBER */}
      {showAddMem && (
        <div onClick={() => setShowAddMem(false)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,padding:22,maxWidth:380,width:"100%"}}>
            <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700}}>Nuovo membro</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:3}}>Nome *</label>
                <input value={mNome} onChange={e => setMNome(e.target.value)} placeholder="Es. Mario Rossi" style={inp} autoFocus/>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:3}}>Ruolo</label>
                <select value={mRuolo} onChange={e => setMRuolo(e.target.value)} style={inp}>
                  {RUOLI_DISPONIBILI.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div>
                  <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:3}}>Tariffa €/h</label>
                  <input type="number" value={mTariffa} onChange={e => setMTariffa(parseInt(e.target.value)||0)} style={inp}/>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:3}}>Cap. ore/sett.</label>
                  <input type="number" value={mCap} onChange={e => setMCap(parseInt(e.target.value)||0)} style={inp}/>
                </div>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:5}}>Colore</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {TASK_COLORS.map(col => (
                    <button key={col} onClick={() => setMColore(col)}
                      style={{width:24,height:24,borderRadius:"50%",background:col,border:"2px solid "+(mColore===col?"#000":"transparent"),cursor:"pointer"}}/>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button onClick={() => setShowAddMem(false)}
                style={{flex:1,border:"1px solid "+C.border,background:C.white,borderRadius:6,padding:9,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
                Annulla
              </button>
              <button onClick={addMember} disabled={!mNome}
                style={{flex:1,background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:9,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,opacity:!mNome?0.5:1}}>
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  WEEKLY CALENDAR PLANNER                                     */
/* ─────────────────────────────────────────────────────────── */
const HOUR_START  = 8;
const HOUR_END    = 21;
const SLOT_PX     = 60;    // px per ora
const TIME_COL_W  = 48;    // px colonna orari
const ALLD_ROW_H  = 28;    // px riga all-day events

function WeeklyCalendarPlanner({ slugs, clientMap }) {
  const today    = new Date();
  const [weekKey, setWeekKey]   = useState(getWeekKey(today));
  const [tasks,   setTasks]     = useState([]);
  const [members, setMembers]   = useState([]);
  const [pedByDay,setPedByDay]  = useState({});
  const [selDay,  setSelDay]    = useState(null);  // ISO date
  const [loading, setLoading]   = useState(true);
  const [showAddT,setShowAddT]  = useState(null);  // { dateISO, startHour }
  // add task inline fields
  const [nTitolo,  setNTitolo]  = useState("");
  const [nCliente, setNCliente] = useState("");
  const [nMember,  setNMember]  = useState("");
  const [nStartH,  setNStartH]  = useState("09");
  const [nStartM,  setNStartM]  = useState("00");
  const [nOre,     setNOre]     = useState(1);
  const [nColore,  setNColore]  = useState(TASK_COLORS[0]);
  const [nFonte,   setNFonte]   = useState("standalone");
  const [nFonteRef,setNFonteRef]= useState("");

  const monday = getMondayOfWeek(weekKey);
  const DAYS   = Array.from({length:7}, (_,i) => {
    const d = addDays(monday, i);
    return { iso:fmtDateISO(d), d, label:["Lun","Mar","Mer","Gio","Ven","Sab","Dom"][i], num:d.getDate(), month:d.getMonth()+1 };
  });

  function prevWk() { const d=getMondayOfWeek(weekKey); d.setDate(d.getDate()-7); setWeekKey(getWeekKey(d)); }
  function nextWk() { const d=getMondayOfWeek(weekKey); d.setDate(d.getDate()+7); setWeekKey(getWeekKey(d)); }
  function goNow()  { setWeekKey(getWeekKey(new Date())); }

  const slugsKey = slugs.join(",");
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [m, t] = await Promise.all([
        store.get("team:members"),
        store.get("team:tasks:"+weekKey),
      ]);
      setMembers(m || DEFAULT_MEMBERS);
      setTasks(t || []);

      // load PED for each client, for months that overlap this week
      const months = [...new Set(DAYS.map(d => d.iso.slice(0,7)))];
      const pbd = {};
      const currentSlugs = slugsKey.split(",").filter(Boolean);
      await Promise.all(currentSlugs.map(async s => {
        await Promise.all(months.map(async mese => {
          const ped = await store.get("clients:"+s+":ped:"+mese) || [];
          ped.forEach(p => {
            if (!pbd[p.data]) pbd[p.data] = [];
            pbd[p.data].push({ ...p, slug:s, clienteNome:clientMap[s]?.nome||s });
          });
        }));
      }));
      setPedByDay(pbd);
      setLoading(false);
    })();
  }, [weekKey, slugsKey]);

  const todayISO = fmtDateISO(today);
  const totalH   = (HOUR_END - HOUR_START) * SLOT_PX;
  const hours    = Array.from({length:HOUR_END-HOUR_START}, (_,i) => HOUR_START+i);

  function taskTop(task) {
    const [h,m] = (task.startTime||"09:00").split(":").map(Number);
    return (h - HOUR_START + m/60) * SLOT_PX;
  }
  function taskH(task) { return Math.max(24, (task.ore||1)*SLOT_PX - 2); }

  function dayTasks(dateISO)    { return tasks.filter(t => t.dateISO===dateISO); }
  function dayTaskCount(dateISO){ return dayTasks(dateISO).length; }
  function dayTotalH(dateISO)   { return tasks.filter(t=>t.dateISO===dateISO).reduce((s,t)=>s+(t.ore||0),0); }

  /* overlap: assign column index per task */
  function layoutTasks(dayT) {
    const sorted = [...dayT].sort((a,b)=>taskTop(a)-taskTop(b));
    const cols   = [];
    return sorted.map(task => {
      const top = taskTop(task); const bot = top + taskH(task);
      let col = 0;
      while (cols[col] && cols[col] > top) col++;
      cols[col] = bot;
      return { task, col, totalCols:Math.max(1, cols.filter(Boolean).length) };
    });
  }

  async function addQuickTask() {
    if (!nTitolo || !showAddT) return;
    const mem = (members||DEFAULT_MEMBERS).find(m=>m.id===nMember);
    const fonte = nFonte!=="standalone" && nFonteRef
      ? { tipo:nFonte, refId:nFonteRef, clienteSlug:nCliente }
      : null;
    const newT = {
      id:"tk"+Date.now(), memberId:nMember, dateISO:showAddT.dateISO,
      startTime:nStartH+":"+nStartM, titolo:nTitolo,
      clienteSlug:nCliente, ore:nOre, colore:nColore, note:"", fonte,
    };
    const wk = getWeekKey(new Date(showAddT.dateISO));
    const cur = await store.get("team:tasks:"+wk) || [];
    const next = [...cur, newT];
    await store.set("team:tasks:"+wk, next);
    if (wk===weekKey) setTasks(next);
    setShowAddT(null); setNTitolo("");
  }

  /* selected day panel */
  const selTasks = selDay ? dayTasks(selDay) : [];
  const selPed   = selDay ? (pedByDay[selDay]||[]) : [];
  const selDayObj= DAYS.find(d=>d.iso===selDay);

  const mLabel = new Date(getMondayOfWeek(weekKey)).toLocaleString("it-IT",{month:"long",year:"numeric"});
  const inp4   = {border:"1px solid "+C.border,borderRadius:4,padding:"4px 7px",fontSize:12,fontFamily:FONT};

  if (loading) return <Spinner/>;

  return (
    <div style={{fontFamily:FONT,background:C.sfondo,minHeight:"100vh"}}>
      {/* TOP BAR */}
      <div style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"10px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={prevWk} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"4px 9px",cursor:"pointer"}}><ChevronLeft size={14}/></button>
          <button onClick={goNow} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Oggi</button>
          <button onClick={nextWk} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"4px 9px",cursor:"pointer"}}><ChevronRight size={14}/></button>
        </div>
        <span style={{fontWeight:700,fontSize:14,textTransform:"capitalize"}}>{mLabel} · {weekKey}</span>
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {members.slice(0,6).map(m => (
            <div key={m.id} title={m.nome} style={{width:24,height:24,borderRadius:"50%",background:m.colore,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontWeight:800,fontSize:9}}>{m.nome[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",overflow:"hidden"}}>

        {/* ── CALENDAR GRID ───────────────────────────────── */}
        <div style={{flex:1,overflowX:"auto"}}>
          <div style={{minWidth:700}}>

            {/* DAY HEADERS */}
            <div style={{display:"flex",borderBottom:"1px solid "+C.border,background:C.white,position:"sticky",top:0,zIndex:10}}>
              <div style={{width:TIME_COL_W,flexShrink:0}}/>
              {DAYS.map(day => {
                const isToday = day.iso===todayISO;
                const isSel   = day.iso===selDay;
                const cnt     = dayTaskCount(day.iso);
                const hrs     = dayTotalH(day.iso);
                return (
                  <div key={day.iso}
                    onClick={() => setSelDay(isSel?null:day.iso)}
                    style={{flex:1,padding:"8px 6px",textAlign:"center",cursor:"pointer",borderLeft:"1px solid "+C.border,
                      background:isSel?"#F0FFF4":isToday?"#F8FFF9":C.white}}>
                    <div style={{fontSize:11,color:C.muted,fontWeight:700}}>{day.label}</div>
                    <div style={{fontSize:20,fontWeight:800,color:isToday?C.verde:C.testo,lineHeight:1}}>{day.num}</div>
                    {cnt>0
                      ? <div style={{fontSize:10,color:isToday?C.verde:C.muted}}>{cnt} task · {hrs}h</div>
                      : <div style={{fontSize:10,color:C.border}}>—</div>
                    }
                    {isToday && <div style={{height:2,background:C.verde,borderRadius:1,margin:"3px auto 0",width:"60%"}}/>}
                  </div>
                );
              })}
            </div>

            {/* ALL-DAY EVENTS (PED) */}
            <div style={{display:"flex",borderBottom:"2px solid "+C.border,background:"#FAFFFE"}}>
              <div style={{width:TIME_COL_W,flexShrink:0,padding:"4px 4px",fontSize:9,color:C.muted,textAlign:"right",paddingTop:6}}>PED</div>
              {DAYS.map(day => {
                const evts = pedByDay[day.iso] || [];
                return (
                  <div key={day.iso} style={{flex:1,borderLeft:"1px solid "+C.border,padding:"3px 3px",minHeight:ALLD_ROW_H,display:"flex",flexDirection:"column",gap:2}}>
                    {evts.map((e,i) => {
                      const fmt  = FORMATI[e.formato]  || FORMATI.post;
                      const pilC = e.pilastro && PILASTRI[e.pilastro] ? PILASTRI[e.pilastro] : null;
                      return (
                        <div key={i} title={e.clienteNome+": "+e.titolo}
                          onClick={() => nav("/admin/"+e.slug)}
                          style={{background:pilC?pilC.color:fmt.color,borderRadius:3,padding:"1px 5px",cursor:"pointer",
                            overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                          <span style={{fontSize:9,fontWeight:700,color:"#fff"}}>{e.titolo}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* TIME GRID */}
            <div style={{display:"flex",position:"relative",overflowY:"auto",maxHeight:"calc(100vh - 200px)"}}>
              {/* time column */}
              <div style={{width:TIME_COL_W,flexShrink:0,position:"relative",height:totalH}}>
                {hours.map(h => (
                  <div key={h} style={{position:"absolute",top:(h-HOUR_START)*SLOT_PX,left:0,width:"100%",
                    borderTop:"1px solid "+C.border,paddingRight:4,textAlign:"right"}}>
                    <span style={{fontSize:10,color:C.muted,lineHeight:1}}>{h}:00</span>
                  </div>
                ))}
              </div>

              {/* day columns */}
              {DAYS.map(day => {
                const dayT    = dayTasks(day.iso);
                const laid    = layoutTasks(dayT);
                const isToday = day.iso===todayISO;
                const now     = new Date();
                const nowTop  = isToday ? (now.getHours()-HOUR_START+now.getMinutes()/60)*SLOT_PX : null;

                return (
                  <div key={day.iso}
                    onClick={() => setShowAddT({dateISO:day.iso, startHour:10})}
                    style={{flex:1,borderLeft:"1px solid "+C.border,position:"relative",height:totalH,
                      background:isToday?"#FAFFFE":"transparent",cursor:"pointer"}}>

                    {/* hour lines */}
                    {hours.map(h => (
                      <div key={h} style={{position:"absolute",top:(h-HOUR_START)*SLOT_PX,left:0,right:0,
                        borderTop:"1px solid "+(h%2===0?C.border:C.sfondo)}}/>
                    ))}

                    {/* now line */}
                    {nowTop !== null && nowTop>=0 && nowTop<=totalH && (
                      <div style={{position:"absolute",top:nowTop,left:0,right:0,height:2,background:C.magenta,zIndex:5}}>
                        <div style={{position:"absolute",left:-4,top:-3,width:8,height:8,borderRadius:"50%",background:C.magenta}}/>
                      </div>
                    )}

                    {/* task blocks */}
                    {laid.map(({task, col, totalCols}) => {
                      const mem = members.find(m=>m.id===task.memberId);
                      const colW = 1 / totalCols;
                      const cname = task.clienteSlug && clientMap[task.clienteSlug] ? clientMap[task.clienteSlug].nome : "";
                      return (
                        <div key={task.id}
                          onClick={e => { e.stopPropagation(); setSelDay(day.iso); }}
                          style={{position:"absolute",
                            top:taskTop(task)+1,
                            left:(col/totalCols*100)+"%",
                            width:(colW*100-1)+"%",
                            height:taskH(task),
                            background:task.colore+"EE",
                            borderRadius:5,
                            borderLeft:"3px solid "+task.colore,
                            padding:"3px 6px",
                            overflow:"hidden",
                            cursor:"pointer",
                            boxShadow:"0 1px 4px rgba(0,0,0,.12)",
                            zIndex:3}}>
                          <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:1}}>
                            <span style={{fontSize:9,color:"rgba(255,255,255,.8)",fontWeight:700,whiteSpace:"nowrap"}}>
                              {task.startTime||"—"} · {task.ore}h
                            </span>
                            {mem && (
                              <div style={{width:12,height:12,borderRadius:"50%",background:mem.colore,border:"1px solid rgba(255,255,255,.5)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                <span style={{fontSize:6,color:"#fff",fontWeight:800}}>{mem.nome[0]}</span>
                              </div>
                            )}
                          </div>
                          <div style={{fontSize:11,fontWeight:700,color:"#fff",lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.titolo}</div>
                          {cname && <div style={{fontSize:9,color:"rgba(255,255,255,.75)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cname}</div>}
                          {task.fonte && task.fonte.tipo!=="standalone" && (
                            <div style={{fontSize:8,color:"rgba(255,255,255,.65)",marginTop:1}}>{FONTE_TIPI[task.fonte.tipo]?.emoji} {FONTE_TIPI[task.fonte.tipo]?.label}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SIDE PANEL (selected day) ──────────────────── */}
        {selDay && (
          <div style={{width:300,flexShrink:0,borderLeft:"1px solid "+C.border,background:C.white,display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 60px)",overflowY:"auto"}}>
            <div style={{padding:"14px 16px",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",gap:8}}>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{selDayObj?.label} {selDayObj?.num}/{selDayObj?.month}</div>
                <div style={{fontSize:11,color:C.muted}}>{selTasks.length} task · {selTasks.reduce((s,t)=>s+(t.ore||0),0)}h</div>
              </div>
              <button onClick={() => setSelDay(null)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:C.muted}}>
                <X size={15}/>
              </button>
            </div>

            {/* PED all-day */}
            {selPed.length > 0 && (
              <div style={{padding:"10px 14px",borderBottom:"1px solid "+C.sfondo}}>
                <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase"}}>Contenuti PED</div>
                {selPed.map((e,i) => {
                  const fmt  = FORMATI[e.formato]  || FORMATI.post;
                  const pilC = e.pilastro && PILASTRI[e.pilastro] ? PILASTRI[e.pilastro] : null;
                  const st   = STATI_PED[e.stato]  || STATI_PED.idea;
                  return (
                    <div key={i} onClick={() => nav("/admin/"+e.slug)}
                      style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid "+C.sfondo,cursor:"pointer"}}>
                      <div style={{width:3,height:32,borderRadius:2,background:pilC?pilC.color:fmt.color,flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.titolo}</div>
                        <div style={{fontSize:10,color:C.muted}}>{e.clienteNome} · {fmt.label}</div>
                      </div>
                      <span style={{background:st.bg,color:st.tx,padding:"1px 6px",borderRadius:3,fontSize:9,fontWeight:700,flexShrink:0}}>{st.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Team tasks */}
            <div style={{padding:"10px 14px"}}>
              {selTasks.length > 0 && (
                <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:8,textTransform:"uppercase"}}>Task Team</div>
              )}
              {!selTasks.length && !selPed.length && (
                <div style={{textAlign:"center",padding:24,color:C.muted,fontSize:13}}>Nessun task per questo giorno</div>
              )}
              {selTasks.map(task => {
                const mem = members.find(m=>m.id===task.memberId);
                const cname = task.clienteSlug && clientMap[task.clienteSlug] ? clientMap[task.clienteSlug].nome : "";
                const fonte = task.fonte && task.fonte.tipo!=="standalone" ? FONTE_TIPI[task.fonte.tipo] : null;
                return (
                  <div key={task.id} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid "+C.sfondo,alignItems:"flex-start"}}>
                    <div style={{width:3,alignSelf:"stretch",borderRadius:2,background:task.colore,flexShrink:0,minHeight:36}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>{task.titolo}</div>
                      {cname && <div style={{fontSize:10,color:C.muted,marginBottom:2}}>{cname}</div>}
                      {fonte && <div style={{fontSize:10,color:fonte.color,marginBottom:2}}>{fonte.emoji} {fonte.label}</div>}
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        {mem && (
                          <div style={{display:"flex",alignItems:"center",gap:4}}>
                            <div style={{width:14,height:14,borderRadius:"50%",background:mem.colore,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <span style={{fontSize:6,color:"#fff",fontWeight:800}}>{mem.nome[0]}</span>
                            </div>
                            <span style={{fontSize:10,color:C.muted}}>{mem.nome.split(" ")[0]}</span>
                          </div>
                        )}
                        <span style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{task.startTime||"—"} · {task.ore}h</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL QUICK ADD TASK ────────────────────────── */}
      {showAddT && (
        <div onClick={() => setShowAddT(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,padding:22,maxWidth:380,width:"100%"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:nColore,flexShrink:0}}/>
              <h3 style={{margin:0,fontSize:14,fontWeight:700}}>Nuovo task · {showAddT.dateISO}</h3>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              <input value={nTitolo} onChange={e=>setNTitolo(e.target.value)} placeholder="Titolo task *" autoFocus
                style={{...inp4,width:"100%",boxSizing:"border-box",fontSize:14,fontWeight:600,padding:"8px 10px"}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px",gap:6}}>
                <div>
                  <label style={{fontSize:10,fontWeight:700,display:"block",marginBottom:2}}>Inizio</label>
                  <div style={{display:"flex",gap:3}}>
                    <input type="number" min={0} max={23} value={nStartH} onChange={e=>setNStartH(String(e.target.value).padStart(2,"0"))} style={{...inp4,width:42,textAlign:"center"}}/>
                    <span style={{lineHeight:"28px",fontSize:12,color:C.muted}}>:</span>
                    <select value={nStartM} onChange={e=>setNStartM(e.target.value)} style={inp4}>
                      {["00","15","30","45"].map(m=><option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:700,display:"block",marginBottom:2}}>Ore</label>
                  <input type="number" min={0.25} max={12} step={0.25} value={nOre} onChange={e=>setNOre(parseFloat(e.target.value)||1)} style={{...inp4,width:"100%",boxSizing:"border-box"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:700,display:"block",marginBottom:2}}>Colore</label>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                    {TASK_COLORS.slice(0,5).map(c=>(
                      <button key={c} onClick={()=>setNColore(c)} style={{width:18,height:18,borderRadius:"50%",background:c,border:"2px solid "+(nColore===c?"#000":"transparent"),cursor:"pointer",padding:0}}/>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:700,display:"block",marginBottom:2}}>Membro</label>
                <select value={nMember} onChange={e=>setNMember(e.target.value)} style={{...inp4,width:"100%",boxSizing:"border-box"}}>
                  <option value="">— Nessuno —</option>
                  {members.map(m=><option key={m.id} value={m.id}>{m.nome} · {m.ruolo}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:700,display:"block",marginBottom:2}}>Cliente</label>
                <select value={nCliente} onChange={e=>{setNCliente(e.target.value);setNFonteRef("");}} style={{...inp4,width:"100%",boxSizing:"border-box"}}>
                  <option value="">— Nessun cliente —</option>
                  {Object.entries(clientMap).map(([k,v])=><option key={k} value={k}>{v.nome}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:700,display:"block",marginBottom:4}}>Collega a</label>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:nFonte!=="standalone"?6:0}}>
                  {Object.entries(FONTE_TIPI).map(([k,v])=>(
                    <button key={k} onClick={()=>{setNFonte(k);setNFonteRef("");}}
                      style={{fontSize:9,padding:"2px 7px",borderRadius:4,border:"1px solid "+(nFonte===k?v.color:C.border),
                        background:nFonte===k?v.color+"18":C.white,color:nFonte===k?v.color:C.muted,cursor:"pointer",fontFamily:FONT,fontWeight:700}}>
                      {v.emoji} {v.label}
                    </button>
                  ))}
                </div>
                {nFonte==="setup" && (
                  <select value={nFonteRef} onChange={e=>setNFonteRef(e.target.value)} style={{...inp4,width:"100%",boxSizing:"border-box",fontSize:11}}>
                    <option value="">— Step —</option>
                    {SETUP_MODULI.map(m=><option key={"setup_"+m.id} value={"setup_"+m.id}>{m.tag} {m.nome}</option>)}
                  </select>
                )}
                {nFonte==="progresso" && (
                  <select value={nFonteRef} onChange={e=>setNFonteRef(e.target.value)} style={{...inp4,width:"100%",boxSizing:"border-box",fontSize:11}}>
                    <option value="">— Modulo —</option>
                    {FASI.map(fase=>fase.moduli.map(mod=>(
                      <option key={"prog_"+fase.id+"_"+mod.id} value={"prog_"+fase.id+"_"+mod.id}>{fase.emoji} {fase.label} · {mod.nome}</option>
                    )))}
                  </select>
                )}
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button onClick={()=>setShowAddT(null)} style={{flex:1,border:"1px solid "+C.border,background:C.white,borderRadius:6,padding:9,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Annulla</button>
              <button onClick={addQuickTask} disabled={!nTitolo} style={{flex:2,background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:9,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,opacity:!nTitolo?0.5:1}}>
                + Aggiungi al planner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  ADMIN LIST                                                  */
/* ─────────────────────────────────────────────────────────── */
function AdminList({ onLogout }) {
  const [slugs,       setSlugs]       = useState([]);
  const [clientMap,   setClientMap]   = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [pedMap,      setPedMap]      = useState({});
  const [loading,     setLoading]     = useState(true);
  const [adminTab,    setAdminTab]    = useState(() => sessionStorage.getItem("nassa_adminTab") || "dashboard");
  const [showNew,     setShowNew]     = useState(false);
  const [nome,        setNome]        = useState("");
  const [slug,        setSlug]        = useState("");
  const [pac,         setPac]         = useState("professional");
  const [creating,    setCreating]    = useState(false);
  const MESE = "2026-11";

  const loadAll = useCallback(async () => {
    setLoading(true);
    const idx = await store.get("clients:index") || [];
    setSlugs(idx);
    const cm = {}, pm = {}, pedm = {};
    await Promise.all(idx.map(async s => {
      const [c, p, ped] = await Promise.all([
        store.get("clients:"+s),
        store.get("clients:"+s+":progress"),
        store.get("clients:"+s+":ped:"+MESE),
      ]);
      if (c) cm[s] = c;
      if (p) pm[s] = p;
      pedm[s] = ped || [];
    }));
    setClientMap(cm); setProgressMap(pm); setPedMap(pedm);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function create() {
    if (!nome || !slug) return;
    setCreating(true);
    const s = slug.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
    await store.set("clients:"+s, {slug:s,nome,pacchetto:pac,dataInizio:new Date().toISOString().split("T")[0]});
    await store.set("clients:"+s+":progress", {});
    await store.set("clients:"+s+":feed", []);
    await store.set("clients:"+s+":docs", []);
    await store.set("clients:index", [...slugs, s]);
    // Auto-create Dropbox folders for this client (non-blocking)
    createDropboxClientFolders(nome).catch(() => {});
    setShowNew(false); setNome(""); setSlug("");
    setCreating(false);
    await loadAll();
    nav("/admin/"+s);
  }

  async function del(s) {
    if (!confirm("Eliminare "+( clientMap[s]?.nome||s)+"?")) return;
    await store.del("clients:"+s);
    await store.set("clients:index", slugs.filter(x => x!==s));
    await loadAll();
  }

  const inp = {width:"100%",boxSizing:"border-box",border:"1px solid "+C.border,borderRadius:6,padding:"8px 12px",fontSize:14,fontFamily:FONT};

  return (
    <div style={{minHeight:"100vh",background:C.sfondo,fontFamily:FONT}}>
      <style>{`
        @media(max-width:640px){
          .ns-logo-sub{display:none!important}
          .ns-nav-label{display:none!important}
          .ns-nav-btn{padding:0 10px!important;font-size:18px!important}
          .ns-top-bar{padding:0 12px!important}
          .ns-action-btn span{display:none!important}
        }
      `}</style>
      <div className="ns-top-bar" style={{background:"#111",padding:"0 28px",display:"flex",justifyContent:"space-between",alignItems:"stretch",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,.18)"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{padding:"14px 0",borderRight:"1px solid rgba(255,255,255,.1)",paddingRight:20,marginRight:4}}>
            <div style={{fontWeight:900,fontSize:16,color:"#fff",letterSpacing:1}}>NASSA STUDIO</div>
            <div className="ns-logo-sub" style={{fontSize:9,color:"rgba(255,255,255,.35)",marginTop:1,letterSpacing:.5}}>CLIENT PORTAL</div>
          </div>
          {/* Nav tabs */}
          <div style={{display:"flex",height:"100%",gap:2}}>
            {[
              {id:"planner",   label:"🗓", full:"Planner"},
              {id:"dashboard", label:"📊", full:"Dashboard"},
              {id:"clienti",   label:"👤", full:"Clienti ("+slugs.length+")"},
              {id:"team",      label:"👥", full:"Team"},
              {id:"accessi",   label:"🔐", full:"Accessi"},
            ].map(t => (
              <button key={t.id} className="ns-nav-btn" onClick={() => { setAdminTab(t.id); sessionStorage.setItem("nassa_adminTab", t.id); }}
                style={{padding:"0 18px",fontSize:13,fontWeight:700,border:"none",background:"none",cursor:"pointer",fontFamily:FONT,
                  color:adminTab===t.id?"#fff":"rgba(255,255,255,.45)",
                  borderBottom:"3px solid "+(adminTab===t.id?C.verde:"transparent"),
                  whiteSpace:"nowrap",transition:"color .15s",display:"flex",alignItems:"center",gap:6}}>
                <span>{t.label}</span>
                <span className="ns-nav-label" style={{fontSize:12}}>{t.full}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Actions */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button className="ns-action-btn" onClick={() => setShowNew(true)}
            style={{background:C.verde,color:"#fff",border:"none",borderRadius:7,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:FONT}}>
            <Plus size={14} /> <span>Nuovo cliente</span>
          </button>
          {onLogout && (
            <button onClick={onLogout}
              style={{background:"none",border:"1px solid rgba(255,255,255,.2)",borderRadius:7,padding:"8px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT,color:"rgba(255,255,255,.6)"}}>
              Esci
            </button>
          )}
        </div>
      </div>

      {loading ? <Spinner /> : adminTab==="planner" ? (
        <WeeklyCalendarPlanner slugs={slugs} clientMap={clientMap} />
      ) : adminTab==="dashboard" ? (
        <Dashboard slugs={slugs} clientMap={clientMap} progressMap={progressMap} pedMap={pedMap} />
      ) : adminTab==="team" ? (
        <TeamPlanner clientMap={clientMap} />
      ) : adminTab==="accessi" ? (
        <AccessiManager />
      ) : (
        <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px"}}>
          <p style={{fontSize:14,fontWeight:700,marginBottom:14}}>Clienti attivi ({slugs.length})</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {!slugs.length && <div style={{textAlign:"center",padding:40,color:C.muted,fontSize:14}}>Nessun cliente. Creane uno.</div>}
            {slugs.map(s => {
              const c = clientMap[s]; if (!c) return null;
              const p = PACCHETTI[c.pacchetto];
              return (
                <div key={s} style={{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:"13px 16px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,background:C.verde,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{color:"#fff",fontWeight:800,fontSize:16}}>{(c.nome||"N")[0]}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{c.nome}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginTop:2}}>
                      <span style={{fontSize:11,color:C.muted}}>{s} · {p?p.label:c.pacchetto}</span>
                      {/* Social quick-links */}
                      {[
                        {key:"socialInstagram",label:"IG", color:"#E1306C",prefix:"https://instagram.com/"},
                        {key:"socialFacebook", label:"FB", color:"#1877F2",prefix:"https://facebook.com/"},
                        {key:"socialLinkedin", label:"LI", color:"#0A66C2",prefix:"https://linkedin.com/"},
                        {key:"socialTiktok",   label:"TK", color:"#111",   prefix:"https://tiktok.com/"},
                        {key:"socialWeb",      label:"🌐", color:"#555",   prefix:""},
                      ].filter(sn=>c[sn.key]).map(sn=>{
                        let href=c[sn.key];
                        if(!href.startsWith("http")&&sn.prefix) href=sn.prefix+href.replace(/^@/,"");
                        return (
                          <a key={sn.key} href={href} target="_blank" rel="noreferrer"
                            onClick={e=>e.stopPropagation()}
                            style={{background:sn.color,color:"#fff",padding:"1px 7px",borderRadius:10,fontSize:9,fontWeight:700,textDecoration:"none"}}>
                            {sn.label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:7,alignItems:"center"}}>
                    {/* Copy shareable link */}
                    <CopyLinkBtn slug={s} />
                    <button onClick={() => nav("/c/"+s)} title="Anteprima portale cliente" style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"6px 8px",cursor:"pointer",display:"flex",alignItems:"center"}}>
                      <Eye size={14} style={{color:C.muted}} />
                    </button>
                    <button onClick={() => nav("/admin/"+s)} style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"6px 13px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
                      Modifica
                    </button>
                    <button onClick={() => del(s)} style={{background:"none",border:"1px solid "+C.magenta,borderRadius:6,padding:"6px 8px",cursor:"pointer",display:"flex",alignItems:"center"}}>
                      <Trash2 size={14} style={{color:C.magenta}} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showNew && (
        <div onClick={() => setShowNew(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,padding:24,maxWidth:400,width:"100%"}}>
            <h3 style={{margin:"0 0 20px",fontSize:15,fontWeight:700}}>Nuovo cliente</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:4}}>Nome</label>
                <input style={inp} value={nome}
                  onChange={e => { setNome(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")); }}
                  placeholder="Es. EICH Design" />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:4}}>Slug URL</label>
                <input style={inp} value={slug} onChange={e => setSlug(e.target.value)} placeholder="es. eich-design" />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:4}}>Pacchetto</label>
                <select style={inp} value={pac} onChange={e => setPac(e.target.value)}>
                  {Object.entries(PACCHETTI).map(([k, v]) => <option key={k} value={k}>{v.label} — €{v.prezzo}/mese</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={() => setShowNew(false)} style={{flex:1,border:"1px solid "+C.border,background:C.white,borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Annulla</button>
              <button onClick={create} disabled={creating||!nome||!slug}
                style={{flex:1,background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,opacity:(!nome||!slug)?0.5:1}}>
                {creating?"Creazione...":"Crea"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  DOC TAB ADMIN                                              */
/* ─────────────────────────────────────────────────────────── */
function DocTabAdmin({ docs, setDocs, inp }) {
  const [mode,     setMode]     = useState(null); // "interno" | "link"
  const [editDoc,  setEditDoc]  = useState(null); // id del doc in editing
  // campi nuovo doc
  const [nome,     setNome]     = useState("");
  const [cat,      setCat]      = useState("brand");
  const [url,      setUrl]      = useState("");
  const [contenuto,setContenuto]= useState("");

  function openNew(tipo) {
    setNome(""); setCat("brand"); setUrl(""); setContenuto("");
    setMode(tipo); setEditDoc(null);
  }

  function openEdit(doc) {
    setNome(doc.nome); setCat(doc.categoria); setUrl(doc.url||""); setContenuto(doc.contenuto||"");
    setEditDoc(doc.id); setMode(doc.sorgente==="interno"?"interno":"link");
  }

  function save() {
    const today = new Date().toISOString().split("T")[0];
    if (editDoc) {
      setDocs(prev => prev.map(d => d.id===editDoc
        ? {...d, nome, categoria:cat, url, contenuto, sorgente:mode==="interno"?"interno":detectSource(url) }
        : d));
    } else {
      const sorgente = mode==="interno" ? "interno" : detectSource(url);
      setDocs(prev => [...prev, {id:"d"+Date.now(), nome, categoria:cat, url, contenuto, sorgente, data:today}]);
    }
    setMode(null); setEditDoc(null);
  }

  function del(id) {
    setDocs(prev => prev.filter(d => d.id!==id));
  }

  const btnBase = {border:"none",borderRadius:8,padding:"12px 14px",cursor:"pointer",fontFamily:FONT,textAlign:"left",display:"flex",flexDirection:"column",gap:4};

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontSize:13,fontWeight:700}}>Documenti ({docs.length})</span>
        <div style={{display:"flex",gap:7}}>
          <button onClick={() => openNew("interno")}
            style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"7px 11px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:FONT}}>
            <Plus size={12} /> Scrivi documento
          </button>
          <button onClick={() => openNew("link")}
            style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"7px 11px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:FONT,color:C.testo}}>
            <Plus size={12} /> Collega link
          </button>
        </div>
      </div>

      {/* Lista documenti */}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:mode?16:0}}>
        {!docs.length && (
          <div style={{textAlign:"center",padding:32,color:C.muted,fontSize:13,border:"1.5px dashed "+C.border,borderRadius:8}}>
            Nessun documento. Crea un documento interno o collega un link esterno.
          </div>
        )}
        {docs.map(doc => {
          const cat2   = DOC_CAT[doc.categoria] || DOC_CAT.brand;
          const src    = SOURCE_META[doc.sorgente || detectSource(doc.url)];
          const isInt  = (doc.sorgente === "interno");
          return (
            <div key={doc.id} style={{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,background:src.bg,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>
                {src.icon}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.nome}</div>
                <div style={{display:"flex",gap:5,marginTop:3,flexWrap:"wrap"}}>
                  <span style={{background:cat2.color+"22",color:cat2.color,padding:"1px 5px",borderRadius:3,fontSize:10,fontWeight:700}}>{cat2.label}</span>
                  <span style={{background:src.bg,color:src.color,padding:"1px 5px",borderRadius:3,fontSize:10,fontWeight:700}}>{src.label}</span>
                  {doc.data && <span style={{fontSize:10,color:C.muted}}>{doc.data}</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={() => openEdit(doc)}
                  style={{background:"none",border:"1px solid "+C.border,borderRadius:5,padding:"4px 9px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT,color:C.testo}}>
                  Modifica
                </button>
                {!isInt && doc.url && doc.url !== "#" && (
                  <a href={doc.url} target="_blank" rel="noreferrer"
                    style={{background:"none",border:"1px solid "+C.verde+"55",borderRadius:5,padding:"4px 9px",fontSize:11,fontWeight:700,textDecoration:"none",color:C.verde,display:"flex",alignItems:"center",gap:3}}>
                    Apri <ExternalLink size={10} />
                  </a>
                )}
                <button onClick={() => del(doc.id)}
                  style={{background:"none",border:"none",cursor:"pointer",color:C.magenta,padding:"4px"}}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form nuovo / edit */}
      {mode && (
        <div style={{background:C.sfondo,borderRadius:10,border:"1px solid "+C.border,padding:18,marginTop:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <span style={{fontSize:16}}>{mode==="interno"?"📝":"🔗"}</span>
            <span style={{fontWeight:700,fontSize:13}}>
              {editDoc ? "Modifica documento" : mode==="interno" ? "Nuovo documento interno" : "Collega documento esterno"}
            </span>
          </div>

          {/* Sorgente esterno: tre opzioni rapide */}
          {mode==="link" && !editDoc && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
              {[
                {key:"paper",  icon:"📄", label:"Dropbox Paper",   hint:"Incolla URL Paper"},
                {key:"dropbox",icon:"📦", label:"Dropbox",         hint:"Incolla URL Dropbox"},
                {key:"drive",  icon:"🗂",  label:"Google Drive",    hint:"Incolla URL Drive"},
              ].map(s => (
                <button key={s.key} onClick={() => setUrl("")}
                  style={{...btnBase, background:SOURCE_META[s.key].bg, color:SOURCE_META[s.key].color, border:"1px solid "+SOURCE_META[s.key].color+"33"}}>
                  <span style={{fontSize:20}}>{s.icon}</span>
                  <span style={{fontWeight:700,fontSize:11}}>{s.label}</span>
                  <span style={{fontSize:10,opacity:.7}}>{s.hint}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>Titolo</label>
              <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Es. Brand Book v2, QBR Q4..." style={{...inp,fontSize:13}} />
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>Categoria</label>
              <select value={cat} onChange={e => setCat(e.target.value)} style={{...inp,fontSize:13}}>
                {Object.entries(DOC_CAT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            {mode==="link" && (
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>
                  URL — {SOURCE_META[detectSource(url)].icon} {SOURCE_META[detectSource(url)].label}
                </label>
                <input value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="https://paper.dropbox.com/... oppure https://drive.google.com/..."
                  style={{...inp,fontSize:12}} />
                {url && detectSource(url) !== "link" && (
                  <div style={{marginTop:5,fontSize:11,color:C.verde,fontWeight:700}}>
                    ✓ Rilevato: {SOURCE_META[detectSource(url)].label}
                  </div>
                )}
              </div>
            )}

            {mode==="interno" && (
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>Contenuto</label>
                <textarea
                  value={contenuto}
                  onChange={e => setContenuto(e.target.value)}
                  rows={12}
                  placeholder={"Scrivi il documento qui.\n\n# Titolo sezione\nTesto della sezione...\n\n## Sottotitolo\n- Punto 1\n- Punto 2"}
                  style={{...inp,fontSize:13,fontFamily:"monospace",lineHeight:1.6,resize:"vertical"}}
                />
                <div style={{fontSize:10,color:C.muted,marginTop:4}}>Usa # per titoli, ## per sottotitoli, - per liste</div>
              </div>
            )}
          </div>

          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button onClick={() => {setMode(null);setEditDoc(null);}}
              style={{flex:1,border:"1px solid "+C.border,background:C.white,borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
              Annulla
            </button>
            <button onClick={save} disabled={!nome}
              style={{flex:1,background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,opacity:!nome?0.5:1}}>
              {editDoc ? "Aggiorna" : "Salva documento"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────── */
/*  ADMIN EDIT — thin wrapper della vista unificata           */
/* ─────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────── */
/*  COPY LINK BUTTON                                           */
/* ─────────────────────────────────────────────────────────── */
function CopyLinkBtn({ slug }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    const url = window.location.origin + window.location.pathname + "#/c/" + slug;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button onClick={copy} title="Copia link cliente"
      style={{background:copied?"#E8F5E9":"none",border:"1px solid "+(copied?C.verde:C.border),
        borderRadius:6,padding:"6px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,
        fontSize:11,fontWeight:700,color:copied?C.verde:C.muted,transition:"all .2s",fontFamily:FONT}}>
      {copied ? <>✅ Copiato!</> : <>🔗 Copia link</>}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  PORTAL VISIBILITY SETTINGS (per-client)                   */
/* ─────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────── */
/*  META CONNECTION SECTION                                     */
/* ─────────────────────────────────────────────────────────── */
function MetaConnectionSection({ slug }) {
  const [meta,       setMeta]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [pagesData,  setPagesData]  = useState(null); // pages to choose from
  const [saved,      setSaved]      = useState(false);

  useEffect(() => {
    store.get("clients:" + slug + ":meta").then(m => { setMeta(m || {}); setLoading(false); });
  }, [slug]);

  async function saveMeta(updated) {
    setMeta(updated);
    await store.set("clients:" + slug + ":meta", updated);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function startOAuth() {
    setConnecting(true);
    openMetaOAuth(async (pages) => {
      try {
        console.log("Meta pages received:", JSON.stringify(pages));
        setPagesData({ pages: pages || [] });
      } catch (e) {
        alert("Errore connessione Meta: " + e.message);
      } finally {
        setConnecting(false);
      }
    });
  }

  async function selectPage(page) {
    const igAcc = page.instagram_business_account;
    // page.access_token is already a long-lived page token from the server
    const updated = {
      ...meta,
      fb: { pageId: page.id, token: page.access_token, name: page.name, connectedAt: Date.now() },
      ...(igAcc ? { ig: { userId: igAcc.id, token: page.access_token, name: igAcc.username || igAcc.name, pic: igAcc.profile_picture_url || "", connectedAt: Date.now() } } : {}),
    };
    await saveMeta(updated);
    setPagesData(null);
  }

  async function disconnect(platform) {
    const updated = { ...meta };
    delete updated[platform];
    await saveMeta(updated);
  }

  if (loading) return null;

  const ig = meta?.ig;
  const fb = meta?.fb;

  const cardStyle = {
    flex: 1, minWidth: 200, border: "1px solid " + C.border, borderRadius: 10,
    padding: "14px 16px", background: C.white,
  };
  const connectedBadge = (
    <span style={{ background: "#E8F5E9", color: C.verde, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
      ✓ Connesso
    </span>
  );

  return (
    <div style={{ background: C.white, border: "1px solid " + C.border, borderRadius: 10, padding: 18, marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <SectionHead icon={<span style={{ fontSize: 14 }}>🔗</span>} label="Connetti Meta (Instagram + Facebook)" />
        {saved && <span style={{ fontSize: 11, color: C.verde, fontWeight: 700 }}>✅ Salvato</span>}
      </div>

      {/* Page selector shown after OAuth */}
      {pagesData && (
        <div style={{ background: "#F0FFF4", border: "1px solid " + C.verde + "55", borderRadius: 8, padding: 14, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Seleziona la pagina del cliente:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pagesData.pages.length === 0 && (
              <div style={{ color: C.muted, fontSize: 12 }}>Nessuna pagina trovata. Assicurati che l'account gestisca almeno una Pagina Facebook.</div>
            )}
            {pagesData.pages.map(page => (
              <button key={page.id} onClick={() => selectPage(page)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "1px solid " + C.border, borderRadius: 8, background: C.white, cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{page.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    {page.instagram_business_account
                      ? "📘 Facebook + 📸 Instagram @" + page.instagram_business_account.username
                      : "📘 Solo Facebook (nessun account IG collegato)"}
                  </div>
                </div>
                <span style={{ background: C.verde, color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>Seleziona</span>
              </button>
            ))}
          </div>
          <button onClick={() => setPagesData(null)}
            style={{ marginTop: 10, fontSize: 11, color: C.muted, background: "none", border: "none", cursor: "pointer", fontFamily: FONT }}>
            Annulla
          </button>
        </div>
      )}

      {/* Connection cards */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {/* Instagram */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ background: "#E1306C", color: "#fff", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>📸 IG</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>Instagram</span>
            {ig && connectedBadge}
          </div>
          {ig ? (
            <>
              <div style={{ fontSize: 12, color: C.testo, marginBottom: 8 }}>@{ig.name}</div>
              <button onClick={() => disconnect("ig")}
                style={{ fontSize: 11, color: C.magenta, background: "none", border: "1px solid " + C.magenta + "55", borderRadius: 5, padding: "3px 10px", cursor: "pointer", fontFamily: FONT, fontWeight: 700 }}>
                Disconnetti
              </button>
            </>
          ) : (
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
              Collega una pagina Facebook con un account Instagram Business per abilitare la pubblicazione.
            </div>
          )}
        </div>

        {/* Facebook */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ background: "#1877F2", color: "#fff", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>📘 FB</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>Facebook</span>
            {fb && connectedBadge}
          </div>
          {fb ? (
            <>
              <div style={{ fontSize: 12, color: C.testo, marginBottom: 8 }}>{fb.name}</div>
              <button onClick={() => disconnect("fb")}
                style={{ fontSize: 11, color: C.magenta, background: "none", border: "1px solid " + C.magenta + "55", borderRadius: 5, padding: "3px 10px", cursor: "pointer", fontFamily: FONT, fontWeight: 700 }}>
                Disconnetti
              </button>
            </>
          ) : (
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
              Collega la pagina per pubblicare post e reel.
            </div>
          )}
        </div>
      </div>

      {/* Main connect button */}
      {(!ig || !fb) && (
        <button onClick={startOAuth} disabled={connecting}
          style={{ marginTop: 14, width: "100%", background: connecting ? C.muted : "#1877F2", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: connecting ? .7 : 1 }}>
          {connecting
            ? (<><style>{`@keyframes dbx-spin{to{transform:rotate(360deg)}}`}</style><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "dbx-spin .7s linear infinite" }} /> Connessione...</>)
            : "🔗 Connetti con Facebook / Instagram"
          }
        </button>
      )}
      {(ig || fb) && (
        <button onClick={startOAuth} disabled={connecting}
          style={{ marginTop: 10, fontSize: 11, color: C.muted, background: "none", border: "1px solid " + C.border, borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontFamily: FONT }}>
          {connecting ? "Connessione..." : "🔄 Ricollega / Cambia account"}
        </button>
      )}

      <div style={{ marginTop: 12, fontSize: 10, color: C.muted, lineHeight: 1.7, background: "#FFFDE7", borderRadius: 6, padding: "8px 12px" }}>
        ⚠️ Il token scade dopo 60 giorni — riconnetti quando appare "Errore token scaduto".<br />
        Assicurati che l'account sia <strong>Admin</strong> della pagina Facebook e che Instagram sia un account <strong>Business o Creator</strong>.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  PUBLISH MODAL                                               */
/* ─────────────────────────────────────────────────────────── */
function PublishModal({ post, meta, onClose, onPublished }) {
  const tipo      = post.tipo || "post";
  const plats     = Array.isArray(post.piattaforme) && post.piattaforme.length
    ? post.piattaforme : [post.piattaforma].filter(Boolean);

  const igOk = plats.includes("instagram") && meta?.ig?.userId;
  const fbOk = plats.includes("facebook")  && meta?.fb?.pageId;
  const igMissing = plats.includes("instagram") && !meta?.ig?.userId;
  const fbMissing = plats.includes("facebook")  && !meta?.fb?.pageId;
  const noneAvailable = !igOk && !fbOk;

  const [mode,       setMode]       = useState("ora");   // "ora" | "pianifica"
  const [schedDate,  setSchedDate]  = useState(post.data || new Date().toISOString().split("T")[0]);
  const [schedTime,  setSchedTime]  = useState("09:00");
  const [status,     setStatus]     = useState("idle"); // "idle"|"publishing"|"success"|"error"
  const [results,    setResults]    = useState([]);     // [{platform, ok, msg}]
  const [videoWait,  setVideoWait]  = useState(false);

  // Compute schedule unix timestamp (Meta requires future time ≥ 10 min)
  const schedUnix = mode === "pianifica" && schedDate
    ? Math.floor(new Date(schedDate + "T" + schedTime + ":00").getTime() / 1000) : null;

  const isVideo  = tipo === "reel" || tipo === "storia";
  const inputStyle = { border: "1px solid " + C.border, borderRadius: 6, padding: "7px 10px", fontSize: 13, fontFamily: FONT };

  async function publish() {
    if (noneAvailable) return;
    setStatus("publishing");
    const out = [];

    if (igOk) {
      try {
        if (isVideo) setVideoWait(true);
        await igPublish(meta.ig.userId, meta.ig.token, post, schedUnix);
        setVideoWait(false);
        out.push({ platform: "Instagram", ok: true });
      } catch (e) {
        setVideoWait(false);
        out.push({ platform: "Instagram", ok: false, msg: e.message });
      }
    }
    if (fbOk) {
      try {
        await fbPublish(meta.fb.pageId, meta.fb.token, post, schedUnix);
        out.push({ platform: "Facebook", ok: true });
      } catch (e) {
        out.push({ platform: "Facebook", ok: false, msg: e.message });
      }
    }

    setResults(out);
    const anyOk = out.some(r => r.ok);
    setStatus(anyOk ? "success" : "error");
    if (anyOk) {
      onPublished(mode === "pianifica" ? "pianificato" : "pubblicato");
    }
  }

  const tipoLabel = { post: "Post", carousel: "Carousel", reel: "Reel", storia: "Storia" };
  const publishLabel = mode === "pianifica" ? "Pianifica" : "Pubblica ora";

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: C.white, borderRadius: 16, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 22 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
            📢
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>Pubblica post</div>
            <div style={{ fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {tipoLabel[tipo] || tipo} · {post.titolo}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>✕</button>
        </div>

        {/* Success state */}
        {status === "success" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
              {mode === "pianifica" ? "Pianificato!" : "Pubblicato!"}
            </div>
            {results.map(r => (
              <div key={r.platform} style={{ fontSize: 13, color: r.ok ? C.verde : C.magenta, marginBottom: 4 }}>
                {r.ok ? "✅" : "❌"} {r.platform} {r.msg ? "— " + r.msg : ""}
              </div>
            ))}
            <button onClick={onClose}
              style={{ marginTop: 18, background: C.verde, color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
              Chiudi
            </button>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            {results.map(r => (
              <div key={r.platform} style={{ fontSize: 12, color: C.magenta, marginBottom: 6, background: "#FFF0F3", borderRadius: 7, padding: "8px 12px", textAlign: "left" }}>
                ❌ <strong>{r.platform}</strong>: {r.msg}
              </div>
            ))}
            <button onClick={() => setStatus("idle")}
              style={{ marginTop: 12, background: C.testo, color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
              Riprova
            </button>
          </div>
        )}

        {/* Publishing state */}
        {status === "publishing" && (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <style>{`@keyframes dbx-spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: 36, height: 36, border: "3px solid #E0E0E0", borderTopColor: C.verde, borderRadius: "50%", animation: "dbx-spin .8s linear infinite", margin: "0 auto 16px" }} />
            <div style={{ fontWeight: 700, fontSize: 14, color: C.testo }}>
              {videoWait ? "Elaborazione video in corso..." : "Pubblicazione in corso..."}
            </div>
            {videoWait && (
              <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
                Instagram elabora i video lato server — potrebbe richiedere 1-2 minuti.
              </div>
            )}
          </div>
        )}

        {/* Idle state — main form */}
        {status === "idle" && (<>

          {/* No accounts connected */}
          {noneAvailable && (
            <div style={{ background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 8, padding: "12px 14px", marginBottom: 18, fontSize: 12, color: "#795548", lineHeight: 1.6 }}>
              ⚠️ Nessun account connesso per questo cliente.<br />
              Vai alla tab <strong>👤 Cliente → 🔗 Connetti Meta</strong> per collegare Instagram e Facebook.
            </div>
          )}

          {/* Platform status */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Piattaforme</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {plats.includes("instagram") && (
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: 8, border: "1px solid " + (igOk ? C.verde : C.border), background: igOk ? "#F1FAF4" : C.sfondo }}>
                  <span style={{ fontSize: 15 }}>📸</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Instagram</div>
                    {igOk
                      ? <div style={{ fontSize: 10, color: C.verde }}>@{meta.ig.name}</div>
                      : <div style={{ fontSize: 10, color: C.magenta }}>Non connesso</div>
                    }
                  </div>
                  {igOk ? <span style={{ fontSize: 14 }}>✓</span> : <span style={{ fontSize: 14, color: C.magenta }}>✗</span>}
                </div>
              )}
              {plats.includes("facebook") && (
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: 8, border: "1px solid " + (fbOk ? C.verde : C.border), background: fbOk ? "#F1FAF4" : C.sfondo }}>
                  <span style={{ fontSize: 15 }}>📘</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Facebook</div>
                    {fbOk
                      ? <div style={{ fontSize: 10, color: C.verde }}>{meta.fb.name}</div>
                      : <div style={{ fontSize: 10, color: C.magenta }}>Non connesso</div>
                    }
                  </div>
                  {fbOk ? <span style={{ fontSize: 14 }}>✓</span> : <span style={{ fontSize: 14, color: C.magenta }}>✗</span>}
                </div>
              )}
            </div>
            {(igMissing || fbMissing) && (
              <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>
                Le piattaforme non connesse verranno saltate.
              </div>
            )}
          </div>

          {/* When to publish */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Quando</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[["ora", "⚡ Ora subito"], ["pianifica", "🗓 Pianifica"]].map(([v, lbl]) => (
                <button key={v} onClick={() => setMode(v)}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "2px solid " + (mode === v ? C.verde : C.border), background: mode === v ? "#F1FAF4" : C.white, color: mode === v ? C.verde : C.testo, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
                  {lbl}
                </button>
              ))}
            </div>
            {mode === "pianifica" && (
              <div style={{ display: "flex", gap: 8 }}>
                <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} style={{ ...inputStyle, width: 90 }} />
              </div>
            )}
            {mode === "pianifica" && (
              <div style={{ fontSize: 10, color: C.muted, marginTop: 5 }}>
                Orario locale del server · min. 10 minuti nel futuro
              </div>
            )}
          </div>

          {/* Tipo-specific note */}
          {tipo === "reel" && (
            <div style={{ background: "#F3E5F5", borderRadius: 7, padding: "8px 12px", fontSize: 11, color: "#6A1B9A", marginBottom: 16, lineHeight: 1.6 }}>
              🎬 I reel vengono elaborati da Instagram (1-2 min). La finestra rimarrà aperta fino al completamento.
            </div>
          )}
          {tipo === "carousel" && fbOk && (
            <div style={{ background: "#E3F2FD", borderRadius: 7, padding: "8px 12px", fontSize: 11, color: "#1565C0", marginBottom: 16, lineHeight: 1.6 }}>
              📸 Su Facebook il carousel viene pubblicato come singola immagine (la prima). Il carousel completo apparirà su Instagram.
            </div>
          )}

          {/* Publish button */}
          <button onClick={publish} disabled={noneAvailable}
            style={{ width: "100%", background: noneAvailable ? C.border : "#111", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 14, fontWeight: 800, cursor: noneAvailable ? "not-allowed" : "pointer", fontFamily: FONT, letterSpacing: .3 }}>
            {publishLabel} {igOk && fbOk ? "su Instagram + Facebook" : igOk ? "su Instagram" : fbOk ? "su Facebook" : ""}
          </button>
        </>)}
      </div>
    </div>
  );
}


function PortalSettings({ slug }) {
  const [settings, setSettings] = useState({ showFeed: true, showKanban: false });
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    store.get("clients:"+slug+":portal").then(s => {
      if (s) setSettings(s);
      setLoading(false);
    });
  }, [slug]);

  async function save(newSettings) {
    setSettings(newSettings);
    await store.set("clients:"+slug+":portal", newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const Toggle = ({ label, desc, value, onChange }) => (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid "+C.border}}>
      <div style={{flex:1,paddingRight:16}}>
        <div style={{fontSize:13,fontWeight:700,color:C.testo}}>{label}</div>
        <div style={{fontSize:11,color:C.muted,marginTop:2}}>{desc}</div>
      </div>
      <button onClick={() => onChange(!value)}
        style={{width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",padding:0,
          background:value?C.verde:"#ccc",position:"relative",transition:"background .2s",flexShrink:0}}>
        <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",
          top:3,left:value?23:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
      </button>
    </div>
  );

  if (loading) return null;

  const url = window.location.origin + window.location.pathname + "#/c/" + slug;

  return (
    <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:18,marginBottom:18}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <SectionHead icon={<ExternalLink size={14} style={{color:C.verde}}/>} label="Portale cliente" />
        {saved && <span style={{fontSize:11,color:C.verde,fontWeight:700}}>✅ Salvato</span>}
      </div>
      <div style={{background:"#F8F8F8",borderRadius:8,padding:"10px 12px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
        <div style={{flex:1,fontSize:11,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
        <CopyLinkBtn slug={slug}/>
      </div>
      <Toggle
        label="Mostra Feed"
        desc="Il cliente può vedere e approvare i post del feed"
        value={settings.showFeed}
        onChange={v => save({...settings, showFeed:v})}
      />
      <Toggle
        label="Mostra Pipeline (Kanban)"
        desc="Il cliente può vedere lo stato dei contenuti in produzione"
        value={settings.showKanban}
        onChange={v => save({...settings, showKanban:v})}
      />
    </div>
  );
}


/* ─────────────────────────────────────────────────────────── */
/*  ACCESSI MANAGER                                            */
/* ─────────────────────────────────────────────────────────── */
function AccessiManager() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [newUser,  setNewUser]  = useState("");
  const [newPass,  setNewPass]  = useState("");
  const [adding,   setAdding]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [showPass, setShowPass] = useState({});
  const inp = {width:"100%",boxSizing:"border-box",border:"1px solid #E0E0E0",borderRadius:8,padding:"9px 12px",fontSize:14,fontFamily:FONT,outline:"none"};

  useEffect(() => {
    store.get("team:admin_users").then(u => {
      setUsers(u || DEFAULT_USERS);
      setLoading(false);
    });
  }, []);

  async function saveUsers(list) {
    await store.set("team:admin_users", list);
    setUsers(list);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function addUser() {
    if (!newUser.trim() || !newPass.trim()) return;
    if (users.length >= 10) { alert("Massimo 10 utenti"); return; }
    if (users.find(u => u.username === newUser.trim())) { alert("Username già esistente"); return; }
    setAdding(true);
    await saveUsers([...users, { username: newUser.trim(), password: newPass.trim() }]);
    setNewUser(""); setNewPass("");
    setAdding(false);
  }

  async function removeUser(username) {
    if (users.length <= 1) { alert("Devi avere almeno un utente"); return; }
    if (!confirm("Rimuovere l'utente " + username + "?")) return;
    await saveUsers(users.filter(u => u.username !== username));
  }

  if (loading) return <Spinner/>;

  return (
    <div style={{maxWidth:520,margin:"0 auto",padding:24,fontFamily:FONT}}>
      <div style={{background:"#fff",border:"1px solid #E0E0E0",borderRadius:12,padding:24,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div>
            <div style={{fontWeight:800,fontSize:16}}>🔐 Gestione accessi</div>
            <div style={{fontSize:11,color:"#6B6B6B",marginTop:2}}>Massimo 10 utenti · {users.length}/10 attivi</div>
          </div>
          {saved && <span style={{fontSize:12,color:"#1A8C3F",fontWeight:700}}>✅ Salvato</span>}
        </div>

        {/* User list */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {users.map((u, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"#F8F8F8",borderRadius:8,padding:"10px 14px"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"#1A8C3F",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{color:"#fff",fontWeight:800,fontSize:13}}>{u.username[0].toUpperCase()}</span>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13}}>{u.username}</div>
                <div style={{fontSize:11,color:"#6B6B6B",display:"flex",alignItems:"center",gap:6}}>
                  {showPass[u.username] ? u.password : "••••••••"}
                  <button onClick={() => setShowPass(p=>({...p,[u.username]:!p[u.username]}))}
                    style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#6B6B6B",padding:0,fontFamily:FONT}}>
                    {showPass[u.username]?"nascondi":"mostra"}
                  </button>
                </div>
              </div>
              <button onClick={() => removeUser(u.username)}
                style={{background:"none",border:"1px solid #E0E0E0",borderRadius:6,padding:"5px 10px",
                  fontSize:11,color:"#C2185B",cursor:"pointer",fontFamily:FONT,fontWeight:700}}>
                Rimuovi
              </button>
            </div>
          ))}
        </div>

        {/* Add new user */}
        {users.length < 10 && (
          <div style={{borderTop:"1px solid #E0E0E0",paddingTop:18}}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>➕ Aggiungi utente</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <input value={newUser} onChange={e=>setNewUser(e.target.value)}
                placeholder="Username (es. marco)" style={inp}/>
              <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)}
                placeholder="Password" style={inp}
                onKeyDown={e => e.key==="Enter" && addUser()}/>
              <button onClick={addUser} disabled={!newUser||!newPass||adding}
                style={{background:"#1A8C3F",color:"#fff",border:"none",borderRadius:8,padding:"10px 0",
                  fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,
                  opacity:(!newUser||!newPass||adding)?.5:1}}>
                {adding?"Aggiunta...":"Aggiungi utente"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:10,padding:14,fontSize:12,color:"#795548",lineHeight:1.7}}>
        <strong>⚠️ Nota di sicurezza:</strong> Le password sono salvate in Supabase.
        Non condividere l&apos;accesso admin con chi non fa parte del team.
        Il link cliente (<code>#/c/slug</code>) non richiede login.
      </div>
    </div>
  );
}

function AdminEdit({ slug }) { return <UnifiedClient slug={slug} isAdmin={true}/>; }


/* ─────────────────────────────────────────────────────────── */
/*  APP                                                         */
/* ─────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────── */
/*  CLIENT APPROVAL VIEW  — portale approvazione cliente       */
/* ─────────────────────────────────────────────────────────── */
function ClientApprovalView({ slug }) {
  const [pinInput, setPinInput] = useState("");
  const [pinOk,    setPinOk]    = useState(false);
  const [pinErr,   setPinErr]   = useState(false);
  const [cliente,  setCliente]  = useState(null);
  const [feed,     setFeed]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [drafts,   setDrafts]   = useState({});   // id → reason text being typed
  const [expanded,    setExpanded]    = useState({});
  const [saving,      setSaving]      = useState(null);
  const [copied,      setCopied]      = useState(false);
  const [portalSettings, setPortalSettings] = useState({ showFeed: true, showKanban: false });
  const [carouselIdx, setCarouselIdx] = useState({});

  function getCarIdx(id)      { return carouselIdx[id] || 0; }
  function setCarIdx(id, idx) { setCarouselIdx(prev => ({...prev, [id]: idx})); }

  useEffect(() => {
    (async () => {
      const [c, f, ps] = await Promise.all([
        store.get("clients:"+slug),
        store.get("clients:"+slug+":feed"),
        store.get("clients:"+slug+":portal"),
      ]);
      setCliente(c||{});
      setFeed(f||[]);
      if (ps) setPortalSettings(ps);
      const hasPIN = c?.pin;
      if (!hasPIN) { setPinOk(true); }
      else {
        const sess = sessionStorage.getItem("nassa_client_"+slug);
        if (sess === c.pin) setPinOk(true);
      }
      setLoading(false);
    })();
  }, [slug]);

  function submitPin() {
    if (pinInput === (cliente?.pin||"")) {
      sessionStorage.setItem("nassa_client_"+slug, pinInput);
      setPinOk(true);
    } else {
      setPinErr(true);
      setTimeout(() => setPinErr(false), 1500);
    }
  }

  async function approve(id) {
    setSaving(id);
    const np = feed.map(x => x.id===id ? {...x, stato:"approvato", noteRifiuto:""} : x);
    setFeed(np);
    await store.set("clients:"+slug+":feed", np);
    setSaving(null);
  }

  async function reject(id) {
    const note = drafts[id] || "";
    setSaving(id);
    const np = feed.map(x => x.id===id ? {...x, stato:"non-approvato", noteRifiuto:note} : x);
    setFeed(np);
    await store.set("clients:"+slug+":feed", np);
    setSaving(null);
    setExpanded(prev => ({...prev, [id]:false}));
  }

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#111",fontFamily:FONT}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Spinner/>
    </div>
  );

  /* ── PIN GATE ─────────────────────────────────────────── */
  if (!pinOk) {
    return (
      <div style={{minHeight:"100vh",background:"#111",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:FONT,padding:24}}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{marginBottom:28,textAlign:"center"}}>
          <div style={{fontWeight:800,fontSize:22,color:"#fff",letterSpacing:1}}>NASSA STUDIO</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:3}}>Portale approvazione contenuti</div>
        </div>
        <div style={{background:"#fff",borderRadius:18,padding:32,maxWidth:320,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.4)"}}>
          <div style={{fontSize:36,marginBottom:12}}>🔒</div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:5}}>{cliente?.nome||"Accesso privato"}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:22,lineHeight:1.5}}>Inserisci il PIN per accedere ai tuoi contenuti</div>
          <input
            type="password" inputMode="numeric"
            value={pinInput} onChange={e=>setPinInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&submitPin()}
            placeholder="• • • •" autoFocus
            style={{width:"100%",boxSizing:"border-box",
              border:"2px solid "+(pinErr?C.magenta:C.border),borderRadius:10,
              padding:"12px 14px",fontSize:20,fontFamily:FONT,textAlign:"center",letterSpacing:8,
              outline:"none",transition:"border-color .2s",marginBottom:pinErr?4:0}}/>
          {pinErr && <div style={{color:C.magenta,fontSize:11,marginTop:4,marginBottom:4,fontWeight:700}}>PIN errato. Riprova.</div>}
          <button onClick={submitPin}
            style={{width:"100%",marginTop:12,background:C.verde,color:"#fff",border:"none",borderRadius:10,
              padding:"12px 0",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
            Accedi →
          </button>
        </div>
        <div style={{marginTop:24,fontSize:10,color:"rgba(255,255,255,.25)"}}>nassastudio.it · Modica (RG)</div>
      </div>
    );
  }

  /* ── APPROVAL PORTAL ─────────────────────────────────── */
  const approved = feed.filter(p=>p.stato==="approvato").length;
  const rejected = feed.filter(p=>p.stato==="non-approvato").length;
  const pending  = feed.length - approved - rejected;

  return (
    <div style={{minHeight:"100vh",background:"#F4F4F4",fontFamily:FONT}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* header */}
      <div style={{background:"#111",padding:"13px 20px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:50}}>
        <div style={{fontWeight:800,fontSize:13,color:"#fff",letterSpacing:.5,flexShrink:0}}>NASSA STUDIO</div>
        <div style={{width:1,height:14,background:"rgba(255,255,255,.2)",flexShrink:0}}/>
        <div style={{fontSize:12,color:"rgba(255,255,255,.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cliente?.nome}</div>
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:10,flexShrink:0}}>
          <span style={{fontSize:11,background:"rgba(26,140,63,.25)",color:"#4CAF50",padding:"2px 8px",borderRadius:20,fontWeight:700}}>✅ {approved}</span>
          <span style={{fontSize:11,background:"rgba(194,24,91,.25)",color:"#EF5350",padding:"2px 8px",borderRadius:20,fontWeight:700}}>❌ {rejected}</span>
          {pending>0 && <span style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>⏳ {pending}</span>}
        </div>
      </div>

      {/* progress */}
      <div style={{height:3,background:"#333"}}>
        <div style={{height:"100%",width:(feed.length?(approved/feed.length*100):0)+"%",background:C.verde,transition:"width .5s"}}/>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"24px 16px"}}>
        {/* intro */}
        <div style={{marginBottom:22}}>
          <h2 style={{margin:"0 0 5px",fontSize:20,fontWeight:800}}>
            {approved===feed.length&&feed.length>0 ? "🎉 Tutti approvati!" : "I tuoi contenuti"}
          </h2>
          <p style={{margin:0,fontSize:12,color:C.muted,lineHeight:1.6}}>
            {approved===feed.length&&feed.length>0
              ? "Perfetto, hai approvato tutti i post. Il team Nassa inizierà la pubblicazione."
              : "Esamina ogni post e approvalo o segnala cosa modificare. Il team riceve la tua risposta in tempo reale."}
          </p>
        </div>

        {/* Feed visibility gated by admin setting */}
        {!portalSettings.showFeed && (
          <div style={{textAlign:"center",padding:60,background:"#fff",borderRadius:16,color:C.muted}}>
            <div style={{fontSize:40,marginBottom:14}}>🔒</div>
            <p style={{margin:0,fontSize:15,fontWeight:700,color:C.testo}}>Contenuti non ancora disponibili</p>
            <p style={{margin:"8px 0 0",fontSize:12}}>Il team sta preparando i tuoi contenuti. Riceverai un aggiornamento presto.</p>
          </div>
        )}

        {portalSettings.showFeed && !feed.length && (
          <div style={{textAlign:"center",padding:60,background:"#fff",borderRadius:16,color:C.muted}}>
            <div style={{fontSize:40,marginBottom:14}}>📭</div>
            <p style={{margin:0,fontSize:15,fontWeight:700,color:C.testo}}>Nessun contenuto da approvare</p>
            <p style={{margin:"8px 0 0",fontSize:12}}>Il team sta preparando i post. Torna presto.</p>
          </div>
        )}

        {portalSettings.showFeed && (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {feed.map((post, i) => {
            // Support both single (legacy) and multi-platform
            const plats   = Array.isArray(post.piattaforme) && post.piattaforme.length ? post.piattaforme : (post.piattaforma ? [post.piattaforma] : []);
            const tipo    = post.tipo || "post";
            const isCarousel = tipo === "carousel";
            const isReel     = tipo === "reel";
            const isStoria   = tipo === "storia";
            const carouselImgs = post.immagini || [];
            const carIdx = getCarIdx(post.id);
            // Pick the best image to show
            const mainImg = isCarousel
              ? (carouselImgs[carIdx] || null)
              : (post.immagineBase64 || post.immagineUrl || null);

            const isApp  = post.stato === "approvato";
            const isRej  = post.stato === "non-approvato";
            const isExp  = expanded[post.id];
            const isSav  = saving === post.id;

            // Type label
            const tipoLabel = isCarousel ? "📸 Carousel" : isReel ? "🎬 Reel" : isStoria ? "📱 Storia" : null;

            return (
              <div key={post.id}
                style={{background:"#fff",borderRadius:16,overflow:"hidden",
                  border:"2px solid "+(isApp?C.verde+"88":isRej?C.magenta+"55":"transparent"),
                  boxShadow:isApp?"0 4px 20px "+C.verde+"22":isRej?"0 4px 20px "+C.magenta+"18":"0 2px 12px rgba(0,0,0,.07)",
                  transition:"all .3s"}}>

                {/* immagine / carousel */}
                <div style={{position:"relative",
                  background:mainImg?"#000":"linear-gradient(135deg,"+(post.colori?.[0]||"#2C3E50")+","+(post.colori?.[1]||"#3498DB")+")",
                  aspectRatio:isStoria?"9/16":"4/3",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>

                  {/* Carousel viewer */}
                  {isCarousel && carouselImgs.length > 0 ? (
                    <>
                      <img src={carouselImgs[carIdx]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      {/* arrows */}
                      {carIdx > 0 && (
                        <button onClick={()=>setCarIdx(c=>c-1)}
                          style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",
                            background:"rgba(0,0,0,.5)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5}}>
                          <span style={{color:"#fff",fontSize:16}}>‹</span>
                        </button>
                      )}
                      {carIdx < carouselImgs.length-1 && (
                        <button onClick={()=>setCarIdx(c=>c+1)}
                          style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",
                            background:"rgba(0,0,0,.5)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5}}>
                          <span style={{color:"#fff",fontSize:16}}>›</span>
                        </button>
                      )}
                      {/* dots */}
                      <div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:4,zIndex:5}}>
                        {carouselImgs.map((_,ci)=>(
                          <div key={ci} onClick={()=>setCarIdx(ci)} style={{width:ci===carIdx?16:6,height:6,borderRadius:3,background:ci===carIdx?"#fff":"rgba(255,255,255,.5)",cursor:"pointer",transition:"width .2s"}}/>
                        ))}
                      </div>
                      {/* counter */}
                      <div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,.55)",borderRadius:6,padding:"2px 8px",zIndex:5}}>
                        <span style={{fontSize:11,color:"#fff",fontWeight:700}}>{carIdx+1}/{carouselImgs.length}</span>
                      </div>
                    </>
                  ) : mainImg ? (
                    <img src={mainImg} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  ) : (
                    <div style={{textAlign:"center",padding:24}}>
                      <div style={{fontSize:36,marginBottom:8,opacity:.6}}>{isReel?"🎬":isStoria?"📱":"📷"}</div>
                      <div style={{color:"rgba(255,255,255,.9)",fontSize:15,fontWeight:700,lineHeight:1.3}}>{post.titolo}</div>
                    </div>
                  )}

                  {/* status badge */}
                  {isApp && (
                    <div style={{position:"absolute",inset:0,background:"rgba(26,140,63,.04)",display:"flex",alignItems:"flex-start",justifyContent:"flex-end",padding:12,pointerEvents:"none"}}>
                      <span style={{background:C.verde,color:"#fff",padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:800,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}>✅ Approvato</span>
                    </div>
                  )}
                  {isRej && (
                    <div style={{position:"absolute",inset:0,background:"rgba(194,24,91,.04)",display:"flex",alignItems:"flex-start",justifyContent:"flex-end",padding:12,pointerEvents:"none"}}>
                      <span style={{background:C.magenta,color:"#fff",padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:800,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}>❌ Non approvato</span>
                    </div>
                  )}
                  <div style={{position:"absolute",bottom:10,left:12}}>
                    <span style={{background:"rgba(0,0,0,.5)",color:"#fff",padding:"3px 9px",borderRadius:10,fontSize:10,fontWeight:700}}>#{i+1}</span>
                  </div>
                </div>

                {/* info + azioni */}
                <div style={{padding:"16px 18px"}}>
                  <div style={{marginBottom:12}}>
                    <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>{post.titolo}</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                      {plats.map(k => { const p=PIATTAFORME[k]; return p ? <span key={k} style={{fontSize:11,fontWeight:700,color:p.color,background:p.color+"15",padding:"2px 8px",borderRadius:10}}>{p.label}</span> : null; })}
                      {tipoLabel && <span style={{fontSize:11,fontWeight:700,color:C.muted,background:"#F0F0F0",padding:"2px 8px",borderRadius:10}}>{tipoLabel}</span>}
                      {post.data && <span style={{fontSize:11,color:C.muted}}>{post.data}</span>}
                    </div>
                  </div>

                  {post.caption && (
                    <p style={{margin:"0 0 12px",fontSize:13,color:"#333",lineHeight:1.7,whiteSpace:"pre-line",
                      borderLeft:"3px solid "+C.border,paddingLeft:12,fontStyle:"italic"}}>
                      {post.caption}
                    </p>
                  )}

                  {/* Extra fields for client */}
                  {(post.cta||post.ctaCustom||post.linkUrl||post.collaborazioni||post.tags) && (
                    <div style={{background:"#F8F8F8",borderRadius:10,padding:"12px 14px",marginBottom:16,display:"flex",flexDirection:"column",gap:8}}>
                      {(post.cta||post.ctaCustom) && (
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:11,fontWeight:800,color:C.muted,flexShrink:0}}>📣 CTA</span>
                          <span style={{fontSize:12,fontWeight:700,color:C.testo,background:C.verde+"18",color:C.verde,padding:"3px 10px",borderRadius:20}}>
                            {post.cta==="custom" ? post.ctaCustom : post.cta}
                          </span>
                        </div>
                      )}
                      {post.linkUrl && (
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                          <span style={{fontSize:11,fontWeight:800,color:C.muted,flexShrink:0}}>🔗 Link</span>
                          <a href={post.linkUrl} target="_blank" rel="noopener noreferrer"
                            style={{fontSize:12,color:"#1565C0",textDecoration:"none",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:280}}>
                            {post.linkLabel || post.linkUrl}
                          </a>
                        </div>
                      )}
                      {post.collaborazioni && (
                        <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                          <span style={{fontSize:11,fontWeight:800,color:C.muted,flexShrink:0,paddingTop:1}}>🤝 Collab</span>
                          <span style={{fontSize:12,color:C.testo,lineHeight:1.5}}>{post.collaborazioni}</span>
                        </div>
                      )}
                      {post.tags && (
                        <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                          <span style={{fontSize:11,fontWeight:800,color:C.muted,flexShrink:0,paddingTop:1}}>🏷 Tag</span>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            {post.tags.split(",").map(t=>t.trim()).filter(Boolean).map((t,i)=>(
                              <span key={i} style={{fontSize:11,background:"#E3F2FD",color:"#1565C0",padding:"2px 8px",borderRadius:20,fontWeight:700}}>{t.startsWith("@")?t:"@"+t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* BOTTONI principali */}
                  {!isExp && (
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <button onClick={()=>approve(post.id)} disabled={isSav}
                        style={{padding:"11px 0",borderRadius:10,cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:700,
                          border:"2px solid "+(isApp?C.verde:"#E0E0E0"),
                          background:isApp?C.verde:"#fff",color:isApp?"#fff":"#444",
                          transition:"all .2s",opacity:isSav?.6:1,
                          boxShadow:isApp?"0 2px 10px "+C.verde+"44":"none"}}>
                        {isSav&&!isApp?"...":"✅ Approvato"}
                      </button>
                      <button onClick={()=>{ setExpanded(prev=>({...prev,[post.id]:true})); setDrafts(prev=>({...prev,[post.id]:post.noteRifiuto||""})); }}
                        disabled={isSav}
                        style={{padding:"11px 0",borderRadius:10,cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:700,
                          border:"2px solid "+(isRej?C.magenta:"#E0E0E0"),
                          background:isRej?C.magenta+"15":"#fff",color:isRej?C.magenta:"#444",
                          transition:"all .2s",opacity:isSav?.6:1}}>
                        ❌ Non approvato
                      </button>
                    </div>
                  )}

                  {/* FORM MOTIVO RIFIUTO */}
                  {isExp && (
                    <div style={{animation:"slideDown .2s ease"}}>
                      <div style={{fontSize:12,fontWeight:700,color:C.magenta,marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
                        <span>❌</span> Scrivi il motivo del rifiuto
                      </div>
                      <textarea
                        value={drafts[post.id]||""}
                        onChange={e=>setDrafts(prev=>({...prev,[post.id]:e.target.value}))}
                        autoFocus rows={3}
                        placeholder="Es. Il testo non è nel nostro stile, l'immagine è troppo scura, vorrei cambiare la caption..."
                        style={{width:"100%",boxSizing:"border-box",
                          border:"2px solid "+C.magenta+"66",borderRadius:10,
                          padding:"10px 13px",fontSize:13,fontFamily:FONT,
                          resize:"vertical",lineHeight:1.65,outline:"none",
                          background:"#FFF8FA"}}/>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
                        <button onClick={()=>setExpanded(prev=>({...prev,[post.id]:false}))}
                          style={{padding:"10px 0",borderRadius:10,border:"1px solid "+C.border,
                            background:"#fff",color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
                          Annulla
                        </button>
                        <button onClick={()=>reject(post.id)} disabled={isSav}
                          style={{padding:"10px 0",borderRadius:10,border:"none",
                            background:C.magenta,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT,
                            opacity:isSav?.6:1}}>
                          {isSav?"Invio...":"Invia motivo"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* nota rifiuto salvata */}
                  {isRej && !isExp && post.noteRifiuto && (
                    <div style={{marginTop:10,background:"#FFF0F3",borderRadius:9,padding:"10px 13px",border:"1px solid "+C.magenta+"33"}}>
                      <div style={{fontSize:10,fontWeight:700,color:C.magenta,marginBottom:4}}>Il tuo motivo inviato</div>
                      <div style={{fontSize:12,color:C.testo,lineHeight:1.6}}>{post.noteRifiuto}</div>
                      <button onClick={()=>{ setExpanded(prev=>({...prev,[post.id]:true})); setDrafts(prev=>({...prev,[post.id]:post.noteRifiuto})); }}
                        style={{marginTop:7,background:"none",border:"none",color:C.magenta,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT,padding:0,textDecoration:"underline"}}>
                        Modifica motivo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {portalSettings.showFeed && feed.length > 0 && (
          <div style={{textAlign:"center",padding:"28px 0 8px",color:C.muted,fontSize:11,lineHeight:1.8}}>
            <div style={{fontWeight:700,color:C.verde,fontSize:12}}>NASSA STUDIO</div>
            nassastudio.it · Modica (RG)
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  LOGIN SCREEN                                                */
/* ─────────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState(false);
  const [shake,    setShake]    = useState(false);
  const [loading,  setLoading]  = useState(false);

  async function login() {
    if (!username || !password) return;
    setLoading(true);
    const users = await store.get("team:admin_users") || DEFAULT_USERS;
    const match = users.find(u => u.username === username.trim() && u.password === password);
    setLoading(false);
    if (match) {
      setAdminSession(username.trim());
      onLogin();
    } else {
      setError(true); setShake(true);
      setTimeout(() => { setError(false); setShake(false); }, 1500);
      setPassword("");
    }
  }

  return (
    <div style={{minHeight:"100vh",background:"#111",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:FONT,padding:24}}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
      `}</style>

      <div style={{marginBottom:32,textAlign:"center"}}>
        <div style={{fontWeight:800,fontSize:28,color:"#fff",letterSpacing:1}}>NASSA STUDIO</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.3)",marginTop:4}}>Admin Portal</div>
      </div>

      <div style={{background:"#fff",borderRadius:20,padding:36,maxWidth:360,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.5)",
        animation:shake?"shake .4s ease":"none"}}>
        <div style={{fontWeight:700,fontSize:18,marginBottom:4}}>Accedi</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:26}}>Solo per il team Nassa Studio</div>

        <input
          type="text" value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key==="Enter" && login()}
          placeholder="Username" autoFocus
          style={{width:"100%",boxSizing:"border-box",border:"2px solid "+(error?C.magenta:C.border),
            borderRadius:10,padding:"12px 14px",fontSize:15,fontFamily:FONT,
            outline:"none",transition:"border-color .2s",marginBottom:12}}
        />
        <input
          type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key==="Enter" && login()}
          placeholder="Password"
          style={{width:"100%",boxSizing:"border-box",border:"2px solid "+(error?C.magenta:C.border),
            borderRadius:10,padding:"12px 14px",fontSize:15,fontFamily:FONT,
            outline:"none",transition:"border-color .2s",marginBottom:error?8:16}}
        />
        {error && (
          <div style={{fontSize:12,color:C.magenta,fontWeight:700,marginBottom:12,
            display:"flex",alignItems:"center",gap:5}}>
            ❌ Credenziali errate. Riprova.
          </div>
        )}
        <button onClick={login} disabled={!username||!password||loading}
          style={{width:"100%",background:C.verde,color:"#fff",border:"none",borderRadius:10,
            padding:"12px 0",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:FONT,
            opacity:(!username||!password||loading)?.6:1,transition:"opacity .15s"}}>
          {loading ? "Verifica..." : "Accedi →"}
        </button>

        <div style={{marginTop:20,padding:"10px 14px",background:"#F8F8F8",borderRadius:8,fontSize:11,color:C.muted,lineHeight:1.6}}>
          <span style={{fontWeight:700,color:C.testo}}>💡 Clienti:</span> condividi il link{" "}
          <code style={{background:"#EEE",padding:"1px 5px",borderRadius:3,fontSize:10}}>#/c/nome-cliente</code>{" "}
          — non serve il login.
        </div>
      </div>

      <div style={{marginTop:24,fontSize:10,color:"rgba(255,255,255,.2)"}}>
        nassastudio.it · Modica (RG)
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  PRIVACY POLICY PAGE                                         */
/* ─────────────────────────────────────────────────────────── */
function PrivacyPage() {
  return (
    <div style={{minHeight:"100vh",background:"#F8F8F8",fontFamily:FONT,color:"#1A1A1A"}}>
      {/* Header */}
      <div style={{background:"#111",padding:"16px 32px",display:"flex",alignItems:"center",gap:16}}>
        <div style={{fontWeight:900,fontSize:18,color:"#fff",letterSpacing:1}}>NASSA STUDIO</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>Privacy Policy</div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"48px 24px"}}>
        {/* Title */}
        <h1 style={{fontSize:32,fontWeight:900,marginBottom:8,color:"#111"}}>Privacy Policy</h1>
        <p style={{fontSize:13,color:"#888",marginBottom:40}}>
          Ultimo aggiornamento: Maggio 2025 · Nassa Studio · nassastudio.it
        </p>

        {[
          {
            title: "1. Informazioni generali",
            body: `Nassa Studio ("noi", "nostro") gestisce la piattaforma Nassa Gestione, uno strumento interno per la gestione dei contenuti social dei propri clienti. La presente Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo le informazioni quando utilizzi la nostra applicazione.`,
          },
          {
            title: "2. Dati raccolti",
            body: `Raccogliamo esclusivamente i dati necessari al funzionamento del servizio:
• Dati di accesso: username e password per l'autenticazione degli amministratori
• Token di accesso: token OAuth rilasciati da Meta (Facebook/Instagram) per la pubblicazione di contenuti sulle pagine dei clienti
• Contenuti: immagini, video e testi caricati dall'amministratore per la pianificazione editoriale
• Dati dei clienti: nome, email, settore e informazioni di contatto inserite manualmente dall'amministratore`,
          },
          {
            title: "3. Utilizzo dei dati",
            body: `I dati raccolti vengono utilizzati esclusivamente per:
• Autenticare gli utenti autorizzati della piattaforma
• Pubblicare e pianificare contenuti sulle pagine Facebook e account Instagram dei clienti
• Archiviare i contenuti editoriali e i documenti di progetto
• Gestire il flusso di lavoro interno del team`,
          },
          {
            title: "4. Accesso a Facebook e Instagram (Meta)",
            body: `La nostra applicazione utilizza le API di Meta per pubblicare contenuti sulle Pagine Facebook e sugli account Instagram Business dei nostri clienti. L'accesso avviene tramite token OAuth rilasciati direttamente da Meta e autorizzati esplicitamente dal titolare dell'account. Non accediamo a dati personali degli utenti delle pagine, messaggi privati, o informazioni non necessarie alla pubblicazione dei contenuti.`,
          },
          {
            title: "5. Archiviazione dei dati",
            body: `I dati sono archiviati su:
• Supabase: database sicuro per i dati strutturati e i token di accesso
• Dropbox: archiviazione di file multimediali (immagini, video, documenti)
Entrambi i servizi adottano misure di sicurezza standard del settore per proteggere i dati.`,
          },
          {
            title: "6. Condivisione con terze parti",
            body: `Non vendiamo, affittiamo o condividiamo i tuoi dati con terze parti per scopi commerciali. I dati vengono condivisi esclusivamente con i servizi tecnici necessari al funzionamento della piattaforma (Meta API, Supabase, Dropbox, Vercel).`,
          },
          {
            title: "7. Conservazione dei dati",
            body: `I dati vengono conservati per tutta la durata del rapporto contrattuale con il cliente. Alla cessazione del rapporto, i dati del cliente vengono eliminati dalla piattaforma su richiesta entro 30 giorni.`,
          },
          {
            title: "8. Diritti degli utenti",
            body: `In conformità al GDPR, hai il diritto di:
• Accedere ai tuoi dati personali
• Richiedere la correzione di dati inesatti
• Richiedere la cancellazione dei tuoi dati
• Opporti al trattamento dei tuoi dati
Per esercitare questi diritti, contattaci a: nassastudiografico@gmail.com`,
          },
          {
            title: "9. Sicurezza",
            body: `Adottiamo misure tecniche e organizzative adeguate per proteggere i dati da accessi non autorizzati, perdita o divulgazione. L'accesso alla piattaforma è protetto da autenticazione e i token di accesso sono cifrati.`,
          },
          {
            title: "10. Contatti",
            body: `Per qualsiasi domanda relativa a questa Privacy Policy o al trattamento dei tuoi dati, contatta:

Nassa Studio
Email: nassastudiografico@gmail.com
Sito web: nassastudio.it
Sede: Modica (RG), Italia`,
          },
        ].map((section, i) => (
          <div key={i} style={{marginBottom:36}}>
            <h2 style={{fontSize:17,fontWeight:800,marginBottom:10,color:"#111",paddingBottom:8,borderBottom:"2px solid #E8E8E8"}}>
              {section.title}
            </h2>
            <p style={{fontSize:14,lineHeight:1.9,color:"#444",whiteSpace:"pre-line",margin:0}}>
              {section.body}
            </p>
          </div>
        ))}

        {/* Footer */}
        <div style={{marginTop:56,padding:"20px 0",borderTop:"1px solid #E0E0E0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div style={{fontSize:12,color:"#888"}}>© 2025 Nassa Studio · Modica (RG) · nassastudio.it</div>
          <a href="#/admin" style={{fontSize:12,color:"#1A8C3F",fontWeight:700,textDecoration:"none"}}>← Torna al portale</a>
        </div>
      </div>
    </div>
  );
}


export default function App() {
  const [route,      setRoute]      = useState(getRoute());
  const [ready,      setReady]      = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(checkAdminSession());

  useEffect(() => {
    // ── Normal app init ───────────────────────────────────────
    seed().then(() => setReady(true));
    function onHash() { setRoute(getRoute()); }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function logout() { clearAdminSession(); setIsLoggedIn(false); }

  /* ── loading ── */
  if (!ready) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#111",fontFamily:FONT}}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{textAlign:"center"}}>
          <div style={{fontWeight:800,fontSize:18,color:C.verde,marginBottom:12}}>NASSA STUDIO</div>
          <Spinner/>
        </div>
      </div>
    );
  }

  /* ── privacy page: always public ── */
  if (route.mode === "privacy") return <PrivacyPage />;

  /* ── client routes: always public, no login ── */
  if (route.mode === "client") return <ClientApprovalView slug={route.slug}/>;

  /* ── admin routes: password required ── */
  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)}/>;

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;} body{margin:0;}`}</style>
      {route.mode==="admin" && route.slug  && <AdminEdit slug={route.slug}  onLogout={logout}/>}
      {route.mode==="admin" && !route.slug && <AdminList onLogout={logout}/>}
    </>
  );
}
