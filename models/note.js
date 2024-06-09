const mongoose=require('mongoose');


const nodeSchema = mongoose.Schema({
    title: String,
    content: String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
        
    }

});

module.exports = mongoose.model("notes",nodeSchema);