// Shared, render-free channel between the About hero's GSAP scroll pin and
// the r3f backdrop behind it. Writing scroll progress into React state would
// re-render the whole hero ~60x/second during the pin; a plain mutable object
// lets useFrame read the latest value with zero reconciliation.
export const aboutScrollProgress = { value: 0 };
