const stringColor = (str: string, s = 70, l = 50) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = hash % 360
  return `hsl(${h},${s}%,${l}%)`
}

const avatarImg = ({
  right,
  left,
  initials
}: {
  right: string
  left: string
  initials?: string
}) => {
  const rightColor = stringColor(right)
  const leftColor = stringColor(left)

  // generate base64 image gradient
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const gradient = ctx.createLinearGradient(0, 0, 256, 256)

  gradient.addColorStop(0, rightColor)
  gradient.addColorStop(1, leftColor)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  if (!initials) return canvas.toDataURL()

  ctx.fillStyle = 'white'
  ctx.font = '128px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, 128, 132)

  return canvas.toDataURL()
}

export default avatarImg
