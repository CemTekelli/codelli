// GSAP Bundle Entry Point
// This file imports GSAP core and plugins, then exports them globally

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

// Register plugins
gsap.registerPlugin(ScrollTrigger, CustomEase);

// Export to global scope for use in main.js
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.CustomEase = CustomEase;
