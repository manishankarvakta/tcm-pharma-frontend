import Swal from 'sweetalert2';

const AlertService = {
    /**
     * Show a basic alert
     * @param {string} title 
     * @param {string} text 
     * @param {string} icon - 'success', 'error', 'warning', 'info', 'question'
     */
    alert: (title, text = '', icon = 'info') => {
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonColor: '#1a1a1a', // Custom dark theme
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-dark',
                popup: 'premium-swal-popup'
            }
        });
    },

    /**
     * Show a confirmation dialog
     * @param {string} title 
     * @param {string} text 
     * @param {string} confirmText 
     * @returns {Promise<boolean>}
     */
    confirm: async (title, text = '', confirmText = 'Yes, Proceed') => {
        const result = await Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#28a745', // Success green
            cancelButtonColor: '#dc3545', // Danger red
            confirmButtonText: confirmText,
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'btn btn-success mx-2',
                cancelButton: 'btn btn-danger mx-2',
                popup: 'premium-swal-popup'
            }
        });
        return result.isConfirmed;
    },

    success: (title, text = '') => {
        return Swal.fire({
            title,
            text,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
    },

    error: (title, text = '') => {
        return Swal.fire({
            title,
            text,
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    }
};

export default AlertService;
