-- V3: Add worldwide popular cities
-- Uses INSERT IGNORE to avoid duplicates if re-run

-- United States
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('New York', 'New York', 'United States', 40.7128, -74.0060),
('Los Angeles', 'California', 'United States', 34.0522, -118.2437),
('Chicago', 'Illinois', 'United States', 41.8781, -87.6298),
('Houston', 'Texas', 'United States', 29.7604, -95.3698),
('Phoenix', 'Arizona', 'United States', 33.4484, -112.0740),
('San Francisco', 'California', 'United States', 37.7749, -122.4194),
('Seattle', 'Washington', 'United States', 47.6062, -122.3321),
('Miami', 'Florida', 'United States', 25.7617, -80.1918),
('Austin', 'Texas', 'United States', 30.2672, -97.7431),
('Boston', 'Massachusetts', 'United States', 42.3601, -71.0589);

-- United Kingdom
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('London', 'England', 'United Kingdom', 51.5074, -0.1278),
('Manchester', 'England', 'United Kingdom', 53.4808, -2.2426),
('Edinburgh', 'Scotland', 'United Kingdom', 55.9533, -3.1883),
('Birmingham', 'England', 'United Kingdom', 52.4862, -1.8904),
('Glasgow', 'Scotland', 'United Kingdom', 55.8642, -4.2518);

-- Canada
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Toronto', 'Ontario', 'Canada', 43.6532, -79.3832),
('Vancouver', 'British Columbia', 'Canada', 49.2827, -123.1207),
('Montreal', 'Quebec', 'Canada', 45.5017, -73.5673),
('Calgary', 'Alberta', 'Canada', 51.0447, -114.0719),
('Ottawa', 'Ontario', 'Canada', 45.4215, -75.6972);

-- Australia
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Sydney', 'New South Wales', 'Australia', -33.8688, 151.2093),
('Melbourne', 'Victoria', 'Australia', -37.8136, 144.9631),
('Brisbane', 'Queensland', 'Australia', -27.4698, 153.0251),
('Perth', 'Western Australia', 'Australia', -31.9505, 115.8605),
('Adelaide', 'South Australia', 'Australia', -34.9285, 138.6007);

-- Germany
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Berlin', 'Berlin', 'Germany', 52.5200, 13.4050),
('Munich', 'Bavaria', 'Germany', 48.1351, 11.5820),
('Hamburg', 'Hamburg', 'Germany', 53.5511, 9.9937),
('Frankfurt', 'Hesse', 'Germany', 50.1109, 8.6821),
('Cologne', 'North Rhine-Westphalia', 'Germany', 50.9375, 6.9603);

-- France
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Paris', 'Ile-de-France', 'France', 48.8566, 2.3522),
('Lyon', 'Auvergne-Rhone-Alpes', 'France', 45.7640, 4.8357),
('Marseille', 'Provence-Alpes-Cote d Azur', 'France', 43.2965, 5.3698),
('Toulouse', 'Occitanie', 'France', 43.6047, 1.4442),
('Nice', 'Provence-Alpes-Cote d Azur', 'France', 43.7102, 7.2620);

-- Japan
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Tokyo', 'Tokyo', 'Japan', 35.6762, 139.6503),
('Osaka', 'Osaka', 'Japan', 34.6937, 135.5023),
('Kyoto', 'Kyoto', 'Japan', 35.0116, 135.7681),
('Yokohama', 'Kanagawa', 'Japan', 35.4437, 139.6380),
('Nagoya', 'Aichi', 'Japan', 35.1815, 136.9066);

-- South Korea
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Seoul', 'Seoul', 'South Korea', 37.5665, 126.9780),
('Busan', 'Busan', 'South Korea', 35.1796, 129.0756),
('Incheon', 'Incheon', 'South Korea', 37.4563, 126.7052),
('Daegu', 'Daegu', 'South Korea', 35.8714, 128.6014);

-- Singapore
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Singapore', 'Singapore', 'Singapore', 1.3521, 103.8198);

-- India (keeping existing, adding more)
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Hyderabad', 'Telangana', 'India', 17.3850, 78.4867),
('Chennai', 'Tamil Nadu', 'India', 13.0827, 80.2707),
('Pune', 'Maharashtra', 'India', 18.5204, 73.8567),
('Ahmedabad', 'Gujarat', 'India', 23.0225, 72.5714),
('Jaipur', 'Rajasthan', 'India', 26.9124, 75.7873),
('Lucknow', 'Uttar Pradesh', 'India', 26.8467, 80.9462),
('Chandigarh', 'Chandigarh', 'India', 30.7333, 76.7794),
('Bhopal', 'Madhya Pradesh', 'India', 23.2599, 77.4126),
('Patna', 'Bihar', 'India', 25.6093, 85.1376),
('Indore', 'Madhya Pradesh', 'India', 22.7196, 75.8577);

-- Brazil
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Sao Paulo', 'Sao Paulo', 'Brazil', -23.5505, -46.6333),
('Rio de Janeiro', 'Rio de Janeiro', 'Brazil', -22.9068, -43.1729),
('Brasilia', 'Federal District', 'Brazil', -15.7975, -47.8919),
('Salvador', 'Bahia', 'Brazil', -12.9714, -38.5124),
('Curitiba', 'Parana', 'Brazil', -25.4284, -49.2733);

-- Netherlands
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Amsterdam', 'North Holland', 'Netherlands', 52.3676, 4.9041),
('Rotterdam', 'South Holland', 'Netherlands', 51.9244, 4.4777),
('The Hague', 'South Holland', 'Netherlands', 52.0705, 4.3007),
('Utrecht', 'Utrecht', 'Netherlands', 52.0907, 5.1214);

-- Sweden
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Stockholm', 'Stockholm', 'Sweden', 59.3293, 18.0686),
('Gothenburg', 'Vastra Gotaland', 'Sweden', 57.7089, 11.9746),
('Malmo', 'Skane', 'Sweden', 55.6050, 13.0038);

-- Spain
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Madrid', 'Madrid', 'Spain', 40.4168, -3.7038),
('Barcelona', 'Catalonia', 'Spain', 41.3874, 2.1686),
('Valencia', 'Valencia', 'Spain', 39.4699, -0.3763),
('Seville', 'Andalusia', 'Spain', 37.3891, -5.9845);

-- Italy
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Rome', 'Lazio', 'Italy', 41.9028, 12.4964),
('Milan', 'Lombardy', 'Italy', 45.4642, 9.1900),
('Naples', 'Campania', 'Italy', 40.8518, 14.2681),
('Florence', 'Tuscany', 'Italy', 43.7696, 11.2558),
('Venice', 'Veneto', 'Italy', 45.4408, 12.3155);

-- Turkey
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Istanbul', 'Istanbul', 'Turkey', 41.0082, 28.9784),
('Ankara', 'Ankara', 'Turkey', 39.9334, 32.8597),
('Izmir', 'Izmir', 'Turkey', 38.4237, 27.1428);

-- UAE
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Dubai', 'Dubai', 'United Arab Emirates', 25.2048, 55.2708),
('Abu Dhabi', 'Abu Dhabi', 'United Arab Emirates', 24.4539, 54.3773);

-- Saudi Arabia
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Riyadh', 'Riyadh', 'Saudi Arabia', 24.7136, 46.6753),
('Jeddah', 'Makkah', 'Saudi Arabia', 21.4858, 39.1925);

-- South Africa
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Cape Town', 'Western Cape', 'South Africa', -33.9249, 18.4241),
('Johannesburg', 'Gauteng', 'South Africa', -26.2041, 28.0473),
('Durban', 'KwaZulu-Natal', 'South Africa', -29.8587, 31.0218);

-- Nigeria
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Lagos', 'Lagos', 'Nigeria', 6.5244, 3.3792),
('Abuja', 'Federal Capital Territory', 'Nigeria', 9.0579, 7.4951);

-- Kenya
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Nairobi', 'Nairobi', 'Nigeria', -1.2921, 36.8219);

-- Egypt
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Cairo', 'Cairo', 'Egypt', 30.0444, 31.2357),
('Alexandria', 'Alexandria', 'Egypt', 31.2001, 29.9187);

-- Mexico
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Mexico City', 'Mexico City', 'Mexico', 19.4326, -99.1332),
('Guadalajara', 'Jalisco', 'Mexico', 20.6597, -103.3496),
('Monterrey', 'Nuevo Leon', 'Mexico', 25.6866, -100.3161);

-- Argentina
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Buenos Aires', 'Buenos Aires', 'Argentina', -34.6037, -58.3816),
('Cordoba', 'Cordoba', 'Argentina', -31.4201, -64.1888);

-- Thailand
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Bangkok', 'Bangkok', 'Thailand', 13.7563, 100.5018),
('Chiang Mai', 'Chiang Mai', 'Thailand', 18.7883, 98.9853),
('Phuket', 'Phuket', 'Thailand', 7.8804, 98.3923);

-- Vietnam
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Ho Chi Minh City', 'Ho Chi Minh', 'Vietnam', 10.8231, 106.6297),
('Hanoi', 'Hanoi', 'Vietnam', 21.0278, 105.8342);

-- Indonesia
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Jakarta', 'Jakarta', 'Indonesia', -6.2088, 106.8456),
('Bali', 'Bali', 'Indonesia', -8.3405, 115.0920),
('Surabaya', 'East Java', 'Indonesia', -7.2575, 112.7521);

-- Malaysia
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Kuala Lumpur', 'Kuala Lumpur', 'Malaysia', 3.1390, 101.6869),
('Penang', 'Penang', 'Malaysia', 5.4164, 100.3327);

-- Philippines
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Manila', 'Metro Manila', 'Philippines', 14.5995, 120.9842),
('Cebu', 'Cebu', 'Philippines', 10.3157, 123.8854);

-- Taiwan
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Taipei', 'Taipei', 'Taiwan', 25.0330, 121.5654);

-- China
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Beijing', 'Beijing', 'China', 39.9042, 116.4074),
('Shanghai', 'Shanghai', 'China', 31.2304, 121.4737),
('Shenzhen', 'Guangdong', 'China', 22.5431, 114.0579),
('Guangzhou', 'Guangdong', 'China', 23.1291, 113.2644),
('Chengdu', 'Sichuan', 'China', 30.5728, 104.0668);

-- Russia
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Moscow', 'Moscow', 'Russia', 55.7558, 37.6173),
('Saint Petersburg', 'Saint Petersburg', 'Russia', 59.9343, 30.3351);

-- Poland
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Warsaw', 'Masovia', 'Poland', 52.2297, 21.0122),
('Krakow', 'Lesser Poland', 'Poland', 50.0647, 19.9450);

-- Portugal
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Lisbon', 'Lisbon', 'Portugal', 38.7223, -9.1393),
('Porto', 'Porto', 'Portugal', 41.1579, -8.6291);

-- Norway
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Oslo', 'Oslo', 'Norway', 59.9139, 10.7522),
('Bergen', 'Vestland', 'Norway', 60.3913, 5.3221);

-- Denmark
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Copenhagen', 'Capital Region', 'Denmark', 55.6761, 12.5683);

-- Finland
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Helsinki', 'Uusimaa', 'Finland', 60.1699, 24.9384);

-- Ireland
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Dublin', 'Leinster', 'Ireland', 53.3498, -6.2603),
('Galway', 'Connacht', 'Ireland', 53.2707, -9.0568);

-- New Zealand
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Auckland', 'Auckland', 'New Zealand', -36.8485, 174.7633),
('Wellington', 'Wellington', 'New Zealand', -41.2865, 174.7762);

-- Switzerland
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Zurich', 'Zurich', 'Switzerland', 47.3769, 8.5417),
('Geneva', 'Geneva', 'Switzerland', 46.2044, 6.1432);

-- Austria
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Vienna', 'Vienna', 'Austria', 48.2082, 16.3738);

-- Czech Republic
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Prague', 'Prague', 'Czech Republic', 50.0755, 14.4378);

-- Greece
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Athens', 'Attica', 'Greece', 37.9838, 23.7275);

-- Israel
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Tel Aviv', 'Tel Aviv', 'Israel', 32.0853, 34.7818),
('Jerusalem', 'Jerusalem', 'Israel', 31.7683, 35.2137);

-- Lebanon
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Beirut', 'Beirut', 'Lebanon', 33.8938, 35.5018);

-- Morocco
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Casablanca', 'Casablanca-Settat', 'Morocco', 33.5731, -7.5898),
('Marrakech', 'Marrakech-Safi', 'Morocco', 31.6295, -7.9811);

-- Colombia
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Bogota', 'Cundinamarca', 'Colombia', 4.7110, -74.0721),
('Medellin', 'Antioquia', 'Colombia', 6.2476, -75.5658);

-- Chile
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Santiago', 'Santiago', 'Chile', -33.4489, -70.6693);

-- Peru
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Lima', 'Lima', 'Peru', -12.0464, -77.0428);

-- Pakistan
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Karachi', 'Sindh', 'Pakistan', 24.8607, 67.0011),
('Lahore', 'Punjab', 'Pakistan', 31.5204, 74.3587),
('Islamabad', 'Islamabad', 'Pakistan', 33.6844, 73.0479);

-- Bangladesh
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Dhaka', 'Dhaka', 'Bangladesh', 23.8103, 90.4125),
('Chittagong', 'Chittagong', 'Bangladesh', 22.3569, 91.7832);

-- Sri Lanka
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Colombo', 'Western', 'Sri Lanka', 6.9271, 79.8612);

-- Nepal
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Kathmandu', 'Bagmati', 'Nepal', 27.7172, 85.3240);

-- Iceland
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Reykjavik', 'Capital Region', 'Iceland', 64.1466, -21.9426);

-- Caribbean
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('San Juan', 'San Juan', 'Puerto Rico', 18.4655, -66.1057);

-- Ukraine
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Kyiv', 'Kyiv', 'Ukraine', 50.4501, 30.5234);

-- Romania
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Bucharest', 'Bucharest', 'Romania', 44.4268, 26.1025);

-- Hungary
INSERT IGNORE INTO cities (name, state, country, latitude, longitude) VALUES
('Budapest', 'Budapest', 'Hungary', 47.4979, 19.0402);
