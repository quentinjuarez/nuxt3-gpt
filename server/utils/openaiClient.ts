import OpenAI from 'openai'

const openaiClient = () => {
  const config = useRuntimeConfig()

  return new OpenAI({
    apiKey: config.openaiApiKey
  })
}

export default openaiClient
