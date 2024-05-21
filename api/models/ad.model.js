import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg'
    },
    targetURL: {
        type: String,
        required: true,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {timestamps: true});

const Ad = mongoose.model('Ad', adSchema);

export default Ad;