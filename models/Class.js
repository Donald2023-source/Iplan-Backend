const classSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
});