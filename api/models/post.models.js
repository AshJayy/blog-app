import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: 'https://www.salesforce.com/ca/blog/wp-content/uploads/sites/12/2023/10/anatomy-of-a-blog-post-deconstructed-open-graph.jpg',
    },
    category: {
        type: String,
        default: 'uncatagorized'
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    }
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);

export default Post;