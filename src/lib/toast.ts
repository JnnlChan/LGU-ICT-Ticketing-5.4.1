import Swal from 'sweetalert2';

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: 'var(--surface)',
  color: 'var(--ink)',
  customClass: {
    popup: 'colored-toast'
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

export const ConfirmModal = Swal.mixin({
  title: 'Are you sure?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: 'var(--accent)',
  cancelButtonColor: '#71717a',
  confirmButtonText: 'Yes, proceed',
  cancelButtonText: 'Cancel',
  background: 'var(--surface)',
  color: 'var(--ink)',
});
