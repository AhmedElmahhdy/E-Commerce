
export const updateData = (doc, location)=>{
    for (let key in location) {
        if (location[key]) doc[key] = location[key]
    }
    return doc
}