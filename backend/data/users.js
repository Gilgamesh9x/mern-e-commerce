import hashPassword from "../utils/hashPasswords.js";

const users = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    password: await hashPassword("pw123456"),
    isAdmin: true,
  },
  {
    name: "Hajar Tajaoui",
    email: "hajar@gmail.com",
    password: await hashPassword("pw123456"),
    isAdmin: false,
  },
  {
    name: "Meryem Tajaoui",
    email: "meryem@gmail.com",
    password: await hashPassword("pw123456"),
    isAdmin: false,
  },
];

export default users;
