class CrudManager {
  constructor(config) {
    this.api = config.api;
    this.table = document.getElementById(config.tableId);
    this.form = document.getElementById(config.formId);
    this.modalId = config.modalId;

    this.data = [];
    this.editId = null;
  }

  async load() {
    const response = await API.get(this.api);

    const key = Object.keys(response).find((key) =>
      Array.isArray(response[key]),
    );

    this.data = response[key] || [];

    return this.data;
  }

  async create(data) {
    return await API.post(`${this.api}/create`, data);
  }

  async update(id, data) {
    return await API.put(`${this.api}/${id}`, data);
  }

  async delete(id) {
    return await API.delete(`${this.api}/${id}`);
  }
}
