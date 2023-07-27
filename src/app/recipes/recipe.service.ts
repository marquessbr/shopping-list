import { Injectable } from "@angular/core";

import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredients.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";


@Injectable()
export class RecipeService {

    private recipes: Recipe[] = [
        new Recipe(
            'A test recipe',
            'Only one test recipe',
            'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_960_720.jpg',
            [ new Ingredient('Meeat', 1), new Ingredient('French Fries', 20)]
        ),
        new Recipe(
            'A test recipe dois',
            'Only one test recipe dois',
            'https://www.foodandwine.com/thmb/gE_M3yiTJCgZPKSOEVmjQowKv9E=/750x0/filters:no_upscale():max_bytes(150000):strip_icc()/Tamarind-Chicken-FT-RECIPE0522-80072d93f7bc4bc7abf1dcf5b5317b0c.jpg',
            [ new Ingredient('Buns', 2), new Ingredient('Meat', 10)]
        )
    ];

    constructor(private slService: ShoppingListService) {}

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index]
    }

    addIngredientToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }
}
