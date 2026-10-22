const { userModel, postModel } = require("../../models");

class Search {
    searchPosts = async (req, res) => {
        try {
            const { search } = req.body;
            if (!search || search.trim().length === 0) {
                return res.status(200).json({
                    message: "search query is required.",
                    data: [],
                    error: true ,
                    status : 400
                });
            }

            const words = search.trim().split(/\s+/);
            const searchRegexList = words.map(word => new RegExp(word, "i"));

            const matchQuery = {
                $or: [
                    ...searchRegexList.map(r => ({ title: { $regex: r } })),
                    ...searchRegexList.map(r => ({ description: { $regex: r } }))
                ]
            };

            const findPosts = await postModel.aggregate([{ $match: matchQuery }]);

            if (!findPosts || findPosts.length === 0) {
                return res.status(200).json({
                    message: "No posts found.",
                    data: [],
                    error: true ,
                    status : 404
                });
            }

            res.status(200).json({
                message: "Successfully fetched posts.",
                data: findPosts,
                error: false
            });
        } catch (e) {
            console.log("error in searchPost api:", e);
            res.status(500).json({
                message: "Internal server error.",
                data: null,
                error: true
            });
        }
    };

    searchUsers = async (req, res) => {
        try {
            const { search } = req.body;
            if (!search || search.trim().length === 0) {
                return res.status(200).json({
                    message: "Search field is required.",
                    data: [],
                    error: true ,
                    status : 400
                });
            }

            const words = search.trim().split(/\s+/);
            const searchRegexList = words.map(word => new RegExp(word, "i"));

            const matchQuery = {
                $or: [
                    ...searchRegexList.map(r => ({ name: { $regex: r } })),
                    ...searchRegexList.map(r => ({ email: { $regex: r } })),
                    ...searchRegexList.map(r => ({ bio: { $regex: r } }))
                ]
            };

            const findUsers = (await userModel.aggregate([
                { $match: matchQuery } ,
                {
                    $project : {
                        name : 1 , 
                        email : 1 ,
                        _id : 1
                    }
                }
            ]));

            if (!findUsers || findUsers.length === 0) {
                return res.status(200).json({
                    message: "No users found.",
                    data: [],
                    error: true ,
                    status : 404
                });
            }

            const result = await Promise.all(findUsers.map(async(item)=>{
                const self = await userModel.findById(req.user);
                const isFriend = self.friends.some(friend =>{
                    return friend.toString() == item._id.toString();
                });
                return ({
                    name : item?.name ,
                    email : item?.email , 
                    _id : item?._id ,
                    isFriend : isFriend ? true : false
                });
            }))

            res.status(200).json({
                message: "Users found successfully.",
                data: result,
                error: false 
            });
        } catch (e) {
            console.log("error in searchUsers api:", e);
            res.status(500).json({
                message: "Internal server error.",
                data: null,
                error: true
            });
        }
    };
    searchThePostsJustTitle = async(req , res)=>{
        try{
            const {titleSearch} = req.body;
            if(!titleSearch) return res.status(200).json({message : "posts not found." , data : [] , error : true});
            const findPosts = await postModel.find({titleSearch});
            if(!findPosts || findPosts.length === 0) return res.status(200).json({message : "posts not found" , error : true , data : []});
            res.status(200).json({message : "ok" , data : findPosts ,error : false});
        }
        catch(e){
            console.log("error in SearchThePostsJustTitle : ", e);
            res.status(500).json({message : "Internal server error ." , data : null , error : true});
        }
    }
}

module.exports = new Search();
