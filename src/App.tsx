import "./App.css";
import Body from "@/components/Body";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandscapeCountryListBanner from "./components/ui/app/head/LandscapeCountryListBanner";

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-950 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-6xl p-4">
        <Header />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[14.5fr_5.5fr]">
          <div className="">
            <Body />
          </div>
          <div className="hidden pt-4 lg:block">
            <LandscapeCountryListBanner />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
