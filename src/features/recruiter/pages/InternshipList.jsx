// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';

// const InternshipList = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [internships, setInternships] = useState([]);

//     useEffect(() => {
//         const loadInternships = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const res = await fetchInternships();
//                 const internshipsData = res.data.results || res.data || [];
//                 console.log('Internships data received:', internshipsData);
//                 console.log('First internship sample:', internshipsData[0]);
//                 setInternships(internshipsData);
//             } catch (err) {
//                 console.error('Error loading internships:', err);
//                 setError('Failed to load internships.');
//                 toast.error('Failed to load internships.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         loadInternships();
//     }, []);

//     return (
//         <div>
//             {/* Render your component content here */}
//         </div>
//     );
// };

// export default InternshipList; 