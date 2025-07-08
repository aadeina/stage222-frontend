import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { getInternshipDetail, updateInternship, deleteInternship } from '@/services/internshipApi';
import { useAuth } from '@/context/AuthContext';
import PostInternshipJob from './PostInternshipJob';
import RecruiterHeader from '../components/RecruiterHeader';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

const EditOpportunity = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getInternshipDetail(id);
                const data = res.data;

                // Transform data to match PostInternshipJob expectations
                // Responsibilities should be a string
                data.responsibilities = Array.isArray(data.responsibilities)
                    ? data.responsibilities.join('\n')
                    : (typeof data.responsibilities === 'string'
                        ? data.responsibilities
                        : '');

                // Preferences should be an array
                data.preferences = Array.isArray(data.preferences)
                    ? data.preferences
                    : (typeof data.preferences === 'string' && data.preferences.length > 0
                        ? data.preferences.split('\n').filter(p => p.trim())
                        : []);

                // Perks should be an array
                data.perks = Array.isArray(data.perks)
                    ? data.perks
                    : (typeof data.perks === 'string' && data.perks.length > 0
                        ? data.perks.split('\n').filter(p => p.trim())
                        : []);

                // Screening questions should be an array
                data.screening_questions = Array.isArray(data.screening_questions)
                    ? data.screening_questions
                    : [];

                setFormData(data);
            } catch (err) {
                toast.error(t('editOpportunity.failedToFetch'));
                navigate('/recruiter/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleUpdate = () => {
        // The PostInternshipJob component handles the API call internally
        // This function is called on success
        toast.success(t('editOpportunity.opportunityUpdated'));
        navigate('/recruiter/dashboard');
    };

    const handleDelete = async () => {
        if (!window.confirm(t('editOpportunity.confirmDelete'))) return;
        try {
            await deleteInternship(id);
            toast.success(t('editOpportunity.opportunityDeleted'));
            navigate('/recruiter/dashboard');
        } catch (err) {
            toast.error(t('editOpportunity.failedToDelete'));
        }
    };

    if (loading) return <div className="p-8 text-center">{t('editOpportunity.loading')}</div>;
    if (!formData) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <RecruiterHeader />
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back to Dashboard */}
                <button
                    onClick={() => navigate('/recruiter/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                    <FaArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('editOpportunity.backToDashboard')}</span>
                </button>
                {/* Card Container */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">{t('editOpportunity.title')}</h2>
                    {/* Professional form reuse */}
                    <PostInternshipJob
                        initialFormData={formData}
                        onSuccess={handleUpdate}
                        isEdit={true}
                        internshipId={id}
                    />
                    {/* Optional: Small Delete button at the bottom */}
                    <div className="flex justify-end mt-8">
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
                        >
                            <FaTrash className="w-4 h-4" />
                            {t('editOpportunity.deleteOpportunity')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditOpportunity; 