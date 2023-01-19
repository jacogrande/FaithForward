import { useState } from "react";

export const useApi = (url: string, data?: RequestInit) => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url, data);
      if (response.status === 200) {
        setResponseData(await response.json());
      } else {
        throw new Error("Error fetching data. Status code: " + response.status);
      }
    } catch (error) {
      console.error(error);
      setResponseData(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data: responseData, fetchData, setResponseData };
};
