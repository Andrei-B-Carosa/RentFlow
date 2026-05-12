import { apiClient } from '../../../../api/axios'
import swal from '../../../../utils/swal'
import { handleApiError } from '../../../../utils/errorHandler'
import { ROUTES } from '../../../../constants/routes'

export const useController = () => {

    const viewUser = async (id: string) => {
        try {
            const res = await apiClient.get(`${ROUTES.LANDLORD.TENANTS}/${id}`)
            return res.data
        } catch (error: any) {
            handleApiError(error)
        }
    }

    const createUser = async (data: any) => {
        try {
            swal.loading('Creating user...')
            const res = await apiClient.post(`${ROUTES.LANDLORD.TENANTS}`, data)
            swal.close()
            swal.ok(res.data.message || 'User created successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;
        }
    }

    const updateUser = async (id: string, data: any) => {
        try {
            swal.loading('Updating user...')
            const res = await apiClient.put(`${ROUTES.LANDLORD.TENANTS}/${id}`, data)
            swal.close()
            swal.ok(res.data.message || 'User updated successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;

        }
    }

    const deleteUser = async (id: string) => {
        const result = await swal.confirmDelete()
        if (!result.isConfirmed) return

        try {
            swal.loading('Deleting user...')
            const res = await apiClient.delete(`${ROUTES.LANDLORD.TENANTS}/${id}`)
            swal.close()
            swal.ok(res.data.message || 'User deleted successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
            throw error;
        }
    }

    return { viewUser, createUser, updateUser, deleteUser, }
}