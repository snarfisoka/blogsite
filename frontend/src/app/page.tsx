import BlogList from "./components/BlogList";
import UserEmail from "./components/UserEmail";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <BlogList />
      <UserEmail />
    </main>
  );
}
