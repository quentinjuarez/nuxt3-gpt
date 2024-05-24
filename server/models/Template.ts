import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplateStep extends Document {
  instruction: string
}

export interface ITemplate extends Document {
  title: string
  steps: ITemplateStep[]
}

const chatSchema: Schema = new mongoose.Schema(
  {
    instruction: {
      type: String,
      required: true
    }
  },
  { timestamps: true, id: true }
)

const templateSchema: Schema = new mongoose.Schema(
  {
    chats: {
      type: [chatSchema],
      required: true
    },
    templateId: {
      type: String,
      required: true
    }
  },
  { timestamps: true, collection: 'templates' }
)

const Template = mongoose.model<ITemplate>('Template', templateSchema)

export default Template
