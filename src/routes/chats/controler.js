const { userModel, conversationModel, textMessageModel } = require("../../models/index");
class Chats {

    openConversations = async (req, res) => {
        try {
            const { conversationId } = req.params;
            const check = await conversationModel.findById(conversationId);
            if (!check) {
                return res.status(404).json({ message: "conversation not found." });
            }
            const messages = await textMessageModel
                .find({ conversationId: check._id })
                .sort({ createdAt: -1 }); // مرتب بر اساس زمان

            // گروه‌بندی بر اساس تاریخ
            // const grouped = {};
            // messages.forEach(msg => {
            //     const date = msg.createdAt.toISOString().split("T")[0]; // فقط YYYY-MM-DD
            //     if (!grouped[date]) grouped[date] = [];
            //     grouped[date].push(msg);
            // });

            // res.status(200).json({ message: "ok", data: grouped }); 
            if (!messages.length) {
                return res.status(200).json({ message: "there is not message.", error: false });
            }
            res.status(200).json({ message: "ok", data: messages })
        }
        catch (e) {
            console.log("openConversation error: ", e);
            res.status(500).json({ message: "Interval server error." });
        }
    }

    getConversations = async (req, res) => {
        try {
            const conversations = await conversationModel.find({ users: { $in: req.user } }).lean();
            if (!conversations || !conversations.length) {
                return res.status(200).json({ message: "conversation not found.", error: true });
            }
            const result = await Promise.all(conversations.map(async (item) => {
                if (item.users.length !== 2) return;
                const targetId = item.users.filter(id => id.toString() !== req.user.toString());
                const findUser = await userModel.findById(targetId).select("name onlineAt profile conversationId isOnline _id");
                return ({
                    name: findUser.name,
                    onlineAt: findUser.onlineAt,
                    profile: findUser.profile,
                    userId: findUser._id,
                    isOnline: findUser.isOnline,
                    conversationId: item._id,
                });
            }))
            if (!result) {
                return res.status(404).json({ message: "conversations not found. " });
            }
            res.status(200).json({ message: "ok", data: result });
        }
        catch (e) {
            console.log("getConversations error : ", e);
            res.status(500).json({ message: "Interval server error." })
        }
    }

    acceptFirendRequest = async (req, res) => {
        try {
            const { userId } = req.body;
            const user = await userModel.findById(userId);
            if (!userId || !user) {
                return res.status(404).json({ message: "user not found." });
            }
            const self = await userModel.findById(req.user);
            if (self.friends.includes(userId)) return;
            self.friendRequest.filter(id => id.toString() !== userId.toString());
            await self.save();
            const newConversation = await conversationModel.create({
                users: [req.user, userId]
            });
            self.conversationId.push(newConversation._id);
            await self.save();
            self.friends.push(userId);
            await self.save();
            user.friends.push(req.user);
            await user.save();
            res.status(200).json({ message: "ok" });

        }
        catch (e) {
            console.log("acceptFirendRequest error : ", e);
            res.status(500).json({ message: "Interval server error." });
        }
    }

    addFriend = async (req, res) => {
        try {
            const { userId } = req.body;
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "user not found.", error: true });
            }
            const find = user.friendRequest.filter(id => id.toString() == req.user.toString());
            if (find.length) {
                console.log('you have allready sent the request : ', user.friendRequest);
                return res.status(200).json({ message: "you have allready sent the request" });
            }
            user.friendRequest.push(req.user);
            await user.save();
            res.status(200).json({ message: "ok", error: false });
        }
        catch (e) {
            console.log("addFriend error : ", e);
            res.status(500).json({ message: "Interval server error." });
        }
    }

    getFriendsRequestList = async (req, res) => {
        try {
            const self = await userModel.findById(req.user).select("friendRequest");
            if (!self.friendRequest) {
                return res.status(404).json({ message: "friendRequest not found.", error: true });
            }
            const requestResult = await Promise.all(self.friendRequest.map(async (item) => {
                const user = await userModel.findById(item);
                if (!user) return;
                return ({
                    profile: user.profile,
                    name: user.name,
                    email: user.email,
                    id: user._id
                });
            }));
            res.status(200).json({ message: "ok", data: requestResult, error: false });
        }
        catch (e) {
            console.log("getFirendrequestList error : ", e);
            res.status(500).json({ message: "Interval server error." });
        }
    }
}
module.exports = new Chats;