import "./App.css";
import Seats from "./components/Seats";

export interface Party {
  name: string;
  shortName: string;
  seats: number;
  colour: string;
  position: number;
  isIndependent?: boolean;
}

function App() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-950 dark:text-white min-h-screen">
<div className="max-w-2xl mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Parliament</h1>
      <Seats />
    </div>
    </div>
    
  );
}

export default App;
