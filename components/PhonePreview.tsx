
import React, { useMemo } from 'react';
import { Wifi, Battery } from 'lucide-react';
import { AppState } from '../types';
import NotificationCard from './NotificationCard';

interface PhonePreviewProps {
  appState: AppState;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ appState }) => {
  const { wallpaper, notifications, currentTime, fontSettings, aestheticSettings } = appState;

  // Matching the Portuguese date from the screenshot
  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  }, [currentTime]);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }, [currentTime]);

  return (
    <div className="relative w-full max-w-[380px] aspect-[9/19.5] mx-auto bg-black rounded-[55px] border-[12px] border-black shadow-[0_0_0_4px_#333,0_20px_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
      
      <div id="lock-screen-preview" className="relative h-full w-full bg-black overflow-hidden select-none">
        
        {/* Background Image */}
        <img 
          src={wallpaper.url}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="Wallpaper"
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/20 pointer-events-none z-0" />

        {/* Status Bar */}
        <div className="absolute top-3 left-0 right-0 px-8 flex justify-between items-center text-white z-10 text-[15px] font-semibold tracking-wide">
          <span className="exclude-from-export">{formattedTime}</span>
          <div className="flex items-center gap-1.5 exclude-from-export">
            <Wifi size={16} />
            <Battery size={16} fill="currentColor" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex flex-col h-full pt-16 px-2.5 pb-8">
          {/* Clock & Date - Matching screenshot bold styling */}
          <div className="flex flex-col items-center mb-8">
            <div className="text-white text-[20px] font-semibold drop-shadow-md mb-2">
              {formattedDate}
            </div>
            <h1 
              className="text-white text-[92px] leading-none tracking-tight drop-shadow-xl font-[Inter]"
              style={{ fontWeight: fontSettings.clockWeight }}
            >
              {formattedTime}
            </h1>
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-1 w-full overflow-y-auto no-scrollbar pb-2">
            {notifications.map((notif) => (
              <NotificationCard 
                key={notif.id} 
                data={notif} 
                messageFontWeight={fontSettings.notificationWeight}
                aesthetics={aestheticSettings}
              />
            ))}
          </div>

          {/* Home Bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-white rounded-full shadow-sm" />
        </div>
      </div>

      {/* Persistent Icons */}
      <div className="absolute inset-0 pointer-events-none z-20">
         <div className="absolute bottom-12 left-12 w-[50px] h-[50px] bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 6c0 2.21-1.79 4-4 4H10c-2.21 0-4-1.79-4-4V2h12v4z"/><path d="M6 6v5l5 11h2l5-11V6H6z"/></svg>
         </div>
         <div className="absolute bottom-12 right-12 w-[50px] h-[50px] bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
         </div>
      </div>

    </div>
  );
};

export default PhonePreview;
