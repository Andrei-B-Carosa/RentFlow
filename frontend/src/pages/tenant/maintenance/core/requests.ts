import { handleApiError } from "../../../../utils/errorHandler";
import { apiMultipart } from "../../../../api/axios";
import { ROUTES } from "../../../../constants/routes";
import swal from "../../../../utils/swal";

export const useController = () => {

    const createMaintenanceRequest = async (data: any) => {
        try {
            swal.loading('Creating request...')
            const res = await apiMultipart.post(ROUTES.TENANT.MAINTENANCE, data)
            swal.close()
            swal.ok(res.data.message || 'Request created successfully!')
            return res.data
        } catch (error: any) {
            swal.close()
            handleApiError(error)
        }
    };

    const viewMaintenanceRequest = async(id: string) => {
        try {
            const res = await apiMultipart.get(`${ROUTES.TENANT.MAINTENANCE}/${id}`)
            return res.data;
        } catch (error: any) {
            handleApiError(error)
            return false;
        }
    };
    return { createMaintenanceRequest, viewMaintenanceRequest };
}