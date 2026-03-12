# CarrotCash Premium UI Standards

## Color Palette
- **Primary Background:** Deep Teal Gradient (Linear: #004d4d to #001a1a)
- **Accent Color:** Coral Orange (#ff7043) for primary actions and CTA buttons.
- **Surface:** Glassmorphism (rgba(255, 255, 255, 0.05)) with 20px Backdrop Blur.
- **Borders:** Ultra-thin (1px) semi-transparent white (rgba(255, 255, 255, 0.1)).

## Component Guidelines
1. **Cards:** Always use rounded corners (16px to 24px). Must include a subtle inner border for a "lit from above" look.
2. **Typography:** Use white for primary headers. Use a muted teal-gray for secondary labels. Headers should be 'ExtraBold'.
3. **Interactions:** Buttons should have a subtle scale-down effect on press. Use haptic feedback where possible.
4. **Spacing:** Maintain generous negative space (padding: 20px+) to ensure a premium, uncluttered feel.

## Technical Implementation
- Use `expo-linear-gradient` for all screen backgrounds.
- Use `expo-blur` for Glassmorphism effects.
- Use `lucide-react-native` for clean, thin-stroke icons.