const stringColor = (str: string, s = 70, l = 50) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = hash % 360
  return `hsl(${h},${s}%,${l}%)`
}

const avatarImg = ({ firstName, lastName }: { firstName: string; lastName: string }) => {
  const username = `${firstName} ${lastName}`.trim()
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()

  const right = stringColor(firstName)
  const left = stringColor(username)

  // generate base64 image gradient
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const gradient = ctx.createLinearGradient(0, 0, 256, 256)

  gradient.addColorStop(0, left)
  gradient.addColorStop(1, right)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  ctx.fillStyle = 'white'
  ctx.font = '128px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, 128, 132)

  return canvas.toDataURL()
}

export default avatarImg
