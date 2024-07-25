import {Schema,model,Types} from "mongoose"

const categoryShema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    image: {
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    addedBy: {
        type: Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true,
    versionKey: false
})

// return image url with localhost
categoryShema.post("find", function (doc) {
    doc.forEach((doc) => {
      doc.image = `localhost:3000/${doc.image}`;
    });
  });

export const Category = model("Category", categoryShema)
 