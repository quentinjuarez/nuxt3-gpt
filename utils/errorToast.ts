import { v4 } from 'uuid'

const errorToast = (error: FetchError | any) => {
  try {
    const toast = useToast()

    toast.add({
      id: v4(),
      title: error.statusMessage || 'Error',
      description: error.data.message || error.message || 'An error occurred',
      timeout: 5000,
      color: 'red'
    })
  } catch (error) {
    console.error(error)
  }
}

export default errorToast
