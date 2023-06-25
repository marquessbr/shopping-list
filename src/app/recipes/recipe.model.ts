import { Ingredient } from "../shared/ingredients.model";

export class Recipe {
    public name: string;
    public description: string;
    public imagePath: string;
    public ingedients: Ingredient[];

    constructor(
        name: string,
        description: string,
        imagePath: string,
        ingredients: Ingredient[]
    ) {
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.ingedients = ingredients;
    }
}
