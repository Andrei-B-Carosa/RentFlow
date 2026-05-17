import { apiClient } from '../../../../api/axios'
import swal from '../../../../utils/swal'
import { handleApiError } from '../../../../utils/errorHandler'
import { ROUTES } from '../../../../constants/routes'

export const useController = () => {

    const viewPayment = async (id: string) => {
        try {
            const res = await apiClient.get(`${ROUTES.LANDLORD.PAYMENTS}/${id}`)
            return res.data
        } catch (error: any) {
            handleApiError(error)
        }
    }

    const createPayment = async (data: any) => {
        try {
            swal.loading('Creating request...')
            const res = await apiClient.post(`${ROUTES.LANDLORD.PAYMENTS}`, data)
            swal.close()
            swal.ok(res.data.message || 'Request created successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;
        }
    }

    const updatePayment = async (id: string, data: any) => {
        try {
            swal.loading('Updating request...')
            const res = await apiClient.put(`${ROUTES.LANDLORD.PAYMENTS}/${id}`, data)
            swal.close()
            swal.ok(res.data.message || 'Request updated successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;

        }
    }

    const deletePayment = async (id: string) => {
        const result = await swal.confirmDelete()
        if (!result.isConfirmed) return

        try {
            swal.loading('Deleting request...')
            const res = await apiClient.delete(`${ROUTES.LANDLORD.PAYMENTS}/${id}`)
            swal.close()
            swal.ok(res.data.message || 'Request deleted successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;
        }
    }

    return { viewPayment, createPayment, updatePayment, deletePayment, }
}