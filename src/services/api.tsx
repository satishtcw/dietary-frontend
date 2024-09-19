import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'; // Backend URL

// Login API
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch categories');
    }
};

export const getLevels = async () => {
  try {
      const response = await axios.get(`${API_BASE_URL}/levels`);
      return response.data;
  } catch (error) {
      throw new Error('Failed to fetch levels');
  }
};

export const getFoodItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/food-items`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch food items');
  }
};
export const getResidents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/residents`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch residents');
  }
};

export const addFoodItem = async (foodItem: { name: string, category: string, iddsiLevel: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-food`, foodItem);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add food item');
  }
};

export const addResidentItem = async (residentItem: { name: string, iddsiLevel: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-resident`, residentItem);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add food item');
  }
};

export const assignFoodToResident = async (residentId: any, selectedFoods: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/assign-foods`, {
      resident: residentId,
      foods: selectedFoods,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to assign food item');
  }
};

export const getAssignedFoods = async (residentId: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/get-assign-foods`, {
      resident: residentId,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to assign food item');
  }
};

export const saveCSVData = async (csvData: any[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/import-csv-foods`, {
      csvData: JSON.stringify({ csvData }),
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to assign food item');
  }
};
