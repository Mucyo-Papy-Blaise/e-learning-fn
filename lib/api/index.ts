// index.ts (or api/index.ts)

// ANNOUNCEMENTS — alias conflicting exports
export {
  getCourseAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncementApi,
  markAnnouncementRead
} from './announcements';

export * from './resources';
export * from './progress';
export * from './public';
