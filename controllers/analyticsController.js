const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const EmailTemplate = require('../models/EmailTemplate');

// Get overall marketing dashboard stats
const getDashboardStats = async (req, res, next) => {
  try {
    const campaignStats = Campaign.getDashboardStats();
    const allSegments = Segment.getAll(1, 100);
    const allTemplates = EmailTemplate.getAll(1, 100);
    
    const totalCustomers = allSegments.data.reduce((sum, segment) => sum + segment.customerCount, 0);
    const avgCustomersPerSegment = allSegments.total > 0 ? Math.round(totalCustomers / allSegments.total) : 0;
    
    res.json({
      success: true,
      data: {
        campaigns: campaignStats,
        segments: {
          total: allSegments.total,
          totalCustomers,
          avgCustomersPerSegment
        },
        templates: {
          total: allTemplates.total,
          categories: EmailTemplate.getCategories().length
        },
        overview: {
          totalEmailsSent: campaignStats.totalStats.sent,
          avgOpenRate: campaignStats.openRate,
          avgClickRate: campaignStats.clickRate,
          totalRevenue: calculateTotalRevenue()
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get campaign performance analytics
const getCampaignAnalytics = async (req, res, next) => {
  try {
    const { period = '30days', campaignIds } = req.query;
    
    let campaigns = Campaign.getAll(1, 100).data;
    
    // Filter by specific campaign IDs if provided
    if (campaignIds) {
      const ids = campaignIds.split(',').map(id => parseInt(id));
      campaigns = campaigns.filter(c => ids.includes(c.id));
    }
    
    // Mock time-series data for the period
    const timeSeriesData = generateTimeSeriesData(period);
    
    const analytics = {
      summary: {
        totalCampaigns: campaigns.length,
        totalSent: campaigns.reduce((sum, c) => sum + c.stats.sent, 0),
        totalOpened: campaigns.reduce((sum, c) => sum + c.stats.opened, 0),
        totalClicked: campaigns.reduce((sum, c) => sum + c.stats.clicked, 0),
        avgOpenRate: calculateAvgRate(campaigns, 'opened', 'sent'),
        avgClickRate: calculateAvgRate(campaigns, 'clicked', 'sent'),
        avgCTR: calculateAvgRate(campaigns, 'clicked', 'opened')
      },
      campaigns: campaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        sentDate: campaign.sentAt,
        stats: campaign.stats,
        openRate: campaign.stats.sent > 0 ? ((campaign.stats.opened / campaign.stats.sent) * 100).toFixed(2) : 0,
        clickRate: campaign.stats.sent > 0 ? ((campaign.stats.clicked / campaign.stats.sent) * 100).toFixed(2) : 0,
        ctr: campaign.stats.opened > 0 ? ((campaign.stats.clicked / campaign.stats.opened) * 100).toFixed(2) : 0
      })),
      timeSeries: timeSeriesData,
      topPerforming: campaigns
        .filter(c => c.stats.sent > 0)
        .sort((a, b) => (b.stats.clicked / b.stats.sent) - (a.stats.clicked / a.stats.sent))
        .slice(0, 5)
        .map(c => ({
          id: c.id,
          name: c.name,
          clickRate: ((c.stats.clicked / c.stats.sent) * 100).toFixed(2)
        }))
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// Get segment performance analytics
const getSegmentAnalytics = async (req, res, next) => {
  try {
    const segments = Segment.getAll(1, 100).data;
    
    const analytics = segments.map(segment => {
      const performance = Segment.getSegmentPerformance(segment.id);
      return {
        id: segment.id,
        name: segment.name,
        customerCount: segment.customerCount,
        performance: performance,
        roi: calculateSegmentROI(performance)
      };
    });
    
    const summary = {
      totalSegments: segments.length,
      totalCustomers: segments.reduce((sum, s) => sum + s.customerCount, 0),
      avgCustomersPerSegment: Math.round(segments.reduce((sum, s) => sum + s.customerCount, 0) / segments.length),
      mostValuable: analytics.sort((a, b) => parseFloat(b.performance.revenue) - parseFloat(a.performance.revenue))[0],
      highestEngagement: analytics.sort((a, b) => parseFloat(b.performance.conversionRate) - parseFloat(a.performance.conversionRate))[0]
    };
    
    res.json({
      success: true,
      data: {
        summary,
        segments: analytics
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get email engagement trends
const getEngagementTrends = async (req, res, next) => {
  try {
    const { period = '7days' } = req.query;
    
    const trends = generateEngagementTrends(period);
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    next(error);
  }
};

// Get revenue analytics
const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = '30days' } = req.query;
    
    const segments = Segment.getAll(1, 100).data;
    const revenueData = segments.map(segment => {
      const performance = Segment.getSegmentPerformance(segment.id);
      return {
        segmentId: segment.id,
        segmentName: segment.name,
        revenue: parseFloat(performance.revenue),
        customers: segment.customerCount,
        avgOrderValue: parseFloat(performance.avgOrderValue),
        conversionRate: parseFloat(performance.conversionRate)
      };
    });
    
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const avgOrderValue = revenueData.reduce((sum, item) => sum + item.avgOrderValue, 0) / revenueData.length;
    
    const analytics = {
      summary: {
        totalRevenue: totalRevenue.toFixed(2),
        avgOrderValue: avgOrderValue.toFixed(2),
        totalCustomers: revenueData.reduce((sum, item) => sum + item.customers, 0),
        avgConversionRate: (revenueData.reduce((sum, item) => sum + item.conversionRate, 0) / revenueData.length).toFixed(2)
      },
      bySegment: revenueData.sort((a, b) => b.revenue - a.revenue),
      timeSeries: generateRevenueTimeSeries(period),
      trends: {
        growth: '+12.5%',
        period: period,
        comparison: 'vs previous period'
      }
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// Helper methods
const calculateAvgRate = (campaigns, numerator, denominator) => {
  const totalNumerator = campaigns.reduce((sum, c) => sum + c.stats[numerator], 0);
  const totalDenominator = campaigns.reduce((sum, c) => sum + c.stats[denominator], 0);
  return totalDenominator > 0 ? ((totalNumerator / totalDenominator) * 100).toFixed(2) : 0;
};

const calculateTotalRevenue = () => {
  // Mock revenue calculation
  return (Math.random() * 50000 + 10000).toFixed(2);
};

const calculateSegmentROI = (performance) => {
  const revenue = parseFloat(performance.revenue);
  const estimatedCost = performance.campaignsSent * 0.10; // Mock cost per email
  const roi = estimatedCost > 0 ? (((revenue - estimatedCost) / estimatedCost) * 100).toFixed(2) : 0;
  return roi;
};

const generateTimeSeriesData = (period) => {
  const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      sent: Math.floor(Math.random() * 1000) + 100,
      opened: Math.floor(Math.random() * 300) + 50,
      clicked: Math.floor(Math.random() * 100) + 10,
      unsubscribed: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return data;
};

const generateEngagementTrends = (period) => {
  const timeSeriesData = generateTimeSeriesData(period);
  
  return {
    timeSeries: timeSeriesData.map(day => ({
      date: day.date,
      openRate: day.sent > 0 ? ((day.opened / day.sent) * 100).toFixed(2) : 0,
      clickRate: day.sent > 0 ? ((day.clicked / day.sent) * 100).toFixed(2) : 0,
      unsubscribeRate: day.sent > 0 ? ((day.unsubscribed / day.sent) * 100).toFixed(2) : 0
    })),
    summary: {
      avgOpenRate: '24.5%',
      avgClickRate: '8.2%',
      trend: 'improving',
      period: period
    }
  };
};

const generateRevenueTimeSeries = (period) => {
  const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: (Math.random() * 2000 + 500).toFixed(2),
      orders: Math.floor(Math.random() * 50) + 5,
      avgOrderValue: (Math.random() * 150 + 50).toFixed(2)
    });
  }
  
  return data;
};

module.exports = {
  getDashboardStats,
  getCampaignAnalytics,
  getSegmentAnalytics,
  getEngagementTrends,
  getRevenueAnalytics,
  calculateAvgRate,
  calculateTotalRevenue,
  calculateSegmentROI,
  generateTimeSeriesData,
  generateEngagementTrends,
  generateRevenueTimeSeries
};