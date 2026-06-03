export interface Service {
  id: string;
  name: string;
  short_description: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  faqs: { question: string; answer: string }[];
  is_active?: boolean;

}

export interface ProductVariant {
  name: string;
  colorHex: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  long_description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  variants: ProductVariant[];
  relatedProductIds: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  type: 'text' | 'video';
  videoUrl?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Products' | 'Services' | 'AMC' | 'Technical Questions';
}

export const servicesData: Service[] = [
  {
    id: "domestic-filter",
    name: "Domestic Filter",
    short_description: "Premium water purification systems designed for households to guarantee safe, sweet, and healthy drinking water.",
    description: "Our Domestic Filter solutions include state-of-the-art multi-stage purification technologies (RO + UV + UF + TDS Controller) tailored to meet your household's water quality requirements. We ensure that your family is protected against waterborne contaminants, excess minerals, heavy metals, and harmful microbes, delivering pure drinking water with optimal taste and mineral balance.",
    image: "https://www.kent.co.in/cdn/shop/files/kent-grand-1.webp?v=1774355519&width=1100",
    icon: "Home",
    features: [
      "Multi-stage RO + UV + UF purification technology",
      "Active copper and mineral booster technology",
      "Food-grade, ABS plastic leak-proof storage tank",
      "Energy-efficient automatic power shut-off",
      "Low maintenance with filter life indicator"
    ],
    faqs: [
      {
        question: "How often should I service my domestic RO filter?",
        answer: "It is recommended to schedule a routine service every 3 to 6 months depending on your water consumption and source water TDS levels. The pre-filter cartridge should generally be replaced every 3 months."
      },
      {
        question: "Does the RO filter remove essential minerals from drinking water?",
        answer: "Our modern domestic RO filters come equipped with a Mineral Controller/Alkaline Cartridge that re-injects essential minerals like Calcium, Magnesium, and Potassium back into the water, ensuring it is both pure and healthy."
      }
    ],
    is_active: true,

  },
  {
    id: "all-type-ro-services",
    name: "All Types of R.O. and Services",
    short_description: "Complete repair, installation, and maintenance services for all brands of domestic and commercial RO systems.",
    description: "We provide comprehensive, high-quality servicing and repair solutions for all brands of RO water purifiers (Kent, Aquaguard, Pureit, Livpure, etc.). From diagnosing taste changes and leakages to replacement of booster pumps, RO membranes, and filters, our expert technicians deliver swift and reliable service at your doorstep with genuine spare parts.",
    image: "https://image.plumint.com/media/website_front_image/ro_service1.webp",
    icon: "Wrench",
    features: [
      "Certified and experienced service technicians",
      "Doorstep repair service within 2-4 hours",
      "100% genuine filters, membranes, and pump replacements",
      "Comprehensive water quality and TDS check post-service",
      "Affordable pricing with no hidden charges"
    ],
    faqs: [
      {
        question: "Do you service RO brands other than your own?",
        answer: "Yes, we repair and service all major brands of RO water purifiers including Kent, Aquaguard, Pureit, Havells, Livpure, and local assembled models."
      },
      {
        question: "What is included in a standard RO service?",
        answer: "A standard service includes thorough cleaning of the internal water storage tank, cleaning/replacement of pre-filter and sediment filters, testing the TDS level of both input and output water, and checking the functionality of the booster pump and auto-cut off system."
      }
    ],
    is_active: true,

  },
  {
    id: "industrial-filter",
    name: "Industrial Filter",
    short_description: "High-capacity water filtration and purification systems for commercial spaces, schools, offices, and factories.",
    description: "Designed to handle high water demand, our Industrial Water Filters provide clean, treated water for industries, corporate offices, hotels, hospitals, and educational institutions. With flow rates ranging from 50 LPH to 10,000 LPH, we customize solutions integrating sand filtration, carbon filtration, RO membranes, water softeners, and UV sterilizers to meet strict regulatory and process requirements.",
    image: "https://www.waterprofessionals.com/wp-content/uploads/2-2.jpg",
    icon: "Building2",
    features: [
      "Custom capacity from 50 LPH to 10,000 LPH+",
      "Heavy-duty stainless steel (SS) skids and FRP vessels",
      "Fully automatic or semi-automatic control panels",
      "Advanced scale inhibitors to prevent membrane clogging",
      "Complies with industrial grade water quality standards"
    ],
    faqs: [
      {
        question: "What capacities of industrial RO systems do you offer?",
        answer: "We supply and install systems ranging from commercial 50 LPH (Liters Per Hour) systems for small offices to massive industrial 10,000 LPH systems for manufacturing processes."
      },
      {
        question: "Can these systems treat highly saline borewell water?",
        answer: "Yes, our industrial RO systems are designed to handle high TDS feedwater (up to 5,000 ppm or more) and reduce it to standard drinking or utility water specifications."
      }
    ],
    is_active: true,

  },
  {
    id: "water-softener",
    name: "Water Softener",
    short_description: "Advanced ion-exchange water softeners to eradicate hardness, protecting pipes, appliances, skin, and hair.",
    description: "Hard water causes scaling in plumbing, ruins expensive home appliances (like washing machines, geysers, and dishwashers), and leads to dry skin and hair fall. Our high-efficiency Ion-Exchange Water Softeners replace hardness-causing Calcium and Magnesium ions with Sodium ions, ensuring a steady supply of rich, soft water that lathers easily, preserves fabrics, and keeps your skin and hair glowing.",
    image: "https://crystalpurewater.in/blog/uploads/images/202504/image_750x_68088a6adb5fc.jpg",
    icon: "Droplets",
    features: [
      "High-grade food-safe cation exchange resin",
      "Automatic or manual regeneration valves",
      "Corrosion-resistant FRP outer body",
      "Reduces scaling by 99% in pipelines and appliances",
      "Promotes smoother hair and healthier, softer skin"
    ],
    faqs: [
      {
        question: "What is the difference between an RO filter and a Water Softener?",
        answer: "An RO filter purifies drinking water by removing contaminants, heavy metals, and micro-organisms. A Water Softener treats hard water used for utility purposes (bathing, washing, plumbing) by removing Calcium and Magnesium ions, thereby eliminating lime-scale build-up."
      },
      {
        question: "Does the salt in the softener make the water taste salty?",
        answer: "No, the regeneration process uses salt water (brine) to recharge the resin, which is then thoroughly rinsed out. The soft water delivered to your taps has a slightly increased sodium content but is completely odorless and does not taste salty."
      }
    ],
    is_active: true,

  },
  {
    id: "gas-geyser",
    name: "Gas Geyser",
    short_description: "Safe, energy-efficient gas water heaters for instant hot water and reduced electricity bills.",
    description: "Switch to instant hot water with our highly reliable Gas Geysers. Running on LPG, they offer massive savings on electricity bills compared to electric geysers. Equipped with multiple safety features including flame failure protection, over-heat cutoff, and an oxygen depletion sensor, our gas geysers provide immediate hot water on demand, even at low water pressures.",
    image: "https://m.media-amazon.com/images/I/71u3A029TAL._AC_UF894,1000_QL80_.jpg",
    icon: "Flame",
    features: [
      "Instant heating - hot water within 5 seconds",
      "Saves up to 60% on energy costs compared to electric geysers",
      "Oxygen Depletion Sensor (ODS) and flameout protection",
      "Works smoothly even in low water pressure conditions",
      "Compact, wall-mounted, modern aesthetic designs"
    ],
    faqs: [
      {
        question: "Is it safe to install a gas geyser inside a bathroom?",
        answer: "It is highly recommended to install gas geysers in well-ventilated areas (like utility balconies or near windows) rather than fully enclosed bathrooms to prevent any hazard from exhaust gases. We provide professional installation that conforms to safety standards."
      },
      {
        question: "Does the gas geyser require high water pressure to start?",
        answer: "Our gas geysers are equipped with low-pressure starting valves, enabling them to ignite and operate even with a low gravity water head or low-pressure municipal lines."
      }
    ],
    is_active: true,

  },
  {
    id: "kangan-water",
    name: "Kangan Water",
    short_description: "Enagic Alkaline Water Ionizers generating antioxidant-rich, micro-clustered water for optimal health.",
    description: "Kangan Water (Alkaline Ionized Water) is generated through electrolysis using medical-grade platinum-plated titanium plates. It offers three distinct benefits: high alkalinity (to neutralize body acidity), powerful antioxidant properties (rich in active Hydrogen to fight free radicals), and micro-clustered water molecules for superior hydration. Experience enhanced energy levels, detox, and general wellness with every glass.",
    image: "https://enagic-australia.com/wp-content/uploads/2016/06/Enagic-Australia-LeveLuk-K8-Product-Photo.jpg",
    icon: "Sparkles",
    features: [
      "Provides water with pH ranging from 2.5 (strong acidic) to 11.5 (strong alkaline)",
      "High negative Oxidation-Reduction Potential (ORP) up to -800mV",
      "Micro-clustered structure for 3x faster cellular absorption",
      "Medical-grade electrolysis plates for extreme durability",
      "Supports detoxification, immunity, and anti-aging"
    ],
    faqs: [
      {
        question: "What are the health benefits of Kangan Water?",
        answer: "Kangan Water helps maintain the body's natural pH balance, acts as a powerful antioxidant, enhances hydration due to smaller water molecule clusters, aids in detoxification, and promotes digestion and overall vitality."
      },
      {
        question: "What do the different pH levels of Kangan Water represent?",
        answer: "pH 8.5 - 9.5 is ideal for daily drinking and cooking; pH 7.0 is clean, neutral water for baby food and medication; pH 6.0 is 'Beauty Water' for skin care; pH 2.5 is strong acidic water for sanitizing; pH 11.5 is strong alkaline water for washing pesticides off fruits and vegetables."
      }
    ],
    is_active: true,

  },
  {
    id: "ro-water-cooler",
    name: "R.O. + Water Cooler",
    short_description: "Integrated commercial water cooling cabinets fitted with inline RO purification systems.",
    description: "Perfect for offices, showrooms, public centers, and schools, our integrated RO + Water Coolers deliver chilled, pure water directly from municipal lines. Available in capacities from 20 to 150 liters, these systems combine powerful chilling compressors with highly reliable multi-stage RO filtration, ensuring your employees and visitors stay refreshed and safe.",
    image: "https://universalpurewatersolutions.com/products-water-purifiers/images/KENT-Perk-Mobile-Banner.png",
    icon: "IceCream",
    features: [
      "Combined inline RO purification and heavy-duty water cooling",
      "Full stainless steel (SS-304) body for absolute hygiene",
      "Adjustable thermostats for customized cooling levels",
      "Fast chilling rate with eco-friendly refrigerant gas",
      "Dual or triple taps for normal, cold, and warm water"
    ],
    faqs: [
      {
        question: "What is the storage capacity of the RO + Water Cooler?",
        answer: "We offer models with cooling and storage capacities ranging from 20 liters (suited for small offices) up to 150 liters (suited for factory floors and crowded commercial areas)."
      },
      {
        question: "Is it easy to maintain the cooling system and filter together?",
        answer: "Yes, our coolers are designed with an easy-access front panel that allows technicians to service the RO cartridge filters and sanitise the cooling chamber quickly during routine visits."
      }
    ],
    is_active: true,

  },
  {
    id: "amc-ro-contract",
    name: "AMC R.O Contract",
    short_description: "Annual Maintenance Contracts for stress-free RO operations with scheduled maintenance and free parts.",
    description: "Avoid unexpected breakdowns and costly repairs with our Annual Maintenance Contracts (AMC) for RO water purifiers. Our AMC packages cover regular filter changes, free replacement of standard parts (such as sediment filters, carbon filters, auto-cut-off valves), unlimited breakdown support, and routine checkups. Ensure uninterrupted pure water for your family or workspace year-round.",
    image: "https://5.imimg.com/data5/SELLER/Default/2025/3/498863469/TD/TH/QG/3545622/ro-annual-maintenance-contract-service.jpg",
    icon: "ShieldCheck",
    features: [
      "Includes 3-4 pre-scheduled maintenance service visits per year",
      "100% replacement coverage for consumable filters",
      "Priority response within 2 hours for breakdown calls",
      "Saves up to 40% on annual parts and service costs",
      "Maintains water purity levels consistently"
    ],
    faqs: [
      {
        question: "What is covered under the RO AMC plan?",
        answer: "Our standard AMC covers the cost of all periodic filter replacements (pre-filter, sediment filter, carbon filter), free labor for all breakdown calls, and diagnostics. Advanced plans also include RO Membrane and Booster Pump coverage."
      },
      {
        question: "Can I take an AMC contract for a generic or locally assembled RO?",
        answer: "Yes, we offer custom AMC contracts for both branded RO systems and generic/assembled models, using high-quality compatible parts."
      }
    ],
    is_active: true,

  }
];

export const productsData: Product[] = [
  {
    id: "sd-aqua-sparkle-ro",
    name: "SD Aqua Sparkle Alkaline RO",
    category: "RO Systems",

    
    description: "Premium Domestic RO Purifier with Alkaline & Active Copper technology, providing pure and pH-balanced water.",
    long_description: "The SD Aqua Sparkle is our flagship domestic water purifier. It features an advanced 10-stage purification system that combines Reverse Osmosis (RO), Ultra Violet (UV) sterilization, Ultra Filtration (UF), and an Alkaline Mineralizer. This model is specially engineered to treat borewell, tanker, and municipal water, lowering high TDS levels and converting acidic tap water into life-giving, mineral-rich alkaline water (pH 8.5+). It features a sleek glassmorphic front panel, a food-grade ABS 10-liter water storage tank, and smart indicators for tank full, UV fail, and filter replacement.",
    features: [
      "10-stage RO + UV + UF + TDS Controller + Alkaline technology",
      "Active Copper & Zinc booster cartridge",
      "High-flow 100 GPD booster pump and long-lasting RO membrane",
      "Food-grade, transparent 10L water storage tank",
      "Advanced water-saving technology that saves up to 50% waste water"
    ],
    specifications: {
      "Purification Capacity": "Up to 15-20 liters per hour",
      "Storage Tank Capacity": "10 Liters",
      "TDS Reduction": "Up to 95% (Input TDS up to 2000 ppm)",
      "Power Consumption": "36 Watts",
      "Input Voltage": "140 - 300 V AC (50 Hz)",
      "Body Material": "Food Grade ABS Plastic",
      "Installation Type": "Wall Mounted / Counter Top"
    },
    images: ["https://5.imimg.com/data5/SELLER/Default/2025/1/483186521/XD/DC/WF/138721321/sparkle-aqua-water-purifiers-1000x1000.jpg", "https://m.media-amazon.com/images/I/711uLARwMTL.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWwPdJrTBZOM9v7TeaSguLr1a3bWo6wUoKYA&s"],
    variants: [
      {
        name: "Ocean Blue Accent",
        colorHex: "#2563eb",
        images: ["https://5.imimg.com/data5/SELLER/Default/2025/1/483186521/XD/DC/WF/138721321/sparkle-aqua-water-purifiers-1000x1000.jpg"]
      },
      {
        name: "Mint Teal Accent",
        colorHex: "#14b8a6",
        images: ["https://m.media-amazon.com/images/I/711uLARwMTL.jpg"]
      },
      {
        name: "Minimalist Gray",
        colorHex: "#64748b",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWwPdJrTBZOM9v7TeaSguLr1a3bWo6wUoKYA&s"]
      }
    ],
    relatedProductIds: ["sd-crystal-clear-domestic", "sd-kangan-classic-ionizer", "sd-water-softener-home"]
  },
  {
    id: "sd-crystal-clear-domestic",
    name: "SD Crystal Clear Domestic",
    category: "Domestic Filter",
  

    description: "Compact 8-stage RO purifier ideal for municipal and low TDS water sources, focusing on chemical and odor removal.",
    long_description: "Perfect for urban apartments, the SD Crystal Clear domestic filter is a compact, highly reliable water purifier that focuses on removing municipal chlorine, toxic heavy metals, pesticide residues, and bad odor. Using an eco-friendly multi-barrier system, it keeps the water sweet, clean, and perfectly safe for cooking and drinking, all while occupying minimal kitchen space.",
    features: [
      "8-stage filtration with dual sediment carbon filters",
      "High performance UV disinfection chamber",
      "Smart automatic shut-off valve",
      "Food grade ABS body with smart LED indicators",
      "Extremely quiet operation and low energy consumption"
    ],
    specifications: {
      "Purification Capacity": "12-15 Liters per hour",
      "Storage Tank Capacity": "8 Liters",
      "TDS Reduction": "Up to 90% (Input TDS up to 1000 ppm)",
      "Body Material": "Food Grade ABS Plastic",
      "Dimensions": "395 x 256 x 520 mm"
    },
    images: ["https://m.media-amazon.com/images/I/71EdvZZT0CL._AC_UF894,1000_QL80_.jpg",
      "https://www.eshop-best-chemical.com/cdn/shop/products/SilicaGel.jpg?v=1633492053&width=1445"],
    variants: [
      {
        name: "Crystal White",
        colorHex: "#e2e8f0",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTCuqxRjAA6etUfPgc-ekNQHRWlwi0ZCsRZw&s"]
      },
      {
        name: "Cool Blue",
        colorHex: "#3b82f6",
        images: ["https://www.eshop-best-chemical.com/cdn/shop/products/SilicaGel.jpg?v=1633492053&width=1445"]
      }
    ],
    relatedProductIds: ["sd-aqua-sparkle-ro", "sd-water-softener-home", "sd-eco-gas-geyser-6l"]
  },
  {
    id: "sd-industrial-ro-250",
    name: "SD Industrial RO-250 LPH",
    category: "Industrial Filter",
  

    description: "Heavy-duty 250 Liters Per Hour industrial RO system designed for commercial buildings, factories, and schools.",
    long_description: "The SD Industrial RO-250 LPH is a high-performance, skid-mounted water purification plant engineered to deliver safe drinking water in high-volume settings. Supported by a robust Stainless Steel 304 frame, it features dual high-pressure vertical pumps, automated sand and carbon media pre-filters, and twin 4040 thin-film composite RO membranes. It is built to run 24/7 with minimal operator supervision, offering digital meters to monitor flow rates, pressure gauges, and input/output TDS levels.",
    features: [
      "250 LPH pure water output with high recovery rate",
      "Full Stainless Steel (SS-304) heavy-duty skid frame",
      "FRP pre-treatment vessels with Multiport Auto-valves",
      "Dry-run protection for booster pumps",
      "Integrated chemical dosing pump to prevent scaling"
    ],
    specifications: {
      "Output Capacity": "250 Liters per Hour (LPH)",
      "Frame Material": "Stainless Steel SS-304",
      "Membrane Type": "TFC 4040 Membranes (2 Units)",
      "High Pressure Pump": "CRI/Lubi 1.5 HP Vertical Multistage",
      "Source Water TDS": "Up to 3000 ppm",
      "Operating Power": "Single Phase / Three Phase, 2.2 kW"
    },
    images: ["https://5.imimg.com/data5/SELLER/Default/2022/11/GN/OK/FU/8558800/250-lph-industrial-ro-water-plant.jpeg",],
    variants: [
      {
        name: "Standard SS Steel",
        colorHex: "#94a3b8",
        images: ["https://5.imimg.com/data5/SELLER/Default/2022/11/GN/OK/FU/8558800/250-lph-industrial-ro-water-plant.jpeg"]
      }
    ],
    relatedProductIds: ["sd-industrial-ro-500", "sd-cooler-ro-100", "sd-water-softener-industrial"]
  },
  {
    id: "sd-industrial-ro-500",
    name: "SD Industrial RO-500 LPH",
    category: "Industrial Filter",
  

    description: "High-capacity commercial purification system for large-scale pharmaceutical, manufacturing, and bottling projects.",
    long_description: "Built for intensive applications, the SD Industrial RO-500 LPH delivers up to 500 liters of purified water every hour. It features advanced membrane technology, auto-flushing cycles to enhance membrane lifespan, and a state-of-the-art PLC electrical panel. Ideal for large production lines, schools with 1000+ students, and centralized hospital labs.",
    features: [
      "500 LPH heavy capacity output",
      "Automated PLC controller panel with digital displays",
      "Raw water pump and high-pressure pump integrated",
      "High rejection membranes removing 99.2% of dissolved salts",
      "Integrated UV disinfection unit at output line"
    ],
    specifications: {
      "Output Capacity": "500 Liters per Hour",
      "Power consumption": "3.5 kW",
      "Membrane Count": "4 Units (4040 TFC)",
      "Weight": "Approx 180 kg",
      "Raw Water TDS Limit": "3500 ppm"
    },
    images: ["https://5.imimg.com/data5/KB/FU/MY-40647331/ro-plant-500x500.png"],
    variants: [
      {
        name: "Standard SS Steel",
        colorHex: "#94a3b8",
        images: ["https://5.imimg.com/data5/KB/FU/MY-40647331/ro-plant-500x500.png"]
      }
    ],
    relatedProductIds: ["sd-industrial-ro-250", "sd-water-softener-industrial", "sd-cooler-ro-100"]
  },
  {
    id: "sd-water-softener-home",
    name: "SD Soft-Home Ionizer",
    category: "Water Softener",
 

    description: "Point-of-entry Ion-Exchange Water Softener for apartments and villas, preventing scaling in pipes and appliances.",
    long_description: "Say goodbye to chalky white scale deposits in your bathroom and dry, frizzy hair. The SD Soft-Home Ionizer is a compact, point-of-entry water softening system containing high-capacity cation exchange resin. It connects to your main water overhead supply line and removes hardness-causing Calcium and Magnesium. It requires minimal maintenance, and has an easy-to-use manual multiport valve for effortless backwash and salt regeneration.",
    features: [
      "Premium food-safe cation exchange resin",
      "Sturdy corrosion-resistant fiberglass reinforced plastic (FRP) body",
      "Intuitive multiport valve for easy regeneration cycles",
      "Protects expensive geysers, washing machines, and showers",
      "Saves up to 30% on soaps and detergents"
    ],
    specifications: {
      "Vessel Capacity": "25 Liters of resin",
      "Flow Rate": "Up to 1500 Liters per hour",
      "Softening Capacity": "60,000 Hardness ppm-liters per cycle",
      "Connection Port": "1 Inch BSP",
      "Salt Required per Regen": "Approx 3.5 kg"
    },
    images: ["https://5.imimg.com/data5/SELLER/Default/2023/3/296054785/QH/PQ/VU/6544143/leveluk-sd501-water-ionizer-machine-500x500.png", "https://5.imimg.com/data5/SELLER/Default/2023/7/326774009/AK/OL/FB/24101144/water-ionizer-enagic-sd-501-kangen-water.jpg"],
    variants: [
      {
        name: "Classic Blue",
        colorHex: "#1d4ed8",
        images: ["https://5.imimg.com/data5/SELLER/Default/2023/3/296054785/QH/PQ/VU/6544143/leveluk-sd501-water-ionizer-machine-500x500.png"]
      },
      {
        name: "Sleek Gray",
        colorHex: "#475569",
        images: ["https://5.imimg.com/data5/SELLER/Default/2023/7/326774009/AK/OL/FB/24101144/water-ionizer-enagic-sd-501-kangen-water.jpg"]
      }
    ],
    relatedProductIds: ["sd-water-softener-industrial", "sd-aqua-sparkle-ro", "sd-eco-gas-geyser-6l"]
  },
  {
    id: "sd-water-softener-industrial",
    name: "SD Soft-Max Commercial Softener",
    category: "Water Softener",
    

    description: "High-flow industrial water softener for hotels, boilers, cooling towers, and apartment complexes.",
    long_description: "The SD Soft-Max is a high-volume water softener designed for industrial boilers, cooling towers, hotels, and multi-story apartment complexes. Utilizing premium grade strong-acid cation resin, it ensures scale-free water flow at high volumes, avoiding heavy plumbing replacement costs and optimizing thermal efficiency in heat transfer processes.",
    features: [
      "Flow rates up to 10,000 Liters per hour",
      "Heavy duty FRP vessel with automatic control valve option",
      "Integrated brine tank for easy salt storage",
      "Zero hardness water output",
      "Excellent resistance to chlorine degradation"
    ],
    specifications: {
      "Resin Volume": "100 Liters",
      "Flow Rate": "5,000 - 10,000 LPH",
      "Regeneration Mode": "Volume or Time based Automatic",
      "Tank Material": "FRP Composite"
    },
    images: ["https://4.imimg.com/data4/RN/OR/MY-12500370/duplex-water-softener.jpg"],
    variants: [
      {
        name: "Industrial Blue",
        colorHex: "#1e3a8a",
        images: ["https://4.imimg.com/data4/RN/OR/MY-12500370/duplex-water-softener.jpg"]
      }
    ],
    relatedProductIds: ["sd-water-softener-home", "sd-industrial-ro-250", "sd-industrial-ro-500"]
  },
  {
    id: "sd-eco-gas-geyser-6l",
    name: "SD Eco-Warm Instant Gas Geyser (6L)",
    category: "Gas Geyser",
  

    description: "Instant 6-Liter LPG Gas Geyser with multi-safety protections and battery ignition, highly energy efficient.",
    long_description: "Get piping hot water in seconds with the SD Eco-Warm 6-liter Gas Geyser. Running on LPG cylinder gas, it cuts down electricity consumption by up to 60%. It features a heavy copper heat exchanger, an oxygen depletion safety system, a child lock, and dual solenoid valves. The geyser ignites automatically when water flows through, making it perfect for homes with low municipal water pressure or high electricity rates.",
    features: [
      "Instant heating - 6 Liters per minute capacity",
      "Heavy-duty pure copper heat exchanger for long life",
      "Oxygen Depletion Sensor (ODS) and auto-cut-off timer (20 mins)",
      "Winter/Summer gas saving control knobs",
      "Flame failure protection and overheat protection"
    ],
    specifications: {
      "Capacity": "6 Liters/minute",
      "Gas Type": "LPG (Liquefied Petroleum Gas)",
      "Ignition": "Automatic Pulses (Dual battery operated)",
      "Gas Input Pressure": "2800 Pa",
      "Suitable Water Pressure": "0.02 - 0.8 MPa (Works at low pressure)",
      "Heat Exchanger Weight": "1.2 kg (Pure Copper)"
    },
    images: ["https://longwayindia.com/cdn/shop/files/LW-Superb-Ivory-6L-P1_6d0255d8-3fd7-4d50-b5be-2101432b6113.jpg?v=1756816461", "https://tiimg.tistatic.com/fp/1/006/937/electric-6-liter-water-geyser-061.jpg"],
    variants: [
      {
        name: "Metallic Silver",
        colorHex: "#cbd5e1",
        images: ["https://longwayindia.com/cdn/shop/files/LW-Superb-Ivory-6L-P1_6d0255d8-3fd7-4d50-b5be-2101432b6113.jpg?v=1756816461"]
      },
      {
        name: "Ivory White",
        colorHex: "#f8fafc",
        images: ["https://tiimg.tistatic.com/fp/1/006/937/electric-6-liter-water-geyser-061.jpg"]
      }
    ],
    relatedProductIds: ["sd-crystal-clear-domestic", "sd-water-softener-home", "sd-kangan-classic-ionizer"]
  },
  {
    id: "sd-kangan-classic-ionizer",
    name: "SD Kangan Life Alkaline Ionizer",
    category: "Kangan Water",
   

    description: "Premium Alkaline Water Ionizer featuring 7 Platinum-plated Titanium plates, creating healthy micro-clustered water.",
    long_description: "The SD Kangan Life is our top-tier medical-grade water ionizer. Fitted with 7 solid platinum-coated titanium plates, it splits regular water into alkaline and acidic streams. It produces water with pH values ranging from 2.5 (strong sanitizer) up to 11.5 (solvent water to wash pesticides off vegetables). It generates powerful antioxidants with ORP levels exceeding -800mV, combating oxidative stress inside the human body while promoting faster cellular hydration.",
    features: [
      "7 solid medical-grade Platinum-plated Titanium plates",
      "Generates 5 types of water: pH 2.5, 6.0, 7.0, 8.5-9.5, and 11.5",
      "High negative ORP (-800 mV) & high hydrogen saturation",
      "Smart voice guidance and automated cleaning cycle",
      "10-year lifespan with simple annual cleaning"
    ],
    specifications: {
      "Electrolysis Plates": "7 Plates (Platinum-plated Titanium)",
      "pH Range": "2.5 - 11.5",
      "ORP Range": "Up to -800 mV (depending on input water)",
      "Filter Life": "Approx 6000 Liters (Smart Indicator)",
      "Operating Power": "200 Watts AC",
      "Cleaning System": "Automatic Self-Cleaning (10 seconds)"
    },
    images: ["https://chansonqualitywater.com/public/upload/product/693d38c1b6cc8Machine%20(2).jpg",
      "https://sc04.alicdn.com/kf/Hccaf1c3e87f840aea758a5126e2fc4fbH.png"],
    variants: [
      {
        name: "Platinum Silver",
        colorHex: "#e2e8f0",
        images: ["https://chansonqualitywater.com/public/upload/product/693d38c1b6cc8Machine%20(2).jpg"]
      },
      {
        name: "Space Black",
        colorHex: "#1e293b",
        images: ["https://sc04.alicdn.com/kf/Hccaf1c3e87f840aea758a5126e2fc4fbH.png"]
      }
    ],
    relatedProductIds: ["sd-aqua-sparkle-ro", "sd-water-softener-home", "sd-eco-gas-geyser-6l"]
  },
  {
    id: "sd-cooler-ro-100",
    name: "SD Chill-Purify RO + Cooler (100L)",
    category: "RO + Water Cooler",
   

    description: "Commercial stainless steel water cooler with an integrated 100 Liter storage tank and inline RO purification.",
    long_description: "Ensure that employees, clients, or students have access to ice-cold, purified drinking water. The SD Chill-Purify is a fully integrated commercial station combining a heavy-duty cooling compressor and an internal multi-stage RO filter. The entire tank, panels, and internal plumbing are crafted from premium SS-304 food-grade stainless steel to ensure absolute hygiene and prevent corrosion.",
    features: [
      "100-liter storage tank with 50 LPH cooling speed",
      "Heavy duty inline 50 LPH RO filter system pre-installed",
      "Food-grade Stainless Steel (SS-304) body and water path",
      "Twin taps (Cold and Normal Temperature)",
      "Eco-friendly R134a refrigerant and copper cooling coil"
    ],
    specifications: {
      "Storage Capacity": "100 Liters",
      "Cooling Capacity": "50 Liters per Hour",
      "RO Purification Capacity": "50 LPH",
      "Body Material": "Stainless Steel 304",
      "Compressor Power": "600 Watts",
      "Taps": "2 Taps (1 Cold, 1 Normal)"
    },
    images: ["https://static.wixstatic.com/media/e7770e_c2c5acfdd1804bf58724b5f9f8b3c253~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg"],
    variants: [
      {
        name: "Brushed Stainless Steel",
        colorHex: "#94a3b8",
        images: ["https://static.wixstatic.com/media/e7770e_c2c5acfdd1804bf58724b5f9f8b3c253~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg"]
      }
    ],
    relatedProductIds: ["sd-industrial-ro-250", "sd-industrial-ro-500", "sd-water-softener-industrial"]
  },
  {
    id: "sd-ro-accessories-kit",
    name: "SD Premium RO Maintenance Kit",
    category: "Accessories",
   
    description: "Complete filter cartridge replacement kit containing sediment, carbon, pre-filter, and dynamic mineral cartridges.",
    long_description: "Keep your RO water purifier performing at its peak. This complete maintenance kit contains everything you need for an annual filter overhaul: 1 high-density Spun Pre-Filter, 1 inline Sediment Filter, 1 Activated Carbon Filter, and a Mineral/Alkaline Enhancer Cartridge. Compatible with Kent, Aquaguard, and all standard 10-inch RO cabinets.",
    features: [
      "Universal compatibility with standard 10-inch filter housings",
      "High iodine value coconut-shell activated carbon",
      "5-micron spun polypropylene sediment filter cartridge",
      "Includes mineral balls to restore calcium and magnesium",
      "Includes push-fit connectors and Teflon tape"
    ],
    specifications: {
      "Spun Filter Size": "10 Inches, 5 Micron",
      "Carbon Filter Size": "10 Inches Inline",
      "Sediment Filter Size": "10 Inches Inline",
      "Mineralizer Content": "Alkaline balls, Copper beads, Carbon",
      "Life Span": "6,000 Liters / 12 Months"
    },
    images: ["https://m.media-amazon.com/images/I/51+utCj5YHL.jpg"],
    variants: [
      {
        name: "Universal Kit",
        colorHex: "#3b82f6",
        images: ["https://m.media-amazon.com/images/I/51+utCj5YHL.jpg"]
      }
    ],
    relatedProductIds: ["sd-aqua-sparkle-ro", "sd-crystal-clear-domestic"]
  }
];

export const blogPostsData: BlogPost[] = [
  {
    id: "importance-of-tds-drinking-water",
    title: "Understanding TDS in Drinking Water: How Much is Safe?",
    summary: "What is TDS, how does it affect your health, and what is the optimal TDS range for healthy and sweet drinking water?",
    content: `Total Dissolved Solids (TDS) refers to the concentration of inorganic salts and organic matter dissolved in water. The most common constituents are calcium, magnesium, sodium, potassium, carbonates, hydrogen carbonates, chlorides, sulfates, and nitrates.

### What is the Safe TDS Range?
According to the World Health Organization (WHO) and the Bureau of Indian Standards (BIS):
- **TDS less than 300 mg/L (ppm):** Excellent. Water tastes sweet and has optimal minerals.
- **TDS 300 - 600 mg/L:** Good. Very safe to drink.
- **TDS 600 - 900 mg/L:** Fair. Slightly heavy but acceptable.
- **TDS 900 - 1200 mg/L:** Poor. Hard water, not pleasant.
- **TDS above 1200 mg/L:** Unacceptable. High risk of mineral deposits, bad taste, and long-term health complications (like kidney stones).

### How to Measure TDS?
You can easily check your home's water TDS using a cheap handheld digital TDS meter. Put the probe in a glass of water, and it will show you the reading in PPM (Parts Per Million).

### How to Control High TDS?
If your water source has a TDS reading higher than 500 PPM, a standard gravity filter or UV filter is not enough. You need a **Reverse Osmosis (RO) purifier**. An RO system utilizes a semi-permeable membrane to filter out up to 95% of dissolved solids.

Our premium **SD Aqua Sparkle RO** features an adjustable **TDS Controller**. If your input water is 1500 PPM, the RO reduces it to 80 PPM. The controller allows our technician to mix in purified active mineral water to raise it to a healthy 120 PPM, ensuring you get both safety and taste.`,

    image: "https://www.frizzlife.com/cdn/shop/articles/what_should_my_tds_be_for_drinking_water-main.webp?v=1778213412&width=1600",
    date: "May 15, 2024",
    category: "Water Quality",
    author: "Mehul Patel",
    readTime: "5 min read"
  },
  {
    id: "kangan-water-health-benefits",
    title: "Kangan Water: The Science Behind Alkaline Ionized Water",
    summary: "Discover why top athletes and health-conscious families are shifting to micro-clustered, antioxidant-rich Kangan Water.",
    content: `Kangan Water, also known as Electrolyzed Reduced Water (ERW), is generated by water ionizers that use medical-grade platinum-coated titanium plates to reorganize water molecules.

### The 3 Core Properties of Kangan Water

1. **High Alkalinity (pH 8.5 - 9.5)**
   Modern diets and stress create an acidic environment inside our bodies, which is linked to inflammation and fatigue. Kangan water helps neutralize bodily acids and maintains an optimal pH balance, boosting digestion and metabolic functions.

2. **Active Hydrogen (Antioxidants)**
   When water undergoes electrolysis, active dissolved Hydrogen is produced. This gives the water a negative Oxidation-Reduction Potential (ORP) of up to -800mV. It works as a powerful antioxidant, scavenging free radicals and protecting cells from oxidative damage (anti-aging).

3. **Micro-Clustering**
   Standard tap water molecules form large clusters of 15 to 20 molecules. Electrolysis breaks these down into smaller clusters of 5 to 6 molecules. These micro-clusters penetrate cell walls 3 times faster, providing superior cellular hydration and aiding in detoxification.

### Practical Everyday Uses
A Kangan Ionizer is not just for drinking water. By choosing different pH levels, you get:
- **pH 11.5 (Strong Alkaline):** Excellent for breaking down oil-based pesticides on fresh vegetables.
- **pH 6.0 (Beauty Water):** Acts as an astringent toner for glowing skin.
- **pH 2.5 (Strong Acidic):** Eco-friendly hand and counter sanitizer that kills bacteria on contact.`,
    image: "https://image.made-in-china.com/202f0j00pTQvgkbPRtcL/Alkaline-Water-Machine-Price.webp",
    date: "May 10, 2024",
    category: "Health",
    author: "Dr. A. K. Sharma",
    readTime: "7 min read"
  },
  {
    id: "signs-your-ro-needs-service",
    title: "5 Warning Signs That Your RO Water Purifier Needs Urgent Service",
    summary: "Don't wait for your purifier to break down. Watch out for these early signs to protect your family's health.",
    content: `A water purifier is a hardworking appliance. Over time, the filters trap heavy metals, dirt, mud, and organic matter. Eventually, these filters get choked or wear out, letting contaminants slip through.

Here are the 5 clear signs that your RO system is due for a service:

### 1. Water Tastes Different or Smells Bad
If your drinking water suddenly tastes salty, bitter, or has a chemical smell, it means the **activated carbon filter** or the **RO membrane** has worn out and is no longer absorbing chlorine or dissolved salts.

### 2. Low Water Flow Rate
Is the water trickling extremely slowly from the purifier tap? This is a classic symptom of choked sediment and pre-filter cartridges. Replacing these restores normal pressure and prevents damage to the expensive booster pump.

### 3. Purifier Runs Continuously
If the booster pump keeps humming and the system does not auto-shut off for hours, the RO membrane may be clogged, preventing water from passing through to fill the tank, or the auto-cut-off sensor switch is broken.

### 4. High Waste Water Output
If the waste pipe is discharging water constantly but the pure water tank is barely filling, your RO membrane is likely scaled up. It requires higher pressure to filter water, dumping most of it down the drain.

### 5. Unusual Noise from the Cabinet
A loud vibrating noise or clicking sound indicates a struggling booster pump or a faulty solenoid valve. Getting this checked early can save you from a complete pump replacement.

### The Solution
Regular maintenance is key. Sign up for our **SD AMC RO Contract** to get regular filter changes, TDS checks, and breakdown coverage automatically.`,
    image: "https://images.bhaskarassets.com/web2images/1884/2025/12/11/slide1_1765420469.gif",
    date: "May 02, 2024",
    category: "Maintenance",
    author: "Rajesh Vaghela",
    readTime: "4 min read"
  }
];

export const reviewsData: Review[] = [
  {
    id: "rev-1",
    name: "Sunita Vyas",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    text: "Switched to SD Aqua Sparkle RO three months ago, and the difference in water taste is amazing. The service was set up in just 2 hours! Highly recommended.",
    type: "text"
  },
  {
    id: "rev-2",
    name: "Anand Shah",
    location: "Vadodara, Gujarat",
    rating: 5,
    text: "We bought the Kangan Life Ionizer for our parents. Their acid reflux issues have reduced significantly, and beauty water is a great addition for skincare.",
    type: "text"
  },
  {
    id: "rev-3",
    name: "Harish Patel (Factory Owner)",
    location: "GIDC Naroda, Gujarat",
    rating: 5,
    text: "Excellent service on the 250 LPH Industrial RO system. It feeds our plant smoothly. Their response on AMC calls is quick and parts replaced are always genuine.",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Rickroll as a classic premium video placeholder
  },
  {
    id: "rev-4",
    name: "Meera Deshmukh",
    location: "Surat, Gujarat",
    rating: 4,
    text: "The hard water in our area was causing bad scale deposits in our geyser and hair fall. The SD Soft-Home water softener completely resolved it. Five stars!",
    type: "text"
  }
];

export const faqsData: FAQ[] = [
  {
    id: "faq-1",
    question: "What is the difference between RO, UV, and UF filters?",
    answer: "RO (Reverse Osmosis) uses a membrane to remove dissolved solids (TDS), chemicals, and metals. UV (Ultra Violet) sterilizes bacteria and viruses by neutralizing their DNA. UF (Ultra Filtration) uses hollow fibers to physically remove micro-organisms and suspended solids without removing minerals. Our systems combine these to offer complete safety.",
    category: "General"
  },
  {
    id: "faq-2",
    question: "How long does a typical RO membrane last?",
    answer: "Normally, a high-quality RO membrane lasts between 12 to 24 months, depending on the TDS levels of the input water and the total volume of water purified daily.",
    category: "Products"
  },
  {
    id: "faq-3",
    question: "Is installation free when I purchase a new filter?",
    answer: "Yes, standard installation is 100% free of charge for all new SD Enterprise water filters. Our technician will deliver and mount the system, connect it to the plumbing, and explain the operations.",
    category: "Services"
  },
  {
    id: "faq-4",
    question: "What does the Annual Maintenance Contract (AMC) cover?",
    answer: "Our standard AMC covers 3 routine maintenance visits, free replacements of all pre-filters, sediment filters, carbon filters, labor charges, and unlimited emergency breakdown visits.",
    category: "AMC"
  },
  {
    id: "faq-5",
    question: "Why does my RO purifier make a constant buzzing sound?",
    answer: "A buzzing sound usually comes from the booster pump. It can occur if water pressure from the inlet is too low, if air is trapped in the filters, or if the pump's vibration pads have worn down. Contact our service team to diagnose it.",
    category: "Technical Questions"
  }
];
