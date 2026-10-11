# Blog articles for kodevia. Plain data; lab/build_pages.py turns these into
# pages. Each body is HTML using only <h2>, <h3>, <p>, <ul>/<ol>, <li>,
# <strong>, <a>, <blockquote>. No invented statistics, clients or prices.

ARTICLES = [
  {
    "slug": "how-long-to-build-website-or-app",
    "seo_title": "How Long Does It Take to Build a Website or App?",
    "title": "How long does it take to build a website or app?",
    "description": "What sets the timeline of a website or mobile app project, the stages it moves through, and how to keep yours on schedule.",
    "date": "2026-10-06",
    "cover": "c-design",
    "tag": "Planning",
    "body": """
<p>"When can it go live?" is usually the second question after "how much?". The honest answer depends on scope, but the timeline is far more predictable once you know what each stage involves and what slows projects down.</p>

<h2>The stages every project goes through</h2>
<ol>
  <li><strong>Discover.</strong> Understanding the business, the users and the must-have features. This sets the scope everything else depends on.</li>
  <li><strong>Design.</strong> Flows and wireframes first, then a clickable prototype, then the final visual design.</li>
  <li><strong>Build.</strong> Development in short rounds, with a staging link you can open and test as it grows.</li>
  <li><strong>Test and launch.</strong> Checking every screen on real devices, fixing issues, going live, and for apps, store review.</li>
</ol>

<h2>What makes a project shorter</h2>
<ul>
  <li>A clear goal and a short must-have list for the first version</li>
  <li>Content, photos and brand files ready at the start</li>
  <li>One person who gives feedback and approves quickly</li>
  <li>Using proven building blocks instead of inventing everything from scratch</li>
</ul>

<h2>What makes it longer</h2>
<ul>
  <li>New features added halfway through</li>
  <li>Waiting on content, logins or approvals</li>
  <li>Integrations with outside systems, such as payments, ERPs or delivery partners</li>
  <li>Building for many platforms at once</li>
  <li>App store reviews, which you do not control</li>
</ul>

<h2>Websites and apps are different</h2>
<p>A marketing website with a handful of pages is usually the quickest kind of project. An online store, a booking system or a customer portal takes longer because every feature needs logic and testing. A mobile app adds device testing, store listings and review time on top of the build.</p>

<h2>Launch small, then grow</h2>
<p>The fastest route to a live product is a focused first version: the features that deliver your goal, done well. Everything on the nice-to-have list can follow in later rounds, guided by what real customers actually use.</p>

<blockquote>Every Kodevia project starts with a timeline agreed at the end of Discover, before you commit to the build. Book a free demo and we will map yours out.</blockquote>
""",
  },
  {
    "slug": "wordpress-vs-custom-website",
    "seo_title": "WordPress vs Custom Website: Which Is Right for You?",
    "title": "WordPress or a custom-built website: which is right for your business?",
    "description": "An honest comparison of WordPress and custom-built websites: cost, speed, security, flexibility and who each one suits.",
    "date": "2026-10-03",
    "cover": "w-food-light",
    "tag": "Technology",
    "body": """
<p>Many business owners are told to "just use WordPress", while others are told it is outdated. Both can be right. The real question is what your website needs to do, now and in a couple of years.</p>

<h2>What WordPress is good at</h2>
<ul>
  <li><strong>Content-heavy sites.</strong> Blogs, news and pages your team updates often.</li>
  <li><strong>Familiar editing.</strong> Many people already know how to use its admin panel.</li>
  <li><strong>Plugins.</strong> Contact forms, SEO tools and simple shops can be added quickly.</li>
</ul>

<h2>Where WordPress can struggle</h2>
<ul>
  <li><strong>Plugin overload.</strong> Each plugin adds code, which can slow pages and create security gaps if not kept updated.</li>
  <li><strong>Custom features.</strong> Unusual booking rules, dashboards or customer portals often end up fighting the platform.</li>
  <li><strong>Design limits.</strong> Off-the-shelf themes can make sites look alike unless the design is built properly.</li>
</ul>

<h2>What a custom-built website is good at</h2>
<ul>
  <li><strong>Speed.</strong> Only the code your site needs, so pages load fast.</li>
  <li><strong>Unique design and interactions.</strong> The site can look and behave exactly as your brand needs.</li>
  <li><strong>Custom features.</strong> Booking flows, calculators, portals and integrations built around your process.</li>
  <li><strong>Security.</strong> A smaller attack surface than a site with many third-party plugins.</li>
</ul>

<h2>The trade-offs</h2>
<p>A custom site usually needs more design and development time up front, and changes to structure need a developer. A good custom build solves this with a simple admin panel or headless content system, so your team can still edit text, images and posts themselves.</p>

<h2>How to choose</h2>
<ol>
  <li>If your site is mainly pages and posts that change often, a well-built WordPress site can be a sensible choice.</li>
  <li>If speed, a distinctive design or custom features drive your business, custom is usually the better long-term investment.</li>
  <li>Either way, ask who will maintain it, how updates are handled, and who owns the code and hosting.</li>
</ol>

<blockquote>Not sure which fits? Tell us what your site needs to do on a free demo call and we will recommend the approach honestly, even if it is the simpler one.</blockquote>
""",
  },
  {
    "slug": "flutter-vs-react-native-vs-native",
    "seo_title": "Flutter vs React Native vs Native: Which to Choose?",
    "title": "Flutter, React Native or native: how should your app be built?",
    "description": "A plain-language comparison of Flutter, React Native and fully native iOS and Android apps, and how to choose for your business app.",
    "date": "2026-09-30",
    "cover": "c-apps",
    "tag": "Technology",
    "body": """
<p>When you plan a mobile app you will hear three options: Flutter, React Native, or fully native apps for iOS and Android. You do not need to become a developer to choose well. You need to know what each option means for cost, speed and the experience your customers get.</p>

<h2>Cross-platform: one codebase, two apps</h2>
<p><strong>Flutter</strong> (from Google) and <strong>React Native</strong> (from Meta) let one team write most of the app once and ship it to both iOS and Android. For the majority of business apps, such as ordering, booking, retail, loyalty and service apps, this is the efficient choice.</p>
<ul>
  <li>Usually faster to build and less costly than two separate native apps</li>
  <li>One codebase to maintain, so updates reach both platforms together</li>
  <li>Smooth, modern interfaces that feel at home on phones</li>
</ul>

<h3>Flutter or React Native?</h3>
<p>Both are mature and used for large production apps. Flutter draws its own interface, which keeps designs pixel-consistent across devices. React Native uses each platform's native components and fits well when a team also works in React on the web. The right pick often depends on the team building and maintaining it.</p>

<h2>Native: built separately for each platform</h2>
<p>Native apps are written in Swift for iOS and Kotlin for Android. They make sense when an app leans heavily on device features or needs the very last bit of performance.</p>
<ul>
  <li>Advanced camera, audio, Bluetooth or background processing</li>
  <li>Graphics-heavy or highly specialised apps</li>
  <li>Products where the newest platform features must be adopted on day one</li>
</ul>
<p>The trade-off is two codebases, which means more build time and ongoing work.</p>

<h2>Questions that decide it</h2>
<ol>
  <li>Does the app need unusual hardware or background features?</li>
  <li>Do you need iOS and Android at launch, or one first?</li>
  <li>Who will maintain it after launch?</li>
  <li>Does it share logic with a website or web app?</li>
</ol>

<blockquote>We build apps for iOS and Android, cross-platform or fully native, and will tell you which one your app actually needs. Book a free demo to talk it through.</blockquote>
""",
  },
  {
    "slug": "get-your-business-found-on-google",
    "seo_title": "How to Get Your Business Found on Google: SEO Basics",
    "title": "How to get your business found on Google: SEO basics for small businesses",
    "description": "The SEO basics that help small businesses appear on Google: Business Profile, local search, page speed, content and technical setup.",
    "date": "2026-09-27",
    "cover": "w-realestate",
    "tag": "SEO",
    "body": """
<p>A beautiful website only helps if people can find it. Search engine optimisation (SEO) sounds technical, but the basics that matter most for a small business are practical and within reach.</p>

<h2>1. Claim your Google Business Profile</h2>
<p>For local businesses this is often the single most important step. A complete, verified profile with the right category, hours, photos, phone number and website link helps you show up in Maps and local results. Ask happy customers to leave reviews and reply to them.</p>

<h2>2. Make every page about one clear topic</h2>
<p>Search engines match pages to what people type. Give each service its own page, with a clear heading and a title that uses the words customers actually search for, such as "website design in Indore" rather than a slogan.</p>

<h2>3. Write titles and descriptions for people</h2>
<p>The page title and meta description are what appear in search results. Keep the title short and specific and the description helpful. They are your advert in the results page.</p>

<h2>4. Be fast and mobile-friendly</h2>
<p>Most searches happen on phones. Pages that load quickly and work well on small screens give visitors a better experience, and search engines take page experience into account.</p>

<h2>5. Get the technical basics right</h2>
<ul>
  <li>A sitemap submitted in Google Search Console</li>
  <li>HTTPS on every page</li>
  <li>Clean, readable addresses for each page</li>
  <li>Structured data that describes your business, services and FAQs</li>
  <li>Descriptive alt text on images</li>
</ul>

<h2>6. Publish genuinely useful content</h2>
<p>Answer the questions your customers ask before they buy, in plain language. Helpful articles earn visits, links and trust over time.</p>

<h2>Be patient, and measure</h2>
<p>SEO builds over weeks and months, not days. Google Search Console shows which searches bring people to your site, so you can see what is working and improve the rest.</p>

<blockquote>Every website Kodevia builds ships with the technical SEO basics in place: titles, descriptions, sitemap, structured data and fast pages. Book a free demo to see how.</blockquote>
""",
  },
  {
    "slug": "shopify-vs-custom-ecommerce",
    "seo_title": "Shopify vs Custom E-commerce Website: Which to Choose",
    "title": "Shopify or a custom e-commerce website: which should you choose?",
    "description": "Comparing Shopify and a custom-built online store on cost, control, fees, design and growth, to help you choose the right e-commerce setup.",
    "date": "2026-09-20",
    "cover": "c-shop",
    "tag": "E-commerce",
    "body": """
<p>If you want to sell online, the first big decision is the platform. Hosted platforms like Shopify get you selling quickly. A custom-built store gives you full control. Here is how to weigh them.</p>

<h2>Why businesses choose Shopify</h2>
<ul>
  <li><strong>Speed to launch.</strong> Products, payments and checkout work out of the box.</li>
  <li><strong>Hosting and security handled.</strong> The platform looks after servers and core updates.</li>
  <li><strong>Apps.</strong> Reviews, shipping, discounts and marketing tools can be added.</li>
</ul>

<h2>The limits to know about</h2>
<ul>
  <li><strong>Ongoing costs.</strong> A monthly subscription, possible transaction fees and paid apps add up over time.</li>
  <li><strong>Checkout and data rules.</strong> Some parts of the experience can only be customised within the platform's limits.</li>
  <li><strong>Lookalike stores.</strong> Popular themes mean many shops share the same layout unless the design is customised.</li>
</ul>

<h2>Why businesses choose a custom store</h2>
<ul>
  <li><strong>A distinctive brand experience</strong> from home page to checkout.</li>
  <li><strong>Custom rules</strong> such as B2B pricing, made-to-order products, subscriptions or local delivery zones.</li>
  <li><strong>Direct integrations</strong> with your inventory, billing or delivery partners.</li>
  <li><strong>No platform fees</strong> on top of your payment gateway.</li>
</ul>
<p>The trade-off is a larger initial build and responsibility for hosting, security and maintenance, usually handled by your development partner.</p>

<h2>A simple way to decide</h2>
<ol>
  <li>Standard catalogue and standard checkout, and you want to start fast: a hosted platform is a sensible start.</li>
  <li>Unusual products, pricing or operations, or a brand that must stand out: custom is usually worth it.</li>
  <li>Planning a mobile app as well: a custom backend can serve the store and the app together.</li>
</ol>

<blockquote>Our e-commerce projects range from furniture and fashion stores to food ordering. Book a free demo and we will help you choose the right setup for your products.</blockquote>
""",
  },
  {
    "slug": "publish-app-on-play-store-and-app-store",
    "seo_title": "How to Publish an App on Google Play and the App Store",
    "title": "How to publish your app on Google Play and the App Store",
    "description": "A step-by-step overview of publishing a mobile app on Google Play and Apple's App Store: accounts, listings, reviews and common rejection reasons.",
    "date": "2026-09-13",
    "cover": "c-stores",
    "tag": "Apps",
    "body": """
<p>Building the app is only half the journey. To reach customers it has to pass review and be listed on Google Play and Apple's App Store. Here is what the process involves, so launch day has no surprises.</p>

<h2>1. Developer accounts in your name</h2>
<p>Each store requires a developer account: the Google Play Console and the Apple Developer Program. Apple charges a yearly fee and Google a one-time registration fee; check the current amounts on each site. Open the accounts in your company's name so you always own your app and its listing. Organisation accounts may need business verification, so start early.</p>

<h2>2. Prepare the store listing</h2>
<ul>
  <li>App name, short and full description</li>
  <li>Icon and screenshots for the required device sizes</li>
  <li>Category, contact email and support website</li>
  <li>A privacy policy page on your website</li>
  <li>Data safety and privacy answers describing what data the app collects</li>
</ul>

<h2>3. Test before you submit</h2>
<p>Use TestFlight on iOS and testing tracks on Google Play to share the app with real testers first. Depending on the type of account, Google may require a closed test with a minimum number of testers before you can publish to everyone.</p>

<h2>4. Submit for review</h2>
<p>Both stores review apps before they go live, and review times vary. Apple's review in particular checks the app against detailed guidelines.</p>

<h2>Common reasons apps are rejected</h2>
<ul>
  <li>Crashes or broken features during review</li>
  <li>Missing or vague privacy information</li>
  <li>A login with no test account provided for the reviewer</li>
  <li>Screenshots that do not match the app</li>
  <li>An app that is only a website in a wrapper with no app-like value</li>
</ul>

<h2>5. After launch</h2>
<p>Each year brings new iOS and Android versions and updated store policies. Apps need regular testing and updates to keep working and stay listed.</p>

<blockquote>Kodevia handles store submission as part of every app launch, with accounts set up in your name. Book a free demo to plan your app's release.</blockquote>
""",
  },
  {
    "slug": "why-is-my-website-slow",
    "seo_title": "Why Is My Website Slow? Causes and Fixes That Work",
    "title": "Why is my website slow? The causes and the fixes that matter",
    "description": "The most common reasons a website loads slowly, how to check your speed, and the practical fixes that make pages fast on mobile.",
    "date": "2026-09-06",
    "cover": "w-food-dark",
    "tag": "Performance",
    "body": """
<p>Visitors leave slow websites, especially on mobile data. The good news is that most slow sites suffer from the same handful of problems, and most of them can be fixed.</p>

<h2>How to check your speed</h2>
<p>Run your pages through Google's PageSpeed Insights. It reports Core Web Vitals, the measures Google uses for page experience: how quickly the main content appears, how fast the page responds to a tap, and how much the layout jumps around while loading. Test on mobile, where most visitors are.</p>

<h2>The usual causes</h2>
<h3>Oversized images</h3>
<p>Photos uploaded straight from a camera or phone can be many times larger than they need to be. This is the most common cause of slow pages.</p>
<h3>Too many scripts and plugins</h3>
<p>Every chat widget, tracker, slider and plugin adds code that the browser must download and run before the page settles.</p>
<h3>Slow hosting</h3>
<p>Cheap shared hosting can respond slowly, especially when traffic picks up.</p>
<h3>Fonts and layout shifts</h3>
<p>Heavy font files and images without set dimensions make text appear late and pages jump while loading.</p>

<h2>The fixes that matter</h2>
<ul>
  <li><strong>Compress and resize images</strong> and use modern formats such as WebP.</li>
  <li><strong>Lazy-load</strong> images further down the page.</li>
  <li><strong>Remove what you do not use:</strong> old plugins, duplicate trackers, unused scripts.</li>
  <li><strong>Use a CDN</strong> so files are served from near your visitors.</li>
  <li><strong>Set image sizes</strong> so the layout does not jump.</li>
  <li><strong>Choose hosting</strong> that matches your traffic.</li>
</ul>

<h2>Keep it fast</h2>
<p>Speed is not a one-time job. New content and features slowly add weight. A quick speed check after each change, or as part of regular maintenance, keeps a fast site fast.</p>

<blockquote>Performance is checked before every Kodevia release, not after launch. Book a free demo and we will look at your current site's speed with you.</blockquote>
""",
  },
  {
    "slug": "what-is-ui-ux-design",
    "seo_title": "What Is UI/UX Design and Why It Matters for Sales",
    "title": "What is UI/UX design, and why does it matter for your sales?",
    "description": "UI and UX design explained in plain language: what each one means, what the design process involves, and how good design turns visitors into customers.",
    "date": "2026-08-30",
    "cover": "c-design",
    "tag": "Design",
    "body": """
<p>You will hear "UI" and "UX" in almost every website or app conversation. They are related but different, and together they decide whether visitors understand your product and act, or leave.</p>

<h2>UX: how it works</h2>
<p>User experience (UX) design is about the journey: can people find what they need, understand it and complete a task without confusion? It covers the structure of pages, the steps in a checkout or booking, the wording of buttons and what happens when something goes wrong.</p>

<h2>UI: how it looks and feels</h2>
<p>User interface (UI) design is the visual layer: layout, typography, colour, icons, spacing and motion. Good UI makes the important thing obvious, keeps the brand consistent and makes a product feel trustworthy.</p>

<h2>Why it affects sales</h2>
<ul>
  <li><strong>Clarity converts.</strong> When the next step is obvious, more visitors take it.</li>
  <li><strong>Trust.</strong> A polished, consistent interface signals a business that takes care.</li>
  <li><strong>Fewer drop-offs.</strong> Shorter forms and clearer checkouts mean fewer abandoned orders.</li>
  <li><strong>Fewer support calls.</strong> When people can help themselves, your team spends less time explaining.</li>
</ul>

<h2>What the design process looks like</h2>
<ol>
  <li><strong>Research.</strong> Who the users are and what they are trying to do.</li>
  <li><strong>Flows and wireframes.</strong> The structure and steps, before any colour.</li>
  <li><strong>Prototype and test.</strong> A clickable version real people can try.</li>
  <li><strong>Visual design.</strong> The final look, built on your brand.</li>
  <li><strong>Design system.</strong> Reusable components so every new screen stays consistent and developers can build faster.</li>
</ol>

<h2>Signs your design needs work</h2>
<ul>
  <li>Customers call to ask things the website should answer</li>
  <li>People add to cart but do not finish checkout</li>
  <li>The site looks different from page to page</li>
  <li>It is hard to use on a phone</li>
</ul>

<blockquote>See design details from our real projects on our <a href="../work/design.html">product design page</a>, or book a free demo to talk about yours.</blockquote>
""",
  },
  {
    "slug": "website-or-mobile-app-first",
    "seo_title": "Website or Mobile App First? How to Decide",
    "title": "Website or mobile app: which does your business need first?",
    "description": "A plain guide to choosing between a website and a mobile app as your first digital product, with the questions that decide it.",
    "date": "2026-10-01",
    "cover": "w-furniture",
    "tag": "Strategy",
    "body": """
<p>It is one of the first questions we hear: should we build a website or an app? The honest answer is that most businesses need a website first, and some businesses need an app as well. Here is how to tell which group you are in.</p>

<h2>Start with how people find you</h2>
<p>People discover businesses through search, links and recommendations. All of those lead to a web page, not an app store. A website is the front door that search engines can read, that you can share in a message, and that opens instantly on any phone or laptop without an install.</p>
<p>An app, by contrast, has to be found in an app store, downloaded and opened. That is a big ask for someone who has never heard of you. Apps are rarely how a customer meets a business for the first time.</p>

<h2>When a website is enough</h2>
<ul>
  <li>Your customers visit occasionally: to learn about you, compare options or make an enquiry.</li>
  <li>You sell products online and want the checkout to work for everyone, including first-time visitors.</li>
  <li>You need to rank in search results for what you offer.</li>
  <li>You want to change content often without waiting for app store reviews.</li>
</ul>
<p>A well-built website can also feel very close to an app on a phone: fast, smooth and usable with one thumb.</p>

<h2>When an app earns its place</h2>
<ul>
  <li>Customers use your service often, such as ordering, booking or tracking every week.</li>
  <li>You need features a browser handles poorly, such as reliable notifications, offline use, the camera or location in the background.</li>
  <li>Your customers are already loyal and would benefit from a faster, saved, signed-in experience.</li>
</ul>
<p>Food ordering, pet care, retail loyalty and booking services are common examples. In our own work the apps we build usually sit next to a website, not instead of one.</p>

<h2>Questions that decide it</h2>
<ol>
  <li><strong>How often will one person use it?</strong> Rarely points to a website. Weekly or daily can justify an app.</li>
  <li><strong>How will new customers find you?</strong> If the answer is search or social media, you need a website either way.</li>
  <li><strong>Does it need anything only an app can do?</strong> If not, start on the web.</li>
  <li><strong>Who will keep it running?</strong> An app means two store listings and regular updates for new phone versions.</li>
</ol>

<h2>A sensible order</h2>
<p>For most businesses the path is: launch a fast, clear website; learn what customers actually do on it; then build an app for the repeat customers once you know which features they would open every day. Designing both from one plan, with one team, keeps the brand and the experience consistent across the two.</p>

<blockquote>Not sure which one fits your business? That is exactly what our free demo call is for. We will look at how your customers find you and tell you honestly what to build first.</blockquote>
""",
  },
  {
    "slug": "what-decides-website-app-cost",
    "title": "What decides the cost of a website or app",
    "description": "The factors that actually move the price of a website or mobile app project, so you can plan a budget and compare quotes fairly.",
    "date": "2026-09-24",
    "cover": "w-realestate",
    "tag": "Planning",
    "body": """
<p>Two quotes for "a website" can be very different, and both can be fair. The difference is almost always in scope. Knowing what drives the cost helps you plan a budget and compare quotes on equal terms.</p>

<h2>1. The number of unique screens</h2>
<p>A page that repeats a layout, such as a list of blog posts, costs far less than a screen that needs its own design and logic. Count the distinct screens, not the total pages: a home page, a product page, a checkout and an account area are four very different pieces of work.</p>

<h2>2. Custom design or a starting template</h2>
<p>A custom design is built around your brand and your customers. A template is faster to start but harder to make your own. Many good projects sit in between: a custom design system applied consistently across the product.</p>

<h2>3. What the product has to do</h2>
<ul>
  <li>Accounts and sign-in</li>
  <li>Payments and orders</li>
  <li>Search and filters</li>
  <li>Booking and calendars</li>
  <li>An admin panel so your team can manage content</li>
  <li>Connections to other tools, such as payment gateways, maps, CRMs or delivery partners</li>
</ul>
<p>Each feature has design, development and testing time behind it. Integrations with outside services often take longer than they look, because you depend on how those services work.</p>

<h2>4. Platforms</h2>
<p>A website runs everywhere. A mobile app may need to work on both iOS and Android, either from one shared codebase or built natively for each. Supporting more devices, screen sizes and older phones adds testing time.</p>

<h2>5. Content</h2>
<p>Who writes the words and supplies the photos? Content that is ready on day one keeps a project moving. Content that has to be created, translated or photographed is real work and should be in the plan.</p>

<h2>6. What happens after launch</h2>
<p>Hosting, security updates, store submissions and ongoing improvements are part of owning a website or app. A good quote is clear about what is included at launch and what care looks like afterwards.</p>

<h2>How to compare quotes fairly</h2>
<ol>
  <li>Ask each studio to list the screens and features they have priced.</li>
  <li>Check who owns the code, the designs and the accounts at the end.</li>
  <li>Ask what is included after launch.</li>
  <li>Look at real work they have shipped, not only mockups.</li>
</ol>

<blockquote>Every Kodevia project is quoted after a short discovery conversation, based on what you actually need. Book a free demo and we will walk you through it.</blockquote>
""",
  },
  {
    "slug": "before-you-hire-a-web-development-company",
    "seo_title": "What to Prepare Before Hiring a Web Developer",
    "title": "What to prepare before you hire a web development company",
    "description": "A practical checklist of what to have ready before you contact a web or app development company, so the project starts fast and stays on track.",
    "date": "2026-09-17",
    "cover": "w-fashion",
    "tag": "Checklist",
    "body": """
<p>The best projects start with a little preparation. You do not need a technical document. You need clear answers to a few simple questions, and a handful of materials gathered in one place.</p>

<h2>1. Your goal, in one sentence</h2>
<p>What should the website or app achieve? More enquiries, online sales, bookings, fewer phone calls, a better experience for existing customers? One clear goal helps every design decision later.</p>

<h2>2. Who it is for</h2>
<p>Describe your customers in plain words: who they are, what device they use, and what they are trying to get done when they arrive. If you have more than one type of customer, list them and say which matters most.</p>

<h2>3. The must-haves and the nice-to-haves</h2>
<p>Make two lists. Must-haves are the features without which the product fails its goal. Nice-to-haves can wait for a later phase. This is the single most useful thing you can bring, because it keeps the first version focused.</p>

<h2>4. Examples you like, and why</h2>
<p>Collect a few websites or apps you like, from any industry. For each one, write one line about what you like: the layout, the checkout, the photography, the tone. The reason matters more than the link.</p>

<h2>5. Your brand materials</h2>
<ul>
  <li>Logo files, ideally in vector format</li>
  <li>Brand colours and fonts, if you have a guide</li>
  <li>Photos of your products, team or space</li>
  <li>Any existing copy you want to keep</li>
</ul>

<h2>6. Access and accounts</h2>
<p>If you already have a domain, hosting, a current website, social profiles or app store accounts, note who controls them. Sorting out access early saves days at launch.</p>

<h2>7. A decision maker and a rough timeline</h2>
<p>Decide who will give feedback and sign off. Projects slow down most when feedback comes from many people at different times. Share any fixed dates, such as a product launch or an event, at the start.</p>

<h2>Questions to ask the company</h2>
<ul>
  <li>Can I see real projects you have shipped?</li>
  <li>Who will I talk to during the project?</li>
  <li>How will I see progress before launch?</li>
  <li>Who owns the code and designs at the end?</li>
  <li>What does support look like after launch?</li>
</ul>

<blockquote>Have most of this ready? Book a free demo with Kodevia. Don't have it ready? Book anyway; we can work through it together on the call.</blockquote>
""",
  },
  {
    "slug": "website-maintenance-explained",
    "title": "Website maintenance after launch, explained",
    "description": "What website and app maintenance actually involves after launch: security, updates, performance, backups and improvements, and why each matters.",
    "date": "2026-09-10",
    "cover": "w-travel",
    "tag": "Care",
    "body": """
<p>Launch day is the start of a website's life, not the end of the project. Like any tool your business depends on, a website or app needs regular care to stay secure, fast and useful. Here is what that care actually involves.</p>

<h2>Security updates</h2>
<p>Every website is built on software: frameworks, libraries, plugins and the server underneath. Those pieces receive security fixes regularly. Applying them promptly is the single most important part of maintenance, because outdated software is the most common way sites get compromised.</p>

<h2>Backups you can actually restore</h2>
<p>Backups only matter if they work. Good maintenance means automatic backups of the code, the content and the database, stored somewhere separate, and occasionally tested by restoring them.</p>

<h2>Speed and performance</h2>
<p>Sites tend to slow down over time as images, scripts and features are added. Regular checks catch problems early: oversized images, slow pages, third-party scripts that block loading. Speed affects both how customers feel and how search engines rank you.</p>

<h2>Monitoring</h2>
<p>Someone should know quickly if the site goes down, a form stops sending, or a payment step fails. Monitoring turns a silent problem into a fixed one.</p>

<h2>App store updates</h2>
<p>Mobile apps have an extra job. New iOS and Android versions arrive every year, and the stores update their rules. Apps need to be tested and updated to keep working and to stay listed.</p>

<h2>Content and small changes</h2>
<p>New products, updated prices, a new team member, a seasonal banner. Maintenance should make these quick, either through an admin panel your team can use or a simple request to your development team.</p>

<h2>Improvements</h2>
<p>The most valuable part of maintenance is improvement. Once a site is live you have real data on what visitors do. Small, regular changes based on that data, such as a clearer button, a shorter form, a faster page, add up over time.</p>

<h2>A simple maintenance checklist</h2>
<ul>
  <li>Software and security updates applied</li>
  <li>Backups running and tested</li>
  <li>Uptime and key forms monitored</li>
  <li>Page speed checked</li>
  <li>Broken links and errors fixed</li>
  <li>App versions tested on new phones and OS releases</li>
  <li>A short list of improvements for the next round</li>
</ul>

<blockquote>Kodevia looks after the websites and apps we build once they are live: security updates, fixes, speed checks and new features as your business grows. Book a free demo to talk about care for your product.</blockquote>
""",
  },
]
