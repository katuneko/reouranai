import { useState } from 'react';
import { GameContainer } from './game';
import StartButton from './components/StartButton';
import './App.css';

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center h-screen p-4">
      {!started ? (
        <>
          <img src="/leo.png" alt="Leo" className="w-40 mb-6 animate-bounce" />
          <h1 className="text-3xl font-bold mb-4 text-primary">
            レオ占い☆RUN！
          </h1>
          <StartButton onClick={() => setStarted(true)} />
        </>
      ) : (
        <GameContainer onFinished={() => setStarted(false)} />
      )}
    </main>
  );
}