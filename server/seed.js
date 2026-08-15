require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Property = require('./models/Property');
const Testimonial = require('./models/Testimonial');
const Service = require('./models/Service');

const U = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const seedData = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Property.deleteMany(),
    Testimonial.deleteMany(),
    Service.deleteMany(),
  ]);

  // 1. Admin user
  await User.create({
    name: 'Admin',
    email: 'admin@harrington.com',
    password: 'Admin@123',
    role: 'admin',
  });
  console.log('  ✅ Admin user created (admin@harrington.com / Admin@123)');

  // 2. Properties
  const properties = [
    {
      title: 'Mosman Waterfront Villa', slug: 'mosman-waterfront-villa',
      flag: '🇦🇺', market: 'Sydney', loc: 'Mosman, Sydney NSW, Australia',
      price: 'AUD 1,250,000', priceNumeric: 1250000, status: 'For Sale', type: 'Villa',
      beds: 4, baths: 3, garage: 2, area: '420 sqm', land: '610 sqm', year: 2018, featured: true,
      images: [U('photo-1613490493576-7fde63acd811'), U('photo-1600210492486-724fe5c67fb0'), U('photo-1600585154526-990dced4db0d'), U('photo-1600573472592-401b489a3cdc'), U('photo-1600566752355-35792bedcfea')],
      desc: [
        'Positioned on one of Mosman\u2019s most tightly held waterfront streets, this architect-designed villa captures uninterrupted views across Middle Harbour from nearly every room. Floor-to-ceiling glazing, wide-board oak floors and a double-height entry void give the home a sense of light and scale rarely found this close to the city.',
        'The lower level flows out to a heated infinity-edge pool and travertine terrace \u2014 an entertainer\u2019s platform above the water. Upstairs, the master suite occupies its own wing with a dressing room, marble ensuite and private balcony facing the sunrise over the harbour.',
        'Minutes to Balmoral Beach, elite schools and the Mosman village caf\u00e9 strip, with a 15-minute commute to the Sydney CBD. Properties of this calibre on this street trade privately and rarely \u2014 early inspection is strongly advised.'
      ],
      features: ['Uninterrupted harbour views', 'Heated infinity-edge pool', 'Double-height entry void', 'Marble master ensuite', 'Smart home automation', 'Wine cellar & tasting nook', 'Ducted reverse-cycle A/C', 'Outdoor kitchen & BBQ terrace', 'Secure double garage + storage', 'Landscaped low-maintenance gardens', 'CCTV & alarm system', 'Solar with battery storage'],
      details: new Map([['Property ID', 'HPG-AU-0142'], ['Property Type', 'Detached Villa'], ['Status', 'For Sale'], ['Year Built', '2018'], ['Internal Area', '420 sqm'], ['Land Size', '610 sqm'], ['Bedrooms', '4'], ['Bathrooms', '3'], ['Parking', '2-car garage + off-street'], ['Council', 'Mosman Municipal Council'], ['Tenure', 'Freehold (Torrens title)'], ['Foreign Buyers', 'FIRB approval required']]),
      mapTitle: 'Mosman, Lower North Shore', mapNote: 'Moments to Balmoral Beach and Mosman village. Exact address shared with qualified buyers on enquiry.'
    },
    {
      title: 'Brickell Bay Residence', slug: 'brickell-bay-residence',
      flag: '🇺🇸', market: 'Miami', loc: 'Brickell, Miami FL, United States',
      price: 'USD 895,000', priceNumeric: 895000, status: 'For Sale', type: 'Apartment',
      beds: 3, baths: 2, garage: 2, area: '2,340 sqft', land: '—', year: 2021, featured: true,
      images: [U('photo-1512917774080-9991f1c4c750'), U('photo-1522708323590-d24dbb6b0267'), U('photo-1560448204-e02f11c3d0e2'), U('photo-1600607687920-4e2a09cf159d'), U('photo-1600121848594-d8644e57abab')],
      desc: [
        'A corner residence on the 38th floor of one of Brickell\u2019s newest towers, with wraparound floor-to-ceiling glass framing Biscayne Bay to the east and the downtown skyline to the north.',
        'The Italian-designed kitchen features integrated Sub-Zero and Wolf appliances, a waterfall-edge island and a full butler\u2019s pantry. Both secondary bedrooms enjoy bay glimpses, while the primary suite adds a spa bathroom with freestanding tub.',
        'Building amenities include a resort pool deck, private cinema, co-working lounge and 24-hour concierge. Brickell City Centre is within a five-minute walk \u2014 a genuine lock-and-leave for international owners.'
      ],
      features: ['38th-floor corner position', 'Wraparound bay & skyline views', 'Sub-Zero / Wolf kitchen', 'Deep entertaining terrace', 'Resort-style pool deck', 'Private residents\u2019 cinema', '24-hour concierge & valet', 'Co-working lounge', '2 assigned parking bays', 'Hurricane-rated glazing', 'Pet-friendly building', 'Strong short-stay rental policy'],
      details: new Map([['Property ID', 'HPG-US-0287'], ['Property Type', 'Condominium'], ['Status', 'For Sale'], ['Year Built', '2021'], ['Internal Area', '2,340 sqft'], ['HOA Fees', 'USD 1,480 / month'], ['Bedrooms', '3'], ['Bathrooms', '2'], ['Parking', '2 assigned bays'], ['Floor', '38 of 54'], ['Tenure', 'Condo (fee simple)'], ['Foreign Buyers', 'No restrictions']]),
      mapTitle: 'Brickell, Downtown Miami', mapNote: 'Five minutes on foot to Brickell City Centre and the Metromover.'
    },
    {
      title: 'Kensington Garden Townhouse', slug: 'kensington-garden-townhouse',
      flag: '🇬🇧', market: 'London', loc: 'Kensington, London, United Kingdom',
      price: 'GBP 720,000', priceNumeric: 720000, status: 'For Sale', type: 'House',
      beds: 3, baths: 2, garage: 1, area: '1,780 sqft', land: '—', year: 1897, featured: true,
      images: [U('photo-1600585154340-be6161a56a0c'), U('photo-1600607688969-a5bfcd646154'), U('photo-1600585152220-90363fe7e115'), U('photo-1600210492486-724fe5c67fb0'), U('photo-1600566752355-35792bedcfea')],
      desc: [
        'A beautifully restored Victorian townhouse on a quiet, tree-lined Kensington terrace, blending period bones \u2014 original cornicing, sash windows, a cast-iron fireplace \u2014 with a crisp contemporary renovation completed in 2023.',
        'The lower-ground level has been opened into a full-width kitchen and dining space with Crittall-style doors onto a landscaped south-facing courtyard garden.',
        'Kensington High Street, Holland Park and two Underground lines are within an eight-minute walk. A rare freehold at this price point.'
      ],
      features: ['Freehold Victorian terrace', 'Renovated throughout (2023)', 'South-facing courtyard garden', 'Original cornicing & sash windows', 'Crittall-style garden doors', 'Underfloor heating (lower ground)', 'Bespoke fitted joinery', 'Marble shower room', 'Residents\u2019 parking permit zone', '8 min walk to Underground', 'Holland Park nearby', 'Chain-free sale'],
      details: new Map([['Property ID', 'HPG-UK-0198'], ['Property Type', 'Terraced House'], ['Status', 'For Sale'], ['Year Built', '1897 (renovated 2023)'], ['Internal Area', '1,780 sqft'], ['EPC Rating', 'C'], ['Bedrooms', '3'], ['Bathrooms', '2'], ['Parking', 'Permit zone + 1 garage'], ['Council Tax', 'Band F (RBKC)'], ['Tenure', 'Freehold'], ['Foreign Buyers', 'No restrictions (SDLT surcharge applies)']]),
      mapTitle: 'Kensington, Royal Borough', mapNote: 'Eight minutes on foot to High Street Kensington station.'
    },
    {
      title: 'Palm Jumeirah Sky Penthouse', slug: 'palm-jumeirah-sky-penthouse',
      flag: '🇦🇪', market: 'Dubai', loc: 'Palm Jumeirah, Dubai, UAE',
      price: 'AED 2,400,000', priceNumeric: 2400000, status: 'For Sale', type: 'Penthouse',
      beds: 3, baths: 4, garage: 2, area: '310 sqm', land: '—', year: 2022, featured: true,
      images: [U('photo-1600607687939-ce8a6c25118c'), U('photo-1560448204-e02f11c3d0e2'), U('photo-1600573472592-401b489a3cdc'), U('photo-1600607687920-4e2a09cf159d'), U('photo-1522708323590-d24dbb6b0267')],
      desc: [
        'Crowning a boutique tower on the trunk of Palm Jumeirah, this half-floor penthouse looks across the Arabian Gulf to the Dubai Marina skyline.',
        'The terrace itself is the showpiece: a private plunge pool, outdoor lounge and dining for ten, all facing the sunset. Inside, book-matched marble, Gaggenau appliances, and a principal suite with dual dressing rooms.',
        'Freehold ownership, zero annual property tax and strong gross yields make this equally compelling as a residence or an income asset. Vacant on transfer.'
      ],
      features: ['Private sky terrace & plunge pool', 'Half-floor layout, private lift lobby', 'Full sea & Marina skyline views', 'Gaggenau kitchen', 'Book-matched marble finishes', 'Dual dressing rooms in primary suite', 'Dedicated study / 4th-bed option', 'Beach club membership included', '2 basement parking bays', '24/7 security & concierge', 'Freehold zone \u2014 0% property tax', 'Vacant on transfer'],
      details: new Map([['Property ID', 'HPG-AE-0331'], ['Property Type', 'Penthouse'], ['Status', 'For Sale'], ['Year Built', '2022'], ['Internal Area', '310 sqm'], ['Service Charge', 'AED 22 / sqft / yr'], ['Bedrooms', '3 (+study)'], ['Bathrooms', '4'], ['Parking', '2 basement bays'], ['View', 'Sea & Marina skyline'], ['Tenure', 'Freehold'], ['Foreign Buyers', 'Fully eligible \u2014 Golden Visa qualifying']]),
      mapTitle: 'Palm Jumeirah, Dubai', mapNote: 'Trunk location, minutes to Nakheel Mall and the West Beach strip.'
    },
    {
      title: 'Al Nakheel Courtyard Villa', slug: 'al-nakheel-courtyard-villa',
      flag: '🇸🇦', market: 'Riyadh', loc: 'Al Nakheel, Riyadh, Saudi Arabia',
      price: 'SAR 3,150,000', priceNumeric: 3150000, status: 'For Sale', type: 'Villa',
      beds: 5, baths: 5, garage: 3, area: '560 sqm', land: '750 sqm', year: 2023, featured: true,
      images: [U('photo-1600566753190-17f0baa2a6c3'), U('photo-1600585154526-990dced4db0d'), U('photo-1600566752355-35792bedcfea'), U('photo-1600210492486-724fe5c67fb0'), U('photo-1600573472592-401b489a3cdc')],
      desc: [
        'A newly completed contemporary villa in Al Nakheel, one of Riyadh\u2019s most sought-after northern districts, arranged around a shaded central courtyard with a private pool.',
        'The ground floor separates formal majlis and family living wings, each with its own entrance. Five ensuite bedrooms occupy the upper level.',
        'Al Nakheel places you minutes from KAFD, top international schools and the Riyadh Front. Quality villas here are appreciating quickly \u2014 this one is ready for immediate occupation.'
      ],
      features: ['Private courtyard pool', 'Separate formal majlis wing', '5 ensuite bedrooms', 'Driver\u2019s & maid\u2019s quarters', 'Triple garage + gated forecourt', 'Stone-clad designer kitchen', 'Smart lighting & climate control', 'Roof terrace with city outlook', 'Elevator provision installed', 'District cooling ready', 'Minutes to KAFD', 'Brand new \u2014 never occupied'],
      details: new Map([['Property ID', 'HPG-SA-0119'], ['Property Type', 'Detached Villa'], ['Status', 'For Sale'], ['Year Built', '2023'], ['Internal Area', '560 sqm'], ['Land Size', '750 sqm'], ['Bedrooms', '5 (all ensuite)'], ['Bathrooms', '5 + guest WC'], ['Parking', '3-car garage'], ['District', 'Al Nakheel, North Riyadh'], ['Tenure', 'Freehold'], ['Foreign Buyers', 'Eligible under premium residency rules']]),
      mapTitle: 'Al Nakheel, North Riyadh', mapNote: 'Minutes to KAFD and King Salman Park.'
    },
    {
      title: 'Deansgate Riverside Apartment', slug: 'deansgate-riverside-apartment',
      flag: '🇬🇧', market: 'Manchester', loc: 'Deansgate, Manchester, United Kingdom',
      price: 'GBP 385,000', priceNumeric: 385000, status: 'For Sale', type: 'Apartment',
      beds: 2, baths: 2, garage: 1, area: '1,050 sqft', land: '—', year: 2020, featured: true,
      images: [U('photo-1600047509807-ba8f99d2cdde'), U('photo-1522708323590-d24dbb6b0267'), U('photo-1560448204-e02f11c3d0e2'), U('photo-1600121848594-d8644e57abab'), U('photo-1600607688969-a5bfcd646154')],
      desc: [
        'A bright, dual-aspect two-bedroom apartment on the 14th floor of a landmark Deansgate development, with the River Irwell below and open views west.',
        'Both bedrooms are genuine doubles with fitted storage; the principal adds a sleek ensuite. The building offers a residents\u2019 gym, rooftop terrace, secure parking and a staffed concierge.',
        'Deansgate is Manchester\u2019s strongest rental micro-market, with gross yields around 6%. Sold with the option of an existing management arrangement \u2014 a true turnkey investment.'
      ],
      features: ['14th-floor dual aspect', 'Winter garden / enclosed balcony', 'River Irwell views', 'Residents\u2019 gym & rooftop terrace', '24-hour concierge', 'Secure allocated parking', 'Fitted wardrobes to both bedrooms', '~6% gross rental yield', 'Turnkey management available', '5 min walk to Deansgate station', 'EWS1 certified building', 'Ideal buy-to-let or city base'],
      details: new Map([['Property ID', 'HPG-UK-0244'], ['Property Type', 'Apartment'], ['Status', 'For Sale'], ['Year Built', '2020'], ['Internal Area', '1,050 sqft'], ['Service Charge', 'GBP 2,900 / yr'], ['Bedrooms', '2'], ['Bathrooms', '2'], ['Parking', '1 allocated secure bay'], ['Ground Rent', 'Peppercorn'], ['Tenure', 'Leasehold \u2014 995 yrs'], ['Foreign Buyers', 'No restrictions (SDLT surcharge applies)']]),
      mapTitle: 'Deansgate, Manchester', mapNote: 'Five minutes on foot to Deansgate station.'
    },
  ];
  await Property.insertMany(properties);
  console.log(`  ✅ ${properties.length} properties seeded`);

  // 3. Testimonials
  const testimonials = [
    { name: 'Sarah M. 🇦🇺', initials: 'SM', flag: '🇦🇺', rating: 5, quote: 'James found us a waterfront home we\'d been chasing for two years. He negotiated below the guide price in one of Sydney\'s hottest markets — I still don\'t know how he did it.', subtitle: 'Waterfront home · Sydney, Australia', order: 0 },
    { name: 'Ahmed Al-Rashidi 🇦🇪', initials: 'AR', flag: '🇦🇪', rating: 5, quote: 'Buying in London from Dubai felt impossible until I met James. He handled the solicitors, the survey, everything — my investment property completed without me ever leaving the UAE.', subtitle: 'Investment property in London · Dubai, UAE', order: 1 },
    { name: 'Jennifer & Mark T. 🇺🇸', initials: 'JM', flag: '🇺🇸', rating: 5, quote: 'Relocating from the UK to Miami with two kids was daunting. James coordinated the schools, the neighbourhood shortlist and the closing timeline. We felt looked after at every step.', subtitle: 'Relocated from the UK · Miami, United States', order: 2 },
    { name: 'Priya K. 🇬🇧', initials: 'PK', flag: '🇬🇧', rating: 5, quote: 'As a first-time buyer I had a hundred questions. James answered every single one, walked me through each stage, and got me the keys to my Manchester apartment ahead of schedule.', subtitle: 'First-time buyer · Manchester, United Kingdom', order: 3 },
    { name: 'Khalid Al-Farsi 🇸🇦', initials: 'KF', flag: '🇸🇦', rating: 5, quote: 'James built me a portfolio of three Dubai properties with a blended yield I couldn\'t find on my own. His market analysis is the sharpest I\'ve seen — and I\'ve worked with many agents.', subtitle: 'Portfolio of 3 Dubai properties · Riyadh, Saudi Arabia', order: 4 },
  ];
  await Testimonial.insertMany(testimonials);
  console.log(`  ✅ ${testimonials.length} testimonials seeded`);

  // 4. Services
  const services = [
    { title: 'Buyer Representation', description: 'We negotiate on your behalf across every market — protecting your interests from first viewing to final signature.', icon: 'fa-house-chimney', order: 0 },
    { title: 'Property Investment Advisory', description: 'Data-driven strategy for portfolio growth, with yield analysis and market timing across AU, US, UK and the Gulf.', icon: 'fa-chart-line', order: 1 },
    { title: 'Relocation Services', description: 'Seamless moves across AU, US, UK and Gulf — schools, visas, logistics and neighbourhood matching handled.', icon: 'fa-earth-asia', order: 2 },
    { title: 'Rental Management', description: 'Hands-off property management for investors — tenanting, maintenance and reporting, wherever you are.', icon: 'fa-clipboard-list', order: 3 },
  ];
  await Service.insertMany(services);
  console.log(`  ✅ ${services.length} services seeded`);

  console.log('\n🎉 Database seeded successfully!');
  process.exit(0);
};

seedData().catch(err => { console.error(err); process.exit(1); });
