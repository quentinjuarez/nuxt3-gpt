import { v4 } from 'uuid'

const successToast = (description: string) => {
  try {
    const toast = useToast()

    toast.add({
      id: v4(),
      title: 'Success',
      description,
      timeout: 5000,
      color: 'emerald'
    })
  } catch (error) {
    console.error(error)
  }
}

export default successToast
