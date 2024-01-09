export const filterOptions = {
        contentType: [
                { value: 'posts', label: 'Posts' },
                { value: 'jobposts', label: 'Job Posts' },
        ],
        sortBy: [
                { value: 'latest', label: 'Latest' },
                { value: 'top', label: 'Top Match' },
        ],
        datePosted: [
                { value: 'past-24h', label: 'Past 24 Hours' },
                { value: 'past-week', label: 'Past Week' },
                { value: 'past-month', label: 'Past Month' },
        ],
        email: [
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
        ],
};
