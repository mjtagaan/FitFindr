# FitFindr 🏋️

A modern web application for discovering gyms in the Philippines. Built as a school project showcasing front-end web development skills using pure HTML and CSS.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [File Structure](#file-structure)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage Guide](#usage-guide)

## ✨ Features

### 🔍 Gym Listing
- **Comprehensive List**: Browse a curated list of gyms in Cebu and Bohol.
- **Detailed Cards**: View all gym information at a glance without needing to click through.
- **Visuals**: High-quality thumbnails for each location.

### 📊 Detailed Information
- **Operating Hours**: Clear schedule display for every day of the week.
- **Contact Info**: Phone numbers, emails, and website links.
- **Facilities**: List of available amenities (Parking, WiFi, AC, etc.).
- **Pricing**: Transparent pricing tiers (Daily, Monthly, Membership).

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop.
- **Dark Theme**: Professional dark navy background with electric blue accents.
- **Glassmorphism**: Modern translucent effects.
- **Hover Effects**: Interactive glow and lift animations on cards.

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup and structure.
- **CSS3**: 
  - Flexbox & Grid layouts
  - CSS animations & transitions
  - Custom properties (variables)
  - Media queries for responsiveness

### Libraries
- **Font Awesome 6.0.0**: Icon library
- **Google Fonts**: Inter font family

### No Backend / No JS
This is a static website with hardcoded data—perfect for a school project demonstrating core HTML/CSS skills. It is lightweight, fast, and easy to maintain.

## 📁 File Structure

```
FitFindr/
├── index.html              # Redirects to home.html
├── home.html              # Landing page
├── search.html            # Main gym listing page
├── about.html             # About page
│
├── css/
│   ├── styles.css         # Global styles, header, footer, hero
│   ├── search.css         # Search page specific styles
│   └── about.css          # About page styles
│
├── images/
│   ├── YokoksGymConsolacionThumbnail.jpg
│   ├── HolidayGymAndSpaThumbnail.jpg
│   └── ... (9 gym images total)
│
├── webupdates.txt         # Change log
└── README.md              # This file
```

## 🚀 How It Works

1. **Landing Page**: Start at `home.html` to see the project overview.
2. **Browse Gyms**: Click "Find Your Gym" or "Gyms" in the navigation to go to `search.html`.
3. **View Details**: Scroll through the list. All information (Price, Hours, Location) is visible directly on the card.

## 💿 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mjtagaan/FitFindr.git
   ```
2. Open the folder in VS Code.
3. Open `home.html` in your browser (or use Live Server).

## 📖 Usage Guide

- **For Users**: Simply scroll through the list to find a gym that fits your needs.
- **For Developers**: To add a new gym, copy an existing `.gym-card` block in `search.html` and update the text content. No JavaScript knowledge required!

## 🎨 Design Decisions

### Color Palette
- **Background**: `#0d1829` (Dark blue-gray) - Professional, reduces eye strain
- **Accent**: `#00FF85` (Bright green) - High contrast, energetic, fitness-themed
- **Text**: White with varying opacity for hierarchy

### Typography
- **Font**: Inter - Modern, highly readable, professional
- **Weights**: 300-800 for varied hierarchy
- **Letter spacing**: Tight (-0.01em to -0.03em) for modern look

### Animations
- **Timing**: `cubic-bezier(0.4, 0, 0.2, 1)` - Apple-style smooth transitions
- **Hover effects**: Subtle lift (translateY) + enhanced shadows
- **Page loads**: Fade-in for polished experience

### Responsiveness
- **Desktop**: Full sidebar + grid layout
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Stacked layout, hidden sidebar, touch-friendly buttons

## 👨‍💻 Author

Created as a school project to demonstrate:
- HTML5 semantic markup
- Advanced CSS (Grid, Flexbox, animations)
- Responsive web design
- Code organization and documentation

## 📄 License

This is a school project. Feel free to use as reference or learning material.