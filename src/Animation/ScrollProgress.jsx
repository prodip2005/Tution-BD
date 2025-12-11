import { motion, useScroll } from "framer-motion";

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            style={{
                scaleX: scrollYProgress
            }}
            className="h-1 bg-blue-500 origin-left fixed top-0 left-0 right-0 z-50"
        />
    );
};

export default ScrollProgress;
