
import React, { useMemo } from 'react';
import { Wifi } from 'lucide-react';
import { AppState } from '../types';
import NotificationCard from './NotificationCard';

interface PhonePreviewProps {
  appState: AppState;
}

// Realistic iOS Battery Component
const RealisticBattery = () => (
  <div className="relative w-[26px] h-[12.5px] border-[1.2px] border-white/90 rounded-[4.5px] flex items-center p-[1.5px] ml-0.5">
    {/* The Background of the battery shell */}
    <div className="absolute inset-0 bg-white/10 rounded-[3px]" />
    {/* The Fill - set to ~62% for that "not full" look */}
    <div className="h-full bg-white rounded-[1.5px] z-10" style={{ width: '62%' }} />
    {/* The Battery Cap/Nipple */}
    <div className="absolute -right-[3.5px] top-1/2 -translate-y-1/2 w-[1.5px] h-[4.5px] bg-white/60 rounded-r-[1.5px]" />
  </div>
);

const PhonePreview: React.FC<PhonePreviewProps> = ({ appState }) => {
  const { wallpaper, notifications, currentTime, fontSettings, aestheticSettings } = appState;

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
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/25 pointer-events-none z-0" />

        {/* Status Bar */}
        <div className="absolute top-[18px] left-0 right-0 px-9 flex justify-between items-center text-white z-20">
          <span className="text-[15px] font-bold tracking-tight">
            {formattedTime}
          </span>
          <div className="flex items-center gap-1.5">
            <Wifi size={16} strokeWidth={2.5} className="mt-[1px]" />
            <RealisticBattery />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex flex-col h-full pt-20 px-3 pb-10">
          {/* Clock & Date */}
          <div className="flex flex-col items-center mb-8">
            <div className="text-white text-[19px] font-semibold drop-shadow-md mb-2 capitalize tracking-tight">
              {formattedDate}
            </div>
            <h1 
              className="text-white text-[96px] leading-none tracking-tight drop-shadow-xl font-[Inter]"
              style={{ fontWeight: fontSettings.clockWeight }}
            >
              {formattedTime}
            </h1>
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-1 w-full overflow-y-auto no-scrollbar pb-4 mt-2">
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
          <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white rounded-full opacity-90 shadow-sm" />
        </div>
      </div>

      {/* Flashlight & Camera Icons */}
      <div className="absolute inset-0 pointer-events-none z-30">
         <div className="absolute bottom-12 left-12 w-[50px] h-[50px] bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/5 shadow-lg active:scale-95 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6c0 2.21-1.79 4-4 4H10c-2.21 0-4-1.79-4-4V2h12v4z"/><path d="M6 6v5l5 11h2l5-11V6H6z"/></svg>
         </div>
         <div className="absolute bottom-12 right-12 w-[50px] h-[50px] bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/5 shadow-lg active:scale-95 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
         </div>
      </div>

    </div>
  );
};

export default PhonePreview;
