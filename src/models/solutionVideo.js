// const mongoose = require('mongoose');
// const {Schema} = mongoose;

// const videoSchema = new Schema({
//     problemid: {
//         type: Schema.Types.ObjectId,
//         ref: 'problem',
//         required: true
//     },
//     userid: {
//     type: Schema.Types.ObjectId,
//     ref: 'user',
//     required: true,
//    },
//    cloudinaryPublicId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   secureUrl:{  // for https
//     type: String,
//     required: true
//   },
//   thumbnailUrl: {
//     type: String
//   },
//   duration: {
//     type: Number,
//     required: true
//   },
// },{
//     timestamps:true
// });



// const SolutionVideo = mongoose.model("solutionVideo",videoSchema);

// module.exports = SolutionVideo;
const mongoose = require('mongoose');
const {Schema} = mongoose;

const videoSchema = new Schema({
    problemid: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    userid: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
   },
   cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true
  },
  secureUrl:{  // for https
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number,
    required: true
  },
},{
    timestamps:true
});

const SolutionVideo = mongoose.model("solutionVideo",videoSchema);

module.exports = SolutionVideo; 