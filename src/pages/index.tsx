import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { CodeIcon } from "../components/CodeIcon";
import { Game } from "../components/Game";
import { Header } from "../components/Header";
import { GameStateProvider, useGameState } from "../GameState";

const Home: NextPage = () => {
  const [statsVisible, setStatsVisible] = React.useState(false);

  return (
    <div>
      <Head>
        <title>Wordboi</title>

        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className="container mx-auto px-2 md:px-4">
        <Header showStats={() => setStatsVisible(true)} />

        <main>
          <GameStateProvider>
            <Game
              statsVisible={statsVisible}
              setStatsVisible={setStatsVisible}
            />
          </GameStateProvider>
        </main>

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
    </div>
  );
};

export default Home;
