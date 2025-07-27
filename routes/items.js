const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const itemController = require('../controllers/itemController');

router.post('/register', upload.single('image'), itemController.registerItem);
router.get('/search', itemController.searchItems);
router.delete('/:id', itemController.deleteItem);
router.put('/:id', itemController.updateItem);

module.exports = router;
