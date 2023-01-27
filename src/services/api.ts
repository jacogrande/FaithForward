import { useState } from "react";

export const useApi = <T>(url: string, data?: RequestInit) => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<T | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url, data);
      if (response.status === 200) {
        setResponseData(await response.json());
      } else {
        throw new Error(
          "Error fetching data. Status code: " +
            response.status +
            ".\n Response: " +
            (await response.json()).error
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data: responseData, fetch: fetchData, setResponseData };
};
