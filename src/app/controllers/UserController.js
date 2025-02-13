const { v4 } = require("uuid");
const Yup = require('yup');
const User = require("../models/User");

class UserController {
    async store(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            admin: Yup.boolean(),
        });

        //usando o Yup para mostrar mensagem de erro
        //if (!(await schema.isValid(request.body))) {
        //return response
        //    .status(400)
        //      .json({ error: "Make sure your data is correct" })
        //}

        //segundo jeito de usar
        try {
            await schema.validateSync(request.body, {abortEarly: false});
        } catch (err) {
            return response.status(400).json({error: err.errors});
        }

        const { name, email, password, admin } = request.body;

        const userExists = await User.findOne({
            where:{ email },
        });

        if (userExists) {
            return response.status(409).json({error: 'User already exists' });
        }

        console.log(userExists);

        const user = await User.create({
            id: v4(),
            name,
            email,
            password,
            admin,
        });

        return response.status(201).json({ id: user.id, name, email, admin });
    }
}

module.exports = new UserController();
