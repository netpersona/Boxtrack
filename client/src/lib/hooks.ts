import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomsApi, binsApi, itemsApi } from "./api";
import type { InsertRoom, InsertBin, InsertItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: roomsApi.getAll,
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: () => roomsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: roomsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast({ description: "Room created successfully" });
    },
    onError: () => {
      toast({ description: "Failed to create room", variant: "destructive" });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: roomsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      toast({ description: "Room deleted successfully" });
    },
    onError: () => {
      toast({ description: "Failed to delete room", variant: "destructive" });
    },
  });
}

export function useBins(roomId?: string) {
  return useQuery({
    queryKey: roomId ? ["bins", "room", roomId] : ["bins"],
    queryFn: () => binsApi.getAll(roomId),
  });
}

export function useBin(id: string) {
  return useQuery({
    queryKey: ["bins", id],
    queryFn: () => binsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateBin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: binsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      toast({ description: "Container created successfully" });
    },
    onError: () => {
      toast({ description: "Failed to create container", variant: "destructive" });
    },
  });
}

export function useDeleteBin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: binsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast({ description: "Container deleted successfully" });
    },
    onError: () => {
      toast({ description: "Failed to delete container", variant: "destructive" });
    },
  });
}

export function useItems(binId?: string) {
  return useQuery({
    queryKey: binId ? ["items", "bin", binId] : ["items"],
    queryFn: () => itemsApi.getAll(binId),
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: itemsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast({ description: "Item added successfully" });
    },
    onError: () => {
      toast({ description: "Failed to add item", variant: "destructive" });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: itemsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast({ description: "Item deleted successfully" });
    },
    onError: () => {
      toast({ description: "Failed to delete item", variant: "destructive" });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertItem> }) => 
      itemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast({ description: "Item updated successfully" });
    },
    onError: () => {
      toast({ description: "Failed to update item", variant: "destructive" });
    },
  });
}
