import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { Draggable, SplitText, ScrollTrigger, ScrollSmoother, MorphSVGPlugin, ScrollToPlugin, DrawSVGPlugin, MotionPathPlugin, TextPlugin } from "gsap/all";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin, MotionPathPlugin);
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
gsap.registerPlugin(SplitText, Draggable, ScrollToPlugin, TextPlugin)

export default gsap;
export { ScrollSmoother, ScrollTrigger, SplitText }
export { useGSAP }