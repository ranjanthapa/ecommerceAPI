import { Document, model, Schema } from "mongoose";

interface CategoryI extends Document {
  name: string;
}

const CategorySchema = new Schema<CategoryI>({
  name: { type: String, required: true },
});



const Category = model('Category', CategorySchema);
export default Category;