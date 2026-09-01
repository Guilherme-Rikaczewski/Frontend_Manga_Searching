import { createContext, useContext, useState, useEffect } from 'react'
import './Toast.css'

const ToastContext = createContext(null)

export function Toast({ message, type = 'info', onClose }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast toast--${type}`} role="alert">
      <div className='toast__container'>
        <span className="toast__message">
          {message}
        </span>

        <button
          type="button"
          className="toast__close"
          onClick={onClose}
          aria-label="Fechar notificação"
        >
          ×
        </button>
      </div>
      <div className='toast__barra'></div>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
