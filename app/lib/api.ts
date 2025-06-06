import { Item, Person, Settlement } from "../../types";

// Client-side API utilities
const API_BASE_URL = '/api';

export type UpdateSplitData = {
  people: Person[];
  settlements: Settlement[];
  items: Item[];
};

export const clientApi = {
  async createNewSplit(): Promise<{ id: string; shareId: string }> {
    const response = await fetch('/api/split', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create new split');
    }

    const { data } = await response.json();
    return { id: data.id, shareId: data.shareId };
  },

  async getSplitByShareId(shareId: string) {
    const response = await fetch(`${API_BASE_URL}/split/${shareId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch split');
    }
    
    const { data } = await response.json();
    return data;
  },

  async updateSplit(
    shareId: string, 
    data: UpdateSplitData
  ) {
    const response = await fetch(`${API_BASE_URL}/split/${shareId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }
      throw new Error('Failed to update split');
    }

    return true;
  }
};
