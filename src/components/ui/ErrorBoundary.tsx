import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('InternHub Uncaught Runtime Exception:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/dashboard'
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-[#F8FAFF] flex flex-col justify-center items-center p-4 sm:p-6 text-[#25324B]">
          <div className="w-full max-w-[500px]">
            <Card padding="lg" className="text-center shadow-lg border-[#EDF0F6]">
              <div className="w-14 h-14 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto mb-4 border border-[#fecaca]">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h2 className="text-[20px] font-bold text-[#25324B]">Something went wrong</h2>
              <p className="text-[14px] text-[#64748B] mt-2 leading-[22px]">
                An unexpected error occurred while rendering this view. Your session data and saved work are preserved.
              </p>

              {this.state.error?.message && (
                <div className="mt-4 p-3 bg-[#F5F7FC] rounded-[8px] border border-[#EDF0F6] text-left">
                  <p className="text-[11px] font-mono text-[#64748B] break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={this.handleReload}
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Reload Page
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={this.handleReset}
                  icon={<Home className="w-4 h-4" />}
                >
                  Return to Dashboard
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
