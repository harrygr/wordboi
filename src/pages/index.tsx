import type { NextPage } from "next";
import Head from "next/head";
import { Game } from "../components/Game";
import { Header } from "../components/Header";
import { GameStateProvider, useGameState } from "../GameState";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Wordboi</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto px-4">
        <Header />

        <main>
          <GameStateProvider>
            <Game />
          </GameStateProvider>
        </main>
      </div>
    </div>
  );
};

export default Home;
