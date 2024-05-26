import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplateStep extends Document {
  instruction: string
}

export interface ITemplate extends Document {
  title: string
  steps: ITemplateStep[]
  stepIds: string[]
  draft: boolean
}

const stepSchema: Schema = new mongoose.Schema(
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
    draft: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true, collection: 'templates' }
)

const Template = mongoose.model<ITemplate>('Template', templateSchema)

export default Template
