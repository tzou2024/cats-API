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
		adoptable: {
			type: Boolean,
			required: true
		}
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Cat', catSchema)
