/* eslint-disable @typescript-eslint/no-explicit-any */
class QueryBuilder {
  
  public model: any;

  public query: Record<string, unknown>;

  constructor(model: any, query: Record<string, unknown>) {
    this.model = model;
    this.query = query;
  }

  search(searchQuery: string[]) {
    const searchString = this?.query?.search || "";
    this.model = this.model.find({
      $or: searchQuery.map((field) => ({
        [field]: { $regex: searchString, $options: "i" },
      })),
    });
    return this;
  }

  filter() {
    const filteredQueryObj = { ...this?.query };
    const excludeField = ["search", "sort", "page", "limit", "fields"];
    excludeField.forEach((field) => {
      delete filteredQueryObj[field];
    });

    this.model = this.model.find(filteredQueryObj);
    return this;
  }

  sort() {
    const sort = this?.query?.sort || "-createdAt";
    this.model = this.model.sort(sort);
    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 15;
    const skip = (page - 1) * limit;
    this.model = this.model.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.model = this.model.select(fields);
    return this;
  }

  async countDocuments() {
    const filter = await this.model.getFilter();
    const totalRecords = await this.model.model.countDocuments(filter);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 15;
    const totalPages = Math.ceil(totalRecords / limit);
    return {
      page,
      limit,
      totalRecords,
      totalPages,
    };
  }
}
export default QueryBuilder;
