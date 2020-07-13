import type { DataProvider } from 'ra-core';
import { join } from 'path';

const defaultApiUrl = '/hadesconsole/rest/v1';

const resourceMapping: {
  [k: string]: string;
} = {
  'entity/biz': '/hadesconsole/rest/v1',
};

const sortOrderMapping = {
  ascend: 'ASC',
  descend: 'DESC',
};

export const dataProvider: DataProvider = {
  async getList(resource, params) {
    const {
      pagination: { page, perPage },
      sort: { field, order },
      filter,
    } = params;
    const usp = new URLSearchParams();
    usp.set('page', `${page}`);
    usp.set('size', `${perPage}`);
    if (field !== '') {
      usp.set('sort', `${field},${sortOrderMapping[order]}`);
    }
    Object.entries(filter as { [k: string]: any }).forEach(([k, v]) =>
      usp.set(k, v)
    );
    const res = await fetch(
      `${join(
        resourceMapping[resource] ?? defaultApiUrl,
        resource
      )}?${usp.toString()}`,
      {
        method: 'GET',
      }
    );
    const json = await res.json();
    return {
      data: json.data.content.map((item: any) => {
        if (resource === 'entity/biz') {
          return {
            ...item,
            id: item.entityId,
          };
        }
        return item;
      }),
      total: json.data.totalElements,
    };
  },
  async getOne(resource, params) {
    const { id } = params;
    const res = await fetch(
      join(resourceMapping[resource] ?? defaultApiUrl, resource, `${id}`)
    );
    const json = await res.json();
    return {
      data: json.data,
    };
  },
  async getMany(resource, params) {
    const { ids } = params;
    const result = await Promise.all(
      ids.map((id) => this.getOne(resource, { id }))
    );
    return {
      data: result.map((item) => item.data),
    };
  },
  async getManyReference(/* resource, params */) {
    // console.log(apiUrl, resource, params);
    // TODO
    return {
      data: [],
      total: 0,
    };
  },
  async create(resource, params) {
    const { data } = params;
    const res = await fetch(
      join(resourceMapping[resource] ?? defaultApiUrl, resource),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    const json = await res.json();
    return {
      data: json.data,
    };
  },
  async update(resource, params) {
    const { id, data } = params;
    const res = await fetch(
      join(resourceMapping[resource] ?? defaultApiUrl, resource, `${id}`),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    const json = await res.json();
    return {
      data: json.data,
    };
  },
  async updateMany(resource, params) {
    const { ids, data } = params;
    const result = await Promise.all(
      ids.map((id) =>
        this.update(resource, {
          id,
          data,
          // 此处为了满足类型，写了一个错误的 previouseData
          previousData: data,
        })
      )
    );
    return {
      data: result.map((item) => item.data.id),
    };
  },
  async delete(resource, params) {
    const { id } = params;
    // @ts-ignore
    const { previousData } = params;
    await fetch(
      join(resourceMapping[resource] ?? defaultApiUrl, resource, `${id}`),
      {
        method: 'DELETE',
      }
    );
    return {
      data: previousData,
    };
  },
  async deleteMany(resource, params) {
    const { ids } = params;
    await Promise.all(ids.map((id) => this.delete(resource, { id })));
    return {
      data: ids,
    };
  },
};
