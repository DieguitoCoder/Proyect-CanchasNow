// Courts data for CanchasYa platform
// Contains all court information for the 5 featured courts in Barranquilla

const courts = [
    {
        id: 'La del Pibe',
        name: 'La del Pibe',
        sport: 'Football',
        description: 'Experience football at its finest at La del Pibe, Barranquillas premier football facility.',
        address: 'a 45e-193, Cra 1C #45e63, Barranquilla, Atlántico, Colombia',
        phone: '53624546',
        email: 'info@ladelpibe.com',
        location: 'Norte, Barranquilla',
        rating: 4.6,
        reviews: 127,
        images: {
            banner: 'assets/courts/La del Pibe/Banner.png',
            gallery: [
                'assets/courts/La del Pibe/Gallery-Pibe.png',
                'assets/courts/La del Pibe/Gallery-Pibe-2.png',
            ]
        },
        pricing: {
            weekday: 25,
            weekend: 35,
            currency: 'USD',
            peakHours: {
                start: 18,
                end: 20,
                rate: 40
            }
        },
        hours: {
            open: '06:00',
            close: '22:00',
            timezone: 'America/Bogota'
        },
        features: [
            'Professional Artificial Grass',
            'LED Floodlighting',
            'Changing Rooms',
            'Free Parking',
            'Equipment Rental',
            'Refreshment Area',
            'Security System',
            'Online Booking'
        ],
        amenities: {
            parking: true,
            changingRooms: true,
            showers: true,
            equipment: true,
            refreshments: true,
            wifi: true,
            security: true,
            firstAid: true
        },
        capacity: {
            players: 22,
            spectators: 200
        },
        dimensions: {
            length: 105,
            width: 68,
            unit: 'meters'
        },
        surface: 'Artificial Grass',
        additionalServices: [
            { name: 'Ball Rental', price: 5 },
            { name: 'Jersey Set (11 players)', price: 15 },
            { name: 'Referee Service', price: 25 },
            { name: 'Photography Service', price: 50 }
        ],
        rules: [
            'No metal studs allowed',
            'Maximum 22 players on field',
            'No smoking in facility',
            'Respect other players and staff',
            'Clean up after use'
        ],
        coordinates: {
            latitude: 10.9639,
            longitude: -74.7964
        },
        socialMedia: {
            instagram: '@ladelpibe_barranquilla',
            facebook: 'La del Pibe Barranquilla',
            whatsapp: '+573001234567'
        },
        status: 'active',
        verified: true,
        featured: true,
        lastUpdated: '2025-01-15T10:00:00Z'
    },
    {
        id: 'La Patiada',
        name: 'La Patiada',
        sport: 'Football',
        description: 'Located in Barranquilla, Cancha La Patiada offers a modern football experience with synthetic turf fields designed for dynamic small-sided games.',
        address: 'Av. Circunvalar #89-123, Barranquilla, Colombia',
        phone: '+57 300 987 6543',
        email: 'contact@elitesports.com',
        location: 'Norte, Barranquilla',
        rating: 4.3,
        reviews: 89,
        images: {
            banner: 'assets/courts/La Patiada/Banner.png',
            gallery: [
                'assets/courts/La Patiada/Gallery-1.png',
                'assets/courts/La Patiada/Gallery-2.png'
            ]
        },
        pricing: {
            weekday: 30,
            weekend: 40,
            currency: 'USD',
            sports: {
                tennis: 30,
                basketball: 25,
                volleyball: 20,
                fitness: 15
            }
        },
        hours: {
            open: '05:00',
            close: '23:00',
            timezone: 'America/Bogota'
        },
        features: [
            'Indoor Climate Control',
            'Professional Courts',
            'Equipment Rental',
            'Locker Rooms',
            'Pro Shop',
            'Coaching Available',
            'Multiple Sports',
            'Modern Facilities'
        ],
        amenities: {
            parking: true,
            changingRooms: true,
            showers: true,
            equipment: true,
            refreshments: true,
            wifi: true,
            security: true,
            firstAid: true,
            airConditioning: true,
            proShop: true
        },
        sports: ['Tennis', 'Basketball', 'Volleyball', 'Fitness'],
        capacity: {
            tennis: 4,
            basketball: 10,
            volleyball: 12,
            fitness: 20,
            spectators: 150
        },
        surface: 'Multi-Surface',
        additionalServices: [
            { name: 'Equipment Rental', price: 10 },
            { name: 'Personal Trainer', price: 40 },
            { name: 'Towel Service', price: 5 },
            { name: 'Sports Massage', price: 35 }
        ],
        rules: [
            'No metal studs allowed',
            'Maximum 22 players on field',
            'No smoking in facility',
            'Respect other players and staff',
            'Clean up after use'
        ],
        coordinates: {
            latitude: 11.0041,
            longitude: -74.8070
        },
        socialMedia: {
            instagram: '@elitesports_baq',
            facebook: 'Elite Sports Center Barranquilla',
            whatsapp: '+573009876543'
        },
        status: 'active',
        verified: true,
        featured: true,
        lastUpdated: '2025-01-15T10:00:00Z'
    },
    {
        id: 'La Tiburona',
        name: 'La Tiburona',
        sport: 'Football',
        description: 'Experience the thrill of the game at La Tiburona, Barranquilla’s top destination for football.',
        address: 'Cl. 45 #33-95, Suroccidente, Barranquilla, Atlántico',
        phone: '+57 300 348 3985',
        email: 'info@championscourt.com',
        location: 'Centro, Barranquilla',
        rating: 4.3,
        reviews: 156,
        images: {
            banner: 'assets/courts/La Tiburona/Banner.png',
            gallery: [
                'assets/courts/La Tiburona/Gallery-1.png',
                'assets/courts/La Tiburona/Gallery-2.png'
            ]
        },
        pricing: {
            weekday: 28,
            weekend: 38,
            currency: 'USD',
            peakHours: {
                start: 18,
                end: 21,
                rate: 40
            }
        },
        hours: {
            open: '06:00',
            close: '23:00',
            timezone: 'America/Bogota'
        },
        features: [
            'High-quality synthetic turf',
            'Bright professional lighting',
            'Family-friendly environment',
            'Player Lounge',
        ],
        amenities: {
            parking: true,
            changingRooms: true,
            showers: true,
            equipment: true,
            refreshments: true,
            wifi: true,
            security: true,
            firstAid: true,
            videoAnalysis: true,
            playerLounge: true
        },
        capacity: {
            players: 10,
            spectators: 300
        },
        dimensions: {
            length: 28.7,
            width: 15.2,
            unit: 'meters'
        },
        surface: 'Hardwood',
        additionalServices: [
            { name: 'Ball Package', price: 8 },
            { name: 'Video Recording', price: 20 },
            { name: 'Personal Coach', price: 50 },
            { name: 'Team Training Session', price: 100 }
        ],
        rules: [
            'No metal studs allowed',
            'Maximum 22 players on field',
            'No smoking in facility',
            'Respect other players and staff',
            'Clean up after use'
        ],
        coordinates: {
            latitude: 10.9685,
            longitude: -74.7813
        },
        socialMedia: {
            instagram: '@championscourt_baq',
            facebook: 'Champions Court Barranquilla',
            whatsapp: '+573014567890'
        },
        status: 'active',
        verified: true,
        featured: true,
        lastUpdated: '2025-01-15T10:00:00Z'
    },
    {
        id: 'La 21 FC',
        name: 'La 21 Futbol Club',
        sport: 'Football',
        description: 'A modern and welcoming indoor football facility in Barranquilla',
        address: 'Cra 21B #58-71, Suroccidente, Barranquilla, Atlántico',
        phone: '+57 316 472 6166',
        email: 'booking@goldenfield.com',
        location: 'Norte, Barranquilla',
        rating: 4.6,
        reviews: 203,
        images: {
            banner: 'assets/courts/La 21 FC/Banner.png',
            gallery: [
                'assets/courts/La 21 FC/Gallery-1.png',
                'assets/courts/La 21 FC/Gallery-2.png'
            ]
        },
        pricing: {
            weekday: 35,
            weekend: 50,
            currency: 'USD',
            matchTypes: {
                casual: 0,
                tournament: 20,
                training: 0
            }
        },
        hours: {
            open: '07:00',
            close: '22:00',
            timezone: 'America/Bogota'
        },
        features: [
            'FIFA-Standard Natural Grass',
            'Underground Drainage',
            'Professional Goals',
            'Stadium Seating',
            'VIP Facilities',
            'Match Officials',
            'Weather Protection',
            'Premium Surface'
        ],
        amenities: {
            parking: true,
            changingRooms: true,
            showers: true,
            equipment: true,
            refreshments: true,
            wifi: true,
            security: true,
            firstAid: true,
            stadiumSeating: true,
            vipArea: true
        },
        capacity: {
            players: 22,
            spectators: 500
        },
        dimensions: {
            length: 105,
            width: 68,
            unit: 'meters'
        },
        surface: 'Natural Grass',
        additionalServices: [
            { name: 'Match Referee', price: 30 },
            { name: 'Linesmen (2)', price: 20 },
            { name: 'Professional Photography', price: 100 },
            { name: 'Live Streaming', price: 150 }
        ],
        rules: [
            'No metal studs allowed',
            'Maximum 22 players on field',
            'No smoking in facility',
            'Respect other players and staff',
            'Clean up after use'
        ],
        coordinates: {
            latitude: 11.0180,
            longitude: -74.8510
        },
        socialMedia: {
            instagram: '@goldenfield_official',
            facebook: 'Golden Field Soccer Arena',
            whatsapp: '+573027890123'
        },
        status: 'active',
        verified: true,
        featured: true,
        lastUpdated: '2025-01-15T10:00:00Z'
    },
    {
        id: 'Cancha Brasileirao',
        name: 'Cancha Sintetica Brasileirao',
        sport: 'Football',
        description: 'Discover the thrill of the game at Cancha Sintética Brasileirao, Barranquilla’s top destination for football lovers.',
        address: 'Cra. 46 #76-109, Nte. Centro Historico, Barranquilla, Atlántico',
        phone: '+ 57 312 860 3063',
        email: 'reservations@victoryarena.com',
        location: 'Norte, Barranquilla',
        rating: 4.4,
        reviews: 178,
        images: {
            banner: 'assets/courts/Cancha Brasileirao/Banner.png',
            gallery: [
                'assets/courts/Cancha Brasileirao/Gallery-1.png',
                'assets/courts/Cancha Brasileirao/Gallery-2.png'
            ]
        },
        pricing: {
            weekday: 35,
            weekend: 45,
            currency: 'USD',
            courtTypes: {
                clay: 40,
                hard: 35
            }
        },
        hours: {
            open: '06:00',
            close: '22:00',
            timezone: 'America/Bogota'
        },
        features: [
            'Premium synthetic turf',
            'Central location',
            'Night Play Lighting',
            'Pro Shop & Stringing',
            'Spacious field',
            'Court Maintenance'
        ],
        amenities: {
            parking: true,
            changingRooms: true,
            showers: true,
            equipment: true,
            refreshments: true,
            wifi: true,
            security: true,
            firstAid: true,
            proShop: true,
            academy: true
        },
        courtTypes: ['Clay', 'Hard Court'],
        capacity: {
            players: 4,
            spectators: 200
        },
        dimensions: {
            length: 23.8,
            width: 10.9,
            unit: 'meters'
        },
        surface: 'Clay/Hard Court',
        additionalServices: [
            { name: 'Racquet Rental', price: 12 },
            { name: 'Ball Machine', price: 25 },
            { name: 'Private Lesson', price: 60 },
            { name: 'String Service', price: 15 }
        ],
        rules: [
            'No metal studs allowed',
            'Maximum 22 players on field',
            'No smoking in facility',
            'Respect other players and staff',
            'Clean up after use'
        ],
        coordinates: {
            latitude: 11.0095,
            longitude: -74.8456
        },
        socialMedia: {
            instagram: '@victoryarena_tennis',
            facebook: 'Victory Arena Tennis Complex',
            whatsapp: '+573052345678'
        },
        status: 'active',
        verified: true,
        featured: true,
        lastUpdated: '2025-01-15T10:00:00Z'
    }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = courts;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.courts = courts;
}

// Utility functions for court data
const courtUtils = {
    // Get court by ID
    getCourtById: function(id) {
        return courts.find(court => court.id === id);
    },

    // Get courts by sport
    getCourtsBySport: function(sport) {
        return courts.filter(court => 
            court.sport.toLowerCase() === sport.toLowerCase() ||
            (court.sports && court.sports.some(s => s.toLowerCase() === sport.toLowerCase()))
        );
    },

    // Get courts by location
    getCourtsByLocation: function(location) {
        return courts.filter(court => 
            court.location.toLowerCase().includes(location.toLowerCase())
        );
    },

    // Get courts by rating
    getCourtsByRating: function(minRating) {
        return courts.filter(court => court.rating >= minRating);
    },

    // Get courts by price range
    getCourtsByPriceRange: function(minPrice, maxPrice) {
        return courts.filter(court => {
            const price = Math.min(court.pricing.weekday, court.pricing.weekend);
            return price >= minPrice && price <= maxPrice;
        });
    },

    // Get featured courts
    getFeaturedCourts: function() {
        return courts.filter(court => court.featured);
    },

    // Search courts
    searchCourts: function(query) {
        const searchTerm = query.toLowerCase();
        return courts.filter(court => 
            court.name.toLowerCase().includes(searchTerm) ||
            court.sport.toLowerCase().includes(searchTerm) ||
            court.description.toLowerCase().includes(searchTerm) ||
            court.location.toLowerCase().includes(searchTerm) ||
            court.features.some(feature => feature.toLowerCase().includes(searchTerm))
        );
    },

    // Get court statistics
    getCourtStats: function() {
        return {
            total: courts.length,
            sports: [...new Set(courts.map(court => court.sport))],
            averageRating: courts.reduce((sum, court) => sum + court.rating, 0) / courts.length,
            priceRange: {
                min: Math.min(...courts.map(court => Math.min(court.pricing.weekday, court.pricing.weekend))),
                max: Math.max(...courts.map(court => Math.max(court.pricing.weekday, court.pricing.weekend)))
            }
        };
    }
};

// Export utility functions
if (typeof window !== 'undefined') {
    window.courtUtils = courtUtils;
}
