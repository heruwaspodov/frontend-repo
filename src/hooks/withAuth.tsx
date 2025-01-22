import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { loadUserFromStorage } from "@/store/userSlice";
import { Box, Typography } from "@mui/material";

export type WithAuthProps = {
  email: string | null;
  id: string | null;
  accessToken: string | null;
  name: string | null;
  lastLogin: string | null;
};

export const withAuth = <P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithAuthComponent(props: Omit<P, keyof WithAuthProps>) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { email, id, accessToken, name, lastLogin } = useSelector(
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

    if (isLoading) {
      return (
        <Box>
          <Typography>Loading...</Typography>
        </Box>
      );
    }

    if (!accessToken) {
      return (
        <Box>
          <Typography>Access token not available, redirecting...</Typography>
        </Box>
      );
    }

    // Pass the auth props to the wrapped component
    return (
      <WrappedComponent
        {...(props as P)}
        email={email}
        id={id}
        accessToken={accessToken}
        name={name}
        lastLogin={lastLogin}
      />
    );
  };
};