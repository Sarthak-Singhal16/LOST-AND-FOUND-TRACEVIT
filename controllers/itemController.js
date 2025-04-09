// controllers/itemController.js
const Item = require('../models/Item');

exports.registerItem = async (req, res) => {
  console.log("registerItem called");
  console.log("Request body:", req.body);
  console.log("File info:", req.file);
  try {
    const { name, description, date, time, place, status } = req.body;
    if (!name || !date || !place) {
      return res.status(400).json({ error: 'Name, date, and place are required.' });
    }
    let imagePath = "";
    if (req.file) {
      // Save only the file name; the file is stored in public/images/uploads/
      imagePath = req.file.filename;
    }
    const newItem = new Item({
      name,
      description,
      date,
      time,
      place,
      status,
      image: imagePath,
      // Assuming you are using session-based authentication, the authenticated user's ID might be stored in req.user._id.
      // Adjust accordingly if you use a different mechanism.
      postedBy: req.user ? req.user._id : null
    });
    await newItem.save();
    console.log("New item saved:", newItem);
    res.status(201).json({ message: 'Item registered successfully', item: newItem });
  } catch (err) {
    console.error("Error in registerItem:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.searchItems = async (req, res) => {
  try {
    const { name } = req.query;
    const query = name ? { name: { $regex: name, $options: 'i' } } : {};
    const items = await Item.find(query).sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Item not found.' });
    res.json({ message: 'Item deleted successfully', item: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = Date.now();
    const updatedItem = await Item.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedItem) return res.status(404).json({ error: 'Item not found.' });
    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
