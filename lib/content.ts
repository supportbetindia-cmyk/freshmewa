// Homepage copy + product data. Kept verbatim and structured so it can move to a CMS later.

export const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Flavours", href: "/#flavours" },
  { label: "Why Fresh Mewa", href: "/#why" },
  { label: "Our Story", href: "/our-story" },
  { label: "FAQs", href: "/#faq" },
]

/** "7 October 2026" — blog dates. */
export const formatDate = (d: Date) => d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long" });
export type Flavour = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  cta: string;
  /** Tailwind colour token names from globals.css */
  tone: "mint" | "pepper" | "chilli";
};

/** Literal class strings so Tailwind picks them up. */
export const tones = {
  mint: { soft: "bg-mint-soft", text: "text-mint", solid: "bg-mint" },
  pepper: { soft: "bg-pepper-soft", text: "text-pepper", solid: "bg-pepper" },
  chilli: { soft: "bg-chilli-soft", text: "text-chilli", solid: "bg-chilli" },
} as const;

export const flavours: Flavour[] = [
  {
    slug: "pudina",
    name: "Pudina Makhana",
    short: "Pudina",
    tagline: "Cool. Herby. Refreshingly familiar.",
    description:
      "A refreshing minty flavour with a savoury finish easy to reach for whenever you want something simple and satisfying.",
    cta: "Try Pudina",
    tone: "mint",
  },
  {
    slug: "salt-pepper",
    name: "Salt & Pepper Makhana",
    short: "Salt & Pepper",
    tagline: "Classic. Savoury. Always a good idea.",
    description:
      "A familiar mix of salt and pepper with that satisfying roasted crunch. Nothing complicated. Just a classic that works.",
    cta: "Try Salt & Pepper",
    tone: "pepper",
  },
  {
    slug: "peri-peri",
    name: "Peri Peri Makhana",
    short: "Peri Peri",
    tagline: "Bold. Spicy. Made for a little kick.",
    description:
      "For those moments when you want more flavour and a little extra heat in every bite.",
    cta: "Try Peri Peri",
    tone: "chilli",
  },
];

export const differences = [
  {
    title: "Crunch You Can Taste",
    body: [
      "You know that first bite that tells you the snack is going to be good?",
      "That's the kind of crunch we're talking about.",
    ],
  },
  {
    title: "Flavours That Make You Come Back",
    body: [
      "Because a snack can be a better choice and still have to taste exciting.",
      "Our flavours are made to keep everyday snacking interesting and give you a reason to reach for another handful.",
    ],
  },
  {
    title: "Roasted for the Right Crunch",
    body: [
      "The texture matters.",
      "That's why roasting is at the heart of the Fresh Mewa experience. Because when the crunch is right, the whole snack feels right.",
    ],
  },
];

export const moments = [
  { title: "Chai Break", body: "Something crunchy beside that cup of chai.", icon: "coffee" },
  { title: "Office Break", body: "Because another meeting can wait five minutes.", icon: "briefcase" },
  { title: "Study Time", body: "A little something between pages, tabs and deadlines.", icon: "book" },
  { title: "Movie Night", body: "For the handful that somehow becomes another handful.", icon: "film" },
  { title: "Travel", body: "Something easy to keep close when you're on the move.", icon: "plane" },
  { title: "At Home", body: "No special occasion needed.", icon: "home" },
] as const;

export const education = [
  {
    q: "So, what exactly is Makhana?",
    a: [
      "Makhana, also known as fox nuts, is a familiar Indian ingredient that has been enjoyed in many different ways.",
      "Fresh Mewa gives it a modern snacking twist by roasting it and pairing it with flavours made for everyday snack breaks.",
    ],
  },
  {
    q: "Why do people choose roasted makhana as a snack?",
    a: [
      "Because it's easy to enjoy, works well with different flavours and has the satisfying crunch people look for in a good snack.",
      "The final taste and texture depend on how the makhana is roasted and seasoned.",
    ],
  },
  {
    q: "What's the best makhana flavour?",
    a: [
      "Honestly? The one you enjoy reaching for again.",
      "Go cool and refreshing with Pudina, keep it classic with Salt & Pepper, or turn up the heat with Peri Peri.",
    ],
  },
];

export const faqs = [
  {
    q: "What is Fresh Mewa?",
    a: ["Fresh Mewa is a modern Indian snacking brand currently focused on flavourful roasted makhana made for everyday snacking."],
  },
  {
    q: "What is roasted makhana?",
    a: ["Roasted makhana is makhana that is roasted to create a crisp, crunchy texture and then seasoned with flavour."],
  },
  {
    q: "What flavours of makhana does Fresh Mewa offer?",
    a: ["Fresh Mewa currently offers three flavours: Pudina, Salt & Pepper, and Peri Peri."],
  },
  {
    q: "Is Fresh Mewa makhana made for everyday snacking?",
    a: ["Yes. Fresh Mewa is made for everyday moments like chai breaks, work breaks, travel, study time, movie nights and evenings at home."],
  },
  {
    q: "Where can I buy Fresh Mewa Makhana?",
    a: ["Fresh Mewa makhana can be purchased through the brand's online store and other authorised selling channels, subject to availability."],
  },
  {
    q: "How should I store roasted makhana?",
    a: ["Keep the pack properly sealed and store it in a cool, dry place. For the best experience, follow the storage instructions mentioned on the product packaging."],
  },
  {
    q: "Which Fresh Mewa flavour should I try first?",
    a: [
      "Like your snacks cool and refreshing? Try Pudina.",
      "Prefer something classic and savoury? Go for Salt & Pepper.",
      "Like a little heat? Peri Peri is your pick.",
    ],
  },
  {
    q: "Is Fresh Mewa only a makhana brand?",
    a: ["Fresh Mewa is currently focused on roasted makhana, with more everyday snacking options to come in the future."],
  },
];

// ── Shop page ────────────────────────────────────────────────

/** Shop-page copy per flavour, keyed by slug. */
export const shopFlavours: Record<string, { tagline: string; description: string; guide: string }> = {
  pudina: {
    tagline: "Cool. Herby. Refreshing.",
    description: "A minty, savoury take on roasted makhana with a clean, refreshing finish.",
    guide: "For a cooler, fresher taste.",
  },
  "salt-pepper": {
    tagline: "Simple. Savoury. Familiar.",
    description: "Salt and pepper come together for a classic taste that's easy to enjoy.",
    guide: "For something familiar and savoury.",
  },
  "peri-peri": {
    tagline: "Bold. Spicy. Full of attitude.",
    description: "A lively peri peri seasoning for anyone who likes a little more heat.",
    guide: "For a bolder, spicier bite.",
  },
};

export const orderInfo = [
  { title: "Flavours", body: "Pudina, Salt & Pepper and Peri Peri.", icon: "sparkles" },
  { title: "Ingredients", body: "Full ingredient details are available on each product page.", icon: "list" },
  { title: "Pack Details", body: "Available pack sizes and quantities are shown on the product page.", icon: "package" },
  { title: "Storage", body: "Follow the storage instructions provided on the packaging.", icon: "archive" },
  { title: "Availability", body: "Pricing, stock and delivery details are displayed at the time of purchase.", icon: "truck" },
] as const;

export const shopFaqs = [
  {
    q: "Can I buy Fresh Mewa makhana online?",
    a: ["Yes. Fresh Mewa makhana is available through the brand's online store, subject to availability."],
  },
  {
    q: "What flavours can I order?",
    a: ["The current range includes Pudina, Salt & Pepper and Peri Peri."],
  },
  {
    q: "Which one should I try first?",
    a: ["Go with Pudina for a refreshing taste, Salt & Pepper for a classic savoury option, or Peri Peri when you're in the mood for something spicy."],
  },
  {
    q: "Can I order more than one flavour?",
    a: ["Yes. You can add different varieties to your order based on availability."],
  },
  {
    q: "Where can I find product details?",
    a: ["Ingredients, pack information, storage instructions, pricing and other relevant details are available on each product page."],
  },
];

// ── Product pages ────────────────────────────────────────────
// ⚠️ SAMPLE DATA: packs, prices, ingredients and nutrition below are placeholders.
// Replace with the values printed on the real packaging before launch (see README).

export type Pack = { id: string; label: string; price: number; mrp: number };

export const packs: Pack[] = [
  { id: "60g", label: "60 g", price: 99, mrp: 119 },
  { id: "120g", label: "120 g", price: 179, mrp: 219 },
  { id: "250g", label: "250 g", price: 349, mrp: 429 },
];

export const productDetails: Record<string, { ingredients: string; nutrition: [string, string][] }> = {
  pudina: {
    ingredients: "Makhana (fox nuts), edible vegetable oil, salt, dried mint, spices & condiments.",
    nutrition: [
      ["Energy", "120 kcal"],
      ["Protein", "3.5 g"],
      ["Carbohydrate", "20 g"],
      ["Total fat", "3 g"],
      ["Dietary fibre", "2.5 g"],
      ["Sodium", "180 mg"],
    ],
  },
  "salt-pepper": {
    ingredients: "Makhana (fox nuts), edible vegetable oil, salt, black pepper.",
    nutrition: [
      ["Energy", "118 kcal"],
      ["Protein", "3.5 g"],
      ["Carbohydrate", "20 g"],
      ["Total fat", "3 g"],
      ["Dietary fibre", "2.5 g"],
      ["Sodium", "170 mg"],
    ],
  },
  "peri-peri": {
    ingredients: "Makhana (fox nuts), edible vegetable oil, salt, peri peri seasoning (chilli, garlic, onion, spices).",
    nutrition: [
      ["Energy", "122 kcal"],
      ["Protein", "3.5 g"],
      ["Carbohydrate", "20 g"],
      ["Total fat", "3.2 g"],
      ["Dietary fibre", "2.5 g"],
      ["Sodium", "190 mg"],
    ],
  },
};

export const packById = (id: string) => packs.find((p) => p.id === id) ?? packs[0];
export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ── Our Story page ───────────────────────────────────────────

export const storyChapters = [
  { id: "we-snack", title: "We Snack. A Lot." },
  { id: "not-healthy", title: "We Didn't Want Another “Healthy Snack”." },
  { id: "why-makhana", title: "Why Makhana?" },
  { id: "why-fresh-mewa", title: "Why Fresh Mewa?" },
  { id: "in-the-pack", title: "What's in the Pack Matters" },
  { id: "taste", title: "Taste Still Matters" },
  { id: "real-life", title: "Made for Real Life" },
  { id: "three-flavours", title: "Three Flavours to Start With" },
  { id: "beginning", title: "And This Is Just the Beginning" },
  { id: "keep-simple", title: "A Few Things We Want to Keep Simple" },
];

export const storyFaqs = [
  {
    q: "Why did Fresh Mewa start with makhana?",
    a: ["Makhana felt like the right place to begin because it is familiar, versatile and works beautifully as a crunchy snack."],
  },
  {
    q: "What makes Fresh Mewa different?",
    a: ["We focus on simple things that matter: flavour, crunch, quality and keeping unnecessary additions out of the product."],
  },
  {
    q: "Does Fresh Mewa use added oil or preservatives?",
    a: ["Fresh Mewa roasted makhana is made without added oil and preservatives."],
  },
  {
    q: "Is Fresh Mewa a healthy snack brand?",
    a: ["Fresh Mewa is a snacking brand first. We focus on making everyday snacking more thoughtful without turning it into a strict set of rules."],
  },
  {
    q: "Can Fresh Mewa be an alternative to fried chips?",
    a: ["Fresh Mewa is another option for those everyday moments when you want something crunchy and flavourful instead of reaching for the usual fried snack."],
  },
  {
    q: "What flavours does Fresh Mewa offer?",
    a: ["Fresh Mewa currently offers Pudina, Salt & Pepper and Peri Peri roasted makhana."],
  },
];

// ── Checkout ─────────────────────────────────────────────────
export const checkoutSettings = {
  /** ⚠️ SAMPLE: delivery charge in ₹ (0 = free). Set the real policy before launch. */
  deliveryFee: 0,
  /**
   * WhatsApp number that receives new orders, with country code and no "+" (e.g. "919876543210").
   * Empty = WhatsApp hand-off is off and orders are only saved on the customer's device.
   */
  orderWhatsApp: "",
};

export const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];
