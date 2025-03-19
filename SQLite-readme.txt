Kör kommando i BASH:
./sqlite/sqlite3 database.db

------------------------------------------Skapa table för recept------------------------------------------
CREATE TABLE Recipes ( 
    recipe_id INTEGER PRIMARY KEY, 
    recipe_name TEXT NOT NULL, 
    instructions TEXT, 
    cooking_time INTEGER, 
    servings INTEGER 
); 
 
------------------------------------------Skapa table för ingredienser------------------------------------------
CREATE TABLE Ingredients ( 
    ingredient_id INTEGER PRIMARY KEY, 
    ingredient_name TEXT NOT NULL, 
    quantity_type TEXT 
); 

 
------------------------------------------Skapa ett table som skapar en relation till recept och ingredienser------------------------------------------
CREATE TABLE Recipe_Ingredients ( 
    recipe_id INTEGER, 
    ingredient_id INTEGER, 
    quantity TEXT, 
    PRIMARY KEY (recipe_id, ingredient_id), 
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id), 
    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id)  
); 

------------------------------------------Lägg till receptet i Recipes------------------------------------------

INSERT INTO Recipes (recipe_name, instructions, cooking_time, servings) 
VALUES ('Skriv namn', 'Skriv instruktioner här', Skriv tillagningstid här, Skriv antal portioner här);

Exempel:

INSERT INTO Recipes (recipe_name, instructions, cooking_time, servings) 
VALUES ('Pannkakor', 'Blanda mjöl, ägg och mjölk. Stek i panna.', 20, 4);

------------------------------------------Lägg till ingredienser i Ingredients------------------------------------------

INSERT INTO Ingredients (ingredient_name, quantity_type) 
VALUES 
    ('Skriv ingrediens här', 'skriv antal, vikt eller volym'), 
    ('Skriv ingrediens här', 'skriv antal, vikt eller volym'), 
    ('Skriv ingrediens här', 'skriv antal, vikt eller volym');
	
	Exempel:
	INSERT INTO Ingredients (ingredient_name, quantity_type) 
VALUES 
    ('Mjöl', 'gram'), 
    ('Ägg', 'st'), 
    ('Mjölk', 'ml');
	
------------------------------------------Kolla vilket id som receptet har fått------------------------------------------
SELECT recipe_id, recipe_name FROM Recipes;


------------------------------------------Koppla ingredienser till receptet i Recipe_Ingredients------------------------------------------
Anta att detta returnerar recipe_id = 1. Lägg då till relationerna:

INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, quantity) 
VALUES 
    (id, (SELECT ingredient_id FROM Ingredients WHERE ingredient_name = 'Skriv ingrediens här'), 'skriv antal, vikt eller volym'), 
    (id, (SELECT ingredient_id FROM Ingredients WHERE ingredient_name = 'Skriv ingrediens här'), 'skriv antal, vikt eller volym'), 
    (id, (SELECT ingredient_id FROM Ingredients WHERE ingredient_name = 'Skriv ingrediens här'), 'skriv antal, vikt eller volym');
	
Exempel: INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, quantity) 
VALUES 
    (1, (SELECT ingredient_id FROM Ingredients WHERE ingredient_name = 'Mjöl'), '200g'), 
    (1, (SELECT ingredient_id FROM Ingredients WHERE ingredient_name = 'Ägg'), '2st'), 
    (1, (SELECT ingredient_id FROM Ingredients WHERE ingredient_name = 'Mjölk'), '500ml');
	
	
------------------------------------------Visa ett specifikt recept (t.ex. "Pannkakor")------------------------------------------
	SELECT r.recipe_name, r.instructions, r.cooking_time, r.servings, 
       i.ingredient_name, ri.quantity 
FROM Recipes r
JOIN Recipe_Ingredients ri ON r.recipe_id = ri.recipe_id
JOIN Ingredients i ON ri.ingredient_id = i.ingredient_id
WHERE r.recipe_name = 'Pannkakor';
	
------------------------------------------Visa alla recept------------------------------------------
SELECT * FROM Recipes;

------------------------------------------Visa alla ingredienser------------------------------------------
SELECT * FROM Ingredients;