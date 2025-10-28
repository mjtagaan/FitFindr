// Search and Filter Functionality

// Update price display
const priceRange = document.getElementById('priceRange');
const maxPrice = document.getElementById('maxPrice');

if (priceRange) {
    priceRange.addEventListener('input', function() {
        const price = parseInt(this.value);
        maxPrice.textContent = '₱' + price.toLocaleString();
        filterGyms();
    });
}

// Filter gyms based on all criteria
function filterGyms() {
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