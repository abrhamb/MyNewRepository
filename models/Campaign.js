// In-memory campaign storage
let campaigns = [
  {
    id: 1,
    name: "Welcome Series",
    subject: "Welcome to our platform!",
    templateId: 1,
    status: "active",
    type: "email",
    segmentId: 1,
    scheduledAt: null,
    sentAt: new Date().toISOString(),
    stats: {
      sent: 150,
      delivered: 148,
      opened: 89,
      clicked: 23,
      bounced: 2,
      unsubscribed: 1
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Product Launch",
    subject: "🚀 New Product Alert!",
    templateId: 2,
    status: "draft",
    type: "email",
    segmentId: 2,
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    sentAt: null,
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 3;

class Campaign {
  static getAll(page = 1, limit = 10, search = '', status = '') {
    let filteredCampaigns = campaigns;
    
    // Search functionality
    if (search) {
      filteredCampaigns = campaigns.filter(campaign => 
        campaign.name.toLowerCase().includes(search.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by status
    if (status) {
      filteredCampaigns = filteredCampaigns.filter(campaign => 
        campaign.status === status
      );
    }
    
    const total = filteredCampaigns.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredCampaigns.slice(startIndex, endIndex);
    
    return {
      data,
      total
    };
  }
  
  static getById(id) {
    return campaigns.find(campaign => campaign.id === id);
  }
  
  static create({ name, subject, templateId, type = 'email', segmentId, scheduledAt }) {
    const campaign = {
      id: nextId++,
      name,
      subject,
      templateId,
      status: 'draft',
      type,
      segmentId,
      scheduledAt,
      sentAt: null,
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    campaigns.push(campaign);
    return campaign;
  }
  
  static update(id, updates) {
    const campaignIndex = campaigns.findIndex(campaign => campaign.id === id);
    
    if (campaignIndex === -1) {
      return null;
    }
    
    campaigns[campaignIndex] = {
      ...campaigns[campaignIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return campaigns[campaignIndex];
  }
  
  static delete(id) {
    const campaignIndex = campaigns.findIndex(campaign => campaign.id === id);
    
    if (campaignIndex === -1) {
      return false;
    }
    
    campaigns.splice(campaignIndex, 1);
    return true;
  }
  
  static updateStats(id, stats) {
    const campaign = this.getById(id);
    if (!campaign) return null;
    
    return this.update(id, { stats: { ...campaign.stats, ...stats } });
  }
  
  static getByStatus(status) {
    return campaigns.filter(campaign => campaign.status === status);
  }
  
  static getDashboardStats() {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
    const sentCampaigns = campaigns.filter(c => c.status === 'sent').length;
    
    const totalStats = campaigns.reduce((acc, campaign) => {
      acc.sent += campaign.stats.sent;
      acc.delivered += campaign.stats.delivered;
      acc.opened += campaign.stats.opened;
      acc.clicked += campaign.stats.clicked;
      acc.bounced += campaign.stats.bounced;
      acc.unsubscribed += campaign.stats.unsubscribed;
      return acc;
    }, {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0
    });
    
    return {
      totalCampaigns,
      activeCampaigns,
      draftCampaigns,
      sentCampaigns,
      totalStats,
      openRate: totalStats.sent > 0 ? ((totalStats.opened / totalStats.sent) * 100).toFixed(2) : 0,
      clickRate: totalStats.sent > 0 ? ((totalStats.clicked / totalStats.sent) * 100).toFixed(2) : 0,
      deliveryRate: totalStats.sent > 0 ? ((totalStats.delivered / totalStats.sent) * 100).toFixed(2) : 0
    };
  }
}

module.exports = Campaign;