// Utility function to construct full media URLs
const getMediaUrl = (relativePath) => {
    if (!relativePath) {
        console.log('getMediaUrl: No path provided');
        return null;
    }

    // If it's already a full URL, return as is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        console.log('getMediaUrl: Already full URL:', relativePath);
        return relativePath;
    }

    // Remove leading slash if present
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;

    // Construct full URL using the backend base URL (without /api for media files)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    const baseUrl = apiBaseUrl.replace('/api', ''); // Remove /api for media files
    const fullUrl = `${baseUrl}/${cleanPath}`;

    console.log('getMediaUrl: Constructed URL:', {
        original: relativePath,
        cleanPath,
        baseUrl,
        fullUrl
    });

    return fullUrl;
};

export default getMediaUrl; 