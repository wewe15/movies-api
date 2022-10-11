'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('users', [{
      name: 'admin',
      email: 'admin@email.com',
      role: 'admin',
      password: '$2b$10$8Vk77fe2q.QK2Gbvf/jfWOsxwfoB8nt7ijRrGUV1.SK0icZNCbOeG',
      birthdate: '1/9/2010',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user',
      email: 'user@email.com',
      role: 'user',
      password: '$2b$10$sNDcXpvNdNK57/RLUwFAtOBglf8op0tCS84BWZ7IRDP87XwtboLZu',
      birthdate: '1/7/1999',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
