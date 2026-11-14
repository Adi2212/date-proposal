# 🌸 Playful Date Proposal Web App 🌸

A delightful, interactive multi-step single-page application built with **React**, **Tailwind CSS**, and **Vite**.

## ✨ Features & Step Flow

1. **Step 1: The Ask**
   - Adorable pug in a cozy striped sweater illustration.
   - Formal serif heading: *"🌸 Will you go on a date with me? 🌸"*
   - **Evasive "NO" Button**: Whenever the cursor hovers or touches near the button, it instantly teleports to a random location across the screen, displaying funny dodging messages (`"Too slow! 😜"`, `"Error 404: NO not found"`, `"Can't touch this! 🕺"`).
   - **"YES ♥" Button**: Triggers a burst of romantic confetti and moves forward.

2. **Step 2: The Surprise**
   - Sponge emoji (🧽) with a playful bouncing animation.
   - Heading: *"WAIT YOU ACTUALLY SAID YES?? 😭"*
   - Subtext: *"I was so ready for you to say no 🙃"*
   - Button: *"okay okay! ➔"*

3. **Step 3: The Scheduling**
   - Heading: *"So... when are you free?"*
   - Interactive date picker (`<input type="date">`).
   - Time picker dropdown with 30-minute intervals (11:30 AM to 10:00 PM).
   - Button: *"set the date! ♥"*

4. **Step 4: The Food Choice**
   - Heading: *"What are we feeling? ✨"*
   - Subtext: *"pick your favorite snack vibe"*
   - **Curated Menu**:
     1. **Pani Puri 🤤**
     2. **Momos 🥟**
     3. **Pasta 🍝**
     4. **Cold Coffee 🧋**
     5. **Pizza 🍕**
     6. **Dahi Papdi Chaat 🥗**
   - Instant selection transition to Step 5.

5. **Step 5: The Flex & Cheesy Note**
   - Heading: *"glad you didn't say no. be ready by 6, I'm coming to get you 🏎️"*
   - **🧀 Cheesy Romantic Note**:
     > *"Are you paneer? Because you make everything butter, and my heart melts every single time you look my way. Normal people just send a text, but you're the sweet chutney to my samosa and the extra cheese on my pizza. See you at 6! 🥰💖"*
   - Button: *"ok I accept ♥"*

6. **Step 6: The Joke Paywall & Receipt**
   - Credit card emoji (💳) & heading: *"one small fee"*.
   - Subtext: *"to confirm your acceptance of this date, please complete the following transaction. totally normal. everyone does this."*
   - Invoice box: *"Date Agreement™"* on the left, **"₹499"** in red text on the right, and *"one-time fee • non-refundable • absolutely worth it"*.
   - Button: *"pay ₹499 & confirm 💖"*
   - **Post-Payment Reveal**: Celebratory mega confetti, official date ticket receipt summarizing the selected Date, Time, Food, Pickup time, and a *"Copy Date Pass"* button!

7. **Sound Effects & Vibe**:
   - Built-in Web Audio API sound generator (no external files needed) for playful pops, chimes, and cha-chings. Includes a mute toggle.
   - Dreamy pastel pink backdrop with floating ambient hearts.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Start the Vite development server
npm run dev

# 3. Open in your browser (usually http://localhost:5173)
```

To build for production:
```bash
npm run build
npm run preview
```
