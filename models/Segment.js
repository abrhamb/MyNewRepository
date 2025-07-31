// In-memory segment storage
let segments = [
  {
    id: 1,
    name: "New Customers",
    description: "Users who signed up in the last 30 days",
    criteria: {
      signupDate: { operator: "last_days", value: 30 },
      status: { operator: "equals", value: "active" }
    },
    customerCount: 45,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "High Value Customers",
    description: "Customers with lifetime value > $500",
    criteria: {
      lifetimeValue: { operator: "greater_than", value: 500 },
      status: { operator: "equals", value: "active" }
    },
    customerCount: 120,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Inactive Users",
    description: "Users who haven't logged in for 60+ days",
    criteria: {
      lastLoginDate: { operator: "more_than_days_ago", value: 60 },
      status: { operator: "equals", value: "active" }
    },
    customerCount: 85,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Premium Subscribers",
    description: "Users with premium subscription",
    criteria: {
      subscriptionType: { operator: "equals", value: "premium" },
      subscriptionStatus: { operator: "equals", value: "active" }
    },
    customerCount: 200,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Cart Abandoners",
    description: "Users who added items to cart but didn't purchase",
    criteria: {
      cartStatus: { operator: "equals", value: "abandoned" },
      lastCartUpdate: { operator: "last_days", value: 7 }
    },
    customerCount: 67,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 6;

class Segment {
  static getAll(page = 1, limit = 10, search = '') {
    let filteredSegments = segments;
    
    // Search functionality
    if (search) {
      filteredSegments = segments.filter(segment => 
        segment.name.toLowerCase().includes(search.toLowerCase()) ||
        segment.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter active segments only
    filteredSegments = filteredSegments.filter(segment => segment.isActive);
    
    const total = filteredSegments.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredSegments.slice(startIndex, endIndex);
    
    return {
      data,
      total
    };
  }
  
  static getById(id) {
    return segments.find(segment => segment.id === id && segment.isActive);
  }
  
  static create({ name, description, criteria }) {
    const segment = {
      id: nextId++,
      name,
      description,
      criteria,
      customerCount: this.calculateCustomerCount(criteria),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    segments.push(segment);
    return segment;
  }
  
  static update(id, updates) {
    const segmentIndex = segments.findIndex(segment => segment.id === id);
    
    if (segmentIndex === -1) {
      return null;
    }
    
    // Recalculate customer count if criteria changed
    if (updates.criteria) {
      updates.customerCount = this.calculateCustomerCount(updates.criteria);
    }
    
    segments[segmentIndex] = {
      ...segments[segmentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return segments[segmentIndex];
  }
  
  static delete(id) {
    const segmentIndex = segments.findIndex(segment => segment.id === id);
    
    if (segmentIndex === -1) {
      return false;
    }
    
    // Soft delete by setting isActive to false
    segments[segmentIndex].isActive = false;
    segments[segmentIndex].updatedAt = new Date().toISOString();
    return true;
  }
  
  static calculateCustomerCount(criteria) {
    // Mock calculation - in real app, this would query the database
    // Based on criteria complexity, return a realistic count
    const baseCount = Math.floor(Math.random() * 200) + 20;
    return baseCount;
  }
  
  static refreshCustomerCounts() {
    // Refresh customer counts for all active segments
    segments.forEach(segment => {
      if (segment.isActive) {
        segment.customerCount = this.calculateCustomerCount(segment.criteria);
        segment.updatedAt = new Date().toISOString();
      }
    });
    
    return segments.filter(s => s.isActive);
  }
  
  static getSegmentPerformance(id) {
    const segment = this.getById(id);
    if (!segment) return null;
    
    // Mock performance data
    return {
      segmentId: id,
      segmentName: segment.name,
      totalCustomers: segment.customerCount,
      campaignsSent: Math.floor(Math.random() * 10) + 1,
      totalOpens: Math.floor(segment.customerCount * 0.25),
      totalClicks: Math.floor(segment.customerCount * 0.08),
      avgOrderValue: (Math.random() * 200 + 50).toFixed(2),
      conversionRate: (Math.random() * 10 + 2).toFixed(2),
      revenue: (Math.random() * 10000 + 1000).toFixed(2)
    };
  }
  
  static getCustomersPreview(id, limit = 10) {
    const segment = this.getById(id);
    if (!segment) return null;
    
    // Mock customer data that would match the segment criteria
    const customers = [];
    for (let i = 0; i < Math.min(limit, segment.customerCount); i++) {
      customers.push({
        id: Math.floor(Math.random() * 10000),
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        lifetimeValue: (Math.random() * 1000).toFixed(2),
        status: Math.random() > 0.1 ? 'active' : 'inactive'
      });
    }
    
    return {
      segmentId: id,
      segmentName: segment.name,
      totalCount: segment.customerCount,
      previewCount: customers.length,
      customers
    };
  }
  
  static getAvailableOperators() {
    return [
      { value: 'equals', label: 'Equals', types: ['string', 'number', 'boolean'] },
      { value: 'not_equals', label: 'Not Equals', types: ['string', 'number', 'boolean'] },
      { value: 'greater_than', label: 'Greater Than', types: ['number', 'date'] },
      { value: 'less_than', label: 'Less Than', types: ['number', 'date'] },
      { value: 'contains', label: 'Contains', types: ['string'] },
      { value: 'not_contains', label: 'Does Not Contain', types: ['string'] },
      { value: 'last_days', label: 'Last X Days', types: ['date'] },
      { value: 'more_than_days_ago', label: 'More Than X Days Ago', types: ['date'] },
      { value: 'in_list', label: 'In List', types: ['string', 'number'] },
      { value: 'not_in_list', label: 'Not In List', types: ['string', 'number'] }
    ];
  }
  
  static getAvailableFields() {
    return [
      { field: 'signupDate', label: 'Signup Date', type: 'date' },
      { field: 'lastLoginDate', label: 'Last Login Date', type: 'date' },
      { field: 'lifetimeValue', label: 'Lifetime Value', type: 'number' },
      { field: 'totalOrders', label: 'Total Orders', type: 'number' },
      { field: 'status', label: 'Status', type: 'string' },
      { field: 'subscriptionType', label: 'Subscription Type', type: 'string' },
      { field: 'subscriptionStatus', label: 'Subscription Status', type: 'string' },
      { field: 'location', label: 'Location', type: 'string' },
      { field: 'age', label: 'Age', type: 'number' },
      { field: 'cartStatus', label: 'Cart Status', type: 'string' },
      { field: 'lastCartUpdate', label: 'Last Cart Update', type: 'date' }
    ];
  }
}

module.exports = Segment;