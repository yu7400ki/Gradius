import type { EnemyModel } from '$/commonTypesWithClient/models';
import { enemyRepository } from '$/repository/enemyRepository';
import { enemyIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';

let intervalId: NodeJS.Timeout | null = null;
export const enemyUseCase = {
  init: () => {
    intervalId = setInterval(() => {
      enemyUseCase.create();
      enemyUseCase.update();
    }, 100);
  },
  stop: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  },
  create: async (): Promise<EnemyModel | null> => {
    const count = await enemyRepository.count();
    if (count > 3) return null;
    const enemyData: EnemyModel = {
      enemyId: enemyIdParser.parse(randomUUID()),
      pos: { x: 1000, y: Math.floor(Math.random() * 800) },
      score: 100,
      vector: { x: -2, y: 0 },
      type: 0,
    };
    await enemyRepository.save(enemyData);
    return enemyData;
  },
  findAll: async (): Promise<EnemyModel[]> => {
    const enemies = await enemyRepository.findAll();
    return enemies.length > 0 ? enemies : [];
  },
  move: async (enemyModel: EnemyModel): Promise<EnemyModel | null> => {
    const currentEnemyInfo = await enemyRepository.find(enemyModel.enemyId);
    if (currentEnemyInfo === null) return null;
    const updateEnemyInfo: EnemyModel = {
      ...currentEnemyInfo,
      pos: {
        x: currentEnemyInfo.pos.x + currentEnemyInfo.vector.x,
        y: currentEnemyInfo.pos.y + currentEnemyInfo.vector.y,
      },
    };
    await enemyRepository.save(updateEnemyInfo);
    return updateEnemyInfo;
  },
  delete: async (enemyModel: EnemyModel) => {
    try {
      await enemyRepository.delete(enemyModel.enemyId);
    } catch (e) {
      console.error(e);
    }
  },
  update: async () => {
    const currentEnemyInfos = await enemyRepository.findAll();
    const promises = currentEnemyInfos.map((enemy) => {
      if (enemy.pos.x > 1920 || enemy.pos.x < 50) {
        return enemyUseCase.delete(enemy);
      } else {
        return enemyUseCase.move(enemy);
      }
    });
    await Promise.all(promises);
  },
};