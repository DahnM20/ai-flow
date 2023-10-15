import { motion } from "framer-motion"
import { AnimationProps } from "./types";

function EaseOut({ children }: AnimationProps) {
    return (
        <motion.div
            className="box"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.3,
                delay: 0,
                ease: [0, 0.71, 0.2, 1.01]
            }}
        >
            {children}
        </motion.div >
    )
}

export default EaseOut;