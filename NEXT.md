# NEXT.md - ASL-to-English Translator Project Plan

## 📝 Project Plan: ASL-to-English Translator (Browser-Based React App)

### 🧠 Goal

A browser-based React app that:

- Captures video of the user signing ASL
- Samples frames at 3 fps for up to 30 seconds
- Sends frames to an external LLM (via OpenRouter with user-provided API key)
- Asks the LLM to describe the motion across frames and return an English translation

---

## 🔧 Tech Overview

|Part|Choice|
|---|---|
|Framework|React (hooks, no backend)|
|LLM Access|OpenRouter (user-provided key)|
|Storage|API key stored in `localStorage`|
|Video|Webcam via `getUserMedia()`|
|Sampling|3 fps using `<canvas>` + `<video>`|
|Max Length|30 seconds (~90 frames)|

---

## 🧩 Components & Flow

### 1. **API Key Input**

- Prompt user on first load with a modal
- Input field for OpenRouter API key
- Store in `localStorage`
- Reuse if already stored

---

### 2. **Camera View**

- `<video>` element to display live webcam feed
- Use `facingMode: "user"` by default
- Show camera preview at 640x480 (standard webcam size)

---

### 3. **Recording Flow**

#### Start Recording

- User clicks **Start Recording**
- Begin sampling video at **3 FPS** into a hidden `<canvas>`
- Resize sampled frames to **standard 224x224 or 256x256** (TBD below)
- Store image frames in memory (likely base64 PNGs or JPEGs)
- Automatically stop after **30 seconds** (or when user clicks **Stop**)

#### Stop Recording

- Ends sampling
- Show "Translate" button

---

### 4. **Translation**

- On clicking **Translate**:
    - Build a single prompt with all sampled frames (as image inputs)
    - Send to LLM via OpenRouter using stored API key
    - Prompt instructs the LLM to interpret the **motion/sequence**, not static signs
    - Display result in readable format

---

## 🖼️ Image Sizing Decision

### Recommended: **224×224 or 256×256**

- These are standard for ML models, small enough to minimize bandwidth
- 224x224 is used by ImageNet models (efficient)
- 256x256 balances legibility and size

👉 **Let's go with `256x256`** as default for now — it's a solid choice.

---

## ⚠️ Edge Handling

- If the user tries to record past 30s → auto-stop and notify
- If the browser doesn't support camera access → fallback UI
- If OpenRouter key is invalid → show a warning and re-prompt

---

## 🧪 Prompting Strategy

**System Prompt:**

> You are an expert ASL interpreter. The user has provided a sequence of video frames showing them signing in American Sign Language (ASL). Describe in English what the user is communicating, using the full sequence to interpret meaning.

**User Prompt:**

> These are frames from a recorded ASL gesture. Please translate the motion as a whole into natural English.

(Images would be included in the API call payload alongside this prompt.)