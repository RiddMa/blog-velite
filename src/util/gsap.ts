export * from "gsap";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
export * from "gsap/Flip";

export * from "@gsap/react";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(Flip);

gsap.defaults({
  duration: 0.3,
  ease: gsap.parseEase("0.25, 0.1, 0.25, 1.0"),
});
