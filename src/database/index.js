const Sequelize = require('sequelize');
const configDatabase = require('../config/database');
const mongoose = require('mongoose');

const User = require('../app/models/User');
const Product = require('../app/models/Product');
const Category = require('../app/models/Category');

const models = [User, Product, Category];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(configDatabase);
        models.map(model => model.init(this.connection))
            .map(
                (model) => model.associate && model.associate(this.connection.models)
            );
    }

    mongo() {
        this.mongoConnection = mongoose.connect(
            'mongodb://localhost:27017/IfBurger',
        );
    }
}

module.exports = new Database();
