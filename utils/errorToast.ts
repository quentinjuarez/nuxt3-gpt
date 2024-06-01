const errorToast = (error: FetchError | any) => {
  try {
    const toast = useToast()

    const id = String(Math.floor(Math.random() * 1000))

    toast.add({
      id,
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
