'use strict';

const _ = require('lodash');

let rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
let firstNames = ['John', 'Lisa', 'Lucas', 'Maelis', 'Laura', 'Baptiste', 'William', 'Benjamin', 'Pauline', 'Charline', 'Anita', 'Marie'];
let lastNames = ['Doe', 'Dupont', 'Laporte', 'Boulanger', 'Saurin', 'Lepetit', 'Legrand', 'Curie', 'Jaipadydai', 'Ifaibo'];
let users = [
  {
    firstName: 'Admin',
    lastName: 'Mstaff',
    email: 'admin@mstaff.co',
    password: '$2a$10$gVLCV2wzSpdNs1TPLiry7uwbUK1ai6XoGhbbGm55SxaN7RWCcWOlK',
    birthday: new Date(rand(1950, 2001), rand(1, 12), rand(1, 30)),
    postal_code: '75000',
    town: 'PARIS',
    country: 'France',
    phone: '0601020304',
    role: 'Admin',
    type: 'admin'
  }, {
    firstName: 'Llyam',
    lastName: 'Garcia',
    email: 'garcia.llyam@gmail.com',
    password: '$2a$10$CeXEN8LzC6YFe7GQ/Qh23OH7oalSeFJBwDVqxI4Z2RiSaU4WdpJVu',
    birthday: new Date(rand(1950, 2001), rand(1, 12), rand(1, 30)),
    postal_code: '93400',
    town: 'Saint-Ouen',
    country: 'France',
    phone: '0768808890',
    role: 'User',
    type: 'candidate'
  }, {
    firstName: 'Romain',
    lastName: 'Piccolo  ',
    email: 'piccolo.rom@gmail.com',
    password: '$2a$10$Jpo0iPvwuzBzFt.i8qmvie8Yx7BIs6MfvnaQZS23qwWuIMmvzfD.G',
    birthday: new Date(rand(1950, 2001), rand(1, 12), rand(1, 30)),
    postal_code: '82000',
    town: 'Montauban',
    country: 'France',
    phone: '0629326630',
    role: 'User',
    type: 'candidate'
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    let records = [];

    users.forEach((user) => {
      records.push(user);
    });

    for (let i = 0; i < 25; i++) {
      records.push({
        firstName: _.sample(firstNames),
        lastName: _.sample(lastNames),
        email: `seeder-${i}@demo.com`,
        password: 'passwordBidon',
        birthday: new Date(rand(1950, 2001), rand(1, 12), rand(1, 30)),
        postal_code: '75000',
        town: 'PARIS',
        country: 'France',
        phone: `+33700${Math.floor(Math.random() * 999999) + 100000  }`,
        role: 'User',
        type: 'candidate'
      });
    }
    return queryInterface.bulkInsert('Users', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};