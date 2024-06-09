import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplateStep extends Document {
  instruction: string
  prompt: string
}

export interface ITemplate extends Document {
  title: string
  steps: ITemplateStep[]
  stepIds: string[]
  published: boolean
  deletedAt: Date
}

const stepSchema: Schema = new mongoose.Schema(
  {
    instruction: {
      type: String,
      required: true
    },
    prompt: {
      type: String,
      required: true
    }
  },
  { timestamps: true, id: true }
)

const templateSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    steps: {
      type: [stepSchema],
      required: true
    },
    stepIds: {
      type: [String],
      required: true
    },
    published: {
      type: Boolean,
      required: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true, collection: 'templates' }
)

const Template = mongoose.model<ITemplate>('Template', templateSchema)

export default Template
