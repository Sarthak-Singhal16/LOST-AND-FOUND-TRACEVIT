// routes/items.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const itemController = require('../controllers/itemController');

// POST route to register a new item
// Ensure the Multer middleware uses the "image" field as expected by the client FormData.
router.post('/register', upload.single('image'), itemController.registerItem);

// Other routes for searching, deletion, and updating items.
router.get('/search', itemController.searchItems);
router.delete('/:id', itemController.deleteItem);
router.put('/:id', itemController.updateItem);

module.exports = router;
