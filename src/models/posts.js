const mongoose = require("mongoose");


const schema = new mongoose.Schema({
    profile: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    like: { type: Number, default: 0 },
    likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    tag: {
        type: [String],
        required: true,
        index: true
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
    isPremium: { type: Boolean, default: false }
}, { timestamps: true });


const model = mongoose.model("posts", schema);


module.exports = model;