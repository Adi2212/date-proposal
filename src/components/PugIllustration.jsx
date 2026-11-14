import React from 'react';

export default function PugIllustration({ className = "w-28 h-28" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform hover:scale-105 duration-300"
      >
        {/* Soft background glow */}
        <circle cx="100" cy="100" r="90" fill="#FFF0F3" />
        
        {/* Cozy Pug Sweater / Shirt */}
        <path
          d="M60 135 C60 115, 80 108, 100 108 C120 108, 140 115, 140 135 L145 185 C145 190, 135 195, 100 195 C65 195, 55 190, 55 185 Z"
          fill="#FF85A1"
        />
        {/* Sweater stripes */}
        <path d="M62 135 Q100 145 138 135" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <path d="M58 150 Q100 162 142 150" stroke="#FFE3EB" strokeWidth="4" strokeLinecap="round" />
        <path d="M56 165 Q100 178 144 165" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <path d="M56 180 Q100 192 144 180" stroke="#FFE3EB" strokeWidth="4" strokeLinecap="round" />
        
        {/* Sweater Turtleneck Collar */}
        <ellipse cx="100" cy="115" rx="34" ry="12" fill="#FF6B8B" />
        <ellipse cx="100" cy="113" rx="30" ry="9" fill="#FFA3BA" />

        {/* Pug Ears */}
        {/* Left Ear */}
        <path
          d="M56 50 C45 35, 30 50, 42 75 C48 85, 60 78, 62 65 Z"
          fill="#3E2723"
        />
        {/* Right Ear */}
        <path
          d="M144 50 C155 35, 170 50, 158 75 C152 85, 140 78, 138 65 Z"
          fill="#3E2723"
        />

        {/* Pug Head */}
        <ellipse cx="100" cy="74" rx="46" ry="38" fill="#E8C39E" />
        
        {/* Forehead Wrinkles */}
        <path d="M88 48 Q100 44 112 48" stroke="#B28258" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M85 54 Q100 50 115 54" stroke="#B28258" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M92 41 Q100 38 108 41" stroke="#B28258" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Pug Muzzle / Black Mask */}
        <ellipse cx="100" cy="84" rx="26" ry="19" fill="#3D2821" />

        {/* Muzzle wrinkles */}
        <path d="M90 73 Q100 70 110 73" stroke="#251611" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Big Glossy Pug Eyes */}
        {/* Left Eye */}
        <circle cx="75" cy="68" r="9.5" fill="#1A110E" />
        <circle cx="73" cy="65" r="3.2" fill="#FFFFFF" />
        <circle cx="77" cy="71" r="1.3" fill="#FFFFFF" />

        {/* Right Eye */}
        <circle cx="125" cy="68" r="9.5" fill="#1A110E" />
        <circle cx="123" cy="65" r="3.2" fill="#FFFFFF" />
        <circle cx="127" cy="71" r="1.3" fill="#FFFFFF" />

        {/* Cute Nose */}
        <path
          d="M93 78 C93 75, 107 75, 107 78 C107 83, 102 86, 100 86 C98 86, 93 83, 93 78 Z"
          fill="#110B09"
        />
        {/* Nostrils */}
        <circle cx="97" cy="80" r="1.2" fill="#2B1D19" />
        <circle cx="103" cy="80" r="1.2" fill="#2B1D19" />

        {/* Mouth line */}
        <path d="M100 86 L100 90" stroke="#110B09" strokeWidth="1.8" />
        <path d="M94 90 Q100 93 106 90" stroke="#110B09" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Pink Blep / Tongue */}
        <path
          d="M96 91 C96 91, 95 100, 100 100 C105 100, 104 91, 104 91 Z"
          fill="#FF7290"
        />
        <path d="M100 92 L100 97" stroke="#E6496C" strokeWidth="1" strokeLinecap="round" />

        {/* Rosy Cheeks */}
        <circle cx="63" cy="82" r="6" fill="#FFA5BA" fillOpacity="0.45" />
        <circle cx="137" cy="82" r="6" fill="#FFA5BA" fillOpacity="0.45" />

        {/* Tiny heart on sweater */}
        <path
          d="M100 148 C97 143, 91 144, 91 148 C91 153, 100 158, 100 158 C100 158, 109 153, 109 148 C109 144, 103 143, 100 148 Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}
