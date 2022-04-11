import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Game } from "../components/Game";
import { GameStats } from "../components/GameStats";
import { Header } from "../components/Header";
import { GameStateProvider, useGameState } from "../GameState";

const Home: NextPage = () => {
  const [statsVisible, setStatsVisible] = React.useState(false);

  return (
    <div>
      <Head>
        <title>Wordboi</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto px-4">
        <Header showStats={() => setStatsVisible(true)} />

        <main>
          <GameStateProvider>
            <Game
              statsVisible={statsVisible}
              setStatsVisible={setStatsVisible}
            />
          </GameStateProvider>
        </main>
      </div>
    </div>
  );
};

export default Home;
