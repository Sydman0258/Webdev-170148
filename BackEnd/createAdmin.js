const User = require('./model/userSchema');

async function createAdmin() {
  const [admin, created] = await User.findOrCreate({
    where: { username: 'admin' },
    defaults: {
      firstName: 'Admin',
      surname: 'User',
      email: 'admin@example.com',
      password: '000000',  // **plain password, NOT hashed**
      dob: '1990-01-01',
      isAdmin: true,
    },
  });

  if (!created) {
    // Update password if admin already exists
    admin.password = '000000';  // plain password
    await admin.save(); // triggers beforeUpdate hook to hash
    console.log('Admin password updated');
  } else {
    console.log('Admin created');
  }
}

createAdmin().catch(console.error);
