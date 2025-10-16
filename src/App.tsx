import "./App.css";
import Body from "@/components/Body";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-950 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-2xl p-4">
        <Header />
        <Body />
        <Footer />
      </div>
    </div>
  );
}

export default App;
