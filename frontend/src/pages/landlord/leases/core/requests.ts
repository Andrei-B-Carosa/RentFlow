import { apiClient } from '../../../../api/axios'
import swal from '../../../../utils/swal'
import { handleApiError } from '../../../../utils/errorHandler'
import { ROUTES } from '../../../../constants/routes'

export const useController = () => {

    const viewLease = async (id: string) => {
        try {
            const res = await apiClient.get(`${ROUTES.LANDLORD.LEASES}/${id}`)
            return res.data
        } catch (error: any) {
            handleApiError(error)
        }
    }

    const createLease = async (data: any) => {
        try {
            swal.loading('Creating lease...')
            const res = await apiClient.post(`${ROUTES.LANDLORD.LEASES}`, data)
            swal.close()
            swal.ok(res.data.message || 'Lease created successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;
        }
    }

    const updateLease = async (id: string, data: any) => {
        try {
            swal.loading('Updating lease...')
            const res = await apiClient.put(`${ROUTES.LANDLORD.LEASES}/${id}`, data)
            swal.close()
            swal.ok(res.data.message || 'Lease updated successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;

        }
    }

    const deleteLease = async (id: string) => {
        const result = await swal.confirmDelete()
        if (!result.isConfirmed) return

        try {
            swal.loading('Terminating lease...')
            const res = await apiClient.patch(`${ROUTES.LANDLORD.LEASES}/${id}/terminate`)
            swal.close()
            swal.ok(res.data.message || 'Lease deleted successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;
        }
    }

    return { viewLease, createLease, updateLease, deleteLease, }
}