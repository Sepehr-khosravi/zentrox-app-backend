const { postModel, userModel, commentModel, savePostModel } = require("../../models/index");

class Posts {
    getAPosts = async (req, res) => {
        try {
            const { postId } = req.body;
            const findThePosts = await postModel.findById(postId.toString()).select("profile name email description userId _id comments likedUsers like createdAt updateAt tag isPremium").sort({ createdAt: -1 });
            if (!findThePosts) {
                return res.status(404).json({ message: "post not found", error: true, data: {} });
            }
            res.status(200).json({ message: "ok", data: findThePosts, error: false });
        }
        catch (e) {
            console.log("Error in the getAPosts api : ", e);
            res.status(500).json({ message: "Internal server GetAPosts api error .", error: true, data: {} });
        }
    }
    upload = async (req, res) => {
        try {
            const user = await userModel.findById(req.user);
            const { description, isPremium } = req.body;
            const check = await postModel.findOne({ description, userId: req.user, isPremium: isPremium });
            if (!check) {
                if (description && user) {
                    const newPost = await postModel.create({ name: user.name, email: user.email, description: description, userId: req.user, isPremium: isPremium });
                    user.posts.push(newPost._id);
                    await user.save();
                    res.status(201).json({ message: "Your post has been uploaded", data: newPost });
                }
                else {
                    res.status(401).json({ message: "invalid data" });
                }
            }
            else {
                res.status(400).json({ message: "You can't upload a duplicate post" });
            }
        }
        catch (e) {
            console.log("error in uploading :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    delete = async (req, res) => {
        try {
            const userId = req.user;
            const user = await userModel.findById(userId);

            const { _id, description } = req.body;
            const post = await postModel.findOne({ _id, description, userId });
            if (!post) {
                res.status(404).json({ message: "Post not found" });
                return;
            }
            user.posts.filter(item => item.toString() !== post._id.toString());
            await user.save();
            await postModel.findByIdAndDelete(post._id);
            res.status(200).json({ message: "Your post has been deleted" });
        }
        catch (e) {
            console.log("error in the deleted :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    like = async (req, res) => {
        try {
            const userId = req.user;
            const { _id } = req.body;
            const post = await postModel.findById(_id).select("likedUsers like");
            if (!post) {
                res.status(404).json({ message: 'Post not found', data: {} });
                return;
            }
            if (post.likedUsers.includes(userId)) {
                if (post.like > 0) {
                    post.like -= 1;
                    const newLikeUsers = post.likedUsers.filter(item => item.toString() !== userId.toString());
                    post.likedUsers = newLikeUsers;
                    res.status(200).json({ message: "You have removed your like from this post.", like: false });
                    await post.save();
                    return;
                }
                return;
            }
            post.like += 1;
            post.likedUsers.push(userId);
            await post.save();
            res.status(200).json({ message: "You have liked this post", like: true });
        }
        catch (e) {
            console.log("error in liking : ", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    openProfile = async (req, res) => {
        try {
            const { email } = req.query;
            const user = await userModel.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ message: "User not found.", data: null, error: true });
            }
            res.status(200).json({ message: "ok", data: { name: user.name, bio: user.bio, email: user.email, posts: user.posts, followers: user.followers, following: user.following, followersList: user.followerUser, followingList: user.followingUser } })
        }
        catch (e) {
            console.log("error is in the openPRofile api : ", e);
            res.status(500).json({ message: "Interval server Error.", data: {}, error: true });
        }
    }
    specialPosts = async (req, res) => {
        try {
            const premiumUsers = await userModel.find({ isPremium: true }).select("_id");
            const premiumIds = premiumUsers.map(users => users._id);

            const posts = await postModel.find({ userId: { $in: premiumIds }, isPremium: true })
                .sort({ like: -1 })
                .limit(20);

            const uniquePostsMap = new Map();

            for (const post of posts) {
                if (!uniquePostsMap.has(post.userId.toString())) {
                    uniquePostsMap.set(post.userId.toString(), post);
                }
                if (uniquePostsMap.size >= 30) break;
            }
            const finalPosts = Array.from(uniquePostsMap.values());
            res.status(200).json({ message: "Premium top posts", data: finalPosts });
        }
        catch (e) {
            console.log("error in sending specialPost from server :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    getComments = async (req, res) => {
        try {
            const { _id } = req.body;
            const post = await postModel.findById(_id);
            if (!post) {
                res.status(404).json({ message: "post not found.", error: true, data: null });
                return;
            }
            const comments = await commentModel.find({ postId: post._id }).sort({ createdAt: -1 }).populate("userId", "name email profile _id");
            if (comments.length > 0) {
                res.status(200).json({ message: "ok", data: comments, error: false });
            }
            else {
                res.status(200).json({ message: "No comments yet.", data: {}, error: false });
            }
        }
        catch (e) {
            console.log("error in sending specialPost from server :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    deleteComments = async (req, res) => {
        try {
            const { _id } = req.body;
            const comment = await commentModel.findById(_id);
            if (!comment) {
                res.status(404).json({ message: "comment not found.", data: null, error: true });
                return;
            }
            if (comment.userId !== req.user) {
                res.status(401).json({ message: "access denied", data: null, error: true });
                return;
            }
            const deleteComment = await commentModel.findOneAndDelete(comment);
            res.status(200).json({ message: 'succesfully to delete comment', data: deleteComment, error: false });
        }
        catch (e) {
            console.log("error in sending specialPost from server :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    uploadComment = async (req, res) => {
        try {
            const { _id, text } = req.body;
            const post = await postModel.findById(_id);
            if (!post) {
                res.status(404).json({ message: "Post not found.", data: null, error: true });
                return;
            }
            const newComments = (await commentModel.create({ userId: req.user, postId: post._id, text: text })).populate("userId", "name email profile _id");
            post.comments.push((await newComments)._id);
            await post.save();
            res.status(200).json({ message: "ok", error: false, data: newComments });
        }
        catch (e) {
            console.log("error in sending uploadComment from server :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    savePost = async (req, res) => {
        try {
            const { postId } = req.body;
            const post = await postModel.findById(postId);
            if (!post) {
                return res.status(401).json({ message: "post not found.", error: true });
            }
            const newPost = {
                postId: postId,
                userId: req.user
            }
            await savePostModel.create(newPost);
            const user = await userModel.findById(req.user).select("savePosts");
            user.savePosts.push(postId);
            await user.save();
            res.status(200).json({ message: 'ok', error: false });
        }
        catch (e) {
            console.log("savePost error : ", e);
            res.status(500).json({ message: "internal server error" });
        }
    }
}

module.exports = new Posts; 