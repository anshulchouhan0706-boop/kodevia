# Service pages for kodevia. Plain data; lab/build_pages.py turns these into
# services/<slug>.html. Same rules as the blog: no invented statistics,
# clients or timelines. "price" is the starting point shown on each page;
# change it here and rebuild.

CITY = "Indore"
REGION = "Madhya Pradesh"

STEPS = """
<h2>How a project runs</h2>
<ol>
  <li><strong>Discover.</strong> We learn the business, the people who will use it and the constraints, and agree what success looks like. You get a scope, a timeline and a fixed quote before you commit.</li>
  <li><strong>Design.</strong> Flows, wireframes and a clickable prototype you can try on your own phone, then the final visual design.</li>
  <li><strong>Build.</strong> Development in short rounds on a private staging link, so you see real progress instead of status reports.</li>
  <li><strong>Launch and care.</strong> Hosting, store submission where needed, analytics and search setup, then ongoing support after day one.</li>
</ol>
"""

SERVICES = [
  {
    "slug": "website-development",
    "name": "Website development",
    "h1": "Website development company in Indore",
    "seo_title": "Website Development Company in Indore",
    "description": "Kodevia designs and builds fast, mobile-first websites for businesses in Indore and across India: business sites, landing pages and web apps, with SEO built in.",
    "lede": "Fast, mobile-first websites for businesses in Indore and across India, designed around what your customers need to do, and easy for your team to update.",
    "price": "Starts under ₹50,000",
    "price_note": "for a focused business website. Larger sites, web apps and portals are quoted after a short discovery call.",
    "work": ("work/websites.html", "See our website projects"),
    "cover": "w-furniture",
    "related": ["wordpress-vs-custom-website", "why-is-my-website-slow", "get-your-business-found-on-google", "what-decides-website-app-cost"],
    "body": """
<h2>What you get</h2>
<ul>
  <li><strong>A custom design</strong> built around your brand and your customers, not a stock theme.</li>
  <li><strong>Mobile-first pages</strong> that load quickly on the phones and networks your visitors actually use.</li>
  <li><strong>Search basics done properly</strong>: clean page titles, descriptions, structured data, a sitemap and Google Search Console setup.</li>
  <li><strong>Enquiries that reach you</strong>: contact and booking forms, call and WhatsApp buttons, and leads delivered where your team works.</li>
  <li><strong>Easy updates</strong>, so changing a price, a photo or an opening time does not need a developer.</li>
  <li><strong>Accessibility and speed checks</strong> before every release, not after launch.</li>
</ul>

<h2>Websites we build</h2>
<p><strong>Business and service websites</strong> that explain what you do and turn visitors into calls and enquiries. <strong>Landing pages</strong> for a campaign, an event or a new product. <strong>Web apps and portals</strong> such as booking systems, customer accounts and internal dashboards. <strong>Redesigns</strong> of an existing site that has become slow, dated or hard to manage.</p>

<h2>Who it is for</h2>
<p>Shops, clinics, coaching institutes, restaurants, property firms, manufacturers and startups in Indore that want a website which earns its keep: one that shows up when people search, looks right on a phone, and makes it easy to get in touch. We work with you in person in Indore or remotely, wherever you are in India.</p>
""",
    "faq": [
      ("How much does a website cost in Indore?", "It depends on the number of unique pages, the features and who supplies the content. A focused business website with Kodevia starts under ₹50,000. You get a fixed quote after a short discovery call, listing exactly what is included."),
      ("How long does it take to build a website?", "A marketing site with a handful of pages is usually the quickest kind of project and typically takes weeks, not months. You get an agreed timeline at the end of Discover, before the build starts."),
      ("Will my website show up on Google?", "Every site we build has the technical search basics in place: fast pages, clean titles and descriptions, structured data, a sitemap and Search Console. Ranking for competitive searches also takes good content and time, and we can help with both."),
      ("Can you redesign my existing website?", "Yes. We start by reviewing what is already there, keep what works, and move your content and search value across carefully so you do not lose visitors in the switch."),
    ],
  },
  {
    "slug": "mobile-app-development",
    "name": "Mobile app development",
    "h1": "Mobile app development company in Indore",
    "seo_title": "Mobile App Development Company in Indore",
    "description": "Kodevia builds iOS and Android apps for businesses in Indore and across India, cross-platform or native, from first prototype to Play Store and App Store launch.",
    "lede": "iOS and Android apps for businesses in Indore and across India, from the first clickable prototype through to launch on Google Play and the App Store.",
    "price": "Starts from ₹1,00,000",
    "price_note": "for a focused first version. Apps with payments, live tracking or many integrations are quoted after discovery.",
    "work": ("work/apps.html", "See our app projects"),
    "cover": "c-apps",
    "related": ["flutter-vs-react-native-vs-native", "publish-app-on-play-store-and-app-store", "website-or-mobile-app-first", "how-long-to-build-website-or-app"],
    "body": """
<h2>What you get</h2>
<ul>
  <li><strong>One app for iOS and Android</strong>, built cross-platform with Flutter or React Native, or fully native when the product needs it. We explain the trade-off before you choose.</li>
  <li><strong>A clickable prototype first</strong>, so you can test the idea with real users before paying for the full build.</li>
  <li><strong>The parts behind the app</strong>: sign-in, payments, notifications, an admin panel for your team and the server it all runs on.</li>
  <li><strong>Testing on real devices</strong>, including the older and budget phones many of your customers use.</li>
  <li><strong>Store launch handled</strong>: listings, screenshots, privacy details and submission to Google Play and the App Store, set up in your name.</li>
  <li><strong>Care after launch</strong>: updates for new OS versions, fixes and new features as you grow.</li>
</ul>

<h2>Apps we build</h2>
<p><strong>Ordering and delivery apps</strong> for food, retail and everyday commerce. <strong>Booking apps</strong> for services, clinics and classes. <strong>Customer and loyalty apps</strong> that bring people back. <strong>Internal apps</strong> for field teams, inventory and operations.</p>

<h2>Who it is for</h2>
<p>Businesses in Indore whose customers come back often enough to keep an app on their phone, and founders who want to launch a product. If you are not sure an app is the right first step, we will tell you honestly; sometimes a fast website does the job sooner and for less.</p>
""",
    "faq": [
      ("How much does it cost to build an app in Indore?", "A focused first version with Kodevia starts from ₹1,00,000. Cost depends mainly on the number of screens, features such as payments or live tracking, and whether you need iOS, Android or both. You get a fixed quote after discovery."),
      ("Flutter, React Native or native: which should I choose?", "For most business apps, one cross-platform codebase covers iOS and Android at lower cost. Native makes sense for heavy device features or demanding performance. We recommend one after Discover, with the reasons."),
      ("Do you publish the app to the Play Store and App Store?", "Yes. We prepare the listings and submit to both stores, with the developer accounts in your name so you own the app."),
      ("Who owns the app and the code?", "You do. The code repositories, design files and store accounts are set up in your name from the start."),
    ],
  },
  {
    "slug": "ui-ux-design",
    "name": "UI/UX design",
    "h1": "UI/UX design agency in Indore",
    "seo_title": "UI/UX Design Agency in Indore",
    "description": "Kodevia's UI/UX design for websites and apps: research, user flows, clickable prototypes and a design system your developers can build from. Based in Indore.",
    "lede": "Research, user flows, clickable prototypes and polished interfaces for websites and apps, handed over as a design system your developers can build from.",
    "price": "Starts under ₹50,000",
    "price_note": "for a focused design project such as a landing page or a set of key app screens. Full product design is quoted after discovery.",
    "work": ("work/design.html", "See our design work"),
    "cover": "c-design",
    "related": ["what-is-ui-ux-design", "before-you-hire-a-web-development-company", "website-or-mobile-app-first"],
    "body": """
<h2>What you get</h2>
<ul>
  <li><strong>Research that fits your budget</strong>: short interviews, a look at competitors and a review of your current product, so design decisions rest on what users need.</li>
  <li><strong>User flows and wireframes</strong> that make the path to buy, book or sign up obvious.</li>
  <li><strong>A clickable prototype</strong> you can put in front of real customers before anything is built.</li>
  <li><strong>Final interface design</strong> for every screen and state, on phone, tablet and desktop.</li>
  <li><strong>A design system</strong> of colours, type and components, so your product stays consistent as it grows.</li>
  <li><strong>A clean handover</strong> in Figma, ready for our developers or yours.</li>
</ul>

<h2>Why design comes first</h2>
<p>Changing a screen in a prototype takes minutes; changing it after it is built takes days. Good UX design catches confusing steps, missing features and wrong assumptions while they are still cheap to fix, and it is usually the difference between a product people tolerate and one they enjoy using.</p>

<h2>Who it is for</h2>
<p>Founders validating an idea, businesses in Indore planning a new website or app, and teams whose existing product feels confusing, dated or inconsistent. Design can be a standalone project or the first stage of a full build with us.</p>
""",
    "faq": [
      ("What is the difference between UI and UX design?", "UX design is how the product works: the steps, the structure and how easy it is to get things done. UI design is how it looks and feels: layout, type, colour and detail. You need both, and we do both."),
      ("Can you design for my existing developers to build?", "Yes. We hand over organised Figma files and a design system with every component and state specified, so any competent team can build from it."),
      ("Do I need a prototype?", "For anything beyond a simple website, yes. A clickable prototype lets you and your customers try the product before the build, which is the cheapest moment to change your mind."),
      ("How much does UI/UX design cost?", "A focused design project starts under ₹50,000. Full product design depends on the number of screens and the research involved, and is quoted after a short discovery call."),
    ],
  },
  {
    "slug": "ecommerce-development",
    "name": "E-commerce development",
    "h1": "E-commerce website development in Indore",
    "seo_title": "E-commerce Website Development in Indore",
    "description": "Online stores for businesses in Indore and across India: Shopify or custom e-commerce, UPI and card payments, shipping, GST invoices and an easy admin.",
    "lede": "Online stores that are easy to shop on a phone and easy to run behind the scenes, on Shopify or fully custom, with Indian payments and shipping built in.",
    "price": "Starts from ₹50,000",
    "price_note": "for a store on Shopify or a focused custom catalogue. Custom stores with complex pricing, multiple vendors or ERP links are quoted after discovery.",
    "work": ("work/websites.html", "See our store projects"),
    "cover": "c-shop",
    "related": ["shopify-vs-custom-ecommerce", "why-is-my-website-slow", "what-decides-website-app-cost", "website-maintenance-explained"],
    "body": """
<h2>What you get</h2>
<ul>
  <li><strong>The right platform for you</strong>: Shopify when speed and simplicity matter most, or a custom store when you need your own rules, pricing or integrations. We explain the trade-off honestly.</li>
  <li><strong>Indian payments</strong>: UPI, cards, net banking and wallets through a payment gateway such as Razorpay, plus cash on delivery if you offer it.</li>
  <li><strong>Shipping and orders</strong>: delivery charges, pincode checks, courier integration, order emails and WhatsApp updates.</li>
  <li><strong>GST-ready invoices</strong> and the tax settings your accountant expects.</li>
  <li><strong>An admin your team can use</strong> to add products, change prices, manage stock and process orders without calling a developer.</li>
  <li><strong>Search-friendly product pages</strong> that load fast, so you can be found on Google and not only through ads and marketplaces.</li>
</ul>

<h2>Stores we build</h2>
<p><strong>Brand stores</strong> for fashion, furniture, food and lifestyle products. <strong>B2B catalogues</strong> with wholesale pricing and enquiry-based ordering. <strong>Marketplace companions</strong>: your own store alongside Amazon or Flipkart, so repeat customers buy from you directly.</p>

<h2>Who it is for</h2>
<p>Retailers, manufacturers and D2C brands in Indore that want to sell online under their own name, and businesses whose current store is slow, hard to manage or losing customers at checkout.</p>
""",
    "faq": [
      ("Shopify or a custom e-commerce website: which is better?", "Shopify is quicker to launch and simple to run, with a monthly fee. A custom store costs more up front but fits unusual pricing, workflows or integrations exactly. We recommend one after understanding your products and plans."),
      ("Which payment methods can my store accept?", "UPI, cards, net banking and wallets through a payment gateway such as Razorpay, and cash on delivery if you want it. The gateway pays out to your bank account."),
      ("Can you connect my store to couriers and my billing software?", "Yes. Courier, inventory and accounting integrations are common; we confirm what your providers support during discovery."),
      ("How much does an e-commerce website cost?", "A store on Shopify or a focused custom catalogue starts from ₹50,000. The final quote depends on the number of products, features and integrations, and lists exactly what is included."),
    ],
  },
]
