const bcrypt = require('bcryptjs');
// const sendGridMail = require('@sendgrid/mail');
// sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require('../models/User');

module.exports = {
  getAll,
  getById,
  getByEmail,
  getUserByCondition,
  getPasswordByEmail,
  getUserListWithPagination,
  getUserListTotalCount,
  getUserPasswordByEmail,
  create,
  update,
  delete: _delete,
  resetPassword
};

async function getAll() {
  const users = await User.find().select('-password');
  return users;
}

async function getUserListWithPagination(params) {
  const { role, rows, filter, page, is_deleted } = params;
  const users = await User.aggregate([
    {
      $match: {
        role,
        is_deleted
      }
    },
    {
      $match: {
        $or: [
          {
            first_name: { $regex: filter, $options: 'i' }
          },
          {
            last_name: { $regex: filter, $options: 'i' }
          },
          {
            email: { $regex: filter, $options: 'i' }
          }
        ]
      }
    },
    { $skip: (page > 0 ? page - 1 : 0) * rows },
    { $limit: rows }
  ]);
  return users;
}

async function getUserListTotalCount(params) {
  const { role, filter, is_deleted } = params;
  const users = await User.aggregate([
    {
      $match: {
        role,
        is_deleted
      }
    },
    {
      $match: {
        $or: [
          {
            first_name: { $regex: filter, $options: 'i' }
          },
          {
            last_name: { $regex: filter, $options: 'i' }
          }
        ]
      }
    }
  ]);
  return users.length;
}

async function getById(id) {
  return await User.findById(id).select('-password');
}

async function getByEmail(email) {
  return await User.findOne({ email: email }).select('-password');
}

async function getUserByCondition(condition) {
  return await User.findOne(condition).select('-password');
}

async function getPasswordByEmail(email) {
  return await User.findOne({ email: email }).select('password');
}

async function getUserPasswordByEmail(email) {
  return await User.findOne({ email, role: 0 });
}

async function create(userParams) {
  // validate email uniqueness
  if (await User.findOne({ email: userParams.email })) {
    throw { code: 409, message: 'Email already exists' };
  }

  const user = new User(userParams);

  // hash password
  if (userParams.password) {
    user.password = bcrypt.hashSync(userParams.password, 10);
  }

  await user.save();

  return user;
}

async function update(id, userParams) {
  const user = await User.findById(id);

  if (!user) return { code: 500, message: 'User not found' };
  if (
    user.email !== userParams.email &&
    (await User.findOne({ email: userParams.email }))
  ) {
    return { code: 500, message: 'Email is already taken' };
  }

  Object.assign(user, userParams);

  await user.save();

  return user;
}

async function _delete(id) {
  return await User.updateOne({ _id: id }, { is_deleted: true });
}

async function resetPassword(email) {
  try {
    const user = await User.findOne({ email, role: 0 });
    if (!user) {
      return false;
    }
    const password =
      Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    // await sendGridMail.send({
    //   to: `${email}`,
    //   from: 'no-reply@designtimelapse.com',
    //   subject: 'Changed your password',
    //   text: 'Please verify your initial password to complete registration',
    //   html: `
    //         <h4>Hi, ${user.first_name} </h4>
    //         <h4>Thanks for your interest in joining DesignTimelapse! Below is your initial password. Please change your password for security</h4>
    //         <h3>${password}</h3>
    //       `
    // });
    user.password = bcrypt.hashSync(`${password}`, 10);
    await user.save();
    return true;
  } catch (err) {
    console.error(err.body);
    return false;
  }
}
