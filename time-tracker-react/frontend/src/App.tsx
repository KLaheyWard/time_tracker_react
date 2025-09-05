import { useQuery } from "@tanstack/react-query";
import "./App.css";

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["thedata"],
    queryFn: async () => (await fetch("/hours.csv")).text(),
  });

  const allTheData = data?.split("\n");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Ruh roh...</p>;

  return <>{allTheData[0]}</>;
}

export default App;
