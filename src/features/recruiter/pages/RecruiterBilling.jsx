import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaArrowLeft,
    FaCreditCard,
    FaReceipt,
    FaDownload,
    FaEye,
    FaCheckCircle,
    FaTimes,
    FaCrown,
    FaStar,
    FaCalendarAlt,
    FaDollarSign,
    FaShieldAlt,
    FaRocket,
    FaUsers,
    FaChartLine,
    FaBell,
    FaPlus,
    FaMinus,
    FaClock,
    FaCreditCard as FaCardIcon
} from 'react-icons/fa';
import { MdPayment, MdAccountBalance, MdSecurity } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '@/services/api';

const RecruiterBilling = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [billingData, setBillingData] = useState({
        currentPlan: {
            name: 'Professional',
            price: 49,
            period: 'month',
            features: [
                'Up to 50 job postings',
                'Advanced analytics',
                'Priority support',
                'Custom branding',
                'Email notifications'
            ],
            status: 'active',
            nextBilling: '2024-02-15'
        },
        paymentMethods: [
            {
                id: 1,
                type: 'card',
                last4: '4242',
                brand: 'Visa',
                expiry: '12/25',
                isDefault: true
            }
        ],
        invoices: [
            {
                id: 'INV-001',
                date: '2024-01-15',
                amount: 49.00,
                status: 'paid',
                description: 'Professional Plan - January 2024'
            },
            {
                id: 'INV-002',
                date: '2023-12-15',
                amount: 49.00,
                status: 'paid',
                description: 'Professional Plan - December 2023'
            },
            {
                id: 'INV-003',
                date: '2023-11-15',
                amount: 49.00,
                status: 'paid',
                description: 'Professional Plan - November 2023'
            }
        ],
        usage: {
            jobPostings: 12,
            maxJobPostings: 50,
            views: 1247,
            applications: 89
        }
    });

    const plans = [
        {
            name: 'Starter',
            price: 19,
            period: 'month',
            features: [
                'Up to 10 job postings',
                'Basic analytics',
                'Email support',
                'Standard templates'
            ],
            popular: false,
            current: false
        },
        {
            name: 'Professional',
            price: 49,
            period: 'month',
            features: [
                'Up to 50 job postings',
                'Advanced analytics',
                'Priority support',
                'Custom branding',
                'Email notifications',
                'API access'
            ],
            popular: true,
            current: true
        },
        {
            name: 'Enterprise',
            price: 99,
            period: 'month',
            features: [
                'Unlimited job postings',
                'Advanced analytics',
                '24/7 phone support',
                'Custom branding',
                'White-label options',
                'API access',
                'Dedicated account manager'
            ],
            popular: false,
            current: false
        }
    ];

    const handlePlanChange = async (planName) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`Successfully upgraded to ${planName} plan!`);
            // Update current plan in state
            setBillingData(prev => ({
                ...prev,
                currentPlan: plans.find(p => p.name === planName)
            }));
        } catch (error) {
            toast.error('Failed to change plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = (invoiceId) => {
        toast.success(`Downloading invoice ${invoiceId}...`);
        // Simulate download
    };

    const viewInvoice = (invoiceId) => {
        toast.success(`Opening invoice ${invoiceId}...`);
        // Simulate opening invoice
    };

    const addPaymentMethod = () => {
        toast.success('Redirecting to add payment method...');
        // Simulate redirect to payment method form
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'failed': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <FaCheckCircle className="h-4 w-4" />;
            case 'pending': return <FaClock className="h-4 w-4" />;
            case 'failed': return <FaTimes className="h-4 w-4" />;
            default: return <FaClock className="h-4 w-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="h-5 w-5" />
                        </motion.button>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
                            <p className="text-gray-600">Manage your subscription, payments, and billing information</p>
                        </div>

                        <div className="flex items-center gap-3 bg-[#00A55F]/10 px-4 py-2 rounded-lg">
                            <FaCreditCard className="text-[#00A55F] text-xl" />
                            <div>
                                <p className="text-sm font-medium text-[#00A55F]">Professional Plan</p>
                                <p className="text-xs text-[#00A55F]/70">Active Subscription</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="mb-8">
                    <nav className="flex space-x-8 border-b border-gray-200">
                        {[
                            { id: 'overview', label: 'Overview', icon: FaChartLine },
                            { id: 'subscription', label: 'Subscription', icon: FaCrown },
                            { id: 'payment-methods', label: 'Payment Methods', icon: FaCreditCard },
                            { id: 'invoices', label: 'Invoices', icon: FaReceipt }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-[#00A55F] text-[#00A55F]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Current Plan Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
                                        <p className="text-gray-600">Your active subscription details</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#00A55F]/10 px-3 py-1 rounded-full">
                                        <FaCheckCircle className="text-[#00A55F] h-4 w-4" />
                                        <span className="text-sm font-medium text-[#00A55F]">Active</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-[#00A55F]/5 to-emerald-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <FaCrown className="text-[#00A55F] text-xl" />
                                            <h3 className="font-semibold text-gray-900">{billingData.currentPlan.name}</h3>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            ${billingData.currentPlan.price}
                                            <span className="text-sm font-normal text-gray-500">/{billingData.currentPlan.period}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Next billing: {formatDate(billingData.currentPlan.nextBilling)}</p>
                                    </div>

                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <FaUsers className="text-blue-600 text-xl" />
                                            <h3 className="font-semibold text-gray-900">Job Postings</h3>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {billingData.usage.jobPostings}
                                            <span className="text-sm font-normal text-gray-500">/{billingData.usage.maxJobPostings}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(billingData.usage.jobPostings / billingData.usage.maxJobPostings) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <FaChartLine className="text-purple-600 text-xl" />
                                            <h3 className="font-semibold text-gray-900">Performance</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Total Views:</span>
                                                <span className="font-medium">{billingData.usage.views.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Applications:</span>
                                                <span className="font-medium">{billingData.usage.applications}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab('subscription')}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#00A55F]/10 rounded-lg">
                                            <FaCrown className="text-[#00A55F] h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-medium text-gray-900">Upgrade Plan</h3>
                                            <p className="text-sm text-gray-600">Get more features</p>
                                        </div>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab('payment-methods')}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FaCreditCard className="text-blue-600 h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-medium text-gray-900">Payment Methods</h3>
                                            <p className="text-sm text-gray-600">Manage cards</p>
                                        </div>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab('invoices')}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <FaReceipt className="text-purple-600 h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-medium text-gray-900">View Invoices</h3>
                                            <p className="text-sm text-gray-600">Download receipts</p>
                                        </div>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/recruiter/support')}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <FaBell className="text-orange-600 h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-medium text-gray-900">Get Support</h3>
                                            <p className="text-sm text-gray-600">Contact us</p>
                                        </div>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Subscription Tab */}
                    {activeTab === 'subscription' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
                                <p className="text-gray-600">Select the perfect plan for your recruitment needs</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {plans.map((plan, index) => (
                                    <motion.div
                                        key={plan.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative bg-white rounded-2xl shadow-sm border-2 p-6 ${plan.popular ? 'border-[#00A55F] shadow-lg' : 'border-gray-200'
                                            } ${plan.current ? 'ring-2 ring-[#00A55F]/20' : ''}`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-[#00A55F] text-white px-4 py-1 rounded-full text-sm font-medium">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        {plan.current && (
                                            <div className="absolute -top-3 right-4">
                                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Current Plan
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                                ${plan.price}
                                                <span className="text-lg font-normal text-gray-500">/{plan.period}</span>
                                            </div>
                                            <p className="text-gray-600">Billed monthly</p>
                                        </div>

                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-3">
                                                    <FaCheckCircle className="text-[#00A55F] mt-1 flex-shrink-0" />
                                                    <span className="text-gray-700">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={plan.current || loading}
                                            onClick={() => handlePlanChange(plan.name)}
                                            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.current
                                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                    : plan.popular
                                                        ? 'bg-[#00A55F] text-white hover:bg-[#008c4f] shadow-lg'
                                                        : 'bg-gray-900 text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Processing...</span>
                                                </div>
                                            ) : plan.current ? (
                                                'Current Plan'
                                            ) : (
                                                `Choose ${plan.name}`
                                            )}
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Payment Methods Tab */}
                    {activeTab === 'payment-methods' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                                    <p className="text-gray-600">Manage your payment options</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={addPaymentMethod}
                                    className="bg-[#00A55F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#008c4f] transition-colors flex items-center gap-2"
                                >
                                    <FaPlus className="h-4 w-4" />
                                    Add Payment Method
                                </motion.button>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                {billingData.paymentMethods.map((method) => (
                                    <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gray-100 rounded-lg">
                                                <FaCardIcon className="text-gray-600 h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {method.brand} •••• {method.last4}
                                                </h3>
                                                <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {method.isDefault && (
                                                <span className="bg-[#00A55F]/10 text-[#00A55F] px-2 py-1 rounded-full text-xs font-medium">
                                                    Default
                                                </span>
                                            )}
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <FaEye className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Invoices Tab */}
                    {activeTab === 'invoices' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>
                                    <p className="text-gray-600">View and download your billing history</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Invoice
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {billingData.invoices.map((invoice) => (
                                                <tr key={invoice.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {invoice.id}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {invoice.description}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(invoice.date)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {formatCurrency(invoice.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                                            {getStatusIcon(invoice.status)}
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => viewInvoice(invoice.id)}
                                                                className="text-[#00A55F] hover:text-[#008c4f] transition-colors"
                                                            >
                                                                <FaEye className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => downloadInvoice(invoice.id)}
                                                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                                            >
                                                                <FaDownload className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecruiterBilling; 