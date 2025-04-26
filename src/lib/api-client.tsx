import _ from 'lodash'
import axios, { AxiosError } from 'axios'

// Create an instance of axios
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export class ApiError extends AxiosError {
  constructor(message: string, name?: string) {
    super(message)
    this.name = name || ''
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const err = error as AxiosError<{
      name?: string
      message?: string
      detail?: string
      statusCode: number
    }>

    // Extract the detail property from the error
    const detail = err.response?.data?.detail

    let errorName = err.name

    let message: string

    // Check the status code and set the error name if it's 500
    if (err.response?.status === 500) {
      errorName = 'Internal Server Error'
    }

    // Check if detail is an array
    if (_.isArray(detail)) {
      // If it is an array, map over each item to create a list of error messages
        const messages = detail.map((item: { loc?: (string | number)[]; input?: string }) => {
        const fieldValue = item.loc?.[1]
        const field = typeof fieldValue === 'string' ? fieldValue.replace('_', ' ') : fieldValue
        return `The ${field} - (${item.input}) is not valid.`
      })
      // Combine them into single message
      message = messages.join(' ')
    } else if (_.isString(detail)) {
      // If it a string, assign directly to message
      message = detail
    } else {
      // If detail is neither an array nor a string,
      // fall back to other possible message sources
      message = err.response?.data?.message || err.message
    }

    const apiError = new ApiError(message)
    apiError.name = errorName

    return Promise.reject(new ApiError(message))
  }
)
