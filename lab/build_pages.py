"""Build the blog and apply SEO to every page.

Run from the site root:  python3 lab/build_pages.py

- Generates blog/index.html and blog/<slug>.html from lab/blog_content.py,
  using the header and footer of work/websites.html so every page matches.
- Adds Blog to every header and a Resources column to every footer.
- Rewrites the SEO block in every page's <head>: title, description,
  canonical, robots, Open Graph, Twitter, JSON-LD.
- Writes sitemap.xml, robots.txt, site.webmanifest and 404.html.

SITE is the public address. Change it once if the site moves to its own
domain, run this again, and every canonical, sitemap and social tag follows.
"""
import html, json, re, sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "lab"))
from blog_content import ARTICLES  # noqa: E402
from services_content import SERVICES, STEPS, CITY, REGION  # noqa: E402
ARTICLES = sorted(ARTICLES, key=lambda a: a['date'], reverse=True)  # newest first

SITE = "https://kodevia.in"
V = "12"
TODAY = date.today().isoformat()
ARROW = '<svg class="btn__icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'

ORG = {
    "@type": "Organization", "@id": f"{SITE}/#org", "name": "Kodevia",
    "url": f"{SITE}/", "logo": f"{SITE}/assets/apple-touch-icon.png",
    "description": "Kodevia designs and builds websites, web apps and mobile apps that people love to use.",
    "email": "hello@kodevia.com", "telephone": "+91-92447-74704",
    "address": {"@type": "PostalAddress", "addressLocality": CITY, "addressRegion": REGION, "addressCountry": "IN"},
}
AREA = [{"@type": "City", "name": CITY}, {"@type": "State", "name": REGION}, {"@type": "Country", "name": "India"}]
# Which service page each article points readers to.
SERVICE_FOR = {"flutter-vs-react-native-vs-native": "mobile-app-development", "website-or-mobile-app-first": "mobile-app-development",
               "publish-app-on-play-store-and-app-store": "mobile-app-development", "what-is-ui-ux-design": "ui-ux-design",
               "shopify-vs-custom-ecommerce": "ecommerce-development"}
SVC = {x["slug"]: x for x in SERVICES}

# ---------------------------------------------------------------- helpers --
def esc(s): return html.escape(s, quote=True)

def words(body): return len(re.sub(r"<[^>]+>", " ", body).split())

def crumbs(items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": f"{SITE}/{u}"} for i, (n, u) in enumerate(items)]}

def seo_block(path, title, desc, image, kind="website", graph=None, robots="index, follow"):
    url = f"{SITE}/{path}" if path else f"{SITE}/"
    img = f"{SITE}/{image}"
    ld = {"@context": "https://schema.org", "@graph": graph or []}
    return f"""<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{url}">
<meta property="og:site_name" content="Kodevia">
<meta property="og:type" content="{kind}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{img}">
<meta property="og:image:alt" content="{esc(title)}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="{img}">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>"""

SEO_RE = re.compile(
    r'(<title>.*?</title>\s*|<meta name="(description|robots|twitter:[a-z:]+)"[^>]*>\s*|<link rel="canonical"[^>]*>\s*'
    r'|<meta property="og:[a-z:_]+"[^>]*>\s*|<script type="application/ld\+json">.*?</script>\s*'
    r'|<link rel="manifest"[^>]*>\s*)', re.S)

def apply_seo(text, block, pre):
    text = SEO_RE.sub("", text)
    extra = f'\n<link rel="manifest" href="{pre}site.webmanifest">'
    return text.replace('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
                        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + block + extra, 1)

def bump(text): return re.sub(r"\?v=\d+", f"?v={V}", text).replace("?v=186", "?v=186")

# ------------------------------------------------- header and footer edits --
def add_blog_nav(text, href):
    if 'data-nav="blog"' in text: return text
    return text.replace("  </nav>\n", f'    <a href="{href}" data-nav="blog">Blog</a>\n  </nav>\n', 1)

def footer_resources(text, pre):
    if "site-foot__col--res" in text: return text
    links = "\n".join(f'      <a href="{pre}blog/{a["slug"]}.html">{esc(a["title"].split(":")[0])}</a>' for a in ARTICLES[:3])
    col = f"""    <nav class="site-foot__col site-foot__col--res" aria-label="Resources">
      <h3>Resources</h3>
      <a href="{pre}blog/">Blog</a>
{links}
    </nav>
    <div class="site-foot__col">
      <h3>Contact</h3>"""
    return text.replace("""    <div class="site-foot__col">
      <h3>Contact</h3>""", col, 1)

def footer_services(text, pre):
    if "site-foot__col--svc" in text: return text
    links = "\n".join(f'      <a href="{pre}services/{x["slug"]}.html">{esc(x["name"])}</a>' for x in SERVICES)
    col = f"""    <nav class="site-foot__col site-foot__col--svc" aria-label="Services">
      <h3>Services</h3>
{links}
    </nav>
    <nav class="site-foot__col" aria-label="Our work">"""
    text = text.replace('    <nav class="site-foot__col" aria-label="Our work">', col, 1)
    return text.replace("<p>We design and build websites and apps that people love to use.</p>",
                        f"<p>We design and build websites and apps that people love to use.</p>\n      <p class=\"site-foot__loc\">Website and app development in {CITY}, {REGION}, India.</p>", 1)

# --------------------------------------------------------------- templates --
TPL = (ROOT / "work/websites.html").read_text()
HEAD_TOP = TPL[:TPL.index("</head>")]
HEADER = TPL[TPL.index("<body"):TPL.index('<main id="main"')]
FOOT = TPL[TPL.index('<footer class="site-foot"'):TPL.index("</footer>") + 9]
TAIL = TPL[TPL.index("</footer>") + 9:]

def page(head_extra_css, main_html, blog_current=True):
    head = HEAD_TOP.replace('<link rel="stylesheet" href="work.css', '<link rel="stylesheet" href="../work/work.css')
    head = head.replace('</style>', '</style>')
    head += f'<link rel="stylesheet" href="../blog/blog.css?v={V}">\n'
    header = HEADER
    # nav on blog pages: Home, the three work pages, Blog (current)
    header = header.replace('href="websites.html"', 'href="../work/websites.html"').replace('href="apps.html"', 'href="../work/apps.html"').replace('href="design.html"', 'href="../work/design.html"')
    header = re.sub(r' aria-current="page"(?=>Websites)', '', header)
    header = add_blog_nav(header, "./")
    header = header.replace('<a href="./" data-nav="blog">', '<a href="./" data-nav="blog" aria-current="page">' if blog_current else '<a href="./" data-nav="blog">')
    foot = FOOT.replace('href="../work/', 'href="../work/')
    tail = TAIL.replace('src="work.js', 'src="../work/work.js')
    head = head.replace('data-default-theme="dark"', 'data-default-theme="light"')
    header = header.replace('<body ', '<body class="is-blog" ', 1) if 'is-blog' not in header else header
    return head + "</head>\n" + header + '<main id="main" class="wk">\n  <span id="top"></span>\n' + main_html + "\n</main>\n\n" + foot + tail

def cover_path(a, size=""):
    folder = "blog" if a["cover"].startswith("c-") else "work"
    return f"assets/{folder}/{a['cover']}{size}.webp"

def cover(a, size=""):
    return "../" + cover_path(a, size)

def nice_date(d): return date.fromisoformat(d).strftime("%-d %B %Y")

def article_html(a, others):
    svc = SVC[SERVICE_FOR.get(a["slug"], "ecommerce-development" if a["tag"] == "E-commerce" else "mobile-app-development" if a["tag"] == "Apps" else "ui-ux-design" if a["tag"] == "Design" else "website-development")]
    mins = max(2, round(words(a["body"]) / 220))
    rel = "".join(f"""
        <a class="post-row" href="{o['slug']}.html">
          <span class="post-row__img"><img src="{cover(o, '-sm')}" width="820" height="461" alt="" loading="lazy"></span>
          <span class="post-row__text"><span class="post-tag">{o['tag']}</span><strong>{esc(o['title'])}</strong></span>
        </a>""" for o in others)
    return f"""  <article class="post" itemscope itemtype="https://schema.org/BlogPosting">
    <header class="post__head">
      <p class="wk-crumb rv"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="./">Blog</a><span aria-hidden="true">/</span><span>{esc(a['tag'])}</span></p>
      <p class="post-meta rv"><span class="post-tag">{a['tag']}</span><time datetime="{a['date']}">{nice_date(a['date'])}</time><span>{mins} min read</span></p>
      <h1 class="rv" style="--d:60ms" itemprop="headline">{esc(a['title'])}</h1>
      <p class="post__lede rv" style="--d:120ms" itemprop="description">{esc(a['description'])}</p>
    </header>
    <figure class="post__cover rv" style="--d:180ms">
      <img src="{cover(a)}" width="1600" height="900" alt="Screens from Kodevia projects" itemprop="image">
    </figure>
    <div class="post__body" itemprop="articleBody">{a['body']}
      <p class="post__svc">Related service: <a href="../services/{svc['slug']}.html">{esc(svc['name'])} in {CITY}</a></p>
      <div class="post__cta">
        <p>Want to talk it through for your business?</p>
        <a class="btn btn--primary" href="../index.html#start">Book a free demo{ARROW}</a>
      </div>
    </div>
  </article>
  <section class="post-more" aria-labelledby="more-h">
    <h2 id="more-h">Keep reading</h2>
    <div class="post-list">{rel}
    </div>
  </section>"""

def service_html(x):
    by = {a["slug"]: a for a in ARTICLES}
    rel = "".join(f"""
        <a class="post-row" href="../blog/{o['slug']}.html">
          <span class="post-row__img"><img src="{cover(o, '-sm')}" width="820" height="461" alt="" loading="lazy"></span>
          <span class="post-row__text"><span class="post-tag">{o['tag']}</span><strong>{esc(o['title'])}</strong></span>
        </a>""" for o in (by[s] for s in x["related"] if s in by))
    faq = "".join(f"""
      <details>
        <summary>{esc(q)}<span class="faq__plus" aria-hidden="true"></span></summary>
        <div class="faq__a"><p>{esc(a_)}</p></div>
      </details>""" for q, a_ in x["faq"])
    others = " · ".join(f'<a href="{o["slug"]}.html">{esc(o["name"])}</a>' for o in SERVICES if o is not x)
    href, label = x["work"]
    return f"""  <article class="post svc-page">
    <header class="post__head">
      <p class="wk-crumb rv"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#services">Services</a><span aria-hidden="true">/</span><span>{esc(x['name'])}</span></p>
      <h1 class="rv" style="--d:60ms">{esc(x['h1'])}</h1>
      <p class="post__lede rv" style="--d:120ms">{esc(x['lede'])}</p>
      <div class="svc-cta rv" style="--d:160ms"><a class="btn btn--primary" href="../index.html#start">Book a free demo{ARROW}</a><a class="btn btn--ghost" href="../{href}">{esc(label)}</a></div>
    </header>
    <figure class="post__cover rv" style="--d:180ms">
      <img src="{cover(x)}" width="1600" height="900" alt="{esc(x['name'])} work by Kodevia">
    </figure>
    <div class="post__body">
      <div class="svc-price"><span class="svc-price__label">Pricing</span><strong>{esc(x['price'])}</strong><span>{esc(x['price_note'])} <a href="../blog/what-decides-website-app-cost.html">What decides the cost?</a></span></div>{x['body']}{STEPS}
      <h2>Questions</h2>
      <div class="faq__list svc-faq">{faq}
      </div>
      <p class="post__svc">Also from Kodevia: {others}</p>
      <div class="post__cta">
        <p>Tell us what you want to build.</p>
        <a class="btn btn--primary" href="../index.html#start">Book a free demo{ARROW}</a>
      </div>
    </div>
  </article>
  <section class="post-more" aria-labelledby="more-h">
    <h2 id="more-h">Guides on {esc(x['name'].lower())}</h2>
    <div class="post-list">{rel}
    </div>
  </section>"""

def index_html():
    f, rest = ARTICLES[0], ARTICLES[1:]
    tags = sorted({a['tag'] for a in ARTICLES})
    topics = "\n".join(f'      <button type="button" class="blog-filter__btn" aria-pressed="false" data-filter="{t}">{t}</button>' for t in tags)
    rows = "".join(f"""
      <a class="post-row rv" href="{a['slug']}.html" data-tag="{a['tag']}" style="--d:{min(i, 6) * 60}ms">
        <span class="post-row__img"><img src="{cover(a, '-sm')}" width="820" height="461" alt="" loading="lazy"></span>
        <span class="post-row__text">
          <span class="post-meta"><span class="post-tag">{a['tag']}</span><time datetime="{a['date']}">{nice_date(a['date'])}</time></span>
          <strong>{esc(a['title'])}</strong>
          <span class="post-row__desc">{esc(a['description'])}</span>
        </span>
        <span class="post-row__go" aria-hidden="true">{ARROW}</span>
      </a>""" for i, a in enumerate(rest))
    return f"""  <section class="wk-hero blog-hero">
    <div>
      <p class="wk-crumb rv"><a href="../index.html">Home</a><span aria-hidden="true">/</span><span>Blog</span></p>
      <h1 class="rv" style="--d:60ms">Notes on building <em>better</em> websites and apps.</h1>
      <p class="rv" style="--d:120ms">Plain-language guides for business owners: what to build first, what drives cost, how to prepare, and how to look after it once it is live.</p>
    </div>
    <img class="wk-hero__mark" src="../assets/k-poster.webp?v={V}" width="900" height="900" alt="">
  </section>
  <section class="blog-list" aria-label="Articles">
    <div class="blog-filter rv" role="group" aria-label="Filter articles by topic">
      <button type="button" class="blog-filter__btn" aria-pressed="true" data-filter="all">All topics</button>
{topics}
    </div>
    <a class="post-feature rv" href="{f['slug']}.html" data-tag="{f['tag']}">
      <span class="post-feature__img"><img src="{cover(f)}" width="1600" height="900" alt=""></span>
      <span class="post-feature__text">
        <span class="post-meta"><span class="post-tag">{f['tag']}</span><time datetime="{f['date']}">{nice_date(f['date'])}</time></span>
        <strong>{esc(f['title'])}</strong>
        <span class="post-row__desc">{esc(f['description'])}</span>
        <span class="post-feature__go">Read the article{ARROW}</span>
      </span>
    </a>
    <div class="post-list">{rows}
    </div>
  </section>"""

# ------------------------------------------------------------------- build --
def build():
    out = ROOT / "blog"; out.mkdir(exist_ok=True)
    # blog index
    txt = page("", index_html())
    graph = [ORG, {"@type": "Blog", "@id": f"{SITE}/blog/#blog", "name": "Kodevia Blog", "url": f"{SITE}/blog/", "publisher": {"@id": f"{SITE}/#org"},
                   "blogPost": [{"@type": "BlogPosting", "headline": a["title"], "url": f"{SITE}/blog/{a['slug']}.html", "datePublished": a["date"]} for a in ARTICLES]},
             crumbs([("Home", ""), ("Blog", "blog/")])]
    txt = apply_seo(txt, seo_block("blog/", "Blog · Website and App Development Guides | Kodevia",
                                   "Plain-language guides on websites and mobile apps for business owners: what to build first, what drives cost, how to prepare and how to maintain it.",
                                   "assets/og.png", graph=graph), "../")
    (out / "index.html").write_text(bump(txt))
    # articles
    for a in ARTICLES:
        same = [o for o in ARTICLES if o is not a and o['tag'] == a['tag']]
        others = (same + [o for o in ARTICLES if o is not a and o not in same])[:3]
        txt = page("", article_html(a, others))
        graph = [ORG, {"@type": "BlogPosting", "headline": a["title"], "description": a["description"],
                       "datePublished": a["date"], "dateModified": a["date"], "image": f"{SITE}/{cover_path(a)}",
                       "author": {"@id": f"{SITE}/#org"}, "publisher": {"@id": f"{SITE}/#org"},
                       "mainEntityOfPage": f"{SITE}/blog/{a['slug']}.html", "wordCount": words(a["body"]), "articleSection": a["tag"]},
                 crumbs([("Home", ""), ("Blog", "blog/"), (a["title"], f"blog/{a['slug']}.html")])]
        t = a.get("seo_title", a["title"])
        txt = apply_seo(txt, seo_block(f"blog/{a['slug']}.html", f"{t} | Kodevia", a["description"], cover_path(a), "article", graph), "../")
        txt = txt.replace('<meta property="og:locale" content="en_IN">', f'<meta property="og:locale" content="en_IN">\n<meta property="article:published_time" content="{a["date"]}">')
        (out / f"{a['slug']}.html").write_text(bump(txt))

    # ---- service pages ----
    sv = ROOT / "services"; sv.mkdir(exist_ok=True)
    for x in SERVICES:
        txt = page("", service_html(x), blog_current=False)
        txt = txt.replace('<a href="./" data-nav="blog">', '<a href="../blog/" data-nav="blog">')
        url = f"{SITE}/services/{x['slug']}.html"
        graph = [ORG, {"@type": "Service", "name": x["name"], "serviceType": x["name"], "description": x["description"], "url": url,
                       "provider": {"@id": f"{SITE}/#org"}, "areaServed": AREA},
                 {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a_}} for q, a_ in x["faq"]]},
                 crumbs([("Home", ""), ("Services", "#services"), (x["name"], f"services/{x['slug']}.html")])]
        txt = apply_seo(txt, seo_block(f"services/{x['slug']}.html", f"{x['seo_title']} | Kodevia", x["description"], cover_path(x), graph=graph), "../")
        (sv / f"{x['slug']}.html").write_text(bump(footer_services(txt, "../")))

    # ---- home: nav, footer, SEO (with FAQ structured data from the page) --
    p = ROOT / "index.html"; txt = p.read_text()
    txt = add_blog_nav(txt, "blog/")
    txt = footer_resources(txt, "")
    txt = footer_services(txt, "")
    faq = re.findall(r"<summary>(.*?)<span.*?</summary>\s*<div class=\"faq__a\"><p>(.*?)</p>", txt, re.S)
    graph = [ORG, {"@type": "WebSite", "@id": f"{SITE}/#site", "url": f"{SITE}/", "name": "Kodevia", "publisher": {"@id": f"{SITE}/#org"}, "inLanguage": "en"},
             {"@type": "ProfessionalService", "name": "Kodevia", "url": f"{SITE}/", "image": f"{SITE}/assets/og.png",
              "description": ORG["description"], "telephone": ORG["telephone"], "email": ORG["email"], "address": ORG["address"], "areaServed": AREA, "priceRange": "₹₹",
              "makesOffer": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": x["name"], "url": f"{SITE}/services/{x['slug']}.html"}} for x in SERVICES]},
             {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": re.sub(r"<[^>]+>", "", q).strip(), "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", a_).strip()}} for q, a_ in faq]}]
    txt = apply_seo(txt, seo_block("", f"Website & App Development Company in {CITY} | Kodevia",
                                   f"Kodevia is a website and mobile app development company in {CITY}. We design and build fast websites, online stores and iOS and Android apps for growing businesses across India.",
                                   "assets/og.png", graph=graph), "")
    p.write_text(bump(txt))

    # ---- work pages ----
    WORK = {
        "websites": ("Website Design and Development Projects | Kodevia", "Website projects by Kodevia: e-commerce stores, a property portal, travel booking and food ordering sites, designed and built to convert.", "assets/work/w-furniture.webp", "Websites"),
        "apps": ("Mobile App Design and Development Projects | Kodevia", "Mobile app projects by Kodevia for iOS and Android: food delivery, retail, pet care, coffee ordering and interiors apps.", "assets/work/a-pet.webp", "Mobile apps"),
        "design": ("UI and UX Product Design Details | Kodevia", "Typography, components and colour palettes from Kodevia's website and app projects, up close.", "assets/work/d-type.webp", "Product design"),
    }
    for slug, (title, desc, img, name) in WORK.items():
        p = ROOT / f"work/{slug}.html"; txt = p.read_text()
        txt = add_blog_nav(txt, "../blog/")
        txt = footer_resources(txt, "../")
        txt = footer_services(txt, "../")
        graph = [ORG, {"@type": "CollectionPage", "name": title, "description": desc, "url": f"{SITE}/work/{slug}.html", "isPartOf": {"@id": f"{SITE}/#site"}},
                 crumbs([("Home", ""), ("Our work", "#work"), (name, f"work/{slug}.html")])]
        txt = apply_seo(txt, seo_block(f"work/{slug}.html", title, desc, img, graph=graph), "../")
        p.write_text(bump(txt))

    # ---- refresh blog pages' footer (they were built from the old footer) --
    for f in (ROOT / "blog").glob("*.html"):
        t = footer_services(footer_resources(f.read_text(), "../"), "../")
        t = t.replace('href="../blog/"', 'href="./"').replace('href="../blog/', 'href="')
        f.write_text(t)

    # ---- 404, sitemap, robots, manifest ----
    nf = page("", f"""  <section class="wk-hero nf">
    <div>
      <h1 class="rv">This page <em>wandered off.</em></h1>
      <p class="rv" style="--d:80ms">The link may be old or mistyped. Everything else is right where you left it.</p>
      <div class="wk-meta rv" style="--d:140ms"><a class="btn btn--primary" href="{SITE}/">Back to home{ARROW}</a><a class="btn btn--ghost" href="{SITE}/blog/">Read the blog</a></div>
    </div>
    <img class="wk-hero__mark" src="{SITE}/assets/k-poster.webp" width="900" height="900" alt="">
  </section>""", blog_current=False)
    nf = footer_services(nf, "../")
    # 404 can be served from any path, so its assets use absolute URLs
    nf = nf.replace('href="../', f'href="{SITE}/').replace('src="../', f'src="{SITE}/').replace('href="./"', f'href="{SITE}/blog/"')
    nf = apply_seo(nf, seo_block("404.html", "Page not found | Kodevia", "This page could not be found.", "assets/og.png", robots="noindex, follow"), f"{SITE}/")
    (ROOT / "404.html").write_text(bump(nf))

    urls = [("", "1.0", "weekly"), ("work/websites.html", "0.8", "monthly"), ("work/apps.html", "0.8", "monthly"), ("work/design.html", "0.7", "monthly"), ("blog/", "0.7", "weekly")]
    urls += [(f"services/{x['slug']}.html", "0.9", "monthly") for x in SERVICES]
    urls += [(f"blog/{a['slug']}.html", "0.6", "yearly") for a in ARTICLES]
    sm = "\n".join(f"  <url><loc>{SITE}/{u}</loc><lastmod>{TODAY}</lastmod><changefreq>{c}</changefreq><priority>{pr}</priority></url>" for u, pr, c in urls)
    (ROOT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{sm}\n</urlset>\n')
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nDisallow: /lab/\n\nSitemap: {SITE}/sitemap.xml\n")
    (ROOT / "site.webmanifest").write_text(json.dumps({
        "name": "Kodevia", "short_name": "Kodevia", "description": ORG["description"],
        "start_url": "./", "display": "standalone", "background_color": "#0A0A0B", "theme_color": "#0A0A0B",
        "icons": [{"src": "assets/apple-touch-icon.png", "sizes": "180x180", "type": "image/png"}, {"src": "assets/favicon.png", "sizes": "64x64", "type": "image/png"}]}, indent=2))
    print("built:", len(SERVICES), "service pages,", len(ARTICLES), "articles, blog index, 404, sitemap, robots, manifest; SEO on all pages")

build()
