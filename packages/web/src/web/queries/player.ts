import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '../lib/api';
export function useProfile(){ return useQuery(orpc.player.profile.queryOptions()); }
export function useSaveScore(){const qc=useQueryClient();return useMutation(orpc.player.save.mutationOptions({onSuccess:()=>qc.invalidateQueries({queryKey:orpc.player.key()})}));}