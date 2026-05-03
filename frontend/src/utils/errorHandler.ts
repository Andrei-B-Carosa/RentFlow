import swal from './swal'

export const handleApiError = (error: any) => {
    const status  = error?.response?.status
    const message = error?.response?.data?.message

    switch (status) {
        case 400:
            swal.error(message || 'Bad request.')
            break
        case 401:
            swal.error('Session expired. Please login again.')
            // redirect handled by axios interceptor
            break
        case 403:
            swal.error('You are not authorized to perform this action.')
            break
        case 404:
            swal.error(message || 'Record not found.')
            break
        case 422:
            // Laravel validation error — has errors object
            const errors = error?.response?.data?.errors
            if (errors) {
                const firstError = Object.values(errors)[0] as string[]
                swal.error(firstError[0])
            } else {
                swal.error(message || 'Validation failed.')
            }
            break
        case 500:
            swal.error('Server error. Please try again later.')
            break
        default:
            swal.error(message || 'Something went wrong.')
    }
}