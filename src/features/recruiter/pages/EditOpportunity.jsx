import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getInternshipDetail, updateInternship, deleteInternship } from '@/services/internshipApi';
import { useAuth } from '@/context/AuthContext';
import PostInternshipJob from './PostInternshipJob';

const EditOpportunity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getInternshipDetail(id);
                setFormData(res.data);
            } catch (err) {
                toast.error('Failed to fetch opportunity');
                navigate('/recruiter/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleUpdate = async (updatedData) => {
        setIsSubmitting(true);
        try {
            await updateInternship(id, updatedData);
            toast.success('Opportunity updated!');
            navigate('/recruiter/dashboard');
        } catch (err) {
            toast.error('Failed to update opportunity');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
        try {
            await deleteInternship(id);
            toast.success('Opportunity deleted!');
            navigate('/recruiter/dashboard');
        } catch (err) {
            toast.error('Failed to delete opportunity');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!formData) return null;

    // You may want to reuse the form from PostInternshipJob, passing formData and handlers
    // For now, show a simple form as a placeholder
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Edit Opportunity</h2>
            {/* TODO: Replace with reusable form, prefilled with formData */}
            <pre className="bg-gray-100 p-4 rounded mb-4 text-xs overflow-x-auto">{JSON.stringify(formData, null, 2)}</pre>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Delete</button>
            {/* Add form and update logic here */}
            {/* <PostInternshipJob formData={formData} onSubmit={handleUpdate} isEdit /> */}
        </div>
    );
};

export default EditOpportunity; 