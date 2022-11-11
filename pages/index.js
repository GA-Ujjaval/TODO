import { useRouter } from "next/router";
import { useEffect } from "react";
import Login from "../src/components/Login";


export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const accessToken = JSON.parse(localStorage.getItem("authToken"));

    if (true) {
      router.push("/dashboard");
    }
  }, []);
  return <Login />;
}
