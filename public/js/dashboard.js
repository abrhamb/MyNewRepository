// Dashboard JavaScript
class MarketingDashboard {
    constructor() {
        this.charts = {};
        this.currentTab = 'overview';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadDashboard();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Refresh button
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.refreshDashboard();
        });
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // Load tab-specific data
        this.loadTabData(tabName);
    }

    async loadTabData(tabName) {
        switch(tabName) {
            case 'overview':
                await this.loadOverview();
                break;
            case 'campaigns':
                await this.loadCampaigns();
                break;
            case 'segments':
                await this.loadSegments();
                break;
            case 'templates':
                await this.loadTemplates();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
        }
    }

    async loadDashboard() {
        this.showLoading();
        try {
            await this.loadOverview();
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showError('Failed to load dashboard data');
        } finally {
            this.hideLoading();
        }
    }

    async loadOverview() {
        try {
            const [campaignStats, dashboardStats] = await Promise.all([
                this.fetchAPI('/api/campaigns/stats'),
                this.fetchAPI('/api/analytics/dashboard')
            ]);

            this.updateOverviewStats(campaignStats.data, dashboardStats.data);
            this.createOverviewCharts(campaignStats.data);
        } catch (error) {
            console.error('Error loading overview:', error);
        }
    }

    updateOverviewStats(campaignStats, dashboardStats) {
        document.getElementById('total-campaigns').textContent = campaignStats.totalCampaigns;
        document.getElementById('total-emails').textContent = campaignStats.totalStats.sent.toLocaleString();
        document.getElementById('open-rate').textContent = campaignStats.openRate + '%';
        document.getElementById('total-revenue').textContent = '$' + dashboardStats.overview.totalRevenue;
    }

    createOverviewCharts(data) {
        // Campaign Performance Chart
        const campaignCtx = document.getElementById('campaignChart');
        if (campaignCtx) {
            if (this.charts.campaign) {
                this.charts.campaign.destroy();
            }
            this.charts.campaign = new Chart(campaignCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Sent', 'Delivered', 'Opened', 'Clicked'],
                    datasets: [{
                        data: [
                            data.totalStats.sent,
                            data.totalStats.delivered,
                            data.totalStats.opened,
                            data.totalStats.clicked
                        ],
                        backgroundColor: [
                            '#667eea',
                            '#764ba2',
                            '#f093fb',
                            '#4facfe'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Engagement Trends Chart
        this.createEngagementChart();
    }

    async createEngagementChart() {
        try {
            const response = await this.fetchAPI('/api/analytics/engagement?period=7days');
            const engagementCtx = document.getElementById('engagementChart');
            
            if (engagementCtx && response.data.timeSeries) {
                if (this.charts.engagement) {
                    this.charts.engagement.destroy();
                }
                this.charts.engagement = new Chart(engagementCtx, {
                    type: 'line',
                    data: {
                        labels: response.data.timeSeries.map(d => new Date(d.date).toLocaleDateString()),
                        datasets: [{
                            label: 'Open Rate',
                            data: response.data.timeSeries.map(d => parseFloat(d.openRate)),
                            borderColor: '#667eea',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            tension: 0.4
                        }, {
                            label: 'Click Rate',
                            data: response.data.timeSeries.map(d => parseFloat(d.clickRate)),
                            borderColor: '#f093fb',
                            backgroundColor: 'rgba(240, 147, 251, 0.1)',
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return value + '%';
                                    }
                                }
                            }
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error creating engagement chart:', error);
        }
    }

    async loadCampaigns() {
        try {
            const response = await this.fetchAPI('/api/campaigns');
            this.renderCampaignsTable(response.data);
        } catch (error) {
            console.error('Error loading campaigns:', error);
        }
    }

    renderCampaignsTable(campaigns) {
        const tbody = document.querySelector('#campaigns-table tbody');
        if (!tbody) return;

        tbody.innerHTML = campaigns.map(campaign => `
            <tr>
                <td><strong>${campaign.name}</strong><br><small>${campaign.subject}</small></td>
                <td><span class="status-badge status-${campaign.status}">${campaign.status}</span></td>
                <td>${campaign.stats.sent.toLocaleString()}</td>
                <td>${campaign.stats.opened.toLocaleString()} (${((campaign.stats.opened/campaign.stats.sent)*100).toFixed(1)}%)</td>
                <td>${campaign.stats.clicked.toLocaleString()} (${((campaign.stats.clicked/campaign.stats.sent)*100).toFixed(1)}%)</td>
                <td>
                    <button class="btn btn-sm" onclick="viewCampaign(${campaign.id})">View</button>
                    ${campaign.status === 'draft' ? `<button class="btn btn-success btn-sm" onclick="sendCampaign(${campaign.id})">Send</button>` : ''}
                </td>
            </tr>
        `).join('');
    }

    async loadSegments() {
        try {
            const response = await this.fetchAPI('/api/segments');
            this.renderSegments(response.data);
        } catch (error) {
            console.error('Error loading segments:', error);
        }
    }

    renderSegments(segments) {
        const container = document.getElementById('segments-grid');
        if (!container) return;

        container.innerHTML = segments.map(segment => `
            <div class="segment-card">
                <h3>${segment.name}</h3>
                <p>${segment.description}</p>
                <div class="segment-stats">
                    <div class="segment-stat">
                        <div class="value">${segment.customerCount}</div>
                        <div class="label">Customers</div>
                    </div>
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-primary btn-sm" onclick="viewSegment(${segment.id})">View Details</button>
                    <button class="btn btn-success btn-sm" onclick="createCampaignForSegment(${segment.id})">Create Campaign</button>
                </div>
            </div>
        `).join('');
    }

    async loadTemplates() {
        try {
            const response = await this.fetchAPI('/api/templates');
            this.renderTemplates(response.data);
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    }

    renderTemplates(templates) {
        const container = document.getElementById('templates-grid');
        if (!container) return;

        container.innerHTML = templates.map(template => `
            <div class="template-card">
                <h3>${template.name}</h3>
                <p><strong>Subject:</strong> ${template.subject}</p>
                <p><strong>Category:</strong> ${template.category}</p>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-primary btn-sm" onclick="previewTemplate(${template.id})">Preview</button>
                    <button class="btn btn-warning btn-sm" onclick="editTemplate(${template.id})">Edit</button>
                    <button class="btn btn-success btn-sm" onclick="cloneTemplate(${template.id})">Clone</button>
                </div>
            </div>
        `).join('');
    }

    async loadAnalytics() {
        try {
            const period = document.getElementById('period-select')?.value || '30days';
            const [revenueData, segmentData] = await Promise.all([
                this.fetchAPI(`/api/analytics/revenue?period=${period}`),
                this.fetchAPI('/api/analytics/segments')
            ]);

            this.createRevenueChart(revenueData.data);
            this.createSegmentChart(segmentData.data);
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    createRevenueChart(data) {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        if (this.charts.revenue) {
            this.charts.revenue.destroy();
        }

        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.timeSeries.map(d => new Date(d.date).toLocaleDateString()),
                datasets: [{
                    label: 'Revenue',
                    data: data.timeSeries.map(d => parseFloat(d.revenue)),
                    borderColor: '#43e97b',
                    backgroundColor: 'rgba(67, 233, 123, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    createSegmentChart(data) {
        const ctx = document.getElementById('segmentChart');
        if (!ctx) return;

        if (this.charts.segment) {
            this.charts.segment.destroy();
        }

        this.charts.segment = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.segments.map(s => s.name),
                datasets: [{
                    label: 'Revenue',
                    data: data.segments.map(s => parseFloat(s.performance.revenue)),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    async fetchAPI(endpoint) {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(message) {
        // Simple error display - could be enhanced with a proper notification system
        alert('Error: ' + message);
    }

    async refreshDashboard() {
        await this.loadTabData(this.currentTab);
    }
}

// Global functions for button clicks
window.viewCampaign = function(id) {
    alert(`View campaign ${id} - This would open a detailed view`);
};

window.sendCampaign = async function(id) {
    if (confirm('Are you sure you want to send this campaign?')) {
        try {
            const response = await fetch(`/api/campaigns/${id}/send`, { method: 'POST' });
            const result = await response.json();
            if (result.success) {
                alert('Campaign sent successfully!');
                dashboard.loadCampaigns();
            } else {
                alert('Error sending campaign: ' + result.message);
            }
        } catch (error) {
            alert('Error sending campaign: ' + error.message);
        }
    }
};

window.viewSegment = function(id) {
    alert(`View segment ${id} - This would open segment details`);
};

window.createCampaignForSegment = function(segmentId) {
    alert(`Create campaign for segment ${segmentId} - This would open campaign creation form`);
};

window.previewTemplate = function(id) {
    window.open(`/api/templates/${id}`, '_blank');
};

window.editTemplate = function(id) {
    alert(`Edit template ${id} - This would open template editor`);
};

window.cloneTemplate = async function(id) {
    const name = prompt('Enter name for cloned template:');
    if (name) {
        try {
            const response = await fetch(`/api/templates/${id}/clone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            const result = await response.json();
            if (result.success) {
                alert('Template cloned successfully!');
                dashboard.loadTemplates();
            } else {
                alert('Error cloning template: ' + result.message);
            }
        } catch (error) {
            alert('Error cloning template: ' + error.message);
        }
    }
};

window.createCampaign = function() {
    alert('Create new campaign - This would open campaign creation form');
};

window.createSegment = function() {
    alert('Create new segment - This would open segment creation form');
};

window.createTemplate = function() {
    alert('Create new template - This would open template editor');
};

window.refreshDashboard = function() {
    dashboard.refreshDashboard();
};

window.updateAnalytics = function() {
    dashboard.loadAnalytics();
};

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', function() {
    dashboard = new MarketingDashboard();
});