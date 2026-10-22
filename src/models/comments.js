const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    postId:  { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
    text:    { type: String, required: true, trim: true }
  }, { timestamps: true });   
  


const model = mongoose.model("comments" , schema);

module.exports = model;