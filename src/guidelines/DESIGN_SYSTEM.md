# Cyber Threat Intelligence Platform - Design System

## 🎨 Design Philosophy

This design system is crafted specifically for a Cyber Threat Intelligence platform, emphasizing **security**, **vigilance**, **trust**, and **technological authority**. Every color, typeface, and component choice reflects the serious nature of threat analysis and the need for clarity in high-stakes environments.

---

## 🌈 Color Palette

### Primary Colors - Technological Authority

#### Deep Navy (`#0A0E27`)
**Philosophy**: Represents the depth of cyber intelligence, technological sophistication, and command center aesthetics.
- **Usage**: Primary backgrounds, sidebar, dark mode base
- **Symbolism**: Authority, professionalism, technical depth
- **Contrast**: Excellent with cyan, white, and accent colors

#### Cyber Blue (`#0052FF`)
**Philosophy**: The color of digital intelligence, representing trust, reliability, and technological precision.
- **Usage**: Primary actions, buttons, links, brand identity
- **Symbolism**: Trust, technological authority, analytical precision
- **Contrast**: WCAG AAA compliant on white backgrounds

#### Electric Cyan (`#00D9FF`)
**Philosophy**: Active monitoring, real-time detection, vigilance in action.
- **Usage**: Active states, highlights, real-time indicators, sidebar accents
- **Symbolism**: Vigilance, detection, active scanning
- **Contrast**: High visibility, draws attention to critical elements

### Secondary Colors - Intelligence & Analysis

#### Intelligence Violet (`#7B61FF`)
**Philosophy**: AI-powered insights, deep analysis, machine learning intelligence.
- **Usage**: AI features, advanced analytics, secondary actions
- **Symbolism**: Intelligence, automation, advanced capabilities
- **Contrast**: Complements primary blues, stands out in data viz

#### Indigo Purple (`#6366F1`)
**Philosophy**: Secondary analytical operations, classification systems.
- **Usage**: Secondary buttons, badges, category indicators
- **Symbolism**: Classification, organization, systematic analysis

### Status Colors - Threat Level System

#### Critical Red (`#D32F2F` / `#FF1744`)
**Philosophy**: Highest priority threats requiring immediate action.
- **Usage**: Critical alerts, malware detection, emergency states
- **Symbolism**: Danger, urgency, immediate action required
- **When to use**: Malicious detections, critical vulnerabilities

#### High Alert Red (`#FF3B5C`)
**Philosophy**: High-priority threats and security warnings.
- **Usage**: High-severity alerts, destructive actions, malware indicators
- **Symbolism**: High risk, serious concern, elevated attention
- **When to use**: Suspicious activity, high confidence threats

#### Medium Warning Amber (`#FFB020`)
**Philosophy**: Caution and medium-level threats requiring investigation.
- **Usage**: Medium-priority alerts, warnings, attention required
- **Symbolism**: Caution, investigation needed, moderate concern
- **When to use**: Suspicious detections, potential threats

#### Success Green (`#00E676`)
**Philosophy**: Security verified, safe status, positive confirmation.
- **Usage**: Safe/clean indicators, successful operations, verified status
- **Symbolism**: Security, safety, verified authenticity
- **When to use**: Clean scans, successful operations, secure states

### Neutral Palette - Data Clarity

#### Slate Gray Scale
**Philosophy**: Neutral foundation providing maximum clarity for data-heavy interfaces.

- **Background Light**: `#F8F9FB` - Clean, minimal distraction
- **Card White**: `#FFFFFF` - Maximum contrast for content
- **Muted Gray**: `#F1F3F5` - Subtle backgrounds and dividers
- **Text Gray**: `#64748B` - Secondary text, metadata
- **Border**: `#E2E8F0` - Subtle separators, clean divisions
- **Foreground**: `#0F1419` - Primary text, maximum readability

---

## 📐 Typography System

### Typeface Selection

#### Primary: Inter
**Philosophy**: Modern, geometric sans-serif designed for digital interfaces. Exceptional readability at all sizes, especially for data-dense environments.

**Characteristics**:
- High x-height for improved readability
- Optimized for screens with hinting
- Wide range of weights (300-800)
- OpenType features (ligatures, kerning)
- Professional, trustworthy appearance

**Usage**:
- All UI text, headings, body copy
- Data tables and metrics
- Navigation and labels
- Alerts and notifications

#### Secondary: JetBrains Mono
**Philosophy**: Monospaced typeface designed for developers and technical content. Perfect for displaying hashes, IPs, code, and technical data.

**Characteristics**:
- Clear distinction between similar characters (0/O, 1/l/I)
- Increased height for improved readability
- Coding ligatures for technical symbols
- Consistent character width

**Usage**:
- Hash values and file signatures
- IP addresses and URLs
- Domain names and technical identifiers
- Code snippets and API responses
- Monospaced data tables

### Typography Hierarchy

#### Display Level (H1)
- **Size**: 2.25rem (36px)
- **Weight**: 700 (Bold)
- **Line Height**: 1.2
- **Letter Spacing**: -0.02em (tight)
- **Use Case**: Page titles, dashboard headers

#### Heading 1 (H2)
- **Size**: 1.875rem (30px)
- **Weight**: 700 (Bold)
- **Line Height**: 1.25
- **Letter Spacing**: -0.015em
- **Use Case**: Section headers, card titles

#### Heading 2 (H3)
- **Size**: 1.5rem (24px)
- **Weight**: 600 (Semibold)
- **Line Height**: 1.3
- **Letter Spacing**: -0.01em
- **Use Case**: Subsections, widget titles

#### Heading 3 (H4)
- **Size**: 1.25rem (20px)
- **Weight**: 600 (Semibold)
- **Line Height**: 1.4
- **Letter Spacing**: -0.005em
- **Use Case**: Component headers, table headers

#### Body Text
- **Size**: 1rem (16px)
- **Weight**: 400 (Regular)
- **Line Height**: 1.6
- **Use Case**: Paragraphs, descriptions, content

#### UI Text
- **Size**: 0.9375rem (15px)
- **Weight**: 500 (Medium)
- **Line Height**: 1.5
- **Use Case**: Buttons, navigation, interactive elements

#### Label Text
- **Size**: 0.875rem (14px)
- **Weight**: 500 (Medium)
- **Line Height**: 1.5
- **Letter Spacing**: 0.01em
- **Use Case**: Form labels, metadata, secondary info

#### Data Tables
- **Size**: 0.875rem (14px)
- **Weight**: 400 (Regular)
- **Line Height**: 1.5
- **Use Case**: Tabular data, vendor lists, analysis results

#### Small / Caption
- **Size**: 0.8125rem (13px)
- **Weight**: 400 (Regular)
- **Line Height**: 1.4
- **Use Case**: Timestamps, help text, captions

### Font Weights

The system uses a full range of Inter weights for precise hierarchy:

- **300 (Light)**: Rarely used, large display text only
- **400 (Regular)**: Body text, data tables, general content
- **500 (Medium)**: UI elements, buttons, labels, emphasis
- **600 (Semibold)**: Subheadings, important labels, navigation
- **700 (Bold)**: Primary headings, critical information
- **800 (Extrabold)**: Hero sections, major emphasis (rare use)

---

## 🎯 Design Principles

### 1. Clarity First
Every element must serve the mission-critical purpose of threat analysis. No decorative elements that don't enhance understanding.

### 2. High Contrast
Data-heavy interfaces require excellent contrast ratios. All text meets WCAG AA standards minimum, AAA where possible.

### 3. Consistent Hierarchy
Users must immediately understand information priority through visual hierarchy. Critical threats demand immediate attention.

### 4. Professional Authority
The interface conveys expertise and reliability. Users must feel confident in the platform's analytical capabilities.

### 5. Situational Awareness
Color coding provides instant understanding of threat levels. Status is always immediately visible.

---

## 📊 Data Visualization

### Chart Color System

The platform uses a carefully selected palette for charts and graphs:

1. **Primary Blue** (`#0052FF`): Main data series, primary metrics
2. **Cyan** (`#00D9FF`): Secondary data, comparisons
3. **Violet** (`#7B61FF`): Tertiary data, AI predictions
4. **Alert Red** (`#FF3B5C`): Threats, malicious activity
5. **Warning Amber** (`#FFB020`): Suspicious activity, warnings
6. **Success Green** (`#00E676`): Safe status, clean results

### Contrast Requirements

- **Light Mode**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Dark Mode**: Minimum 7:1 for critical information
- **Data Tables**: Alternating row colors for improved scanning
- **Charts**: Color-blind friendly palette with pattern alternatives

---

## 🌓 Dark Mode Strategy

### Philosophy
Dark mode is not just an aesthetic choice—it's essential for SOC (Security Operations Center) environments where analysts work in low-light conditions during extended shifts.

### Implementation
- **Backgrounds**: Deep navy (`#0A0E27`) with slate variations
- **Increased Contrast**: Enhanced text colors for readability
- **Reduced Eye Strain**: Lower brightness for extended use
- **Alert Visibility**: Brighter alert colors for immediate recognition
- **Semantic Consistency**: Same meaning across light/dark modes

---

## 🔧 Component Guidelines

### Cards
- **Background**: White (light) / Dark Slate (dark)
- **Border**: Subtle 1px border for definition
- **Shadow**: Soft shadows for depth hierarchy
- **Padding**: Generous spacing for breathing room

### Tables
- **Header**: Uppercase labels, semibold weight, muted background
- **Rows**: Hover states for interactivity
- **Borders**: Subtle borders for row separation
- **Density**: Balanced padding for data scanning

### Buttons
- **Primary**: Cyber Blue with white text
- **Secondary**: Outlined with primary color
- **Destructive**: Alert Red for dangerous actions
- **Sizes**: Small, Medium, Large for hierarchy

### Badges/Status Indicators
- **Critical**: Red background, red text
- **High**: Orange/Red background, dark red text
- **Medium**: Amber background, dark amber text  
- **Low**: Green background, dark green text
- **Info**: Cyan background, dark cyan text

### Alerts
- **Background**: Tinted background matching alert type
- **Icon**: Leading icon for quick recognition
- **Border**: Left accent border for emphasis
- **Action**: Clear call-to-action when applicable

---

## ♿ Accessibility

### Standards Compliance
- WCAG 2.1 Level AA minimum
- Level AAA for critical information
- Keyboard navigation support
- Screen reader optimization

### Focus States
- 2px outline in ring color (`#0052FF`)
- 2px offset for visibility
- Clear visual indication on all interactive elements

### Color Blindness
- Never rely on color alone for information
- Use icons, patterns, and labels alongside color
- Test with color blindness simulators

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: > 1440px

Typography scales proportionally at smaller breakpoints while maintaining hierarchy.

---

## 🚀 Implementation Notes

### CSS Custom Properties
All colors and typography values are defined as CSS custom properties in `/styles/globals.css` for easy theming and maintenance.

### Font Loading
Fonts are loaded via Google Fonts CDN with `display=swap` for optimal performance.

### Performance
- Font subsetting for reduced file size
- Optimized font formats (WOFF2)
- System font fallbacks
- Hardware-accelerated rendering

---

## 📚 Resources

- **Color Tool**: https://coolors.co/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Typography Scale**: https://typescale.com/
- **Font Pairing**: https://fontpair.co/

---

## ✅ Checklist for New Components

When creating new components, ensure:

- [ ] Uses design system colors (no hardcoded colors)
- [ ] Typography follows hierarchy guidelines
- [ ] Meets WCAG AA contrast requirements
- [ ] Has proper dark mode support
- [ ] Includes focus states for accessibility
- [ ] Responsive across all breakpoints
- [ ] Uses semantic HTML
- [ ] Includes appropriate ARIA labels

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintained by**: CTI Platform Design Team
