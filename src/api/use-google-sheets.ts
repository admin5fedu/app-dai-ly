/**
 * React Query Hooks cho Google Sheets API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { readSheet, writeSheet, getSheetNames, type ReadSheetOptions, type WriteSheetOptions } from './google-sheets'

/**
 * Hook để đọc dữ liệu từ Google Sheet
 */
export function useReadSheet(options: ReadSheetOptions = {}, queryOptions: { enabled?: boolean; staleTime?: number } = {}) {
  const { enabled = true, staleTime } = queryOptions
  return useQuery({
    queryKey: ['google-sheets', 'read', options],
    queryFn: () => readSheet(options),
    enabled,
    staleTime: staleTime !== undefined ? staleTime : undefined, // Use custom staleTime if provided
  })
}

/**
 * Hook để lấy danh sách sheet names
 */
export function useSheetNames(enabled = true) {
  return useQuery({
    queryKey: ['google-sheets', 'sheet-names'],
    queryFn: () => getSheetNames(),
    enabled,
  })
}

/**
 * Hook để ghi dữ liệu vào Google Sheet
 */
export function useWriteSheet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (options: WriteSheetOptions) => writeSheet(options),
    onSuccess: () => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: ['google-sheets'] })
    },
  })
}

