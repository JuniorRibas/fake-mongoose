export class FakeCollection {
  constructor(name, apiKey) {
    this.name = name;
    this.apiKey = apiKey || process.env.KEY;
    this.baseUrl = process.env.URL_BASE;
    this.cluster = process.env.CLUSTER;
    this.database = process.env.DATABASE;
    // Inicializando as opções com valores padrão
    this._resetOptions();
  }
  _resetOptions() {
    // Inicializando as opções com valores padrão
    this._options = {
      filter: {},
      sort: {},
      limit: undefined,
      select: {},
      update: {},
    };
    this._operation = "find"; // Operação padrão
  }

  findByIdAndUpdate(id, update) {
    return this.updateOne({ _id: { $oid: id } }, update);
  }

  findById(id) {
    return this.findOne({ _id: { $oid: id } });
  }

  // Método para configurar filtro
  find(filter = {}) {
    this._options.filter = filter;
    this._operation = "find";
    return this;
  }

  async findOne(filter = {}) {
    this._options.filter = filter;
    this._operation = "findOne";

    const document = await this.exec();

    if (document) {
      document.save = () => this._saveDocument(document);
    }
    return document;
  }

  insertOne(document) {
    this._options.document = document;
    this._operation = "insertOne";
    return this.exec(); // `insertOne` é executado imediatamente
  }

  create(document) {
    this._options.document = document;
    this._operation = "insertOne";
    return this.exec(); // `insertOne` é executado imediatamente
  }

  // Método para configurar a atualização e definir a operação
  updateOne(filter, update) {
    this._options.filter = filter;
    this._options.update = update;
    this._operation = "updateOne";
    return this.exec(); // `updateOne` é executado imediatamente
  }

  updateMany(filter, update) {
    this._options.filter = filter;
    this._options.update = update;
    this._operation = "updateMany";
    return this.exec(); // `updateMany` é executado imediatamente
  }

  deleteOne(filter) {
    this._options.filter = filter;
    this._operation = "deleteOne";
    return this.exec(); // `deleteOne` é executado imediatamente
  }

  deleteMany(filter) {
    this._options.filter = filter;
    this._operation = "deleteMany";
    return this.exec(); // `deleteMany` é executado imediatamente
  }

  _saveDocument(document) {
    if (document._id) {
      document._id = { $oid: document._id };
      delete document.createdAt;
      delete document.updatedAt;

      return this.updateOne(
        { _id: document._id },
        {
          $currentDate: { updatedAt: true },
          $set: document,
        }
      );
    } else {
      return this.insertOne(document);
    }
  }

  // Métodos encadeáveis para configurações adicionais
  sort(sort = {}) {
    this._options.sort = sort;
    return this;
  }

  limit(limit = 0) {
    this._options.limit = limit;
    return this;
  }

  select(select = {}) {
    if (typeof select === "string") {
      select = select.split(" ").reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {});
    }
    this._options.select = select;
    return this;
  }

  // Método para execução, necessário para operações de leitura (find, findOne)
  async exec() {
    let body = {};
    // Configurando o corpo da requisição conforme a operação
    if (this._operation === "find") {
      const { filter, sort, limit, select } = this._options;
      body = { filter, sort, limit, projection: select };
    } else if (this._operation === "findOne") {
      const { filter, select } = this._options;
      body = { filter, projection: select };
    } else if (this._operation === "insertOne") {
      body = {
        document: {
          ...this._options.document,
          createdAt: { $date: new Date().toISOString() },
          updatedAt: { $date: new Date().toISOString() },
        },
      };
    } else if (this._operation.startsWith("update")) {
      if (Object.keys(this._options.filter || {}).length === 0) {
        throw new Error("updateOne/updateMany requires an update object");
      }

      body = {
        filter: this._options.filter,
        update: { ...this._options.update },
      };
    } else if (this._operation.startsWith("delete")) {
      if (Object.keys(this._options.filter || {}).length === 0) {
        throw new Error("deleteOne/deleteMany requires a filter object");
      }

      body = { filter: this._options.filter };
    }

    const response = await this._request(this._operation, body);

    let result = undefined;

    // Retorna diretamente o conteúdo sem `document` ou `documents`
    if (this._operation === "findOne") {
      result = response.document || null;
    } else if (this._operation === "find") {
      result = response.documents || [];
    } else {
      result = response;
    }

    this._resetOptions(); // Reseta as opções após a execução
    return result;
  }

  async _request(operation, body) {
    const response = await fetch(`${this.baseUrl}/action/${operation}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": this.apiKey,
      },
      body: JSON.stringify({
        dataSource: this.cluster,
        database: this.database,
        collection: this.name,
        ...body,
      }),
    });

    return response.json();
  }
}
