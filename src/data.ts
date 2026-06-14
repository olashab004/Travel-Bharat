/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IndiaData } from "./types";

// Premium CORS-enabled Unsplash Images for India Destinations
export const IMG = {
  // Rajasthan
  rajasthan: "https://upload.wikimedia.org/wikipedia/commons/f/fb/20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg",
  amberFort: "https://upload.wikimedia.org/wikipedia/commons/f/fb/20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg",
  hawaMahal: "https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
  mehrangarh: "https://upload.wikimedia.org/wikipedia/commons/9/99/Mehrangarh_Fort_sanhita.jpg",
  jaisalmer: "https://upload.wikimedia.org/wikipedia/commons/4/47/Jaisalmer_forteresse.jpg",
  ranthambore: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Ranthambore_National_Park.JPG",
  pushkar: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg",

  // Kerala
  kerala: "https://upload.wikimedia.org/wikipedia/commons/e/ee/House_Boat_DSW.jpg",
  alleppey: "https://upload.wikimedia.org/wikipedia/commons/e/ee/House_Boat_DSW.jpg",
  munnar: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Munnar_Overview.jpg",
  periyar: "https://upload.wikimedia.org/wikipedia/commons/6/66/Periyar_National_Park.JPG",
  varkala: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Varkala_beach_from_above.jpg",
  fortkochi: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Kochi%2C_Fishing_nets_at_sunset%2C_Kerala%2C_India.jpg",

  // Uttarakhand
  uttarakhand: "https://upload.wikimedia.org/wikipedia/commons/5/56/Kedarnath_Temple_in_Rainy_season.jpg",
  kedarnath: "https://upload.wikimedia.org/wikipedia/commons/5/56/Kedarnath_Temple_in_Rainy_season.jpg",
  rishikesh: "https://upload.wikimedia.org/wikipedia/commons/7/74/Trayambakeshwar_Temple_VK.jpg",
  corbett: "https://upload.wikimedia.org/wikipedia/commons/7/78/Bengal-Tiger_Corbett_Uttarakhand_Dec-2013.jpg",
  auli: "https://upload.wikimedia.org/wikipedia/commons/8/83/Auli_Himalayas.jpg",
  valleyFlowers: "https://upload.wikimedia.org/wikipedia/commons/5/50/Valley_of_flowers_national_park%2C_Uttarakhand%2C_India_03_%28edit%29.jpg",

  // Goa
  goa: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Baga_Beach%2C_Calangute%2C_Goa.jpg",
  bomJesus: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg",
  bagaBeach: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Baga_Beach%2C_Calangute%2C_Goa.jpg",
  dudhsagar: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Doodhsagar_Fall.jpg",
  aguada: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Fort_aguada.jpg",

  // Madhya Pradesh
  mp: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Lakshmana_Temple_%28Khajuraho%29.jpg",
  khajuraho: "https://upload.wikimedia.org/wikipedia/commons/e/e7/1_Khajuraho.jpg",
  bandhavgarh: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Bandhavgarh_tiger.jpg",
  sanchi: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Stupa_1%2C_Sanchi_02.jpg",
  orchha: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Orchha_Fort.jpg",

  // Himachal Pradesh
  himachal: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Manali_Himachal_Pradesh.jpg",
  manali: "https://upload.wikimedia.org/wikipedia/commons/d/de/Snow_Rohtang_Range_Manali_May24_A7CR_00128.jpg",
  spiti: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Key_Monastery%2C_Spiti_Valley.jpg",
  shimla: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Landscape_of_Shimla_%2C_Himachal_Pradesh.jpg",
  dharamshala: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Dharamshala_03_%28Cropped%29.jpg",

  // Tamil Nadu
  tn: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Madurai_Meenakshi_Amman_Temple.jpg",
  meenakshi: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Tower_of_Meenakshi_amman_temple.jpg",
  mahabalipuram: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Shore_Temple_Mahabalipuram.jpg",
  ooty: "https://upload.wikimedia.org/wikipedia/commons/d/db/Ooty_lake.jpg",
  brihadeeswarar: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg",

  // Gujarat
  gujarat: "https://upload.wikimedia.org/wikipedia/commons/5/56/Rann_of_Kutch.jpg",
  rann: "https://upload.wikimedia.org/wikipedia/commons/5/56/Rann_of_Kutch.jpg",
  somnath: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Sujay_Chatterjee_at_Somnath_Temple%2C_2024.jpg",
  gir: "https://upload.wikimedia.org/wikipedia/commons/2/22/Asiatic_Lion_in_Gir_Forest.jpg",

  // West Bengal
  wb: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Victoria_Memorial_Kolkata_2.jpg",
  darjeeling: "https://upload.wikimedia.org/wikipedia/commons/6/60/Darjeeling_Himalayan_Railway%2Ctoy_train_%288%29.jpg",
  victoria: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Victoria_Memorial_Kolkata_2.jpg",
  sundarbans: "https://upload.wikimedia.org/wikipedia/commons/0/05/Dense_Mangrove_Forest_of_the_Sundarban_Tiger_Reserve_during_High_Tide%2C_West_Bengal%2C_India_03.jpg",

  // Uttar Pradesh
  up: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg",
  tajMahal: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg",
  varanasi: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg",
  agraFort: "https://upload.wikimedia.org/wikipedia/commons/1/17/Agra_Fort_amidst_greenery.jpg",
  baraImambara: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Bara_Imambara_Lucknow.jpg",
  mathura: "https://upload.wikimedia.org/wikipedia/commons/6/60/Vrindavan_Prem_Mandir.jpg",

  // Karnataka
  karnataka: "https://upload.wikimedia.org/wikipedia/commons/8/85/Vittala_Temple_Hampi.jpg",
  hampi: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg",
  mysore: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Illuminated_Mysore_palace_at_night.JPG",
  coorg: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Coorg_Coffee_Estate.jpg",

  // Andhra Pradesh
  ap: "https://upload.wikimedia.org/wikipedia/commons/5/52/Tirumala_Venkateswara_Temple.jpg",
  tirupati: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Tirumala_Venkateswara_temple_entrance_09062015.JPG",
  araku: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Araku_Valley_Coffee_Plantation.jpg",

  // Maharashtra
  maha: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Ajanta_cave_26.jpg",
  ajanta: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Ajanta_cave_26.jpg",
  gatewayIndia: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg",
  lonavala: "https://upload.wikimedia.org/wikipedia/commons/7/75/Lonavala_Lake.jpg",

  // Assam
  assam: "https://upload.wikimedia.org/wikipedia/commons/7/71/One_horned_rhino_in_kaziranga.jpg",
  kaziranga: "https://upload.wikimedia.org/wikipedia/commons/7/71/One_horned_rhino_in_kaziranga.jpg",
  majuli: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Majuli_Island_Assam.jpg",

  // Punjab
  punjab: "https://upload.wikimedia.org/wikipedia/commons/9/94/Golden_Temple%2C_Amritsar_2.jpg",
  goldenTemple: "https://upload.wikimedia.org/wikipedia/commons/9/94/Golden_Temple%2C_Amritsar_2.jpg",
  wagah: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Wagah_Border_Ceremony.jpg",

  // Manipur
  manipur: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Loktak_Lake.jpg",
  loktak: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Loktak_Lake.jpg",

  // Meghalaya
  meghalaya: "https://upload.wikimedia.org/wikipedia/commons/0/09/Living_root_bridge_Cherrapunji.jpg",
  cherrapunji: "https://upload.wikimedia.org/wikipedia/commons/0/09/Living_root_bridge_Cherrapunji.jpg",
  dawki: "https://upload.wikimedia.org/wikipedia/commons/7/73/Dawki_river_Meghalaya.jpg",

  // Odisha
  odisha: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Konarka_Temple.jpg",
  konark: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Konarka_Temple.jpg",
  puri: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Puri_Jagannath_Temple.jpg",
  chilika: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Chilika_Lake_Birds.jpg",

  // Jammu & Kashmir
  jk: "https://upload.wikimedia.org/wikipedia/commons/0/03/Dal_Lake_Srinagar.jpg",
  dalLake: "https://upload.wikimedia.org/wikipedia/commons/0/03/Dal_Lake_Srinagar.jpg",
  gulmarg: "https://upload.wikimedia.org/wikipedia/commons/7/70/Gulmarg_Kashmir.jpg",
  pangong: "https://upload.wikimedia.org/wikipedia/commons/1/17/Pangong_Lake_Ladakh.jpg",

  // Andaman & Nicobar
  andaman: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Radhanagar_Beach_Havelock.jpg",
  radhanagar: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Radhanagar_Beach_Havelock.jpg",
  cellularJail: "https://upload.wikimedia.org/wikipedia/commons/5/50/Cellular_Jail_Andaman.jpg"
};

export const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%23e5e7eb'/%3E%3Ctext x='400' y='200' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3EImage Loading...%3C/text%3E%3C/svg%3E";

export const indiaData: IndiaData = {
  states: [
    {
      id: "rajasthan", name: "Rajasthan", capital: "Jaipur", region: "North",
      tagline: "Land of Kings and Palaces", color: "#E8660A", image: IMG.rajasthan,
      places: [
        {
          id: "amber-fort", name: "Amber Fort", city: "Jaipur", lat: 26.9855, lng: 75.8513, category: "Heritage", rating: 4.8, bestTime: "Oct–Mar", entryFee: "₹200 (Indian), ₹550 (Foreign)", timings: "8:00 AM–5:30 PM",
          desc: "A majestic 16th-century architectural masterpiece constructed by Raja Man Singh I, Amber Fort rises loftily on a rocky hill beside Maota Lake. Built using gorgeous red sandstone and marble, it elegantly fuses Hindu and Rajput stylistic layouts. The interior is celebrated for the legendary Sheesh Mahal (Mirror Palace), where a single lit candle reflects across thousands of tiny hand-cut mirrors, mimicking a star-filled sky. Visitors can admire massive courtyards, ornate gates, and enjoy an immersive elephant-ride simulation or a dramatic light and sound show in the evening.",
          image: IMG.amberFort, nearby: ["Jal Mahal", "Hawa Mahal", "City Palace"]
        },
        {
          id: "hawa-mahal", name: "Hawa Mahal", city: "Jaipur", lat: 26.9239, lng: 75.8267, category: "Heritage", rating: 4.6, bestTime: "Oct–Feb", entryFee: "₹50 (Indian), ₹200 (Foreign)", timings: "9:00 AM–5:00 PM",
          desc: "Known as the legendary 'Palace of Winds', Hawa Mahal is an extraordinary five-story exterior structure resembling the crown of Lord Krishna. Built in 1799 by Maharaja Sawai Pratap Singh, its unique honeycomb facade contains 953 small casements called jharokhas. These intricate windows were mathematically engineered to create the Venturi cooling effect, channeling breezy drafts through the corridors even in hot summers. This design permitted royal ladies to observe daily bazaar processions unseen by public eyes, maintaining strict privacy while experiencing breeze.",
          image: IMG.hawaMahal, nearby: ["City Palace", "Jantar Mantar", "Albert Hall Museum"]
        },
        {
          id: "mehrangarh-fort", name: "Mehrangarh Fort", city: "Jodhpur", lat: 26.2980, lng: 73.0188, category: "Heritage", rating: 4.9, bestTime: "Oct–Mar", entryFee: "₹100 (Indian), ₹600 (Foreign)", timings: "9:00 AM–5:30 PM",
          desc: "Commanding the landscape from atop a perpendicular cliff 400 feet above the horizon, Mehrangarh Fort is one of India's largest and most formidable strongholds. Founded by Rao Jodha in 1459, the fort features thick sandstone ramparts that carry scars of historic battles. Within its walls are decorated palaces with exquisite filigree carvings, including Moti Mahal (Pearl Palace) and Phool Mahal (Flower Palace). It also houses an outstanding museum displaying ancient palanquins, armor, and fine paintings, while offering breathtaking panoramas of Jodhpur's blue residences.",
          image: IMG.mehrangarh, nearby: ["Jaswant Thada", "Umaid Bhawan Palace", "Clock Tower"]
        },
        {
          id: "jaisalmer-fort", name: "Jaisalmer Fort", city: "Jaisalmer", lat: 26.9157, lng: 70.9083, category: "Heritage", rating: 4.7, bestTime: "Oct–Mar", entryFee: "₹70 (Indian), ₹250 (Foreign)", timings: "Open 24 Hours",
          desc: "Known as Sonar Qila or the Golden Fort, Jaisalmer Fort lies nestled in the heart of the great Thar Desert. It is a rare living fort, housing a quarter of the old city's population, busy markets, and ancient houses within its ramparts. Constructed entirely from gleaming yellow sandstone, its walls glow like molten gold during sunsets. The fort's defensive structure incorporates 99 bastions, exquisitely carved Jain temples, and high royal apartments that boast elegant balcony lattices framing desert dunes.",
          image: IMG.jaisalmer, nearby: ["Sam Sand Dunes", "Patwon Ki Haveli", "Gadsisar Lake"]
        },
        {
          id: "ranthambore", name: "Ranthambore National Park", city: "Sawai Madhopur", lat: 26.0173, lng: 76.5026, category: "Nature", rating: 4.7, bestTime: "Oct–Jun", entryFee: "₹400 (Jeep Safari)", timings: "6:00 AM–10:00 AM, 2:00 PM–6:00 PM",
          desc: "Ranthambore is a world-renowned wildlife reserve situated at the junction of the ancient Aravali and Vindhya hill ranges. Spanning massive dales and dry deciduous forests, it is famous for its bold Bengal tigers that can be spotted hunting during high-sunlight hours. The park is historically unique, featuring the ancient 10th-century Ranthambore Fort standing on a cliff above the dense canopy. Safaris winding past scenic lakes offer close encounters with leopards, marsh crocodiles, hyenas, and rare birds.",
          image: IMG.ranthambore, nearby: ["Ranthambore Fort", "Padam Lake", "Trinetra Ganesh Temple"]
        },
        {
          id: "pushkar", name: "Pushkar Lake & Temple", city: "Pushkar", lat: 26.4899, lng: 74.5512, category: "Religious", rating: 4.5, bestTime: "Oct–Mar", entryFee: "Free", timings: "Open all day",
          desc: "Pushkar is a serene and mystical town wrapping around the pristine, sacred Pushkar Lake. According to legend, the lake was formed when Lord Brahma dropped a lotus petal on Earth to slay a demon, making it one of the most sacred pilgrimage sites in India. It is home to the rare 14th-century Brahma Temple, featuring a distinctive red spire. The lake is encircled by 52 bathing ghats and hundreds of milky-white temples, where spiritual chants and evening aarti rituals chime under soft temple lamps.",
          image: IMG.pushkar, nearby: ["Savitri Temple", "Man Mahal", "Pushkar Camel Fair"]
        }
      ]
    },
    {
      id: "kerala", name: "Kerala", capital: "Thiruvananthapuram", region: "South",
      tagline: "God's Own Country", color: "#2D8A4E", image: IMG.kerala,
      places: [
        {
          id: "alleppey", name: "Alleppey Backwaters", city: "Alappuzha", lat: 9.4981, lng: 76.3388, category: "Nature", rating: 4.9, bestTime: "Nov–Feb", entryFee: "Houseboat from ₹8,000/night", timings: "All day",
          desc: "Often hailed as the 'Venice of the East', the backwaters of Alleppey present a labyrinthine network of lazy canals, palm-fringed lagoons, and green rice fields. Traveling on a traditional Kettuvallam (houseboat) handcrafted from coir and bamboo node knots is a serene and calming experience. Visitors glide past sleepy coastal hamlets, watch locals casting fishnets, and savor authentic spicy Kerala cuisine freshly prepared on board. The tranquil surroundings and rustling palm trees offer a romantic and nature-connected retreat.",
          image: IMG.alleppey, nearby: ["Marari Beach", "Kuttanad", "Krishnapuram Palace"]
        },
        {
          id: "munnar", name: "Munnar Tea Gardens", city: "Munnar", lat: 10.0889, lng: 77.0595, category: "Nature", rating: 4.8, bestTime: "Sep–Mar", entryFee: "Free (Tours ₹150)", timings: "All day",
          desc: "A breathtaking and misty escape in the Western Ghats, Munnar sits at the confluence of three mountain streams: Mudrapuzha, Nallathanni, and Kundala. Rolling layers of velvet-green tea plantations blanket the hillsides as far as the eye can see, punctuated by low-hanging clouds and gushing waterfalls. Munnar boasts the highest mountain peak in South India, Anamudi, and is base to Eravikulam National Park. It is also home to the rare Neelakurinji flower, which turns the entire valley a brilliant, vibrant violet once every twelve years.",
          image: IMG.munnar, nearby: ["Eravikulam National Park", "Mattupetty Dam", "Top Station"]
        },
        {
          id: "thekkady", name: "Periyar Wildlife Sanctuary", city: "Thekkady", lat: 9.5916, lng: 77.1600, category: "Nature", rating: 4.6, bestTime: "Oct–Jun", entryFee: "₹30 (Indian), ₹300 (Foreign)", timings: "6:00 AM–6:00 PM",
          desc: "Nestled high in the Cardamom Hills, Periyar Wildlife Sanctuary is a premier bio-reserve surrounding a large, picturesque man-made lake. It provides a sanctuary for heavy herds of wild elephants, rare gaurs, wild boars, and tigers. Uniquely, safaris are conducted using scenic cruise boats, allowing travelers to observe animals grazing on lake shores without disturbance. The surrounding region is also filled with aromatic spice hills producing high-grade cardamom, black pepper, cloves, and cinnamon.",
          image: IMG.periyar, nearby: ["Spice Gardens", "Murikkady", "Kadathanadan Kalari Centre"]
        },
        {
          id: "varkala", name: "Varkala Beach & Cliffs", city: "Varkala", lat: 8.7379, lng: 76.7163, category: "Nature", rating: 4.5, bestTime: "Oct–Mar", entryFee: "Free", timings: "All day",
          desc: "Varkala Beach is a stunning coastal marvel characterized by unique red laterite cliffs rising adjacent to the sparkling Arabian Sea. These cliffs are lined with boutique stalls, cozy cafes, and yoga centers, offering beautiful bird's-eye views of sunsets. The beach is locally named Papanasam Beach, which means 'Redeemer of Sins', as its mineral springs are believed to possess divine healing properties. Close to the coast sits the 2000-year-old Janardanaswami Temple, creating a charming mix of spirituality and coastal leisure.",
          image: IMG.varkala, nearby: ["Janardanaswami Temple", "Sivagiri Mutt", "Edava Beach"]
        },
        {
          id: "fort-kochi", name: "Fort Kochi", city: "Kochi", lat: 9.9658, lng: 76.2421, category: "Heritage", rating: 4.6, bestTime: "Oct–Feb", entryFee: "Free", timings: "All day",
          desc: "A historic seaside district shaped by centuries of spice merchant trade, Fort Kochi is a charming melting pot of Dutch, Portuguese, British, and local cultures. Along the coastline, iconic giant Chinese fishing nets hang mounted on wooden structures, gracefully lowering into the blue currents. The town's cobblestone streets are lined with colonial houses, old warehouses, and the historic St. Francis Church where Vasco da Gama was originally buried. Cozy cafes, spice markets, and Kathakali theaters dot the neighborhoods.",
          image: IMG.fortkochi, nearby: ["Mattancherry Palace", "Jewish Synagogue", "Santa Cruz Cathedral"]
        }
      ]
    },
    {
      id: "uttarakhand", name: "Uttarakhand", capital: "Dehradun", region: "North",
      tagline: "Dev Bhoomi - Land of the Gods", color: "#1A6B8A", image: IMG.uttarakhand,
      places: [
        {
          id: "kedarnath", name: "Kedarnath Temple", city: "Rudraprayag", lat: 30.7352, lng: 79.0669, category: "Religious", rating: 4.9, bestTime: "May–Jun, Sep–Oct", entryFee: "Free", timings: "4:00 AM–9:00 PM",
          desc: "Perched majestically at an altitude of 3,583 meters in the Garhwal Himalayas, Kedarnath is one of the most sacred Hindu shrines dedicated to Lord Shiva. Surrounded by a dramatic amphitheater of snow-clad mountains and glaciers, the ancient temple is constructed of heavy grey granite slabs. Dedicated pilgrims undertake an arduous 16 km trek from Gaurikund through vertical trails to seek blessings. Standing resilient against extreme alpine winters, the temple is an ultimate spiritual experience, carrying deep positive energies.",
          image: IMG.kedarnath, nearby: ["Vasuki Tal", "Gandhi Sarovar", "Chorabari Tal"]
        },
        {
          id: "rishikesh", name: "Rishikesh", city: "Rishikesh", lat: 30.1087, lng: 78.2932, category: "Adventure", rating: 4.7, bestTime: "Sep–Nov, Feb–May", entryFee: "Free", timings: "All day",
          desc: "Renowned as the global 'Yoga Capital of the World', Rishikesh rests in the Himalayan foothills where the holy River Ganges cascades into the plains. The town is physically connected by the famous suspension bridges, Ram Jhula and Laxman Jhula, which sway over the pristine turquoise currents. Rishikesh balances ashram-based spiritual meditation with extreme adventure sports. Travelers from across the globe gather for spiritual yoga, white-water rafting, bungee jumping, and to witness the serene evening Ganga Aarti on Triveni Ghat.",
          image: IMG.rishikesh, nearby: ["Haridwar", "Neelkanth Mahadev Temple", "Beatles Ashram"]
        },
        {
          id: "jim-corbett", name: "Jim Corbett National Park", city: "Nainital", lat: 29.5300, lng: 78.7747, category: "Nature", rating: 4.8, bestTime: "Nov–Jun", entryFee: "₹350 (Indian), ₹1500 (Foreign)", timings: "6:00 AM–9:00 AM, 2:00 PM–5:00 PM",
          desc: "Established in 1936 as Hailey National Park, Jim Corbett is India's oldest national park and the historic birthplace of the 'Project Tiger' initiative. Spanning the foothills of the Himalayas, its diverse terrain includes riverine belts, grasslands, marshes, and dense sal forests. It houses dynamic populations of royal Bengal tigers, leopards, wild Asiatic elephants, and over 600 species of birds. Jeep and elephant safaris in the Dhikala and Bijrani zones offer incredible opportunities to observe wildlife.",
          image: IMG.corbett, nearby: ["Nainital Lake", "Corbett Falls", "Garjia Devi Temple"]
        },
        {
          id: "auli", name: "Auli Ski Resort", city: "Chamoli", lat: 30.5236, lng: 79.5569, category: "Adventure", rating: 4.5, bestTime: "Jan–Mar", entryFee: "Activity fee varies", timings: "All day",
          desc: "Auli is a premier high-altitude ski destination in India, sitting at 2,500 meters amidst pine forests and snowy meadows. It offers breathtaking, unobstructed vistas of high Himalayan giants, including the legendary twin peaks of Nanda Devi. During winters, Auli transforms into a white wonderland, attracting skiing enthusiasts to its perfectly groomed, steep alpine slopes. An iconic ropeway connects Auli to Joshimath, providing spectacular aerial views of pristine forests and ski trails below.",
          image: IMG.auli, nearby: ["Joshimath", "Gurso Bugyal", "Kwani Bugyal"]
        },
        {
          id: "valley-of-flowers", name: "Valley of Flowers", city: "Chamoli", lat: 30.7282, lng: 79.6050, category: "Nature", rating: 4.8, bestTime: "Jul–Sep", entryFee: "₹200 (Indian), ₹800 (Foreign)", timings: "6:00 AM–5:00 PM",
          desc: "An enchanted, high-altitude alpine meadow nestled in the West Himalayas, the Valley of Flowers is a designated UNESCO World Heritage Site. Spread over pristine dales, it comes alive during monsoon months with a colorful carpet of over 500 species of wildflowers, including rare blue poppies and Cobra lilies. The valley is home to rare and endangered animals, such as the Asiatic black bear, snow leopard, and blue sheep. To reach this paradise, visitors embark on a scenic 17 km trek from Govindghat.",
          image: IMG.valleyFlowers, nearby: ["Hemkund Sahib", "Badrinath", "Ghangaria"]
        }
      ]
    },
    {
      id: "goa", name: "Goa", capital: "Panaji", region: "West",
      tagline: "Susegad and Scenic Coasts", color: "#E8A020", image: IMG.goa,
      places: [
        {
          id: "basilica-bom-jesus", name: "Basilica of Bom Jesus", city: "Old Goa", lat: 15.5009, lng: 73.9116, category: "Heritage", rating: 4.7, bestTime: "Oct–Mar", entryFee: "Free", timings: "9:00 AM–6:30 PM",
          desc: "A UNESCO World Heritage Site, this magnificent 16th-century Basilica is one of the most celebrated historical landmarks of Portuguese rule in India. Constructed from red laterite blocks, it displays exemplary baroque and Catholic architectural styles. The church is famous for housing the sacred, preserved relics of St. Francis Xavier in an ornate silver casket. The majestic interiors are decorated with exquisite gold-leaf altars, towering Corinthian pillars, and ancient paintings portraying the life of the saint.",
          image: IMG.bomJesus, nearby: ["Se Cathedral", "Church of St. Cajetan", "Goa State Museum"]
        },
        {
          id: "baga-beach", name: "Baga Beach", city: "North Goa", lat: 15.5559, lng: 73.7516, category: "Nature", rating: 4.3, bestTime: "Nov–Feb", entryFee: "Free", timings: "All day",
          desc: "One of the most happening and high-energy beaches in North Goa, Baga Beach is a paradise for ocean lovers and nightlife seekers. The long sandy stretch is vibrant, featuring a wide array of thrill-seeking watersports, such as parasailing, jet skiing, and windsurfing. Beach shacks line the coast, serving local coastal curries and fresh seafood accompanied by live acoustic music. In the evenings, Baga transitions into a festive avenue with neon lights and karaoke parties.",
          image: IMG.bagaBeach, nearby: ["Calangute Beach", "Anjuna Market", "Chapora Fort"]
        },
        {
          id: "dudhsagar", name: "Dudhsagar Falls", city: "South Goa", lat: 15.3144, lng: 74.3142, category: "Nature", rating: 4.8, bestTime: "Jun–Dec", entryFee: "₹400 (Jeep entry)", timings: "7:00 AM–5:00 PM",
          desc: "Cascading down four grand tiers within the Bhagwan Mahavir Sanctuary, Dudhsagar Falls is one of India's tallest and most spectacular waterfalls. Literally translating to a 'Sea of Milk', the gushing waters plunge 310 meters down a sheer cliff, creating thick mists that look like frothing cream. Surrounded by rich deciduous forests and home to playful monkeys, the falls are famously crossed by a historic railway bridge, presenting a dramatic sight as trains ride across the roaring water.",
          image: IMG.dudhsagar, nearby: ["Bhagwan Mahavir Wildlife Sanctuary", "Mollem National Park", "Devil's Canyon"]
        },
        {
          id: "aguada-fort", name: "Aguada Fort", city: "Candolim", lat: 15.4952, lng: 73.7691, category: "Heritage", rating: 4.4, bestTime: "Oct–Mar", entryFee: "Free", timings: "8:30 AM–5:30 PM",
          desc: "A formidable 17th-century Portuguese fortress, Fort Aguada stands proudly as a sentinel at the mouth of the Mandovi River. Originally built to protect Portuguese shipping and early colonies from Dutch and Maratha fleets, it features a massive water reservoir capable of storing millions of gallons of fresh water, which gave it the name 'Aguada' (water). The fort also houses an iconic four-story lighthouse and offers magnificent, panoramic vistas of the endless blue Arabian Sea.",
          image: IMG.aguada, nearby: ["Calangute Beach", "Candolim Beach", "Sinquerim Beach"]
        }
      ]
    },
    {
      id: "madhya-pradesh", name: "Madhya Pradesh", capital: "Bhopal", region: "Central",
      tagline: "The Heart of Incredible India", color: "#7B2D8B", image: IMG.mp,
      places: [
        {
          id: "khajuraho", name: "Khajuraho Temples", city: "Khajuraho", lat: 24.8318, lng: 79.9199, category: "Heritage", rating: 4.8, bestTime: "Oct–Mar", entryFee: "₹50 (Indian), ₹600 (Foreign)", timings: "Sunrise–Sunset",
          desc: "A world-renowned UNESCO World Heritage Site, the temples of Khajuraho are some of the finest expressions of Indian medieval art and Nagara architecture. Built by the Chandela Dynasty between 950 and 1050 AD, only 20 of the original 85 temples remain well-preserved today. The sandstone structures are celebrated for their intricate, detailed, and highly sensuous stone carvings depicting daily medieval life, dance, war, and spiritual union. The Lakshmana Temple and Kandariya Mahadeva Temple stand out for their soaring spires.",
          image: IMG.khajuraho, nearby: ["Panna National Park", "Raneh Falls", "Ajaigarh Fort"]
        },
        {
          id: "bandhavgarh", name: "Bandhavgarh National Park", city: "Umaria", lat: 23.7218, lng: 81.0357, category: "Nature", rating: 4.8, bestTime: "Oct–Jun", entryFee: "₹1,500 (Jeep Safari)", timings: "6:00 AM–9:00 AM, 3:00 PM–6:00 PM",
          desc: "Once a royal hunting ground for the Maharajas of Rewa, Bandhavgarh National Park boasts the highest density of Bengal tigers of any reserve in India. Spanning lush green valleys, rocky hills, and dense sal forests, it is famous for incredible tiger sightings. At the park's heart is a towering 800-meter cliff holding the ancient ruins of the 2,000-year-old Bandhavgarh Fort, presenting a dramatic backdrop. Safaris reveal leopards, bison (gaur), barking deer, and a rich variety of birdlife.",
          image: IMG.bandhavgarh, nearby: ["Bandhavgarh Fort", "Sita Mandap", "Bhitari Lake"]
        },
        {
          id: "sanchi-stupa", name: "Sanchi Stupa", city: "Sanchi", lat: 23.4793, lng: 77.7397, category: "Heritage", rating: 4.7, bestTime: "Oct–Mar", entryFee: "₹30 (Indian), ₹600 (Foreign)", timings: "Sunrise–Sunset",
          desc: "The Great Stupa at Sanchi is India's oldest stone structure and one of the finest Buddhist monuments in the entire world. Originally commissioned by the Great Emperor Ashoka in the 3rd century BC, the stupa was designed to house the sacred relics of Lord Buddha. It is universally celebrated for its four beautifully carved toranas (ornate gateways) that depict Jataka tales, spiritual motifs, and historical legends with exquisite detail, forming a peaceful haven of Buddhist philosophy and architecture.",
          image: IMG.sanchi, nearby: ["Vidisha", "Gyaraspur", "Udayagiri Caves"]
        },
        {
          id: "orchha", name: "Orchha Fort Complex", city: "Orchha", lat: 25.3518, lng: 78.6408, category: "Heritage", rating: 4.6, bestTime: "Oct–Mar", entryFee: "₹250 (Indian), ₹600 (Foreign)", timings: "10:00 AM–5:00 PM",
          desc: "Established in the 16th century by Bundela Rajput chiefs, Orchha is a magnificent royal town frozen in time along the scenic banks of the Betwa River. The Orchha Fort Complex is a grand fortress housing ancient palaces, including the majestic Raja Mahal and the multi-story Jehangir Mahal built to honor a Mughal emperor. Encircled by massive battlements, stone cenotaphs (chhatris) of royal kings rise on the river edge, radiating an atmospheric, historical, and deeply romantic charm.",
          image: IMG.orchha, nearby: ["Chaturbhuj Temple", "Laxminarayan Temple", "Phool Bagh"]
        }
      ]
    },
    {
      id: "himachal-pradesh", name: "Himachal Pradesh", capital: "Shimla", region: "North",
      tagline: "In the Lap of Snowy Peaks", color: "#4A90D9", image: IMG.himachal,
      places: [
        {
          id: "manali", name: "Rohtang Pass & Manali", city: "Manali", lat: 32.2396, lng: 77.1887, category: "Adventure", rating: 4.8, bestTime: "May–Jun, Sep–Nov", entryFee: "₹550 (Entry Permit)", timings: "All day",
          desc: "Manali is a charming, high-altitude mountain resort nestled in the Beas River Valley. It serves as an ultimate hub for adventure, offering activities like paragliding in Solang Valley and snow adventures at Rohtang Pass, which sits at 3,978 meters. The pass provides unmatched, towering views of giant peaks, glaciers, and the cold desert valley of Lahaul. Visitors can explore ancient wooden temples like the Hadimba Temple or relax in cozy cafes in the bohemian lanes of Old Manali.",
          image: IMG.manali, nearby: ["Solang Valley", "Hadimba Temple", "Old Manali"]
        },
        {
          id: "spiti-valley", name: "Spiti Valley", city: "Kaza", lat: 32.2273, lng: 78.0718, category: "Adventure", rating: 4.9, bestTime: "Jun–Sep", entryFee: "Permit required for border areas", timings: "All day",
          desc: "Spiti is a cold desert mountain valley elevated 3,800 meters in the high Himalayas. Famously termed the 'Middle Land' between India and Tibet, it features winding roads, barren brown mountains, and snow-fed streams. The valley holds iconic ancient monasteries, such as the white-washed Key Monastery built like a fortress on a conical hill. With its pristine air, starry night skies, and remote traditional culture, Spiti is a rugged and peaceful haven for intrepid travelers.",
          image: IMG.spiti, nearby: ["Key Monastery", "Chandratal Lake", "Pin Valley"]
        },
        {
          id: "shimla", name: "Shimla", city: "Shimla", lat: 31.1048, lng: 77.1734, category: "Heritage", rating: 4.5, bestTime: "Mar–Jun, Dec–Jan", entryFee: "Free", timings: "All day",
          desc: "Blessed with beautiful pine forests and breathtaking mountain horizons, Shimla was once the summer capital of British India. The town carries a distinct colonial heritage, seen in its pedestrian-only Mall Road, Tudor-style houses, and the iconic Viceregal Lodge. The neo-Gothic Christ Church with its stained glass windows stands as an iconic landmark at the Ridge. Travelers love the historic Kalka-Shimla Toy Train ride, which traverses dense mountain woods and old bridges.",
          image: IMG.shimla, nearby: ["Christ Church", "Jakhu Temple", "Kufri"]
        },
        {
          id: "dharamshala", name: "Dharamshala & McLeod Ganj", city: "Dharamshala", lat: 32.2190, lng: 76.3234, category: "Religious", rating: 4.7, bestTime: "Mar–May, Sep–Nov", entryFee: "Free", timings: "All day",
          desc: "Dharamshala and its sister town McLeod Ganj are internationally famous as the spiritual home of the Tibetan government in exile and the Dalai Lama. Resting in the shadow of the spectacular, snow-crested Dhauladhar range, the town is a colorful blend of Tibetan and Indian cultures. Peace-seeking travelers visit the sacred Tsuglagkhang Temple, walk through pine-clad trails, browse colorful markets filled with hand-knitted prayer flags, and learn yoga or Buddhist meditation in peaceful monasteries.",
          image: IMG.dharamshala, nearby: ["Namgyal Monastery", "Bhagsu Waterfall", "Dal Lake"]
        }
      ]
    },
    {
      id: "tamil-nadu", name: "Tamil Nadu", capital: "Chennai", region: "South",
      tagline: "The Land of Ancient Temples", color: "#C0392B", image: IMG.tn,
      places: [
        {
          id: "meenakshi-temple", name: "Meenakshi Amman Temple", city: "Madurai", lat: 9.9195, lng: 78.1193, category: "Religious", rating: 4.9, bestTime: "Oct–Mar", entryFee: "Free", timings: "5:00 AM–12:30 PM, 4:00 PM–10:00 PM",
          desc: "A mesmerizing and monumental marvel of Dravidian architecture, the Meenakshi Amman Temple forms the historic heart of Madurai. The enormous complex features 14 towering gopurams (gateway towers), the tallest rising to 170 feet and covered in thousands of colorful stone figures of gods, demons, and mythological creatures. Inside is the breathtaking Golden Lotus Tank and the legendary Hall of a Thousand Pillars, each intricately sculpted with lifelike details, serving as an ultimate spiritual and classical art center.",
          image: IMG.meenakshi, nearby: ["Thirumalai Nayakkar Palace", "Gandhi Memorial Museum", "Alagar Koil"]
        },
        {
          id: "mahabalipuram", name: "Shore Temple Mahabalipuram", city: "Mahabalipuram", lat: 12.6169, lng: 80.1927, category: "Heritage", rating: 4.7, bestTime: "Oct–Mar", entryFee: "₹40 (Indian), ₹600 (Foreign)", timings: "6:00 AM–6:00 PM",
          desc: "Dating back to the 8th century AD, the Shore Temple in Mahabalipuram is a stunning stone-cut architectural wonder sitting directly on the shores of the Bay of Bengal. Built during the reign of the Pallava Dynasty, this UNESCO World Heritage Site is constructed with heavy blocks of local granite designed to withstand salty ocean winds. The complex boasts magnificent bas-relief monoliths, five monolithic rock temples (Pancha Rathas), and a historic carving called 'Arjuna's Penance'.",
          image: IMG.mahabalipuram, nearby: ["Arjuna's Penance", "Five Rathas", "Tiger Cave"]
        },
        {
          id: "ooty", name: "Ooty Nilgiris", city: "Ooty", lat: 11.4102, lng: 76.6950, category: "Nature", rating: 4.5, bestTime: "Apr–Jun", entryFee: "Garden fee approx. ₹30", timings: "All day",
          desc: "Known as the capital 'Queen of Hill Stations', Ooty is a gorgeous retreat nestled amidst the emerald layers of the Nilgiri Hills, or Blue Mountains. The town is famous for neat, aromatic tea plantations, majestic eucalyptus groves, and beautiful rose gardens. Visitors can ride the iconic Nilgiri Mountain Railway toy train, which uses a vintage steam rack system to climb through deep ravines, or enjoy peaceful boating on Ooty Lake surrounded by pine forests.",
          image: IMG.ooty, nearby: ["Doddabetta Peak", "Mudumalai National Park", "Coonoor"]
        },
        {
          id: "brihadeeswarar", name: "Brihadeeswarar Temple", city: "Thanjavur", lat: 10.7828, lng: 79.1318, category: "Heritage", rating: 4.8, bestTime: "Oct–Mar", entryFee: "Free", timings: "6:00 AM–12:30 PM, 4:00 PM–8:30 PM",
          desc: "An incredible architectural wonder built in 1010 AD by Raja Raja Chola I, the Brihadeeswarar Temple of Thanjavur is a premier UNESCO World Heritage Site. Locally termed the 'Big Temple', this granitic masterpiece is dedicated to Lord Shiva. It features a soaring 216-foot vimana (temple tower) constructed with a interlocking puzzle technique without using any mortar. At the entrance lies a massive monolithic statue of Nandi (the sacred bull) carved from a single colossal stone weighing over 20 tons.",
          image: IMG.brihadeeswarar, nearby: ["Saraswathi Mahal Library", "Thanjavur Palace", "Art Gallery"]
        }
      ]
    },
    {
      id: "gujarat", name: "Gujarat", capital: "Gandhinagar", region: "West",
      tagline: "Vibrant and Energetic Land", color: "#E67E22", image: IMG.gujarat,
      places: [
        {
          id: "rann-of-kutch", name: "Rann of Kutch", city: "Bhuj", lat: 23.7337, lng: 69.8597, category: "Nature", rating: 4.8, bestTime: "Nov–Feb", entryFee: "₹100 (Indian/Foreign)", timings: "All day",
          desc: "The Great Rann of Kutch is one of the world's largest salt deserts, presenting a surreal and endless white salt flat stretching into the horizon. During the winter Rann Utsav festival, the desert lights up, showcasing traditional Kutchi embroidery, folk music, and local craftsmanship. The vast white wilderness is incredibly magical under full-moon nights, reflecting a cold silver glow. Travelers can enjoy camel safaris, hot-air ballooning, and explore traditional mud-brick bhunga residences.",
          image: IMG.rann, nearby: ["Kalo Dungar", "Dholavira", "Mandvi Beach"]
        },
        {
          id: "somnath-temple", name: "Somnath Temple", city: "Veraval", lat: 20.8880, lng: 70.4013, category: "Religious", rating: 4.8, bestTime: "Oct–Mar", entryFee: "Free", timings: "6:00 AM–9:30 PM",
          desc: "Steeped in ancient mythology, Somnath is the first of the twelve sacred Jyotirlingas of Lord Shiva in India. Standing proudly on the coast of the Arabian Sea, this golden temple has been demolished heavily and rebuilt seven times throughout history, remaining an ultimate symbol of resilience and devotion. Built in the elegant Chalukya architecture, it features detailed carvings, a golden dome, and an iconic light show, while the ocean waves physically crash against the high temple boundary walls.",
          image: IMG.somnath, nearby: ["Bhalka Tirth", "Triveni Sangam", "Gita Mandir"]
        },
        {
          id: "gir-forest", name: "Gir National Park", city: "Junagadh", lat: 21.1244, lng: 70.7949, category: "Nature", rating: 4.7, bestTime: "Dec–Apr", entryFee: "₹150 (Indian), ₹1500 (Foreign)", timings: "6:30 AM–9:00 AM, 3:00 PM–5:30 PM",
          desc: "Gir National Park is globally unique, serving as the very last remaining refuge on Earth for the majestic, endangered Asiatic lions. The park features dry deciduous forests, rugged hills, and rivers that host a vibrant ecosystem of leopards, striped hyenas, jackals, sambar deer, and marsh crocodiles. Safe safari tracks wind through the teak woods, offering deep chances to spot a pride of lions resting in the shade or crossing the roads peacefully.",
          image: IMG.gir, nearby: ["Devalia Safari Park", "Kamleshwar Dam", "Somnath"]
        }
      ]
    },
    {
      id: "west-bengal", name: "West Bengal", capital: "Kolkata", region: "East",
      tagline: "The Crucible of Art and Literature", color: "#27AE60", image: IMG.wb,
      places: [
        {
          id: "darjeeling", name: "Darjeeling & Tiger Hill", city: "Darjeeling", lat: 27.0360, lng: 88.2627, category: "Nature", rating: 4.8, bestTime: "Mar–May, Sep–Nov", entryFee: "Tiger Hill Entry ₹50", timings: "4:00 AM Viewpoint",
          desc: "Set high in the chilly Himalayas, Darjeeling is globally praised for its rolling tea plantations producing some of the world's most aromatic tea classes. At dawn, travelers ride to Tiger Hill to witness a spectacular golden sunrise illuminating the massive, snowy face of Mount Kanchenjunga. The town is famously navigated by the Darjeeling Himalayan Railway, a historic UNESCO toy train that chugs gracefully past markets and looping garden tracks, radiating vintage colonial-era charm.",
          image: IMG.darjeeling, nearby: ["Batasia Loop", "Peace Pagoda", "Happy Valley Tea Estate"]
        },
        {
          id: "victoria-memorial", name: "Victoria Memorial", city: "Kolkata", lat: 22.5448, lng: 88.3426, category: "Heritage", rating: 4.7, bestTime: "Oct–Mar", entryFee: "₹30 (Indian), ₹500 (Foreign)", timings: "10:00 AM–5:00 PM (Mon closed)",
          desc: "Constructed using fine Makrana marble, the Victoria Memorial is a grand, domed palace standing in the heart of Kolkata as a historic tribute to Queen Victoria. Completed in 1921, the building elegantly blends Indo-Saracenic, British, and Mughal styles, surrounded by manicured green gardens and pools. Today, it serves as a premier historical museum, displaying collections of oil paintings, vintage maps, coins, armaments, and memorabilia from India's colonial past.",
          image: IMG.victoria, nearby: ["Howrah Bridge", "Dakshineswar Kali Temple", "Indian Museum"]
        },
        {
          id: "sundarbans", name: "Sundarbans National Park", city: "24 Parganas", lat: 21.9497, lng: 89.1833, category: "Nature", rating: 4.6, bestTime: "Sep–Mar", entryFee: "₹100 (Indian), ₹800 (Foreign)", timings: "All day",
          desc: "A massive, mysterious UNESCO World Heritage Site, the Sundarbans forms the largest mangrove forest delta in the entire world, situated on the Bay of Bengal. Channels of salt water wind through a tangled network of roots where the royal Bengal tiger reigns supreme. These tigers have famously adapted to swimming in saline currents to hunt. Safaris are executed entirely using small, slow boats, gliding past muddy banks to catch glimpses of spotted crocodiles, monitor lizards, and birds.",
          image: IMG.sundarbans, nearby: ["Sajnekhali Wildlife Sanctuary", "Netidhopani", "Gosaba"]
        }
      ]
    },
    {
      id: "uttar-pradesh", name: "Uttar Pradesh", capital: "Lucknow", region: "North",
      tagline: "A Journey Through Timeless India", color: "#8E44AD", image: IMG.up,
      places: [
        {
          id: "taj-mahal", name: "Taj Mahal", city: "Agra", lat: 27.1751, lng: 78.0421, category: "Heritage", rating: 5.0, bestTime: "Oct–Mar", entryFee: "₹50 (Indian), ₹1,100 (Foreign)", timings: "Sunrise to Sunset (Fri Closed)",
          desc: "An ultimate symbol of eternal love, the Taj Mahal is a soaring, pristine monument of white marble built by the Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal. Completed in 1648, this UNESCO World Heritage Site and New Seven Wonders of the World represents the peak of Mughal architecture. The structure is mathematically symmetrical, decorated with gorgeous floral inlay work utilizing precious lapis lazuli, jade, and carnelian. The marble shifts beautifully, glowing pink at dawn, bright white at noon, and golden under moonlight.",
          image: IMG.tajMahal, nearby: ["Agra Fort", "Fatehpur Sikri", "Itimad-ud-Daulah"]
        },
        {
          id: "varanasi", name: "Varanasi Ghats", city: "Varanasi", lat: 25.3176, lng: 83.0062, category: "Religious", rating: 4.9, bestTime: "Oct–Mar", entryFee: "Free", timings: "All day (Ganga Aarti at sunset)",
          desc: "Varanasi is one of the oldest continuously inhabited cities on the globe, revered as the ultimate spiritual heart of Hinduism. Along the pristine banks of the River Ganges are nearly 84 ghats (stone step terraces) where centuries-old spiritual ceremonies are performed daily. At dusk, the famous Dashashwamedh Ghat hosts the majestic Ganga Aarti, where saffron-clad priests blow conch shells and wave giant brass incense lamps in unison. Taking a morning boat ride reveals pilgrims bathing in holy waters, sadhus medatating, and life and death moving in a timeless stream.",
          image: IMG.varanasi, nearby: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath"]
        },
        {
          id: "agra-fort", name: "Agra Fort", city: "Agra", lat: 27.1795, lng: 78.0211, category: "Heritage", rating: 4.7, bestTime: "Oct–Mar", entryFee: "₹50 (Indian), ₹650 (Foreign)", timings: "Sunrise–Sunset",
          desc: "Constructed of robust red sandstone by Emperor Akbar in 1565, Agra Fort is a massive, fortified city that served as the primary imperial residence of early Mughal rulers. The fortress is enveloped by double-walled battlements and deep moats, holding gorgeous palaces such as the Jahangiri Mahal, Khas Mahal, and the Diwan-i-Khas. In his final years, Emperor Shah Jahan was imprisoned here by his son Aurangzeb, gazing sadly out at his masterpiece of love, the Taj Mahal, from the beautiful octagonal marble tower of Musamman Burj.",
          image: IMG.agraFort, nearby: ["Taj Mahal", "Fatehpur Sikri", "Mehtab Bagh"]
        },
        {
          id: "lucknow", name: "Bara Imambara", city: "Lucknow", lat: 26.8688, lng: 80.9108, category: "Heritage", rating: 4.6, bestTime: "Oct–Mar", entryFee: "₹50 (Indian), ₹500 (Foreign)", timings: "6:00 AM–5:00 PM",
          desc: "Built in 1784 by Nawab Asaf-ud-Daula as a relief program during a famine, the Bara Imambara in Lucknow is a majestic and mysterious monument. The central arched hall is 50 meters long and 15 meters high, uniquely constructed without any iron beams, pillars, or wooden supports. Above the hall sits the Bhul Bhulaiya, an incredible labyrinth of over a thousand interconnected, confusing stone corridors designed to disorient invaders, offering beautiful views from its top balustrades.",
          image: IMG.baraImambara, nearby: ["Chhota Imambara", "Rumi Darwaza", "Residency Ruins"]
        },
        {
          id: "mathura-vrindavan", name: "Mathura & Vrindavan", city: "Mathura", lat: 27.4924, lng: 77.6737, category: "Religious", rating: 4.7, bestTime: "Feb–Mar (Holi), Oct–Nov", entryFee: "Free", timings: "All day",
          desc: "Mathura, the sacred birthplace of Lord Krishna, and nearby Vrindavan, where he spent his youthful days, are twin pilgrimage towns filled with incredible devotion. Home to over 5,000 temples such as the Dwarkadhish Temple, Banke Bihari Temple, and the modern Prem Mandir, these cities hum with colorful chants. The towns are universally famous for celebrating Holi with colors, flowers, and devotional joy, attracting thousands of spiritual seekers to participate in the joyous spiritual melodies.",
          image: IMG.mathura, nearby: ["Govardhan Hill", "Radha Kund", "Barsana"]
        }
      ]
    },
    {
      id: "karnataka", name: "Karnataka", capital: "Bengaluru", region: "South",
      tagline: "One State, Many Worlds", color: "#D4AC0D", image: IMG.karnataka,
      places: [
        {
          id: "hampi", name: "Hampi Ruins", city: "Hampi", lat: 15.3350, lng: 76.4600, category: "Heritage", rating: 4.9, bestTime: "Oct–Feb", entryFee: "₹40 (Indian), ₹600 (Foreign)", timings: "Sunrise–Sunset",
          desc: "The monumental ruins of Hampi are a UNESCO World Heritage Site spread across a surreal, dramatic landscape of giant granite boulders and green banana groves. Once the glorious capital of the 14th-century Vijayanagara Empire, it was once one of the wealthiest cities in the world. Visitors can explore grand temples, including the active Virupaksha Temple and the Vittala Temple with its legendary stone chariot and musical pillars that chime when tapped. The historical ruins and monuments are highly majestic.",
          image: IMG.hampi, nearby: ["Virupaksha Temple", "Vittala Temple", "Lotus Mahal"]
        },
        {
          id: "mysore-palace", name: "Mysore Palace", city: "Mysore", lat: 12.3052, lng: 76.6552, category: "Heritage", rating: 4.8, bestTime: "Oct", entryFee: "₹100 (Indian), ₹200 (Foreign)", timings: "10:00 AM–5:30 PM",
          desc: "A stunning masterpiece of Indo-Saracenic design, the Mysore Palace is one of India's most visited and grandest royal palaces. Serving as the seat of the Wodeyar Dynasty, its interiors feature stained glass ceilings, beautifully carved wooden doors, and mirrors imported from Europe. During the autumn Dasara festival, the palace serves as the center of celebrations. Every Sunday evening and throughout Dasara, the entire palace is illuminated by over 100,000 bulbs, glowing beautifully in the dark.",
          image: IMG.mysore, nearby: ["Chamundi Hill", "Mysore Zoo", "Brindavan Gardens"]
        },
        {
          id: "coorg", name: "Coorg Coffee Country", city: "Coorg", lat: 12.3375, lng: 75.8069, category: "Nature", rating: 4.7, bestTime: "Oct–Mar", entryFee: "Free", timings: "All day",
          desc: "Often termed the 'Scotland of India', Coorg is a picturesque mountain district covered in sprawling coffee and spice plantations. Surrounded by foggy misty hills, gushing waterfalls, and rich forests, it has a wonderfully cool climate. Travelers can tour lush estates to learn coffee farming, hike to peaks like Tadiandamol, visit the golden temples of the Tibetan Tibetan settlement in Bylakuppe, or feed elephants at the Dubare Elephant Camp along the Kaveri River.",
          image: IMG.coorg, nearby: ["Abbey Falls", "Raja's Seat", "Dubare Elephant Camp"]
        }
      ]
    },
    {
      id: "andhra-pradesh", name: "Andhra Pradesh", capital: "Amaravati", region: "South",
      tagline: "The Land of the Sunrise State", color: "#16A085", image: IMG.ap,
      places: [
        {
          id: "tirupati", name: "Tirumala Tirupati", city: "Tirupati", lat: 13.6288, lng: 79.4192, category: "Religious", rating: 5.0, bestTime: "Sep–Feb", entryFee: "Free (Special Entry ₹300)", timings: "2:30 AM–1:00 AM",
          desc: "Tirumala Venkateswara Temple is sits high on the scenic seven hills of Seshachalam in Tirupati. Dedicated to Lord Venkateswara (an incarnation of Lord Vishnu), it is recognized as one of the richest and most visited religious temples globally, attracting nearly 50,000 to 100,000 devotees daily. The temple features majestic gold-covered roofs, spiritual chants, and a grand dining hall distributing delicious 'Laddu' prasadam, making it a powerful spiritual experience of deep faith.",
          image: IMG.tirupati, nearby: ["Tiruchanur", "Kapila Theertham", "Chandragiri Fort"]
        },
        {
          id: "araku-valley", name: "Araku Valley", city: "Visakhapatnam", lat: 18.3273, lng: 82.8755, category: "Nature", rating: 4.6, bestTime: "Oct–Feb", entryFee: "Free", timings: "All day",
          desc: "Araku Valley is a scenic and tranquil hill station nestled in the Eastern Ghats, famous for its rich tribal heritage, organic coffee gardens, and beautiful landscape. Winding roads flanked by dense forests and orchards lead visitors to this misty haven. Travelers can explore the deep, prehistoric Borra Caves containing ancient dripstone limestone formations of stalactites, learn indigenous history at the Tribal Museum, and taste local coffee freshly brewed by local tribes.",
          image: IMG.araku, nearby: ["Borra Caves", "Chaparai Waterfalls", "Ananthagiri"]
        }
      ]
    },
    {
      id: "maharashtra", name: "Maharashtra", capital: "Mumbai", region: "West",
      tagline: "The Spirit of Solid Fortresses", color: "#E74C3C", image: IMG.maha,
      places: [
        {
          id: "ajanta-ellora", name: "Ajanta & Ellora Caves", city: "Aurangabad", lat: 20.5519, lng: 75.7033, category: "Heritage", rating: 4.9, bestTime: "Oct–Mar", entryFee: "₹40 (Indian), ₹600 (Foreign)", timings: "9:00 AM–5:30 PM",
          desc: "A UNESCO World Heritage Site, Ajanta and Ellora Caves are magnificent rock-cut temples carved out of solid basalt cliffs from the 2nd century BC to 10th century AD. Ajanta holds beautiful Buddhist caves with detailed, classical paintings depicting Jataka tales in vibrant colors. Ellora features 34 caves representing Hindu, Jain, and Buddhist philosophies, highlighted by the architectural marvel of the Kailash Temple, which was carved top-down out of a single mountain cliff over a span of 100 years.",
          image: IMG.ajanta, nearby: ["Bibi Ka Maqbara", "Daulatabad Fort", "Lonar Crater"]
        },
        {
          id: "gateway-of-india", name: "Gateway of India", city: "Mumbai", lat: 18.9220, lng: 72.8347, category: "Heritage", rating: 4.5, bestTime: "Oct–Feb", entryFee: "Free", timings: "All day",
          desc: "A monumental archway standing proudly on Mumbai's waterfront, the Gateway of India was constructed in 1924 to honor the visit of King George V. Blending Roman elements with traditional Hindu-Muslim motifs, the grand structure overlooks the vast harbor. Today, it serves as a bustling public gathering spot lined with local photographers, balloon vendors, and cruise boats heading to Elephanta Caves. It is surrounded by the historic Taj Mahal Palace Hotel, presenting an iconic coastal cityscape.",
          image: IMG.gatewayIndia, nearby: ["Elephanta Caves", "Colaba Causeway", "Taj Mahal Palace Hotel"]
        },
        {
          id: "lonavala", name: "Lonavala & Khandala", city: "Pune", lat: 18.7481, lng: 73.4072, category: "Nature", rating: 4.4, bestTime: "Jun–Sep", entryFee: "Free", timings: "All day",
          desc: "Lonavala and Khandala are twin hill resorts nestled high in the Western Ghats (Sahyadris), especially celebrated for their incredible beauty during monsoon seasons. The rugged hillsides turn into pristine sheets of green, dotted with hundreds of spontaneous waterfalls and low-hanging mountain mists. Visitors can explore prehistoric Buddhist Karla and Bhaja caves, hike to the scenic Duke's Nose peak for breathtaking sunset views, and buy boxes of the legendary local sweet, chikki.",
          image: IMG.lonavala, nearby: ["Bhushi Dam", "Karla Caves", "Rajmachi Fort"]
        }
      ]
    },
    {
      id: "assam", name: "Assam", capital: "Dispur", region: "Northeast",
      tagline: "The Cradle of Rare Rhinos", color: "#1ABC9C", image: IMG.assam,
      places: [
        {
          id: "kaziranga", name: "Kaziranga National Park", city: "Golaghat", lat: 26.5775, lng: 93.1715, category: "Nature", rating: 4.9, bestTime: "Nov–Apr", entryFee: "₹250 (Indian), ₹1,500 (Foreign)", timings: "7:00 AM–9:00 AM, 2:00 PM–4:00 PM",
          desc: "Bordering the mighty Brahmaputra River, Kaziranga National Park is a legendary UNESCO World Heritage Site holding two-thirds of the globe's population of the endangered one-horned rhinoceros. The landscape features tall elephant grass, wetlands, and thick tropical forests. The reserve boasts a healthy population of Bengal tigers, wild water buffaloes, swamp deer, and rich migratory bird communities, making jeep and elephant safaris an unforgettable wildlife experience.",
          image: IMG.kaziranga, nearby: ["Orang National Park", "Majuli Island", "Sivasagar"]
        },
        {
          id: "majuli", name: "Majuli Island", city: "Majuli", lat: 26.9500, lng: 94.1667, category: "Heritage", rating: 4.6, bestTime: "Oct–Mar", entryFee: "Free", timings: "All day",
          desc: "Majuli is the largest freshwater river island in the world, formed on the massive waters of the Brahmaputra River. It serves as the spiritual and cultural heart of Assamese Neo-Vaishnavite culture, holding many historic monasteries called Satras. Built on wooden stilts, the island's serene villagers excel in classical dance, handloom weaving, and a unique tradition of pottery and making detailed mythological masks out of mud and bamboo, offering a peaceful, rural cultural retreat.",
          image: IMG.majuli, nearby: ["Kamalabari Satra", "Auniati Satra", "Garamur"]
        }
      ]
    },
    {
      id: "punjab", name: "Punjab", capital: "Chandigarh", region: "North",
      tagline: "The Land of Golden Harvests", color: "#F39C12", image: IMG.punjab,
      places: [
        {
          id: "golden-temple", name: "Golden Temple (Harmandir Sahib)", city: "Amritsar", lat: 31.6200, lng: 74.8765, category: "Religious", rating: 5.0, bestTime: "Oct–Mar", entryFee: "Free", timings: "4:00 AM–11:00 PM",
          desc: "Sikhism's most sacred and peaceful shrine, the Harmandir Sahib, popularly called the Golden Temple, is a majestic marble structure plated in pure gold. Standing elegantly in the center of the vast, square Amrit Sarovar (Pool of Nectar), the reflection of its gilded domes in the water is deeply peaceful. The temple values community equality, serving Langar—a free vegetarian kitchen organized entirely by volunteers—providing delicious, warm meals to more than 100,000 visitors every day.",
          image: IMG.goldenTemple, nearby: ["Jallianwala Bagh", "Wagah Border", "Partition Museum"]
        },
        {
          id: "wagah-border", name: "Wagah Border Ceremony", city: "Amritsar", lat: 31.6043, lng: 74.5729, category: "Heritage", rating: 4.7, bestTime: "All Year", entryFee: "Free", timings: "4:00 PM–5:30 PM",
          desc: "Wagah Border is the sole road-crossing point linking India and Pakistan, situated on the historic Grand Trunk Road. Every evening at sunset, the borders come alive during a highly energetic Flag Lowering Ceremony executed in tandem by Indian Border Security Force and Pakistani Rangers. The ceremony features high-stepping military drills, theatrical posturing, patriotic chants, and thunderous crowd cheers, reflecting a lively mixture of pride, discipline, and peaceful border respect.",
          image: IMG.wagah, nearby: ["Golden Temple", "Jallianwala Bagh", "Indo-Pakistan Border"]
        }
      ]
    },
    {
      id: "manipur", name: "Manipur", capital: "Imphal", region: "Northeast",
      tagline: "The Jewel of the Northeast", color: "#9B59B6", image: IMG.manipur,
      places: [
        {
          id: "loktak-lake", name: "Loktak Lake", city: "Moirang", lat: 24.5333, lng: 93.8167, category: "Nature", rating: 4.7, bestTime: "Oct–Mar", entryFee: "₹50", timings: "All day",
          desc: "The largest freshwater lake in Northeast India, Loktak is a scenic marvel famous for its unique 'Phumdis'—floating islands of compact vegetation, organic matter, and soil. The lake holds the Keibul Lamjao National Park, which is recognized as the world's only floating national sanctuary. Here, the rare, endangered Sangai (Brow-antlered Eld's deer) dwells elegantly on the floating marshlands. Taking boat safaris through water pathways lined with colorful lilies is a beautiful nature experience.",
          image: IMG.loktak, nearby: ["Keibul Lamjao NP", "Sendra Park", "INA Memorial Moirang"]
        }
      ]
    },
    {
      id: "meghalaya", name: "Meghalaya", capital: "Shillong", region: "Northeast",
      tagline: "The Abode of Celestial Clouds", color: "#3498DB", image: IMG.meghalaya,
      places: [
        {
          id: "cherrapunji", name: "Double Decker Root Bridge", city: "Cherrapunji", lat: 25.2681, lng: 91.7273, category: "Nature", rating: 4.8, bestTime: "Oct–May", entryFee: "₹50", timings: "All day",
          desc: "Cherrapunji, locally called Sohra, is recognized as one of the wettest spots on Earth, blessed with thick clouds, scenic gorges, and soaring waterfalls like Nohkalikai. It is highly famous for its spectacular Double-Decker Living Root Bridges, grown by the local indigenous Khasi tribes over hundreds of years. Made by directing thick roots of Ficus elastica trees across raging rivers through hollowed bamboo trunks, these organic bridges serve as a self-strengthening, brilliant example of bioengineering.",
          image: IMG.cherrapunji, nearby: ["Nohkalikai Falls", "Mawlynnong", "Wei Sawdong Falls"]
        },
        {
          id: "dawki", name: "Dawki Crystal Clear River", city: "Dawki", lat: 25.1860, lng: 92.0177, category: "Nature", rating: 4.8, bestTime: "Oct–May", entryFee: "Free", timings: "All day",
          desc: "Dawki is a scenic border gateway town resting beside the beautiful, crystalline waters of the Umngot River. During the winter months, the river is so intensely clear and clean that boats floating on the surface appear to fly in mid-air above rocks. Cooled by mountain breezes and flanked by cliffs and hanging trees, the location offers highly scenic boat rides, kayaking, riverside camping on white sand, and lovely border views of Bangladesh's flat horizons.",
          image: IMG.dawki, nearby: ["Shnongpdeng", "Jadukata River", "Dawki Bridge"]
        }
      ]
    },
    {
      id: "odisha", name: "Odisha", capital: "Bhubaneswar", region: "East",
      tagline: "The Ancient Soul of Kalinga", color: "#E67E22", image: IMG.odisha,
      places: [
        {
          id: "konark", name: "Konark Sun Temple", city: "Konark", lat: 19.8876, lng: 86.0945, category: "Heritage", rating: 4.8, bestTime: "Oct–Mar", entryFee: "₹40 (Indian), ₹600 (Foreign)", timings: "6:00 AM–8:00 PM",
          desc: "A stunning UNESCO World Heritage Site, the 13th-century Sun Temple at Konark was designed as a colossal chariot for the Sun God (Surya). Built by King Narasimhadeva I, the temple features 24 detail-carved stone wheels and is led by seven stone horses pulling the monument toward the sea. The temple's facade is fully carved with intricate reliefs portraying daily life, exotic animals, erotic unions, and kings, standing as a stellar peak of Odishan Nagara architecture.",
          image: IMG.konark, nearby: ["Puri Jagannath Temple", "Chilika Lake", "Marine Drive"]
        },
        {
          id: "puri", name: "Jagannath Temple Puri", city: "Puri", lat: 19.8047, lng: 85.8182, category: "Religious", rating: 4.9, bestTime: "Jun–Jul", entryFee: "Free", timings: "5:00 AM–11:00 PM",
          desc: "A primary Char Dham pilgrimage site, the majestic 12th-century Jagannath Temple in Puri is dedicated to Lord Jagannath, a form of Lord Krishna. Known for its massive gate arches, towering spires, and a wooden deity replaced periodically, the temple is celebrated for the massive Rath Yatra (Chariot Festival). The temple operates the world's largest kitchen, where Mahaprasad is prepared using old earthen pots stacked on top of each other, cooked entirely by wood fire.",
          image: IMG.puri, nearby: ["Konark Sun Temple", "Chilika Lake", "Puri Beach"]
        },
        {
          id: "chilika-lake", name: "Chilika Lake", city: "Khurda", lat: 19.7167, lng: 85.3167, category: "Nature", rating: 4.7, bestTime: "Nov–Jan", entryFee: "₹50 (Boating extra)", timings: "All day",
          desc: "Asia's largest coastal brackish lagoon, Chilika Lake is a designated Ramsar wetland holding a rich ecosystem of fish, aquatic plants, and birds. During winter, it serves as an sanctuary for over 200 species of migratory birds flying from Siberia and Central Asia, including flocks of elegant flamingos. In the Satapada area, visitors can take scenic cruise boats to spot rare, playful Irrawaddy dolphins breaching the waves under beautiful sunset horizons.",
          image: IMG.chilika, nearby: ["Nalabana Bird Sanctuary", "Satapada", "Kalijai Temple"]
        }
      ]
    },
    {
      id: "jammu-kashmir", name: "Jammu & Kashmir", capital: "Srinagar", region: "North",
      tagline: "Paradise on Earth", color: "#5DADE2", image: IMG.jk,
      places: [
        {
          id: "dal-lake", name: "Dal Lake & Houseboats", city: "Srinagar", lat: 34.1218, lng: 74.8422, category: "Nature", rating: 4.8, bestTime: "Apr–Oct", entryFee: "Shikara ride ₹200", timings: "All day",
          desc: "Dal Lake is the beautiful 'Crown Jewel' of Srinagar, a quiet sheet of water reflecting the majestic snow-clad Himalayas. Encircled by Mughal Gardens and beautiful chinar trees, it is famous for its elegant handcrafted wooden houseboats and Shikara rides. Visitors can glide slowly in vibrant canopy boats, browse the floating flower and vegetable markets, buy locally woven carpets and saffron, and enjoy hot Kashmiri Kahwa tea as the sun dips beneath the mountain horizons.",
          image: IMG.dalLake, nearby: ["Mughal Gardens", "Shankaracharya Temple", "Hazratbal Shrine"]
        },
        {
          id: "gulmarg", name: "Gulmarg Gondola", city: "Gulmarg", lat: 34.0484, lng: 74.3805, category: "Adventure", rating: 4.8, bestTime: "Dec–Mar", entryFee: "Gondola ticket varies by phase", timings: "10:00 AM–5:00 PM",
          desc: "Gulmarg, meaning 'Meadow of Flowers', is a high-altitude alpine resort famous for snow skiing and pristine valleys. The destination holds Asia's highest and longest cable car system, the Gulmarg Gondola, ascending nearly 4,000 meters up the rugged mountainside. During winter, thick snow blankets the pine forests, turning the area into a premier alpine skiing hub. In summers, the valley displays a canvas of wild lupins, daisies, and clean meadows.",
          image: IMG.gulmarg, nearby: ["St. Mary's Church", "Khilanmarg", "Alpather Lake"]
        },
        {
          id: "pangong-lake", name: "Pangong Tso Lake", city: "Leh", lat: 33.7560, lng: 78.6517, category: "Nature", rating: 4.9, bestTime: "May–Sep", entryFee: "Inner Line Permit required", timings: "All day",
          desc: "Pangong Tso is a giant, high-altitude endorheic lake elevated 4,350 meters in the barren mountains of Ladakh, spanning India and China. It is famous for its brilliantly clear, saline waters that shift shades from navy to bright turquoise, emerald, and azure under changing sunlight. Encompassed by dry, multi-colored rocky peaks, a visit to this stunning salt lake is a peaceful, life-altering experience of pure wilderness.",
          image: IMG.pangong, nearby: ["Chang La Pass", "Spangmik Village", "Lukung"]
        }
      ]
    },
    {
      id: "andaman-nicobar", name: "Andaman & Nicobar", capital: "Port Blair", region: "Island",
      tagline: "Emerald Islands in the Deep Blue", color: "#1ABC9C", image: IMG.andaman,
      places: [
        {
          id: "radhanagar-beach", name: "Radhanagar Beach", city: "Havelock Island", lat: 11.9810, lng: 92.9937, category: "Nature", rating: 4.9, bestTime: "Oct–May", entryFee: "Free", timings: "6:00 AM–6:00 PM",
          desc: "Frequently rated as one of Asia's best and most pristine beaches, Radhanagar Beach on Havelock Island is a coastal paradise of soft, powdery white sand and turquoise ocean waves. The beach is bordered by high, ancient mahua trees, offering shaded retreats close to the sea. The waters are remarkably warm and calm, making it an idyllic spot for swimming and sunbathing. Sunsets here are spectacular, splashing gold and violet across the island sky.",
          image: IMG.radhanagar, nearby: ["Elephant Beach", "Kalapathar Beach", "Neil Island"]
        },
        {
          id: "cellular-jail", name: "Cellular Jail, Port Blair", city: "Port Blair", lat: 11.6675, lng: 92.7459, category: "Heritage", rating: 4.7, bestTime: "Nov–May", entryFee: "₹30 (Indian), ₹200 (Foreign)", timings: "9:00 AM–12:30 PM, 1:30 PM–5:00 PM",
          desc: "The Cellular Jail, or Kala Pani, stands in Port Blair as a solemn, historic reminder of India's long struggle for freedom. Built by British colonizers in 1906, the multi-wing brick design was made to execute solitary confinement of leading freedom fighters like Veer Savarkar. Today, it stands preserved as a patriotic national memorial. The evening Light and Sound show narrates the emotional history of those incarcerated within these stone arches, offering an educational historic walk.",
          image: IMG.cellularJail, nearby: ["Corbyn's Cove Beach", "Ross Island", "Sippighat Farm"]
        }
      ]
    }
  ]
};

export const categories = ["All", "Heritage", "Nature", "Religious", "Adventure"];
export const regions = ["All", "North", "South", "East", "West", "Central", "Northeast", "Island"];
export const catColors: Record<string, string> = {
  Heritage: "#7B2D8B",
  Nature: "#2D8A4E",
  Religious: "#E8660A",
  Adventure: "#1A6B8A"
};
