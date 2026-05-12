import { apiClient } from '../../../../api/axios'
import swal from '../../../../utils/swal'
import { handleApiError } from '../../../../utils/errorHandler'
import { ROUTES } from '../../../../constants/routes'

export const useController = () => {

    const viewMaintenance = async (id: string) => {
        try {
            const res = await apiClient.get(`${ROUTES.LANDLORD.MAINTENANCE}/${id}`)
            return res.data
        } catch (error: any) {
            handleApiError(error)
        }
    }

    const createMaintenance = async (data: any) => {
        try {
            swal.loading('Creating request...')
            const res = await apiClient.post(`${ROUTES.LANDLORD.MAINTENANCE}`, data)
            swal.close()
            swal.ok(res.data.message || 'Request created successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;
        }
    }

    const updateMaintenance = async (id: string, data: any) => {
        try {
            swal.loading('Updating request...')
            const res = await apiClient.put(`${ROUTES.LANDLORD.MAINTENANCE}/${id}`, data)
            swal.close()
            swal.ok(res.data.message || 'Request updated successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;

        }
    }

    const deleteMaintenance = async (id: string) => {
        const result = await swal.confirmDelete()
        if (!result.isConfirmed) return

        try {
            swal.loading('Deleting request...')
            const res = await apiClient.delete(`${ROUTES.LANDLORD.MAINTENANCE}/${id}`)
            swal.close()
            swal.ok(res.data.message || 'Request deleted successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;
        }
    }

    return { viewMaintenance, createMaintenance, updateMaintenance, deleteMaintenance, }
}