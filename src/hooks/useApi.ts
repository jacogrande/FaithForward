import { useState } from "react";
import useStore from '../store';

export const useApi = (url: string, data?: RequestInit) => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const { setError } = useStore();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("url:", url)
      console.log("data:", data)
      const response = await fetch(url, data);
      console.log("response:", response)
      if (response.status === 200) {
        setResponseData(await response.json());
      } else {
        throw new Error("Error fetching data. Status code: " + response.status);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setResponseData(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data: responseData, fetchData, setResponseData };
};
