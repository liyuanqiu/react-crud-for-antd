import type { DataProvider } from 'ra-core';

export const dataProvider: DataProvider = {
  async getList() {
    return {
      data: [],
      total: 0,
    };
  },
  async getOne() {
    return {
      data: {
        id: -1,
      },
    };
  },
  async getMany() {
    return {
      data: [],
    };
  },
  async getManyReference() {
    return {
      data: [],
      total: 0,
    };
  },
  async update() {
    return {
      data: {
        id: -1,
      },
    };
  },
  async updateMany() {
    return {
      data: [],
    };
  },
  async create() {
    return {
      data: {
        id: -1,
      },
    };
  },
  async delete() {
    return {};
  },
  async deleteMany() {
    return {};
  },
};
