import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

// GrowthChart: Animated line chart for growth trends
const GrowthChart = ({ data = [], loading }) => {
    const safeData = Array.isArray(data) ? data : [];
    return (
        <div className="w-full h-64 flex items-center justify-center">
            {loading ? (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A55F]"></div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={safeData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E6FAF1" />
                            <XAxis dataKey="label" tick={{ fill: '#008c4f', fontWeight: 600 }} />
                            <YAxis tick={{ fill: '#008c4f', fontWeight: 600 }} />
                            <Tooltip contentStyle={{ background: '#fff', borderColor: '#00A55F' }} labelStyle={{ color: '#00A55F' }} />
                            <Line type="monotone" dataKey="value" stroke="#00A55F" strokeWidth={3} dot={{ r: 5, fill: '#00A55F' }} activeDot={{ r: 7 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </div>
    );
};

export default GrowthChart; 