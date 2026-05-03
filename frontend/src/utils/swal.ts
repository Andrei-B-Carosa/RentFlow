// src/utils/swal.ts
import Swal from 'sweetalert2'

const swal = {

    ok: (message: string, title: string = 'Success') => {
        return Swal.fire({
            icon:              'success',
            title,
            text:              message,
            timer:             2000,
            showConfirmButton: false,
            timerProgressBar:  true,
        })
    },

    error: (message: string, title: string = 'Error') => {
        return Swal.fire({
            icon:             'error',
            title,
            text:             message,
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444',
        })
    },

    info: (message: string, title: string = 'Info') => {
        return Swal.fire({
            icon:              'info',
            title,
            text:              message,
            confirmButtonColor: '#3b82f6',
        })
    },

    warning: (message: string, title: string = 'Warning') => {
        return Swal.fire({
            icon:              'warning',
            title,
            text:              message,
            confirmButtonColor: '#f59e0b',
        })
    },

    confirm: (message: string, title: string = 'Are you sure?') => {
        return Swal.fire({
            icon:               'warning',
            title,
            text:               message,
            showCancelButton:   true,
            confirmButtonText:  'Yes, proceed',
            cancelButtonText:   'Cancel',
            confirmButtonColor: '#ef4444',
            cancelButtonColor:  '#6b7280',
            reverseButtons:     true,
        })
    },

    confirmDelete: (message: string = 'This action cannot be undone.') => {
        return Swal.fire({
            icon:               'warning',
            title:              'Delete this record?',
            text:               message,
            showCancelButton:   true,
            confirmButtonText:  'Yes, delete it',
            cancelButtonText:   'Cancel',
            confirmButtonColor: '#ef4444',
            cancelButtonColor:  '#6b7280',
            reverseButtons:     true,
        })
    },

    confirmArchive: (message: string = 'You can restore this later.') => {
        return Swal.fire({
            icon:               'warning',
            title:              'Archive this record?',
            text:               message,
            showCancelButton:   true,
            confirmButtonText:  'Yes, archive it',
            cancelButtonText:   'Cancel',
            confirmButtonColor: '#f59e0b',
            cancelButtonColor:  '#6b7280',
            reverseButtons:     true,
        })
    },

    loading: (message: string = 'Please wait...') => {
        Swal.fire({
            title:             message,
            allowOutsideClick: false,
            allowEscapeKey:    false,
            showConfirmButton:  false,
            didOpen: () => {
                Swal.showLoading()
            },
        })
    },

    close: () => {
        Swal.close()
    },
}

export default swal