
export class ApiFeatures {
    constructor(query, mongooseQuery) {  
        // req.query => query
        // mongooseQuery => Model
        this.query = query  
        this.mongooseQuery = mongooseQuery
    }
    
    filter() {
        const {page =1 , limit = 3,...filters} = this.query
        const mongooseQuery = JSON.stringify(filters)
        const replacedFilters = mongooseQuery.replace(/\b(gt|gte|lt|lte|regex|in|ne|eq)\b/g, match => `$${match}`)
        const mongooseQueryParsed = JSON.parse(replacedFilters)
      
        this.mongooseQuery = this.mongooseQuery.find(mongooseQueryParsed)
        
        return this

    }

   pagination() {
    const {page =1 , limit = 3} = this.query
    const skip = (page - 1) * limit

    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)

    return this
    };

    sort() {
        const sort = this.query.sort
        this.mongooseQuery = this.mongooseQuery.sort(sort)

        return this
    }
}