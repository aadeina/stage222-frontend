import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

// ConversionChart: Animated bar chart for conversion rates
const ConversionChart = ({ data = [], loading }) => {
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
                        <BarChart data={safeData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E6FAF1" />
                            <XAxis dataKey="label" tick={{ fill: '#008c4f', fontWeight: 600 }} />
                            <YAxis tick={{ fill: '#008c4f', fontWeight: 600 }} />
                            <Tooltip contentStyle={{ background: '#fff', borderColor: '#00A55F' }} labelStyle={{ color: '#00A55F' }} />
                            <Bar dataKey="value" fill="#00A55F" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </div>
    );
};

export default ConversionChart; 