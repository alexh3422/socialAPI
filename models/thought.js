const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },

    username: {
        type: String,
        required: true
    },

    reactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reaction'
        }
    ]
});

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

const THOUGHT = mongoose.model('Thought', thoughtSchema);

module.exports = THOUGHT;


