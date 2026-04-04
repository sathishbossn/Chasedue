# Design Skill: Anthropic Glassmorphism (2026 Edition)

## 1. The "Atmosphere" (Backgrounds)
- **Primary Base:** `#141413` (Anthropic Dark).
- **Secondary Base:** `#FAF9F5` (Anthropic Light).
- **Aura Glows:** Use radial gradients in the corners. 
  - `background: radial-gradient(circle at top right, rgba(217, 119, 87, 0.08), transparent 40%)`

## 2. The "Glass" Utility (Cards & Modals)
All cards must follow these strict rules to achieve the "2026 Depth":
- **Background:** `rgba(255, 255, 255, 0.03)` for dark mode, `rgba(255, 255, 255, 0.6)` for light mode.
- **Blur:** `backdrop-filter: blur(24px) saturate(180%)`.
- **Border:** `1px solid rgba(255, 255, 255, 0.08)`.
- **Inner Glow:** `box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05)`.

## 3. The "Product Showcase" (3D Perspective)
- **Transform:** Main dashboard previews must be tilted.
  - `transform: perspective(1200px) rotateX(10deg) rotateY(-10deg) rotateZ(2deg)`.
- **Shadow:** Use a "Long Shadow" effect: `box-shadow: -20px 40px 80px rgba(0,0,0,0.5)`.

## 4. Typography (The Anthropic Look)
- **Headings:** `Poppins` (Tight tracking: `-0.02em`). 
- **Accent Text:** `Lora` (Italicized for technical notes or quotes).
- **Color Contrast:** Use `#B0AEA5` (Mid Gray) for subheaders to make the White headings pop.

## 5. Micro-Interactions
- **Hover:** Cards should "lift" and the border opacity should increase from `0.08` to `0.2`.
- **Buttons:** Anthropic Orange (`#D97757`) with a 15px outer blur glow on hover.