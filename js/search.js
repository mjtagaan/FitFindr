/**
 * FitFindr - Search and Filter Functionality
 * 
 * This file handles:
 * - Dynamic gym filtering by name, location, price, amenities, ratings, and hours
 * - Gym comparison feature (up to 3 gyms side-by-side)
 * - Interactive map display with gym location markers
 * - Modal pop-ups with detailed gym information
 * 
 * Data Structure:
 * - gymDetails: Object containing comprehensive information for all 9 gyms
 * - Each gym includes: name, images, ratings, location, coordinates, hours,
 *   contact info, facilities, pricing tiers, and descriptions
 */

// ============================================
// PRICE RANGE FILTER
// ============================================

// Update price display in real-time as user adjusts slider
const priceRange = document.getElementById('priceRange');
const maxPrice = document.getElementById('maxPrice');

if (priceRange) {
    priceRange.addEventListener('input', function() {
        const price = parseInt(this.value);
        maxPrice.textContent = '₱' + price.toLocaleString();
        filterGyms(); // Re-filter gyms whenever price changes
    });
}

// ============================================
// MAIN FILTERING FUNCTION
// ============================================

/**
 * filterGyms()
 * 
 * Main function that filters gym cards based on multiple criteria:
 * - Search text (matches gym name or description)
 * - City location (Cebu or Bohol)
 * - Price range (monthly membership cost)
 * - Amenities (parking, pool, classes, etc.)
 * - Star ratings (3.0+, 4.0+, etc.)
 * - Operating hours (24/7 or specific times)
 * 
 * Shows/hides gym cards dynamically and updates the results count
 */
function filterGyms() {
    // Get all current filter values
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const cityFilter = document.getElementById('cityFilter').value.toLowerCase();
    const priceLimit = parseInt(document.getElementById('priceRange').value);
    
    // Get checked amenities
    const selectedAmenities = Array.from(document.querySelectorAll('.amenity-filters input:checked'))
        .map(checkbox => checkbox.value);
    
    // Get checked ratings
    const selectedRatings = Array.from(document.querySelectorAll('.rating-filters input:checked'))
        .map(checkbox => parseFloat(checkbox.value));
    
    // Get checked hours
    const selectedHours = Array.from(document.querySelectorAll('.hours-filters input:checked'))
        .map(checkbox => checkbox.value);
    
    const gymCards = document.querySelectorAll('.gym-result-card');
    let visibleCount = 0;
    
    gymCards.forEach(card => {
        const city = card.dataset.city || '';
        const price = parseInt(card.dataset.price) || 0;
        const rating = parseFloat(card.dataset.rating) || 0;
        const name = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.gym-description').textContent.toLowerCase();
        
        // Get gym amenities from the card
        const gymAmenitiesContainer = card.querySelector('.gym-amenities');
        const gymAmenities = [];
        
        if (gymAmenitiesContainer) {
            // Check for each amenity type in the gym's amenity tags
            const amenityTags = gymAmenitiesContainer.querySelectorAll('.amenity-tag');
            amenityTags.forEach(tag => {
                const tagText = tag.textContent.toLowerCase();
                if (tagText.includes('pool')) gymAmenities.push('pool');
                if (tagText.includes('sauna')) gymAmenities.push('sauna');
                if (tagText.includes('parking')) gymAmenities.push('parking');
                if (tagText.includes('classes')) gymAmenities.push('classes');
                if (tagText.includes('trainer')) gymAmenities.push('trainer');
                if (tagText.includes('24/7')) gymAmenities.push('24h');
            });
        }
        
        // Check all filter conditions
        let matchesSearch = searchInput === '' || name.includes(searchInput) || description.includes(searchInput);
        let matchesCity = cityFilter === '' || city === cityFilter;
        let matchesPrice = price <= priceLimit;
        let matchesRating = selectedRatings.length === 0 || selectedRatings.some(minRating => rating >= minRating);
        
        // Check if gym has all selected amenities
        let matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(amenity => gymAmenities.includes(amenity));
        
        // Check if gym has selected hours
        let matchesHours = selectedHours.length === 0 || selectedHours.every(hour => gymAmenities.includes(hour));
        
        // Show/hide card
        if (matchesSearch && matchesCity && matchesPrice && matchesRating && matchesAmenities && matchesHours) {
            card.style.display = 'grid';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update count
    document.getElementById('gymCount').textContent = visibleCount;
}

// Sort gyms
function sortGyms() {
    const sortBy = document.getElementById('sortBy').value;
    const resultsContainer = document.getElementById('gymResults');
    const gymCards = Array.from(document.querySelectorAll('.gym-result-card'));
    
    gymCards.sort((a, b) => {
        switch(sortBy) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'rating':
                return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            case 'distance':
                // Extract distance from location text
                const distanceA = parseFloat(a.querySelector('.gym-location span').textContent);
                const distanceB = parseFloat(b.querySelector('.gym-location span').textContent);
                return distanceA - distanceB;
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    gymCards.forEach(card => resultsContainer.appendChild(card));
}

// Clear all filters
function clearFilters() {
    // Reset search input
    document.getElementById('searchInput').value = '';
    document.getElementById('cityFilter').value = '';
    
    // Reset price slider
    document.getElementById('priceRange').value = 4000;
    document.getElementById('maxPrice').textContent = '₱4,000';
    
    // Uncheck all checkboxes
    document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Show all gyms
    document.querySelectorAll('.gym-result-card').forEach(card => {
        card.style.display = 'grid';
    });
    
    // Reset count
    document.getElementById('gymCount').textContent = document.querySelectorAll('.gym-result-card').length;
}

// Add event listeners to filter checkboxes
document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterGyms);
});

// Search input listener with debounce
let searchTimeout;
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(filterGyms, 300);
    });
}

// City filter listener
const cityFilter = document.getElementById('cityFilter');
if (cityFilter) {
    cityFilter.addEventListener('change', filterGyms);
}

// Initialize gym count
document.addEventListener('DOMContentLoaded', function() {
    const totalGyms = document.querySelectorAll('.gym-result-card').length;
    document.getElementById('gymCount').textContent = totalGyms;
});

// ============================================
// GYM DATABASE
// ============================================

/**
 * gymDetails Object
 * 
 * Comprehensive database containing detailed information for all 9 gyms.
 * 
 * Structure for each gym:
 * - name: Full gym name
 * - image: Path to thumbnail image
 * - rating: Star rating (0-5)
 * - reviewCount: Number of reviews (display string)
 * - location: Full address
 * - coordinates: { lat, lng } for map markers
 * - description: Detailed gym description
 * - hours: Object with day ranges as keys, time strings as values
 * - contact: { phone, email, website }
 * - facilities: Array of { icon, name } objects for amenities
 * - pricing: Array of { duration, amount, period } for membership tiers
 */
const gymDetails = {
    'yokoks-consolacion': {
        name: 'Yokoks Gym Consolacion',
        image: 'images/YokoksGymConsolacionThumbnail.jpg',
        rating: 3.0,
        reviewCount: '(45 reviews)',
        location: 'Cansaga, Consolacion, Cebu',
        coordinates: { lat: 10.3767, lng: 123.9563 },
        description: 'Yokoks Gym Consolacion is a community-focused fitness center offering essential workout equipment and personal training services. Known for its friendly atmosphere and affordable rates, this gym provides a comfortable environment for both beginners and experienced fitness enthusiasts. The facility features modern equipment and experienced trainers dedicated to helping you achieve your fitness goals.',
        hours: {
            'Monday - Friday': '6:00 AM - 10:00 PM',
            'Saturday': '7:00 AM - 9:00 PM',
            'Sunday': '7:00 AM - 8:00 PM'
        },
        contact: {
            phone: '(032) 234-5678',
            email: 'consolacion@yokoksgym.ph',
            website: 'www.yokoksgym.ph'
        },
        facilities: [
            { icon: 'fa-dumbbell', name: 'Free Weights' },
            { icon: 'fa-person-running', name: 'Cardio Equipment' },
            { icon: 'fa-square-parking', name: 'Free Parking' },
            { icon: 'fa-user', name: 'Personal Trainers' },
            { icon: 'fa-wifi', name: 'Free WiFi' },
            { icon: 'fa-fan', name: 'Air Conditioning' }
        ],
        pricing: [
            { duration: 'Daily', amount: '₱100', period: 'per day' },
            { duration: 'Monthly', amount: '₱800', period: 'per month' },
            { duration: '3 Months', amount: '₱2,100', period: 'one-time' },
            { duration: '6 Months', amount: '₱3,900', period: 'one-time' }
        ]
    },
    'holiday-gym-spa': {
        name: 'Holiday Gym and Spa',
        image: 'images/HolidayGymAndSpaThumbnail.jpg',
        rating: 4.8,
        reviewCount: '(312 reviews)',
        location: 'Gov. M. Cuenco Ave, Banilad, Cebu City',
        coordinates: { lat: 10.3356, lng: 123.9132 },
        description: 'Holiday Gym and Spa is a premium wellness destination that combines state-of-the-art fitness facilities with luxurious spa services. This upscale establishment offers a comprehensive approach to health and wellness, featuring top-tier equipment, professional trainers, therapeutic spa treatments, swimming pool, and sauna facilities. Perfect for those seeking a holistic fitness and relaxation experience in an elegant environment.',
        hours: {
            'Monday - Friday': '5:00 AM - 11:00 PM',
            'Saturday - Sunday': '6:00 AM - 10:00 PM',
            'Holidays': '7:00 AM - 9:00 PM'
        },
        contact: {
            phone: '(032) 412-8899',
            email: 'info@holidaygymspa.com',
            website: 'www.holidaygymspa.com'
        },
        facilities: [
            { icon: 'fa-water-ladder', name: 'Swimming Pool' },
            { icon: 'fa-hot-tub-person', name: 'Sauna & Steam Room' },
            { icon: 'fa-spa', name: 'Spa Services' },
            { icon: 'fa-dumbbell', name: 'Premium Equipment' },
            { icon: 'fa-users', name: 'Group Classes' },
            { icon: 'fa-user-tie', name: 'Certified Trainers' },
            { icon: 'fa-square-parking', name: 'Valet Parking' },
            { icon: 'fa-shirt', name: 'Locker Rooms' },
            { icon: 'fa-mug-hot', name: 'Juice Bar' }
        ],
        pricing: [
            { duration: 'Daily', amount: '₱250', period: 'per day' },
            { duration: 'Monthly', amount: '₱2,000', period: 'per month' },
            { duration: '6 Months', amount: '₱10,500', period: 'one-time' },
            { duration: 'Annual', amount: '₱18,000', period: 'one-time' }
        ]
    },
    'yokoks-rlandon': {
        name: 'Yokoks Gym R.Landon Street',
        image: 'images/YokoksGymRLandonStreetThumbnail.jpg',
        rating: 3.0,
        reviewCount: '(68 reviews)',
        location: 'R.Landon Street, Cebu City',
        coordinates: { lat: 10.3115, lng: 123.8935 },
        description: 'Located in the heart of Cebu City, Yokoks Gym R.Landon Street provides a convenient fitness solution for busy professionals and residents in the area. This branch features comprehensive training equipment, personal training services, and ample parking space. The gym maintains a clean, well-maintained facility with experienced staff ready to assist members in achieving their fitness objectives.',
        hours: {
            'Monday - Friday': '6:00 AM - 10:00 PM',
            'Saturday': '7:00 AM - 9:00 PM',
            'Sunday': '8:00 AM - 8:00 PM'
        },
        contact: {
            phone: '(032) 256-7890',
            email: 'rlandon@yokoksgym.ph',
            website: 'www.yokoksgym.ph'
        },
        facilities: [
            { icon: 'fa-dumbbell', name: 'Weight Training Area' },
            { icon: 'fa-person-running', name: 'Cardio Zone' },
            { icon: 'fa-square-parking', name: 'Parking Available' },
            { icon: 'fa-user', name: 'Personal Training' },
            { icon: 'fa-shower', name: 'Shower Facilities' },
            { icon: 'fa-fan', name: 'Climate Control' }
        ],
        pricing: [
            { duration: 'Daily', amount: '₱120', period: 'per day' },
            { duration: 'Monthly', amount: '₱1,000', period: 'per month' },
            { duration: '3 Months', amount: '₱2,700', period: 'one-time' },
            { duration: '6 Months', amount: '₱5,100', period: 'one-time' }
        ]
    },
    'k-fitness': {
        name: 'K-Fitness Mandaue',
        image: 'images/KFitnessThumbnail.jpg',
        rating: 4.0,
        reviewCount: '(189 reviews)',
        location: 'AS Fortuna St, Mandaue City, Cebu',
        coordinates: { lat: 10.3231, lng: 123.9313 },
        description: 'K-Fitness Mandaue is a modern 24/7 fitness facility designed for the serious fitness enthusiast. With round-the-clock access, members can work out on their own schedule. The gym features cutting-edge equipment, certified personal trainers, and a variety of training programs tailored to different fitness levels. The spacious facility includes dedicated areas for strength training, cardio, and functional fitness.',
        hours: {
            'All Days': 'Open 24/7',
            'Staffed Hours': '6:00 AM - 10:00 PM'
        },
        contact: {
            phone: '(032) 346-5432',
            email: 'mandaue@kfitness.ph',
            website: 'www.kfitness.ph'
        },
        facilities: [
            { icon: 'fa-clock', name: '24/7 Access' },
            { icon: 'fa-dumbbell', name: 'Modern Equipment' },
            { icon: 'fa-user-tie', name: 'Certified Trainers' },
            { icon: 'fa-square-parking', name: 'Secure Parking' },
            { icon: 'fa-wifi', name: 'High-Speed WiFi' },
            { icon: 'fa-camera', name: 'CCTV Security' },
            { icon: 'fa-shirt', name: 'Premium Lockers' },
            { icon: 'fa-fan', name: 'Air Conditioned' }
        ],
        pricing: [
            { duration: 'Monthly', amount: '₱2,500', period: 'per month' },
            { duration: '3 Months', amount: '₱6,900', period: 'one-time' },
            { duration: '6 Months', amount: '₱13,200', period: 'one-time' },
            { duration: 'Annual', amount: '₱24,000', period: 'one-time' }
        ]
    },
    'anytime-fitness-itpark': {
        name: 'Anytime Fitness - IT Park',
        image: 'images/AnytimeFitnessItParkThumbnail.jpg',
        rating: 4.1,
        reviewCount: '(456 reviews)',
        location: 'JM Del Mar Street, Cebu IT Park, Lahug, Cebu City',
        coordinates: { lat: 10.3234, lng: 123.9048 },
        description: 'Anytime Fitness IT Park is part of the world\'s largest co-ed gym chain, offering premium 24/7 access and exceptional service. Located in the bustling IT Park district, this facility is perfect for professionals seeking convenience. Members enjoy access to over 5,000 Anytime Fitness locations worldwide, professional coaching, group classes, and state-of-the-art equipment. The supportive community atmosphere makes it ideal for all fitness levels.',
        hours: {
            'Member Access': 'Open 24/7',
            'Staff Available': '9:00 AM - 8:00 PM (Mon-Fri)',
            'Weekend Staff': '9:00 AM - 5:00 PM (Sat-Sun)'
        },
        contact: {
            phone: '(032) 520-1234',
            email: 'itpark@anytimefitness.ph',
            website: 'www.anytimefitness.ph/itpark'
        },
        facilities: [
            { icon: 'fa-clock', name: '24/7 Club Access' },
            { icon: 'fa-globe', name: 'Global Access' },
            { icon: 'fa-users', name: 'Group Training' },
            { icon: 'fa-dumbbell', name: 'Premium Equipment' },
            { icon: 'fa-user-tie', name: 'Professional Coaches' },
            { icon: 'fa-heart', name: 'Heart Rate Training' },
            { icon: 'fa-mobile', name: 'App Integration' },
            { icon: 'fa-shower', name: 'Clean Facilities' }
        ],
        pricing: [
            { duration: 'Monthly', amount: '₱2,500', period: 'per month' },
            { duration: '6 Months', amount: '₱13,500', period: 'one-time' },
            { duration: 'Annual', amount: '₱24,500', period: 'one-time' }
        ]
    },
    'conquer-fitness': {
        name: 'Conquer Fitness Gym - Liloan',
        image: 'images/ConquerFitnessGymThumbnail.jpg',
        rating: 4.2,
        reviewCount: '(234 reviews)',
        location: 'Poblacion, Liloan, Cebu',
        coordinates: { lat: 10.3788, lng: 123.9941 },
        description: 'Conquer Fitness Gym in Liloan is a well-established fitness center known for its excellent facilities and supportive community atmosphere. The gym offers a comprehensive range of equipment, group fitness classes, personal training, and wellness amenities including sauna. With experienced trainers and a focus on personalized fitness programs, Conquer Fitness helps members achieve sustainable results in a motivating environment.',
        hours: {
            'Monday - Friday': '5:00 AM - 10:00 PM',
            'Saturday': '6:00 AM - 9:00 PM',
            'Sunday': '7:00 AM - 8:00 PM'
        },
        contact: {
            phone: '(032) 424-6789',
            email: 'info@conquerfitness.ph',
            website: 'www.conquerfitness.ph'
        },
        facilities: [
            { icon: 'fa-dumbbell', name: 'Full Equipment' },
            { icon: 'fa-users', name: 'Group Classes' },
            { icon: 'fa-hot-tub-person', name: 'Sauna' },
            { icon: 'fa-user', name: 'Personal Training' },
            { icon: 'fa-square-parking', name: 'Free Parking' },
            { icon: 'fa-mug-hot', name: 'Supplement Bar' },
            { icon: 'fa-shirt', name: 'Locker Rooms' },
            { icon: 'fa-wifi', name: 'WiFi Access' }
        ],
        pricing: [
            { duration: 'Daily', amount: '₱150', period: 'per day' },
            { duration: 'Monthly', amount: '₱1,500', period: 'per month' },
            { duration: '3 Months', amount: '₱4,000', period: 'one-time' },
            { duration: '6 Months', amount: '₱7,500', period: 'one-time' }
        ]
    },
    'ripped-city': {
        name: 'Ripped City Gym',
        image: 'images/RippedCityGymThumbnail.jpg',
        rating: 3.7,
        reviewCount: '(127 reviews)',
        location: 'CPG North Avenue, Tagbilaran City, Bohol',
        coordinates: { lat: 9.6477, lng: 123.8516 },
        description: 'Ripped City Gym in Tagbilaran is Bohol\'s premier fitness destination for serious bodybuilders and fitness enthusiasts. The gym features heavy-duty equipment, experienced trainers specializing in strength and conditioning, and a no-frills approach focused on results. With its hardcore training environment and supportive community, Ripped City attracts dedicated athletes and those committed to transforming their physique.',
        hours: {
            'Monday - Saturday': '6:00 AM - 10:00 PM',
            'Sunday': '8:00 AM - 8:00 PM'
        },
        contact: {
            phone: '(038) 501-2345',
            email: 'rippedcity@gmail.com',
            website: 'www.rippedcitygym.com'
        },
        facilities: [
            { icon: 'fa-dumbbell', name: 'Heavy Equipment' },
            { icon: 'fa-person-running', name: 'Cardio Machines' },
            { icon: 'fa-user', name: 'Expert Trainers' },
            { icon: 'fa-square-parking', name: 'Parking Space' },
            { icon: 'fa-water', name: 'Water Station' },
            { icon: 'fa-fan', name: 'Ventilation' }
        ],
        pricing: [
            { duration: 'Daily', amount: '₱100', period: 'per day' },
            { duration: 'Monthly', amount: '₱1,300', period: 'per month' },
            { duration: '3 Months', amount: '₱3,500', period: 'one-time' },
            { duration: '6 Months', amount: '₱6,500', period: 'one-time' }
        ]
    },
    'bold-fitness': {
        name: 'Bold Fitness Center',
        image: 'images/BoldFitnessCenterThumbnail.jpg',
        rating: 4.0,
        reviewCount: '(198 reviews)',
        location: 'Dampas District, Tagbilaran City, Bohol',
        coordinates: { lat: 9.6513, lng: 123.8526 },
        description: 'Bold Fitness Center is a modern, full-service fitness facility in Tagbilaran offering a balanced approach to health and wellness. The center features contemporary equipment, diverse group fitness classes including Zumba and yoga, personal training services, and a welcoming atmosphere for all fitness levels. Bold Fitness emphasizes community, proper form, and sustainable fitness habits for long-term health benefits.',
        hours: {
            'Monday - Friday': '5:30 AM - 10:00 PM',
            'Saturday': '6:00 AM - 9:00 PM',
            'Sunday': '7:00 AM - 7:00 PM'
        },
        contact: {
            phone: '(038) 412-8765',
            email: 'hello@boldfitness.ph',
            website: 'www.boldfitness.ph'
        },
        facilities: [
            { icon: 'fa-dumbbell', name: 'Modern Equipment' },
            { icon: 'fa-users', name: 'Fitness Classes' },
            { icon: 'fa-user-tie', name: 'Certified Trainers' },
            { icon: 'fa-square-parking', name: 'Ample Parking' },
            { icon: 'fa-child', name: 'Kids Area' },
            { icon: 'fa-mug-hot', name: 'Cafe Lounge' },
            { icon: 'fa-shirt', name: 'Changing Rooms' },
            { icon: 'fa-wifi', name: 'Free WiFi' }
        ],
        pricing: [
            { duration: 'Daily', amount: '₱150', period: 'per day' },
            { duration: 'Monthly', amount: '₱2,500', period: 'per month' },
            { duration: '3 Months', amount: '₱6,800', period: 'one-time' },
            { duration: '6 Months', amount: '₱12,500', period: 'one-time' }
        ]
    },
    'crossfit-subtero': {
        name: 'Crossfit Subtero',
        image: 'images/CrossfitSubteroThumbnail.jpg',
        rating: 4.0,
        reviewCount: '(176 reviews)',
        location: 'Jamestown, Mantawi Dr, Mandaue',
        coordinates: { lat: 10.3445, lng: 123.9463 },
        description: 'Crossfit Subtero is Cebu\'s premier CrossFit box, specializing in high-intensity functional training and community-driven fitness. This facility offers expert coaching in Olympic weightlifting, gymnastics, and metabolic conditioning. With scaled workouts for all fitness levels, Subtero creates a supportive environment where members push their limits together. The gym hosts regular competitions and emphasizes proper technique, nutrition, and recovery for optimal performance.',
        hours: {
            'Monday - Friday': '5:30 AM - 9:00 PM',
            'Saturday': '7:00 AM - 6:00 PM',
            'Sunday': '8:00 AM - 12:00 PM'
        },
        contact: {
            phone: '(032) 238-9876',
            email: 'coach@crossfitsubtero.com',
            website: 'www.crossfitsubtero.com'
        },
        facilities: [
            { icon: 'fa-dumbbell', name: 'CrossFit Equipment' },
            { icon: 'fa-users', name: 'Group WODs' },
            { icon: 'fa-user-tie', name: 'Level 1 Coaches' },
            { icon: 'fa-trophy', name: 'Competition Prep' },
            { icon: 'fa-square-parking', name: 'Parking Available' },
            { icon: 'fa-shower', name: 'Shower Rooms' },
            { icon: 'fa-apple-whole', name: 'Nutrition Coaching' },
            { icon: 'fa-calendar', name: 'Class Scheduling' }
        ],
        pricing: [
            { duration: 'Drop-In', amount: '₱500', period: 'per session' },
            { duration: 'Monthly', amount: '₱3,500', period: 'per month' },
            { duration: '3 Months', amount: '₱9,500', period: 'one-time' },
            { duration: '6 Months', amount: '₱18,000', period: 'one-time' }
        ]
    }
};

// ============================================
// MODAL POPUP SYSTEM
// ============================================

/**
 * openModal(gymId)
 * 
 * Opens a detailed modal popup for a specific gym
 * 
 * @param {string} gymId - The unique identifier for the gym (e.g., 'yokoks-consolacion')
 * 
 * Process:
 * 1. Retrieves gym data from gymDetails object
 * 2. Populates modal with: image, name, rating, location
 * 3. Dynamically generates HTML for: hours, contact info, facilities, pricing
 * 4. Initializes a Leaflet map showing the gym's location
 * 5. Displays the modal with fade-in animation
 */
function openModal(gymId) {
    const gym = gymDetails[gymId];
    if (!gym) return; // Exit if gym not found

    // Populate basic modal content
    document.getElementById('modalImage').src = gym.image;
    document.getElementById('modalImage').alt = gym.name;
    document.getElementById('modalGymName').textContent = gym.name;
    document.getElementById('modalRating').textContent = gym.rating;
    document.getElementById('modalReviewCount').textContent = gym.reviewCount;
    document.getElementById('modalLocation').textContent = gym.location;

    // Populate hours (convert object to HTML list)
    const hoursHTML = Object.entries(gym.hours).map(([day, time]) => `
        <div class="hours-item">
            <span class="hours-day">${day}</span>
            <span class="hours-time">${time}</span>
        </div>
    `).join('');
    document.getElementById('modalHours').innerHTML = hoursHTML;

    // Populate contact
    const contactHTML = `
        <div class="contact-item">
            <i class="fas fa-phone"></i>
            <span>${gym.contact.phone}</span>
        </div>
        <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <span>${gym.contact.email}</span>
        </div>
        <div class="contact-item">
            <i class="fas fa-globe"></i>
            <span>${gym.contact.website}</span>
        </div>
    `;
    document.getElementById('modalContact').innerHTML = contactHTML;

    // Populate facilities
    const facilitiesHTML = gym.facilities.map(facility => `
        <div class="facility-item">
            <i class="fas ${facility.icon}"></i>
            <span>${facility.name}</span>
        </div>
    `).join('');
    document.getElementById('modalFacilities').innerHTML = facilitiesHTML;

    // Populate pricing
    const pricingHTML = gym.pricing.map(price => `
        <div class="pricing-card">
            <div class="pricing-duration">${price.duration}</div>
            <div class="pricing-amount">${price.amount}</div>
            <div class="pricing-period">${price.period}</div>
        </div>
    `).join('');
    document.getElementById('modalPricing').innerHTML = pricingHTML;

    // Initialize modal map
    setTimeout(() => {
        const modalMapDiv = document.getElementById('modalMap');
        modalMapDiv.innerHTML = ''; // Clear previous map
        
        const modalMap = L.map('modalMap').setView([gym.coordinates.lat, gym.coordinates.lng], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(modalMap);
        
        L.marker([gym.coordinates.lat, gym.coordinates.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin">
                           <i class="fas fa-dumbbell"></i>
                       </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            })
        }).addTo(modalMap);
    }, 100);

    // Show modal
    const modal = document.getElementById('gymModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

/**
 * closeModal()
 * 
 * Closes the gym details modal and restores page scrolling
 */
function closeModal() {
    const modal = document.getElementById('gymModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('gymModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeComparison();
    }
});

// ============================================
// GYM COMPARISON FEATURE
// ============================================

/**
 * Allows users to select and compare up to 3 gyms side-by-side
 * Shows comparison bar with selected gyms and "Compare" button
 */

let selectedGyms = []; // Array storing IDs of gyms selected for comparison
const MAX_COMPARE = 3; // Maximum number of gyms that can be compared

/**
 * toggleCompare(gymId)
 * 
 * Handles checkbox clicks on gym cards to add/remove from comparison
 * 
 * @param {string} gymId - The gym's unique identifier
 * 
 * Rules:
 * - Maximum 3 gyms can be selected
 * - Shows alert if user tries to select more than 3
 * - Updates comparison bar in real-time
 */
function toggleCompare(gymId) {
    const checkbox = document.getElementById(`compare-${gymId}`);
    
    if (checkbox.checked) {
        // Prevent selecting more than MAX_COMPARE gyms
        if (selectedGyms.length >= MAX_COMPARE) {
            checkbox.checked = false;
            alert(`You can only compare up to ${MAX_COMPARE} gyms at a time.`);
            return;
        }
        selectedGyms.push(gymId);
    } else {
        // Remove gym from selection
        selectedGyms = selectedGyms.filter(id => id !== gymId);
    }
    
    updateComparisonBar();
}

/**
 * updateComparisonBar()
 * 
 * Updates the floating comparison bar UI
 * 
 * Updates:
 * - Shows/hides the bar based on selection
 * - Displays count of selected gyms
 * - Shows gym name tags with remove buttons
 * - Enables "Compare" button when 2+ gyms selected
 */
function updateComparisonBar() {
    const bar = document.getElementById('comparisonBar');
    const countSpan = document.querySelector('.comparison-count');
    const tagsContainer = document.getElementById('comparisonTags');
    const compareBtn = document.querySelector('.btn-compare');
    
    if (selectedGyms.length === 0) {
        bar.classList.remove('show');
        compareBtn.disabled = true;
    } else {
        bar.classList.add('show');
        compareBtn.disabled = selectedGyms.length < 2;
        
        countSpan.textContent = `${selectedGyms.length} gym${selectedGyms.length !== 1 ? 's' : ''} selected`;
        
        // Update tags
        tagsContainer.innerHTML = selectedGyms.map(gymId => {
            const gym = gymDetails[gymId];
            return `
                <div class="comparison-tag">
                    <span>${gym.name}</span>
                    <button onclick="removeFromComparison('${gymId}')" class="tag-remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');
    }
}

/**
 * removeFromComparison(gymId)
 * 
 * Removes a specific gym from the comparison selection
 * Called when user clicks the X button on a gym tag
 */
function removeFromComparison(gymId) {
    const checkbox = document.getElementById(`compare-${gymId}`);
    if (checkbox) checkbox.checked = false;
    selectedGyms = selectedGyms.filter(id => id !== gymId);
    updateComparisonBar();
}

/**
 * clearComparison()
 * 
 * Clears all selected gyms and resets the comparison
 */
function clearComparison() {
    selectedGyms.forEach(gymId => {
        const checkbox = document.getElementById(`compare-${gymId}`);
        if (checkbox) checkbox.checked = false;
    });
    selectedGyms = [];
    updateComparisonBar();
}

function openComparison() {
    if (selectedGyms.length < 2) {
        alert('Please select at least 2 gyms to compare.');
        return;
    }
    
    const modal = document.getElementById('comparisonModal');
    const grid = document.getElementById('comparisonGrid');
    
    // Build comparison table
    const gyms = selectedGyms.map(id => gymDetails[id]);
    
    let comparisonHTML = `
        <div class="comparison-table">
            <!-- Headers with gym names -->
            <div class="comparison-row comparison-header-row">
                <div class="comparison-cell label-cell"></div>
                ${gyms.map(gym => `
                    <div class="comparison-cell gym-header-cell">
                        <img src="${gym.image}" alt="${gym.name}">
                        <h3>${gym.name}</h3>
                        <div class="gym-rating">
                            <i class="fas fa-star"></i>
                            <span>${gym.rating}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Location -->
            <div class="comparison-row">
                <div class="comparison-cell label-cell">
                    <i class="fas fa-location-dot"></i> Location
                </div>
                ${gyms.map(gym => `
                    <div class="comparison-cell">${gym.location}</div>
                `).join('')}
            </div>
            
            <!-- Price -->
            <div class="comparison-row">
                <div class="comparison-cell label-cell">
                    <i class="fas fa-peso-sign"></i> Monthly Price
                </div>
                ${gyms.map(gym => `
                    <div class="comparison-cell">
                        <strong>${gym.pricing.find(p => p.duration === 'Monthly')?.amount || 'N/A'}</strong>
                    </div>
                `).join('')}
            </div>
            
            <!-- Hours -->
            <div class="comparison-row">
                <div class="comparison-cell label-cell">
                    <i class="fas fa-clock"></i> Hours
                </div>
                ${gyms.map(gym => `
                    <div class="comparison-cell" style="flex-direction: column; align-items: flex-start;">
                        ${Object.entries(gym.hours).map(([day, time]) => 
                            `<div class="hours-compact"><strong>${day}:</strong> ${time}</div>`
                        ).join('')}
                    </div>
                `).join('')}
            </div>
            
            <!-- Contact -->
            <div class="comparison-row">
                <div class="comparison-cell label-cell">
                    <i class="fas fa-phone"></i> Phone
                </div>
                ${gyms.map(gym => `
                    <div class="comparison-cell">${gym.contact.phone}</div>
                `).join('')}
            </div>
            
            <!-- Facilities -->
            <div class="comparison-row">
                <div class="comparison-cell label-cell">
                    <i class="fas fa-dumbbell"></i> Facilities
                </div>
                ${gyms.map(gym => `
                    <div class="comparison-cell">
                        <div class="facilities-compact">
                            ${gym.facilities.map(f => `
                                <span class="facility-badge">
                                    <i class="fas ${f.icon}"></i> ${f.name}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- All Pricing Options -->
            <div class="comparison-row">
                <div class="comparison-cell label-cell">
                    <i class="fas fa-tags"></i> All Prices
                </div>
                ${gyms.map(gym => `
                    <div class="comparison-cell" style="flex-direction: column; align-items: flex-start;">
                        ${gym.pricing.map(p => `
                            <div class="price-option">
                                <strong>${p.duration}:</strong> ${p.amount}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
            
            <!-- Actions -->
            <div class="comparison-row comparison-actions-row">
                <div class="comparison-cell label-cell"></div>
                ${gyms.map(gym => `
                    <div class="comparison-cell">
                        <button class="btn-view-details" onclick="closeComparison(); openModal('${selectedGyms[gyms.indexOf(gym)]}')">
                            View Full Details
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    grid.innerHTML = comparisonHTML;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * closeComparison()
 * 
 * Closes the comparison modal and restores page scrolling
 */
function closeComparison() {
    const modal = document.getElementById('comparisonModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ============================================
// INTERACTIVE MAP VIEW
// ============================================

/**
 * Map functionality using Leaflet.js library
 * Shows all gym locations on an interactive OpenStreetMap
 * 
 * Features:
 * - Color-coded markers (green for Cebu, red for Bohol)
 * - Clickable popups with gym info and "View Details" button
 * - Toggle between list and map views
 */

let map = null; // Leaflet map instance
let markers = []; // Array of map markers

/**
 * toggleView(view)
 * 
 * Switches between list view and map view
 * 
 * @param {string} view - Either 'list' or 'map'
 * 
 * Map is lazy-loaded on first view to improve page load performance
 */
function toggleView(view) {
    const listView = document.getElementById('gymResults');
    const mapView = document.getElementById('mapView');
    const listBtn = document.querySelector('[data-view="list"]');
    const mapBtn = document.querySelector('[data-view="map"]');
    
    if (view === 'map') {
        listView.style.display = 'none';
        mapView.style.display = 'block';
        listBtn.classList.remove('active');
        mapBtn.classList.add('active');
        
        // Initialize map if not already done
        if (!map) {
            initializeMap();
        }
    } else {
        listView.style.display = 'grid';
        mapView.style.display = 'none';
        mapBtn.classList.remove('active');
        listBtn.classList.add('active');
    }
}

/**
 * initializeMap()
 * 
 * Creates the Leaflet map and adds markers for all gyms
 * 
 * Process:
 * 1. Creates map centered on Cebu City
 * 2. Adds OpenStreetMap tile layer
 * 3. Loops through all gyms and creates markers at their coordinates
 * 4. Color-codes markers: green for Cebu gyms, red for Bohol gyms
 * 5. Adds popups with gym name, location, rating, and action button
 */
function initializeMap() {
    // Center map on Cebu City
    map = L.map('gymMap').setView([10.3157, 123.8854], 11);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Add markers for all gyms
    Object.entries(gymDetails).forEach(([gymId, gym]) => {
        const marker = L.marker([gym.coordinates.lat, gym.coordinates.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin">
                           <i class="fas fa-dumbbell"></i>
                       </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20]
            })
        }).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div class="map-popup-content">
                <h3>${gym.name}</h3>
                <div class="popup-rating">
                    <i class="fas fa-star"></i>
                    <span>${gym.rating}</span>
                    <span>${gym.reviewCount}</span>
                </div>
                <p class="popup-location"><i class="fas fa-location-dot"></i> ${gym.location}</p>
                <p class="popup-price"><i class="fas fa-peso-sign"></i> Starting at ${gym.pricing[1].amount}/month</p>
                <button class="popup-btn" onclick="openModal('${gymId}')">View Details</button>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });
        
        markers.push({ marker, gymId });
    });
}

// Add custom marker styles
const style = document.createElement('style');
style.textContent = `
    .custom-marker {
        background: none;
        border: none;
    }
    
    .marker-pin {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(0, 217, 255, 0.95), rgba(0, 180, 216, 0.95));
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid rgba(10, 14, 39, 0.9);
        box-shadow: 0 4px 15px rgba(0, 217, 255, 0.4),
                    0 0 20px rgba(0, 217, 255, 0.2);
        transition: all 0.3s ease;
    }
    
    .marker-pin:hover {
        transform: scale(1.15);
        box-shadow: 0 6px 20px rgba(0, 217, 255, 0.6),
                    0 0 30px rgba(0, 217, 255, 0.3);
    }
    
    .marker-pin i {
        color: #0A0E27;
        font-size: 18px;
        filter: drop-shadow(0 1px 2px rgba(255, 255, 255, 0.3));
    }
`;
document.head.appendChild(style);

