import { get, post, put, del } from "@/services/api";
import type { Client, ClientFormData } from "@/types/erp";

export async function fetchClients(): Promise<Client[]> {
  const response = await get<{ items: Client[] }>("/clients?limit=100");
  return response.data.items;
}

export async function createClient(data: ClientFormData): Promise<Client> {
  const response = await post<Client>("/clients", data);
  return response.data;
}

export async function updateClient(id: string, data: Partial<ClientFormData>): Promise<Client> {
  const response = await put<Client>(`/clients/${id}`, data);
  return response.data;
}

export async function deleteClient(id: string): Promise<void> {
  await del(`/clients/${id}`);
}
