const Sequelize = require('sequelize');
const { sequelize } = require('../config/connections');
const { User }  = require('./user');

const Subscriber = sequelize.define('subscriber', {
    id: { 
        type: Sequelize.UUID, 
        primaryKey: true,
        defaultValue:  Sequelize.UUIDV4
    },
    email: {  
        type: Sequelize.STRING(128),  
        allowNull: false,  
        unique: 'emailAndUserId',
        validate: {
            isEmail: true
        }
    },
    userId: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'userId'},
        index: true
    },
}, {
    timestamps: true,
});

Subscriber.associate = models => {
    // many-to-one relationship with the User model (i.e., a subscriber belongs to a user)
    Subscriber.belongsTo(models.User, { foreignKey: "userId" });
};

module.exports = Subscriber;