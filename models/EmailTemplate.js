// In-memory email template storage
let templates = [
  {
    id: 1,
    name: "Welcome Email",
    subject: "Welcome to {{company_name}}!",
    category: "welcome",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome {{first_name}}!</h1>
        <p>Thank you for joining {{company_name}}. We're excited to have you on board.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What's next?</h3>
          <ul>
            <li>Complete your profile</li>
            <li>Explore our features</li>
            <li>Connect with our community</li>
          </ul>
        </div>
        <a href="{{cta_url}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Get Started</a>
      </div>
    `,
    text: "Welcome {{first_name}}! Thank you for joining {{company_name}}. Get started: {{cta_url}}",
    variables: ["first_name", "company_name", "cta_url"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Product Launch",
    subject: "🚀 Introducing {{product_name}}",
    category: "promotion",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e74c3c;">🚀 {{product_name}} is Here!</h1>
        <img src="{{product_image}}" alt="{{product_name}}" style="width: 100%; max-width: 500px; height: auto;">
        <p>{{product_description}}</p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <h2>Special Launch Price</h2>
          <p style="font-size: 24px; margin: 0;">{{discount_price}}</p>
          <p style="text-decoration: line-through; opacity: 0.7;">{{original_price}}</p>
        </div>
        <a href="{{shop_url}}" style="background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Shop Now</a>
      </div>
    `,
    text: "🚀 {{product_name}} is here! {{product_description}} Special price: {{discount_price}}. Shop now: {{shop_url}}",
    variables: ["product_name", "product_image", "product_description", "discount_price", "original_price", "shop_url"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Newsletter",
    subject: "{{newsletter_title}} - {{month}} Edition",
    category: "newsletter",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
          <h1>{{newsletter_title}}</h1>
          <p>{{month}} Edition</p>
        </header>
        <div style="padding: 20px;">
          <h2>📰 This Month's Highlights</h2>
          {{content_blocks}}
          <hr style="margin: 30px 0;">
          <h3>📊 Quick Stats</h3>
          <div style="display: flex; justify-content: space-between;">
            <div style="text-align: center;">
              <strong>{{stat1_value}}</strong><br>
              <small>{{stat1_label}}</small>
            </div>
            <div style="text-align: center;">
              <strong>{{stat2_value}}</strong><br>
              <small>{{stat2_label}}</small>
            </div>
            <div style="text-align: center;">
              <strong>{{stat3_value}}</strong><br>
              <small>{{stat3_label}}</small>
            </div>
          </div>
        </div>
        <footer style="background: #ecf0f1; padding: 20px; text-align: center;">
          <p><a href="{{unsubscribe_url}}">Unsubscribe</a> | <a href="{{preferences_url}}">Update Preferences</a></p>
        </footer>
      </div>
    `,
    text: "{{newsletter_title}} - {{month}} Edition. {{content_blocks}} Unsubscribe: {{unsubscribe_url}}",
    variables: ["newsletter_title", "month", "content_blocks", "stat1_value", "stat1_label", "stat2_value", "stat2_label", "stat3_value", "stat3_label", "unsubscribe_url", "preferences_url"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 4;

class EmailTemplate {
  static getAll(page = 1, limit = 10, search = '', category = '') {
    let filteredTemplates = templates;
    
    // Search functionality
    if (search) {
      filteredTemplates = templates.filter(template => 
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.subject.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by category
    if (category) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.category === category
      );
    }
    
    // Filter active templates only
    filteredTemplates = filteredTemplates.filter(template => template.isActive);
    
    const total = filteredTemplates.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredTemplates.slice(startIndex, endIndex);
    
    return {
      data,
      total
    };
  }
  
  static getById(id) {
    return templates.find(template => template.id === id && template.isActive);
  }
  
  static create({ name, subject, category, html, text, variables = [] }) {
    const template = {
      id: nextId++,
      name,
      subject,
      category,
      html,
      text,
      variables,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    templates.push(template);
    return template;
  }
  
  static update(id, updates) {
    const templateIndex = templates.findIndex(template => template.id === id);
    
    if (templateIndex === -1) {
      return null;
    }
    
    templates[templateIndex] = {
      ...templates[templateIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return templates[templateIndex];
  }
  
  static delete(id) {
    const templateIndex = templates.findIndex(template => template.id === id);
    
    if (templateIndex === -1) {
      return false;
    }
    
    // Soft delete by setting isActive to false
    templates[templateIndex].isActive = false;
    templates[templateIndex].updatedAt = new Date().toISOString();
    return true;
  }
  
  static getCategories() {
    const categories = [...new Set(templates.filter(t => t.isActive).map(t => t.category))];
    return categories.map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
      count: templates.filter(t => t.category === category && t.isActive).length
    }));
  }
  
  static renderTemplate(templateId, variables = {}) {
    const template = this.getById(templateId);
    if (!template) return null;
    
    let renderedHtml = template.html;
    let renderedText = template.text;
    let renderedSubject = template.subject;
    
    // Replace variables in HTML, text, and subject
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      renderedHtml = renderedHtml.replace(regex, variables[key] || '');
      renderedText = renderedText.replace(regex, variables[key] || '');
      renderedSubject = renderedSubject.replace(regex, variables[key] || '');
    });
    
    return {
      id: template.id,
      name: template.name,
      subject: renderedSubject,
      html: renderedHtml,
      text: renderedText,
      category: template.category
    };
  }
  
  static clone(id, newName) {
    const template = this.getById(id);
    if (!template) return null;
    
    return this.create({
      name: newName || `${template.name} (Copy)`,
      subject: template.subject,
      category: template.category,
      html: template.html,
      text: template.text,
      variables: [...template.variables]
    });
  }
}

module.exports = EmailTemplate;