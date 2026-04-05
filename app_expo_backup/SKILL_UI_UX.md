# Agent Skill: High-End React Native UI/UX (Design+Code Standard)

## 1. Visual Language & Glassmorphism
- **Glass Effects:** Use `LinearGradient` from `expo-linear-gradient` for all card backgrounds.
- **Frosting:** Implement "Defrost" components with `backdrop-filter: blur(16px) saturate(180%)` for premium depth.
- **Borders:** Use a 1px solid border with 10% white opacity (`rgba(255,255,255,0.1)`) to create a "tactile edge".

## 2. Animation Engine (Reanimated + Gestures)
- **Entrance:** Every screen must have a "Smooth Entrance" animation (fade + slight scale up).
- **Interactions:** Use `react-native-gesture-handler` for interactive modals and drag-to-dismiss gestures.
- **Transitions:** Use `Shared Element Transitions` or `Layout Animations` for screen navigation.

## 3. The "Bento Grid" Layout Logic
- **Modular Design:** Use a Bento Grid for dashboard features to ensure scannability.
- **Visual Hierarchy:** The most important data (e.g., Total Revenue) must have the largest box (2x2 or 3x2).
- **Spacing:** Maintain strict compartmentalization with clearly defined visual boundaries between boxes.

## 4. Machine Experience (MX) UI
- **Activity Logs:** Instead of loading spinners, show a "Machine Learning Prediction" or "Agent Activity" status.
- **Feedback:** Provide immediate visual feedback (isAutoSet toggles) when the agent modifies financial data.

## 5. Technical Requirements
- **Stack:** Expo SDK 55, Expo Router, NativeWind v5, Reanimated v3.
- **Performance:** Use `FlatList` with optimized `renderItem` for all financial history lists.
- **State:** Manage persistent UI states (like Temperature/Finance settings) with React Context and AsyncStorage.