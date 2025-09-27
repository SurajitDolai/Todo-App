const mongoose = require('mongoose');


const loged = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const work = new mongoose.Schema({
  name: String,
  starttime: String,
  endtime: String,
  description: String,
  status:{
    type:Number,
    default:0
  },
  date:{
    type: Date,
    default: Date.now
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const user = mongoose.model("users", loged);
const tasks = mongoose.model("tasks", work);



module.exports = { user, tasks };