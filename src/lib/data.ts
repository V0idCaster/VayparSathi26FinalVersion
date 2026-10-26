export const rupee = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const rupeeShort = (n: number) => {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(n >= 1000000 ? 1 : 2) + " L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(0) + "K";
  return "₹" + n;
};

export type Level = "Low" | "Medium" | "High";

export interface Opportunity {
  id: string;
  name: string;
  category: string;
  interest: string; // matches an interests[].id
  score: number;
  demand: Level;
  competition: Level;
  investment: number;
  revenue: number;
  profit: number;
  risk: Level;
  blurb: string;
}

export const opportunities: Opportunity[] = [
  {
    id: "cloud-kitchen",
    name: "Affordable Cloud Kitchen",
    category: "Cooking/Food",
    interest: "food",
    score: 89,
    demand: "High",
    competition: "Medium",
    investment: 150000,
    revenue: 120000,
    profit: 35000,
    risk: "Medium",
    blurb: "Rising demand for home-style tiffin & delivery in Salt Lake and New Town.",
  },
  {
    id: "organic-grocery",
    name: "Organic Grocery Store",
    category: "Retail",
    interest: "retail",
    score: 87,
    demand: "High",
    competition: "Medium",
    investment: 200000,
    revenue: 180000,
    profit: 42000,
    risk: "Low",
    blurb: "Affordable grocery delivery demand is increasing across your locality.",
  },
  {
    id: "mobile-repair",
    name: "Mobile Repair Service",
    category: "Services",
    interest: "tech",
    score: 81,
    demand: "High",
    competition: "High",
    investment: 80000,
    revenue: 90000,
    profit: 28000,
    risk: "Medium",
    blurb: "Steady repair volume with low setup cost and quick break-even.",
  },
  {
    id: "dairy-delivery",
    name: "Dairy & Milk Delivery",
    category: "Agriculture",
    interest: "agri",
    score: 78,
    demand: "High",
    competition: "Medium",
    investment: 120000,
    revenue: 100000,
    profit: 24000,
    risk: "Low",
    blurb: "Daily recurring demand with loyal subscription customers.",
  },
  {
    id: "digital-service",
    name: "Digital Service Center",
    category: "Education",
    interest: "education",
    score: 74,
    demand: "Medium",
    competition: "Medium",
    investment: 95000,
    revenue: 70000,
    profit: 22000,
    risk: "Medium",
    blurb: "Aadhaar, PAN, banking & form-filling services for the neighbourhood.",
  },
  {
    id: "beauty-salon",
    name: "Neighbourhood Beauty Salon",
    category: "Beauty & Wellness",
    interest: "beauty",
    score: 80,
    demand: "High",
    competition: "Medium",
    investment: 130000,
    revenue: 95000,
    profit: 30000,
    risk: "Low",
    blurb: "Steady footfall for grooming & bridal services with strong repeat clients.",
  },
  {
    id: "tailoring-unit",
    name: "Tailoring & Boutique Unit",
    category: "Manufacturing",
    interest: "manufacturing",
    score: 76,
    demand: "Medium",
    competition: "Medium",
    investment: 110000,
    revenue: 85000,
    profit: 26000,
    risk: "Low",
    blurb: "Custom stitching and small-batch garments for local demand.",
  },
  {
    id: "tuition-center",
    name: "After-School Tuition Center",
    category: "Education",
    interest: "education",
    score: 79,
    demand: "High",
    competition: "Medium",
    investment: 60000,
    revenue: 75000,
    profit: 32000,
    risk: "Low",
    blurb: "Low-cost setup with strong recurring monthly fees from local students.",
  },
];

/** Rank opportunities so the user's chosen interests appear first, with a small score boost. */
export function rankByInterests(list: Opportunity[], picked: string[]): Opportunity[] {
  return [...list].sort((a, b) => {
    const am = picked.includes(a.interest) ? 1 : 0;
    const bm = picked.includes(b.interest) ? 1 : 0;
    if (am !== bm) return bm - am;
    return b.score - a.score;
  });
}

export interface Scheme {
  id: string;
  name: string;
  match: number;
  benefit: string;
  documents: string[];
  difficulty: Level;
  deadline: string;
  category: string;
  summary: string;
}

export const schemes: Scheme[] = [
  {
    id: "pmegp",
    name: "PMEGP",
    match: 92,
    benefit: "Up to 35% subsidy on project cost",
    documents: ["Aadhaar", "Project Report", "Caste Certificate (if any)", "Bank Details"],
    difficulty: "Medium",
    deadline: "Open all year",
    category: "Manufacturing & Services",
    summary: "Prime Minister's Employment Generation Programme for new micro-enterprises.",
  },
  {
    id: "mudra",
    name: "MUDRA Loan (Shishu)",
    match: 88,
    benefit: "Collateral-free loan up to ₹10 Lakh",
    documents: ["Aadhaar", "Business Proof", "Quotations", "Bank Statement"],
    difficulty: "Low",
    deadline: "Open all year",
    category: "All small businesses",
    summary: "Micro Units Development & Refinance Agency loans for non-farm enterprises.",
  },
  {
    id: "startup-india",
    name: "Startup India",
    match: 75,
    benefit: "Tax benefits & easier compliance",
    documents: ["Incorporation Certificate", "PAN", "Pitch / Concept Note"],
    difficulty: "High",
    deadline: "Open all year",
    category: "Innovative startups",
    summary: "Recognition & benefits for DPIIT-registered innovative startups.",
  },
  {
    id: "standup-india",
    name: "Stand-Up India",
    match: 70,
    benefit: "Loan ₹10 Lakh – ₹1 Cr for SC/ST & women",
    documents: ["Aadhaar", "Caste/ID Proof", "Project Report", "Bank Details"],
    difficulty: "Medium",
    deadline: "Open all year",
    category: "SC/ST & Women entrepreneurs",
    summary: "Bank loans for greenfield enterprises by SC/ST and women founders.",
  },
];

export const feasibilityBreakdown = [
  { label: "Market Demand", score: 88, color: "#039855" },
  { label: "Competition", score: 72, color: "#2563eb" },
  { label: "Investment Fit", score: 84, color: "#7c3aed" },
  { label: "Profitability", score: 90, color: "#f97316" },
  { label: "Risk Control", score: 80, color: "#0891b2" },
];

export const healthCategories = [
  { label: "Sales", score: 84 },
  { label: "Profit", score: 78 },
  { label: "Finance", score: 88 },
  { label: "Marketing", score: 62 },
  { label: "Growth", score: 80 },
  { label: "Risk", score: 70 },
];

export const revenueTrend = [
  { month: "Mar", revenue: 62000, expenses: 44000, profit: 18000 },
  { month: "Apr", revenue: 68000, expenses: 46000, profit: 22000 },
  { month: "May", revenue: 71000, expenses: 45000, profit: 26000 },
  { month: "Jun", revenue: 76000, expenses: 48000, profit: 28000 },
  { month: "Jul", revenue: 82000, expenses: 49000, profit: 33000 },
  { month: "Aug", revenue: 91000, expenses: 51000, profit: 40000 },
];

export const customerGrowth = [
  { month: "Mar", customers: 120 },
  { month: "Apr", customers: 148 },
  { month: "May", customers: 176 },
  { month: "Jun", customers: 210 },
  { month: "Jul", customers: 268 },
  { month: "Aug", customers: 322 },
];

export const languages = [
  "English",
  "हिन्दी (Hindi)",
  "বাংলা (Bengali)",
  "தமிழ் (Tamil)",
  "తెలుగు (Telugu)",
  "मराठी (Marathi)",
  "ગુજરાતી (Gujarati)",
  "ಕನ್ನಡ (Kannada)",
];

// Indian states & union territories, plus major cities for location validation.
export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Puducherry", "Chandigarh", "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
];

// City → State pairs used for suggestions and validation.
export const indianCities: { city: string; state: string }[] = [
  { city: "Mumbai", state: "Maharashtra" }, { city: "Pune", state: "Maharashtra" },
  { city: "Nagpur", state: "Maharashtra" }, { city: "Nashik", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" }, { city: "New Delhi", state: "Delhi" },
  { city: "Bengaluru", state: "Karnataka" }, { city: "Bangalore", state: "Karnataka" },
  { city: "Mysuru", state: "Karnataka" }, { city: "Hubli", state: "Karnataka" },
  { city: "Chennai", state: "Tamil Nadu" }, { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Madurai", state: "Tamil Nadu" }, { city: "Salem", state: "Tamil Nadu" },
  { city: "Kolkata", state: "West Bengal" }, { city: "Salt Lake", state: "West Bengal" },
  { city: "New Town", state: "West Bengal" }, { city: "Howrah", state: "West Bengal" },
  { city: "Siliguri", state: "West Bengal" }, { city: "Durgapur", state: "West Bengal" },
  { city: "Hyderabad", state: "Telangana" }, { city: "Warangal", state: "Telangana" },
  { city: "Ahmedabad", state: "Gujarat" }, { city: "Surat", state: "Gujarat" },
  { city: "Vadodara", state: "Gujarat" }, { city: "Rajkot", state: "Gujarat" },
  { city: "Jaipur", state: "Rajasthan" }, { city: "Jodhpur", state: "Rajasthan" },
  { city: "Udaipur", state: "Rajasthan" }, { city: "Kota", state: "Rajasthan" },
  { city: "Lucknow", state: "Uttar Pradesh" }, { city: "Kanpur", state: "Uttar Pradesh" },
  { city: "Varanasi", state: "Uttar Pradesh" }, { city: "Agra", state: "Uttar Pradesh" },
  { city: "Noida", state: "Uttar Pradesh" }, { city: "Ghaziabad", state: "Uttar Pradesh" },
  { city: "Patna", state: "Bihar" }, { city: "Gaya", state: "Bihar" },
  { city: "Bhopal", state: "Madhya Pradesh" }, { city: "Indore", state: "Madhya Pradesh" },
  { city: "Gwalior", state: "Madhya Pradesh" }, { city: "Jabalpur", state: "Madhya Pradesh" },
  { city: "Chandigarh", state: "Chandigarh" }, { city: "Ludhiana", state: "Punjab" },
  { city: "Amritsar", state: "Punjab" }, { city: "Jalandhar", state: "Punjab" },
  { city: "Gurugram", state: "Haryana" }, { city: "Faridabad", state: "Haryana" },
  { city: "Kochi", state: "Kerala" }, { city: "Thiruvananthapuram", state: "Kerala" },
  { city: "Kozhikode", state: "Kerala" }, { city: "Thrissur", state: "Kerala" },
  { city: "Bhubaneswar", state: "Odisha" }, { city: "Cuttack", state: "Odisha" },
  { city: "Guwahati", state: "Assam" }, { city: "Dibrugarh", state: "Assam" },
  { city: "Ranchi", state: "Jharkhand" }, { city: "Jamshedpur", state: "Jharkhand" },
  { city: "Raipur", state: "Chhattisgarh" }, { city: "Dehradun", state: "Uttarakhand" },
  { city: "Shimla", state: "Himachal Pradesh" }, { city: "Panaji", state: "Goa" },
  { city: "Visakhapatnam", state: "Andhra Pradesh" }, { city: "Vijayawada", state: "Andhra Pradesh" },
  { city: "Srinagar", state: "Jammu and Kashmir" }, { city: "Jammu", state: "Jammu and Kashmir" },
  { city: "Puducherry", state: "Puducherry" }, { city: "Agartala", state: "Tripura" },
  { city: "Imphal", state: "Manipur" }, { city: "Shillong", state: "Meghalaya" },
  { city: "Aizawl", state: "Mizoram" }, { city: "Kohima", state: "Nagaland" },
  { city: "Itanagar", state: "Arunachal Pradesh" }, { city: "Gangtok", state: "Sikkim" },
];

// Suggestions for the location <datalist>, e.g. "Salt Lake, West Bengal".
export const locationSuggestions = indianCities.map((c) => `${c.city}, ${c.state}`);

const norm = (s: string) => s.trim().toLowerCase();

/** True when the typed location matches a known Indian city or state. */
export function isValidIndianLocation(input: string): boolean {
  const q = norm(input);
  if (q.length < 2) return false;
  const parts = q.split(",").map((s) => s.trim()).filter(Boolean);
  const cityOk = indianCities.some((c) => parts.includes(norm(c.city)) || q === norm(`${c.city}, ${c.state}`));
  const stateOk = indianStates.some((st) => parts.includes(norm(st)));
  return cityOk || stateOk;
}

export const interests = [
  { id: "food", label: "Cooking / Food", hi: "खाना / भोजन", bn: "রান্না / খাবার", emoji: "🍳" },
  { id: "tech", label: "Technology", hi: "तकनीक", bn: "প্রযুক্তি", emoji: "💻" },
  { id: "agri", label: "Agriculture", hi: "कृषि", bn: "কৃষি", emoji: "🌾" },
  { id: "retail", label: "Retail", hi: "खुदरा", bn: "খুচরা", emoji: "🛍️" },
  { id: "services", label: "Services", hi: "सेवाएँ", bn: "সেবা", emoji: "🛠️" },
  { id: "manufacturing", label: "Manufacturing", hi: "निर्माण", bn: "উৎপাদন", emoji: "🏭" },
  { id: "education", label: "Education", hi: "शिक्षा", bn: "শিক্ষা", emoji: "📚" },
  { id: "beauty", label: "Beauty & Wellness", hi: "सौंदर्य", bn: "সৌন্দর্য", emoji: "💇" },
];

export function interestLabel(id: string, lang: "en" | "hi" | "bn"): string {
  const it = interests.find((i) => i.id === id);
  if (!it) return id;
  return lang === "hi" ? it.hi : lang === "bn" ? it.bn : it.label;
}

export interface Mentor {
  name: string;
  expertise: string;
  experience: string;
  languages: string;
  rating: number;
}

export const mentors: Mentor[] = [
  {
    name: "Ananya Chatterjee",
    expertise: "Food & Cloud Kitchens",
    experience: "12 yrs",
    languages: "Bengali, Hindi, English",
    rating: 4.9,
  },
  {
    name: "Rajesh Kumar",
    expertise: "Retail & Supply Chain",
    experience: "18 yrs",
    languages: "Hindi, English",
    rating: 4.8,
  },
  {
    name: "Fatima Sheikh",
    expertise: "Government Schemes & Loans",
    experience: "9 yrs",
    languages: "Hindi, Urdu, English",
    rating: 4.9,
  },
];

export interface CommunityPost {
  author: string;
  time: string;
  question: string;
  upvotes: number;
  replies: number;
  verified: boolean;
  summary: string;
}

export const communityPosts: CommunityPost[] = [
  {
    author: "Suman Das",
    time: "2 hrs ago",
    question: "How can I increase customers for my grocery store?",
    upvotes: 46,
    replies: 12,
    verified: true,
    summary:
      "Top advice: start a WhatsApp order group, offer free local delivery above ₹300, and run a weekend loyalty discount.",
  },
  {
    author: "Priya Nair",
    time: "6 hrs ago",
    question: "Which is better for a cloud kitchen — Swiggy or a own delivery boy?",
    upvotes: 31,
    replies: 8,
    verified: false,
    summary:
      "Community suggests starting on aggregators for reach, then shifting regulars to direct WhatsApp ordering to save commission.",
  },
];

export const doctorProblems = [
  { id: "sales", label: "Low Sales", emoji: "📉" },
  { id: "profit", label: "Low Profit", emoji: "💸" },
  { id: "expenses", label: "High Expenses", emoji: "🧾" },
  { id: "customers", label: "Declining Customers", emoji: "👥" },
  { id: "cashflow", label: "Cash Flow Problems", emoji: "🏦" },
  { id: "marketing", label: "Marketing Problems", emoji: "📣" },
];

export const journeySteps = [
  { id: "discover", label: "Discover Opportunity", icon: "MapPin", page: "opportunities" },
  { id: "feasibility", label: "Check Feasibility", icon: "Gauge", page: "feasibility" },
  { id: "plan", label: "Create Business Plan", icon: "ClipboardList", page: "plan" },
  { id: "funding", label: "Arrange Funding", icon: "IndianRupee", page: "finance" },
  { id: "schemes", label: "Find Schemes & Loans", icon: "Landmark", page: "schemes" },
  { id: "launch", label: "Launch Business", icon: "Rocket", page: "dashboard" },
  { id: "health", label: "Monitor Health", icon: "Activity", page: "health" },
  { id: "grow", label: "Improve & Grow", icon: "TrendingUp", page: "simulator" },
];
