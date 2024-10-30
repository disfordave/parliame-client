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
    <div className="max-w-2xl mx-auto p-4">
      <Seats />
    </div>
  );
}

export default App;
