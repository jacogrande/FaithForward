import { API_URL } from "@src/constants";
import useStore from "@src/store";
import { useQuery } from "react-query";

export function useBibleChapter(book: string, chapter: number) {
  const { setError } = useStore();

  const { isLoading, error, data, refetch } = useQuery(
    ["bible", book, chapter],
    async () => {
      const response = await fetch(
        `${API_URL}/fetchChapter?book=${book}&chapter=${chapter}`
      );
      if (response.status === 200) {
        return await response.json();
      } else {
        const err = await response.json();
        throw new Error(err.error);
      }
    },
    {
      onError: (err: any) => {
        console.error(err);
        setError(err.message);
      },
      enabled: !!book && !!chapter,
    }
  );

  return { isLoading, error, data, refetch };
}
