// AddMenu.js
import React, { useState, useEffect} from 'react';
import Navbar from './Navbar';
import { useMenu } from '../context/MenuContext';
import { useNavigate } from 'react-router-dom';

const AddMenu = () => {
  const { menuData, updateMenu } = useMenu();
  const navigate = useNavigate();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });
  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user || user.role !== 'admin') {
      navigate('/');
      }
    }, [navigate]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    const newId = menuData.length > 0 ? Math.max(...menuData.map(c => c.id)) + 1 : 1;
    const newCategory = {
      id: newId,
      name: newCategoryName.toLowerCase(),
      items: []
    };

    updateMenu([...menuData, newCategory]);
    setNewCategoryName('');
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle changes for new item inputs
  const handleNewItemChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({
          ...newItem,
          image: reader.result  
        });
      };
      reader.readAsDataURL(file);
    } else {
      setNewItem({
        ...newItem,
        [name]: value
      });
    }
  };
    
  // Add new item to the selected category
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!selectedCategory || !newItem.name || !newItem.price) return;
    
    const updatedMenuData = menuData.map(category => {
      if (category.id === selectedCategory) {
        const newItemId = category.items.length > 0 ? Math.max(...category.items.map(item => item.id)) + 1 : 1;
        return {
          ...category,
          items: [...category.items, {
            id: newItemId,
            name: newItem.name,
            price: parseFloat(newItem.price),
            description: newItem.description,
            image: newItem.image
          }]
        };
      }
      return category;
    });
    
    updateMenu(updatedMenuData);
    setNewItem({ name: '', price: '', description: '', image: '' });
  };

  // Remove an item from the selected category
  const handleRemoveItem = (categoryId, itemId) => {
    const updatedMenuData = menuData.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== itemId)
        };
      }
      return category;
    });
    updateMenu(updatedMenuData);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4 text-center">Menu Management</h1>
        
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
                    <button
                      key={category.id}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => handleSelectCategory(category.id)}
                    >
                      {category.name}
                      <span className="badge bg-secondary rounded-pill">{category.items.length}</span>
                    </button>
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
                            name="name"
                            value={newItem.name}
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
                            name="price"
                            value={newItem.price}
                            onChange={handleNewItemChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <textarea
                          className="form-control"
                          placeholder="Description"
                          name="description"
                          value={newItem.description}
                          onChange={handleNewItemChange}
                          rows="2"
                        ></textarea>
                      </div>
                      <div className="mb-2">
                        <input type="file" name="image" id="image" onChange={handleNewItemChange}/>
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
                        </tr>
                      </thead>
                      <tbody>
                        {menuData.find(c => c.id === selectedCategory)?.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>{item.description}</td>
                            <td>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveItem(selectedCategory, item.id)}
                              >
                                Remove
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
      </div>
    </>
  );
};

export default AddMenu;
