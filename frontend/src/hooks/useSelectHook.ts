// hooks/useSelectHook.ts
import { useState, useCallback } from 'react'
import { apiClient } from '../api/axios'

export const useSelectHook = <T extends { value: string; label: string }>() => {
    const [options, setOptions] = useState<T[]>([])
    const [loading, setLoading] = useState(false)

    const fetchOptions = useCallback(async (
        url:    string,
        mapper: (item: any) => T,
        params: Record<string, any> = {}
    ) => {
        setLoading(true)
        try {
            const res  = await apiClient.get(url, { params })
            const data = res.data?.data ?? []
            setOptions(data.map(mapper))
        } catch {
            setOptions([])
        } finally {
            setLoading(false)
        }
    }, [])

    return { options, loading, fetchOptions }
}