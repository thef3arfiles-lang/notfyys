
import React, { useState, useEffect } from 'react';
import { Smartphone, Moon, Sun, Download, Save, Plus, Trash2, ChevronDown, Upload, X } from 'lucide-react';
import { AppState, NotificationData, FontWeight } from '../types';
import { FONT_WEIGHT_OPTIONS, SOCIAL_PRESETS } from '../constants';
import ImageInput from './ImageInput';
import { toPng } from 'html-to-image';

interface ControlPanelProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ appState, setAppState }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [newActionInput, setNewActionInput] = useState<{ [key: string]: string }>({});
  const [library, setLibrary] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ios_maker_library');
    if (saved) {
      try {
        setLibrary(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load gallery", e);
      }
    }
  }, []);

  const saveToLibrary = () => {
    const currentUrl = appState.wallpaper.url;
    if (!currentUrl || library.includes(currentUrl)) return;
    const updated = [currentUrl, ...library];
    setLibrary(updated);
    localStorage.setItem('ios_maker_library', JSON.stringify(updated));
  };

  const removeFromLibrary = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = library.filter(item => item !== url);
    setLibrary(updated);
    localStorage.setItem('ios_maker_library', JSON.stringify(updated));
  };

  const handleDownload = async () => {
    const element = document.getElementById('lock-screen-preview');
    if (!element) return;
    
    setIsDownloading(true);
    // Give the UI a tiny moment to settle
    await new Promise(r => setTimeout(r, 100));

    try {
      // The key to fixing "bugged" exports with html-to-image is 
      // ensuring the target element isn't actively being scaled by CSS.
      const dataUrl = await toPng(element, { 
        pixelRatio: 3, 
        backgroundColor: '#000000',
        cacheBust: true, // Fixes missing wallpaper/images
        style: {
          transform: 'none', // Critical: resets any parent scaling
          borderRadius: '0',
          margin: '0',
          width: '380px', // Force consistent internal width for export
          height: '823px'  // Force consistent internal height (9/19.5 aspect)
        },
        // Wait for all images to be fully loaded into the canvas
        includeQueryParams: true,
      });
      
      const link = document.createElement('a');
      link.download = `ios-lockscreen-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error: any) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpdateWallpaper = (url: string) => {
    setAppState(prev => ({
      ...prev,
      wallpaper: { ...prev.wallpaper, url }
    }));
  };

  const toggleDarkMode = () => {
    setAppState(prev => ({
      ...prev,
      aestheticSettings: { ...prev.aestheticSettings, isDark: !prev.aestheticSettings.isDark }
    }));
  };

  const handleAddNotification = () => {
    const newNotif: NotificationData = {
      id: Date.now().toString(),
      appName: 'Instagram',
      message: 'New notification',
      timeAgo: 'now',
      icon: SOCIAL_PRESETS[0].icon,
      isContact: false,
      actions: [],
      badge: 1
    };
    setAppState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotif]
    }));
  };

  const handleUpdateNotification = (id: string, field: keyof NotificationData, value: any) => {
    setAppState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, [field]: value } : n)
    }));
  };

  const handleDeleteNotification = (id: string) => {
    setAppState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  };

  const handleAddAction = (notifId: string) => {
    const text = newActionInput[notifId];
    if (!text) return;
    setAppState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => {
        if (n.id === notifId) {
          return { ...n, actions: [...(n.actions || []), text] };
        }
        return n;
      })
    }));
    setNewActionInput(prev => ({ ...prev, [notifId]: '' }));
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden font-sans border-l border-gray-200 shadow-2xl">
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">IOS CREATOR</h1>
        </div>
        <button 
          onClick={toggleDarkMode}
          className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center text-white hover:bg-slate-700 transition-colors shadow-sm"
        >
          {appState.aestheticSettings.isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-12 space-y-10">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-black text-white py-5 mt-6 rounded-2xl flex items-center justify-center gap-3 font-black text-sm tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl"
        >
          {isDownloading ? <span className="animate-spin text-lg">◌</span> : <Download className="w-5 h-5" />}
          DOWNLOAD IMAGE
        </button>

        <section>
          <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase mb-6">Appearance</h2>
          <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black uppercase text-slate-600">Opacity</label>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{appState.aestheticSettings.cardOpacity}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={appState.aestheticSettings.cardOpacity}
              onChange={(e) => setAppState(prev => ({ ...prev, aestheticSettings: { ...prev.aestheticSettings, cardOpacity: parseInt(e.target.value) }}))}
              className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
          </div>
        </section>

        <section>
          <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase mb-6">Typography</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Clock Weight</label>
              <div className="relative">
                <select 
                  value={appState.fontSettings.clockWeight}
                  onChange={(e) => setAppState(prev => ({ ...prev, fontSettings: { ...prev.fontSettings, clockWeight: e.target.value as FontWeight }}))}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                >
                  {FONT_WEIGHT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Notif. Weight</label>
              <div className="relative">
                <select 
                  value={appState.fontSettings.notificationWeight}
                  onChange={(e) => setAppState(prev => ({ ...prev, fontSettings: { ...prev.fontSettings, notificationWeight: e.target.value as FontWeight }}))}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                >
                  {FONT_WEIGHT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Background</h2>
            <button 
              onClick={saveToLibrary}
              className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase tracking-wider hover:bg-blue-100 transition-colors border border-blue-100"
            >
               <Save className="w-3 h-3" /> Save
            </button>
          </div>
          
          <div className="relative h-48 w-full border-2 border-dashed border-slate-200 rounded-[32px] overflow-hidden group flex items-center justify-center bg-slate-50 mb-4 shadow-inner">
             <ImageInput 
                value={appState.wallpaper.url} 
                onChange={handleUpdateWallpaper} 
                className="absolute inset-0 w-full h-full"
             />
             {!appState.wallpaper.url && (
                <div className="pointer-events-none flex flex-col items-center gap-2">
                   <Upload className="w-6 h-6 text-slate-300" />
                </div>
             )}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none group-hover:scale-105 transition-transform">
                <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg">Change</span>
             </div>
          </div>

          {library.length > 0 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1">
              {library.map((url, idx) => (
                <div key={idx} className="relative group/lib flex-shrink-0">
                  <button 
                    onClick={() => handleUpdateWallpaper(url)}
                    className={`w-14 h-20 rounded-xl overflow-hidden border-2 transition-all ${appState.wallpaper.url === url ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-200 shadow-sm'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="Saved Wallpaper" />
                  </button>
                  <button 
                    onClick={(e) => removeFromLibrary(url, e)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/lib:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Notifications</h2>
            <button 
              onClick={handleAddNotification}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2 uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Notif.
            </button>
          </div>

          <div className="space-y-6">
            {appState.notifications.map((notif) => (
              <div key={notif.id} className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-md relative group hover:shadow-lg transition-all">
                <button 
                  onClick={() => handleDeleteNotification(notif.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex gap-4">
                  <div className="w-[72px] flex-shrink-0 flex flex-col gap-2">
                    <div className="relative w-full aspect-square rounded-[20px] overflow-hidden bg-slate-100 border border-slate-200 group/icon shadow-inner">
                      <ImageInput 
                        value={notif.icon} 
                        onChange={(val) => handleUpdateNotification(notif.id, 'icon', val)}
                        className="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none">
                         <span className="text-[8px] font-black text-white uppercase tracking-tighter">Change</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <select 
                          value={notif.appName}
                          onChange={(e) => {
                            const newName = e.target.value;
                            const preset = SOCIAL_PRESETS.find(p => p.name === newName);
                            if (preset) {
                              setAppState(prev => ({
                                ...prev,
                                notifications: prev.notifications.map(n => 
                                  n.id === notif.id ? { ...n, appName: newName, icon: preset.icon, isContact: false } : n
                                )
                              }));
                            } else {
                              handleUpdateNotification(notif.id, 'appName', newName);
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold appearance-none outline-none pr-8 shadow-sm"
                        >
                          {SOCIAL_PRESETS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                          <option value="Custom">Custom</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                      </div>
                      <input 
                        type="text" 
                        value={notif.timeAgo}
                        onChange={(e) => handleUpdateNotification(notif.id, 'timeAgo', e.target.value)}
                        className="w-20 bg-slate-50 border border-slate-200 p-3 rounded-xl text-[10px] font-black lowercase text-center outline-none shadow-sm"
                      />
                      <input 
                        type="number" 
                        value={notif.badge}
                        placeholder="Qty"
                        onChange={(e) => handleUpdateNotification(notif.id, 'badge', parseInt(e.target.value) || 0)}
                        className="w-16 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold text-center outline-none shadow-sm"
                      />
                    </div>
                    <textarea 
                      rows={2}
                      value={notif.message}
                      onChange={(e) => handleUpdateNotification(notif.id, 'message', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium resize-none outline-none focus:ring-1 focus:ring-blue-100 shadow-sm"
                    />
                    <div className="flex gap-2 pt-1">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          placeholder="BUTTON TEXT..."
                          value={newActionInput[notif.id] || ''}
                          onChange={(e) => setNewActionInput(prev => ({ ...prev, [notif.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddAction(notif.id)}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-[10px] font-black uppercase outline-none shadow-sm"
                        />
                        <button 
                          onClick={() => handleAddAction(notif.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ControlPanel;
