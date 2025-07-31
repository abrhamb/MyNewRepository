// In-memory user storage
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, createdAt: new Date().toISOString() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, createdAt: new Date().toISOString() },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, createdAt: new Date().toISOString() }
];

let nextId = 4;

class User {
  static getAll(page = 1, limit = 10, search = '') {
    let filteredUsers = users;
    
    // Search functionality
    if (search) {
      filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredUsers.slice(startIndex, endIndex);
    
    return {
      data,
      total
    };
  }
  
  static getById(id) {
    return users.find(user => user.id === id);
  }
  
  static getByEmail(email) {
    return users.find(user => user.email === email);
  }
  
  static create({ name, email, age }) {
    const user = {
      id: nextId++,
      name,
      email,
      age: age || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(user);
    return user;
  }
  
  static update(id, updates) {
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return users[userIndex];
  }
  
  static delete(id) {
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }
    
    users.splice(userIndex, 1);
    return true;
  }
  
  // Utility methods
  static count() {
    return users.length;
  }
  
  static clear() {
    users = [];
    nextId = 1;
  }
}

module.exports = User;