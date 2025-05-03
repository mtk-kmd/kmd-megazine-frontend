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
      message?:
        | string
        | { code: string; meta: any; clientVersion: string; name: string }
      detail?: string
      statusCode: number
    }>

    let errorName = err.name
    let message: string

    if (err.response?.status === 500) {
      errorName = 'Internal Server Error'
    }

    const detail = err.response?.data?.detail
    const responseMessage = err.response?.data?.message

    if (_.isArray(detail)) {
      const messages = detail.map(
        (item: { loc?: (string | number)[]; input?: string }) => {
          const fieldValue = item.loc?.[1]
          const field =
            typeof fieldValue === 'string'
              ? fieldValue.replace('_', ' ')
              : fieldValue
          return `The ${field} - (${item.input}) is not valid.`
        }
      )
      message = messages.join(' ')
    } else if (_.isString(detail)) {
      message = detail
    } else if (_.isObject(responseMessage)) {
      const { code, meta, name } = responseMessage as {
        code: string
        meta: any
        name: string
      }

      if (code === 'P2002' && meta?.target?.[0]) {
        const field = meta.target[0].replace(/_/g, ' ')
        message = `The ${field} is already in use. Please use a different ${field}.`
      } else {
        message = `${name}: ${code}`
      }
    } else {
      message = responseMessage || err.message || 'An unknown error occurred'
    }

    const apiError = new ApiError(message, errorName)
    return Promise.reject(apiError)
  }
)
