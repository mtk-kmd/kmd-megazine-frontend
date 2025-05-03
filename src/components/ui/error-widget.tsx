import { AlertCircle, FileWarning, ServerCrash, PackageX } from 'lucide-react'

type ErrorWidgetProps = {
  type?: 'error' | 'warning' | 'no-data' | 'server-error' | 'not-found'
  title?: string
  description?: string
  className?: string
}

export function ErrorWidget({
  type = 'no-data',
  title,
  description,
  className = '',
}: ErrorWidgetProps) {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <AlertCircle
            className="h-12 w-12 text-destructive"
            strokeWidth={1.5}
          />
        )
      case 'warning':
        return (
          <FileWarning className="text-warning h-12 w-12" strokeWidth={1.5} />
        )
      case 'server-error':
        return (
          <ServerCrash
            className="h-12 w-12 text-destructive"
            strokeWidth={1.5}
          />
        )
      case 'not-found':
        return (
          <FileWarning
            className="h-12 w-12 text-muted-foreground"
            strokeWidth={1.5}
          />
        )
      case 'no-data':
      default:
        return (
          <PackageX
            className="h-12 w-12 text-muted-foreground"
            strokeWidth={1.5}
          />
        )
    }
  }

  const getTitle = () => {
    if (title) return title

    switch (type) {
      case 'error':
        return 'An error occurred'
      case 'warning':
        return 'Warning'
      case 'server-error':
        return 'Server error'
      case 'not-found':
        return 'Not found'
      case 'no-data':
      default:
        return 'No data'
    }
  }

  const getDescription = () => {
    if (description) return description

    switch (type) {
      case 'error':
        return 'There was a problem processing your request.'
      case 'warning':
        return 'Please check the information and try again.'
      case 'server-error':
        return 'Our server is experiencing issues. Please try again later.'
      case 'not-found':
        return 'The requested resource could not be found.'
      case 'no-data':
      default:
        return 'No data available to display.'
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="mb-4">{getIcon()}</div>
      <h3 className="mb-2 text-lg font-medium">{getTitle()}</h3>
      <p className="text-sm text-muted-foreground">{getDescription()}</p>
    </div>
  )
}
