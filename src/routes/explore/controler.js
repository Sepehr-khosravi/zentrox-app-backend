const { postModel } = require("../../models");
const mongoose = require("mongoose");

class Explore {
    posts = async (req, res) => {
        try {
            const userId = req.user;
            const limit = parseInt(req.query.limit) || 8;
            const lastId = req.query.lastPostId;
            const matchStage = {
                userId: { $ne: new mongoose.Types.ObjectId(userId) }
            }
            if (lastId) {
                matchStage._id = { $lt: new mongoose.Types.ObjectId(lastId) };
            }
            const lengthPosts = await postModel.find();
            if (lengthPosts.length > 30) {
                const posts = await postModel.aggregate([
                    {
                        $match: matchStage
                    },
                    {
                        $addFields: {
                            score: {
                                $add: [
                                    { $multiply: [2, "$like"] },
                                    { $rand: {} }
                                ]
                            }
                        }
                    },
                    {
                        $sort: { _id: -1 , createdAt : 1 }
                    },
                    {
                        $limit: limit
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    {
                        $unwind: "$user"
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            like: 1,
                            createdAt: 1,
                            "user.name": 1,
                            "user.email": 1
                        }
                    }
                ]).sort({createdAt : 1});
                res.status(200).json({
                    message: "Successfully fetched explore posts",
                    data: posts
                });
            }
            else {
                const posts = await postModel.find({ isPremium: false }).select("profile name email title description userId like likedUsers tag comments isPremium _id createdAt updatedAt").sort({createdAt : -1});
                if (!posts.length || !posts) {
                    return res.status(404).json({ message: "posts not found", error: true, data: null });
                }
                res.status(200).json({ message: "succesfully to get every posts ", data: posts, error: false });
            }
        } catch (e) {
            console.log("error in post at explore class :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    };
    filter = async (req, res) => {
        try {
            const { tagFilter } = req.body;
            const posts = await postModel.find({ tag: tagFilter });
            if (!posts) {
                res.status(404).json({ meessage: "Post not found", error: "invalid filter tag" });
                return;
            }
            res.status(200).json({ message: "succesfully to filter posts", data: posts });
        }
        catch (e) {
            console.log("error in filtering data at explore class : ", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new Explore;