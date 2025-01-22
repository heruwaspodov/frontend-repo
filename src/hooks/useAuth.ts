import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { loadUserFromStorage } from "@/store/userSlice";

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { email, id, accessToken } = useSelector(
    (state: RootState) => state.user
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return;

    if (!accessToken) {
      console.log("Access token not available, redirecting...");
      router.push("/login");
    }
  }, [accessToken, router, isLoading]);

  useEffect(() => {
    if (accessToken !== undefined && accessToken !== null) {
      setIsLoading(false);
    }
  }, [accessToken]);

  return { isLoading, email, id, accessToken };
};

export default useAuth;
