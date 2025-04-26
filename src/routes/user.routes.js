const { Router } = require('express');
const { showLoginPage,
        login, 
        logout,
        showAddUserPage,
        listUsers, 
        getUserDetails,
        showUpdateUserPage,
        updateUser,
        deleteUser
    } = require('../controllers/user.controller.js');

const { addUser } = require('../controllers/user-controller.js')
const authUser = require('../middlewares/authUser.js');

const userRouter = Router();

userRouter.get('/login', showLoginPage); 
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.get('/addUser', authUser, showAddUserPage); 
userRouter.post('/addUser', authUser, addUser);
userRouter.get('/users', authUser, listUsers);
userRouter.get('/user/:id', authUser, getUserDetails);
userRouter.get('/user/:id/edit', authUser, showUpdateUserPage); 
userRouter.post('/updateUser/:id', authUser, updateUser);
userRouter.post('/deleteUser/:id', authUser, deleteUser);


module.exports = userRouter;