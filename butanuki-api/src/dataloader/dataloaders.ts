import {
  createEntitiesDataloader,
  createEntityDataloader,
} from './entity.dataloader';
import { DataSource } from 'typeorm';
import { buildRepositories } from '../utils';
import { createActiveOrderByTemplateIdDataloader } from './active.order.dataloader';

export type DLoaders = ReturnType<typeof buildDataloaders>;

export const buildDataloaders = (data: DataSource) => {
  const db = buildRepositories(data.manager);
  return {
    vaultById: createEntityDataloader(db.vault),
    orderTemplateById: createEntityDataloader(db.orderTemplate),
    orderTemplatesByVaultId: createEntitiesDataloader(
      db.orderTemplate,
      'vaultId',
    ),
    latestActiveOrderByTemplateId: createActiveOrderByTemplateIdDataloader(db),
  };
};
