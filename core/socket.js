const jwt = require("jsonwebtoken");
const config = require("config");
const dotenv = require("dotenv");
dotenv.config();
const { userModel, conversationModel, textMessageModel } = require("../src/models/index");




module.exports = function (io) {
    const onlineUsers = new Map(); // userId -> socketId

    // Middleware احراز هویت
    io.use(async (socket, next) => {
        try {
            const { token } = socket.handshake.auth;
            if (!token) return next(new Error("No token"));

            const jwtKey = process.env.JWT_KEY;
            const decoded = jwt.verify(token, jwtKey);
            const user = await userModel.findById(decoded.userId);
            if (!user) return next(new Error("User not found"));

            socket.userId = user._id;
            next();
        } catch (err) {
            console.log("Auth error:", err);
            next(new Error("Authentication failed"));
        }
    });

    // اتصال سوکت
    io.on("connection", async (socket) => {

        const userId = socket.userId.toString();
        const self = await userModel.findById(userId);
        console.log("✅ User connected:", userId);

        // ثبت در لیست کاربران آنلاین
        onlineUsers.set(userId, socket.id);

        // بروزرسانی زمان آنلاین بودن در دیتابیس
        await userModel.findByIdAndUpdate(self._id, { isOnline: true, onlineAt: Date.now() });

        const friendSocket = self.friends
            .map(id => onlineUsers.get(id.toString()))
            .filter(Boolean);
        friendSocket.forEach(item => {
            io.to(item).emit("friend_online", self._id);
        });


        socket.on("message_seen", async ({ conversationId }) => {
            const conversation = await conversationModel.findById(conversationId);
            if (!conversation) {
                console.log("there is no the same conversation!");
                return;
            }
            const messages = await textMessageModel.find({ conversationId: conversation._id, userId: { $ne: self._id }, isSeen: false });
            if (!messages) {
                return;
            }
            messages.forEach(async (item) => {
                await textMessageModel.findOneAndUpdate({ _id: item._id }, { isSeen: true });
            });
            conversation.users.forEach((id) => {
                if (id === self._id) return;
                const targetSocket = onlineUsers.get(id);
                io.to(targetSocket).emit("friend_message_seen", true);
            })
        });


        // هندل کردن پیام ارسالی
        socket.on("send_message", async ({ message, conversationId }) => {
            try {
                // بررسی کانورسیشن
                const conversation = await conversationModel.findById(conversationId).populate("users");
                if (!conversation) return;

                // ذخیره پیام
                const newMessage = await textMessageModel.create({
                    userId: self._id,
                    message,
                    conversationId,
                    isSeen: false,
                });

                // آپدیت آخرین پیام کانورسیشن
                conversation.lastMessage = message;
                await conversation.save();

                // فرستادن پیام به تمام کاربران دیگر در این کانورسیشن (غیر از فرستنده)
                conversation.users.forEach(user => {
                    const targetId = user._id.toString();
                    if (targetId === userId) return; // خودش پیام نمی‌گیره

                    const targetSocketId = onlineUsers.get(targetId);
                    if (targetSocketId) {
                        io.to(targetSocketId).emit("receive_message", newMessage);
                    }
                });
            } catch (err) {
                console.log("send_message error:", err);
            }
        });

        // قطع ارتباط
        socket.on("disconnect", async () => {
            onlineUsers.delete(userId);
            await userModel.findByIdAndUpdate(self._id, { isOnline: false, onlineAt: Date.now() });
            const friendSocket = self.friends
                .map(id => onlineUsers.get(id.toString()))
                .filter(Boolean);
            friendSocket.forEach(item => {
                io.to(item).emit("friend_offline", self._id);
            })
            console.log("❌ User disconnected:", userId);
        });
    });
};
