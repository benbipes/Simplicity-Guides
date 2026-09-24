# Simplicity Group — Financial Guide Co-Branding Studio

> **Live Review URL**: [https://benbipes.github.io/Simplicity-Guides/](https://benbipes.github.io/Simplicity-Guides/)  
> **GitHub Repository**: [https://github.com/benbipes/Simplicity-Guides](https://github.com/benbipes/Simplicity-Guides)

A specialized co-branding platform built for **Simplicity Group** independent financial advisors to brand client-facing financial education guides.

---

## 🌟 Key Features

1. **Exact PDF Design & Original Content Preservation**:
   - Every guide's body text, interior chapters, charts, and sources remain **100% original and untouched**.
   - No arbitrary color pickers or layout shifts — adheres strictly to the authentic guide typography and palette (Simplicity Royal Blue `#0076BD`, Navy Blue `#004372`, dark text `#333333`, and original guide navy `#00487C`).

2. **Interactive Clickable Logos**:
   - **Cover Page**: Agent's logo is stamped in the lower-left corner (`X: 54, Y: 28.9`) and is **clickable**, linking directly to the advisor's website.
   - **Contact Page**: Prominently displays the advisor's logo with a clickable web link, alongside advisor credentials, address, and interactive contact buttons.
   - **Disclosure Page**: Advisor logo stamped as header with a clickable web link.

3. **Clickable Contact & Social Media Annotations**:
   - **Direct Links**: Embedded `https://` website link, `tel:` phone dialing, and `mailto:` email links.
   - **"Learn More" Action Button**: Clickable custom booking / consultation link.
   - **Social Icons**: Clickable icons for LinkedIn, Facebook, X (Twitter), YouTube, and Instagram.

4. **Compliance Disclosure Appending**:
   - Upload official firm disclosure documents (PDF or image) or supply custom regulatory disclaimer text.
   - Automatically appended **directly after the standard Simplicity disclosure page** at the end of the guide.

5. **Live Real PDF Page Viewer**:
   - Powered by `pdfjs-dist` rendering actual PDF pages directly on an HTML5 canvas.
   - Navigate page by page (Cover, Content, Contact Page, Standard Disclosure, Custom Disclosure) with zoom controls.

6. **100% Authentic Simplicity Master Guides**:
   - Zero AI-generated dummy guides. All 6 offerings are official Simplicity Group master PDFs:
     1. **Important Birthdays Over 50** (13 pages, Contact Pg 11, Disclosure Pg 13)
     2. **A Short Introduction to Long-Term Care** (20 pages, Contact Pg 18, Disclosure Pg 20)
     3. **Age 5 to 55: What Your Kids Need to Know About Finances** (16 pages, Contact Pg 14, Disclosure Pg 16)
     4. **Legacy & Estate Planning: Understanding the Basics** (15 pages, Contact Pg 13, Disclosure Pg 15)
     5. **Pensions, Buyouts, & Retirement Income** (17 pages, Contact Pg 15, Disclosure Pg 17)
     6. **How to Exit Your Business and Enter Retirement** (17 pages, Contact Pg 15, Disclosure Pg 17)

7. **Admin Portal Protection**:
   - Advanced tools like "Load Demo Advisor" and "Master PDFs" manager are protected behind secure admin authentication.

8. **100% Client-Side Privacy & Instant Export**:
   - Powered by `pdf-lib` running locally in the browser — no sensitive advisor details or client guides ever leave the device.
   - Download individual branded guides immediately or click **"Download Guides (ZIP)"** to export all selected guides in a single organized zip archive.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

### 3. Build for Production / GitHub Pages
```bash
npm run build
```

---

## 🌐 Deployment to GitHub Pages

This project is deployed to GitHub Pages via GitHub Actions:
- **Repository**: [https://github.com/benbipes/Simplicity-Guides](https://github.com/benbipes/Simplicity-Guides)
- **Live URL**: [https://benbipes.github.io/Simplicity-Guides/](https://benbipes.github.io/Simplicity-Guides/)
- **Workflow**: Automated build and deployment on push to `main` via `.github/workflows/deploy.yml`.
