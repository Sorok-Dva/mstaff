module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: false
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    town: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM,
      values: ['admin', 'candidate', 'es', 'demo'],
      allowNull: false
    }
  }, {
    getterMethods: {
      fullName: () => {
        return `${this.firstName} ${this.lastName}`;
      }
    }
  });
  User.associate = function (models) {
    User.hasOne(models.Candidate, {
      foreignKey: 'user_id',
      as: 'candidate'
    });
    User.hasOne(models.Demo, {
      foreignKey: 'email',
      as: 'demo'
    });
  };
  return User;
};