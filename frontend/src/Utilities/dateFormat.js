export const uploadedTime = (date) => {
    const now = new Date();
    const updatedTime = new Date(date);

    const diffInSec = Math.floor((now - updatedTime) / 1000);
    const diffInMin = Math.floor(diffInSec / 60);
    const diffInHour = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHour / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) {
        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    }
    else if (diffInMonths > 0) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else if (diffInWeeks > 0) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }
    else if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    else if (diffInHour > 0) {
        return `${diffInHour} hour${diffInHour > 1 ? 's' : ''} ago`;
    }
    else if (diffInMin > 0) {
        return `${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
    }
    else {
        return `${diffInSec} second${diffInSec>1?'s':''} ago`;
    }
};