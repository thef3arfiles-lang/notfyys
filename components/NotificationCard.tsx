
import React from 'react';
import { NotificationData, FontWeight, AestheticSettings } from '../types';

interface NotificationCardProps {
  data: NotificationData;
  messageFontWeight: FontWeight;
  aesthetics: AestheticSettings;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ data, messageFontWeight, aesthetics }) => {
  const isEmoji = (str: string) => {
    const regex = /\p{Extended_Pictographic}/u;
    return regex.test(str) && str.length <= 4;
  };

  // Only show stack if badge is greater than 1
  const hasStack = data.badge && data.badge > 1;
  const isDataUrl = (url: string) => url.startsWith('data:');

  // Colors based on Dark/Light mode
  const textColor = aesthetics.isDark ? 'text-white' : 'text-black';
  const secondaryTextColor = aesthetics.isDark ? 'text-gray-300' : 'text-gray-500';
  const bgColor = aesthetics.isDark ? 'rgba(30, 30, 30,' : 'rgba(242, 242, 247,'; 

  const cardStyle: React.CSSProperties = {
    backgroundColor: `${bgColor} ${aesthetics.cardOpacity / 100})`,
    backdropFilter: `blur(${aesthetics.blurIntensity}px)`,
    WebkitBackdropFilter: `blur(${aesthetics.blurIntensity}px)`,
  };
  
  const stackStyle: React.CSSProperties = {
    backgroundColor: `${bgColor} ${(aesthetics.cardOpacity * 0.5) / 100})`,
    backdropFilter: `blur(${aesthetics.blurIntensity}px)`,
    WebkitBackdropFilter: `blur(${aesthetics.blurIntensity}px)`,
  };

  return (
    <div className="relative w-full mb-1.5 group select-none">
      
      {/* Visual Stack Effect */}
      {hasStack && (
        <>
            <div 
                className="absolute top-3 left-[8px] right-[8px] h-full rounded-[18px] scale-[0.92] translate-y-2 z-0 shadow-sm border border-white/5" 
                style={stackStyle}
            />
            <div 
                className="absolute top-1.5 left-[4px] right-[4px] h-full rounded-[18px] scale-[0.96] translate-y-1 z-[1] shadow-sm border border-white/5"
                style={stackStyle}
            />
        </>
      )}

      {/* Main Notification Card */}
      <div 
        className="relative z-10 w-full overflow-hidden rounded-[18px] shadow-sm border border-white/10 transition-transform active:scale-[0.99]"
        style={cardStyle}
      >
        <div className="p-3 flex gap-3 items-center">
          
          <div className="relative flex-shrink-0 self-start z-10">
             <div className={`relative w-[34px] h-[34px] overflow-hidden ${data.isContact ? 'rounded-full' : 'rounded-[8px]'}`}>
                {isEmoji(data.icon) ? (
                    <div className="w-full h-full bg-gray-500/20 flex items-center justify-center text-lg">
                        {data.icon}
                    </div>
                ) : (
                    <img 
                        src={data.icon} 
                        alt="Icon" 
                        className="w-full h-full object-cover"
                        {...(!isDataUrl(data.icon) ? { crossOrigin: "anonymous" } : {})}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/34'; }}
                    />
                )}
             </div>
             
             {/* iOS Style Red Notification Counter (Only show if > 0) */}
             {data.badge && data.badge > 0 && (
                 <div className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#ff3b30] text-white text-[10px] font-black flex items-center justify-center rounded-full border border-white/10 shadow-lg z-20">
                     {data.badge}
                 </div>
             )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
             <div className="flex justify-between items-baseline mb-0.5">
                <h3 className={`text-[14px] font-bold leading-tight truncate pr-2 ${textColor}`}>
                   {data.appName}
                </h3>
                <span className={`text-[11px] font-medium ${secondaryTextColor} whitespace-nowrap lowercase tracking-tighter`}>
                   {data.timeAgo}
                </span>
             </div>
             
             <div className="flex gap-3 justify-between items-start">
                <p 
                    className={`text-[13px] leading-snug ${textColor} opacity-90 line-clamp-2`}
                    style={{ fontWeight: messageFontWeight }}
                >
                    {data.message}
                </p>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
