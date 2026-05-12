import { apiClient, apiMultipart } from '../../../../api/axios'
import swal from '../../../../utils/swal'
import { handleApiError } from '../../../../utils/errorHandler'
import { ROUTES } from '../../../../constants/routes'

export const useController = () => {

    const viewProperty = async (id: string) => {
        try {
            const res = await apiClient.get(`${ROUTES.LANDLORD.PROPERTIES}/${id}`)
            return res.data
        } catch (error: any) {
            handleApiError(error)
        }
    }

    const createProperty = async (data: any) => {
        try {
            swal.loading('Creating property...')
            const res = await apiMultipart.post(`${ROUTES.LANDLORD.PROPERTIES}`, data)
            swal.close()
            swal.ok(res.data.message || 'Property created successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
        }
    }

    const updateProperty = async (id: string, data: any) => {
        try {
            swal.loading('Updating property...')
            const res = await apiMultipart.post(`${ROUTES.LANDLORD.PROPERTIES}/${id}`, data)
            swal.close()
            swal.ok(res.data.message || 'Property updated successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
        }
    }

    const deleteProperty = async (id: string) => {
        const result = await swal.confirmDelete()
        if (!result.isConfirmed) return

        try {
            swal.loading('Deleting property...')
            const res = await apiClient.delete(`${ROUTES.LANDLORD.PROPERTIES}/${id}`)
            swal.close()
            swal.ok(res.data.message || 'Property deleted successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            
        }
    }

    return { viewProperty, createProperty, updateProperty, deleteProperty, }
}