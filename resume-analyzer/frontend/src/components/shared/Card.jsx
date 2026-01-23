import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <motion.div
            whileHover={hover ? { scale: 1.02 } : {}}
            className={`bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 transition-all ${hover ? 'hover:border-slate-600' : ''
                } ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
