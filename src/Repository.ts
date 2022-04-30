import _ from 'lodash';
import { Client } from '@notionhq/client';

import { assert, isNotionDatabase } from './internal/typeguards';

import type { DatabaseMetadata, NotionDatabase } from './internal/types';
import type { BaseEntity, Filter } from './types';
import { mapNotionToEntity } from './EntityMapper';

export class Repository<EntityType extends BaseEntity> {
  constructor(private client: Client, private meta: DatabaseMetadata) {}

  async count(filter: Filter<EntityType>) {
    //
  }

  // Create

  async create(data: Omit<EntityType, 'id'>) {
    //
  }

  // Find

  async find(filter: Filter<EntityType>): Promise<EntityType[]> {
    const response = await this.client.databases.query({
      database_id: this.meta.id,
    });
    return response.results.map((it) => mapNotionToEntity(it as any, this.meta.propertiesMap));
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

  private async getNotionDatabase(): Promise<NotionDatabase> {
    try {
      const notion = await this.client.databases.retrieve({
        database_id: this.meta.id,
      });
      assert(isNotionDatabase(notion));

      return notion;
    } catch (error) {
      throw new Error(`Failed to fetch Notion database (id=${this.meta.id})`);
    }
  }
}
