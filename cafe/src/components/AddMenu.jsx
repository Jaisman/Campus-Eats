// AddMenu.js
import React, { useState, useEffect} from 'react';
import Navbar from './Navbar';
import { useMenu } from '../context/MenuContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import home_i1 from '../assets/home_i1.jpg';

const AddMenu = () => {
  const [menuData, setMenuData] = useState([]);
  const navigate = useNavigate();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newItem, setNewItem] = useState({
    Name: '',
    Price: '',
    Description: '',
    Image: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Price: '',
    Description: '',
    Image: '',
  });

  const [items, setItems] = useState([]);
  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user || user.role !== 'admin') {
      navigate('/');
      }
    }, [navigate]);

  useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await axios.get('http://localhost:8080/fetch-categories');
      if (Array.isArray(res.data)) {
        setMenuData(res.data);
      } else {
        console.error('Unexpected menu format:', res.data);
        setMenuData([]); // fallback
      }
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      setMenuData([]); // fallback
    }
  };

  fetchMenu();
}, []);


const handleAddCategory = async (e) => {
  e.preventDefault();
  if (!newCategoryName.trim()) return;

  try {
    const response = await axios.post('http://localhost:8080/api/categories', {
      Name: newCategoryName.toLowerCase()
    });

    const createdCategory = response.data;
    setNewCategoryName('');
  } catch (error) {
    console.error("Failed to add category:", error);
  }
};

  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedCategory) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/categories/${selectedCategory}/items`);
        console.log(res);
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };
    fetchItems();
  }, [selectedCategory]);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle changes for new item inputs
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
    console.log(newItem);
  };
    
  // Add new item to the selected category
  const handleAddItem = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      ...newItem,
      category: selectedCategory
    };

    const res = await axios.post('http://localhost:8080/api/items', payload);
    console.log(payload);

    if (res.status === 201) {
      alert('Item added!');
      setItems(prev => [...prev, res.data.item]);
      setNewItem({ Name: '', Price: '', Description: '', Image: '' });
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || 'Failed to add item');
  }
};


  // Remove an item from the selected category
 const handleRemoveItem = async (categoryId, itemId) => {
    try {
      await axios.delete(`http://localhost:8080/categories/${categoryId}/items/${itemId}`);
      alert('Item deleted successfully');
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Failed to delete item');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8080/category/delete/${categoryId}`);
      alert('Category deleted successfully');
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category');
    }
  };

  const handleUpdateItem = (categoryId, itemId) => {
    const itemToEdit = items.find(item => item._id === itemId);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setFormData({
        Name: itemToEdit.Name,
        Price: itemToEdit.Price,
        Description: itemToEdit.Description,
        Image: itemToEdit.Image,
      });
      setIsModalOpen(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateItem = async (itemId, data) => {
    const res = await axios.put(`http://localhost:8080/items/${itemId}`, data);
    return res.data;
  };

const submitUpdate = async () => {
  try {
    const updatedItem = await updateItem(editingItem._id, formData);

    setIsModalOpen(false);

    // Update the local items state by replacing the updated item
    setItems(prevItems =>
      prevItems.map(item => (item._id === updatedItem._id ? updatedItem : item))
    );

    alert('Item updated successfully');
  } catch (err) {
    console.error('Update failed', err);
    alert('Update failed');
  }
};


  return (
    <>
      <Navbar />
      <div
              style={{
                backgroundImage: `url(${home_i1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(0.7)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1, // ensures this div is behind everything else
              }}
            />
      <div className="container mt-4">
        <h1 className="mb-4 text-center text-white">Menu Management</h1>
        
        <div className="row">
          {/* Left Column - Categories */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Categories</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddCategory} className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="New Category Name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <button type="submit" className="btn btn-success">Add</button>
                  </div>
                </form>
                
                <div className="list-group">
                 {menuData.map(category => (
                      <div
                        key={category._id} // <-- Move key here!
                        className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded bg-light"
                      >
                        <button
                          className={`flex-grow-1 me-2 btn text-start d-flex justify-content-between align-items-center ${selectedCategory === category._id ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => handleSelectCategory(category._id)}
                        >
                          {category.Name}
                          <span className="badge bg-secondary rounded-pill">{category.Name}</span>
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Items */}
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  {selectedCategory ? 
                    `Items in ${menuData.find(c => c.id === selectedCategory)?.name}` : 
                    'Select a category to manage items'}
                </h5>
              </div>
              <div className="card-body">
                {selectedCategory ? (
                  <>
                    <form onSubmit={handleAddItem} className="mb-3">
                      <div className="row mb-2">
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Item Name"
                            name="Name"
                            value={newItem.Name}
                            onChange={handleNewItemChange}
                            required
                          />
                        </div>
                        <div className="col">
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            placeholder="Price"
                            name="Price"
                            value={newItem.Price}
                            onChange={handleNewItemChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <textarea
                          className="form-control"
                          placeholder="Description"
                          name="Description"
                          value={newItem.Description}
                          onChange={handleNewItemChange}
                          rows="2"
                        ></textarea>
                      </div>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Image URL"
                          name="Image"
                          value={newItem.Image}
                          onChange={handleNewItemChange}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-success">Add Item</button>
                    </form>

                    
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Description</th>
                          <th>Actions</th>
                          <th>Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(items) && items
                          .filter(item => item && item.category === selectedCategory)
                          .map(item => (
                            <tr key={item._id}>
                              <td>{item.Name}</td>
                              <td>${parseFloat(item.Price).toFixed(2)}</td>
                              <td>{item.Description}</td>
                              <td>
                                <button 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleRemoveItem(selectedCategory, item._id)}
                                >
                                  Remove
                                </button>
                              </td>
                              <td>
                                <button 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleUpdateItem(selectedCategory, item._id)}
                                >
                                  Update
                                </button>
                              </td>
                            </tr>
                        ))}
                      </tbody>

                    </table>
                  </>
                ) : (
                  <div className="alert alert-info">
                    Please select a category from the list or create a new one.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div
            className="modal-backdrop"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1050,
            }}
          >
            <div
              className="modal-content p-4 bg-white rounded"
              style={{ width: '400px', maxWidth: '90%' }}
            >
              <h5 className="mb-3">Update Item</h5>
              <div className="mb-2">
                <label>Name</label>
                <input
                  type="text"
                  name="Name"
                  className="form-control"
                  value={formData.Name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label>Price</label>
                <input
                  type="text"
                  name="Price"
                  className="form-control"
                  value={formData.Price}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label>Description</label>
                <textarea
                  name="Description"
                  className="form-control"
                  value={formData.Description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label>Image URL</label>
                <input
                  type="text"
                  name="Image"
                  className="form-control"
                  value={formData.Image}
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={submitUpdate}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AddMenu;
