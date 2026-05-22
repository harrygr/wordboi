import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";
import { config } from "./config";
import { CodeIcon } from "./components/CodeIcon";
import { Game } from "./components/Game";
import { Header } from "./components/Header";
import { GameStateProvider } from "./GameState";

function App() {
  const [statsVisible, setStatsVisible] = React.useState(false);

  return (
    <div className="container mx-auto px-2 md:px-4">
      <GameStateProvider>
        <Header showStats={() => setStatsVisible(true)} />

        <main>
          <Game
            statsVisible={statsVisible}
            setStatsVisible={setStatsVisible}
          />
        </main>
      </GameStateProvider>

      <footer className="mt-8 py-4 flex justify-between text-gray-300 text-sm items-center">
        <span>&copy; 2022</span>
        <a
          href="https://github.com/harrygr/wordboi"
          title="Wordboi source"
          target="_blank"
          rel="noreferrer"
          className=" hover:text-gray-500"
        >
          <CodeIcon />
        </a>
      </footer>
    </div>
  );
}

const root = document.getElementById("root")!;

if (config.umamiScriptUrl && config.umamiSiteId) {
  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.dataset.websiteId = config.umamiSiteId;
  script.src = config.umamiScriptUrl;
  document.head.appendChild(script);
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
