const Yup = require('yup');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../schemas/Order');
const User = require('../models/User');

class OrderController {
    async store(request, response) {
        const schema = Yup.object().shape({
            products: Yup.array()
                .required()
                .of(
                    Yup.object().shape({
                        id: Yup.number().required(),
                        quantity: Yup.number().required()
                    })
                ),
        });

        try {
            await schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const productsId = request.body.products.map(
            product => product.id
        );

        const uptatedProducts = await Product.findAll({
            where: {
                id: productsId,
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name'],
                },
            ],
        });

        const editedProduct = uptatedProducts.map(product => {
            const productIndex = request.body.products.findIndex(
                (requestProduct) => requestProduct.id === product.id
            );

            const newProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category.name,
                url: product.url,
                quantity: request.body.products[productIndex].quantity
            };
            return newProduct;
        });

        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            products: editedProduct,
            status: 'Pedido realizado com sucesso!',
        };

        const orderResponse = await Order.create(order);

        return response.status(201).json(orderResponse);
    }

    async index(request, response) {
        const orders = await Order.find();

        return response.json(orders);
    }

    async update(request, response) {
        const schema = Yup.object().shape({
            status: Yup.string().required(),
        });

        try {
            await schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { admin: isAdmin } = await User.findByPk(request.userId);

        if (!isAdmin) {
            return response.status(401).json({ error: 'usuário não autorizado' });
        }

        const { id } = request.params;
        const { status } = request.body;

        try {
            await Order.updateOne({ _id: id }, { status });
        } catch (error) {
            return response.status(400).json({ error: error.message });
        }

        return response.json({ message: 'status atualizado com sucesso' });
    }
}

module.exports = new OrderController();
