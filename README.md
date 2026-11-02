# MR KOTALICIOUS | PART 01

## Project Structure
kotalicious/
│
├── home.html            # Home page
├── menu.html            # Menu page
├── about.html           # About page
├── order.html           # Order page
├── find-us.html         # Find Us page
├── social-media.html    # Social Media page
├── css/
│   └── style.css        # Main stylesheet
├── images/              # Restaurant and product photos
├── js/
│   └── script.js        # Search, galleries, and order interactions
├── robots.txt           # Search crawler instructions
├── sitemap.xml          # Public page URLs for search engines
├── documents/           # Project documents or references
├── README.md            # Project documentation
└── .git/                # Git repository files

## 🚀 Features
- Animated marquee header and branded navigation styling across the website
- Home page video hero with CTA buttons and operating hours section
- Menu page with a responsive card grid, food descriptions, and order button
- About page with gallery, story, mission, and chef highlight content
- Order page with customer details form and quantity selection layout
- Find Us page with address, map section, and direction/order buttons
- Social Media page with testimonials, ratings, and Facebook/TikTok links
- Transparent content panels that keep the background image visible
- Responsive layout for mobile, tablet, and desktop screens
- Page-specific SEO titles, descriptions, canonical URLs, and social-sharing metadata
- Local restaurant structured data, descriptive product image names and alt text, plus crawler files

## 🔧 Style Notes
- The stylesheet is now stored in the css folder.
- Background image paths must use relative paths such as ../images/backmenu.jpg.
- Transparent panels and card backgrounds were adjusted to keep the pattern image visible without reducing readability.
- Shared CSS now includes a reset, type scale, relative spacing variables, desktop/tablet/mobile breakpoints, Grid/Flexbox layout rules, focus states, hover/active states, and reduced-motion support.
- Content images use responsive `srcset`/`sizes` attributes, with a `picture` example on the About page.

## Responsive Screenshot Evidence

Capture browser device-emulation screenshots at these viewport sizes for submission:

| Viewport | Evidence to check |
| --- | --- |
| Desktop: 1440 x 900 | Three-column menu grid, two-column Find Us layout, readable navigation |
| Tablet: 768 x 1024 | Two-column menu grid, single-column content sections, no horizontal scrolling |
| Mobile: 390 x 844 | Single-column cards, wrapping navigation and buttons, responsive images and map |

## 📝 Change Log
### Part 2 Improvement

#### CSS
- Turned the About page photo gallery into a slideshow layout while keeping the active image close to the original gallery tile size (up to 300px wide by 240px high).
- Styled the slideshow navigation and pause/resume controls to match the site colours, with clear hover and focus states and touch-friendly button sizes.
- Kept the original gallery grid as the fallback layout until the slideshow JavaScript is ready.

#### JavaScript and About Page
- Added a six-image slideshow using photos already in the project.
- Added previous/next navigation, a slide counter, and automatic slide changes every five seconds.
- Added pause/resume controls; autoplay pauses while the slideshow is hovered, focused, or the browser tab is hidden.
- Respects the visitor's reduced-motion preference by disabling autoplay.
- Added accessible labels for the slideshow, slides, and controls, with image descriptions for screen readers.

### Part 3 — Things to Complete
- [ ] Check the About page slideshow at desktop, tablet, and mobile sizes; confirm the images are up to 300px by 240px and fit their containers.
- [ ] Test previous/next buttons, first/last slide wrapping, the slide counter, and pause/resume.
- [ ] Confirm autoplay pauses on hover, keyboard focus, and hidden browser tabs, and does not start when reduced motion is enabled.
- [ ] Check keyboard-only operation, visible focus indicators, and screen-reader labels.
- [ ] Verify every slideshow image loads and that the remaining About page content still displays correctly.
- [ ] Run JavaScript syntax and whitespace checks when the required validation tools are available.

### 2026-09-17
- Finished the order page styling with a polished branded layout, quantity controls, and sticky summary panel.
- Improved the About page image layout and gallery styling for consistent sizing and spacing.
- Updated the Social Media page image cards, testimonials layout, and social call-to-action styling.
- Styled the Find Us page CTA buttons for “Get Directions” and “Order Now” to match the restaurant branding.
- Removed repeated CSS rules to clean up the stylesheet and reduce conflicting styles.
- Added consistent page-specific classes for improved maintainability and cleaner design structure.
- Fixed responsive layout issues across devices so the website fits properly on phones, tablets, laptops, and desktops.
- Centered the home page video and corrected the About page image alignment for a cleaner visual layout.
- Standardized the menu chips image sizing and upgraded the Order Now call-to-action to a wide, prominent button.
