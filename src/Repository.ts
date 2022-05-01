import _ from 'lodash';
import { Client } from '@notionhq/client';

import { assert, isNotionDatabase } from './internal/typeguards';

import type { DatabaseMetadata, NotionDatabase } from './internal/types';
import type { BaseEntity, Filter } from './types';

import { buildQuery } from './QueryBuilder';
import { mapEntityToNotion, mapNotionToEntity, normalizeNotionProperties } from './EntityMapper';

type EntityUpdater<EntityType extends BaseEntity> = Partial<Omit<EntityType, 'id'>>;

export class Repository<EntityType extends BaseEntity> {
  constructor(private client: Client, private meta: DatabaseMetadata) {}

  async count(filter: Filter<EntityType>) {
    const data = await this.find(filter);
    return data.length;
  }

  // Create

  async create(data: Omit<EntityType, 'id'>) {
    const db = await this.getNotionDatabase();
    const notion = mapEntityToNotion(data, db, this.meta.propertiesMap);

    // @ts-ignore Notion's types are awful
    const response = await this.client.pages.create(notion);
    assert('properties' in response);

    const properties = normalizeNotionProperties(response.properties);
    return mapNotionToEntity(
      { id: response.id, parent: { database_id: this.meta.id, type: 'database_id' }, properties },
      this.meta.propertiesMap,
    );
  }

  // Find

  async find(filter: Filter<EntityType>): Promise<EntityType[]> {
    const query = buildQuery(await this.getNotionDatabase(), this.meta, filter);
    const response = await this.client.databases.query(query);

    return response.results.map((it) => mapNotionToEntity(it as any, this.meta.propertiesMap));
  }

  async findOne(filter: Filter<EntityType>) {
    const data = await this.find(filter);
    return _.first(data);
  }

  async findById(id: string): Promise<EntityType> {
    const record = await this.client.pages.retrieve({
      page_id: id,
    });
    assert('properties' in record);

    return mapNotionToEntity<EntityType>(
      {
        id: record.id,
        parent: { database_id: this.meta.id, type: 'database_id' },
        properties: normalizeNotionProperties(record.properties),
      },
      this.meta.propertiesMap,
    );
  }

  // Update

  async update(filter: Filter<EntityType>, update: EntityUpdater<EntityType>) {
    const queryResults = await this.find(filter);
    const updatedEntities: EntityType[] = [];
    for (const entity of queryResults) {
      const updatedEntity = await this.updateById(entity.id, update);
      updatedEntities.push(updatedEntity);
    }
    return updatedEntities;
  }

  async updateOne(filter: Filter<EntityType>, update: EntityUpdater<EntityType>) {
    const entity = await this.findOne(filter);
    if (entity) {
      const updatedEntity = await this.updateById(entity.id, update);
      return updatedEntity;
    }
  }

  async updateById(id: string, update: EntityUpdater<EntityType>) {
    const db = await this.getNotionDatabase();

    const mappedUpdate = mapEntityToNotion(update, db, this.meta.propertiesMap);

    const updatedRecord = await this.client.pages.update({
      page_id: id,
      properties: mappedUpdate.properties,
      archived: false,
    });
    assert('properties' in updatedRecord);

    return mapNotionToEntity<EntityType>(
      {
        id: updatedRecord.id,
        parent: { database_id: this.meta.id, type: 'database_id' },
        properties: normalizeNotionProperties(updatedRecord.properties),
      },
      this.meta.propertiesMap,
    );
  }

  // Delete

  async delete(filter: Filter<EntityType>) {
    const entities = await this.find(filter);
    for (const entity of entities) {
      await this.deleteById(entity.id);
    }
  }

  async deleteOne(filter: Filter<EntityType>) {
    const entity = await this.findOne(filter);
    if (entity) {
      await this.deleteById(entity.id);
    }
  }

  async deleteById(id: string) {
    await this.client.pages.update({
      page_id: id,
      archived: true,
    });
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
