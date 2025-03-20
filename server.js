import path from 'path'; // Importerar path
import express from 'express'; // Importerar express
import sqlite3 from 'sqlite3'; // Importerar sqlite3
import cors from 'cors'; // Importerar cors

import { fileURLToPath } from 'url'; // Importerar fileURLToPath

const filename = fileURLToPath(import.meta.url); // Får fram filnamnet
const dirname = path.dirname(filename); // Får fram mappen där filen ligger

const dbPath = path.join(dirname, 'database.db'); // Går tillbaka en mapp och in i database.db
const db = new sqlite3.Database(dbPath); // Skapar en databas
const app = express(); // Skapar en express app
app.use(cors()); // Middleware för att kunna använda CORS
app.use(express.json()); // Middleware för att kunna använda JSON
const PORT = 4321;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

// Hämta alla recept
app.get('/recipes', (req, res) => {
    const query = 'SELECT * FROM recipes'; // SQL query
    db.all(query, (err, rows) => { // Hämtar alla rader från databasen
        if (err) {
            res.status(500).json({ error: err.message }); // Om det blir fel
            return;
        }
        res.json(rows); // Returnerar alla rader
    });
});

//Hämta alla ingredienser
app.get('/ingredients', (req, res) => {
    const query = 'SELECT * FROM Ingredients'; // SQL query
    db.all(query, (err, rows) => { // Hämtar alla rader från databasen
        if (err) {
            res.status(500).json({ error: err.message }); // Om det blir fel
            return;
        }
        res.json(rows); // Returnerar alla rader
    });
});

app.get('/recipe/:recipeName', (req, res) => {
    const recipeName = req.params.recipeName; // Hämta receptets namn från URL-parametern
    const query = `
        SELECT r.recipe_name, r.instructions, r.cooking_time, r.servings, 
               i.ingredient_name, ri.quantity 
        FROM Recipes r
        JOIN Recipe_Ingredients ri ON r.recipe_id = ri.recipe_id
        JOIN Ingredients i ON ri.ingredient_id = i.ingredient_id
        WHERE r.recipe_name = ?`; // ? används för att förhindra SQL-injection

    db.all(query, [recipeName], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (rows.length === 0) {
            res.status(404).json({ message: "Receptet hittades inte." });
            return;
        }

        // Omvandla resultatet till en mer strukturerad JSON
        const recipe = {
            recipe_name: rows[0].recipe_name,
            instructions: rows[0].instructions,
            cooking_time: rows[0].cooking_time,
            servings: rows[0].servings,
            ingredients: rows.map(row => ({
                ingredient_name: row.ingredient_name,
                quantity: row.quantity
            }))
        };

        res.json(recipe);
    });
});

app.post('/recipes', (req, res) => {
    const query = 'INSERT INTO Recipes (recipe_name, instructions, cooking_time, servings) VALUES (?, ?, ?, ?)'; // SQL query
    const { recipe_name, instructions, cooking_time, servings } = req.body; // Hämtar name och email från request bodyn
    db.run(query, recipe_name, instructions, cooking_time, servings, function (err) { // Lägger till en rad i databasen
        if (err) {
            res.status(500).json({ error: err.message }); // Om det blir fel
            return;
        }
        res.json({ id: this.lastID }); // Returnerar id för den nya raden
    });
});

app.post('/ingredients', (req, res) => {
    const ingredients = req.body.ingredients; // Förväntar sig en array av ingredienser

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "Ingen ingrediens skickades." });
    }

    const query = 'INSERT INTO Ingredients (ingredient_name, quantity_type) VALUES (?, ?)';
    const stmt = db.prepare(query); // Förbereder SQL-frågan

    db.serialize(() => {
        db.run("BEGIN TRANSACTION"); // Starta en transaktion

        ingredients.forEach(({ ingredient_name, quantity_type }) => {
            stmt.run(ingredient_name, quantity_type, function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
            });
        });

        db.run("COMMIT"); // Bekräfta transaktionen
    });

    stmt.finalize(); // Stänger statement
    res.json({ message: "Ingredienser tillagda!" });
});

app.post('/recipe-ingredients', (req, res) => {
    const { recipe_id, ingredients } = req.body;

    if (!recipe_id || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "Recipe ID och en lista med ingredienser krävs." });
    }

    const query = 'INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)';
    const stmt = db.prepare(query);

    db.serialize(() => {
        db.run("BEGIN TRANSACTION"); // Starta en transaktion

        ingredients.forEach(({ ingredient_id, quantity }) => {
            stmt.run(recipe_id, ingredient_id, quantity, function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
            });
        });

        db.run("COMMIT"); // Bekräfta transaktionen
    });

    stmt.finalize();
    res.json({ message: "Ingredienser kopplade till receptet!" });
});

// Uppdatera ett recept
app.put('/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    const { recipe_name, instructions, cooking_time, servings } = req.body;
    const query = `
        UPDATE Recipes
        SET recipe_name = ?, instructions = ?, cooking_time = ?, servings = ?
        WHERE recipe_id = ?
    `;

    db.run(query, [recipe_name, instructions, cooking_time, servings, recipeId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ message: "Receptet hittades inte." });
            return;
        }

        res.json({ message: "Receptet uppdaterades!" });
    });
});

// Uppdatera en ingrediens
app.put('/ingredients/:id', (req, res) => {
    const ingredientId = req.params.id;
    const { ingredient_name, quantity_type } = req.body;
    const query = `
        UPDATE Ingredients
        SET ingredient_name = ?, quantity_type = ?
        WHERE ingredient_id = ?
    `;

    db.run(query, [ingredient_name, quantity_type, ingredientId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ message: "Ingrediensen hittades inte." });
            return;
        }

        res.json({ message: "Ingrediensen uppdaterades!" });
    });
});

// Uppdatera en koppling mellan recept och ingredienser
app.put('/recipe-ingredients/:id', (req, res) => {
    const recipeIngredientId = req.params.id;
    const { recipe_id, ingredient_id, quantity } = req.body;
    const query = `
        UPDATE Recipe_Ingredients
        SET recipe_id = ?, ingredient_id = ?, quantity = ?
        WHERE id = ?
    `;

    db.run(query, [recipe_id, ingredient_id, quantity, recipeIngredientId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ message: "Kopplingen hittades inte." });
            return;
        }

        res.json({ message: "Kopplingen uppdaterades!" });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})