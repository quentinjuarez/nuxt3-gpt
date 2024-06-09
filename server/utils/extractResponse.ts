const extractResponse = (response: string) => {
  try {
    const json = JSON.parse(response)

    console.log(json)

    if ('json' in json) {
      return json.json.response
    }

    if ('message' in json) {
      return json.message
    }

    throw new Error('Invalid response')
  } catch (error) {
    console.error('extractResponse', error)
    return 'Error: Invalid response'
  }
}

export default extractResponse
