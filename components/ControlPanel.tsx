
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

  // Load library from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ios_maker_library');
    if (saved) {
      try {
        setLibrary(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse library", e);
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
    try {
      const dataUrl = await toPng(element, { 
        pixelRatio: 3, 
        backgroundColor: '#000000',
        filter: (node: any) => !(node instanceof HTMLElement && node.classList.contains('exclude-from-export'))
      });
      const link = document.createElement('a');
      link.download = `ios-lockscreen-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error: any) {
      alert("Export failed.");
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
      message: 'New notification content',
      timeAgo: 'now',
      icon: SOCIAL_PRESETS[0].icon,
      isContact: false,
      actions: [],
      badge: 0
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
      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">IOS MAKER</h1>
        </div>
        <button 
          onClick={toggleDarkMode}
          className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
        >
          {appState.aestheticSettings.isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-12 space-y-10">
        
        {/* Main Export Button */}
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-sm tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl"
        >
          {isDownloading ? <span className="animate-spin text-lg">◌</span> : <Download className="w-5 h-5" />}
          DOWNLOAD PNG
        </button>

        {/* Section: Appearance */}
        <section>
          <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase mb-6">Appearance</h2>
          <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black uppercase text-slate-500">Card Opacity</label>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{appState.aestheticSettings.cardOpacity}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={appState.aestheticSettings.cardOpacity}
              onChange={(e) => setAppState(prev => ({ ...prev, aestheticSettings: { ...prev.aestheticSettings, cardOpacity: parseInt(e.target.value) }}))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
          </div>
        </section>

        {/* Section: Typography */}
        <section>
          <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase mb-6">Typography</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Clock Weight</label>
              <div className="relative">
                <select 
                  value={appState.fontSettings.clockWeight}
                  onChange={(e) => setAppState(prev => ({ ...prev, fontSettings: { ...prev.fontSettings, clockWeight: e.target.value as FontWeight }}))}
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {FONT_WEIGHT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label.split(' ')[0]}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Text Weight</label>
              <div className="relative">
                <select 
                  value={appState.fontSettings.notificationWeight}
                  onChange={(e) => setAppState(prev => ({ ...prev, fontSettings: { ...prev.fontSettings, notificationWeight: e.target.value as FontWeight }}))}
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {FONT_WEIGHT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label.split(' ')[0]}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Background */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Background</h2>
            <button 
              onClick={saveToLibrary}
              className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase tracking-wider hover:bg-blue-100 transition-colors"
            >
               <Save className="w-3 h-3" /> Save Lib
            </button>
          </div>
          
          <div className="relative h-48 w-full border-2 border-dashed border-slate-200 rounded-[32px] overflow-hidden group flex items-center justify-center bg-slate-50 mb-4">
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
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
                <span className="bg-slate-800/80 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl backdrop-blur-sm">Change</span>
             </div>
          </div>

          {/* Library Quick Access */}
          {library.length > 0 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1">
              {library.map((url, idx) => (
                <div key={idx} className="relative group/lib flex-shrink-0">
                  <button 
                    onClick={() => handleUpdateWallpaper(url)}
                    className={`w-14 h-20 rounded-xl overflow-hidden border-2 transition-all ${appState.wallpaper.url === url ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent shadow-sm'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="Saved wallpaper" />
                  </button>
                  <button 
                    onClick={(e) => removeFromLibrary(url, e)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/lib:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section: Notifications */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Notifications</h2>
            <button 
              onClick={handleAddNotification}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2 uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>

          <div className="space-y-6">
            {appState.notifications.map((notif) => (
              <div key={notif.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm relative group hover:shadow-md transition-shadow">
                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteNotification(notif.id)}
                  className="absolute -top-2 -right-2 bg-red-50 text-red-500 p-2 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-colors border border-red-100 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex gap-4">
                  {/* Icon Column - Matches smaller notification icon size */}
                  <div className="w-[72px] flex-shrink-0 flex flex-col gap-2">
                    <div className="relative w-full aspect-square rounded-[20px] overflow-hidden bg-slate-100 group/icon">
                      <ImageInput 
                        value={notif.icon} 
                        onChange={(val) => handleUpdateNotification(notif.id, 'icon', val)}
                        className="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none">
                         <span className="text-[8px] font-black text-white uppercase tracking-tighter">Change</span>
                      </div>
                    </div>
                    {/* Toggle Contact/App */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button 
                        onClick={() => handleUpdateNotification(notif.id, 'isContact', false)}
                        className={`flex-1 py-1.5 flex justify-center rounded-lg ${!notif.isContact ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                      >
                         <div className="w-3.5 h-3.5 border-2 border-current rounded-sm"></div>
                      </button>
                      <button 
                        onClick={() => handleUpdateNotification(notif.id, 'isContact', true)}
                        className={`flex-1 py-1.5 flex justify-center rounded-lg ${notif.isContact ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                      >
                         <div className="w-3.5 h-3.5 bg-current rounded-full"></div>
                      </button>
                    </div>
                  </div>

                  {/* Fields Column */}
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
                          className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-bold appearance-none outline-none pr-8"
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
                        className="w-20 bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] font-black lowercase text-center outline-none"
                      />
                      <input 
                        type="number" 
                        value={notif.badge}
                        onChange={(e) => handleUpdateNotification(notif.id, 'badge', parseInt(e.target.value))}
                        className="w-16 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-bold text-center outline-none"
                      />
                    </div>
                    <textarea 
                      rows={2}
                      value={notif.message}
                      onChange={(e) => handleUpdateNotification(notif.id, 'message', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-medium resize-none outline-none focus:ring-1 focus:ring-blue-100"
                    />
                    {/* Action Buttons Row */}
                    <div className="flex gap-2 pt-1">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          placeholder="ADD BUTTON TEXT..."
                          value={newActionInput[notif.id] || ''}
                          onChange={(e) => setNewActionInput(prev => ({ ...prev, [notif.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddAction(notif.id)}
                          className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] font-black uppercase outline-none"
                        />
                        <button 
                          onClick={() => handleAddAction(notif.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Current Actions Display */}
                      <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-[100px]">
                        {(notif.actions || []).map((action, idx) => (
                          <div key={idx} className="bg-slate-100 px-2 py-1 rounded-lg text-[8px] font-black text-slate-500 whitespace-nowrap flex items-center gap-1">
                             {action}
                             <X className="w-2 h-2 cursor-pointer" onClick={() => handleUpdateNotification(notif.id, 'actions', notif.actions.filter((_, i) => i !== idx))} />
                          </div>
                        ))}
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
