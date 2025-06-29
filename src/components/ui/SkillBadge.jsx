import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';

const SkillBadge = ({ skill, showLearningLink = true, onClick }) => {
    const learningResources = {
        'Git': 'https://git-scm.com/doc',
        'UI/UX': 'https://www.interaction-design.org/literature/topics/ui-design',
        'React': 'https://react.dev/learn',
        'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        'Python': 'https://docs.python.org/3/tutorial/',
        'Node.js': 'https://nodejs.org/en/learn/',
        'HTML': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        'CSS': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
        'SQL': 'https://www.w3schools.com/sql/',
        'MongoDB': 'https://docs.mongodb.com/',
        'AWS': 'https://aws.amazon.com/getting-started/',
        'Docker': 'https://docs.docker.com/get-started/',
        'Kubernetes': 'https://kubernetes.io/docs/tutorials/',
        'Machine Learning': 'https://www.coursera.org/learn/machine-learning',
        'Data Analysis': 'https://www.datacamp.com/courses/intro-to-python-for-data-science',
        'Marketing': 'https://www.coursera.org/specializations/digital-marketing',
        'Content Writing': 'https://www.coursera.org/courses?query=content%20writing',
        'Graphic Design': 'https://www.coursera.org/courses?query=graphic%20design',
        'Video Editing': 'https://www.coursera.org/courses?query=video%20editing',
        'Social Media': 'https://www.coursera.org/courses?query=social%20media%20marketing'
    };

    const hasLearningResource = learningResources[skill] && showLearningLink;

    const handleClick = () => {
        if (onClick) {
            onClick(skill);
        } else if (hasLearningResource) {
            window.open(learningResources[skill], '_blank');
        }
    };

    return (
        <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium 
                border transition-all duration-200 cursor-pointer
                ${hasLearningResource
                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
            `}
        >
            {skill}
            {hasLearningResource && (
                <FaExternalLinkAlt className="text-xs opacity-70" />
            )}
        </motion.span>
    );
};

export default SkillBadge; 