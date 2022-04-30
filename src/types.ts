export interface BaseEntity {
  id: string;
}

export type Filter<EntityType extends BaseEntity> = any;
