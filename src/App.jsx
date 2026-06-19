import React, { useState, useReducer, useContext, createContext, useEffect, useRef, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { Download, Settings as SettingsIcon, BarChart3, History as HistoryIcon, Search, X, Check, AlertTriangle, RotateCcw, EyeOff, Share2, Sun, Moon, Globe, Bell, BellOff, Package, Trash2, Tag, Sliders, Key, Wifi, Info, Inbox, Clock, TrendingUp, HardDrive, CheckCircle2, XCircle, Loader2, Eye, Play, Pause } from 'lucide-react';
 
// ==========================================
// 1. GLOBAL STYLES & THEME — "Ripe Banana, After Dark"
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
 
    :root {
      --bg: #0C0B09;
      --bg-elevated: #131210;
      --surface: rgba(38, 35, 28, 0.6);
      --surface-solid: #1C1A15;
      --surface-hover: rgba(52, 48, 40, 0.8);
      --peel: #FFC700;
      --peel-glow: rgba(255, 199, 0, 0.22);
      --peel-subtle: rgba(255, 199, 0, 0.07);
      --ripe: #FF7A45;
      --ripe-glow: rgba(255, 122, 69, 0.22);
      --leaf: #5EEAD4;
      --leaf-glow: rgba(94, 234, 212, 0.18);
      --text: #EDE9E1;
      --text-muted: #9B9589;
      --text-faint: #5C5850;
      --danger: #FF6B5E;
      --success: #4ADE80;
      --warning: #FFC700;
      --border: rgba(255, 255, 255, 0.06);
      --border-strong: rgba(255, 255, 255, 0.12);
      --font-display: 'Sora', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --font-arabic: 'Cairo', sans-serif;
      --radius-sm: 6px;
      --radius: 12px;
      --radius-lg: 18px;
      --radius-xl: 24px;
      --transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
      --shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.03);
      --shadow-lg: 0 16px 48px -8px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.04);
      --shadow-peel: 0 8px 32px -4px rgba(255, 199, 0, 0.2);
      --input-bg: rgba(255, 255, 255, 0.035);
      --input-border: rgba(255, 255, 255, 0.09);
      --stripe: repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px);
    }
 
    .light-theme {
      --bg: #F7F4EE;
      --bg-elevated: #FFFFFF;
      --surface: rgba(255, 255, 255, 0.85);
      --surface-solid: #FFFFFF;
      --surface-hover: rgba(255, 251, 238, 0.98);
      --text: #1E1C17;
      --text-muted: #6E6860;
      --text-faint: #A09A90;
      --border: rgba(20, 18, 12, 0.07);
      --border-strong: rgba(20, 18, 12, 0.13);
      --input-bg: rgba(20, 18, 12, 0.025);
      --input-border: rgba(20, 18, 12, 0.09);
      --shadow: 0 4px 20px -4px rgba(20, 18, 12, 0.1), 0 0 0 1px rgba(0,0,0,0.03);
      --shadow-lg: 0 16px 48px -8px rgba(20, 18, 12, 0.14);
      --shadow-peel: 0 8px 32px -4px rgba(255, 199, 0, 0.15);
      --peel-subtle: rgba(255, 199, 0, 0.06);
      --stripe: repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(0,0,0,0.008) 2px, rgba(0,0,0,0.008) 4px);
    }
 
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { -webkit-text-size-adjust: 100%; }
    body {
      background: var(--bg); color: var(--text); font-family: var(--font-display);
      transition: background 0.3s ease, color 0.3s ease; min-height: 100vh; line-height: 1.6;
      -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
    }
 
    .rtl { direction: rtl; font-family: var(--font-arabic); }
    .ltr { direction: ltr; }
    .rtl .mono { direction: ltr; unicode-bidi: embed; }
 
    a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, [tabindex]:focus-visible {
      outline: 2px solid var(--peel); outline-offset: 2px;
    }
 
    .glass-card {
      background: var(--surface); backdrop-filter: blur(20px) saturate(1.4); -webkit-backdrop-filter: blur(20px) saturate(1.4);
      border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow);
      position: relative;
    }
    .glass-card::after {
      content: ''; pointer-events: none; position: absolute; inset: 0;
      border-radius: inherit; background: var(--stripe); opacity: 1;
    }
 
    input, button, select, textarea {
      font-family: inherit; background: var(--input-bg); color: var(--text);
      border: 1px solid var(--input-border); border-radius: var(--radius);
      padding: 13px 18px; transition: var(--transition); font-size: 0.95rem; width: 100%;
    }
    input::placeholder, textarea::placeholder { color: var(--text-faint); }
    input:focus, select:focus, textarea:focus {
      outline: none; border-color: var(--peel); box-shadow: 0 0 0 3px var(--peel-subtle), inset 0 1px 3px rgba(0,0,0,0.15); background: var(--surface-hover);
    }
    button { cursor: pointer; font-weight: 600; width: auto; display: inline-flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap; }
    button:disabled { opacity: 0.45; cursor: not-allowed; }
 
    .btn-primary { background: var(--peel); color: var(--accent-text, #1A1500); border: none; box-shadow: 0 2px 8px var(--peel-glow); letter-spacing: 0.01em; }
    .btn-primary:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); box-shadow: var(--shadow-peel); }
    .btn-primary:active:not(:disabled) { transform: translateY(0); filter: brightness(0.97); }
 
    .btn-ghost { background: var(--input-bg); border: 1px solid var(--border-strong); color: var(--text); }
    .btn-ghost:hover:not(:disabled) { border-color: var(--peel); color: var(--peel); background: var(--peel-subtle); }
 
    .btn-danger { background: transparent; border: 1px solid var(--danger); color: var(--danger); }
    .btn-danger:hover:not(:disabled) { background: rgba(255, 107, 94, 0.12); }
 
    .btn-icon { width: 38px; height: 38px; padding: 0; border-radius: var(--radius-sm); flex-shrink: 0; }
    .btn-sm { padding: 8px 14px; font-size: 0.85rem; }
 
    .btn-tab {
      background: transparent; border: none; color: var(--text-muted); padding: 9px 16px;
      border-radius: var(--radius); font-weight: 600; font-size: 0.88rem; position: relative; letter-spacing: 0.01em;
    }
    .btn-tab.active { color: var(--accent-text, #1A1500); background: var(--peel); box-shadow: 0 2px 8px var(--peel-glow); }
    .btn-tab:not(.active):hover { color: var(--text); background: var(--input-bg); }
 
    .scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
    .scrollbar::-webkit-scrollbar-track { background: transparent; }
    .scrollbar::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 8px; }
    .scrollbar::-webkit-scrollbar-thumb:hover { background: var(--peel); }
 
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px) scale(0.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px) scale(0.97); } to { opacity: 1; transform: translateX(0) scale(1); } }
    .rtl .toast { animation: slideInRtl 0.2s cubic-bezier(0.34,1.56,0.64,1); }
    @keyframes slideInRtl { from { opacity: 0; transform: translateX(-20px) scale(0.97); } to { opacity: 1; transform: translateX(0) scale(1); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 var(--peel-glow); } 50% { box-shadow: 0 0 0 6px transparent; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
 
    .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
    .spinner { width: 18px; height: 18px; border: 2px solid var(--border-strong); border-top-color: var(--peel); border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
    .spin-icon { animation: spin 1s linear infinite; }
    .shimmer-bg { background: linear-gradient(90deg, var(--surface) 25%, var(--surface-hover) 50%, var(--surface) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
 
    .toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; max-width: calc(100vw - 40px); }
    .rtl .toast-container { right: auto; left: 20px; }
    .toast {
      background: var(--surface-solid); border: 1px solid var(--border-strong); border-radius: var(--radius-lg);
      padding: 14px 16px; box-shadow: var(--shadow-lg); display: flex; align-items: flex-start; gap: 10px;
      min-width: 280px; max-width: 380px; animation: slideIn 0.2s cubic-bezier(0.34,1.56,0.64,1); position: relative;
      backdrop-filter: blur(12px);
    }
    .toast.success { border-inline-start: 3px solid var(--success); }
    .toast.error { border-inline-start: 3px solid var(--danger); }
    .toast.warning { border-inline-start: 3px solid var(--peel); }
    .toast-icon { flex-shrink: 0; margin-top: 1px; }
    .toast-close { background: none; border: none; color: var(--text-faint); cursor: pointer; padding: 2px; flex-shrink: 0; }
    .toast-close:hover { color: var(--text); }
 
    .peel-meter { display: flex; gap: 3px; height: 8px; border-radius: 8px; overflow: hidden; background: var(--border); }
    .peel-segment { flex: 1; background: var(--border-strong); transition: background 0.4s ease; }
    .peel-segment.filled-success { background: var(--success); }
    .peel-segment.filled-fail { background: var(--danger); }
 
    .stat-pill { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: var(--radius); background: var(--input-bg); border: 1px solid var(--border); }
    .stat-pill-value { font-family: var(--font-mono); font-weight: 700; font-size: 1.05rem; }
    .stat-pill-label { font-size: 0.78rem; color: var(--text-muted); }
 
    .stat-card { background: var(--input-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; display: flex; flex-direction: column; gap: 6px; }
    .stat-card-value { font-family: var(--font-mono); font-size: 1.8rem; font-weight: 700; color: var(--text); }
    .stat-card-label { font-size: 0.82rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }
 
    .file-row {
      display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: var(--radius);
      cursor: pointer; transition: var(--transition); border: 1px solid transparent;
    }
    .file-row:hover { background: var(--surface-hover); border-color: var(--border); }
    .file-row.selected { background: var(--peel-subtle); border-color: rgba(255,199,0,0.2); }
    .file-icon {
      width: 38px; height: 38px; border-radius: var(--radius-sm); display: flex; align-items: center;
      justify-content: center; flex-shrink: 0; background: var(--input-bg); border: 1px solid var(--border); color: var(--text-muted);
    }
    .file-row.selected .file-icon { color: var(--peel); border-color: var(--peel-glow); }
 
    .checkbox {
      width: 19px; height: 19px; border-radius: 5px; border: 1.5px solid var(--border-strong);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: var(--transition);
      background: var(--input-bg);
    }
    .checkbox.checked { background: var(--peel); border-color: var(--peel); color: #1A1500; }
 
    .progress-container { width: 100%; background: var(--border); border-radius: 10px; height: 5px; overflow: hidden; position: relative; }
    .progress-bar { height: 100%; background: var(--peel); border-radius: 10px; transition: width 0.3s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 0 8px var(--peel-glow); }
    .progress-bar.success { background: var(--success); }
    .progress-bar.danger { background: var(--danger); }
    .progress-bar.paused { background: var(--text-muted); }
    .progress-bar.indeterminate { width: 30% !important; animation: indet 1.2s ease-in-out infinite; }
    @keyframes indet { 0% { transform: translateX(-100%); } 100% { transform: translateX(330%); } }
 
    .bulk-panel { background: var(--input-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
    .bulk-panel input { flex: 1; min-width: 180px; }
    .preview-chip { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); background: var(--surface); padding: 3px 8px; border-radius: 6px; border: 1px solid var(--border); }
 
    .log-panel { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 14px; margin-top: 14px; max-height: 180px; overflow-y: auto; font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); }
    .log-entry { padding: 3px 0; display: flex; gap: 8px; }
    .log-time { color: var(--text-faint); flex-shrink: 0; }
 
    .empty-state { padding: 64px 24px; text-align: center; color: var(--text-muted); }
    .empty-state .icon-wrap { width: 64px; height: 64px; border-radius: 50%; background: var(--input-bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--text-faint); }
    .empty-state h4 { color: var(--text); font-size: 1.05rem; margin-bottom: 6px; font-weight: 700; }
    .empty-state p { font-size: 0.9rem; max-width: 360px; margin: 0 auto; }
 
    .skeleton-row { height: 64px; border-radius: var(--radius); margin-bottom: 6px; }
    .sparkline-wrap { display: flex; align-items: flex-end; gap: 3px; height: 60px; }
    .sparkline-bar { flex: 1; background: var(--peel-glow); border-radius: 3px 3px 0 0; min-height: 3px; transition: height 0.4s ease; }
    .sparkline-bar.has-value { background: var(--peel); }
    .sparkline-bar:hover { background: var(--ripe); }
 
    .setting-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 12px; transition: var(--transition); }
    .setting-card:hover { border-color: var(--border-strong); }
    .setting-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .setting-icon { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--input-bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--peel); flex-shrink: 0; }
    .toggle { width: 44px; height: 26px; border-radius: 14px; background: var(--input-bg); border: 1px solid var(--border-strong); position: relative; cursor: pointer; transition: var(--transition); padding: 0; flex-shrink: 0; }
    .toggle.on { background: var(--peel); border-color: var(--peel); }
    .toggle-knob { width: 20px; height: 20px; border-radius: 50%; background: var(--text); position: absolute; top: 2px; left: 2px; transition: var(--transition); }
    .toggle.on .toggle-knob { left: 22px; background: var(--accent-text, #1A1500); }
    .rtl .toggle-knob { left: 22px; }
    .rtl .toggle.on .toggle-knob { left: 2px; }
 
    .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.01em; }
    .badge.success { background: rgba(74, 222, 128, 0.14); color: var(--success); }
    .badge.danger { background: rgba(255, 107, 94, 0.14); color: var(--danger); }
    .badge.warning { background: var(--peel-glow); color: var(--peel); }
    .badge.muted { background: var(--input-bg); color: var(--text-muted); }
 
    .task-card { padding: 14px 16px; margin-bottom: 6px; background: var(--input-bg); border: 1px solid var(--border); border-radius: var(--radius); border-inline-start-width: 3px; }
    .task-card.completed { border-color: rgba(74, 222, 128, 0.2); border-inline-start-color: var(--success); background: rgba(74,222,128,0.03); }
    .task-card.failed, .task-card.cancelled { border-color: rgba(255, 107, 94, 0.2); border-inline-start-color: var(--danger); background: rgba(255,107,94,0.03); }
    .task-card.paused { border-color: rgba(163, 156, 142, 0.25); border-inline-start-color: var(--text-faint); }
    .task-card.downloading { border-inline-start-color: var(--peel); }
    .task-card.queued { border-inline-start-color: var(--text-faint); }
 
    .fav-card { display: flex; flex-direction: column; gap: 6px; padding: 14px 16px; border-radius: var(--radius); background: var(--input-bg); border: 1px solid var(--border); cursor: pointer; transition: var(--transition); position: relative; text-align: start; width: 100%; }
    .fav-card:hover { border-color: rgba(255,199,0,0.3); background: var(--peel-subtle); box-shadow: 0 4px 16px -4px var(--peel-glow); }
    .fav-card-name { font-weight: 700; font-size: 0.92rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .fav-card-url { font-size: 0.75rem; color: var(--text-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-mono); }
    .fav-delete { position: absolute; top: 8px; inset-inline-end: 8px; opacity: 0; transition: opacity 0.2s; background: none; border: none; color: var(--danger); cursor: pointer; padding: 4px; width: auto; }
    .fav-card:hover .fav-delete { opacity: 1; }

    /* Dashboard styles */
    .dash-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px; }
    .dash-card {
      background: var(--input-bg); border: 1px solid var(--border); border-radius: var(--radius-lg);
      padding: 22px 20px; display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden; transition: var(--transition);
    }
    .dash-card:hover { border-color: var(--border-strong); transform: translateY(-2px); box-shadow: var(--shadow); }
    .dash-card::before { content: ''; position: absolute; top: 0; inset-inline-start: 0; width: 3px; height: 100%; }
    .dash-card.yellow::before { background: linear-gradient(to bottom, var(--peel), transparent); }
    .dash-card.yellow { background: linear-gradient(135deg, var(--peel-subtle) 0%, var(--input-bg) 60%); }
    .dash-card.yellow:hover { border-color: rgba(255,199,0,0.25); box-shadow: 0 8px 24px -4px rgba(255,199,0,0.1); }
    .dash-card.green::before { background: linear-gradient(to bottom, var(--success), transparent); }
    .dash-card.green { background: linear-gradient(135deg, rgba(74,222,128,0.06) 0%, var(--input-bg) 60%); }
    .dash-card.green:hover { border-color: rgba(74,222,128,0.2); box-shadow: 0 8px 24px -4px rgba(74,222,128,0.08); }
    .dash-card.orange::before { background: linear-gradient(to bottom, var(--ripe), transparent); }
    .dash-card.orange { background: linear-gradient(135deg, rgba(255,122,69,0.06) 0%, var(--input-bg) 60%); }
    .dash-card.orange:hover { border-color: rgba(255,122,69,0.2); box-shadow: 0 8px 24px -4px rgba(255,122,69,0.08); }
    .dash-card.teal::before { background: linear-gradient(to bottom, var(--leaf), transparent); }
    .dash-card.teal { background: linear-gradient(135deg, rgba(94,234,212,0.06) 0%, var(--input-bg) 60%); }
    .dash-card.teal:hover { border-color: rgba(94,234,212,0.2); box-shadow: 0 8px 24px -4px rgba(94,234,212,0.08); }
    .dash-card-value { font-family: var(--font-mono); font-size: 1.8rem; font-weight: 700; line-height: 1; color: var(--text); letter-spacing: -0.02em; }
    .dash-card-label { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; letter-spacing: 0.02em; }
    .dash-card-icon { position: absolute; top: 14px; inset-inline-end: 14px; opacity: 0.1; }
    .dash-card-sub { font-size: 0.7rem; color: var(--text-faint); font-family: var(--font-mono); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); }
    .dash-section-title { font-size: 0.72rem; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
    .hero-input-wrap { position: relative; display: flex; gap: 10px; flex-wrap: wrap; }
    .hero-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; background: var(--peel-subtle); color: var(--peel); border: 1px solid rgba(255,199,0,0.15); margin-bottom: 14px; letter-spacing: 0.06em; text-transform: uppercase; }
    @media (max-width: 600px) { .dash-card-value { font-size: 1.4rem; } .dash-grid { grid-template-columns: repeat(2, 1fr); } }
 
    .anime-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: var(--radius); background: var(--input-bg); border: 1px solid var(--border); cursor: pointer; transition: var(--transition); width: 100%; }
    .anime-card:hover { border-color: rgba(255,199,0,0.3); background: var(--peel-subtle); transform: translateX(3px); }
    .anime-card-icon { width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
    .anime-card-name { font-weight: 700; font-size: 0.95rem; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .anime-card-count { font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono); flex-shrink: 0; }
 
    .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--text-muted); flex-wrap: wrap; margin-bottom: 16px; }
    .breadcrumb-btn { background: none; border: none; color: var(--peel); font-weight: 600; padding: 2px 4px; cursor: pointer; font-size: 0.85rem; width: auto; }
    .breadcrumb-btn:hover { text-decoration: underline; }
    .breadcrumb-sep { color: var(--text-faint); }
 
    /* Preview modal */
    .preview-modal-bg {
      position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      display: flex; align-items: center; justify-content: center;
      z-index: 500; padding: 20px;
    }
    .preview-modal {
      background: var(--surface-solid); border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg); padding: 20px; max-width: 90vw; max-height: 90vh;
      overflow: auto; box-shadow: var(--shadow-lg); display: flex; flex-direction: column; gap: 14px;
    }
    .preview-modal video, .preview-modal audio { max-width: 70vw; border-radius: var(--radius); outline: none; }
    .preview-modal img { max-width: 70vw; max-height: 60vh; border-radius: var(--radius); object-fit: contain; }
 
    /* Network badge */
    .net-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .net-badge.fast { background: rgba(74,222,128,0.14); color: var(--success); }
    .net-badge.medium { background: var(--peel-glow); color: var(--peel); }
    .net-badge.slow { background: rgba(255,107,94,0.14); color: var(--danger); }
 
    /* Last episode banner */
    .last-ep-banner {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px;
      background: rgba(94, 234, 212, 0.08); border: 1px solid rgba(94, 234, 212, 0.2);
      border-radius: var(--radius); font-size: 0.88rem;
    }
 
    @media (max-width: 768px) {
      .glass-card { border-radius: var(--radius); }
      .toast-container { left: 12px; right: 12px; bottom: 12px; }
      .toast { min-width: 0; max-width: none; width: 100%; }
      .bulk-panel { flex-direction: column; align-items: stretch; }
      .preview-modal video, .preview-modal img { max-width: 85vw; }
    }
  `}</style>
);
 
// ==========================================
// 2. TRANSLATIONS
// ==========================================
const TRANSLATIONS = {
  en: {
    appName: 'Serfry Banana', tagline: 'Drive downloads, peeled and ready',
    home: 'Home', stats: 'Stats', history: 'History', settings: 'Settings',
    heroTitle: 'Paste a link. Pick your files. Download in one go.',
    heroSub: 'Works straight from your browser — extract a Google Drive folder, rename in bulk, and save everything as a single ZIP.',
    inputPlaceholder: 'Paste a Google Drive folder link…', loadFiles: 'Load files',
    selectAll: 'Select all', deselectAll: 'Deselect all', rangeLabel: 'Episode range', to: '–', searchPlaceholder: 'Search files…',
    sortBy: 'Sort', name: 'Name', size: 'Size', date: 'Date',
    downloadSelected: 'Download selected', downloadZip: 'Download as ZIP', queuePanel: 'Downloads',
    active: 'In progress', completed: 'Completed', failed: 'Failed', cancelled: 'Cancelled', queued: 'Queued', paused: 'Paused',
    clearHistory: 'Clear history', confirmClear: "Clear all download history? This can't be undone.",
    fileName: 'File', sizeCol: 'Size', dateCol: 'Date', statusCol: 'Status', actionsCol: '',
    settingsTitle: 'Settings', language: 'Language', appearance: 'Appearance',
    dark: 'Dark', light: 'Light', themeNote: 'Switch between dark and light backgrounds.',
    accentColor: 'Accent color', accentColorNote: 'Changes the main highlight color across the whole app.', accentReset: 'Reset color',
    maxConcurrent: 'Parallel downloads', maxConcurrentNote: 'How many files download at the same time. Auto-reduces on slow networks.',
    notifications: 'Notifications', notificationsNote: 'Get a browser notification when a download finishes or fails.',
    notifGranted: 'Notifications are on.', notifDenied: 'Notifications are blocked in your browser settings.', notifEnable: 'Enable notifications',
    about: 'About', poweredBy: 'Serfry Banana', version: 'Version 3.0',
    invalidLink: "That doesn't look like a Google Drive folder link. Check it and try again.",
    loadingFiles: 'Reading the folder…',
    noFilesTitle: 'No files in this folder', noFilesBody: "Either the folder is empty or your API key can't access it.",
    noHistoryTitle: 'Nothing downloaded yet', noHistoryBody: 'Files you download will show up here.',
    noQueueTitle: 'Nothing queued', noQueueBody: 'Select files above and start a download to see progress here.',
    noFilesLoadedTitle: 'Paste a link to get started', noFilesLoadedBody: 'Drop in a Google Drive folder link above.',
    rangeStart: 'From', rangeEnd: 'To', filesSelected: 'selected', totalSize: 'Total size',
    apiKey: 'Google Drive API key', apiKeyPlaceholder: 'Starts with AIza…',
    apiKeyNote: 'Stored encrypted in your browser. Never sent anywhere except Google.',
    doubleClickRename: 'Double-click to rename', htmlBlocked: "Drive blocked direct access — opening the file's page instead…",
    downloadFailed: 'Download failed',
    bulkRename: 'Rename selected', bulkPlaceholder: 'Pattern — use # for numbers (0# → 01, 00# → 001)', applyBulk: 'Apply',
    proxyUrl: 'CORS proxy (optional)', proxyPlaceholder: 'https://your-proxy.example/',
    proxyNote: 'Only needed if downloads fail with a network/CORS error.',
    retry: 'Retry', speed: 'Speed', eta: 'Time left', clearCompleted: 'Clear finished',
    cancel: 'Cancel', hide: 'Remove', show: 'Show', pause: 'Pause', resume: 'Resume',
    zipWarning: 'This ZIP will be over 2 GB — building it may take a while. Continue?',
    shareTransfer: 'Open in Drive', preview: 'Preview', log: 'Activity log',
    zipPreparing: 'Fetching files', zipCompressing: 'Building ZIP archive',
    zipDone: 'ZIP downloaded', zipFailed: "Couldn't build the ZIP — files may be too large.",
    statsTitle: 'Your activity', statsSub: 'A look at everything Serfry Banana has downloaded for you.',
    totalFiles: 'Files downloaded', totalSizeStat: 'Total saved', successRate: 'Success rate', avgSpeed: 'Avg. speed',
    last7days: 'Last 7 days', filesPerDay: 'files',
    setApiKeyFirst: 'Add your Google Drive API key in Settings first.',
    needApiKeyBtn: 'Go to Settings',
    filesLoaded: 'files loaded', fetchingFiles: 'Reading folder contents…',
    notifTitle: 'Serfry Banana', notifDownloadDone: 'finished downloading', notifZipDone: 'Your ZIP is ready', notifDownloadFailed: 'failed to download',
    batchDone: 'Batch complete', batchDoneBody: 'completed · failed · saved', batchRetryFailed: 'Retry failed', batchAllDone: 'All done!', batchSomeFailed: 'Some files failed',
    startedDownloads: 'Started', concurrentNote: 'parallel',
    resetSettings: 'Reset to defaults', resetDone: 'Settings reset',
    copyLink: 'Copy link', linkCopied: 'Link copied',
    shareFolder: 'Share folder', shareFolderCopied: 'Share link copied!', shareFolderTip: 'Anyone with this link can open the app with this folder pre-loaded.',
    favorites: 'Saved links', addFavorite: 'Save this link', favoriteSaved: 'Link saved!', favoriteExists: 'Already saved', favoriteDeleted: 'Link removed',
    favNamePlaceholder: 'Name this link (e.g. One Piece)',
    noFavorites: 'No saved links yet.',
    subfolders: 'Select an anime', subfoldersBack: 'Back', subfoldersLoading: 'Loading folders…',
    mixedFolder: 'This folder has both files and subfolders — showing files directly.',
    episodesIn: 'Episodes in',
    networkSpeed: 'Network speed', networkFast: 'Fast', networkMedium: 'Medium', networkSlow: 'Slow',
    networkSlowWarn: 'Slow network detected — downloads reduced to 2 parallel',
    lastEpisode: 'Continue from episode', continueFrom: 'Continue from',
    apiKeyEncrypted: 'API key stored (encrypted)',
    dashToday: 'Today', dashTodayFiles: 'files downloaded', dashTodaySaved: 'saved today',
    dashActive: 'active now', dashSuccessRate: 'success rate', dashAllTime: 'all time',
    dashTotalFiles: 'Total files', dashTotalSaved: 'Total saved', dashQuickAccess: 'Quick access',
    dashNoActivity: 'No activity yet', dashWelcome: 'Welcome to Serfry Banana',
    dashWelcomeSub: 'Paste a Google Drive folder link below to get started.',
  },
  ar: {
    appName: 'سيرفري بنانا', tagline: 'تحميلات درايف، مقشّرة وجاهزة',
    home: 'الرئيسية', stats: 'الإحصائيات', history: 'السجل', settings: 'الإعدادات',
    heroTitle: 'الصق الرابط، اختر ملفاتك، وحمّلها دفعة واحدة',
    heroSub: 'يعمل من المتصفح مباشرة — استخرج محتويات مجلد Google Drive، أعد التسمية دفعة واحدة، واحفظ الكل كملف ZIP واحد.',
    inputPlaceholder: 'الصق رابط مجلد Google Drive…', loadFiles: 'تحميل القائمة',
    selectAll: 'تحديد الكل', deselectAll: 'إلغاء التحديد', rangeLabel: 'نطاق الحلقات', to: 'إلى', searchPlaceholder: 'ابحث في الملفات…',
    sortBy: 'ترتيب', name: 'الاسم', size: 'الحجم', date: 'التاريخ',
    downloadSelected: 'تحميل المحدد', downloadZip: 'تحميل كـ ZIP', queuePanel: 'التحميلات',
    active: 'قيد التنفيذ', completed: 'مكتمل', failed: 'فشل', cancelled: 'ملغي', queued: 'في الانتظار', paused: 'متوقف',
    clearHistory: 'مسح السجل', confirmClear: 'مسح كل سجل التحميلات؟ لا يمكن التراجع عن هذا.',
    fileName: 'الملف', sizeCol: 'الحجم', dateCol: 'التاريخ', statusCol: 'الحالة', actionsCol: '',
    settingsTitle: 'الإعدادات', language: 'اللغة', appearance: 'المظهر',
    dark: 'داكن', light: 'فاتح', themeNote: 'التبديل بين الخلفية الداكنة والفاتحة.',
    accentColor: 'لون التمييز', accentColorNote: 'يغيّر اللون الرئيسي في كامل التطبيق.', accentReset: 'إعادة اللون',
    maxConcurrent: 'التحميلات المتزامنة', maxConcurrentNote: 'عدد الملفات التي تُحمَّل في الوقت نفسه. يتقلص تلقائياً على الشبكات البطيئة.',
    notifications: 'الإشعارات', notificationsNote: 'احصل على إشعار عند اكتمال أو فشل التحميل.',
    notifGranted: 'الإشعارات مفعّلة.', notifDenied: 'الإشعارات محظورة في إعدادات متصفحك.', notifEnable: 'تفعيل الإشعارات',
    about: 'حول التطبيق', poweredBy: 'سيرفري بنانا', version: 'الإصدار 3.0',
    invalidLink: 'هذا لا يبدو كرابط مجلد Google Drive صحيح.',
    loadingFiles: 'جاري قراءة المجلد…',
    noFilesTitle: 'لا توجد ملفات في هذا المجلد', noFilesBody: 'إما أن المجلد فارغ أو أن مفتاح الـ API لا يملك صلاحية الوصول.',
    noHistoryTitle: 'لا يوجد شيء محمَّل بعد', noHistoryBody: 'الملفات التي تحمّلها ستظهر هنا.',
    noQueueTitle: 'لا توجد تحميلات حالياً', noQueueBody: 'حدد ملفات وابدأ التحميل.',
    noFilesLoadedTitle: 'الصق رابطاً للبدء', noFilesLoadedBody: 'ضع رابط مجلد Google Drive في الأعلى.',
    rangeStart: 'من', rangeEnd: 'إلى', filesSelected: 'محدد', totalSize: 'الحجم الإجمالي',
    apiKey: 'مفتاح Google Drive API', apiKeyPlaceholder: 'يبدأ بـ AIza…',
    apiKeyNote: 'يُخزَّن مشفراً في متصفحك. لا يُرسَل إلا لـ Google.',
    doubleClickRename: 'اضغط مرتين لإعادة التسمية', htmlBlocked: 'منع Drive الوصول المباشر.',
    downloadFailed: 'فشل التحميل',
    bulkRename: 'إعادة تسمية المحدد', bulkPlaceholder: 'النموذج — استخدم # للأرقام', applyBulk: 'تطبيق',
    proxyUrl: 'بروكسي CORS (اختياري)', proxyPlaceholder: 'https://your-proxy.example/',
    proxyNote: 'مطلوب فقط إذا فشلت التحميلات بخطأ شبكة.',
    retry: 'إعادة المحاولة', speed: 'السرعة', eta: 'الوقت المتبقي', clearCompleted: 'مسح المنتهي',
    cancel: 'إلغاء', hide: 'إزالة', show: 'إظهار', pause: 'إيقاف', resume: 'استئناف',
    zipWarning: 'حجم ZIP سيتجاوز 2 جيجابايت. المتابعة؟',
    shareTransfer: 'فتح في Drive', preview: 'معاينة', log: 'سجل النشاط',
    zipPreparing: 'جاري جلب الملفات', zipCompressing: 'جاري بناء أرشيف ZIP',
    zipDone: 'تم تحميل ZIP', zipFailed: 'تعذّر بناء ZIP.',
    statsTitle: 'نشاطك', statsSub: 'نظرة على كل ما حمّله سيرفري بنانا لك.',
    totalFiles: 'ملفات محمَّلة', totalSizeStat: 'إجمالي المحفوظ', successRate: 'نسبة النجاح', avgSpeed: 'متوسط السرعة',
    last7days: 'آخر 7 أيام', filesPerDay: 'ملفات',
    setApiKeyFirst: 'أضف مفتاح Google Drive API في الإعدادات أولاً.',
    needApiKeyBtn: 'اذهب إلى الإعدادات',
    filesLoaded: 'ملف تم تحميله', fetchingFiles: 'جاري قراءة محتويات المجلد…',
    notifTitle: 'سيرفري بنانا', notifDownloadDone: 'انتهى تحميله', notifZipDone: 'ملف ZIP جاهز', notifDownloadFailed: 'فشل تحميله',
    batchDone: 'انتهت الدفعة', batchDoneBody: 'مكتمل · فشل · محفوظ', batchRetryFailed: 'إعادة الفاشلين', batchAllDone: 'تم الكل!', batchSomeFailed: 'بعض الملفات فشلت',
    startedDownloads: 'بدأ', concurrentNote: 'بالتوازي',
    resetSettings: 'استعادة الإعدادات الافتراضية', resetDone: 'تمت إعادة الإعدادات',
    copyLink: 'نسخ الرابط', linkCopied: 'تم نسخ الرابط',
    shareFolder: 'مشاركة المجلد', shareFolderCopied: 'تم نسخ رابط المشاركة!', shareFolderTip: 'أي شخص يفتح هذا الرابط سيجد التطبيق مع المجلد محمّلاً مباشرة.',
    favorites: 'الروابط المحفوظة', addFavorite: 'حفظ هذا الرابط', favoriteSaved: 'تم حفظ الرابط!', favoriteExists: 'محفوظ مسبقاً', favoriteDeleted: 'تم حذف الرابط',
    favNamePlaceholder: 'اسم الرابط (مثال: ون بيس)',
    noFavorites: 'لا توجد روابط محفوظة بعد.',
    subfolders: 'اختر أنمي', subfoldersBack: 'رجوع', subfoldersLoading: 'جاري تحميل المجلدات…',
    mixedFolder: 'هذا المجلد فيه ملفات ومجلدات فرعية — يعرض الملفات مباشرة.',
    episodesIn: 'حلقات في',
    networkSpeed: 'سرعة الشبكة', networkFast: 'سريعة', networkMedium: 'متوسطة', networkSlow: 'بطيئة',
    networkSlowWarn: 'شبكة بطيئة — تم تقليل التحميلات المتزامنة إلى 2',
    lastEpisode: 'تكمل من الحلقة', continueFrom: 'تكمل من',
    apiKeyEncrypted: 'مفتاح API محفوظ (مشفّر)',
    dashToday: 'اليوم', dashTodayFiles: 'ملفات محمّلة', dashTodaySaved: 'محفوظ اليوم',
    dashActive: 'نشط الآن', dashSuccessRate: 'نسبة النجاح', dashAllTime: 'إجمالي',
    dashTotalFiles: 'إجمالي الملفات', dashTotalSaved: 'إجمالي المحفوظ', dashQuickAccess: 'وصول سريع',
    dashNoActivity: 'لا يوجد نشاط بعد', dashWelcome: 'أهلاً بك في سيرفري بنانا',
    dashWelcomeSub: 'الصق رابط مجلد Google Drive في الأسفل للبدء.',
  }
};
 
// ==========================================
// 3. ENCRYPTION HELPERS
// ==========================================
const ENCRYPT_PASS = 'serfry-banana-v3-key';
 
async function encryptApiKey(raw) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(ENCRYPT_PASS), 'PBKDF2', false, ['deriveKey']);
  const aesKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  );
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, enc.encode(raw));
  return JSON.stringify({ salt: Array.from(salt), iv: Array.from(iv), ct: Array.from(new Uint8Array(ct)) });
}
 
async function decryptApiKey(stored) {
  try {
    const { salt, iv, ct } = JSON.parse(stored);
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey('raw', enc.encode(ENCRYPT_PASS), 'PBKDF2', false, ['deriveKey']);
    const aesKey = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: new Uint8Array(salt), iterations: 100000, hash: 'SHA-256' },
      baseKey, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, aesKey, new Uint8Array(ct));
    return new TextDecoder().decode(plain);
  } catch { return null; }
}
 
// ==========================================
// 4. SAFE STORAGE UTILITY
// ==========================================
const safeGetLS = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Corrupted storage for "${key}", resetting.`, e);
    try { localStorage.removeItem(key); } catch {}
    return fallback;
  }
};
 
const safeSetLS = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { console.warn(`Failed to persist "${key}":`, e); return false; }
};

// Raw (non-JSON) safe accessors — for storage that may be fully blocked
// (Brave Shields, Safari Private Mode, some in-app browsers throw on ANY access)
const safeLSGetRaw = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeLSSetRaw = (key, value) => {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
};
const safeLSRemove = (key) => {
  try { localStorage.removeItem(key); } catch {}
};

// Notification API is missing entirely on some mobile browsers (e.g. Brave iOS),
// not just permission-denied — so every access must be guarded, not just checked.
const hasNotificationAPI = () => {
  try { return typeof window !== 'undefined' && 'Notification' in window; } catch { return false; }
};
const getNotifPermission = () => {
  try { return hasNotificationAPI() ? Notification.permission : 'unsupported'; } catch { return 'unsupported'; }
};
 
// ==========================================
// 5. CONTEXTS & PROVIDERS
// ==========================================
const LanguageContext = createContext();
const SettingsContext = createContext();
const ToastContext = createContext();
const DownloadContext = createContext();
 
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration) setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    return id;
  }, []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
 
  const iconFor = (type) => {
    if (type === 'success') return <CheckCircle2 size={18} color="var(--success)" />;
    if (type === 'error') return <XCircle size={18} color="var(--danger)" />;
    return <AlertTriangle size={18} color="var(--peel)" />;
  };
 
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span className="toast-icon">{iconFor(toast.type)}</span>
            <span style={{ flex: 1, fontSize: '0.9rem' }}>{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Dismiss"><X size={16} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
 
const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => safeGetLS('sb_lang', 'ar'));
  useEffect(() => { safeSetLS('sb_lang', lang); }, [lang]);
  const t = (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  return <LanguageContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>{children}</LanguageContext.Provider>;
};
 
const defaultSettings = { theme: 'dark', maxConcurrent: 4, notifications: false, apiKey: '', proxyUrl: '', accentColor: '#FFC700' };
 
const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => ({ ...defaultSettings, ...safeGetLS('sb_settings', {}) }));
  // Decrypt API key on mount
  useEffect(() => {
    (async () => {
      const enc = safeLSGetRaw('sb_apikey_enc');
      if (enc) {
        const dec = await decryptApiKey(enc);
        if (dec) setSettings(prev => ({ ...prev, apiKey: dec }));
      }
    })();
  }, []);
 
  useEffect(() => {
    // Save settings without API key (that goes encrypted separately)
    const { apiKey: _, ...rest } = settings;
    safeSetLS('sb_settings', rest);
    document.body.className = settings.theme === 'light' ? 'light-theme' : '';
    // Apply accent color
    const accent = settings.accentColor || '#FFC700';
    const r = parseInt(accent.slice(1,3),16);
    const g = parseInt(accent.slice(3,5),16);
    const b = parseInt(accent.slice(5,7),16);
    document.documentElement.style.setProperty('--peel', accent);
    document.documentElement.style.setProperty('--peel-glow', `rgba(${r},${g},${b},0.28)`);
    document.documentElement.style.setProperty('--warning', accent);
    // Compute luminance to decide text color on accent bg
    const lum = 0.2126*(r/255) + 0.7152*(g/255) + 0.0722*(b/255);
    document.documentElement.style.setProperty('--accent-text', lum > 0.45 ? '#1A1500' : '#FFFFFF');
  }, [settings]);
 
  const updateSetting = async (key, value) => {
    if (key === 'apiKey') {
      // Encrypt and store separately
      try {
        if (value) {
          const enc = await encryptApiKey(value);
          safeLSSetRaw('sb_apikey_enc', enc);
        } else {
          safeLSRemove('sb_apikey_enc');
        }
      } catch (e) { console.warn('Encryption failed, storing plain', e); }
    }
    setSettings(prev => ({ ...prev, [key]: key === 'maxConcurrent' ? Math.max(1, Math.min(value, 5)) : value }));
  };
 
  const resetSettings = () => {
    safeLSRemove('sb_apikey_enc');
    setSettings(defaultSettings);
  };
 
  return <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>{children}</SettingsContext.Provider>;
};
 
// ==========================================
// 6. DOWNLOAD REDUCER & CONTEXT
// ==========================================
const initialQueue = { tasks: [], logs: [], history: [], dailyStats: {} };
 
function queueReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, tasks: [...state.tasks, ...action.payload] };
    case 'UPDATE': {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id && t.batchId === action.payload.batchId);
      if (idx === -1) return state;
      const updated = [...state.tasks];
      updated[idx] = { ...updated[idx], ...action.payload };
      return { ...state, tasks: updated };
    }
    case 'LOG': {
      const newLogs = [...state.logs, { ...action.payload, time: new Date().toLocaleTimeString() }];
      return { ...state, logs: newLogs.slice(-100) };
    }
    case 'COMPLETE_DOWNLOAD': {
      const { name, size, status, kind } = action.payload;
      const day = new Date().toISOString().slice(0, 10);
      const dailyStats = { ...state.dailyStats };
      if (!dailyStats[day]) dailyStats[day] = { completed: 0, failed: 0, bytes: 0 };
      if (status === 'completed') {
        dailyStats[day] = { ...dailyStats[day], completed: dailyStats[day].completed + 1, bytes: dailyStats[day].bytes + (size || 0) };
      } else {
        dailyStats[day] = { ...dailyStats[day], failed: dailyStats[day].failed + 1 };
      }
      const history = [{ id: `${Date.now()}_${Math.random()}`, name, size: size || 0, status, kind: kind || 'file', date: new Date().toISOString() }, ...state.history].slice(0, 200);
      return { ...state, history, dailyStats };
    }
    case 'CLEAR_COMPLETED':
      return { ...state, tasks: state.tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled') };
    case 'CLEAR_HISTORY':
      return { ...state, history: [], dailyStats: {} };
    case 'HYDRATE':
      return { ...initialQueue, ...action.payload, tasks: [] };
    default:
      return state;
  }
}
 
const DownloadProvider = ({ children }) => {
  const [state, dispatch] = useReducer(queueReducer, initialQueue);
 
  useEffect(() => {
    const saved = safeGetLS('sb_queue', null);
    if (saved) dispatch({ type: 'HYDRATE', payload: saved });
  }, []);
 
  const saveTimer = useRef(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      safeSetLS('sb_queue', { history: state.history, dailyStats: state.dailyStats, logs: state.logs.slice(-30) });
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [state.history, state.dailyStats, state.logs]);
 
  return <DownloadContext.Provider value={{ state, dispatch }}>{children}</DownloadContext.Provider>;
};
 
// ==========================================
// 7. NOTIFICATIONS
// ==========================================
const notify = (title, body, tag = 'serfry-banana') => {
  try {
    if (!hasNotificationAPI()) return;
    if (Notification.permission === 'granted') new Notification(title, { body, tag });
  } catch {}
};
 
// ==========================================
// 8. UTILITIES
// ==========================================
const parseDriveLink = (url) => {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? { id: match[1] } : null;
};
 
const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '—';
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
 
const formatTime = (sec) => {
  if (!sec || sec <= 0 || sec === Infinity || isNaN(sec)) return '—';
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};
 
const getFileKind = (type = '') => {
  if (type.includes('video')) return 'video';
  if (type.includes('audio')) return 'audio';
  if (type.includes('image')) return 'image';
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'document';
  if (type.includes('zip') || type.includes('archive') || type.includes('compressed')) return 'archive';
  return 'other';
};
 
const isPreviewable = (type = '') => type.includes('video') || type.includes('audio') || type.includes('image');
 
const extractEpisodeNumber = (name) => {
  const cleaned = name.replace(/\b(480|720|1080|2160|4k|8k)p?\b/gi, '');
  const patterns = [
    /S\d{1,2}E(\d{1,4})/i,
    /\bep(?:isode)?\.?\s*(\d{1,4})/i,
    /[-_\s]\s*(\d{1,4})\s*(?:\[|\(|$|\.(?!$))/,
    /#\s*(\d{1,4})/,
    /\b(\d{1,4})\b(?!.*\b\d{1,4}\b)/,
  ];
  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) { const num = parseInt(match[1], 10); if (!isNaN(num)) return num; }
  }
  return 0;
};
 
const fetchFolderContents = async (folderId, apiKey) => {
  let subfolders = [], files = [], nextPageToken = null;
  do {
    const query = `'${folderId}' in parents and trashed = false`;
    const fields = 'files(id, name, size, mimeType, createdTime), nextPageToken';
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&key=${apiKey}&fields=${encodeURIComponent(fields)}&pageSize=100${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.error?.message || 'Failed to fetch folder');
    }
    const data = await response.json();
    for (const item of (data.files || [])) {
      if (item.mimeType === 'application/vnd.google-apps.folder') {
        subfolders.push({ id: item.id, name: item.name });
      } else {
        files.push({ id: item.id, name: item.name, size: parseInt(item.size) || 0, type: item.mimeType || '', date: item.createdTime || new Date().toISOString() });
      }
    }
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);
  return { subfolders, files };
};
 
const applyBulkRename = (pattern, files, customNames) => {
  const newNames = { ...customNames };
  files.forEach((f, idx) => {
    let num = extractEpisodeNumber(f.name) || (idx + 1);
    let newName = pattern.replace(/(0*)#/g, (match, zeros) => {
      const padLength = zeros.length > 0 ? zeros.length + 1 : 1;
      return String(num).padStart(padLength, '0');
    });
    newNames[f.id] = newName;
  });
  return newNames;
};
 
const generatePreview = (pattern, count = 3) => {
  const samples = [];
  for (let i = 1; i <= count; i++) {
    samples.push(pattern.replace(/(0*)#/g, (match, zeros) => {
      const padLength = zeros.length > 0 ? zeros.length + 1 : 1;
      return String(i).padStart(padLength, '0');
    }));
  }
  return samples;
};
 
// Detect network speed
async function detectNetworkSpeed() {
  try {
    const start = Date.now();
    await fetch('https://www.google.com/favicon.ico?_=' + Date.now(), { cache: 'no-store', mode: 'no-cors' });
    const ms = Date.now() - start;
    return ms > 1500 ? 'slow' : ms > 600 ? 'medium' : 'fast';
  } catch { return 'medium'; }
}
 
// ==========================================
// 9. SHARED COMPONENTS
// ==========================================
const KIND_ICONS = { video: '🎬', audio: '🎵', image: '🖼️', document: '📄', archive: '🗜️', other: '📁' };
 
const ProgressBar = ({ progress, status, indeterminate }) => {
  let cls = 'progress-bar';
  if (status === 'completed') cls += ' success';
  else if (status === 'failed' || status === 'cancelled') cls += ' danger';
  else if (status === 'paused') cls += ' paused';
  if (indeterminate) cls += ' indeterminate';
  return (
    <div className="progress-container">
      <div className={cls} style={!indeterminate ? { width: `${Math.min(Math.max(progress, 0), 100)}%` } : undefined} />
    </div>
  );
};
 
const EmptyState = ({ icon, title, body, action }) => (
  <div className="empty-state">
    <div className="icon-wrap">{icon}</div>
    <h4>{title}</h4>
    <p>{body}</p>
    {action && <div style={{ marginTop: '16px' }}>{action}</div>}
  </div>
);
 
const StatusBadge = ({ status, t }) => {
  const map = {
    completed: { cls: 'success', icon: <CheckCircle2 size={13} />, label: t('completed') },
    failed: { cls: 'danger', icon: <XCircle size={13} />, label: t('failed') },
    cancelled: { cls: 'muted', icon: <X size={13} />, label: t('cancelled') },
    paused: { cls: 'muted', icon: <Pause size={13} />, label: t('paused') },
    downloading: { cls: 'warning', icon: <Loader2 size={13} className="spin-icon" />, label: t('active') },
    queued: { cls: 'muted', icon: <Clock size={13} />, label: t('queued') },
  };
  const m = map[status] || map.queued;
  return <span className={`badge ${m.cls}`}>{m.icon}{m.label}</span>;
};
 
// Preview Modal
const PreviewModal = ({ file, apiKey, onClose, t }) => {
  if (!file) return null;
  const url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${apiKey}`;
  const kind = getFileKind(file.type);
  return (
    <div className="preview-modal-bg" onClick={onClose}>
      <div className="preview-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {KIND_ICONS[kind]} {file.name}
          </span>
          <button className="btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        {kind === 'video' && <video src={url} controls autoPlay style={{ maxWidth: '70vw', maxHeight: '60vh' }} />}
        {kind === 'audio' && <audio src={url} controls autoPlay style={{ width: '100%' }} />}
        {kind === 'image' && <img src={url} alt={file.name} style={{ maxWidth: '70vw', maxHeight: '60vh' }} />}
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
          <span>{formatBytes(file.size)}</span>
          <span>{file.type}</span>
        </div>
      </div>
    </div>
  );
};
 
const FileList = ({ files, onSelect, selected, search, sort, range, customNames, onRename, t, loading, onPreview }) => {
  const containerRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const ROW_HEIGHT = 64;
  const VISIBLE = 14;
 
  const filtered = useMemo(() => {
    let res = files.filter(f => (customNames[f.id] || f.name).toLowerCase().includes(search.toLowerCase()));
    if (range.start !== null && range.end !== null) {
      const s = Math.min(range.start, range.end) - 1;
      const e = Math.max(range.start, range.end);
      res = res.filter((_, i) => i >= s && i < e);
    }
    res = [...res].sort((a, b) => {
      if (sort === 'name') return (customNames[a.id] || a.name).localeCompare(customNames[b.id] || b.name, undefined, { numeric: true });
      if (sort === 'size') return b.size - a.size;
      return new Date(b.date) - new Date(a.date);
    });
    return res;
  }, [files, search, sort, range, customNames]);
 
  const handleScroll = () => setScrollPos(containerRef.current.scrollTop);
  const startIdx = Math.max(0, Math.floor(scrollPos / ROW_HEIGHT) - 2);
  const visibleFiles = filtered.slice(startIdx, startIdx + VISIBLE + 4);
 
  const startEdit = (e, file) => { e.stopPropagation(); setEditingId(file.id); setEditValue(customNames[file.id] || file.name); };
  const saveEdit = () => { if (editingId && editValue.trim()) onRename(editingId, editValue.trim()); setEditingId(null); };
  const handleShare = (e, id) => { e.stopPropagation(); window.open(`https://drive.google.com/file/d/${id}/view?usp=sharing`, '_blank', 'noopener'); };
 
  if (loading) return <div>{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-row shimmer-bg" />)}</div>;
  if (filtered.length === 0) return <EmptyState icon={<Search size={26} />} title={t('noFilesTitle')} body={t('noFilesBody')} />;
 
  return (
    <div ref={containerRef} onScroll={handleScroll} className="scrollbar" style={{ maxHeight: '460px', overflowY: 'auto', position: 'relative' }}>
      <div style={{ height: `${filtered.length * ROW_HEIGHT}px`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: startIdx * ROW_HEIGHT, width: '100%' }}>
          {visibleFiles.map((f) => {
            const isSelected = selected.has(f.id);
            const kind = getFileKind(f.type);
            const displayName = customNames[f.id] || f.name;
            const isEditing = editingId === f.id;
            const canPreview = isPreviewable(f.type);
            return (
              <div key={f.id} className={`file-row ${isSelected ? 'selected' : ''}`} style={{ height: `${ROW_HEIGHT - 4}px`, marginBottom: '4px' }} onClick={() => onSelect(f.id)}>
                <div className={`checkbox ${isSelected ? 'checked' : ''}`}>{isSelected && <Check size={13} />}</div>
                <div className="file-icon">{KIND_ICONS[kind]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {isEditing ? (
                    <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={saveEdit}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null); }}
                      onClick={(e) => e.stopPropagation()} style={{ padding: '4px 8px', fontSize: '0.9rem' }} />
                  ) : (
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'text' }}
                      onDoubleClick={(e) => startEdit(e, f)} title={t('doubleClickRename')}>{displayName}</div>
                  )}
                  <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {formatBytes(f.size)} <span style={{ color: 'var(--text-faint)' }}>·</span> {(f.type.split('/')[1] || f.type || '?').toUpperCase()}
                  </div>
                </div>
                {canPreview && (
                  <button onClick={(e) => { e.stopPropagation(); onPreview(f); }} className="btn-ghost btn-icon" title={t('preview')}><Eye size={15} /></button>
                )}
                <button onClick={(e) => handleShare(e, f.id)} className="btn-ghost btn-icon" title={t('shareTransfer')}><Share2 size={15} /></button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
 
const Navbar = ({ activeTab, setActiveTab }) => {
  const { lang, setLang, t } = useContext(LanguageContext);
  const { settings, updateSetting } = useContext(SettingsContext);
 
  const tabs = [
    { id: 'home', label: t('home'), icon: <Download size={16} /> },
    { id: 'stats', label: t('stats'), icon: <BarChart3 size={16} /> },
    { id: 'history', label: t('history'), icon: <HistoryIcon size={16} /> },
    { id: 'settings', label: t('settings'), icon: <SettingsIcon size={16} /> },
  ];
 
  return (
    <nav className="glass-card" style={{ margin: '12px 12px 0', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '12px', zIndex: 100, flexWrap: 'wrap', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ fontSize: '1.4rem', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--peel-subtle)', border: '1px solid rgba(255,199,0,0.15)', flexShrink: 0 }}>🍌</div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.4px', lineHeight: 1.2 }}>{t('appName')}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', letterSpacing: '0.02em' }}>{t('tagline')}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '2px', background: 'var(--input-bg)', borderRadius: 'var(--radius)', padding: '3px', flexWrap: 'wrap', border: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`btn-tab ${activeTab === tab.id ? 'active' : ''}`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="btn-ghost btn-icon" style={{ fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.04em' }}>{lang === 'ar' ? 'EN' : 'AR'}</button>
        <div style={{ width: '1px', height: '20px', background: 'var(--border-strong)' }} />
        <button onClick={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')} className="btn-ghost btn-icon">
          {settings.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </nav>
  );
};
 
// ==========================================
// 10. DASHBOARD PANEL
// ==========================================
const DashboardPanel = ({ onNavigate }) => {
  const { t } = useContext(LanguageContext);
  const { state } = useContext(DownloadContext);

  const today = new Date().toISOString().slice(0, 10);
  const todayStats = state.dailyStats[today] || { completed: 0, failed: 0, bytes: 0 };

  const totalFiles = state.history.filter(h => h.status === 'completed').length;
  const totalBytes = state.history.filter(h => h.status === 'completed').reduce((a, h) => a + (h.size || 0), 0);
  const totalFailed = state.history.filter(h => h.status === 'failed').length;
  const successRate = (totalFiles + totalFailed) > 0 ? Math.round((totalFiles / (totalFiles + totalFailed)) * 100) : null;

  const activeTasks = state.tasks.filter(t => t.status === 'downloading' || t.status === 'queued').length;

  const hasAnyData = totalFiles > 0 || todayStats.completed > 0 || activeTasks > 0;

  if (!hasAnyData) return null;

  return (
    <div style={{ padding: '20px 14px 0' }}>
      <div className="dash-section-title">📊 {t('dashToday')}</div>
      <div className="dash-grid">
        <div className="dash-card yellow">
          <div className="dash-card-icon"><Download size={32} /></div>
          <div className="dash-card-value">{todayStats.completed}</div>
          <div className="dash-card-label">{t('dashTodayFiles')}</div>
          {todayStats.bytes > 0 && <div className="dash-card-sub">{formatBytes(todayStats.bytes)}</div>}
        </div>
        {activeTasks > 0 && (
          <div className="dash-card orange">
            <div className="dash-card-icon"><Loader2 size={32} /></div>
            <div className="dash-card-value">{activeTasks}</div>
            <div className="dash-card-label">{t('dashActive')}</div>
            <div className="dash-card-sub" style={{ color: 'var(--ripe)' }}>▶ live</div>
          </div>
        )}
        {totalFiles > 0 && (
          <div className="dash-card green">
            <div className="dash-card-icon"><HardDrive size={32} /></div>
            <div className="dash-card-value">{totalFiles}</div>
            <div className="dash-card-label">{t('dashTotalFiles')}</div>
            <div className="dash-card-sub">{formatBytes(totalBytes)} {t('dashAllTime')}</div>
          </div>
        )}
        {successRate !== null && (
          <div className="dash-card teal">
            <div className="dash-card-icon"><TrendingUp size={32} /></div>
            <div className="dash-card-value">{successRate}%</div>
            <div className="dash-card-label">{t('dashSuccessRate')}</div>
            <div className="dash-card-sub">{totalFailed > 0 ? `${totalFailed} failed` : '✓ clean'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 11. HOME PAGE
// ==========================================
const PeelMeter = ({ completed, failed, total }) => {
  const SEGMENTS = 20;
  const safeTotal = Math.max(total, 1);
  const filledCount = Math.round((completed / safeTotal) * SEGMENTS);
  const failedCount = Math.round((failed / safeTotal) * SEGMENTS);
  return (
    <div className="peel-meter" role="img" aria-label={`${completed} completed, ${failed} failed out of ${total}`}>
      {Array.from({ length: SEGMENTS }).map((_, i) => {
        let cls = 'peel-segment';
        if (i < failedCount) cls += ' filled-fail';
        else if (i < failedCount + filledCount) cls += ' filled-success';
        return <div key={i} className={cls} />;
      })}
    </div>
  );
};
 
const HomePage = ({ onNavigate }) => {
  const { t, isRTL } = useContext(LanguageContext);
  const { settings } = useContext(SettingsContext);
  const { addToast } = useContext(ToastContext);
  const { state, dispatch } = useContext(DownloadContext);
 
  const [url, setUrl] = useState('');
  const [loadError, setLoadError] = useState(null);
  const [favorites, setFavorites] = useState(() => safeGetLS('sb_favorites', []));
  const [favName, setFavName] = useState('');
  const [showFavInput, setShowFavInput] = useState(false);
  const [browseState, setBrowseState] = useState(null);
  const [subfolders, setSubfolders] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [range, setRange] = useState({ start: null, end: null });
  const [customNames, setCustomNames] = useState({});
  const [bulkPattern, setBulkPattern] = useState('Episode #');
  const [zipProgress, setZipProgress] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [networkSpeed, setNetworkSpeed] = useState('fast');
  // lastEpisode: { [folderId]: { fileId, name, ep } }
  const [lastEpisode, setLastEpisode] = useState(() => safeGetLS('sb_lastepisode', {}));
 
  const abortControllers = useRef(new Map());
  const pausedData = useRef(new Map()); // fileId → { chunks, loaded }

  // ── Auto-load folder from URL param (?folder=...) ───────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const folderParam = params.get('folder');
    if (folderParam) {
      setUrl(folderParam);
      // Wait for settings to be ready, then load
      const timer = setTimeout(() => loadFolder(folderParam), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleShareFolder = useCallback(() => {
    if (!url) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?folder=${encodeURIComponent(url)}`;
    const fallbackCopy = () => {
      try {
        const el = document.createElement('textarea');
        el.value = shareUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        addToast(t('shareFolderCopied'), 'success');
      } catch {
        addToast(shareUrl, 'warning'); // last resort: show the link itself
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        addToast(t('shareFolderCopied'), 'success');
      }).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }, [url, addToast, t]);
  const batchIdRef = useRef(0);
 
  // Effective concurrency (reduced on slow network)
  const MAX_CONCURRENT = useMemo(() => {
    const base = Math.max(1, Math.min(settings.maxConcurrent || 4, 5));
    return networkSpeed === 'slow' ? Math.min(2, base) : base;
  }, [settings.maxConcurrent, networkSpeed]);
 
  useEffect(() => { safeSetLS('sb_favorites', favorites); }, [favorites]);
  useEffect(() => { safeSetLS('sb_lastepisode', lastEpisode); }, [lastEpisode]);
 
  // Detect network on mount
  useEffect(() => {
    detectNetworkSpeed().then(speed => {
      setNetworkSpeed(speed);
      if (speed === 'slow') addToast(t('networkSlowWarn'), 'warning');
    });
    if (hasNotificationAPI() && getNotifPermission() === 'default') {
      try { Notification.requestPermission(); } catch {}
    }
  }, []);
 
  // ── Favorites ──────────────────────────────────────────────
  const saveFavorite = () => {
    const name = favName.trim() || url;
    if (!name || !url) return;
    if (favorites.find(f => f.url === url)) { addToast(t('favoriteExists'), 'warning'); return; }
    setFavorites([{ id: Date.now(), name, url }, ...favorites]);
    setFavName(''); setShowFavInput(false);
    addToast(t('favoriteSaved'), 'success');
  };
  const deleteFavorite = (id, e) => { e.stopPropagation(); setFavorites(prev => prev.filter(f => f.id !== id)); addToast(t('favoriteDeleted'), 'success'); };
  const loadFavorite = (fav) => { setUrl(fav.url); loadFolder(fav.url); };
 
  // ── Last episode suggestion ────────────────────────────────
  const lastEpSuggestion = useMemo(() => {
    if (!breadcrumb.length || !files.length) return null;
    const folderId = breadcrumb[breadcrumb.length - 1]?.id;
    if (!folderId) return null;
    const le = lastEpisode[folderId];
    if (!le) return null;
    const nextEp = le.ep + 1;
    const nextFile = files.find(f => extractEpisodeNumber(f.name) === nextEp);
    return nextFile ? { file: nextFile, ep: nextEp } : null;
  }, [lastEpisode, breadcrumb, files]);
 
  // Track last episode when a single file starts downloading
  const trackLastEpisode = useCallback((file) => {
    if (!breadcrumb.length) return;
    const folderId = breadcrumb[breadcrumb.length - 1]?.id;
    if (!folderId) return;
    const ep = extractEpisodeNumber(file.name);
    if (ep > 0) {
      setLastEpisode(prev => ({ ...prev, [folderId]: { fileId: file.id, name: file.name, ep } }));
    }
  }, [breadcrumb]);
 
  // ── Folder loading ─────────────────────────────────────────
  const loadFolder = async (rawUrl) => {
    const target = rawUrl || url;
    if (!settings.apiKey) { addToast(t('setApiKeyFirst'), 'error'); return; }
    const parsed = parseDriveLink(target);
    if (!parsed) { addToast(t('invalidLink'), 'error'); return; }
    setLoading(true); setLoadError(null); setFiles([]); setSubfolders([]);
    setBrowseState(null); setSelected(new Set()); setCustomNames({}); setRange({ start: null, end: null });
    try {
      const { subfolders: subs, files: foundFiles } = await fetchFolderContents(parsed.id, settings.apiKey);
      if (subs.length > 0 && foundFiles.length === 0) {
        setSubfolders(subs); setBreadcrumb([{ id: parsed.id, name: target }]); setBrowseState('subfolders');
      } else if (subs.length > 0 && foundFiles.length > 0) {
        addToast(t('mixedFolder'), 'warning');
        setFiles(foundFiles); setSelected(new Set(foundFiles.map(f => f.id))); setBreadcrumb([]); setBrowseState('files');
      } else if (foundFiles.length > 0) {
        setFiles(foundFiles); setSelected(new Set(foundFiles.map(f => f.id))); setBreadcrumb([]); setBrowseState('files');
        addToast(`${foundFiles.length} ${t('filesLoaded')}`, 'success');
      } else { addToast(t('noFilesTitle'), 'warning'); }
    } catch (err) { setLoadError(err.message); addToast(err.message, 'error'); }
    finally { setLoading(false); }
  };
 
  const openSubfolder = async (sub) => {
    setLoading(true); setLoadError(null);
    try {
      const { subfolders: subs, files: foundFiles } = await fetchFolderContents(sub.id, settings.apiKey);
      if (foundFiles.length > 0) {
        setFiles(foundFiles); setSelected(new Set(foundFiles.map(f => f.id)));
        setCustomNames({}); setRange({ start: null, end: null });
        setBreadcrumb(prev => [...prev, { id: sub.id, name: sub.name }]); setBrowseState('files');
        addToast(`${foundFiles.length} ${t('filesLoaded')}`, 'success');
      } else if (subs.length > 0) {
        setSubfolders(subs); setBreadcrumb(prev => [...prev, { id: sub.id, name: sub.name }]); setBrowseState('subfolders');
      } else { addToast(t('noFilesTitle'), 'warning'); }
    } catch (err) { addToast(err.message, 'error'); }
    finally { setLoading(false); }
  };
 
  const goToBreadcrumb = async (idx) => {
    const crumb = breadcrumb[idx];
    if (!crumb) return;
    setBreadcrumb(prev => prev.slice(0, idx + 1));
    setFiles([]); setSubfolders([]); setBrowseState(null); setLoading(true);
    try {
      const { subfolders: subs, files: foundFiles } = await fetchFolderContents(crumb.id, settings.apiKey);
      if (subs.length > 0 && foundFiles.length === 0) { setSubfolders(subs); setBrowseState('subfolders'); }
      else { setFiles(foundFiles); setSelected(new Set(foundFiles.map(f => f.id))); setBrowseState('files'); }
    } catch (err) { addToast(err.message, 'error'); }
    finally { setLoading(false); }
  };
 
  // ── File selection ─────────────────────────────────────────
  const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const handleRename = (id, newName) => setCustomNames(prev => ({ ...prev, [id]: newName }));
  const handleBulkRename = () => {
    const sel = files.filter(f => selected.has(f.id));
    if (!sel.length) return;
    setCustomNames(prev => applyBulkRename(bulkPattern, sel, prev));
    addToast(`${sel.length} files renamed`, 'success');
  };
 
  // ── Download engine (with pause/resume) ───────────────────
  // ── StreamSaver loader (loaded once, cached) ───────────────────
  const streamSaverRef = useRef(null);
  const streamSaverFailedRef = useRef(false);
  const getStreamSaver = useCallback(async () => {
    if (streamSaverRef.current) return streamSaverRef.current;
    // Don't retry a script tag that's already failed/hanging
    if (streamSaverFailedRef.current) throw new Error('StreamSaver previously failed');

    const loadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-streamsaver]');
      if (existing) { existing.remove(); } // clear any stuck previous attempt

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/streamsaver@2.0.6/StreamSaver.min.js';
      script.dataset.streamsaver = 'true';
      script.onload = () => {
        try {
          window.streamSaver.mitm = 'https://cdn.jsdelivr.net/npm/streamsaver@2.0.6/mitm.html';
          streamSaverRef.current = window.streamSaver;
          resolve(window.streamSaver);
        } catch (e) { reject(e); }
      };
      script.onerror = () => reject(new Error('StreamSaver failed to load'));
      document.head.appendChild(script);
    });

    // Hard timeout so a blocked/hanging script (CSP, ad-blocker, slow CDN) never
    // freezes the download at 0% forever.
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('StreamSaver load timeout')), 8000)
    );

    try {
      return await Promise.race([loadPromise, timeoutPromise]);
    } catch (e) {
      streamSaverFailedRef.current = true; // don't keep retrying a dead CDN/script every file
      throw e;
    }
  }, []);

  const downloadFile = useCallback(async (file, finalName, batchId, isZip = false, resumeFrom = null) => {
    const controller = new AbortController();
    abortControllers.current.set(`${batchId}_${file.id}`, controller);
    const startTime = Date.now();
    dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'downloading', progress: resumeFrom ? Math.round((resumeFrom.loaded / (file.size || 1)) * 100) : 3, startTime, bytesDownloaded: resumeFrom?.loaded || 0 } });
    dispatch({ type: 'LOG', payload: { id: file.id, message: `${t('startedDownloads')}: ${finalName}` } });

    if (!isZip) trackLastEpisode(file);

    // ── Thresholds ──────────────────────────────────────────
    const STREAM_THRESHOLD = 50 * 1024 * 1024;  // >50 MB → try stream-to-disk
    const LARGE_FILE = (file.size || 0) > STREAM_THRESHOLD;
    const useStream = !isZip && LARGE_FILE;
    let fileStreamWriter = null;

    // ── Helper: extract confirm token from Google's virus-warning page ──
    const extractConfirmToken = (html) => {
      const m = html.match(/[?&]confirm=([0-9A-Za-z_-]+)/);
      return m ? m[1] : null;
    };

    // ── Fetch with automatic confirm-token retry ──────────────
    // ── Race a promise against a timeout ──────────────────────
    const withTimeout = (promise, ms, label) => {
      let timer;
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`TIMEOUT_${label}`)), ms);
      });
      return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const fetchWithConfirm = async (fileId, apiKey, rangeStart = 0, attempt = 1) => {
      const headers = {};
      if (rangeStart > 0) headers['Range'] = `bytes=${rangeStart}-`;

      let url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
      if (settings.proxyUrl) url = `${settings.proxyUrl}${encodeURIComponent(url)}`;

      // Auto-retry network errors (Failed to fetch / TypeError) up to 3 times
      let response;
      try {
        response = await withTimeout(
          fetch(url, { signal: controller.signal, headers }),
          20_000, 'CONNECT'
        );
      } catch (fetchErr) {
        const isNetworkErr = fetchErr instanceof TypeError || fetchErr.message === 'Failed to fetch' || fetchErr.message?.includes('network');
        const isTimeout = fetchErr.message?.startsWith('TIMEOUT_');
        if ((isNetworkErr || isTimeout) && attempt < 4 && !controller.signal.aborted) {
          const delay = attempt * 2000; // 2s, 4s, 6s
          dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'downloading', error: `محاولة ${attempt}/3... (${fetchErr.message})` } });
          dispatch({ type: 'LOG', payload: { id: file.id, message: `↺ retry ${attempt}/3 after ${delay/1000}s — ${fetchErr.message}` } });
          await sleep(delay);
          return fetchWithConfirm(fileId, apiKey, rangeStart, attempt + 1);
        }
        // After 3 retries the SAME network error persists → this is structural, not transient.
        // Almost always: CORS block (no proxy configured) or API key restricted to wrong referrers.
        if (isNetworkErr && attempt >= 4 && !settings.proxyUrl) {
          throw new Error('CORS_LIKELY');
        }
        throw fetchErr;
      }
      const contentType = response.headers.get('content-type') || '';

      // Google returns HTML warning page for large unscanned files
      if (contentType.includes('text/html') || response.status === 403) {
        // Try the export/download endpoint which forces download
        const exportUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
        response = await withTimeout(
          fetch(exportUrl, { signal: controller.signal, headers }),
          20_000, 'EXPORT'
        );

        const ct2 = response.headers.get('content-type') || '';
        if (ct2.includes('text/html')) {
          // Still HTML — read the page and extract confirm token
          const html = await response.text();
          const token = extractConfirmToken(html);
          if (token) {
            const confirmedUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${token}`;
            response = await withTimeout(
              fetch(confirmedUrl, { signal: controller.signal, headers }),
              20_000, 'CONFIRM'
            );
            const ct3 = response.headers.get('content-type') || '';
            if (ct3.includes('text/html')) throw new Error('HTML_WARNING_PAGE');
          } else {
            throw new Error('HTML_WARNING_PAGE');
          }
        }
      }

      if (!response.ok && response.status !== 206) throw new Error(`HTTP_${response.status}`);

      // Sanity check: content-length=0 means something went wrong
      const cl = response.headers.get('content-length');
      if (cl !== null && parseInt(cl, 10) === 0) throw new Error('EMPTY_RESPONSE');

      return response;
    };

    try {
      const response = await fetchWithConfirm(file.id, settings.apiKey, resumeFrom?.loaded || 0);
      const total = parseInt(response.headers.get('content-length') || file.size || 0, 10);
      const reader = response.body.getReader();
      let loaded = resumeFrom?.loaded || 0;
      let lastDispatch = 0;
      let lastChunkTime = Date.now(); // for stall detection

      if (useStream) {
        // ── STREAM MODE: pipe directly to disk via StreamSaver ──────
        // Falls back to blob if StreamSaver unavailable
        let ss = null;
        try { ss = await getStreamSaver(); } catch {}

        if (ss) {
          const fileStream = ss.createWriteStream(finalName, { size: total || undefined });
          fileStreamWriter = fileStream.getWriter();

          const STALL_LIMIT = 30_000; // 30s without data = stall
          while (true) {
            if (controller.signal.aborted) break;
            const chunk = await withTimeout(reader.read(), STALL_LIMIT, 'STALL');
            const { done, value } = chunk;
            if (done) break;
            await fileStreamWriter.write(value);
            loaded += value.length;
            lastChunkTime = Date.now();
            const now = Date.now();
            if (now - lastDispatch > 300) {
              lastDispatch = now;
              const progress = total ? Math.min(99, Math.round((loaded / total) * 100)) : 50;
              const elapsed = (now - startTime) / 1000;
              const speed = elapsed > 1 ? loaded / elapsed : 0;
              const eta = speed > 0 && total ? Math.round((total - loaded) / speed) : 0;
              dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, progress, speed, eta, bytesDownloaded: loaded } });
            }
          }

          if (controller.signal.aborted) {
            await fileStreamWriter.abort();
            dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'paused' } });
            return null;
          }

          await fileStreamWriter.close();
          fileStreamWriter = null;
          dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'completed', progress: 100 } });
          dispatch({ type: 'LOG', payload: { id: file.id, message: `✓ ${finalName} (streamed ${formatBytes(loaded)})` } });
          dispatch({ type: 'COMPLETE_DOWNLOAD', payload: { name: finalName, size: total || loaded, status: 'completed', kind: 'file' } });
          return { size: total || loaded };
        }
        // If StreamSaver failed, fall through to blob mode below
      }

      // ── BLOB MODE: collect chunks then trigger download ──────────
      // For large files this might use more RAM, but it's the reliable fallback.
      // We use a chunked approach and revoke the URL after 2 min to free memory.
      const chunks = resumeFrom?.chunks ? [...resumeFrom.chunks] : [];

      const STALL_LIMIT = 30_000; // 30s without data = stall
      while (true) {
        if (controller.signal.aborted) break;
        const { done, value } = await withTimeout(reader.read(), STALL_LIMIT, 'STALL');
        if (done) break;
        chunks.push(value); loaded += value.length;
        lastChunkTime = Date.now();
        const now = Date.now();
        if (now - lastDispatch > 200 || loaded === total) {
          lastDispatch = now;
          const progress = total ? Math.min(99, Math.round((loaded / total) * 100)) : 50;
          const elapsed = (now - startTime) / 1000;
          const speed = elapsed > 1 ? loaded / elapsed : 0;
          const eta = speed > 0 && total ? Math.round((total - loaded) / speed) : 0;
          dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, progress, speed, eta, bytesDownloaded: loaded } });
        }
      }

      if (controller.signal.aborted) {
        pausedData.current.set(file.id, { chunks, loaded });
        dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'paused' } });
        return null;
      }

      pausedData.current.delete(file.id);
      const blob = new Blob(chunks, { type: file.type || 'application/octet-stream' });
      if (!isZip) {
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = objUrl; a.download = finalName;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objUrl), 120_000); // free after 2 min
      }
      dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'completed', progress: 100 } });
      dispatch({ type: 'LOG', payload: { id: file.id, message: `✓ ${finalName} (${formatBytes(blob.size)})` } });
      dispatch({ type: 'COMPLETE_DOWNLOAD', payload: { name: finalName, size: blob.size, status: 'completed', kind: isZip ? 'zip-part' : 'file' } });
      return blob;

    } catch (err) {
      if (fileStreamWriter) { try { await fileStreamWriter.abort(); } catch {} fileStreamWriter = null; }
      if (err.name === 'AbortError') {
        const existing = pausedData.current.get(file.id);
        if (!existing && !useStream) pausedData.current.set(file.id, { chunks: [], loaded: 0 });
        dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'paused' } });
        return null;
      }
      if (err.message === 'HTML_WARNING_PAGE') {
        dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'failed', error: t('htmlBlocked') } });
        if (!isZip) setTimeout(() => window.open(`https://drive.google.com/uc?export=download&confirm=t&id=${file.id}`, '_blank', 'noopener'), 600);
      } else if (err.message === 'CORS_LIKELY') {
        dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'failed', error: '⚠️ الطلبات تُحظر باستمرار — غالباً CORS أو قيود مفتاح API. فعّل CORS proxy في الإعدادات.' } });
        dispatch({ type: 'LOG', payload: { id: file.id, message: `✕ ${finalName}: CORS_LIKELY — same network error after 3 retries, no proxy configured` } });
      } else if (err.message?.startsWith('TIMEOUT_') || err.message?.startsWith('STALL')) {
        const label = err.message.includes('STALL') ? 'توقف التحميل (stall)' : 'انتهت مدة الاتصال (timeout)';
        dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'failed', error: label } });
        dispatch({ type: 'LOG', payload: { id: file.id, message: `✕ ${finalName}: ${label} — ${formatBytes(loaded)} تم استلامها` } });
      } else if (err.message === 'EMPTY_RESPONSE') {
        dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'failed', error: 'استجابة فارغة من Google Drive' } });
        dispatch({ type: 'LOG', payload: { id: file.id, message: `✕ ${finalName}: EMPTY_RESPONSE` } });
      } else {
        // Friendly message for "Failed to fetch" (network/CORS)
        const isNetErr = err instanceof TypeError || err.message === 'Failed to fetch' || err.message?.includes('network');
        const userMsg = isNetErr
          ? 'خطأ شبكة — تأكد من اتصال الإنترنت أو فعّل CORS proxy في الإعدادات'
          : (err.message || t('downloadFailed'));
        dispatch({ type: 'UPDATE', payload: { id: file.id, batchId, status: 'failed', error: userMsg } });
        dispatch({ type: 'LOG', payload: { id: file.id, message: `✕ ${finalName}: ${err.message}` } });
      }
      dispatch({ type: 'COMPLETE_DOWNLOAD', payload: { name: finalName, size: 0, status: 'failed', kind: isZip ? 'zip-part' : 'file' } });
      return null;
    } finally { abortControllers.current.delete(`${batchId}_${file.id}`); }
  }, [settings.apiKey, settings.proxyUrl, settings.notifications, dispatch, t, trackLastEpisode, getStreamSaver]);
 
  const processQueue = useCallback(async () => {
    const toDownload = files.filter(f => selected.has(f.id));
    if (!toDownload.length) return;
    const batchId = ++batchIdRef.current;
    const tasks = toDownload.map(f => ({ ...f, batchId, status: 'queued', progress: 0, customName: customNames[f.id] || f.name, isHidden: false }));
    dispatch({ type: 'ADD', payload: tasks });
    addToast(`${t('startedDownloads')} ${tasks.length} (${MAX_CONCURRENT} ${t('concurrentNote')})`, 'warning');

    // Track batch results
    const results = { completed: 0, failed: 0, bytes: 0, failedTasks: [] };
    const queue = [...tasks];
    const worker = async () => {
      while (queue.length) {
        const task = queue.shift();
        const blob = await downloadFile(task, task.customName || task.name, batchId, false);
        if (blob) { results.completed++; results.bytes += (blob.size ?? blob?.size ?? 0); }
        else { results.failed++; results.failedTasks.push(task); }
      }
    };
    await Promise.all(Array.from({ length: Math.min(MAX_CONCURRENT, queue.length) }, worker));

    // Batch summary toast
    const allOk = results.failed === 0;
    const summaryMsg = allOk
      ? `${t('batchAllDone')} ${results.completed} ملف · ${formatBytes(results.bytes)}`
      : `${t('batchSomeFailed')}: ${results.completed} ✓ · ${results.failed} ✗ · ${formatBytes(results.bytes)}`;
    addToast(summaryMsg, allOk ? 'success' : 'warning', 0); // 0 = no auto-dismiss

    // Browser notification
    if (settings.notifications) {
      notify(
        t('notifTitle'),
        allOk
          ? `${t('batchAllDone')} ${results.completed} ${t('notifDownloadDone')} · ${formatBytes(results.bytes)}`
          : `${results.completed} ${t('completed')} · ${results.failed} ${t('failed')}`,
        'serfry-batch'
      );
    }

    // If some failed, auto-retry them after 2s
    if (results.failedTasks.length > 0 && results.failedTasks.length <= 3) {
      setTimeout(async () => {
        results.failedTasks.forEach(task => {
          dispatch({ type: 'UPDATE', payload: { id: task.id, batchId: task.batchId, status: 'queued', progress: 0, error: undefined } });
          pausedData.current.delete(task.id); // clear any stale partial data before retry
        });
        const retryQueue = [...results.failedTasks];
        const retryWorker = async () => {
          while (retryQueue.length) {
            const task = retryQueue.shift();
            await downloadFile(task, task.customName || task.name, task.batchId, false);
          }
        };
        addToast(`${t('batchRetryFailed')}: ${results.failedTasks.length}`, 'warning');
        await Promise.all(Array.from({ length: Math.min(MAX_CONCURRENT, retryQueue.length) }, retryWorker));
      }, 2000);
    }
  }, [files, selected, customNames, downloadFile, addToast, dispatch, MAX_CONCURRENT, t, settings.notifications]);
 
  const handleZipDownload = useCallback(async () => {
    const toDownload = files.filter(f => selected.has(f.id));
    if (!toDownload.length) return;
    const totalSize = toDownload.reduce((acc, f) => acc + (f.size || 0), 0);
    if (totalSize > 2 * 1024 * 1024 * 1024 && !window.confirm(t('zipWarning'))) return;
    const batchId = ++batchIdRef.current;
    dispatch({ type: 'ADD', payload: toDownload.map(f => ({ ...f, batchId, status: 'queued', progress: 0, customName: customNames[f.id] || f.name, isHidden: false })) });
    setZipProgress({ phase: 'fetching', percent: 0, done: 0, total: toDownload.length });
    const zip = new JSZip(); const folder = zip.folder('SerfryDownloads');
    const queue = [...toDownload]; let completedCount = 0;
    const worker = async () => {
      while (queue.length) {
        const file = queue.shift(); const finalName = customNames[file.id] || file.name;
        const blob = await downloadFile(file, finalName, batchId, true);
        if (blob) folder.file(finalName, blob);
        completedCount++;
        setZipProgress({ phase: 'fetching', percent: Math.round((completedCount / toDownload.length) * 100), done: completedCount, total: toDownload.length });
      }
    };
    await Promise.all(Array.from({ length: Math.min(MAX_CONCURRENT, queue.length) }, worker));
    setZipProgress({ phase: 'zipping', percent: 0 });
    try {
      const content = await zip.generateAsync({ type: 'blob', streamFiles: true, compression: 'DEFLATE', compressionOptions: { level: 1 } }, (meta) => setZipProgress({ phase: 'zipping', percent: Math.round(meta.percent) }));
      FileSaver.saveAs(content, 'Serfry_Banana_Archive.zip');
      addToast(t('zipDone'), 'success');
      dispatch({ type: 'COMPLETE_DOWNLOAD', payload: { name: 'Serfry_Banana_Archive.zip', size: content.size, status: 'completed', kind: 'zip' } });
      if (settings.notifications) notify(t('notifTitle'), `${t('notifZipDone')} · ${formatBytes(content.size)}`, 'serfry-zip');
    } catch { addToast(t('zipFailed'), 'error'); }
    finally { setZipProgress(null); }
  }, [files, selected, customNames, downloadFile, addToast, dispatch, t, MAX_CONCURRENT, settings.notifications]);
 
  const handleCancel = useCallback((task) => {
    const ctrl = abortControllers.current.get(`${task.batchId}_${task.id}`);
    if (ctrl) ctrl.abort();
    else dispatch({ type: 'UPDATE', payload: { id: task.id, batchId: task.batchId, status: 'cancelled' } });
  }, [dispatch]);
 
  const handlePause = useCallback((task) => {
    const ctrl = abortControllers.current.get(`${task.batchId}_${task.id}`);
    if (ctrl) ctrl.abort(); // abort triggers paused state via AbortError handler
  }, []);
 
  const handleResume = useCallback((task) => {
    const partial = pausedData.current.get(task.id);
    downloadFile(task, task.customName || task.name, task.batchId, false, partial || null);
  }, [downloadFile]);
 
  const toggleHide = useCallback((task) => { dispatch({ type: 'UPDATE', payload: { id: task.id, batchId: task.batchId, isHidden: true } }); }, [dispatch]);
 
  const handleRetry = (task) => {
    pausedData.current.delete(task.id);
    dispatch({ type: 'UPDATE', payload: { id: task.id, batchId: task.batchId, status: 'queued', progress: 0, error: undefined } });
    downloadFile(task, task.customName || task.name, task.batchId, false);
  };
 
  const totalSelectedSize = useMemo(() => Array.from(selected).reduce((acc, id) => { const f = files.find(x => x.id === id); return acc + (f ? f.size : 0); }, 0), [selected, files]);
  const previewSamples = useMemo(() => generatePreview(bulkPattern), [bulkPattern]);
  const visibleTasks = state.tasks.filter(t => !t.isHidden);
  const activeCount = visibleTasks.filter(t => t.status === 'downloading' || t.status === 'queued').length;
  const completedCount = visibleTasks.filter(t => t.status === 'completed').length;
  const failedCount = visibleTasks.filter(t => t.status === 'failed' || t.status === 'cancelled').length;
  const currentAnime = breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].name : null;
 
  const netBadgeClass = networkSpeed === 'fast' ? 'fast' : networkSpeed === 'medium' ? 'medium' : 'slow';
  const netLabel = networkSpeed === 'fast' ? t('networkFast') : networkSpeed === 'medium' ? t('networkMedium') : t('networkSlow');
 
  return (
    <div className="animate-fade" style={{ padding: '0 14px 14px', maxWidth: '1280px', margin: '0 auto' }}>
      {previewFile && <PreviewModal file={previewFile} apiKey={settings.apiKey} onClose={() => setPreviewFile(null)} t={t} />}

      {/* ── Dashboard ── */}
      <DashboardPanel onNavigate={onNavigate} />

      {/* ── Favorites panel ── */}
      {favorites.length > 0 && (
        <div style={{ padding: '20px 14px 0' }}>
          <div className="dash-section-title">⭐ {t('favorites')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', marginBottom: '8px' }}>
            {favorites.map(fav => (
              <button key={fav.id} className="fav-card" onClick={() => loadFavorite(fav)}>
                <span className="fav-card-name">🍌 {fav.name}</span>
                <span className="fav-card-url">{fav.url}</span>
                <button className="fav-delete" onClick={(e) => deleteFavorite(fav.id, e)} title="Remove"><X size={14} /></button>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Hero + URL input ── */}
      <div style={{ padding: (favorites.length > 0 || state.history.length > 0) ? '20px 14px 0' : '40px 14px 0' }}>
        {favorites.length === 0 && state.history.length === 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div className="hero-badge">🍌 {t('appName')}</div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.5px', lineHeight: 1.25 }}>{t('heroTitle')}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.7 }}>{t('heroSub')}</p>
          </div>
        )}
        <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input type="text" placeholder={t('inputPlaceholder')} value={url} onChange={e => setUrl(e.target.value)}
              style={{ flex: 1, minWidth: '220px', fontSize: '1rem', padding: '14px 18px' }} onKeyDown={(e) => e.key === 'Enter' && loadFolder()} />
            <button onClick={() => loadFolder()} disabled={loading || !url || !settings.apiKey} className="btn-primary" style={{ padding: '14px 28px', minWidth: '130px', fontSize: '0.95rem' }}>
              {loading ? <Loader2 size={16} className="spin-icon" /> : <Search size={16} />}
              {loading ? t('loadingFiles') : t('loadFiles')}
            </button>
          </div>
 
          {/* Network indicator */}
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className={`net-badge ${netBadgeClass}`}>
              <Wifi size={13} />{t('networkSpeed')}: {netLabel} · {MAX_CONCURRENT}x
            </span>
            {url && !loading && (
              <>
                {showFavInput ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
                    <input type="text" placeholder={t('favNamePlaceholder')} value={favName} onChange={e => setFavName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveFavorite(); if (e.key === 'Escape') setShowFavInput(false); }}
                      style={{ flex: 1, minWidth: '160px', padding: '8px 12px' }} autoFocus />
                    <button onClick={saveFavorite} className="btn-primary btn-sm"><Check size={14} />{t('addFavorite')}</button>
                    <button onClick={() => setShowFavInput(false)} className="btn-ghost btn-icon"><X size={14} /></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => setShowFavInput(true)} className="btn-ghost btn-sm">⭐ {t('addFavorite')}</button>
                    <button onClick={handleShareFolder} className="btn-ghost btn-sm" title={t('shareFolderTip')}>
                      <Share2 size={14} />{t('shareFolder')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
 
          {!settings.apiKey && (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'var(--peel-glow)', borderRadius: 'var(--radius)', fontSize: '0.88rem' }}>
              <Key size={15} color="var(--peel)" />
              <span style={{ flex: 1 }}>{t('setApiKeyFirst')}</span>
              <button onClick={() => onNavigate('settings')} className="btn-ghost btn-sm">{t('needApiKeyBtn')}</button>
            </div>
          )}
          {loadError && (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'rgba(255,107,94,0.1)', borderRadius: 'var(--radius)', fontSize: '0.88rem', color: 'var(--danger)' }}>
              <AlertTriangle size={15} /><span>{loadError}</span>
            </div>
          )}
        </div>
      </div>
 
      {/* ── Empty state ── */}
      {!browseState && !loading && (
        <div className="glass-card" style={{ margin: '0 0 16px' }}>
          <EmptyState icon={<Inbox size={26} />} title={t('noFilesLoadedTitle')} body={t('noFilesLoadedBody')} />
        </div>
      )}
 
      {/* ── Subfolder browser ── */}
      {(browseState === 'subfolders' || (loading && subfolders.length === 0 && files.length === 0)) && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
          {breadcrumb.length > 1 && (
            <nav className="breadcrumb">
              {breadcrumb.map((crumb, idx) => (
                <React.Fragment key={crumb.id}>
                  {idx > 0 && <span className="breadcrumb-sep">/</span>}
                  <button className="breadcrumb-btn" onClick={() => goToBreadcrumb(idx)} style={{ color: idx === breadcrumb.length - 1 ? 'var(--text)' : undefined }}>
                    {idx === 0 ? '🏠' : crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </nav>
          )}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>{t('subfolders')}</h3>
          {loading ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
              <Loader2 size={18} className="spin-icon" />{t('subfoldersLoading')}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
              {subfolders.map(sub => (
                <button key={sub.id} className="anime-card" onClick={() => openSubfolder(sub)}>
                  <div className="anime-card-icon">📁</div>
                  <span className="anime-card-name">{sub.name}</span>
                  <span className="anime-card-count">›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
 
      {/* ── File browser ── */}
      {browseState === 'files' && (files.length > 0 || loading) && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
          {breadcrumb.length > 0 && (
            <nav className="breadcrumb">
              <button className="breadcrumb-btn" onClick={() => { setBrowseState('subfolders'); setFiles([]); setBreadcrumb(prev => prev.slice(0, -1)); }}>
                ← {t('subfoldersBack')}
              </button>
              {currentAnime && (<><span className="breadcrumb-sep">/</span><span style={{ color: 'var(--text)', fontWeight: 600 }}>{t('episodesIn')} {currentAnime}</span></>)}
            </nav>
          )}
 
          {/* Last episode suggestion */}
          {lastEpSuggestion && (
            <div className="last-ep-banner" style={{ marginBottom: '14px' }}>
              <Play size={16} color="var(--leaf)" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '0.88rem' }}>
                {t('lastEpisode')} {lastEpSuggestion.ep}: <strong>{lastEpSuggestion.file.name}</strong>
              </span>
              <button onClick={() => {
                const f = lastEpSuggestion.file;
                const batchId = ++batchIdRef.current;
                dispatch({ type: 'ADD', payload: [{ ...f, batchId, status: 'queued', progress: 0, customName: f.name, isHidden: false }] });
                downloadFile(f, f.name, batchId, false);
              }} className="btn-ghost btn-sm" style={{ borderColor: 'var(--leaf)', color: 'var(--leaf)', flexShrink: 0 }}>
                <Download size={13} />{t('continueFrom')} {lastEpSuggestion.ep}
              </button>
            </div>
          )}
 
          {/* Bulk rename */}
          <div className="bulk-panel">
            <span style={{ fontWeight: 600, color: 'var(--peel)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}><Tag size={15} />{t('bulkRename')}</span>
            <input type="text" value={bulkPattern} onChange={e => setBulkPattern(e.target.value)} placeholder={t('bulkPlaceholder')} />
            <button onClick={handleBulkRename} className="btn-ghost btn-sm" disabled={selected.size === 0}>{t('applyBulk')}</button>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {previewSamples.map((p, i) => <span key={i} className="preview-chip">{p}</span>)}
            </div>
          </div>
 
          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => selected.size === files.length ? setSelected(new Set()) : setSelected(new Set(files.map(f => f.id)))} className="btn-ghost btn-sm">
                {selected.size === files.length ? t('deselectAll') : t('selectAll')}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Sliders size={14} />
                <span>{t('rangeLabel')}</span>
                <input type="number" min="1" max={files.length} placeholder={t('rangeStart')} value={range.start || ''} onChange={e => setRange(p => ({ ...p, start: parseInt(e.target.value) || null }))} style={{ width: '60px', padding: '6px 8px' }} />
                <span>{t('to')}</span>
                <input type="number" min="1" max={files.length} placeholder={t('rangeEnd')} value={range.end || ''} onChange={e => setRange(p => ({ ...p, end: parseInt(e.target.value) || null }))} style={{ width: '60px', padding: '6px 8px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', minWidth: '180px' }}>
                <Search size={14} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                <input placeholder={t('searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} style={{ [isRTL ? 'paddingRight' : 'paddingLeft']: '34px', padding: '9px 12px' }} />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '9px 12px', width: 'auto' }}>
                <option value="name">{t('sortBy')}: {t('name')}</option>
                <option value="size">{t('sortBy')}: {t('size')}</option>
                <option value="date">{t('sortBy')}: {t('date')}</option>
              </select>
            </div>
          </div>
 
          <FileList files={files} onSelect={toggleSelect} selected={selected} search={search} sort={sort} range={range} customNames={customNames} onRename={handleRename} t={t} loading={loading} onPreview={setPreviewFile} />
 
          {zipProgress && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', marginTop: '14px', borderRadius: 'var(--radius)', background: 'var(--input-bg)', border: '1px solid var(--border)' }}>
              <Loader2 size={15} className="spin-icon" color="var(--peel)" />
              <div style={{ minWidth: '160px', fontSize: '0.86rem', fontWeight: 600 }}>
                {zipProgress.phase === 'fetching' ? `${t('zipPreparing')} (${zipProgress.done}/${zipProgress.total})` : t('zipCompressing')}
              </div>
              <ProgressBar progress={zipProgress.percent} status="downloading" />
              <div className="mono" style={{ fontSize: '0.8rem', minWidth: '40px', textAlign: 'right', color: 'var(--text-muted)' }}>{zipProgress.percent}%</div>
            </div>
          )}
 
          {files.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{selected.size} {t('filesSelected')}</div>
                <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('totalSize')}: {formatBytes(totalSelectedSize)}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={processQueue} disabled={!!zipProgress || selected.size === 0} className="btn-primary" style={{ padding: '12px 24px' }}>
                  <Download size={15} />{t('downloadSelected')} ({selected.size})
                </button>
                <button onClick={handleZipDownload} disabled={!!zipProgress || selected.size === 0} className="btn-ghost" style={{ padding: '12px 24px' }}>
                  <Package size={15} />{t('downloadZip')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
 
      {/* ── Download queue ── */}
      {visibleTasks.length > 0 && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('queuePanel')}</h3>
            <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })} className="btn-ghost btn-sm"><Trash2 size={14} />{t('clearCompleted')}</button>
          </div>
          <div style={{ marginBottom: '14px' }}><PeelMeter completed={completedCount} failed={failedCount} total={visibleTasks.length} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '18px' }}>
            <div className="stat-pill"><Loader2 size={15} color="var(--peel)" className="spin-icon" /><div><div className="stat-pill-value">{activeCount}</div><div className="stat-pill-label">{t('active')}</div></div></div>
            <div className="stat-pill"><CheckCircle2 size={15} color="var(--success)" /><div><div className="stat-pill-value">{completedCount}</div><div className="stat-pill-label">{t('completed')}</div></div></div>
            <div className="stat-pill"><XCircle size={15} color="var(--danger)" /><div><div className="stat-pill-value">{failedCount}</div><div className="stat-pill-label">{t('failed')}</div></div></div>
          </div>
          <div className="scrollbar" style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {visibleTasks.map(task => (
              <div key={`${task.batchId}_${task.id}`} className={`task-card ${task.status}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.customName || task.name}</div>
                    <div className="mono" style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {task.status === 'completed' ? '✓' :
                       task.status === 'paused' ? `⏸ ${t('paused')} · ${formatBytes(task.bytesDownloaded || 0)}` :
                       task.status === 'cancelled' ? t('cancelled') :
                       task.status === 'failed' ? (task.error || t('downloadFailed')) :
                       `${task.progress || 0}% · ${t('speed')}: ${formatBytes(task.speed || 0)}/s · ${t('eta')}: ${formatTime(task.eta)}`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <StatusBadge status={task.status} t={t} />
                    {task.status === 'downloading' && (
                      <button onClick={() => handlePause(task)} className="btn-ghost btn-icon" title={t('pause')}><Pause size={13} /></button>
                    )}
                    {task.status === 'paused' && (
                      <button onClick={() => handleResume(task)} className="btn-ghost btn-icon" title={t('resume')} style={{ color: 'var(--success)', borderColor: 'var(--success)' }}><Play size={13} /></button>
                    )}
                    {task.status === 'failed' && (
                      <button onClick={() => handleRetry(task)} className="btn-ghost btn-icon" title={t('retry')}><RotateCcw size={13} /></button>
                    )}
                    {task.status === 'downloading' && (
                      <button onClick={() => handleCancel(task)} className="btn-ghost btn-icon" title={t('cancel')}><X size={13} /></button>
                    )}
                    <button onClick={() => toggleHide(task)} className="btn-ghost btn-icon" title={t('hide')}><EyeOff size={13} /></button>
                  </div>
                </div>
                <ProgressBar progress={task.progress || 0} status={task.status} />
              </div>
            ))}
          </div>
          {state.logs.length > 0 && (
            <div className="log-panel scrollbar">
              <div style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--peel)', fontSize: '0.78rem' }}>{t('log')}</div>
              {state.logs.slice(-20).reverse().map((log, i) => (
                <div key={i} className="log-entry"><span className="log-time">{log.time}</span><span>{log.message}</span></div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
 
// ==========================================
// 11. STATS PAGE
// ==========================================
const StatsPage = () => {
  const { t, isRTL } = useContext(LanguageContext);
  const { state } = useContext(DownloadContext);
 
  const totalFiles = state.history.filter(h => h.status === 'completed').length;
  const totalFailed = state.history.filter(h => h.status === 'failed').length;
  const totalBytes = state.history.filter(h => h.status === 'completed').reduce((acc, h) => acc + (h.size || 0), 0);
  const successRate = (totalFiles + totalFailed) > 0 ? Math.round((totalFiles / (totalFiles + totalFailed)) * 100) : 0;
 
  const days = useMemo(() => {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const stat = state.dailyStats[key] || { completed: 0, failed: 0, bytes: 0 };
      arr.push({ key, label: d.toLocaleDateString(isRTL ? 'ar' : 'en', { weekday: 'short' }), ...stat });
    }
    return arr;
  }, [state.dailyStats, isRTL]);
 
  const maxCompleted = Math.max(...days.map(d => d.completed), 1);
  const totalToday = days[days.length - 1];
 
  return (
    <div className="animate-fade" style={{ padding: '0 14px 14px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ padding: '32px 28px 12px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>{t('statsTitle')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{t('statsSub')}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div className="stat-card"><div className="stat-card-value">{totalFiles}</div><div className="stat-card-label"><Download size={14} />{t('totalFiles')}</div></div>
        <div className="stat-card"><div className="stat-card-value">{formatBytes(totalBytes)}</div><div className="stat-card-label"><HardDrive size={14} />{t('totalSizeStat')}</div></div>
        <div className="stat-card"><div className="stat-card-value" style={{ color: successRate >= 80 ? 'var(--success)' : successRate >= 50 ? 'var(--peel)' : 'var(--danger)' }}>{successRate}%</div><div className="stat-card-label"><TrendingUp size={14} />{t('successRate')}</div></div>
        <div className="stat-card"><div className="stat-card-value">{totalToday.completed}</div><div className="stat-card-label"><Clock size={14} />{t('last7days')} · {t('filesPerDay')}</div></div>
      </div>
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>{t('last7days')}</h3>
        <div className="sparkline-wrap">
          {days.map((d) => (
            <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div className={`sparkline-bar ${d.completed > 0 ? 'has-value' : ''}`} style={{ width: '100%', height: `${(d.completed / maxCompleted) * 52 + 2}px` }} title={`${d.completed} ${t('filesPerDay')} · ${formatBytes(d.bytes)}`} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
      {totalFiles === 0 && totalFailed === 0 && (
        <div className="glass-card" style={{ marginTop: '20px' }}>
          <EmptyState icon={<BarChart3 size={26} />} title={t('noHistoryTitle')} body={t('noHistoryBody')} />
        </div>
      )}
    </div>
  );
};
 
// ==========================================
// 12. HISTORY PAGE
// ==========================================
const HistoryPage = () => {
  const { t } = useContext(LanguageContext);
  const { addToast } = useContext(ToastContext);
  const { state, dispatch } = useContext(DownloadContext);
 
  const clear = () => {
    if (window.confirm(t('confirmClear'))) { dispatch({ type: 'CLEAR_HISTORY' }); addToast(t('clearHistory'), 'success'); }
  };
 
  return (
    <div className="animate-fade" style={{ padding: '0 14px 14px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 28px 16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('history')}</h2>
        {state.history.length > 0 && <button onClick={clear} className="btn-danger btn-sm"><Trash2 size={14} />{t('clearHistory')}</button>}
      </div>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {state.history.length === 0 ? (
          <EmptyState icon={<Inbox size={26} />} title={t('noHistoryTitle')} body={t('noHistoryBody')} />
        ) : (
          <div className="scrollbar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--surface-solid)', zIndex: 1 }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('fileName')}</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('sizeCol')}</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('dateCol')}</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('statusCol')}</th>
                </tr>
              </thead>
              <tbody>
                {state.history.map((h) => (
                  <tr key={h.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 500, fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{h.kind === 'zip' ? '🗜️' : KIND_ICONS[getFileKind('')]}</span>{h.name}
                      </div>
                    </td>
                    <td className="mono" style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatBytes(h.size)}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(h.date).toLocaleString()}</td>
                    <td style={{ padding: '14px 20px' }}><StatusBadge status={h.status} t={t} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
 
// ==========================================
// 13. SETTINGS PAGE
// ==========================================
const Toggle = ({ on, onChange }) => (
  <button type="button" className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} role="switch" aria-checked={on} style={{ padding: 0 }}>
    <span className="toggle-knob" />
  </button>
);
 
const SettingsPage = () => {
  const { t, lang, setLang } = useContext(LanguageContext);
  const { settings, updateSetting, resetSettings } = useContext(SettingsContext);
  const { addToast } = useContext(ToastContext);
  const [notifPermission, setNotifPermission] = useState(() => getNotifPermission());
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySet, setApiKeySet] = useState(() => !!safeLSGetRaw('sb_apikey_enc'));
  const [showKey, setShowKey] = useState(false);
 
  const requestNotifPermission = async () => {
    if (!hasNotificationAPI()) return;
    try {
      const result = await Notification.requestPermission();
      setNotifPermission(result);
      if (result === 'granted') updateSetting('notifications', true);
    } catch {}
  };
 
  const handleNotifToggle = (val) => {
    if (val && notifPermission !== 'granted') { requestNotifPermission(); return; }
    updateSetting('notifications', val);
  };
 
  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    await updateSetting('apiKey', apiKeyInput.trim());
    setApiKeyInput('');
    setApiKeySet(true);
    addToast(t('apiKeyEncrypted'), 'success');
  };
 
  const handleClearApiKey = async () => {
    await updateSetting('apiKey', '');
    setApiKeySet(false);
    addToast('API key cleared', 'success');
  };
 
  const SettingCard = ({ title, icon, children, note }) => (
    <div className="setting-card">
      <div className="setting-head">
        <div className="setting-icon">{icon}</div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h4>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{children}</div>
      {note && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '10px', lineHeight: 1.6 }}>{note}</p>}
    </div>
  );
 
  return (
    <div className="animate-fade" style={{ padding: '0 14px 14px', maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ padding: '32px 28px 16px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('settingsTitle')}</h2>
      </div>
 
      {/* API Key — encrypted */}
      <SettingCard title={t('apiKey')} icon={<Key size={17} />} note={t('apiKeyNote')}>
        {apiKeySet ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 'var(--radius)' }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--success)' }}>{t('apiKeyEncrypted')}</span>
            <button onClick={handleClearApiKey} className="btn-danger btn-sm"><Trash2 size={13} /></button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type={showKey ? 'text' : 'password'} placeholder={t('apiKeyPlaceholder')} value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveApiKey()}
                className="mono" style={{ paddingRight: '42px' }} />
              <button onClick={() => setShowKey(v => !v)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', width: 'auto' }}>
                <Eye size={15} />
              </button>
            </div>
            <button onClick={handleSaveApiKey} disabled={!apiKeyInput.trim()} className="btn-primary" style={{ padding: '13px 18px' }}>
              <Check size={15} />
            </button>
          </div>
        )}
      </SettingCard>
 
      <SettingCard title={t('proxyUrl')} icon={<Wifi size={17} />} note={t('proxyNote')}>
        <input type="text" placeholder={t('proxyPlaceholder')} value={settings.proxyUrl} onChange={e => updateSetting('proxyUrl', e.target.value)} className="mono" />
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => updateSetting('proxyUrl', 'https://corsproxy.io/?url=')} className="btn-ghost btn-sm" type="button">corsproxy.io</button>
          <button onClick={() => updateSetting('proxyUrl', 'https://api.allorigins.win/raw?url=')} className="btn-ghost btn-sm" type="button">allorigins.win</button>
          {settings.proxyUrl && <button onClick={() => updateSetting('proxyUrl', '')} className="btn-ghost btn-sm" type="button">{t('accentReset') || 'مسح'}</button>}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '8px' }}>
          لو التحميلات تفشل باستمرار بنفس الخطأ "Failed to fetch"، فعّل أحد البروكسيات أعلاه.
        </p>
      </SettingCard>
 
      <SettingCard title={t('notifications')} icon={settings.notifications ? <Bell size={17} /> : <BellOff size={17} />} note={t('notificationsNote')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem' }}>
            {notifPermission === 'granted' ? t('notifGranted') : notifPermission === 'denied' ? t('notifDenied') : t('notifEnable')}
          </span>
          {notifPermission !== 'denied' && <Toggle on={settings.notifications && notifPermission === 'granted'} onChange={handleNotifToggle} />}
        </div>
      </SettingCard>
 
      <SettingCard title={t('language')} icon={<Globe size={17} />}>
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </SettingCard>
 
      <SettingCard title={t('appearance')} icon={settings.theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />} note={t('themeNote')}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => updateSetting('theme', 'dark')} className={settings.theme === 'dark' ? 'btn-primary' : 'btn-ghost'} style={{ flex: 1 }}><Moon size={15} />{t('dark')}</button>
          <button onClick={() => updateSetting('theme', 'light')} className={settings.theme === 'light' ? 'btn-primary' : 'btn-ghost'} style={{ flex: 1 }}><Sun size={15} />{t('light')}</button>
        </div>
      </SettingCard>

      <SettingCard title={t('accentColor')} icon={<div style={{ width: 17, height: 17, borderRadius: 4, background: settings.accentColor || '#FFC700', border: '2px solid var(--border-strong)' }} />} note={t('accentColorNote')}>
        {/* Preset swatches */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { color: '#FFC700', name: '🍌 Banana' },
            { color: '#FF7A45', name: '🔥 Ripe' },
            { color: '#5EEAD4', name: '🌿 Leaf' },
            { color: '#818CF8', name: '💜 Indigo' },
            { color: '#F472B6', name: '🌸 Pink' },
            { color: '#34D399', name: '💚 Mint' },
            { color: '#60A5FA', name: '🔵 Sky' },
            { color: '#FB923C', name: '🟠 Amber' },
          ].map(({ color, name }) => (
            <button
              key={color}
              onClick={() => updateSetting('accentColor', color)}
              title={name}
              style={{
                width: 32, height: 32, borderRadius: 8, background: color, border: 'none', padding: 0, cursor: 'pointer', width: 'auto', padding: '0',
                outline: settings.accentColor === color ? `3px solid ${color}` : '2px solid transparent',
                outlineOffset: 2, width: 32, height: 32, flexShrink: 0,
                transform: settings.accentColor === color ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.15s ease, outline 0.15s ease',
                boxShadow: settings.accentColor === color ? `0 0 10px ${color}88` : 'none',
              }}
            />
          ))}
          {/* Free color picker */}
          <label style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }} title="Custom color">
            <div style={{ width: 32, height: 32, borderRadius: 8, border: '2px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', background: 'var(--input-bg)', transition: 'border-color 0.15s' }}>🎨</div>
            <input type="color" value={settings.accentColor || '#FFC700'} onChange={e => updateSetting('accentColor', e.target.value)}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', padding: 0, border: 'none' }} />
          </label>
        </div>
        {/* Current color display + reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, padding: '8px 12px', background: 'var(--input-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: settings.accentColor || '#FFC700', flexShrink: 0 }} />
            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{settings.accentColor || '#FFC700'}</span>
          </div>
          <button onClick={() => updateSetting('accentColor', '#FFC700')} className="btn-ghost btn-sm" style={{ flexShrink: 0 }}>
            <RotateCcw size={13} />{t('accentReset')}
          </button>
        </div>
      </SettingCard>
 
      <SettingCard title={t('maxConcurrent')} icon={<Sliders size={17} />} note={t('maxConcurrentNote')}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => updateSetting('maxConcurrent', n)} className={settings.maxConcurrent === n ? 'btn-primary' : 'btn-ghost'} style={{ flex: 1, padding: '10px' }}>{n}</button>
          ))}
        </div>
      </SettingCard>
 
      <SettingCard title={t('about')} icon={<Info size={17} />}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('poweredBy')} · {t('version')}</p>
        <button onClick={() => { resetSettings(); setApiKeySet(false); addToast(t('resetDone'), 'success'); }} className="btn-ghost btn-sm" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
          <RotateCcw size={14} />{t('resetSettings')}
        </button>
      </SettingCard>
    </div>
  );
};
 
// ==========================================
// 14. ERROR BOUNDARY
// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, errorMsg: '' }; }
  static getDerivedStateFromError(error) { return { hasError: true, errorMsg: error?.message || String(error) }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary caught:', error, errorInfo); }

  handleClearAndReload = () => {
    // Clear all our keys (storage may be partially blocked — guard every call)
    const keys = ['sb_settings', 'sb_apikey_enc', 'sb_queue', 'sb_favorites', 'sb_lastepisode', 'sb_lang'];
    keys.forEach(k => { try { localStorage.removeItem(k); } catch {} });
    try { window.location.reload(); } catch {}
  };

  render() {
    if (this.state.hasError) {
      const isStorageError = /storage|quota|localstorage|securityerror/i.test(this.state.errorMsg || '');
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#0C0B09', color: '#EDE9E1', fontFamily: 'sans-serif' }}>
          <div style={{ textAlign: 'center', maxWidth: '380px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍌</div>
            <h3 style={{ marginBottom: '8px', fontWeight: 700 }}>حدث خطأ غير متوقع</h3>
            <p style={{ color: '#9B9589', fontSize: '0.9rem', marginBottom: '8px' }}>
              {isStorageError
                ? 'يبدو أن متصفحك يحظر التخزين المحلي (مثل وضع التصفح الخاص أو إعدادات الخصوصية القوية في Brave/Safari).'
                : 'جرب إعادة تحميل الصفحة. لو استمرت المشكلة، امسح بيانات الموقع المحفوظة.'}
            </p>
            {this.state.errorMsg && (
              <p style={{ color: '#5C5850', fontSize: '0.72rem', marginBottom: '16px', fontFamily: 'monospace', wordBreak: 'break-word', background: 'rgba(255,255,255,0.04)', padding: '8px 10px', borderRadius: '8px' }}>
                {this.state.errorMsg}
              </p>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => window.location.reload()} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#EDE9E1', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>إعادة تحميل</button>
              <button onClick={this.handleClearAndReload} style={{ background: '#FFC700', border: 'none', color: '#1A1500', fontWeight: 700, padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>مسح البيانات وإعادة التحميل</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
 
// ==========================================
// 15. MAIN APP
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <SettingsProvider>
          <ToastProvider>
            <DownloadProvider>
              <AppContent activeTab={activeTab} setActiveTab={setActiveTab} />
            </DownloadProvider>
          </ToastProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
 
function AppContent({ activeTab, setActiveTab }) {
  const { isRTL } = useContext(LanguageContext);
  return (
    <div className={isRTL ? 'rtl' : 'ltr'} dir={isRTL ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <GlobalStyles />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'home' && <HomePage onNavigate={setActiveTab} />}
        {activeTab === 'stats' && <StatsPage />}
        {activeTab === 'history' && <HistoryPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}