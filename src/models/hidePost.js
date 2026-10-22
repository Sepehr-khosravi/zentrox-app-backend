const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: { type: String, required: true , unique  : true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    like: { type: Number, default: 0 },
    likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    tag: {
        type: [String],
        required: true,
        index: true
    },
    comments: [{ type: String }],
}, { timestamps: true });


const model = mongoose.model("hidePost", schema);


module.exports = model;