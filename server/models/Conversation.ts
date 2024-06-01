import mongoose, { Document, Schema } from 'mongoose'

export interface IChat extends Document {
  message: string
  senderId: string
  stepId: string
}

export interface IConversation extends Document {
  chats: IChat[]
  templateId: string
  userId: string
  title: string
  deletedAt: Date
}

const chatSchema: Schema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    senderId: {
      type: String,
      required: true
    },
    stepId: {
      type: String,
      required: true
    }
  },
  { timestamps: true, id: true }
)

const conversationSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    chats: {
      type: [chatSchema],
      required: true
    },
    templateId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true, collection: 'conversions' }
)

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema)

export default Conversation
