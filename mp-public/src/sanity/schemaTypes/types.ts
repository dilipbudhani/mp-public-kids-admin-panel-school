export const newsType = {
    name: 'news',
    title: 'News & Announcements',
    type: 'document',
    fields: [
        { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
        { name: 'date', title: 'Date', type: 'date' },
        { name: 'image', title: 'Main Image', type: 'image', options: { hotspot: true } },
        { name: 'category', title: 'Category', type: 'string', options: { list: ['Academic', 'Sports', 'Event', 'Announcement'] } },
        { name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] },
    ],
};

export const facultyType = {
    name: 'faculty',
    title: 'Faculty',
    type: 'document',
    fields: [
        { name: 'name', title: 'Full Name', type: 'string' },
        { name: 'role', title: 'Designation', type: 'string' },
        { name: 'qualification', title: 'Qualification', type: 'string' },
        { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
        { name: 'order', title: 'Display Order', type: 'number' },
    ],
};

export const galleryType = {
    name: 'gallery',
    title: 'Gallery',
    type: 'document',
    fields: [
        { name: 'title', title: 'Event Title', type: 'string' },
        { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
        { name: 'category', title: 'Category', type: 'string', options: { list: ['Campus', 'Events', 'Classroom', 'Sports'] } },
    ],
};
