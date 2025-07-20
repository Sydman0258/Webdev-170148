const SequelizeMock = require('sequelize-mock');
const bcrypt = require('bcrypt');

jest.mock('bcrypt');

const dbMock = new SequelizeMock();

const User = dbMock.define('User', {
  id: 1,
  firstName: 'John',
  surname: 'Doe',
  email: 'john@example.com',
  username: 'john123',
  password: 'plaintextpassword',
  dob: '1990-01-01',
  isAdmin: false,
});

// Helper to add instance method to User instances
function addValidPasswordMethod(userInstance) {
  userInstance.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
}

bcrypt.genSalt.mockResolvedValue('salt');
bcrypt.hash.mockResolvedValue('hashedpassword');
bcrypt.compare.mockResolvedValue(true);

describe('User Model', () => {
  test('should create a user and simulate password hashing', async () => {
    const user = await User.create({
      firstName: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      username: 'john123',
      password: 'plaintextpassword',
      dob: '1990-01-01',
    });

    // Manually add instance method to this instance
    addValidPasswordMethod(user);

    // Simulate hook manually
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));

    expect(user.firstName).toBe('John');
    expect(user.email).toBe('john@example.com');
    expect(user.username).toBe('john123');
    expect(user.password).toBe('hashedpassword'); // Because bcrypt.hash is mocked
  });

  test('validPassword returns true for correct password', async () => {
    // Build instance manually and add method
    const user = User.build({ password: 'hashedpassword' });
    addValidPasswordMethod(user);

    bcrypt.compare.mockResolvedValue(true);

    const isValid = await user.validPassword('plaintextpassword');

    expect(bcrypt.compare).toHaveBeenCalledWith('plaintextpassword', 'hashedpassword');
    expect(isValid).toBe(true);
  });

  test('validPassword returns false for incorrect password', async () => {
    const user = User.build({ password: 'hashedpassword' });
    addValidPasswordMethod(user);

    bcrypt.compare.mockResolvedValue(false);

    const isValid = await user.validPassword('wrongpassword');

    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    expect(isValid).toBe(false);
  });
});
