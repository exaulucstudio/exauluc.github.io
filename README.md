# EXAULUC GROUP — Website
## Version 1.0 | Production-Ready Static Site

---

## File Structure

```
exauluc/
├── index.html                  Homepage
├── about.html                  About — Vision, Philosophy, Org Structure
├── projects.html               Projects — Production Archive
├── the-widowmaker.html         The Widowmaker — Full Digital Press Dossier
├── partnerships.html           Partnerships — Collaboration & Investment
├── contact.html                Contact — Segmented inquiry channels
├── assets/
│   ├── css/
│   │   └── style.css           Main stylesheet (all pages)
│   └── js/
│       └── main.js             Minimal interaction JS
└── README.md                   This file
```

---

## Deployment — OVH Static Hosting

### Option 1: OVH Web Hosting (Shared — Simplest)

1. Log in to OVH Manager → Web Cloud → Hosting plans
2. Access File Manager via FTP (FileZilla recommended)
3. Upload entire `exauluc/` folder contents into `/www/` or `/htdocs/`
4. Ensure `index.html` is in the root directory
5. Configure domain `exauluc.com` to point to the hosting plan's IP

FTP credentials are found in OVH Manager → Your hosting → FTP - SSH.

### Option 2: OVH Object Storage + CDN (Recommended for Performance)

1. Create an OVH Object Storage container (S3-compatible)
2. Enable public access / static website mode
3. Upload all files preserving the folder structure
4. Set `index.html` as default document
5. Enable OVH CDN on the container
6. Point `exauluc.com` CNAME to the CDN endpoint

### Option 3: OVH VPS (Full Control)

1. Provision an OVH VPS (Ubuntu 22 LTS recommended)
2. Install Nginx: `sudo apt install nginx`
3. Copy site files to `/var/www/exauluc/`
4. Configure Nginx virtual host (see below)
5. Install SSL with Certbot: `sudo certbot --nginx -d exauluc.com -d www.exauluc.com`

#### Nginx Config
```nginx
server {
    listen 80;
    server_name exauluc.com www.exauluc.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name exauluc.com www.exauluc.com;

    root /var/www/exauluc;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/exauluc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/exauluc.com/privkey.pem;

    # Compression
    gzip on;
    gzip_types text/css application/javascript text/html image/svg+xml;

    # Cache static assets
    location ~* \.(css|js|woff2|jpg|png|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

---

## Contact Form — Backend Integration

The contact form currently uses a simulated response. For production, choose one:

### Option A: Formspree (Simplest — no backend needed)
1. Sign up at formspree.io
2. Create a form pointing to contact@exauluc.com
3. Replace `action="#"` with your Formspree endpoint:
   `<form action="https://formspree.io/f/FORM_ID" method="POST">`

### Option B: Custom PHP on OVH Shared Hosting
Create `assets/php/send.php`:
```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars($_POST['name'] ?? '');
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($_POST['message'] ?? '');
    $subject = htmlspecialchars($_POST['subject'] ?? 'General Inquiry');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        exit;
    }

    $to = 'contact@exauluc.com';
    $headers = "From: noreply@exauluc.com\r\nReply-To: $email";
    mail($to, "[$subject] — $name", $message, $headers);

    http_response_code(200);
    echo json_encode(['status' => 'ok']);
}
```
Update `main.js` form handler to POST to `assets/php/send.php`.

---

## Adding Real Images

Replace placeholder sections in HTML with:
```html
<img src="assets/images/widowmaker-still-01.jpg"
     alt="The Widowmaker — [Scene description]"
     loading="lazy"
     width="1920" height="1080">
```

Recommended image specs:
- Hero images: 1920×1080px, JPEG 80% quality
- Gallery stills: 1280×720px, JPEG 85% quality
- Key art: 1600×1000px, JPEG 85% quality
- All images: grayscale or desaturated to 20–40% saturation

---

## Email Setup

Register these addresses at OVH or Google Workspace:
- contact@exauluc.com
- press@exauluc.com
- casting@exauluc.com
- tech@exauluc.com
- legal@exauluc.com

---

## Trailer Integration — Vimeo (Recommended)

Replace the trailer placeholder in `the-widowmaker.html`:
```html
<div class="trailer-embed">
  <iframe
    src="https://player.vimeo.com/video/[VIDEO_ID]?color=b8a898&title=0&byline=0&portrait=0&dnt=1"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture"
    allowfullscreen
    title="The Widowmaker — Official Trailer">
  </iframe>
</div>
```

Vimeo Pro allows custom player color (use `b8a898` for accent match),
removes Vimeo branding, and enables password-protected embeds.

---

## Phase 2 Additions (Future)

- `/press.html` — Press releases, logo downloads
- `/studio.html` — ExauLuc Studio dedicated page
- `/production-archive.html` — Selected development documentation
- `/projects/blackhawk.html` — Past productions
- `sitemap.xml` — For search indexing
- `robots.txt` — Search engine directives

---

## Technical Notes

- Pure HTML/CSS/JS — zero build process required
- Fonts loaded from Google Fonts CDN (Cormorant Garamond + IBM Plex Sans)
- No JavaScript frameworks — vanilla JS only
- IntersectionObserver for fade-in animations (graceful fallback included)
- Mobile-responsive: desktop-first breakpoints at 1024px and 768px
- All colors and spacing via CSS custom properties (easy theme adjustments)
