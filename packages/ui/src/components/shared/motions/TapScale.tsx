import { motion } from "framer-motion"
import { AnimationProps } from "./types";
import { memo } from "react";

interface TapScaleProps extends AnimationProps {
    scale?: number;
}

function TapScale({ children, scale }: TapScaleProps) {
    const actualScale = scale ?? 0.9
    return (
        <motion.div
            whileTap={{ scale: actualScale }}
        >
            {children}
        </motion.div >
    )
}

export default memo(TapScale);