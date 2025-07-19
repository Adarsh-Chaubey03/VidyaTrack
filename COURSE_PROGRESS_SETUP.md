# Course Progress System Documentation

## Overview

The Course Progress system allows tracking student progress through courses, including lecture completion, watch time, and overall course progress. It provides both backend API endpoints and frontend components for seamless integration.

## Backend Components

### 1. CourseProgress Model (`server/models/CourseProgress.js`)

The CourseProgress model tracks:
- **User Progress**: Individual progress for each user-course combination
- **Lecture Progress**: Completion status and watch time for each lecture
- **Chapter Progress**: Aggregated progress for each chapter
- **Course Progress**: Overall course completion percentage and statistics

#### Schema Structure:
```javascript
{
  userId: String,                    // Reference to User
  courseId: ObjectId,               // Reference to Course
  progressPercentage: Number,       // 0-100%
  totalLectures: Number,            // Total lectures in course
  completedLectures: Number,        // Completed lectures count
  chapterProgress: [                // Array of chapter progress
    {
      chapterId: String,
      completedLectures: [          // Array of lecture progress
        {
          lectureId: String,
          isCompleted: Boolean,
          completedAt: Date,
          watchTime: Number,        // in seconds
          lastWatchedAt: Date
        }
      ],
      isCompleted: Boolean,
      completedAt: Date
    }
  ],
  lastAccessedAt: Date,
  startedAt: Date,
  completedAt: Date,
  isCompleted: Boolean,
  totalWatchTime: Number            // in seconds
}
```

### 2. CourseProgress Controller (`server/controllers/courseProgressController.js`)

#### Available Functions:
- `getCourseProgress(userId, courseId)` - Get or create progress for a course
- `updateLectureProgress(userId, courseId, chapterId, lectureId, isCompleted)` - Mark lecture as completed/incomplete
- `updateWatchTime(userId, courseId, chapterId, lectureId, watchTime)` - Update lecture watch time
- `getUserProgress(userId)` - Get all progress for a user
- `resetCourseProgress(userId, courseId)` - Reset all progress for a course
- `getCourseAnalytics(courseId)` - Get analytics for educators

### 3. CourseProgress Routes (`server/routes/courseProgressRoutes.js`)

#### API Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/:userId/:courseId` | Get course progress |
| PUT | `/api/progress/:userId/:courseId/:chapterId/:lectureId` | Update lecture progress |
| PATCH | `/api/progress/:userId/:courseId/:chapterId/:lectureId/watchtime` | Update watch time |
| GET | `/api/progress/user/:userId` | Get all user progress |
| DELETE | `/api/progress/:userId/:courseId` | Reset course progress |
| GET | `/api/progress/analytics/:courseId` | Get course analytics |

## Frontend Components

### 1. CourseProgress Component (`client/src/components/student/CourseProgress.jsx`)

A complete UI component that displays:
- Overall progress bar
- Chapter-wise progress
- Lecture completion checkboxes
- Watch time tracking
- Course completion status

#### Usage:
```jsx
import CourseProgress from '../components/student/CourseProgress';

<CourseProgress 
  courseId="course_id_here" 
  onProgressUpdate={(progress) => console.log(progress)} 
/>
```

### 2. useCourseProgress Hook (`client/src/hooks/useCourseProgress.js`)

A custom React hook that provides:
- Progress state management
- API calls for progress operations
- Loading and error states
- Automatic progress fetching

#### Usage:
```jsx
import { useCourseProgress } from '../hooks/useCourseProgress';

const { 
  progress, 
  loading, 
  error, 
  updateLectureProgress, 
  updateWatchTime 
} = useCourseProgress(courseId);
```

## Integration Examples

### 1. Video Player Integration

```jsx
import { useCourseProgress } from '../hooks/useCourseProgress';

function VideoPlayer({ courseId, chapterId, lectureId }) {
  const { updateLectureProgress, updateWatchTime } = useCourseProgress(courseId);
  
  const handleVideoEnd = async () => {
    // Mark lecture as completed when video ends
    await updateLectureProgress(chapterId, lectureId, true);
  };
  
  const handleTimeUpdate = async (currentTime) => {
    // Update watch time periodically
    await updateWatchTime(chapterId, lectureId, currentTime);
  };
  
  return (
    <ReactPlayer
      url={lectureUrl}
      onEnded={handleVideoEnd}
      onProgress={handleTimeUpdate}
      // ... other props
    />
  );
}
```

### 2. Progress Display

```jsx
import CourseProgress from '../components/student/CourseProgress';

function CoursePage({ courseId }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {/* Video player and course content */}
      </div>
      <div className="lg:col-span-1">
        <CourseProgress courseId={courseId} />
      </div>
    </div>
  );
}
```

### 3. Dashboard Integration

```jsx
import { useCourseProgress } from '../hooks/useCourseProgress';

function Dashboard() {
  const { getUserAllProgress } = useCourseProgress();
  
  const loadUserProgress = async () => {
    const result = await getUserAllProgress();
    if (result.success) {
      // Display progress cards
      console.log(result.progress);
    }
  };
  
  return (
    <div>
      <button onClick={loadUserProgress}>Load My Progress</button>
      {/* Display progress cards */}
    </div>
  );
}
```

## API Request Examples

### 1. Get Course Progress
```javascript
const response = await fetch(`/api/progress/${userId}/${courseId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 2. Update Lecture Progress
```javascript
const response = await fetch(`/api/progress/${userId}/${courseId}/${chapterId}/${lectureId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ isCompleted: true })
});
```

### 3. Update Watch Time
```javascript
const response = await fetch(`/api/progress/${userId}/${courseId}/${chapterId}/${lectureId}/watchtime`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 
    watchTime: 300, // 5 minutes in seconds
    totalWatchTime: 1800 // 30 minutes total
  })
});
```

## Features

### ✅ Implemented Features:
- **Progress Tracking**: Track completion status for each lecture
- **Watch Time**: Monitor time spent on each lecture
- **Chapter Progress**: Aggregate progress at chapter level
- **Course Analytics**: Overall course completion statistics
- **Auto-calculation**: Automatic progress percentage calculation
- **Unique Constraints**: One progress record per user per course
- **Real-time Updates**: Immediate UI updates on progress changes
- **Error Handling**: Comprehensive error handling and loading states
- **Authentication**: Protected routes with Clerk authentication

### 🔄 Automatic Features:
- Progress percentage calculation (0-100%)
- Chapter completion detection
- Course completion detection
- Last accessed timestamp updates
- Total watch time aggregation

### 📊 Analytics Available:
- Total enrollments per course
- Completion rates
- Average progress percentages
- Average watch times
- Recent activity tracking

## Security

- All routes are protected with authentication middleware
- User can only access their own progress data
- Educators can access analytics for their courses
- Input validation and sanitization
- Error handling prevents data exposure

## Performance

- Efficient database queries with proper indexing
- Compound index on (userId, courseId) for fast lookups
- Minimal data transfer with selective field population
- Caching-friendly API responses
- Optimized frontend state management

## Future Enhancements

- **Offline Progress**: Cache progress locally for offline tracking
- **Progress Sync**: Sync progress across devices
- **Advanced Analytics**: Detailed learning analytics and insights
- **Progress Sharing**: Share progress with educators or peers
- **Achievement System**: Badges and certificates for milestones
- **Learning Paths**: Personalized learning recommendations
- **Progress Export**: Export progress data for external use

## Troubleshooting

### Common Issues:

1. **Progress not updating**: Check authentication token and user permissions
2. **Duplicate progress records**: Ensure unique constraint is working properly
3. **Watch time not accurate**: Verify video player integration and time tracking
4. **Progress percentage incorrect**: Check total lectures calculation

### Debug Steps:

1. Check browser console for API errors
2. Verify authentication token is valid
3. Confirm course and user IDs are correct
4. Check database for progress record existence
5. Validate API request/response format

## Support

For issues or questions about the Course Progress system:
1. Check this documentation first
2. Review API response error messages
3. Check server logs for backend errors
4. Verify authentication and permissions
5. Test with simple API calls first 