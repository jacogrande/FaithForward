import { useState } from "react";
import { FLAGGED_INPUT_RESPONSES } from "../constants";
import useStore from "../Store";

export const useApi = <T>(url: string, data?: RequestInit) => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<T | null>(null);
  const { setError } = useStore();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url, data);
      if (response.status === 200) {
        setResponseData(await response.json());
      } else {
        console.debug("non-200 status code returned");
        const err = await response.json();
        console.debug(err);
        setError(err.error);

        // If the user input was flagged, don't throw an error
        // Instead, set the response data
        // Handle the most serious flags first
        if (!!err.moderationResponse) {
          // Handle sexual/minors
          if (err.moderationResponse.categories["sexual/minors"]) {
            console.debug("flagged for sexual/minors");
            setResponseData({
              response: FLAGGED_INPUT_RESPONSES.SEXUAL_MINORS,
            } as T);
            return;
          }

          // Handle self-harm
          if (err.moderationResponse.categories["self-harm"]) {
            console.debug("flagged for self-harm");
            setResponseData({
              response: FLAGGED_INPUT_RESPONSES.SELF_HARM,
            } as T);
            return;
          }

          // Handle violence
          if (err.moderationResponse.categories["violence"]) {
            console.debug("flagged for violence");
            setResponseData({
              response: FLAGGED_INPUT_RESPONSES.VIOLENCE,
            } as T);
            return;
          }

          // Handle violence/graphic
          if (err.moderationResponse.categories["violence/graphic"]) {
            console.debug("flagged for violence/graphic");
            setResponseData({
              response: FLAGGED_INPUT_RESPONSES.VIOLENCE_GRAPHIC,
            } as T);
            return;
          }

          // Handle hate
          if (err.moderationResponse.categories["hate"]) {
            console.debug("flagged for hate");
            setResponseData({ response: FLAGGED_INPUT_RESPONSES.HATE } as T);
            return;
          }

          // Handle hate/threatening
          if (err.moderationResponse.categories["hate/threatening"]) {
            console.debug("flagged for hate/threatening");
            setResponseData({
              response: FLAGGED_INPUT_RESPONSES.HATE_THREATENING,
            } as T);
            return;
          }

          // Handle sexual
          if (err.moderationResponse.categories["sexual"]) {
            console.debug("flagged for sexual");
            setResponseData({ response: FLAGGED_INPUT_RESPONSES.SEXUAL } as T);
            return;
          }

          throw new Error(
            "Error fetching data. Status code: " + response.status
          );
        }
      }
    } catch (error: any) {
      console.error(error);
      setError(error);
      setResponseData(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data: responseData, fetchData, setResponseData };
};
