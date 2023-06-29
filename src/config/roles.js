const allRoles = {
  user: [],
  admin: ['ADMIN'],
  subAdmin: ['SUB_ADMIN'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
