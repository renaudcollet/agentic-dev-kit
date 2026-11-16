# Rubric: 08-photo-gallery

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- All 5000 photos become reachable (scroll, load more or pagination).
- The page never renders thousands of DOM nodes at once (virtualization, pagination or batch loading).
- Ideally the API is paginated instead of sending 5000 items at once.
- Images keep `alt`, `width`, `height`, and are lazy-loaded.
- A "load more" control, if any, is a real button reachable by keyboard, and new content is announced or focus is handled.

## Human check
- Scroll through the gallery on a mid-range phone or with CPU throttling: does it stay fluid?
