import React, { useState, useReducer, useContext, createContext, useEffect, useRef, useCallback, useMemo } from 'react';

// ==========================================
// 1. GLOBAL STYLES & THEME INJECTION
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700;800&display=swap');
    
    :root {
      --bg: #0a0a0f;
      --surface: rgba(22, 22, 30, 0.6);
      --surface-solid: #16161A;
      --surface-hover: rgba(30, 30, 40, 0.8);
      --primary: #FFD600;
      --primary-glow: rgba(255, 214, 0, 0.4);
      --secondary: #00E5CC;
      --secondary-glow: rgba(0, 229, 204, 0.4);
      --accent: #7C3AED;
      --text: #FFFFFF;
      --text-muted: #9CA3AF;
      --danger: #FF4D4D;
      --success: #10B981;
      --warning: #F59E0B;
      --font-display: 'Inter', sans-serif;
      --font-mono: 'IBM Plex Mono', monospace;
      --font-arabic: 'Cairo', sans-serif;
      --radius-sm: 8px;
      --radius: 16px;
      --radius-lg: 24px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      --shadow-glow: 0 0 40px rgba(255, 214, 0, 0.15);
      --input-bg: rgba(255, 255, 255, 0.06);
      --input-border: rgba(255, 255, 255, 0.12);
    }

    .light-theme {
      --bg: linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%);
      --surface: rgba(255, 255, 255, 0.75);
      --surface-solid: #FFFFFF;
      --surface-hover: rgba(240, 242, 245, 0.9);
      --text: #111827;
      --text-muted: #6B7280;
      --shadow-glow: 0 0 40px rgba(0, 0, 0, 0.1);
      --input-bg: rgba(0, 0, 0, 0.04);
      --input-border: rgba(0, 0, 0, 0.12);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: var(--font-display); transition: var(--transition); overflow-x: hidden; min-height: 100vh; line-height: 1.6; }
    body::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events: none; z-index: -1; }

    .gradient-orb { position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.35; z-index: -1; animation: float 20s infinite ease-in-out; }
    .orb-1 { width: 400px; height: 400px; background: var(--primary); top: -100px; right: -100px; animation-delay: 0s; }
    .orb-2 { width: 300px; height: 300px; background: var(--secondary); bottom: -50px; left: -50px; animation-delay: 5s; }
    .orb-3 { width: 250px; height: 250px; background: var(--accent); top: 50%; left: 50%; animation-delay: 10s; }
    @keyframes float { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }

    .rtl { direction: rtl; font-family: var(--font-arabic); }
    .ltr { direction: ltr; }

    .glass-card { background: var(--surface); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg), var(--shadow-glow); transition: var(--transition); }
    .glass-card:hover { box-shadow: var(--shadow-lg), 0 0 50px var(--primary-glow); }
    .light-theme .glass-card { border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: var(--shadow-lg); }

    input, button, select, textarea { font-family: inherit; background: var(--input-bg); color: var(--text); border: 1px solid var(--input-border); border-radius: var(--radius); padding: 14px 20px; transition: var(--transition); font-size: 0.95rem; width: 100%; }
    input::placeholder, textarea::placeholder { color: var(--text-muted); opacity: 0.7; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); background: var(--surface-hover); }
    button { cursor: pointer; font-weight: 600; position: relative; overflow: hidden; width: auto; }
    button::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: left 0.5s; }
    button:hover::before { left: 100%; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    button:disabled::before { display: none; }
    
    .btn-primary { background: linear-gradient(135deg, var(--primary) 0%, #FFA000 100%); color: #000; border: none; box-shadow: 0 4px 15px var(--primary-glow); }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px var(--primary-glow); }
    .btn-ghost { background: transparent; border: 1px solid rgba(255, 255, 255, 0.2); }
    .btn-ghost:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); background: rgba(255, 214, 0, 0.1); }
    .btn-danger { background: linear-gradient(135deg, var(--danger) 0%, #D32F2F 100%); color: #fff; border: none; }
    .btn-icon { width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: var(--radius); }

    .scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
    .scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
    .scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, var(--primary), var(--secondary)); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
    .scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, var(--secondary), var(--primary)); background-clip: content-box; }

    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }

    .animate-fade { animation: fadeIn 0.5s ease-out forwards; }
    .pulse { animation: pulse 2s infinite; }
    .spinner { width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    .shimmer { background: linear-gradient(90deg, var(--surface) 25%, var(--surface-hover) 50%, var(--surface) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }

    .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 1000; display: flex; flex-direction: column; gap: 12px; }
    .toast { background: var(--surface-solid); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius); padding: 16px 20px; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 12px; min-width: 300px; animation: slideIn 0.3s ease-out; position: relative; }
    .toast.success { border-left: 4px solid var(--success); }
    .toast.error { border-left: 4px solid var(--danger); }
    .toast.warning { border-left: 4px solid var(--warning); }
    .toast-close { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.2rem; padding: 4px; }
    .toast-close:hover { color: var(--text); }

    .file-icon { width: 40px; height: 40px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-right: 12px; flex-shrink: 0; }
    .file-icon.video { background: linear-gradient(135deg, #FF6B6B, #FF8E53); }
    .file-icon.audio { background: linear-gradient(135deg, #4ECDC4, #44A3AA); }
    .file-icon.image { background: linear-gradient(135deg, #A8E6CF, #88D8B0); }
    .file-icon.document { background: linear-gradient(135deg, #87CEEB, #4682B4); }
    .file-icon.other { background: linear-gradient(135deg, #98D8C8, #6EB589); }

    .stat-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: var(--radius); padding: 20px; text-align: center; transition: var(--transition); }
    .stat-card:hover { background: rgba(255, 255, 255, 0.06); transform: translateY(-2px); }
    .stat-value { font-size: 2rem; font-weight: 800; margin-bottom: 4px; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .stat-label { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }

    .progress-container { width: 100%; background: rgba(255, 255, 255, 0.05); border-radius: 10px; height: 10px; overflow: hidden; position: relative; }
    .progress-bar { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 10px; transition: width 0.3s ease; position: relative; overflow: hidden; }
    .progress-bar::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: shimmer 2s infinite; }

    .bulk-rename-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); padding: 16px; margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
    .bulk-rename-panel input { flex: 1; min-width: 200px; }
    .bulk-rename-panel button { width: auto; padding: 10px 16px; font-size: 0.9rem; }

    .skeleton-row { height: 72px; background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-bottom: 1px solid rgba(255,255,255,0.05); }

    @media (max-width: 768px) {
      .glass-card { border-radius: var(--radius); margin: 12px; padding: 16px; }
      .toast { min-width: auto; max-width: calc(100vw - 48px); }
      .bulk-rename-panel { flex-direction: column; align-items: stretch; }
      .bulk-rename-panel button { width: 100%; }
    }
  `}</style>
);

// ==========================================
// 2. TRANSLATIONS
// ==========================================
const TRANSLATIONS = {
  en: {
    appName: 'Serfry Banana 🍌', home: 'Home', history: 'History', settings: 'Settings',
    heroTitle: 'Download smarter, faster 🍌', heroSub: 'Paste any Google Drive link to extract files, select episodes, and download with precision.',
    inputPlaceholder: 'Paste Google Drive URL here...', loadFiles: 'Load Files',
    selectAll: 'Select All', deselectAll: 'Deselect All', rangeLabel: 'Download episodes', to: 'to', searchPlaceholder: 'Search files...',
    sort: 'Sort by', name: 'Name', size: 'Size', date: 'Date', downloadSelected: 'Download Selected', queuePanel: 'Download Queue',
    downloading: 'Active', completed: 'Completed', failed: 'Failed',
    clearHistory: 'Clear History', confirmClear: 'Are you sure you want to clear all history?',
    fileName: 'File Name', status: 'Status', dateCol: 'Date',
    settingsTitle: 'Application Settings', language: 'Language', theme: 'Theme',
    dark: 'Dark', light: 'Light', maxConcurrent: 'Max Concurrent Downloads',
    pathNote: 'Downloads save to your browser\'s default folder.', chunkSize: 'Download Chunk Size', autoStart: 'Auto-start Downloads',
    notifications: 'Browser Notifications', about: 'About', poweredBy: 'Powered by Serfry Banana 🍌', v1: 'v1.0.0',
    invalidLink: 'Invalid Google Drive link. Please check and try again.', loadingFiles: 'Parsing Drive link & fetching files...',
    noFiles: 'No files found in this link.', noHistory: 'No download history yet',
    rangeStart: 'From', rangeEnd: 'To', filesSelected: 'files selected', totalSize: 'Total Size',
    apiKey: 'Google Drive API Key', apiKeyPlaceholder: 'Paste your API Key here (starts with AIza...)',
    apiKeyNote: 'Required to fetch & download files. Get one from Google Cloud Console.',
    doubleClickRename: 'Double-click to rename file', htmlBlocked: 'Opening official link...',
    downloadSuccess: 'Download completed!', downloadFailed: 'Failed to download',
    bulkRename: 'Bulk Rename', bulkPlaceholder: 'Use # for number (0# for 01, 00# for 001)', applyBulk: 'Apply to Selected',
    proxyUrl: 'Custom CORS Proxy URL', proxyPlaceholder: 'https://cors-anywhere.herokuapp.com/ (Optional)',
    retry: 'Retry', speed: 'Speed', eta: 'ETA', clearCompleted: 'Clear Completed'
  },
  ar: {
    appName: 'سيرفري بنانا 🍌', home: 'الرئيسية', history: 'السجل', settings: 'الإعدادات',
    heroTitle: 'حمّل بذكاء وسرعة 🍌', heroSub: 'الصق رابط Google Drive لاستخراج الملفات، اختر الحلقات، وحمل بدقة عالية.',
    inputPlaceholder: 'الصق رابط Google Drive هنا...', loadFiles: 'تحميل الملفات',
    selectAll: 'تحديد الكل', deselectAll: 'إلغاء التحديد', rangeLabel: 'تحميل الحلقات', to: 'إلى', searchPlaceholder: 'ابحث عن الملفات...',
    sort: 'ترتيب حسب', name: 'الاسم', size: 'الحجم', date: 'التاريخ', downloadSelected: 'تحميل المحدد', queuePanel: 'قائمة التحميل',
    downloading: 'نشط', completed: 'مكتمل', failed: 'فشل',
    clearHistory: 'مسح السجل', confirmClear: 'هل أنت متأكد من مسح جميع السجلات؟',
    fileName: 'اسم الملف', status: 'الحالة', dateCol: 'التاريخ',
    settingsTitle: 'إعدادات التطبيق', language: 'اللغة', theme: 'المظهر',
    dark: 'داكن', light: 'فاتح', maxConcurrent: 'أقصى تحميل متزامن',
    pathNote: 'يتم الحفظ في مجلد المتصفح الافتراضي.', chunkSize: 'حجم جزء التحميل', autoStart: 'بدء التحميل تلقائياً',
    notifications: 'إشعارات المتصفح', about: 'حول التطبيق', poweredBy: 'مدعوم من سيرفري بنانا 🍌', v1: 'الإصدار ١.٠.٠',
    invalidLink: 'رابط Google Drive غير صالح. يرجى التحقق والمحاولة مرة أخرى.', loadingFiles: 'جاري تحليل الرابط وجلب الملفات...',
    noFiles: 'لم يتم العثور على ملفات في هذا الرابط.', noHistory: 'لا يوجد سجل تحميل بعد',
    rangeStart: 'من', rangeEnd: 'إلى', filesSelected: 'ملفات محددة', totalSize: 'الحجم الكلي',
    apiKey: 'مفتاح Google Drive API', apiKeyPlaceholder: 'الصق مفتاح الـ API هنا (يبدأ بـ AIza...)',
    apiKeyNote: 'مطلوب لجلب وتحميل الملفات. احصل عليه من Google Cloud Console.',
    doubleClickRename: 'اضغط مرتين لتغيير اسم الملف', htmlBlocked: 'جاري فتح الرابط الرسمي...',
    downloadSuccess: 'اكتمل التحميل!', downloadFailed: 'فشل التحميل',
    bulkRename: 'تغيير الأسماء دفعة واحدة', bulkPlaceholder: 'استخدم # للرقم (0# لـ 01، 00# لـ 001)', applyBulk: 'تطبيق على المحدد',
    proxyUrl: 'رابط Proxy مخصص (CORS)', proxyPlaceholder: 'https://cors-anywhere.herokuapp.com/ (اختياري)',
    retry: 'إعادة المحاولة', speed: 'السرعة', eta: 'الوقت المتبقي', clearCompleted: 'مسح المكتمل'
  }
};

// ==========================================
// 3. CONTEXTS & PROVIDERS
// ==========================================
const LanguageContext = createContext();
const SettingsContext = createContext();
const ToastContext = createContext();
const DownloadContext = createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : '⚠'}</span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('sb_lang') || 'ar');
  useEffect(() => { localStorage.setItem('sb_lang', lang); }, [lang]);
  const t = (key) => TRANSLATIONS[lang]?.[key] || key;
  return <LanguageContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>{children}</LanguageContext.Provider>;
};

const defaultSettings = { theme: 'dark', maxConcurrent: 2, chunkSize: '2MB', autoStart: true, notifications: false, apiKey: '', proxyUrl: '' };

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sb_settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });
  useEffect(() => {
    localStorage.setItem('sb_settings', JSON.stringify(settings));
    document.body.className = settings.theme === 'light' ? 'light-theme' : '';
  }, [settings]);
  const updateSetting = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));
  return <SettingsContext.Provider value={{ settings, updateSetting }}>{children}</SettingsContext.Provider>;
};

// ==========================================
// 4. DOWNLOAD REDUCER & CONTEXT
// ==========================================
const initialQueue = { tasks: [] };

function queueReducer(state, action) {
  switch (action.type) {
    case 'ADD': return { ...state, tasks: [...state.tasks, ...action.payload] };
    case 'UPDATE': {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx === -1) return state;
      const updated = [...state.tasks];
      updated[idx] = { ...updated[idx], ...action.payload };
      return { ...state, tasks: updated };
    }
    case 'COMPLETE': {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx === -1) return state;
      const updated = [...state.tasks];
      updated[idx] = { ...updated[idx], status: 'completed', progress: 100 };
      return { ...state, tasks: updated };
    }
    case 'FAIL': {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx === -1) return state;
      const updated = [...state.tasks];
      updated[idx] = { ...updated[idx], status: 'failed', progress: 0, error: action.payload.error };
      return { ...state, tasks: updated };
    }
    case 'CLEAR_COMPLETED': return { ...state, tasks: state.tasks.filter(t => t.status !== 'completed') };
    default: return state;
  }
}

const DownloadProvider = ({ children }) => {
  const [state, dispatch] = useReducer(queueReducer, initialQueue, () => {
    const saved = localStorage.getItem('sb_queue');
    return saved ? JSON.parse(saved) : initialQueue;
  });
  useEffect(() => { localStorage.setItem('sb_queue', JSON.stringify(state)); }, [state]);
  return <DownloadContext.Provider value={{ state, dispatch }}>{children}</DownloadContext.Provider>;
};

// ==========================================
// 5. UTILITIES
// ==========================================
const parseDriveLink = (url) => {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? { id: match[1] } : null;
};

const formatBytes = (bytes) => {
  if (!bytes) return 'Unknown';
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatTime = (sec) => {
  if (!sec || sec <= 0 || sec === Infinity) return '--';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const getFileIcon = (type) => {
  if (type.includes('video')) return { icon: '🎬', class: 'video' };
  if (type.includes('audio')) return { icon: '🎵', class: 'audio' };
  if (type.includes('image')) return { icon: '🖼', class: 'image' };
  if (type.includes('pdf') || type.includes('document')) return { icon: '📄', class: 'document' };
  return { icon: '📁', class: 'other' };
};

const extractEpisodeNumber = (name) => {
  const match = name.match(/ep\s*(\d+)/i) || name.match(/(\d{1,3})\./i) || name.match(/S\d+E(\d+)/i);
  return match ? parseInt(match[1]) : 0;
};

const applyBulkRename = (pattern, files, customNames) => {
  const newNames = { ...customNames };
  files.forEach(f => {
    let num = extractEpisodeNumber(f.name) || 1;
    let newName = pattern.replace(/(0*)#/, (match, zeros) => zeros + String(num).padStart(zeros.length, '0'));
    newNames[f.id] = newName;
  });
  return newNames;
};

const cleanLocalStorage = () => {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  ['sb_history', 'sb_queue'].forEach(key => {
    const saved = localStorage.getItem(key);
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      const cleaned = Array.isArray(data) ? data.filter(item => new Date(item.date || item.createdAt || Date.now()) > thirtyDaysAgo) : data;
      if (Array.isArray(cleaned)) localStorage.setItem(key, JSON.stringify(cleaned));
    } catch (e) { console.warn('Cleanup failed for', key, e); }
  });
};

const fetchRealFilesFromDrive = async (folderId, apiKey) => {
  let allFiles = [], nextPageToken = null;
  try {
    do {
      const query = `'${folderId}' in parents and trashed = false`;
      const fields = 'files(id, name, size, mimeType), nextPageToken';
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&key=${apiKey}&fields=${encodeURIComponent(fields)}&pageSize=100${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch files.');
      const data = await response.json();
      if (data.files) allFiles = [...allFiles, ...data.files];
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);
    return allFiles.map(file => ({
      id: file.id, name: file.name, size: parseInt(file.size) || 0,
      type: file.mimeType, date: new Date().toISOString()
    }));
  } catch (error) { console.error(error); return []; }
};

// ==========================================
// 6. COMPONENTS
// ==========================================
const ProgressBar = ({ progress, status, speed, eta }) => {
  const getColor = () => {
    if (status === 'completed') return 'var(--success)';
    if (status === 'failed') return 'var(--danger)';
    return 'linear-gradient(90deg, var(--primary), var(--secondary))';
  };
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%`, background: status === 'completed' || status === 'failed' ? getColor() : undefined }} />
    </div>
  );
};

const FileList = ({ files, onSelect, selected, search, sort, range, customNames, onRename, t, loading }) => {
  const containerRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const ROW_HEIGHT = 72;
  const VISIBLE = 12;

  const filtered = useMemo(() => {
    let res = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
    if (range.start !== null && range.end !== null) {
      const s = Math.min(range.start, range.end) - 1;
      const e = Math.max(range.start, range.end);
      res = res.filter((_, i) => i >= s && i < e);
    }
    res.sort((a, b) => {
      if (sort === 'name') return (customNames[a.id] || a.name).localeCompare(customNames[b.id] || b.name);
      if (sort === 'size') return b.size - a.size;
      return new Date(b.date) - new Date(a.date);
    });
    return res;
  }, [files, search, sort, range, customNames]);

  const handleScroll = () => setScrollPos(containerRef.current.scrollTop);
  const startIdx = Math.floor(scrollPos / ROW_HEIGHT);
  const visibleFiles = filtered.slice(startIdx, startIdx + VISIBLE);

  const startEdit = (file) => { setEditingId(file.id); setEditValue(customNames[file.id] || file.name); };
  const saveEdit = () => { if (editingId && editValue.trim()) onRename(editingId, editValue.trim()); setEditingId(null); };

  return (
    <div ref={containerRef} onScroll={handleScroll} className="scrollbar" style={{ maxHeight: '500px', overflowY: 'auto', position: 'relative' }}>
      {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-row" />) : (
        <div style={{ height: `${filtered.length * ROW_HEIGHT}px`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: startIdx * ROW_HEIGHT, width: '100%' }}>
            {visibleFiles.map((f) => {
              const isSelected = selected.has(f.id);
              const fileIcon = getFileIcon(f.type);
              const displayName = customNames[f.id] || f.name;
              const isEditing = editingId === f.id;
              return (
                <div key={f.id} style={{ height: `${ROW_HEIGHT}px`, display: 'flex', alignItems: 'center', padding: '12px 16px', background: isSelected ? 'rgba(255, 214, 0, 0.1)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s', cursor: 'pointer' }}
                  onClick={() => onSelect(f.id)} onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')} onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = 'transparent')}>
                  <div className="file-icon" style={{ background: fileIcon.class === 'video' ? 'linear-gradient(135deg, #FF6B6B, #FF8E53)' : fileIcon.class === 'audio' ? 'linear-gradient(135deg, #4ECDC4, #44A3AA)' : 'linear-gradient(135deg, #98D8C8, #6EB589)' }}>{fileIcon.icon}</div>
                  <input type="checkbox" checked={isSelected} onChange={() => onSelect(f.id)} onClick={(e) => e.stopPropagation()} style={{ marginRight: '12px', width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {isEditing ? (
                      <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={saveEdit} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} onClick={(e) => e.stopPropagation()} style={{ width: '100%', padding: '4px 8px', marginBottom: '4px', color: 'var(--text)', background: 'var(--surface)' }} />
                    ) : (
                      <div style={{ fontWeight: 600, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'text', color: 'var(--text)' }} onDoubleClick={() => startEdit(f)} title={t('doubleClickRename')}>{displayName}</div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{formatBytes(f.size)} • {f.type.split('/')[1].toUpperCase()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = ({ activeTab, setActiveTab }) => {
  const { lang, setLang, t, isRTL } = useContext(LanguageContext);
  const { settings, updateSetting } = useContext(SettingsContext);
  return (
    <nav className="glass-card" style={{ margin: '16px 24px', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '16px', zIndex: 100, borderRadius: '20px', flexWrap: 'wrap', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '2.5rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px var(--primary-glow)', animation: 'pulse 3s infinite' }}>🍌</div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{t('appName')}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('poweredBy')}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {['home', 'history', 'settings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent', color: activeTab === tab ? '#000' : 'var(--text)', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, transition: 'all 0.3s' }}>{t(tab)}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="btn-ghost btn-icon" style={{ fontWeight: 700 }}>{lang === 'ar' ? 'EN' : 'AR'}</button>
        <button onClick={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')} className="btn-ghost btn-icon">{settings.theme === 'dark' ? '☀️' : '🌙'}</button>
      </div>
    </nav>
  );
};

const HomePage = ({ onNavigate }) => {
  const { t } = useContext(LanguageContext);
  const { settings } = useContext(SettingsContext);
  const { addToast, removeToast } = useContext(ToastContext);
  const { state, dispatch } = useContext(DownloadContext);
  
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [range, setRange] = useState({ start: null, end: null });
  const [customNames, setCustomNames] = useState({});
  const [bulkPattern, setBulkPattern] = useState('[AnimeSpace] OV EP#');
  const abortControllers = useRef(new Map());

  useEffect(() => { cleanLocalStorage(); }, []);

  const handleLoad = async () => {
    if (!settings.apiKey) { addToast('Please set your Google Drive API Key in Settings first!', 'error'); return; }
    const parsed = parseDriveLink(url);
    if (!parsed) { addToast(t('invalidLink'), 'error'); return; }
    setLoading(true);
    addToast('Fetching real files from Google Drive...', 'warning');
    const realFiles = await fetchRealFilesFromDrive(parsed.id, settings.apiKey);
    if (realFiles.length > 0) {
      setFiles(realFiles);
      setSelected(new Set(realFiles.map(f => f.id)));
      setCustomNames({});
      addToast(`Loaded ${realFiles.length} real files!`, 'success');
    } else {
      addToast('No files found or API Key is invalid.', 'error');
    }
    setLoading(false);
  };

  const toggleSelect = (id) => { const next = new Set(selected); selected.has(id) ? next.delete(id) : next.add(id); setSelected(next); };
  const handleRename = (id, newName) => setCustomNames(prev => ({ ...prev, [id]: newName }));
  
  const handleBulkRename = () => {
    const selectedFiles = files.filter(f => selected.has(f.id));
    if (selectedFiles.length === 0) return;
    setCustomNames(prev => applyBulkRename(bulkPattern, selectedFiles, prev));
    addToast(`Renamed ${selectedFiles.length} files using pattern`, 'success');
  };

  const downloadFile = useCallback(async (file, finalName) => {
    const controller = new AbortController();
    abortControllers.current.set(file.id, controller);
    
    dispatch({ type: 'UPDATE', payload: { id: file.id, status: 'downloading', progress: 5, startTime: Date.now(), bytesDownloaded: 0 } });

    try {
      let driveUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${settings.apiKey}`;
      if (settings.proxyUrl) driveUrl = `${settings.proxyUrl}${encodeURIComponent(driveUrl)}`;

      const response = await fetch(driveUrl, { signal: controller.signal });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) throw new Error('HTML_WARNING_PAGE');

      const total = parseInt(response.headers.get('content-length') || file.size, 10);
      const reader = response.body.getReader();
      let loaded = 0;
      const chunks = [];

      while (true) {
        if (controller.signal.aborted) break;
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        const progress = total ? Math.round((loaded / total) * 100) : 95;
        const speed = loaded / ((Date.now() - (state.tasks.find(t => t.id === file.id)?.startTime || Date.now())) / 1000) || 0;
        const eta = speed > 0 ? (total - loaded) / speed : 0;
        
        dispatch({ type: 'UPDATE', payload: { id: file.id, progress, speed, eta, bytesDownloaded: loaded } });
      }

      if (controller.signal.aborted) return;

      const mimeType = file.type || 'application/octet-stream';
      const blob = new Blob(chunks, { type: mimeType });
      const downloadUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = finalName;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      dispatch({ type: 'COMPLETE', payload: { id: file.id } });
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (err.message === 'HTML_WARNING_PAGE' || err.message.includes('Failed to fetch')) {
        dispatch({ type: 'UPDATE', payload: { id: file.id, status: 'failed', error: t('htmlBlocked') } });
        setTimeout(() => window.open(`https://drive.google.com/uc?export=download&id=${file.id}`, '_blank'), 1000);
      } else {
        dispatch({ type: 'FAIL', payload: { id: file.id, error: t('downloadFailed') } });
      }
    } finally {
      abortControllers.current.delete(file.id);
    }
  }, [settings.apiKey, settings.proxyUrl, dispatch, state.tasks, t]);

  const handleDownload = async () => {
    const toDownload = files.filter(f => selected.has(f.id));
    if (toDownload.length === 0) { addToast('No files selected', 'warning'); return; }
    if (!settings.apiKey) { addToast('API Key is required for direct download!', 'error'); return; }

    const max = Math.min(settings.maxConcurrent || 2, 8);
    dispatch({ type: 'ADD', payload: toDownload.map(f => ({ ...f, status: 'queued', progress: 0, customName: customNames[f.id] || f.name })) });
    addToast(`Starting ${toDownload.length} downloads (Max ${max} concurrent)...`, 'warning');

    const queue = [...toDownload];
    const active = [];

    const process = async () => {
      while (queue.length > 0 && active.length < max) {
        const file = queue.shift();
        const finalName = customNames[file.id] || file.name;
        const p = downloadFile(file, finalName).finally(() => active.splice(active.indexOf(p), 1));
        active.push(p);
        if (queue.length > 0) await new Promise(r => setTimeout(r, 500));
      }
      await Promise.all(active);
    };
    process();
  };

  const handleRetry = (task) => {
    abortControllers.current.delete(task.id);
    dispatch({ type: 'UPDATE', payload: { ...task, status: 'queued', progress: 0, error: undefined } });
    downloadFile(task, task.customName || task.name);
  };

  const totalSelectedSize = useMemo(() => Array.from(selected).reduce((acc, id) => { const file = files.find(f => f.id === id); return acc + (file ? file.size : 0); }, 0), [selected, files]);

  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px', padding: '48px 24px', background: 'linear-gradient(135deg, rgba(255,214,0,0.1), rgba(0,229,204,0.1))', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('heroTitle')}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>{t('heroSub')}</p>
      </div>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input type="text" placeholder={t('inputPlaceholder')} value={url} onChange={e => setUrl(e.target.value)} style={{ flex: 1, fontSize: '1rem', minWidth: '250px' }} onKeyPress={(e) => e.key === 'Enter' && handleLoad()} />
          <button onClick={handleLoad} disabled={loading || !url || !settings.apiKey} className="btn-primary" style={{ padding: '14px 32px', minWidth: '160px' }}>{loading ? <div className="spinner" style={{ margin: '0 auto' }} /> : t('loadFiles')}</button>
        </div>
        {!settings.apiKey && (
          <div style={{ marginTop: '16px', color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>
            ⚠️ {t('apiKeyNote')} <br/>
            <button onClick={() => onNavigate('settings')} style={{ marginTop: '8px', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>{t('settings')} 🚀</button>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
          <div className="bulk-rename-panel">
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>🏷️ {t('bulkRename')}:</span>
            <input type="text" value={bulkPattern} onChange={e => setBulkPattern(e.target.value)} placeholder={t('bulkPlaceholder')} />
            <button onClick={handleBulkRename} className="btn-ghost" style={{ minWidth: '120px' }}>{t('applyBulk')}</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => selected.size === files.length ? setSelected(new Set()) : setSelected(new Set(files.map(f => f.id)))} className="btn-ghost">{selected.size === files.length ? t('deselectAll') : t('selectAll')}</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('rangeLabel')}</span>
                <input type="number" min="1" max={files.length} placeholder={t('rangeStart')} value={range.start || ''} onChange={e => setRange(p => ({...p, start: parseInt(e.target.value) || null}))} style={{ width: '80px' }} />
                <span style={{ color: 'var(--text-muted)' }}>{t('to')}</span>
                <input type="number" min="1" max={files.length} placeholder={t('rangeEnd')} value={range.end || ''} onChange={e => setRange(p => ({...p, end: parseInt(e.target.value) || null}))} style={{ width: '80px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input placeholder={t('searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '10px 16px', width: '250px' }} />
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '10px 16px' }}>
                <option value="name">{t('sort')} - {t('name')}</option>
                <option value="size">{t('sort')} - {t('size')}</option>
                <option value="date">{t('sort')} - {t('date')}</option>
              </select>
            </div>
          </div>
          
          <FileList files={files} onSelect={toggleSelect} selected={selected} search={search} sort={sort} range={range} customNames={customNames} onRename={handleRename} t={t} loading={loading} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selected.size} {t('filesSelected')}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('totalSize')}: {formatBytes(totalSelectedSize)}</div>
            </div>
            <button onClick={handleDownload} className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>{t('downloadSelected')} ({selected.size})</button>
          </div>
        </div>
      )}

      {state.tasks.length > 0 && (
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('queuePanel')}</h3>
            <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })} className="btn-ghost" style={{ fontSize: '0.85rem' }}>{t('clearCompleted')}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="stat-card"><div className="stat-value" style={{ color: 'var(--text-muted)' }}>{state.tasks.filter(t => t.status === 'downloading').length}</div><div className="stat-label">{t('downloading')}</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: 'var(--success)' }}>{state.tasks.filter(t => t.status === 'completed').length}</div><div className="stat-label">{t('completed')}</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: 'var(--danger)' }}>{state.tasks.filter(t => t.status === 'failed').length}</div><div className="stat-label">{t('failed')}</div></div>
          </div>
          <div className="scrollbar" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {state.tasks.map(task => (
              <div key={task.id} style={{ padding: '20px', marginBottom: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: task.status === 'completed' ? '1px solid var(--success)' : task.status === 'failed' ? '1px solid var(--danger)' : '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }}>{task.customName || task.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {task.status === 'completed' ? '✓ Saved' : task.status === 'failed' ? `✕ ${task.error}` : `${task.progress}% | ${t('speed')}: ${formatBytes(task.speed || 0)}/s | ${t('eta')}: ${formatTime(task.eta)}`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: task.status === 'completed' ? 'var(--success)' : task.status === 'failed' ? 'var(--danger)' : 'var(--primary)', minWidth: '60px', textAlign: 'right' }}>
                      {task.status === 'completed' ? '✓' : task.status === 'failed' ? '✕' : `${task.progress}%`}
                    </div>
                    {task.status === 'failed' && (
                      <button onClick={() => handleRetry(task)} className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>{t('retry')}</button>
                    )}
                  </div>
                </div>
                <ProgressBar progress={task.progress} status={task.status} speed={task.speed} eta={task.eta} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryPage = () => {
  const { t } = useContext(LanguageContext);
  const { addToast } = useContext(ToastContext);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sb_history') || '[]'));
  const clear = () => { if (window.confirm(t('confirmClear'))) { setHistory([]); localStorage.removeItem('sb_history'); addToast('History cleared', 'success'); } };
  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{t('history')}</h2>
        {history.length > 0 && <button onClick={clear} className="btn-danger" style={{ padding: '12px 24px' }}>{t('clearHistory')}</button>}
      </div>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {history.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '1.2rem' }}>{t('noHistory')}</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '20px' }}>{t('fileName')}</th><th style={{ padding: '20px' }}>{t('size')}</th><th style={{ padding: '20px' }}>{t('dateCol')}</th><th style={{ padding: '20px' }}>{t('status')}</th>
            </tr></thead>
            <tbody>{history.map((h, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px 20px', fontWeight: 500 }}>{h.name}</td>
                <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{formatBytes(h.total)}</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{new Date(h.date).toLocaleDateString()}</td>
                <td style={{ padding: '16px 20px' }}><span style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600 }}>{t('completed')}</span></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const { t, lang, setLang } = useContext(LanguageContext);
  const { settings, updateSetting } = useContext(SettingsContext);
  const SettingCard = ({ title, children, icon }) => (
    <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h4>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
    </div>
  );
  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '32px', fontSize: '2rem', fontWeight: 700 }}>{t('settingsTitle')}</h2>
      <SettingCard title={t('apiKey')} icon="🔑">
        <input type="text" placeholder={t('apiKeyPlaceholder')} value={settings.apiKey} onChange={e => updateSetting('apiKey', e.target.value)} style={{ width: '100%' }} />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('apiKeyNote')}</p>
      </SettingCard>
      <SettingCard title={t('proxyUrl')} icon="🌐">
        <input type="text" placeholder={t('proxyPlaceholder')} value={settings.proxyUrl} onChange={e => updateSetting('proxyUrl', e.target.value)} style={{ width: '100%' }} />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Used to bypass CORS restrictions for large files.</p>
      </SettingCard>
      <SettingCard title={t('language')} icon="🌍">
        <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: '14px' }}>
          <option value="en">English</option><option value="ar">العربية</option>
        </select>
      </SettingCard>
      <SettingCard title={t('theme')} icon="🎨">
        <button onClick={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')} className="btn-ghost" style={{ padding: '14px', textAlign: 'left' }}>{settings.theme === 'dark' ? '☀️ ' + t('light') : '🌙 ' + t('dark')}</button>
      </SettingCard>
      <SettingCard title={t('maxConcurrent')} icon="⚡">
        <select value={settings.maxConcurrent} onChange={e => updateSetting('maxConcurrent', Math.min(parseInt(e.target.value), 8))} style={{ width: '150px', padding: '14px' }}>
          {[1, 2, 3, 4, 5, 8].map(n => <option key={n} value={n}>{n} {t('downloading')}</option>)}
        </select>
      </SettingCard>
      <SettingCard title={t('about')} icon="ℹ️">
        <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>{t('poweredBy')}</p>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>{t('v1')}</p>
      </SettingCard>
    </div>
  );
};

// ==========================================
// 7. ERROR BOUNDARY
// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary caught:', error, errorInfo); }
  render() {
    if (this.state.hasError) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>Something went wrong. Please refresh the page.</div>;
    return this.props.children;
  }
}

// ==========================================
// 8. MAIN APP
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  useEffect(() => {
    document.title = 'Serfry Banana 🍌';
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#0a0a0f';
    document.head.appendChild(meta);
  }, []);

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
  useEffect(() => { document.documentElement.className = isRTL ? 'rtl' : 'ltr'; document.documentElement.dir = isRTL ? 'rtl' : 'ltr'; }, [isRTL]);
  return (
    <>
      <GlobalStyles />
      <div className="gradient-orb orb-1" /><div className="gradient-orb orb-2" /><div className="gradient-orb orb-3" />
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>
          {activeTab === 'home' && <HomePage onNavigate={setActiveTab} />}
          {activeTab === 'history' && <HistoryPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </>
  );
}