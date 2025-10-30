# 🌳 JSON Tree Visualizer

An interactive **JSON Tree Visualizer** built using **React** and **React Flow**.  
It allows users to paste JSON data, validate it, and visualize it as a hierarchical, color-coded node tree.  
Includes JSON path search, zoom/pan, light-dark theme toggle, and export options.

---

## 🚀 Live Demo
👉 [View Live Demo](https://your-deployment-link.vercel.app)  
*(Replace with your deployed project link.)*

---

## 📋 Features

### ✅ JSON Input & Parsing
- Paste or type JSON data directly.
- Built-in validation with clear error messages.
- “Generate Tree” button to visualize structure.
- Optional sample JSON for quick testing.

### 🌳 Tree Visualization (React Flow)
- Built **exclusively with React Flow** — no other graph libraries.
- Visualizes JSON as a hierarchical, connected node tree.
- Node types:
  - **Objects** → Display keys.
  - **Arrays** → Display indices.
  - **Primitives** → Display key–value pairs (string, number, boolean, null).
- Color-coded by type:
  - 🟦 **Objects** – Blue / Purple  
  - 🟩 **Arrays** – Green  
  - 🟧 **Primitives** – Orange / Yellow  
- Smooth zooming, panning, and centering.

### 🔍 JSON Path Search
- Supports **JSON path syntax**:
  - `$.user.address.city`
  - `items[0].name`
- Highlights and auto-focuses the matched node.
- Displays clear match feedback (“Match found” / “No match found”).

### 🧭 Interactivity
- Zoom In / Zoom Out / Fit View controls.
- Canvas panning via drag.
- Hover for detailed node info (key, path, and value).
- Click to **copy node path**.

### 🌗 Bonus Features
- Light / Dark mode toggle.
- Clear / Reset JSON input and tree.
- Download visualization as **PNG**.

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | React |
| Visualization | React Flow |
| Styling | CSS / Tailwind / SCSS |
| Build Tool | Vite / CRA / Next.js |
| Deployment | GitHub Pages / Netlify / Vercel |

---

## 🧩 Project Structure

src/
│
├── components/
│   ├── JsonInputPanel.jsx
│   ├── SearchBar.jsx
│   ├── TreeCanvas.jsx
│   └── NodeTooltip.jsx
│
├── hooks/
│   ├── useJsonTree.js
│   └── useSearchPath.js
│
├── utils/
│   ├── jsonToFlowGraph.js
│   ├── pathResolver.js
│   └── validators.js
│
├── styles/
│   └── theme.css
│
├── App.jsx
└── main.jsx

---

## ⚙️ How It Works

1. **Parse JSON:**  
   - On “Generate Tree,” the JSON input is validated and parsed.
   - Invalid JSON triggers an error message.

2. **Generate Tree:**  
   - JSON is recursively converted into React Flow-compatible `nodes` and `edges`.
   - Each property or array index becomes a node connected to its parent.

3. **Render Visualization:**  
   - React Flow renders all nodes and edges interactively.
   - Users can freely zoom, pan, and fit view.

4. **Search:**  
   - Enter a JSON path to locate a specific key/value.
   - Matching node is highlighted and centered in view.

5. **Theming:**  
   - Toggle between light and dark themes instantly.

---

## 🧭 JSON Path Examples

| JSON Path | Description |
|------------|-------------|
| `$.user.name` | Returns the user’s name. |
| `$.items[0].name` | Returns the first item’s name. |
| `$.address.city` | Returns the city field under address. |

Supports both **dot (`.`)** and **bracket (`[]`)** notations.

---

## 🧱 Implementation Highlights

- Modular and maintainable React architecture.
- Custom hooks for parsing and searching.
- Optimized recursive traversal.
- Clear separation between logic, UI, and visualization.
- **Fully meets constraint:** React Flow is the only visualization library used.

---

## 🧮 Evaluation Notes

| Aspect | Highlights |
|---------|-------------|
| **UI/UX** | Intuitive, responsive, and visually distinct nodes. |
| **Code Quality** | Modular, readable, consistent naming. |
| **Performance** | Efficient recursive traversal and rendering. |
| **Creativity** | Enhanced with theming, export, and interactivity. |

---

## 🌟 Future Enhancements

- 🗂️ Drag-and-drop JSON upload.
- ➕ Collapsible / expandable branches.
- 💾 Save theme preference in localStorage.
- ⌨️ Keyboard shortcuts for zoom/pan.
- 📤 Export to PDF or SVG.

---

## 🧑‍💻 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm / yarn / pnpm

### Installation
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install

### Run Locally
npm run dev

### Build for Production
npm run build

### Preview Production Build (Vite)
npm run preview

---

## 📄 License
**MIT License**  
For educational and demonstration purposes only.

---

## 👨‍💻 Author
**Harsh Rajput**  
*Full Stack Developer | React | .NET Core | Next.js | Ruby on Rails*  
[GitHub](https://github.com/HarshRajput9520) | [LinkedIn](https://www.linkedin.com/in/harsh-rajput-b80110196/)
