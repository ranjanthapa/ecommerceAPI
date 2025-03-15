
export class APIFeature {
  private queryStr: Record<string, any>;
  public query;
  constructor(query: any, queryString: Record<string, any>) {
    this.query = query;
    this.queryStr = queryString;
  }

  sort(): this {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("createdAt");
    }
    return this;
  }

  limitFields(): this {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }


  pagination() : this {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this
  }
}
