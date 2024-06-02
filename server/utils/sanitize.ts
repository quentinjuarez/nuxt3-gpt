import DOMPurify from 'isomorphic-dompurify'

const sanitize = (string: string) => {
  return DOMPurify.sanitize(string, {
    ALLOWED_TAGS: []
  })
}

export default sanitize
