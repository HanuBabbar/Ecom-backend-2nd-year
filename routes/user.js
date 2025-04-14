router.get('/', userController.index); // list all
router.get('/create', userController.createForm); // form
router.post('/', userController.create); // create

router.get('/:id', userController.show); // single user
router.get('/:id/edit', userController.editForm); // edit form
router.put('/:id', userController.update); // update
router.delete('/:id', userController.destroy); // delete
