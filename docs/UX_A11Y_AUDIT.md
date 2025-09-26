# UX & Accessibility Audit

This document outlines the findings of a UX and accessibility audit of the Jambox application. The goal of this audit is to identify areas for improvement in usability and to ensure compliance with WCAG 2.2 AA standards.

## Prioritized Action Plan

### Critical

*   None at this time.

### High

1.  **Missing Form Label on Search Input**
    *   **The Issue:** The search input field lacks a corresponding `<label>` element.
    *   **The Impact:** This negatively impacts screen reader users, who may not understand the purpose of the input field. It also affects users with cognitive disabilities who rely on clear, persistent labels.
    *   **The Recommendation:** Add a `<label>` for the search input. To keep the current design, the label can be visually hidden but still accessible to screen readers.
    *   **Status:** **Implemented**

2.  **Icon-Only Buttons Lack Accessible Names**
    *   **The Issue:** The "decline" and "accept" buttons for pending suggestions in the admin dashboard are icon-only buttons without any accessible name.
    *   **The Impact:** Screen reader users will not know what these buttons do.
    *   **The Recommendation:** Add an `aria-label` to each button to describe its action (e.g., "Decline suggestion", "Accept suggestion").
    *   **Status:** **Implemented**

3.  **Toggle Switch Lacks Clear Accessible Name**
    *   **The Issue:** The "Autoplay Mode" toggle switch in the admin dashboard is not programmatically associated with its visual label.
    *   **The Impact:** Screen reader users may not understand the purpose of the toggle switch.
    *   **The Recommendation:** Wrap the "Autoplay Mode" text and the toggle switch in a single `<label>` element.
    *   **Status:** **Implemented**
4.  **Missing Accessible Name for Theme Toggle**
    *   **The Issue:** The button to toggle the theme is an icon-only button and lacks an accessible name.
    *   **The Impact:** Screen reader users will not know the purpose of this button.
    *   **The Recommendation:** Add an `aria-label` to the button that describes its function and state.
    *   **Status:** **Implemented**

### Medium

1.  **Redundant `aria-label` on 2FA Input**
    *   **The Issue:** The input for the 2FA code has both a visually hidden `<label>` and an `aria-label`.
    *   **The Impact:** This can be confusing for screen reader users, as both might be announced.
    *   **The Recommendation:** Remove the `aria-label` from the input field.
    *   **Status:** **Implemented**

### Low

1.  **Redundant `aria-label` on Search Button**
    *   **The Issue:** The search button has an `aria-label="Search"`, which is redundant for a `type="submit"` button.
    *   **The Impact:** Adds unnecessary verbosity for screen reader users.
    *   **The Recommendation:** Remove the `aria-label`.
    *   **Status:** **Implemented**
2.  **Incomplete Focusable Check in `FocusFirstInvalidService`**
    *   **The Issue:** The `isFocusable` method in the `FocusFirstInvalidService` does not check if an element is visually hidden.
    *   **The Impact:** The service could attempt to focus an element that is not visible to the user, causing confusion.
    *   **The Recommendation:** Update the `isFocusable` method to check the element's `offsetParent` property.
    *   **Status:** **Implemented**