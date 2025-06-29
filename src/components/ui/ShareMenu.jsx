import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
    FaTimes,
    FaFacebook,
    FaWhatsapp,
    FaLink,
    FaShare,
    FaTwitter,
    FaLinkedin,
    FaTelegram
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ShareMenu = ({ isOpen, onClose, url, title, description }) => {
    const [copied, setCopied] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const shareData = {
        url: url || window.location.href,
        title: title || 'Check out this internship on Stage222',
        description: description || 'Amazing internship opportunity waiting for you!'
    };

    const shareOptions = [
        {
            name: 'Facebook',
            icon: FaFacebook,
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => {
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
                window.open(facebookUrl, '_blank', 'width=600,height=400');
            }
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            color: 'bg-green-600 hover:bg-green-700',
            action: () => {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.title} - ${shareData.url}`)}`;
                window.open(whatsappUrl, '_blank');
            }
        },
        {
            name: 'Twitter',
            icon: FaTwitter,
            color: 'bg-sky-500 hover:bg-sky-600',
            action: () => {
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`;
                window.open(twitterUrl, '_blank', 'width=600,height=400');
            }
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedin,
            color: 'bg-blue-700 hover:bg-blue-800',
            action: () => {
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`;
                window.open(linkedinUrl, '_blank', 'width=600,height=400');
            }
        },
        {
            name: 'Telegram',
            icon: FaTelegram,
            color: 'bg-blue-500 hover:bg-blue-600',
            action: () => {
                const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`;
                window.open(telegramUrl, '_blank');
            }
        },
        {
            name: 'Copy Link',
            icon: FaLink,
            color: 'bg-gray-600 hover:bg-gray-700',
            action: async () => {
                try {
                    await navigator.clipboard.writeText(shareData.url);
                    setCopied(true);
                    toast.success('Link copied to clipboard!');
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    toast.error('Failed to copy link');
                }
            }
        }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    ref={menuRef}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FaShare className="text-[#00A55F]" />
                            Share Internship
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaTimes className="text-gray-500" />
                        </button>
                    </div>

                    {/* Share Options */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {shareOptions.map((option, index) => (
                            <motion.button
                                key={option.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={option.action}
                                className={`
                                    flex flex-col items-center gap-2 p-4 rounded-xl text-white font-medium
                                    transition-all duration-200 transform hover:scale-105
                                    ${option.color}
                                    ${copied && option.name === 'Copy Link' ? 'bg-green-600' : ''}
                                `}
                            >
                                <option.icon className="text-xl" />
                                <span className="text-sm">
                                    {copied && option.name === 'Copy Link' ? 'Copied!' : option.name}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    {/* URL Preview */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Share this link:</p>
                        <p className="text-sm text-gray-800 break-all font-mono">
                            {shareData.url}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ShareMenu; 