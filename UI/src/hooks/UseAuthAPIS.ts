import axios from 'axios';
import { API_URL } from "../constants";

interface SignupData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  location: string;
}


export const useAuthApi = () => {
    const login = async (email: string, password: string) => {
      try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data.detail || "Login failed");
      }
    };
  

    const signup = async ({ id, firstName, lastName, email, password, created_at, updated_at, location }: SignupData) => {
      try {
        const response = await axios.post(`${API_URL}/signup`, { id, firstName, lastName, email, password, created_at, updated_at, location });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data.detail || "Sign-up failed");
      }
    };
    const forgotPassword = async (email : string) => {
      try {
        const response = await axios.post(`${API_URL}/forgot-password`, {
          email,
        });
        return response.data;
      }
      catch (error: any) {
        throw new Error(error.response?.data.detail || "Sign-up failed");
      }
    };
  
    return { login, signup, forgotPassword};
  };