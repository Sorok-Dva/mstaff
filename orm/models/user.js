module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
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
      type: DataTypes.STRING
    },
    town: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING
    },
    photo: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM,
      values: ['admin', 'candidate', 'es', 'demo'],
      allowNull: false
    },
    key: {
      type: DataTypes.STRING
    },
    validated: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false
    },
    opts: {
      type: DataTypes.JSON,
      get() {
        let opts = this.getDataValue('opts') === undefined ? '{}' : this.getDataValue('opts');
        return JSON.parse(opts);
      },
      set(data) {
        this.setDataValue('opts', JSON.stringify(data));
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
    User.hasMany(models.ESAccount, {
      foreignKey: 'user_id',
      sourceKey: 'id'
    });
  };
  return User;
};