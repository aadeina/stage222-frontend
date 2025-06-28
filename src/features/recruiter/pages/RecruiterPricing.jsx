import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegFileAlt, FaUserTie, FaSearch, FaRobot, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import RecruiterHeader from '../components/RecruiterHeader';

const plans = [
    {
        id: 'listing',
        title: 'Post Single Listing',
        description: 'Recommended for hiring 1 role',
        features: [
            { icon: FaUserTie, text: 'Access to top Mauritanian candidates' },
            { icon: FaSearch, text: 'Database access (up to 200 profiles)' },
            { icon: FaRegFileAlt, text: 'Dedicated Account Manager' },
        ],
        price: 'MRU 3000',
        priceNote: '/ listing',
        subNote: "100% refund if you don't hire",
        button: 'Start your free trial',
        buttonType: 'primary',
        highlight: false,
    },
    {
        id: 'month',
        title: 'Unlimited Jobs & Internships – 1 Month',
        description: 'Ideal for hiring more than one role',
        features: [
            { icon: FaRegFileAlt, text: 'Unlimited job & internship posts' },
            { icon: FaSearch, text: 'Access up to 500 profiles' },
            { icon: FaRobot, text: 'AI-powered shortlisting tools' },
            { icon: FaUserTie, text: 'Dedicated Relationship Manager' },
        ],
        price: 'MRU 15,000',
        oldPrice: 'MRU 20,000',
        priceNote: '',
        subNote: '',
        button: 'Buy now',
        buttonType: 'success',
        highlight: true,
        badge: 'Popular',
        discount: '25% off',
    },
    {
        id: 'custom',
        title: 'Custom Plans',
        description: 'Tailored hiring plans for enterprises or NGOs',
        features: [],
        price: '',
        priceNote: '',
        subNote: 'Get in touch with our team for a custom solution',
        button: 'Request a callback',
        buttonType: 'outline',
        highlight: false,
    },
];

const testimonials = [
    {
        name: 'Mohamed Vall',
        position: 'HR Director, MauriTech',
        quote: 'Stage222 helped us hire high-quality talent faster than ever. The process was smooth and the support outstanding.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
        name: 'Aicha Lemine',
        position: 'Co-founder, NouakStart',
        quote: "An ideal hiring platform for Mauritania. We discovered talented candidates we couldn't have reached otherwise.",
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
];


const faqs = [
    {
        q: "Can I get a refund if I don't hire anyone?",
        a: 'Yes! We offer a 100% refund on the Pay Per Listing plan if you do not hire a candidate through Stage222.',
    },
    {
        q: 'How quickly will my job go live?',
        a: 'All listings are reviewed and published within 1 business day, often much faster.',
    },
    {
        q: 'Is there support for NGOs or large enterprises?',
        a: "Absolutely! Contact us for a custom plan tailored to your organization's needs.",
    },
    {
        q: 'How do I contact support?',
        a: "You can call us at +222 45 25 19 73 or email support@stage222.com. We're here to help!",
    },
];


export default function RecruiterPricing() {
    const [faqOpen, setFaqOpen] = useState(null);

    return (
        <div className="min-h-screen bg-white font-sans">
            <RecruiterHeader title="Choose your hiring plan" subtitle="Get guaranteed hiring results with our locally tailored plans" />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Title & Subtitle */}
                <section className="text-center mb-12">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Choose your hiring plan
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600">
                        Get guaranteed hiring results with our locally tailored plans
                    </motion.p>
                </section>

                {/* Pricing Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            whileHover={{ y: -8, scale: 1.03, boxShadow: '0 8px 32px rgba(0,165,95,0.10)' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`relative flex flex-col rounded-2xl shadow-lg bg-white border ${plan.highlight ? 'border-[#00A55F] z-10' : 'border-gray-200'} px-7 py-8 min-h-[420px]`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00A55F] text-white text-xs font-semibold px-4 py-1 rounded-full shadow">{plan.badge}</span>
                            )}
                            {/* Title & Description */}
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                                    {plan.title}
                                    {plan.discount && (
                                        <span className="ml-2 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">{plan.discount}</span>
                                    )}
                                </h2>
                                <p className="text-gray-600 text-sm mb-2">{plan.description}</p>
                            </div>
                            {/* Features */}
                            <ul className="mb-6 space-y-3 flex-1">
                                {plan.features.length > 0 ? plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                                        <span className="text-[#00A55F]">
                                            <f.icon className="h-5 w-5" />
                                        </span>
                                        {f.text}
                                    </li>
                                )) : plan.subNote && (
                                    <li className="text-gray-500 text-sm italic flex items-center gap-2">
                                        <FaCheckCircle className="text-[#00A55F] h-4 w-4" /> {plan.subNote}
                                    </li>
                                )}
                            </ul>
                            {/* Price */}
                            <div className="mb-4">
                                {plan.price && (
                                    <div className="flex items-end gap-2 justify-center">
                                        <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                                        {plan.oldPrice && <span className="text-base text-gray-400 line-through">{plan.oldPrice}</span>}
                                        {plan.priceNote && <span className="text-sm text-gray-500">{plan.priceNote}</span>}
                                    </div>
                                )}
                                {plan.subNote && plan.features.length > 0 && (
                                    <div className="text-xs text-green-700 text-center mt-1">{plan.subNote}</div>
                                )}
                            </div>
                            {/* Button */}
                            <button
                                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 text-base mt-auto
                  ${plan.buttonType === 'primary' ? 'bg-[#00A55F] text-white hover:bg-[#008c4f]' : ''}
                  ${plan.buttonType === 'success' ? 'bg-[#00A55F] text-white hover:bg-[#008c4f]' : ''}
                  ${plan.buttonType === 'outline' ? 'border border-[#00A55F] text-[#00A55F] bg-white hover:bg-[#00A55F] hover:text-white' : ''}
                `}
                            >
                                {plan.button}
                            </button>
                        </motion.div>
                    ))}
                </section>

                {/* Success Stories */}
                <section className="mb-16">
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Our success stories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i }}
                                className="bg-white rounded-xl shadow p-6 flex items-center gap-5 border border-gray-100"
                            >
                                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#00A55F]" />
                                <div>
                                    <p className="text-gray-700 text-base mb-2">"{t.quote}"</p>
                                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                                    <div className="text-xs text-gray-500">{t.position}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Support CTA */}
                <section className="flex justify-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#F8FDFB] border border-[#00A55F] rounded-2xl shadow-md px-8 py-8 max-w-xl w-full text-center"
                    >
                        <div className="text-lg font-semibold text-gray-900 mb-2">Need help choosing a plan?</div>
                        <div className="text-gray-700 mb-4">
                            Call us at <a href="tel:+22245251973" className="text-[#00A55F] font-medium">+222 45 25 19 73</a> or email <a href="mailto:support@stage222.com" className="text-[#00A55F] font-medium">support@stage222.com</a>
                        </div>
                        <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#00A55F] text-white font-semibold hover:bg-[#008c4f] transition-all">
                            <FaPhoneAlt className="h-4 w-4" /> Contact Support
                        </button>
                    </motion.div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-2xl mx-auto mb-10">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h4>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                                <button
                                    className="w-full flex items-center justify-between px-5 py-4 text-left text-gray-900 font-medium focus:outline-none"
                                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                >
                                    <span>{faq.q}</span>
                                    {faqOpen === i ? <FaChevronUp className="h-4 w-4 text-[#00A55F]" /> : <FaChevronDown className="h-4 w-4 text-gray-400" />}
                                </button>
                                <AnimatePresence initial={false}>
                                    {faqOpen === i && (
                                        <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="px-5 pb-4 text-gray-700 text-sm"
                                        >
                                            {faq.a}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
} 