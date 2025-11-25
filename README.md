# FitFindr 🏋️

A modern web application for discovering and comparing gyms in Cebu and Bohol, Philippines. Built as a school project showcasing front-end web development skills.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [File Structure](#file-structure)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Code Documentation](#code-documentation)

## ✨ Features

### 🔍 Search & Filter
- **Text Search**: Find gyms by name or location
- **City Filter**: Filter by Cebu or Bohol
- **Price Range**: Adjust slider to filter by monthly membership cost (₱500 - ₱5000)
- **Amenities**: Filter by parking, pool, classes, sauna, trainers, 24/7 access
- **Ratings**: Filter by star ratings (3.0+, 4.0+, 4.5+)
- **Operating Hours**: Filter by 24/7 access or specific time ranges

### 📊 Compare Feature
- Select up to 3 gyms for side-by-side comparison
- Compare: location, ratings, hours, contact info, facilities, and pricing
- Floating comparison bar shows selected gyms
- One-click clear or individual gym removal

### 🗺️ Interactive Map
- Toggle between list view and map view
- Color-coded markers (green for Cebu, red for Bohol)
- Clickable markers with gym information popups
- Accurate coordinates for all 9 gyms

### 📱 Gym Details Modal
- Comprehensive gym information in a beautiful popup
- Image gallery
- Operating hours schedule
- Contact information (phone, email, website)
- Full facilities list with icons
- All pricing tiers
- Individual location map for each gym

### 🎨 Modern UI/UX
- Professional gradient designs
- Smooth animations and transitions
- Glassmorphism effects (blur + transparency)
- Responsive design for mobile, tablet, and desktop
- Dark theme with bright green accents

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: 
  - Flexbox & Grid layouts
  - CSS animations & transitions
  - Custom properties (variables)
  - Media queries for responsiveness
- **JavaScript (ES6+)**:
  - DOM manipulation
  - Event handling
  - Array methods (map, filter, reduce)
  - LocalStorage for comparison state

### Libraries
- **Font Awesome 6.0.0**: Icon library
- **Leaflet.js 1.9.4**: Interactive maps
- **OpenStreetMap**: Map tile provider
- **Google Fonts**: Inter font family

### No Backend
This is a static website with hardcoded data—perfect for a school project demonstrating front-end skills without requiring a server or database.

## 📁 File Structure

```
FitFindr/
├── index.html              # Redirects to home.html
├── home.html              # Landing page
├── search.html            # Main gym search page
├── about.html             # About page
│
├── css/
│   ├── styles.css         # Global styles, header, footer, hero
│   ├── search.css         # Search page specific styles
│   └── about.css          # About page styles
│
├── js/
│   └── search.js          # All JavaScript functionality
│
├── images/
│   ├── YokoksGymConsolacionThumbnail.jpg
│   ├── HolidayGymAndSpaThumbnail.jpg
│   └── ... (9 gym images total)
│
├── webupdates.txt         # Change log
└── README.md              # This file
```

## 🔧 How It Works

### 1. Data Structure (`search.js`)

All gym data is stored in the `gymDetails` object:

```javascript
const gymDetails = {
    'gym-id': {
        name: 'Gym Name',
        image: 'path/to/image.jpg',
        rating: 4.5,
        reviewCount: '(200 reviews)',
        location: 'Full Address',
        coordinates: { lat: 10.xxxx, lng: 123.xxxx },
        description: '...',
        hours: {
            'Monday - Friday': '6:00 AM - 10:00 PM',
            // ...
        },
        contact: {
            phone: '(032) xxx-xxxx',
            email: 'email@gym.com',
            website: 'www.gym.com'
        },
        facilities: [
            { icon: 'fa-icon-name', name: 'Facility Name' },
            // ...
        ],
        pricing: [
            { duration: 'Monthly', amount: '₱2,000', period: 'per month' },
            // ...
        ]
    }
}
```

### 2. Filtering System

The `filterGyms()` function runs whenever:
- User types in search box
- City dropdown changes
- Price slider moves
- Any checkbox is clicked

It checks each gym card against all active filters and shows/hides cards accordingly.

### 3. Comparison Feature

**Process:**
1. User clicks "Compare" checkbox on gym cards
2. `toggleCompare(gymId)` adds gym to `selectedGyms` array (max 3)
3. `updateComparisonBar()` shows floating bar with selected gyms
4. Click "Compare" button → `openComparison()` generates side-by-side table
5. Data pulled from `gymDetails` object and displayed in modal

### 4. Map Integration

**Leaflet.js Implementation:**
- Map initialized on first "Map View" click (lazy loading)
- Uses OpenStreetMap tiles (free, no API key needed)
- Each gym gets a custom marker with:
  - Color coding (Cebu = green, Bohol = red)
  - Dumbbell icon
  - Popup with gym info and "View Details" button

### 5. Modal System

**Two Modal Types:**

1. **Gym Details Modal** (`openModal(gymId)`):
   - Fetches data from `gymDetails` object
   - Dynamically generates HTML for hours, contact, facilities, pricing
   - Creates individual Leaflet map for the gym

2. **Comparison Modal** (`openComparison()`):
   - Loops through `selectedGyms` array
   - Creates table with all gyms side-by-side
   - Synchronized scrolling for easy comparison

## 💻 Installation

### Option 1: Direct File Opening
1. Download/clone this repository
2. Open `home.html` in any modern web browser

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Then visit: http://localhost:8000
```

### Option 3: Live Server (VS Code)
1. Install "Live Server" extension in VS Code
2. Right-click `home.html` → "Open with Live Server"

## 📖 Usage Guide

### For Users

1. **Browse Gyms**
   - Visit the search page
   - Scroll through all gyms in grid layout
   - Click "View Details" for comprehensive information

2. **Filter Results**
   - Use sidebar filters on the left
   - Combine multiple filters for specific needs
   - Click "Clear All" to reset filters

3. **Compare Gyms**
   - Check the "Compare" box on 2-3 gym cards
   - Click green "Compare" button in floating bar
   - Review side-by-side comparison table
   - Click "View Full Details" to see individual gym modals

4. **Map View**
   - Click "Map View" button at top
   - Click markers to see gym information
   - Click "View Details" in popup for full modal

### For Developers

**Key Functions to Understand:**

- `filterGyms()` - Main filtering logic
- `openModal(gymId)` - Opens gym detail popup
- `toggleCompare(gymId)` - Handles comparison selection
- `openComparison()` - Generates comparison table
- `initializeMap()` - Creates Leaflet map with markers

**Adding a New Gym:**

1. Add entry to `gymDetails` object in `search.js`
2. Add HTML card in `search.html` (copy existing structure)
3. Set `data-gym-id`, `data-city`, `data-price`, `data-rating` attributes
4. Add gym image to `/images/` folder
5. Update coordinates for accurate map placement

**Modifying Filters:**

- **Add amenity**: Add checkbox in HTML + update `filterGyms()` logic
- **Change price range**: Modify `max` attribute on price slider
- **Add new filter category**: Create new filter group in sidebar HTML + add filtering logic

## 📚 Code Documentation

### JavaScript Functions

#### Filtering
- `filterGyms()` - Main function that applies all filters
- Updates result count dynamically

#### Modal Management
- `openModal(gymId)` - Shows gym details popup
- `closeModal()` - Hides modal and restores scrolling

#### Comparison
- `toggleCompare(gymId)` - Add/remove gym from comparison
- `updateComparisonBar()` - Updates floating bar UI
- `openComparison()` - Generates comparison table
- `closeComparison()` - Closes comparison modal
- `clearComparison()` - Removes all selected gyms

#### Map
- `toggleView(view)` - Switches between list/map view
- `initializeMap()` - Creates Leaflet map with markers

### CSS Structure

#### `styles.css` (Global)
- CSS Reset
- Typography (Inter font)
- Header & Navigation
- Hero Section
- Feature Cards
- Footer
- Responsive breakpoints

#### `search.css` (Search Page)
- Search header & inputs
- Filters sidebar
- Gym result cards
- Modal styling
- Comparison table
- Map container
- Mobile responsive adjustments

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

## 🐛 Known Limitations

1. **Static Data**: No backend—all data hardcoded in JavaScript
2. **No Real Reviews**: Review counts and ratings are placeholders
3. **No Booking System**: "Book a Visit" shows alert (feature not implemented)
4. **Limited Gyms**: Only 9 gyms (can easily add more)
5. **No User Accounts**: No favorites, saved searches, or personalization

## 🚀 Future Enhancements

- [ ] Backend integration with database
- [ ] Real user reviews and ratings
- [ ] Booking/reservation system
- [ ] User accounts with favorites
- [ ] Dark mode toggle
- [ ] Image galleries (multiple photos per gym)
- [ ] Distance calculation from user location
- [ ] Route directions to gym
- [ ] Social sharing features

## 👨‍💻 Author

Created as a school project to demonstrate:
- HTML5 semantic markup
- Advanced CSS (Grid, Flexbox, animations)
- Vanilla JavaScript (no frameworks)
- Third-party library integration (Leaflet.js)
- Responsive web design
- Code organization and documentation

## 📄 License

This is a school project. Feel free to use as reference or learning material.

---

**Made with 💪 for fitness enthusiasts in Cebu and Bohol**
