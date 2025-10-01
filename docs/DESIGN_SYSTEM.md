# Jambox Design System

This document outlines the core design principles, styles, and components for the Jambox application redesign. Its purpose is to ensure a consistent, high-quality, and accessible user experience across the entire platform.

## 1. Typography

- **Font Family:** Inter
- **Description:** A modern, highly legible sans-serif font, chosen for its clarity in UI design and data-dense environments. It will be used for all text elements across the application.
- **Implementation:** The font will be imported via Google Fonts and integrated into the `src/styles.css` file.

### Implementation Steps

1.  **Add the following to the `<head>` of `src/index.html`:**

    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    ```

2.  **Update the `--font-sans` variable in `src/styles.css`:**

    ```css
    :root {
      /* ... */
      --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      /* ... */
    }
    ```

## 2. Glassmorphism

Glassmorphism will be applied to create a sense of depth and visual hierarchy. It will be used on sidebars, modal windows, and data cards.

### Core Properties:
- **Background:** A semi-transparent background.
- **Blur:** A `backdrop-filter` with a `blur()` effect will be applied to create the frosted-glass look.
- **Border:** A subtle, 1px solid border will define the element's edges.
- **Opacity:** The background color will have a low opacity to allow the background to show through.

### Example CSS:
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.2); /* Example for light theme */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* For Safari */
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
```
*Note: Specific color values will be adapted to work with the existing light and dark mode palettes.*

## 3. 3D Effects & Elevation

Subtle 3D effects will add depth and tactile feedback to interactive elements.

### Core Properties:
- **Drop Shadows:** Soft, dynamic drop shadows will be used to lift elements like cards and buttons off the page. Shadows will become more pronounced on hover or focus to provide feedback.
- **Interactive Elements:** Charts and other interactive elements may incorporate subtle 3D transformations on interaction.

### Example CSS:
```css
.card-3d {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-3d:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
```

## 4. Responsive Design

- **Approach:** Mobile-First
- **Grid System:** A flexible grid system will be established to ensure content reflows gracefully across all screen sizes.
- **Breakpoints:** Standard Tailwind CSS breakpoints will be used as a baseline:
    - `sm`: 640px
    - `md`: 768px
    - `lg`: 1024px
    - `xl`: 1280px
    - `2xl`: 1536px

## 5. Layout Redesign

The main application layout will be updated to create a more modern and immersive experience.

### 5.1. Body Background

A subtle, decorative background will be added to the `<body>` to enhance the glassmorphism effect. This can be a subtle gradient or a very low-opacity background image.

**Implementation:**
- **File:** `src/styles.css`
- **Action:** Add a background style to the `html` or `body` element.
  ```css
  body {
    background-color: var(--color-bg);
    /* Example gradient */
    background-image: linear-gradient(120deg, var(--color-accent-muted) 0%, var(--color-bg) 100%);
  }
  ```

### 5.2. Header Redesign (`layout.component.html`)

The header will be a floating, glassmorphic element.

- **Structure:**
  - The `<header>` element will be updated to use the `.glass-effect` style.
  - It will be made `sticky` to the top of the viewport.
  - A `z-index` will be applied to ensure it stays above other content.
  - The `container` will have its `max-width` increased for a more spacious feel on large screens.

- **Mobile Navigation:**
  - On screens smaller than the `md` breakpoint (768px), the "Admin" link and the "Theme" toggle will be collapsed into a mobile menu button (hamburger icon).
  - The mobile menu itself will be a full-screen or slide-in panel, also with the glassmorphism effect.

### 5.3. Main Content Area (`layout.component.html`)

- **Structure:**
  - The `<main>` content area will have padding-top applied to prevent the sticky header from overlapping it.
  - The container will be centered and have a max-width to ensure readability.