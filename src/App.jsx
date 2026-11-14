import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import PugIllustration from './components/PugIllustration';
import { playPopSound, playSuccessChime, playCashSound } from './utils/sound';
import songUrl from './utils/song.mpeg';

export default function App() {
  // Navigation step state: 1 to 6 (plus step 7 for the completed joke receipt)
  const [step, setStep] = useState(1);

  // Audio / Sound states
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  // State for user choices
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to tomorrow's date formatted YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('7:00 PM');
  const [selectedFood, setSelectedFood] = useState('');
  const [isPaidConfirmed, setIsPaidConfirmed] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Evasive button state
  const [noPosition, setNoPosition] = useState(null); // null when inside flow, {x, y} when teleported
  const [dodgeCount, setDodgeCount] = useState(0);
  const noButtonRef = useRef(null);

  // Initialize background song and attempt play on first user interaction
  useEffect(() => {
    const audio = new Audio(songUrl);
    audio.loop = true;
    audio.volume = 0.55;
    audioRef.current = audio;

    // Autoplay when user touches or clicks anywhere on screen
    const handleFirstGesture = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlayingMusic(true);
          })
          .catch(() => {
            // Browser might still enforce interaction
          });
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Toggle background song playback
  const toggleMusic = (e) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
        })
        .catch((err) => {
          console.error('Audio playback failed:', err);
        });
    }
  };

  // Available 30-minute interval times
  const timeSlots = [
    '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM', '10:00 PM'
  ];

  // Food options: ONLY the requested favorites
  const foodOptions = [
    { id: 'panipuri', name: 'Pani Puri', emoji: '🤤', bg: 'hover:bg-emerald-50 hover:border-emerald-200' },
    { id: 'momos', name: 'Momos', emoji: '🥟', bg: 'hover:bg-rose-50 hover:border-rose-200' },
    { id: 'pasta', name: 'Pasta', emoji: '🍝', bg: 'hover:bg-yellow-50 hover:border-yellow-200' },
    { id: 'coldcoffee', name: 'Cold Coffee', emoji: '🧋', bg: 'hover:bg-amber-50 hover:border-amber-200' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕', bg: 'hover:bg-orange-50 hover:border-orange-200' },
    { id: 'dahipapdichat', name: 'Dahi Papdi Chaat', emoji: '🥗', bg: 'hover:bg-lime-50 hover:border-lime-200' },
  ];

  // Evasive button taunts
  const dodgePhrases = [
    'NO ✖',
    'Nice try! 🏃‍♂️',
    'Nope! 💨',
    'Too slow! 😜',
    'Error 404: NO not found',
    'Physics forbids this 🛑',
    'Can\'t touch this! 🕺',
    'Just click YES! 🥺',
    'Still chasing? 🏎️',
  ];

  // Teleport the NO button to a random position safely on mobile & desktop
  const teleportNoButton = (e) => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    if (soundEffectsEnabled) playPopSound();

    const padding = 16;
    const topPadding = 68; // Safe area below header bar
    const bottomPadding = 56;
    const buttonWidth = 125;
    const buttonHeight = 44;

    const viewportWidth = window.innerWidth || 360;
    const viewportHeight = window.innerHeight || 640;

    const maxX = Math.max(padding, viewportWidth - buttonWidth - padding);
    const maxY = Math.max(topPadding, viewportHeight - buttonHeight - bottomPadding);

    let newX = Math.floor(padding + Math.random() * (maxX - padding));
    let newY = Math.floor(topPadding + Math.random() * (maxY - topPadding));

    // Ensure it doesn't spawn directly under cursor or touch point
    if (e && e.clientX && e.clientY) {
      if (Math.hypot(newX - e.clientX, newY - e.clientY) < 120) {
        newX = (newX + 160) % maxX + padding;
        newY = (newY + 160) % maxY + topPadding;
      }
    }

    setNoPosition({ x: newX, y: newY });
    setDodgeCount((prev) => prev + 1);
  };

  // Launch confetti explosion
  const triggerConfetti = (type = 'standard') => {
    if (type === 'mega') {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff85a1', '#ffb6c1', '#d8b4e2', '#ffe8ee', '#ff69b4', '#ffd700']
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#ff85a1', '#d8b4e2', '#ffd700']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#ff85a1', '#d8b4e2', '#ffd700']
        });
      }, 250);
    } else {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#ff85a1', '#ffb6c1', '#d8b4e2', '#ffd700']
      });
    }
  };

  // Step 1: Click YES
  const handleYes = () => {
    if (soundEffectsEnabled) playSuccessChime();
    triggerConfetti('standard');
    // Ensure music is playing if suspended
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
    setStep(2);
  };

  // Step 2 -> Step 3
  const handleSurpriseNext = () => {
    if (soundEffectsEnabled) playSuccessChime();
    setStep(3);
  };

  // Step 3 -> Step 4
  const handleScheduleNext = () => {
    if (soundEffectsEnabled) playSuccessChime();
    setStep(4);
  };

  // Step 4 -> Step 5
  const handleFoodSelect = (food) => {
    if (soundEffectsEnabled) playSuccessChime();
    setSelectedFood(food.name + ' ' + food.emoji);
    triggerConfetti('standard');
    setStep(5);
  };

  // Step 5 -> Step 6
  const handleFlexAccept = () => {
    if (soundEffectsEnabled) playSuccessChime();
    setStep(6);
  };

  // Step 6: Joke payment confirmation
  const handleConfirmPayment = () => {
    if (soundEffectsEnabled) playCashSound();
    triggerConfetti('mega');
    setIsPaidConfirmed(true);
  };

  // Reset proposal from start
  const handleReset = () => {
    setStep(1);
    setNoPosition(null);
    setDodgeCount(0);
    setIsPaidConfirmed(false);
    setSelectedFood('');
  };

  // Copy agreement text to clipboard
  const handleCopySummary = () => {
    const text = `Official Date Agreement 💌\n✨ Status: Confirmed & Accepted!\n📅 Date: ${selectedDate}\n⌚ Time: ${selectedTime}\n🍽️ Dinner: ${selectedFood || 'Surprise'}\n🏎️ Pickup: 6:00 PM\n💰 Fee: ₹499 (Waived, compliments of the date organizer 💕)`;
    navigator.clipboard?.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  // Background floating decorative hearts
  const floatingHearts = [
    { left: '8%', delay: '0s', duration: '14s', size: '20px' },
    { left: '22%', delay: '3s', duration: '18s', size: '26px' },
    { left: '45%', delay: '1s', duration: '15s', size: '18px' },
    { left: '68%', delay: '4s', duration: '16s', size: '24px' },
    { left: '84%', delay: '2s', duration: '19s', size: '22px' },
    { left: '94%', delay: '6s', duration: '13s', size: '16px' },
  ];

  return (
    <main className="min-h-[100dvh] w-full bg-[#ffe8ee] flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-x-hidden select-none">
      {/* Background ambient gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ffd6e0] via-[#ffe8ee] to-[#ffeff3] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-pink-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Floating decorative ambient hearts */}
      {floatingHearts.map((h, i) => (
        <span
          key={i}
          className="floating-heart text-pink-300/40"
          style={{
            left: h.left,
            animationDelay: h.delay,
            animationDuration: h.duration,
            fontSize: h.size,
          }}
        >
          ❤
        </span>
      ))}

      {/* Top Floating Controls Bar */}
      <header className="fixed top-2.5 sm:top-4 right-2.5 sm:right-4 z-50 flex items-center gap-1.5 sm:gap-2">
        {/* Background Music Toggle Button */}
        <button
          onClick={toggleMusic}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md border transition-all flex items-center gap-1.5 cursor-pointer ${
            isPlayingMusic
              ? 'bg-pink-500 text-white border-pink-400 shadow-pink-300/40'
              : 'bg-white/85 text-pink-800 border-pink-100 hover:bg-white'
          }`}
          title={isPlayingMusic ? 'Pause song' : 'Play song'}
        >
          {isPlayingMusic ? (
            <>
              {/* Mini animated equalizer */}
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-white animate-bounce-subtle rounded-full" />
                <span className="w-0.5 h-2 bg-white animate-pulse rounded-full" />
                <span className="w-0.5 h-3 bg-white animate-bounce-subtle rounded-full" />
              </span>
              <span>Song: Playing 🎵</span>
            </>
          ) : (
            <span>Play Song 🎵</span>
          )}
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={() => setSoundEffectsEnabled(!soundEffectsEnabled)}
          className="bg-white/85 hover:bg-white text-pink-800 text-xs font-medium px-2.5 py-1.5 rounded-full shadow-sm backdrop-blur-md border border-pink-100 transition-all flex items-center gap-1 cursor-pointer"
          title={soundEffectsEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        >
          <span>{soundEffectsEnabled ? '🔊' : '🔇'}</span>
        </button>
      </header>

      {/* Central Interactive Card (Mobile-friendly max height & responsive padding) */}
      <section
        className="bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_60px_-15px_rgba(255,150,175,0.35)] border border-pink-100/80 p-5 sm:p-8 md:p-9 max-w-md w-full relative z-10 transition-all duration-300 ease-out my-auto max-h-[92dvh] overflow-y-auto"
      >
        {/* Step dots indicator */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-2 border-b border-pink-50">
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  step === idx
                    ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-pink-400'
                    : step > idx
                    ? 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-300'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-100'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-pink-400 uppercase">
            {isPaidConfirmed ? 'Completed 💖' : `Step ${step} of 6`}
          </span>
        </div>

        {/* STEP 1: The Ask */}
        {step === 1 && (
          <div className="text-center animate-fade-in flex flex-col items-center">
            {/* Cute Pug in a sweater */}
            <div className="mb-3 sm:mb-4 relative">
              <PugIllustration className="w-24 h-24 sm:w-32 sm:h-32" />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5 shadow-xs border border-pink-100 text-[10px] sm:text-xs">
                🐶✨
              </div>
            </div>

            {/* Formal Serif Heading */}
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800 leading-snug mb-2 sm:mb-3">
              🌸 Will you go on a date with me? 🌸
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 max-w-xs px-2">
              A very formal, highly official and non-binding inquiry.
            </p>

            {/* Buttons Area */}
            <div className="relative w-full flex items-center justify-center gap-3 sm:gap-4 min-h-[52px]">
              {/* Pink YES Button */}
              <button
                type="button"
                onClick={handleYes}
                className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-sm sm:text-base px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-lg hover:shadow-pink-300/40 active:scale-95 transition-all duration-200 cursor-pointer transform hover:scale-105"
              >
                YES ♥
              </button>

              {/* In-flow placeholder when NO is teleported so YES doesn't jump */}
              {noPosition && (
                <div className="w-[105px] sm:w-[120px] h-[44px] rounded-full border border-dashed border-pink-200 flex items-center justify-center text-[10px] sm:text-[11px] text-pink-300 font-medium italic">
                  ran away 🏃💨
                </div>
              )}

              {/* Purple NO Button (In-flow initially) */}
              {!noPosition && (
                <button
                  ref={noButtonRef}
                  type="button"
                  onMouseEnter={teleportNoButton}
                  onTouchStart={teleportNoButton}
                  onClick={teleportNoButton}
                  style={{ touchAction: 'none' }}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
                >
                  NO ✖
                </button>
              )}
            </div>

            {/* Dodging stats hint */}
            {dodgeCount > 0 && (
              <p className="text-[11px] sm:text-[12px] text-pink-500 mt-3 sm:mt-4 animate-fade-in font-medium">
                {dodgeCount === 1 && "Wait, did that button just run away? 😳"}
                {dodgeCount > 1 && dodgeCount < 5 && `Escape attempts: ${dodgeCount} 🏃‍♂️ (You can't catch it!)`}
                {dodgeCount >= 5 && `Still trying? (${dodgeCount} times) The 'NO' button has unlimited stamina 💅`}
              </p>
            )}
          </div>
        )}

        {/* STEP 2: The Surprise */}
        {step === 2 && (
          <div className="text-center animate-fade-in flex flex-col items-center">
            {/* Sponge Emoji with animation */}
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-subtle select-none filter drop-shadow-sm">
              🧽
            </div>

            {/* Formal Heading */}
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-2 sm:mb-3">
              WAIT YOU ACTUALLY SAID YES?? 😭
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-base text-slate-600 mb-6 sm:mb-8 font-medium">
              I was so ready for you to say no 🙃
            </p>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleSurpriseNext}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-sm sm:text-base px-8 py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-pink-300/40 active:scale-95 transition-all duration-200 cursor-pointer transform hover:scale-105"
            >
              okay okay! ➔
            </button>
          </div>
        )}

        {/* STEP 3: The Scheduling */}
        {step === 3 && (
          <div className="text-center animate-fade-in flex flex-col items-center">
            {/* Calendar Icon */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 shadow-xs">
              📅
            </div>

            {/* Heading */}
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 leading-snug mb-1.5 sm:mb-2">
              So... when are you free?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6">
              Lock in a time before reservations fill up!
            </p>

            {/* Form Inputs (with text-base on mobile to avoid iOS Safari auto-zoom) */}
            <div className="w-full space-y-3.5 sm:space-y-4 mb-6 sm:mb-7 text-left">
              {/* Pick a Day */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Pick a Day 📅
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-pink-50/50 border border-pink-200 rounded-xl sm:rounded-2xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all text-base sm:text-sm"
                  required
                />
              </div>

              {/* What Time? */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  What Time? ⌚
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-pink-50/50 border border-pink-200 rounded-xl sm:rounded-2xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all text-base sm:text-sm cursor-pointer"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleScheduleNext}
              className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-sm sm:text-base py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-pink-300/40 active:scale-95 transition-all duration-200 cursor-pointer transform hover:scale-102"
            >
              set the date! ♥
            </button>
          </div>
        )}

        {/* STEP 4: The Food Choice */}
        {step === 4 && (
          <div className="text-center animate-fade-in flex flex-col items-center">
            {/* Food Sparkle Heading */}
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 leading-snug mb-1">
              What are we feeling? ✨
            </h1>
            <p className="text-xs sm:text-sm text-pink-500 font-medium mb-4 sm:mb-5">
              pick your favorite snack vibe
            </p>

            {/* Responsive Grid: 2 columns on mobile, 3 columns on tablet/desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full mb-2">
              {foodOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleFoodSelect(item)}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border border-pink-100 bg-white/80 shadow-xs transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 hover:shadow-md ${item.bg}`}
                >
                  <span className="text-2xl sm:text-3xl mb-1.5 filter drop-shadow-xs">{item.emoji}</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 text-center leading-tight">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2 italic">
              Tap any snack to lock in your feast 🍽️
            </p>
          </div>
        )}

        {/* STEP 5: The Flex & Cheesy Note */}
        {step === 5 && (
          <div className="text-center animate-fade-in flex flex-col items-center">
            {/* Speed Car Badge */}
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 animate-wiggle select-none">
              🏎️💨
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-snug mb-3">
              glad you didn't say no. be ready by 6, I'm coming to get you 🏎️
            </h1>

            {/* Super Cheesy Note */}
            <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 mb-5 sm:mb-7 text-center shadow-xs">
              <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full mb-1.5 border border-amber-300/60">
                <span>🧀 Warning: Maximum Cheese Ahead</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "Are you paneer? Because you make everything butter, and my heart melts every single time you look my way. Normal people just send a text, but you're the sweet chutney to my samosa and the extra cheese on my pizza. See you at 6! 🥰💖"
              </p>
            </div>

            {/* Accept Button */}
            <button
              type="button"
              onClick={handleFlexAccept}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-sm sm:text-base px-8 sm:px-9 py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-pink-300/40 active:scale-95 transition-all duration-200 cursor-pointer transform hover:scale-105"
            >
              ok I accept ♥
            </button>
          </div>
        )}

        {/* STEP 6: The Joke Paywall */}
        {step === 6 && !isPaidConfirmed && (
          <div className="text-center animate-fade-in flex flex-col items-center">
            {/* Credit Card Icon */}
            <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 select-none filter drop-shadow-xs">
              💳
            </div>

            {/* Heading */}
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 leading-snug mb-1.5 sm:mb-2">
              one small fee
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-5 sm:mb-6 px-1">
              to confirm your acceptance of this date, please complete the following transaction. totally normal. everyone does this.
            </p>

            {/* Invoice Box */}
            <div className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4.5 mb-5 sm:mb-6 text-left shadow-xs">
              <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-200">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                  <span className="font-semibold text-slate-800 text-xs sm:text-base">
                    Date Agreement™
                  </span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-red-500 font-mono tracking-tight">
                  ₹499
                </span>
              </div>
              <div className="pt-2 sm:pt-2.5 text-center">
                <span className="text-[10px] sm:text-[11px] text-slate-400 tracking-wide">
                  one-time fee • non-refundable • absolutely worth it
                </span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              type="button"
              onClick={handleConfirmPayment}
              className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-pink-400/40 active:scale-95 transition-all duration-200 cursor-pointer transform hover:scale-102 flex items-center justify-center gap-2"
            >
              <span>pay ₹499 & confirm 💖</span>
            </button>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2">
              100% Secure • Guaranteed best date ever
            </p>
          </div>
        )}

        {/* STEP 6 (Post-Payment Reveal: The Official Receipt) */}
        {step === 6 && isPaidConfirmed && (
          <div className="text-center animate-scale-in flex flex-col items-center">
            <div className="text-4xl sm:text-5xl mb-2 animate-bounce-subtle">
              🎉💖
            </div>
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-1">
              IT'S OFFICIAL!
            </h1>
            <p className="text-xs sm:text-sm text-pink-600 font-medium mb-3 sm:mb-4">
              Payment processed: ₹0.00 (It's on me ❤️)
            </p>

            {/* Date Ticket / Receipt Summary */}
            <div className="w-full bg-gradient-to-br from-pink-50/80 to-purple-50/60 border border-pink-200 rounded-2xl p-3.5 sm:p-4.5 mb-4 sm:mb-5 text-left text-xs sm:text-sm space-y-2 sm:space-y-2.5 shadow-inner">
              <div className="flex justify-between border-b border-pink-100 pb-1.5 sm:pb-2">
                <span className="text-slate-500">📅 Date:</span>
                <span className="font-bold text-slate-800">{selectedDate}</span>
              </div>
              <div className="flex justify-between border-b border-pink-100 pb-1.5 sm:pb-2">
                <span className="text-slate-500">⌚ Time:</span>
                <span className="font-bold text-slate-800">{selectedTime}</span>
              </div>
              <div className="flex justify-between border-b border-pink-100 pb-1.5 sm:pb-2">
                <span className="text-slate-500">🍽️ Dinner Vibe:</span>
                <span className="font-bold text-slate-800">{selectedFood || 'Surprise treat'}</span>
              </div>
              <div className="flex justify-between border-b border-pink-100 pb-1.5 sm:pb-2">
                <span className="text-slate-500">🏎️ Pickup:</span>
                <span className="font-bold text-slate-800">6:00 PM Sharp</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-500">✨ Contract:</span>
                <span className="font-bold text-emerald-600">Locked in, no takebacks!</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={handleCopySummary}
                className="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-full transition-all cursor-pointer"
              >
                {copiedNotice ? '✓ Copied to clipboard!' : '📋 Copy Date Pass'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-full transition-all cursor-pointer"
              >
                🔄 Replay
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Footer playful credit */}
      <footer className="mt-4 sm:mt-6 text-[10px] sm:text-[11px] text-pink-700/60 tracking-wider font-medium text-center relative z-10 px-2">
        Handcrafted with ❤️ & Tailwind CSS • Non-refundable smiles
      </footer>

      {/* Evasive Teleported "NO" Button (Rendered with fixed coordinates when teleported) */}
      {step === 1 && noPosition && (
        <button
          type="button"
          onMouseEnter={teleportNoButton}
          onTouchStart={teleportNoButton}
          onClick={teleportNoButton}
          style={{
            position: 'fixed',
            top: `${noPosition.y}px`,
            left: `${noPosition.x}px`,
            zIndex: 9999,
            touchAction: 'none',
            userSelect: 'none',
            transition: 'top 0.15s cubic-bezier(0.18, 0.89, 0.32, 1.28), left 0.15s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
          }}
          className="bg-purple-200 hover:bg-purple-300 text-purple-900 font-semibold text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg border-2 border-purple-300/80 cursor-pointer select-none animate-wiggle"
        >
          {dodgePhrases[Math.min(dodgeCount, dodgePhrases.length - 1)]}
        </button>
      )}
    </main>
  );
}
