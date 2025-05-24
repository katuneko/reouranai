import Phaser from 'phaser';
import { postFortune } from '../api/fortune';

export default class GameScene extends Phaser.Scene {
  private finishedCb: () => void;
  private snacks: string[] = [];
  private timer?: Phaser.Time.TimerEvent;

  constructor(finished: () => void) {
    super('GameScene');
    this.finishedCb = finished;
  }

  preload() {
    this.load.image('leo', '/leo.png');
    this.load.image('cookie', '/snacks/cookie.png');
    this.load.image('chicken', '/snacks/chicken.png');
    this.load.image('peas', '/snacks/peas.png');
  }

  create() {
    const leo = this.physics.add.sprite(60, 500, 'leo').setScale(0.3);

    this.input.on('pointerdown', () => {
      leo.setVelocityY(-500);
    });

    // 簡易的な snack 生成
    this.time.addEvent({
      delay: 800,
      callback: () => {
        const keys = ['cookie', 'chicken', 'peas'] as const;
        const key = keys[Phaser.Math.Between(0, 2)];
        const snack = this.physics.add.sprite(400, 500, key).setScale(0.2);
        snack.setVelocityX(-200);
        this.physics.add.overlap(leo, snack, () => {
          this.snacks.push(key.toUpperCase());
          snack.destroy();
        });
      },
      loop: true,
    });

    // 10 秒経過で終了
    this.timer = this.time.addEvent({
      delay: 10_000,
      callback: this.finishGame,
      callbackScope: this,
    });
  }

  private async finishGame() {
    this.timer?.remove(false);
    this.scene.pause();

    const today = new Date().toISOString().slice(0, 10);
    const result = await postFortune(today, this.snacks);

    alert(`【${result.grade}】\n${result.message}`); // MVP: 後でかわいいモーダルに置換

    this.finishedCb();
  }
}