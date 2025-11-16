
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(MorphSVGPlugin);
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
gsap.registerPlugin(SplitText)

export default gsap;
export { ScrollSmoother, ScrollTrigger, SplitText }
export { useGSAP }