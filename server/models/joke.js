import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: path.join(__dirname, "../database.sqlite"),
});

const Joke = sequelize.define("Joke", {
	question: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	answer: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

export default Joke;
export { sequelize };
