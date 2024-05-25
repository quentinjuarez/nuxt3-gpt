const resolveId = <T>(payload: T) => {
  // @ts-ignore
  const object = payload.toObject()
  // @ts-ignore
  object.id = object._id

  // @ts-ignore
  delete object._id

  return object
}

const resolveIds = <T>(payloads: T[]) => {
  return payloads.map(resolveId)
}

export default resolveIds
