import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const JobInput = ({ onSubmit, isLoading }) => {
    const [jobDesc, setJobDesc] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (jobDesc.trim()) {
            onSubmit(jobDesc);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-2xl mx-auto mt-8 card"
        >
            <div className="flex items-center gap-3 mb-4 text-secondary">
                <Briefcase className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Job Description</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all"
                    placeholder="Paste the job description here (responsibilities, skills, requirements)..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                />

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={!jobDesc.trim() || isLoading}
                        className={`btn-primary ${(!jobDesc.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Match'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default JobInput;
