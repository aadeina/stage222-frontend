// CandidateResume.jsx
// World-class, professional resume page for Stage222
// Inspired by Internshala, tailored for Mauritanian students and Stage222 branding
// Uses Mauritanian mock data for now; ready for API integration
// RESPONSIVE: Sections stack vertically, responsive padding and text sizing

import React from 'react';
import { FaArrowLeft, FaDownload, FaEdit, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const mockResume = {
    name: 'Amar Med Moctar',
    email: 'amarmed4500@gmail.com',
    phone: '+222 37102423',
    location: 'Nouakchott',
    careerObjective: '',
    education: [
        {
            degree: 'Bachelor of Computer Engineering',
            institution: 'Higher Institute Of Accounting And Institutional Management',
            year: '2021 - 2024',
        },
    ],
    experience: [
        {
            title: 'Social Media Marketer',
            company: 'Inamigos Foundation, Virtual',
            type: 'Internship',
            period: 'Oct 2023 - Present (1 year 9 months)',
            details: [
                'Develop a social media marketing strategy and implement it.',
                'Promote organization on various social media platforms.',
            ],
        },
    ],
    extraCurricular: [],
    trainings: [
        {
            title: 'Google Digital Marketing Certification',
            provider: 'Google, Online',
            period: 'Jun 2021 - Present',
        },
    ],
    projects: [],
    skills: ['HTML', 'CSS', 'JavaScript', 'Git', 'GitHub', 'Email Marketing', 'Digital Marketing', 'React'],
    portfolio: [],
    accomplishments: [],
};

const CandidateResume = () => {
    const navigate = useNavigate();
    return (
        <div className="max-w-3xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
            {/* Back Button - Responsive padding */}
            <button onClick={() => navigate(-1)} className="flex items-center text-[#00A55F] hover:text-[#008c4f] mb-4 font-medium">
                <FaArrowLeft className="mr-2" /> Back
            </button>

            {/* Header - Responsive text sizing */}
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">Stage222 Resume</h1>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 text-sm text-center mb-6">
                <span className="inline-flex items-center"><FaCheckCircle className="mr-2 text-yellow-500" /> This is the resume employers will see when you apply. Please make sure it is up to date.</span>
            </div>

            {/* Resume Card - Responsive padding */}
            <div className="bg-white border rounded-xl shadow p-4 sm:p-6 space-y-6">
                {/* Candidate Info - Responsive layout */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">{mockResume.name} <FaEdit className="text-gray-400 text-sm cursor-pointer hover:text-[#00A55F]" title="Edit name" /></h2>
                        <div className="text-gray-600 text-sm break-words">{mockResume.email}</div>
                        <div className="text-gray-600 text-sm">{mockResume.phone}</div>
                        <div className="text-gray-600 text-sm">{mockResume.location}</div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#00A55F] text-white rounded-lg font-medium shadow hover:bg-[#008c4f] transition w-full sm:w-auto justify-center">
                        <FaDownload /> Download
                    </button>
                </div>

                {/* Career Objective - Responsive text */}
                <Section title="Career Objective">
                    {mockResume.careerObjective ? (
                        <div className="flex items-center justify-between">
                            <span className="break-words">{mockResume.careerObjective}</span>
                            <FaEdit className="text-gray-400 cursor-pointer hover:text-[#00A55F] flex-shrink-0 ml-2" title="Edit" />
                        </div>
                    ) : (
                        <AddLink label="Add your career objective" />
                    )}
                </Section>

                {/* Education - Responsive layout */}
                <Section title="Education">
                    {mockResume.education.length > 0 ? (
                        mockResume.education.map((edu, i) => (
                            <div key={i} className="mb-2 flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                    <div className="font-medium text-gray-900 break-words">{edu.degree}</div>
                                    <div className="text-sm text-gray-600 break-words">{edu.institution}</div>
                                    <div className="text-xs text-gray-500">{edu.year}</div>
                                </div>
                                <FaEdit className="text-gray-400 cursor-pointer hover:text-[#00A55F] flex-shrink-0" title="Edit" />
                            </div>
                        ))
                    ) : (
                        <AddLink label="Add education" />
                    )}
                </Section>

                {/* Work Experience - Responsive layout */}
                <Section title="Work Experience (1 year 9 months)">
                    {mockResume.experience.length > 0 ? (
                        mockResume.experience.map((exp, i) => (
                            <div key={i} className="mb-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium text-gray-900 break-words">{exp.title}</div>
                                        <div className="text-sm text-gray-600 break-words">{exp.company}</div>
                                        <div className="text-xs text-gray-500">{exp.type} • {exp.period}</div>
                                    </div>
                                    <FaEdit className="text-gray-400 cursor-pointer hover:text-[#00A55F] flex-shrink-0" title="Edit" />
                                </div>
                                <ul className="list-disc ml-6 text-sm text-gray-700 mt-1 space-y-1">
                                    {exp.details.map((d, j) => <li key={j} className="break-words">{d}</li>)}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <AddLink label="Add job" />
                            <AddLink label="Add internship" />
                        </div>
                    )}
                </Section>

                {/* Extra Curricular Activities - Responsive text */}
                <Section title="Extra Curricular Activities">
                    {mockResume.extraCurricular.length > 0 ? (
                        mockResume.extraCurricular.map((act, i) => (
                            <div key={i} className="mb-2 flex items-start justify-between gap-2">
                                <span className="break-words flex-1">{act}</span>
                                <FaEdit className="text-gray-400 cursor-pointer hover:text-[#00A55F] flex-shrink-0" title="Edit" />
                            </div>
                        ))
                    ) : (
                        <AddLink label="Add extra curricular activities" />
                    )}
                </Section>

                {/* Trainings/Courses - Responsive layout */}
                <Section title="Trainings / Courses">
                    {mockResume.trainings.length > 0 ? (
                        mockResume.trainings.map((t, i) => (
                            <div key={i} className="mb-2 flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                    <div className="font-medium text-gray-900 break-words">{t.title}</div>
                                    <div className="text-sm text-gray-600 break-words">{t.provider}</div>
                                    <div className="text-xs text-gray-500">{t.period}</div>
                                </div>
                                <FaEdit className="text-gray-400 cursor-pointer hover:text-[#00A55F] flex-shrink-0" title="Edit" />
                            </div>
                        ))
                    ) : (
                        <AddLink label="Add training/ course" />
                    )}
                </Section>

                {/* Academics/Personal Projects - Responsive text */}
                <Section title="Academics / Personal Projects">
                    {mockResume.projects.length > 0 ? (
                        mockResume.projects.map((p, i) => (
                            <div key={i} className="mb-2 flex items-start justify-between gap-2">
                                <span className="break-words flex-1">{p}</span>
                                <FaEdit className="text-gray-400 cursor-pointer hover:text-[#00A55F] flex-shrink-0" title="Edit" />
                            </div>
                        ))
                    ) : (
                        <AddLink label="Add academic/ personal project" />
                    )}
                </Section>

                {/* Skills - Responsive wrapping */}
                <Section title="Skills">
                    {mockResume.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {mockResume.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 break-words">{skill}</span>
                            ))}
                        </div>
                    ) : (
                        <AddLink label="Add skill" />
                    )}
                </Section>

                {/* Portfolio/Work Samples - Responsive text */}
                <Section title="Portfolio / Work Samples">
                    {mockResume.portfolio.length > 0 ? (
                        mockResume.portfolio.map((p, i) => (
                            <div key={i} className="mb-2 flex items-start justify-between gap-2">
                                <span className="break-words flex-1">{p}</span>
                                <FaEdit className="text-gray-400 cursor-pointer hover:text-[#00A55F] flex-shrink-0" title="Edit" />
                            </div>
                        ))
                    ) : (
                        <AddLink label="Add portfolio/ work sample" />
                    )}
                </Section>

                {/* Accomplishments/Additional Details - Responsive text */}
                <Section title="Accomplishments / Additional Details">
                    {mockResume.accomplishments.length > 0 ? (
                        mockResume.accomplishments.map((a, i) => (
                            <div key={i} className="mb-2 flex items-start justify-between gap-2">
                                <span className="break-words flex-1">{a}</span>
                                <FaEdit className="text-gray-400 cursor-pointer hover:text-[#00A55F] flex-shrink-0" title="Edit" />
                            </div>
                        ))
                    ) : (
                        <AddLink label="Add accomplishment/ additional detail" />
                    )}
                </Section>
            </div>
        </div>
    );
};

// Section wrapper for consistent styling - Responsive padding
function Section({ title, children }) {
    return (
        <section className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">{title}</h3>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">{children}</div>
        </section>
    );
}

// Add link component - Responsive touch target
function AddLink({ label }) {
    return (
        <button className="flex items-center gap-1 text-[#00A55F] hover:text-[#008c4f] text-xs font-medium p-2 rounded hover:bg-green-50 transition">
            <FaPlus /> {label}
        </button>
    );
}

export default CandidateResume; 