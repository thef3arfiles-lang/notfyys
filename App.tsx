
import React, { useState, useEffect } from 'react';
import PhonePreview from './components/PhonePreview';
import ControlPanel from './components/ControlPanel';
import { AppState } from './types';
import { DEFAULT_NOTIFICATIONS, DEFAULT_FONT_SETTINGS, DEFAULT_AESTHETIC_SETTINGS, getRandomWallpaper } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    wallpaper: { url: getRandomWallpaper(), isGenerated: false },
    notifications: DEFAULT_NOTIFICATIONS,
    currentTime: new Date(),
    fontSettings: DEFAULT_FONT_SETTINGS,
    aestheticSettings: DEFAULT_AESTHETIC_SETTINGS
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setAppState(prev => ({
        ...prev,
        currentTime: new Date()
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#050505] overflow-hidden">
      {/* Phone Viewport */}
      <div className="flex-1 h-[55vh] lg:h-full relative flex items-center justify-center p-4 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/[0.03] backdrop-blur-[120px] z-0" />
        <div className="relative z-10 w-full max-w-md scale-[0.85] sm:scale-95 lg:scale-100 transition-all duration-700 ease-out">
           <PhonePreview appState={appState} />
        </div>
      </div>

      {/* Manual Control Panel */}
      <div className="h-[45vh] lg:h-full w-full lg:w-[480px] z-20 shadow-[-15px_0_45px_rgba(0,0,0,0.8)]">
        <ControlPanel appState={appState} setAppState={setAppState} />
      </div>
    </div>
  );
};

export default App;
