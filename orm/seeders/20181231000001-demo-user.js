'use strict';

const _ = require('lodash');

let rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
let users = [
  {
    firstName: 'Edouard',
    lastName: 'Dounet',
    email: 'ead@medikstaff.com',
    password: '$2a$10$gVLCV2wzSpdNs1TPLiry7uwbUK1ai6XoGhbbGm55SxaN7RWCcWOlK',
    birthday: new Date(rand(1950, 2001), rand(1, 12), rand(1, 30)),
    postal_code: '75000',
    town: 'PARIS',
    country: 'France',
    phone: '',
    role: 'Admin',
    type: 'admin'
  },{
    firstName: 'Rodolphe',
    lastName: 'Mstaff',
    email: 'rp@medikstaff.com',
    password: '$2a$10$gVLCV2wzSpdNs1TPLiry7uwbUK1ai6XoGhbbGm55SxaN7RWCcWOlK',
    birthday: new Date(rand(1950, 2001), rand(1, 12), rand(1, 30)),
    postal_code: '75000',
    town: 'PARIS',
    country: 'France',
    phone: '',
    role: 'Admin',
    type: 'admin'
  }, {
    firstName: 'Llyam',
    lastName: 'Garcia',
    email: 'garcia.llyam@gmail.com',
    password: '$2a$10$CeXEN8LzC6YFe7GQ/Qh23OH7oalSeFJBwDVqxI4Z2RiSaU4WdpJVu',
    birthday: new Date(1998, 7, 10),
    postal_code: '93400',
    town: 'Saint-Ouen',
    country: 'France',
    phone: '0768808890',
    role: 'Admin',
    type: 'admin'
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
    role: 'Admin',
    type: 'admin'
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    let records = [];

    users.forEach((user) => {
      records.push(user);
    });

    return queryInterface.bulkInsert('Users', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};