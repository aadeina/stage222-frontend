import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#00A55F', '#008c4f', '#E6FAF1', '#B2F5EA', '#38B2AC'];

// TopUsersChart: Animated pie chart for top users
const TopUsersChart = ({ data = [], loading }) => {
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
                        <PieChart>
                            <Pie
                                data={safeData}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                fill="#00A55F"
                                label
                            >
                                {safeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#fff', borderColor: '#00A55F' }} labelStyle={{ color: '#00A55F' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </div>
    );
};

export default TopUsersChart; 