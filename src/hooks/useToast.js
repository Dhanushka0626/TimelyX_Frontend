import toast from 'react-hot-toast';

/**
 * Custom toast hook with professional styling and animations
 */
export const useToast = () => {
  const showSuccess = (message, options = {}) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    return toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
        fontWeight: '500',
      },
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    return toast(message, {
      duration: 4500,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.2)',
        fontWeight: '500',
      },
      ...options,
    });
  };

  const showLoading = (message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6366f1',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.2)',
        fontWeight: '500',
      },
      ...options,
    });
  };

  const showPromise = (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Processing...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong',
      },
      {
        position: 'top-right',
        style: {
          padding: '16px',
          borderRadius: '12px',
          fontWeight: '500',
        },
        success: {
          style: {
            background: '#10b981',
            color: '#fff',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#fff',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
        loading: {
          style: {
            background: '#6366f1',
            color: '#fff',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.2)',
          },
        },
        ...options,
      }
    );
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    loading: showLoading,
    promise: showPromise,
    dismiss,
    dismissAll,
  };
};

export default useToast;
