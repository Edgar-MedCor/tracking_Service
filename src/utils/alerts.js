
import Swal from 'sweetalert2';
import './sweetalert.css';
export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    background: '#ffffff',
    color: '#6B4E2E',
    iconColor: '#ff8c00',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#ff8c00',
    cancelButtonColor: '#6B4E2E',
    backdrop: 'rgba(250, 248, 245, 0.9)',
    buttonsStyling: true,
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    },
    customClass: {
      title: 'font-light tracking-wider text-xl',
      confirmButton: 'font-light tracking-wider px-6 py-2',
      htmlContainer: 'font-light text-[#B08968]'
    }
  });
};

export const showErrorAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    background: '#ffffff',
    color: '#6B4E2E',
    iconColor: '#dc2626',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#6B4E2E',
    cancelButtonColor: '#6B4E2E',
    backdrop: 'rgba(250, 248, 245, 0.9)',
    buttonsStyling: true,
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    },
    customClass: {
      title: 'font-light tracking-wider text-xl',
      confirmButton: 'font-light tracking-wider px-6 py-2',
      htmlContainer: 'font-light text-[#B08968]'
    }
  });
};

export const showConfirmAlert = (title, text, confirmText = 'Confirmar', cancelText = 'Cancelar') => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    background: '#ffffff',
    color: '#6B4E2E',
    iconColor: '#B08968',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#ff8c00',
    cancelButtonColor: '#6B4E2E',
    backdrop: 'rgba(250, 248, 245, 0.9)',
    buttonsStyling: true,
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    },
    customClass: {
      title: 'font-light tracking-wider text-xl',
      confirmButton: 'font-light tracking-wider px-6 py-2',
      cancelButton: 'font-light tracking-wider px-6 py-2 border border-[#e8e2d9]',
      htmlContainer: 'font-light text-[#B08968]'
    }
  });
};

export const showWarningAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    background: '#ffffff',
    color: '#6B4E2E',
    iconColor: '#ff8c00',
    confirmButtonText: 'Continuar',
    confirmButtonColor: '#ff8c00',
    cancelButtonColor: '#6B4E2E',
    backdrop: 'rgba(250, 248, 245, 0.9)',
    buttonsStyling: true,
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    },
    customClass: {
      title: 'font-light tracking-wider text-xl',
      confirmButton: 'font-light tracking-wider px-6 py-2',
      htmlContainer: 'font-light text-[#B08968]'
    }
  });
};

export const showInfoAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    background: '#ffffff',
    color: '#6B4E2E',
    iconColor: '#B08968',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#6B4E2E',
    cancelButtonColor: '#6B4E2E',
    backdrop: 'rgba(250, 248, 245, 0.9)',
    buttonsStyling: true,
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    },
    customClass: {
      title: 'font-light tracking-wider text-xl',
      confirmButton: 'font-light tracking-wider px-6 py-2',
      htmlContainer: 'font-light text-[#B08968]'
    }
  });
};

export const showStatusChangeAlert = (orderId, currentStatus, newStatus) => {
  return Swal.fire({
    title: 'Cambiar Estado',
    html: `
      <div class="text-center">
        <p class="text-[#B08968] mb-6 text-sm font-light">¿Desea cambiar el estado de la orden <strong class="font-medium">${orderId}</strong>?</p>
        <div class="flex items-center justify-center space-x-4 my-6">
          <span class="px-4 py-2 bg-[#faf8f5] text-[#6B4E2E] text-sm font-light border border-[#e8e2d9]">${currentStatus}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#B08968]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span class="px-4 py-2 bg-[#ff8c00] text-white text-sm font-light">${newStatus}</span>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Confirmar Cambio',
    cancelButtonText: 'Cancelar',
    background: '#ffffff',
    color: '#6B4E2E',
    iconColor: '#B08968',
    confirmButtonColor: '#ff8c00',
    cancelButtonColor: '#6B4E2E',
    backdrop: 'rgba(250, 248, 245, 0.9)',
    buttonsStyling: true,
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    },
    customClass: {
      title: 'font-light tracking-wider text-xl',
      confirmButton: 'font-light tracking-wider px-6 py-2',
      cancelButton: 'font-light tracking-wider px-6 py-2 border border-[#e8e2d9]',
      htmlContainer: 'font-light'
    }
  });
};


