const videoResources = require('../utils/videos.json');

const getLevelVideos = async (req, res) => {
    const id = req.user.userId;

    if(!id) return res.status(401).json({message: "Unauthorized user"});

    let {level} = req.query;

    if(!level) return res.status(400).json({message: "Invalid request"})

    level = level.toString().toLowerCase();

    if(!['beginner', 'intermediate', 'advanced'].includes(level)) return res.status(400).json({message: "Level is not valid"});

    try {
        const videosForLevel = videoResources.find(levelVideos => (levelVideos.category === level))?.categoryVids;

        const videoSessions = videosForLevel.map(category => ({
            topic: category.topic,
            sessions: category.sessions.length
        }))

        return res.status(200).json({message: "Success", videoSessions})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"})
    }
}

const getTopicVideos = async (req, res) => {
    const id = req.user.userId;

    if(!id) return res.status(401).json({message: "Unauthorized user"});

    let {level} = req.query;
    let {topic} = req.body;
    
    if(!topic || !level) return res.status(400).json({message: "Invalid request"});

    topic = topic.toString().toLowerCase();
    level = level.toString().toLowerCase();

    if(!['beginner', 'intermediate', 'advanced'].includes(level)) return res.status(400).json({message: "Level is not valid"});

    try {
        const topicVideos = videoResources.find(videos => (
            videos.category.toLowerCase() === level
        ))?.categoryVids.find(category => (
            category.topic.toLowerCase() === topic && category.description && category.sessions
            ))

        return res.status(200).json({message: "Success", topicVideos});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"})
    }
}

module.exports = {getLevelVideos, getTopicVideos}

// Sample endpoint for video completion
// app.post('/api/video-completion', (req, res) => {
//     const { userId, videoId } = req.body;
  
//     // Validate userId and videoId
  
//     // Update user progress in the database (example)
//     // Update the user's progress in your database based on userId and videoId
  
//     // Send a response
//     res.json({ success: true, message: 'Video completion updated successfully' });
// });