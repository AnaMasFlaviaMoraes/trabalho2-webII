const { Router } = require('express');
// const { 
//         getUserDetails,
//         showUpdateUserPage,
//         updateUser,
//         deleteUser
//     } = require('../controllers/user.controller.js');

const { addUser,
        login,
        getUserDetails,
        showLoginPage,
        logout,
        listUsers,
        showAddUserPage,
        showUpdateUserPage,
        updateUser,
        deleteUser,
        deletePhone,
        deleteEmail 
    } = require('../controllers/user-controller.js')
const authUser = require('../middlewares/authUser.js');

const userRouter = Router();

userRouter.get('/', authUser, listUsers);
userRouter.get('/login', showLoginPage); 
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.get('/addUser', showAddUserPage); 
userRouter.post('/addUser', addUser);
userRouter.get('/users', authUser, listUsers);
userRouter.get('/user/:id', authUser, getUserDetails);
userRouter.get('/user/:id/edit', authUser, showUpdateUserPage); 
userRouter.post('/updateUser/:id', authUser, updateUser);
userRouter.post('/deleteUser/:id', authUser, deleteUser);
userRouter.post('/deletePhone/:idPhone', authUser, deletePhone);
userRouter.post('/deleteEmail/:idEmail', authUser, deleteEmail);


// @TODO arrumar modal de exclusão de telefone e e-mail página de edição
// @TODO arrumar paginação da listagem
// Botão da página de edição e detalhes está desabiliado 
// TESTAR E LIMPAR CÓDIGO


module.exports = userRouter;