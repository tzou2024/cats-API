const mongoose = require('mongoose')

const catSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Cat', catSchema)
