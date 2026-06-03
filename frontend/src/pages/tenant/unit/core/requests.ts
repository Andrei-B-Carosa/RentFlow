import { apiClient } from "../../../../api/axios";
import { ROUTES } from "../../../../constants/routes";
import { useAuth } from "../../../../context/AuthContext";
import { handleApiError } from "../../../../utils/errorHandler";

export const useController = () =>{

    const viewUnit = async() => {
        try {
            const res = await apiClient.get(ROUTES.TENANT.UNIT)
            if(!res) return
            return res.data
        } catch(error:any) {
            handleApiError(error)
        }
    }

    return { viewUnit }
}