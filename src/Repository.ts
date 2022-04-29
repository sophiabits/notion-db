import _ from 'lodash';

import { Connection } from './Connection';
import type { BaseEntity, Filter } from './types';

export class Repository<EntityType extends BaseEntity> {
  constructor(private connection: Connection) {}

  async count(filter: Filter<EntityType>) {
    //
  }

  // Create

  async create(data: Omit<EntityType, 'id'>) {
    //
  }

  // Find

  async find(filter: Filter<EntityType>): Promise<EntityType[]> {
    return [];
  }

  async findOne(filter: Filter<EntityType>) {
    const data = await this.find(filter);
    return _.first(data);
  }

  async findById(id: string) {
    //
  }

  // Update

  async update(filter: Filter<EntityType>, update: Partial<Omit<EntityType, 'id'>>) {
    //
  }

  async updateOne(filter: Filter<EntityType>, update: Partial<Omit<EntityType, 'id'>>) {
    //
  }

  async updateById(id: string, update: Partial<Omit<EntityType, 'id'>>) {
    //
  }

  // Delete

  async delete(filter: Filter<EntityType>) {
    //
  }

  async deleteOne(filter: Filter<EntityType>) {
    //
  }

  async deleteById(id: string) {
    //
  }
}
