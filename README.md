# 3D Portfolio Template

A modern, interactive 3D portfolio built with React Three Fiber featuring floating icons, glassmorphic panels, and smooth camera controls. Perfect for showcasing your work with a unique spatial interface inspired by Apple Vision Pro design principles.

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**

### Installation

1. **Clone or download this repository**

   ```bash
   git clone <your-repo-url>
   cd Portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Visit `http://localhost:5173`
   - You should see the 3D portfolio interface!

### Build for Production

```bash
npm run build
```

This creates a `/dist` folder with optimized files ready to deploy to any hosting service (Vercel, Netlify, GitHub Pages, etc.).

---

## ✨ Quick Customization Guide

Want to make this portfolio yours? Follow these steps to personalize it:

### Step 1: Update Your Personal Information

**File:** `src/scene/FloatingIcons.tsx` (around line 1173)

Find the `panelContent` object and replace the content:

```tsx
const panelContent: Record<
  string,
  { image?: string; text?: string; name?: string }
> = {
  Home: {
    name: 'Your Name Here', // 👈 Change this
    image: '/assets/your-photo.png', // 👈 Add your photo (see Step 2)
    text: 'Your bio text here. Write a short introduction about yourself, your background, and what you do.\n\nYou can add multiple paragraphs by using \n\n for line breaks.',
  },
  About: {
    name: 'Your Name Here', // 👈 Change this
    image: '/assets/your-photo.png', // 👈 Same photo or different one
    text: 'More detailed information about yourself, your journey, skills, and interests.',
  },
  Experience: {
    text: 'List your work experience, internships, or projects here.',
  },
  Work: {
    text: 'Showcase your projects, portfolio pieces, or case studies here.',
  },
  Resume: {
    text: 'Add a link to your resume or embed it here. You can also add: "Download my resume: [link]"',
  },
  'Contact Me': {
    text: 'Add your contact information:\nEmail: your.email@example.com\nLinkedIn: linkedin.com/in/yourprofile\nGitHub: github.com/yourusername',
  },
};
```

### Step 2: Add Your Profile Photo

1. **Place your photo** in the `public/assets/` folder

   - Recommended size: 800x800px or larger
   - Formats: PNG, JPG, or WebP
   - Name it something simple like `profile-photo.png`

2. **Update the image path** in `panelContent`:
   ```tsx
   image: '/assets/profile-photo.png'; // Use your filename
   ```

### Step 3: Update Page Title and Meta Tags

**File:** `index.html` (lines 6-20)

```html
<!-- Change these -->
<meta name="description" content="Your description here" />
<meta name="author" content="Your Name" />
<title>Your Name - Portfolio</title>

<!-- Update Open Graph tags for social sharing -->
<meta property="og:title" content="Your Name - Portfolio" />
<meta property="og:description" content="Your description here" />
```

### Step 4: Customize Icon Labels (Optional)

**File:** `src/scene/FloatingIcons.tsx` (around line 1204)

You can change the icon labels or add/remove icons:

```tsx
const icons = [
  {
    position: [0.375, 0.55, 1],
    color: '#FFFFFF',
    iconType: 'person',
    label: 'About',
  },
  {
    position: [0.725, 0.55, 1],
    color: '#FFFFFF',
    iconType: 'folder',
    label: 'Experience',
  },
  {
    position: [0.2, 0.2, 1],
    color: '#FFFFFF',
    iconType: 'briefcase',
    label: 'Work',
  },
  {
    position: [0.55, 0.2, 1],
    color: '#6D8196',
    iconType: 'paper',
    label: 'Resume',
  },
  {
    position: [0.9, 0.2, 1],
    color: '#6D8196',
    iconType: 'envelope',
    label: 'Contact Me',
  },
];
```

**Available icon types:** `'person'`, `'folder'`, `'briefcase'`, `'paper'`, `'envelope'`

### Step 5: Update Social Links (Optional)

**File:** `src/scene/FloatingIcons.tsx` (around line 650-750)

Find the `SocialButton` components and update the links:

```tsx
<SocialButton
  position={[panelPosition[0] - 0.4, panelPosition[1] - 0.25, panelPosition[2] + 0.02]}
  platform="github"
  url="https://github.com/yourusername"  // 👈 Your GitHub URL
/>
<SocialButton
  position={[panelPosition[0] + 0.4, panelPosition[1] - 0.25, panelPosition[2] + 0.02]}
  platform="linkedin"
  url="https://linkedin.com/in/yourprofile"  // 👈 Your LinkedIn URL
/>
```

---

## 🎨 Advanced Customization

### Change Colors

**Icon Colors:** Edit the `color` property in the `icons` array:

```tsx
{ position: [...], color: '#FF6B6B', iconType: 'person', label: 'About' }  // Red icon
```

**Panel Glass Effect:** Edit `src/scene/FloatingIcons.tsx` (around line 663):

```tsx
<meshPhysicalMaterial
  color="#F0F0F0" // Panel tint color
  opacity={0.3} // Transparency (0 = invisible, 1 = opaque)
  transmission={0.6} // Light transmission (0-1)
  roughness={0.4} // Surface roughness (0 = mirror, 1 = matte)
  clearcoat={1.0} // Clear coat layer (0-1)
  ior={1.45} // Index of refraction (glass = 1.45)
/>
```

### Adjust Camera Movement

**File:** `src/scene/HeroStage.tsx` (around line 67-68)

```tsx
const MAX_OFFSET = 0.1; // How much camera moves (increase for more movement)
const EASE = 0.1; // How fast camera responds (higher = faster)
```

### Reposition Icons

**File:** `src/scene/FloatingIcons.tsx` (around line 1204)

The position format is `[X, Y, Z]`:

- **X**: Left (-) to Right (+)
- **Y**: Down (-) to Up (+)
- **Z**: Toward camera (-) to Away (+)

```tsx
{ position: [0.5, 0.5, 1], ... }  // Center of screen
{ position: [0.2, 0.8, 1], ... }  // Top-left
{ position: [0.8, 0.2, 1], ... }  // Bottom-right
```

### Change Panel Size

**File:** `src/scene/FloatingIcons.tsx` (around line 622-623)

```tsx
const panelWidth = 1.0; // Width of panel (increase for wider)
const panelHeight = 0.75; // Height of panel (increase for taller)
```

---

## 📁 Project Structure

```
Portfolio/
├── src/
│   ├── scene/
│   │   ├── FloatingIcons.tsx  # 👈 Main customization file (content, icons)
│   │   ├── HeroStage.tsx      # Camera controls and scene setup
│   │   ├── Environment.tsx    # 3D room environment
│   │   ├── Overlay.tsx        # 2D overlay component
│   │   └── Overlay.css        # Overlay styles
│   ├── App.tsx                # Main React component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── public/
│   └── assets/                # 👈 Put your images here
│       ├── your-photo.png     # Your profile photo
│       └── environment.glb    # 3D room model (optional to replace)
├── index.html                 # 👈 Update title and meta tags
└── package.json               # Dependencies
```

---

## 🎮 How It Works

### Navigation

- **Click any icon** → Opens a panel with your content
- **Click back button** → Returns to icons view
- **Click home toggle** (bottom button) → Switches between home panel and icons
  - 4 squares = Home panel
  - House icon = Icons view

### Camera Controls

- **Move mouse** → Camera follows for parallax effect
- **Click & drag** → Rotate camera around the scene
- **Stop moving** → Camera auto-resets to center after 1 second

---

## 🔧 Tech Stack

- **React 18** + **TypeScript** - Modern UI framework
- **React Three Fiber** - 3D scene management
- **@react-three/drei** - 3D helpers and utilities
- **@react-spring/three** - Smooth animations
- **Three.js** - 3D graphics engine
- **Vite** - Fast build tool

---

## 🐛 Troubleshooting

### "Icons not appearing"

- Make sure you've run `npm install`
- Check browser console for errors (F12)
- Ensure your browser supports WebGL 2.0

### "Photo not showing"

- Check the file path matches exactly (case-sensitive!)
- Make sure the image is in `public/assets/`
- Try refreshing the page (Ctrl+R or Cmd+R)

### "Changes not showing"

- Save all files
- The dev server should auto-refresh
- If not, manually refresh the browser

### "Build fails"

- Delete `node_modules` folder
- Run `npm install` again
- Check Node.js version: `node --version` (should be 18+)

### "Low performance / laggy"

- Close other browser tabs
- Lower shadow quality in `HeroStage.tsx` (line 54-55)
- Reduce `dpr` in `HeroStage.tsx` (line 298): `dpr={[1, 1]}`

---

## 📝 Common Customizations

### Add a New Panel Section

1. Add a new icon in the `icons` array:

```tsx
{ position: [0.5, 0.4, 1], color: '#FFFFFF', iconType: 'folder', label: 'Projects' }
```

2. Add content in `panelContent`:

```tsx
'Projects': {
  text: 'Your projects content here...'
}
```

### Change Background Color

**File:** `src/scene/HeroStage.tsx` (line 313)

```tsx
<color attach="background" args={['#f8f9fa']} /> // Change hex color
```

### Disable Camera Auto-Reset

**File:** `src/scene/HeroStage.tsx` (line 264)

```tsx
resetTimeoutRef.current = setTimeout(() => {
  resetCamera();
}, 1000); // Increase to 999999 to effectively disable
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects Vite - just click "Deploy"!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click "Deploy"

### Deploy to GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json`:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Run: `npm run deploy`

---

## 📄 License

This project is open source and available for personal and commercial use. Feel free to customize it however you'd like!

---

## 🙏 Credits

Built with:

- React Three Fiber
- Three.js
- React Spring
- Vite

Design inspired by Apple Vision Pro interface principles.

---

## 💡 Tips

- **Start simple**: Update the content first, then customize colors and positions
- **Test often**: Save and check your changes in the browser frequently
- **Use browser DevTools**: Right-click → Inspect to debug issues
- **Keep images optimized**: Compress large images before adding them
- **Backup your work**: Commit to Git regularly

**Need help?** Check the code comments in `FloatingIcons.tsx` - they explain what each section does!

---

**Happy customizing! 🎨**
