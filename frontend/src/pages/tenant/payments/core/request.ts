import { apiClient } from '../../../../api/axios'
import swal from '../../../../utils/swal'
import { handleApiError } from '../../../../utils/errorHandler'
import { ROUTES } from '../../../../constants/routes'

export const useController = () => {

    const viewReceipt = async (id: string) => {
        try {
            const res = await apiClient.get(`${ROUTES.TENANT.PAYMENTS}/${id}/receipt`)
            return res.data
        } catch (error: any) {
            handleApiError(error)
        }
    }

    return { viewReceipt }
}