// CandidatePreferences.jsx
// World-class, professional preferences page for Stage222
// Inspired by Internshala, tailored for Mauritanian students and Stage222 branding
// Uses mock data for now; ready for API integration
// RESPONSIVE: Tags wrap on mobile, full-width form fields, touch-friendly buttons

import React, { useState } from 'react';

const initialInterests = [
    'Web Development',
    'Javascript Development',
    'Software Development',
    'Digital Marketing',
];
const moreOpportunities = [
    'Social Media Marketing',
    'Search Engine Optimization (SEO)',
    'Marketing',
];
const popularCareers = [
    'Sales', 'Data Entry', 'Graphic Design', 'Human Resources (HR)', 'General Management', 'Finance',
    'Telecalling', 'Market/Business Research', 'Content Writing', 'Accounts', 'Project Management',
    'Operations', 'Client Servicing', 'Programming', 'Teaching', 'Data Science', 'Video Making/Editing',
    'Interior Design', 'Python/Django Development', 'UI/UX Design', 'Software Testing',
];

const CandidatePreferences = () => {
    const [interests, setInterests] = useState(initialInterests);
    const [inputValue, setInputValue] = useState('');
    const [selectedMore, setSelectedMore] = useState([...moreOpportunities]);
    const [selectedCareers, setSelectedCareers] = useState([]);
    const [lookingFor, setLookingFor] = useState(['Internships']);
    const [workMode, setWorkMode] = useState(['Work from home']);

    // Tag add/remove handlers
    const addInterest = (val) => {
        if (val && !interests.includes(val)) setInterests([...interests, val]);
        setInputValue('');
    };
    const removeInterest = (val) => setInterests(interests.filter(i => i !== val));
    const toggleMore = (val) => setSelectedMore(selectedMore.includes(val) ? selectedMore.filter(i => i !== val) : [...selectedMore, val]);
    const toggleCareer = (val) => setSelectedCareers(selectedCareers.includes(val) ? selectedCareers.filter(i => i !== val) : [...selectedCareers, val]);
    const toggleLookingFor = (val) => setLookingFor(lookingFor.includes(val) ? lookingFor.filter(i => i !== val) : [...lookingFor, val]);
    const toggleWorkMode = (val) => setWorkMode(workMode.includes(val) ? workMode.filter(i => i !== val) : [...workMode, val]);

    return (
        <div className="max-w-xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">Your preferences</h1>
            <form className="bg-white border rounded-xl shadow p-4 sm:p-6 space-y-6">
                {/* Area(s) of interest - Responsive input and tags */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-2">Area(s) of interest</label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInterest(inputValue.trim()); } }}
                        placeholder="Areas you want to work in or learn about"
                        className="w-full border rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#00A55F]"
                    />
                    <div className="flex flex-wrap gap-2">
                        {interests.map((interest, i) => (
                            <span key={i} className="bg-[#00A55F] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                {interest}
                                <button type="button" className="ml-1 text-white hover:text-gray-200 p-1" onClick={() => removeInterest(interest)}>&times;</button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* More opportunities - Responsive tag buttons */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-2">Also select the following to get more opportunities</label>
                    <div className="flex flex-wrap gap-2">
                        {moreOpportunities.map((item, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`px-3 py-2 rounded-full text-xs font-medium border transition ${selectedMore.includes(item) ? 'bg-[#00A55F] text-white border-[#00A55F]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                                onClick={() => toggleMore(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Popular career interests - Responsive tag buttons */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-2">Popular career interests</label>
                    <div className="flex flex-wrap gap-2">
                        {popularCareers.map((item, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`px-3 py-2 rounded-full text-xs font-medium border transition ${selectedCareers.includes(item) ? 'bg-[#00A55F] text-white border-[#00A55F]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                                onClick={() => toggleCareer(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Currently looking for - Responsive button group */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-2">Currently looking for</label>
                    <div className="flex flex-wrap gap-2">
                        {['Jobs', 'Internships'].map((item, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${lookingFor.includes(item) ? 'bg-[#00A55F] text-white border-[#00A55F]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                                onClick={() => toggleLookingFor(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Work mode - Responsive button group */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-2">Work mode</label>
                    <div className="flex flex-wrap gap-2">
                        {['In-office', 'Work from home'].map((item, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${workMode.includes(item) ? 'bg-[#00A55F] text-white border-[#00A55F]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                                onClick={() => toggleWorkMode(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Save Button - Full width and touch-friendly */}
                <div className="pt-2">
                    <button type="submit" className="w-full bg-[#00A55F] hover:bg-[#008c4f] text-white font-semibold py-3 rounded-lg shadow transition">Save</button>
                </div>
            </form>
        </div>
    );
};

export default CandidatePreferences; 