import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';

interface Props {
  onFinished: () => void;
}

export function GameContainer({ onFinished }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 360,
      height: 640,
      parent: containerRef.current,
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1000 } },
      },
      scene: [new GameScene(onFinished)],
      backgroundColor: '#6EC6FF',
    });

    return () => {
      game.destroy(true);
    };
  }, [onFinished]);

  return <div ref={containerRef} />;
}