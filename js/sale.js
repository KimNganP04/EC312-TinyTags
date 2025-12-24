// js/sale.js
// ===== SALE MODULE JAVASCRIPT - DÙNG CHUNG CHO TOÀN BỘ MODULE SALE =====

class SaleModule {
    constructor() {
        this.init();
    }

    init() {
        this.initDateTimeUpdater();
        this.initSidebarSubmenu();
        this.initModals();
        this.initToast();
        this.initCommonEvents();
    }

    // 1. Cập nhật thời gian - Dùng chung
    initDateTimeUpdater() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateStr = now.toLocaleDateString('vi-VN', options);
        const timeStr = now.toLocaleTimeString('vi-VN');
        
        document.querySelectorAll('#currentDateTime').forEach(element => {
            element.textContent = `Hôm nay: ${dateStr} - ${timeStr}`;
        });
    }

    // 2. Sidebar Submenu - Dùng chung
    initSidebarSubmenu() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const submenuItems = document.querySelectorAll('.submenu a');
        
        // Xử lý active state cho submenu
        if (currentPage === 'index.html') {
            // Trang chủ sale - chỉ active menu chính
            const saleMainLink = document.querySelector('.nav-item.has-submenu .nav-link');
            if (saleMainLink) {
                saleMainLink.classList.add('active');
            }
            
            // Mở submenu
            const parentSubmenu = document.querySelector('.nav-item.has-submenu');
            if (parentSubmenu) {
                parentSubmenu.classList.add('active');
            }
            
            // Không active mục nào trong submenu
            submenuItems.forEach(item => {
                item.classList.remove('active');
            });
        } else {
            // Các trang khác - active mục tương ứng trong submenu
            submenuItems.forEach(item => {
                const href = item.getAttribute('href');
                if (href === currentPage) {
                    item.classList.add('active');
                    const parentSubmenu = item.closest('.nav-item.has-submenu');
                    if (parentSubmenu) {
                        parentSubmenu.classList.add('active');
                    }
                } else {
                    item.classList.remove('active');
                }
            });
        }
        
        // Xử lý click cho submenu items
        submenuItems.forEach(item => {
            item.addEventListener('click', function() {
                submenuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // 3. Modal Functions - Dùng chung
    initModals() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target.id);
            }
        });

        // Close modal with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay[style*="display: flex"]');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // 4. Toast Notification - Dùng chung
    initToast() {
        // Create toast container if not exists
        if (!document.getElementById('saleToast')) {
            const toast = document.createElement('div');
            toast.id = 'saleToast';
            toast.className = 'toast';
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="toast-content">
                    <h4>Thành công!</h4>
                    <p></p>
                </div>
            `;
            document.body.appendChild(toast);
        }
    }

    showToast(message, type = 'success') {
        let toast = document.getElementById('saleToast');
        if (!toast) {
            this.initToast();
            toast = document.getElementById('saleToast');
        }

        const icon = toast.querySelector('.toast-icon i');
        const title = toast.querySelector('.toast-content h4');
        const content = toast.querySelector('.toast-content p');

        if (type === 'success') {
            toast.className = 'toast success';
            icon.className = 'fas fa-check-circle';
            title.textContent = 'Thành công!';
        } else {
            toast.className = 'toast error';
            icon.className = 'fas fa-exclamation-circle';
            title.textContent = 'Lỗi!';
        }
        
        content.textContent = message;

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 5. Common Event Handlers - Dùng chung
    initCommonEvents() {
        // Time period selector buttons
        const timePeriodButtons = document.querySelectorAll('.time-period-btn');
        timePeriodButtons.forEach(button => {
            button.addEventListener('click', function() {
                timePeriodButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // 6. Utility Functions - Dùng chung
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // 7. Functions cho trang Tổng quan
    changeTimePeriod(period) {
        const data = {
            today: { revenue: '15.250.000đ', orders: '45', newCustomers: '12', closeRate: '68%' },
            week: { revenue: '89.750.000đ', orders: '245', newCustomers: '38', closeRate: '65%' },
            month: { revenue: '125.450.000đ', orders: '856', newCustomers: '125', closeRate: '68%' },
            quarter: { revenue: '376.350.000đ', orders: '2,568', newCustomers: '375', closeRate: '66%' },
            year: { revenue: '1.505.400.000đ', orders: '10,272', newCustomers: '1,500', closeRate: '67%' }
        };

        const periodData = data[period] || data.month;
        const cards = document.querySelectorAll('.sale-card');
        
        if (cards.length >= 4) {
            cards[0].querySelector('.sale-card-value').textContent = periodData.revenue;
            cards[1].querySelector('.sale-card-value').textContent = periodData.orders;
            cards[2].querySelector('.sale-card-value').textContent = periodData.newCustomers;
            cards[3].querySelector('.sale-card-value').textContent = periodData.closeRate;
        }

        this.showToast(`Đã chuyển sang xem dữ liệu ${this.getPeriodName(period)}`);
    }

    getPeriodName(period) {
        const names = {
            today: 'hôm nay',
            week: 'tuần này',
            month: 'tháng này',
            quarter: 'quý này',
            year: 'năm nay'
        };
        return names[period] || 'tháng này';
    }

    refreshData() {
        const refreshBtn = document.querySelector('.btn-sale-secondary');
        const originalText = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang cập nhật...';
        refreshBtn.disabled = true;

        setTimeout(() => {
            this.showToast('Đã cập nhật dữ liệu thành công');
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
            // Gọi hàm khởi tạo biểu đồ nếu có
            if (typeof window.initializeCharts === 'function') {
                window.initializeCharts();
            }
        }, 1500);
    }

    // 8. Functions cho trang chủ Sale
    openCustomerManagement() {
        this.openModal('customerManagementModal');
    }

    showAllActivities() {
        this.openModal('allActivitiesModal');
    }

    exportActivities() {
        this.showToast('Đang xuất danh sách hoạt động...');
        setTimeout(() => {
            this.showToast('Đã xuất danh sách hoạt động thành công!');
            this.closeModal('allActivitiesModal');
        }, 1500);
    }

    // 9. Global functions để gọi từ HTML
    initGlobalFunctions() {
        window.changeTimePeriod = (period) => this.changeTimePeriod(period);
        window.refreshData = () => this.refreshData();
        window.viewAllProducts = () => this.openModal('allProductsModal');
        window.viewAllOrders = () => this.openModal('allOrdersModal');
        window.exportOverview = () => {
            this.showToast('Đang xuất báo cáo tổng quan...');
            setTimeout(() => {
                this.showToast('Đã xuất báo cáo tổng quan thành công!');
            }, 1500);
        };
        window.openCustomerManagement = () => this.openCustomerManagement();
        window.showAllActivities = () => this.showAllActivities();
        window.closeModal = (modalId) => this.closeModal(modalId);
        window.exportActivities = () => this.exportActivities();
    }
}

// Initialize Sale module
document.addEventListener('DOMContentLoaded', () => {
    window.saleModule = new SaleModule();
    window.saleModule.initGlobalFunctions();
});

// ===== FUNCTIONS CHUNG CHO TRANG ORDERS =====
// 1. Common order functions - Dùng chung cho các trang liên quan đến đơn hàng
class SaleOrderModule {
    constructor() {
        this.customers = [];
        this.products = [];
        this.orderItems = [];
        this.selectedCustomer = null;
        this.selectedPaymentMethod = 'cash';
        this.currentVoucher = null;
        this.draftOrders = [];
        this.selectedVoucherElement = null;
    }

    // Initialize order module
    initOrderModule() {
        this.loadDraftOrders();
        this.initPaymentMethod();
        this.loadData();
    }

    // Load common data
    loadData() {
        this.loadCustomers();
        this.loadProducts();
    }

    // Load sample customers
    loadCustomers() {
        this.customers = [
            {
                id: 1,
                name: "Nguyễn Văn Nam",
                phone: "0583034588",
                email: "nguyenvannam@gmail.com",
                address: "Khu phố 34, Phường Linh Xuân, Thành phố Hồ Chí Minh",
                totalSpent: "3.500.000đ",
                lastPurchase: "21/12/2025",
                purchaseCount: 5
            },
            // ... thêm các khách hàng khác
        ];
    }

    // Load sample products
    loadProducts() {
        this.products = [
            {
                id: 1,
                name: "Charm móc khóa Hồ Ly",
                sku: "TT-CHARM-001",
                category: "charm",
                price: 120000,
                stock: 45,
                image: "https://images.unsplash.com/photo-1611591437281-8a5d5a5b5b5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                description: "Charm móc khóa Hồ Ly thiết kế tinh xảo, phù hợp làm quà tặng hoặc trang trí."
            },
            // ... thêm các sản phẩm khác
        ];
    }

    // Utility functions dùng chung
    formatCurrency(amount) {
        return amount.toLocaleString('vi-VN') + 'đ';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    // Common customer functions
    searchCustomers(query, customers) {
        return customers.filter(customer => 
            customer.name.toLowerCase().includes(query) || 
            customer.phone.includes(query) ||
            (customer.email && customer.email.toLowerCase().includes(query))
        );
    }

    // Common product functions
    filterProducts(products, searchTerm = '', category = '') {
        const term = searchTerm.toLowerCase().trim();
        
        return products.filter(product => {
            const matchesSearch = !term || 
                product.name.toLowerCase().includes(term) || 
                product.sku.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term);
            
            const matchesCategory = !category || product.category === category;
            
            return matchesSearch && matchesCategory;
        });
    }

    // Payment method functions
    initPaymentMethod() {
        this.selectedPaymentMethod = 'cash';
    }

    selectPaymentMethod(method) {
        this.selectedPaymentMethod = method;
    }

    // Voucher functions
    applyVoucher(voucher) {
        this.currentVoucher = voucher;
    }

    removeVoucher() {
        this.currentVoucher = null;
    }

    // Draft orders functions
    loadDraftOrders() {
        this.draftOrders = JSON.parse(localStorage.getItem('draftOrders')) || [];
    }

    saveDraftOrder(draft) {
        this.draftOrders.unshift(draft);
        
        // Keep only last 10 drafts
        if (this.draftOrders.length > 10) {
            this.draftOrders = this.draftOrders.slice(0, 10);
        }
        
        localStorage.setItem('draftOrders', JSON.stringify(this.draftOrders));
        return this.draftOrders;
    }

    deleteDraftOrder(index) {
        if (index >= 0 && index < this.draftOrders.length) {
            this.draftOrders.splice(index, 1);
            localStorage.setItem('draftOrders', JSON.stringify(this.draftOrders));
        }
        return this.draftOrders;
    }

    // Order calculation functions
    calculateSubtotal(items) {
        return items.reduce((sum, item) => sum + item.total, 0);
    }

    calculateDiscount(subtotal, voucher) {
        if (!voucher) return 0;
        
        let discountAmount = 0;
        if (voucher.type === 'percent') {
            discountAmount = (subtotal * voucher.value) / 100;
        } else {
            discountAmount = voucher.value;
        }
        
        return discountAmount > subtotal ? subtotal : discountAmount;
    }

    calculateTotal(subtotal, discount, shippingFee) {
        return Math.max(0, subtotal - discount + shippingFee);
    }

    // Generate order ID
    generateOrderId() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `TT-${year}${month}${day}-${random}`;
    }

    // Validation functions
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const phoneDigits = phone.replace(/\D/g, '');
        return phoneDigits.length >= 10 && phoneDigits.length <= 11;
    }
}

// Initialize order module globally
document.addEventListener('DOMContentLoaded', () => {
    window.saleOrderModule = new SaleOrderModule();
});

// Export common functions to window object
window.SaleOrderModule = SaleOrderModule;

// ===== FUNCTIONS CHUNG CHO CẢ REPORT VÀ COMPARE =====
// Common functions cho cả report và compare
class SaleCommonModule {
    constructor() {
        this.additionalEmails = [];
    }

    // Initialize common functions
    initCommonModule() {
        this.initDateTimeUpdater();
        this.initSidebarSubmenu();
        this.initCommonEventListeners();
        this.initModalFunctions();
        this.initEmailFunctions();
    }

    // Update date time
    initDateTimeUpdater() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateStr = now.toLocaleDateString('vi-VN', options);
        const timeStr = now.toLocaleTimeString('vi-VN');
        
        const dateTimeElement = document.getElementById('currentDateTime');
        if (dateTimeElement) {
            dateTimeElement.textContent = `Hôm nay: ${dateStr} - ${timeStr}`;
        }
    }

    // Sidebar submenu
    initSidebarSubmenu() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const submenuItems = document.querySelectorAll('.submenu a');
        
        submenuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
                const parentSubmenu = item.closest('.nav-item.has-submenu');
                if (parentSubmenu) {
                    parentSubmenu.classList.add('active');
                }
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Common event listeners
    initCommonEventListeners() {
        // Print button
        const printBtn = document.getElementById('printReportBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printReport());
        }

        // Share button
        const shareBtn = document.getElementById('shareReportBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.openModal('shareReportModal'));
        }

        // Export PDF button
        const exportPdfBtn = document.getElementById('exportPdfBtn');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => this.exportToPDF());
        }

        // Export Excel button
        const exportExcelBtn = document.getElementById('exportExcelBtn');
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => this.exportToExcel());
        }
    }

    // Modal functions
    initModalFunctions() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target.id);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay[style*="display: flex"]');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // Email functions
    initEmailFunctions() {
        const emailInput = document.getElementById('additionalEmail');
        if (emailInput) {
            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addAdditionalEmail();
                }
            });
        }
    }

    addAdditionalEmail() {
        const emailInput = document.getElementById('additionalEmail');
        const email = emailInput.value.trim();
        
        if (!email) {
            this.showToast('Vui lòng nhập địa chỉ email', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showToast('Địa chỉ email không hợp lệ', 'error');
            return;
        }
        
        if (this.additionalEmails.includes(email)) {
            this.showToast('Email đã được thêm vào danh sách', 'warning');
            return;
        }
        
        this.additionalEmails.push(email);
        this.updateEmailTags();
        emailInput.value = '';
        emailInput.focus();
    }

    removeAdditionalEmail(email) {
        this.additionalEmails = this.additionalEmails.filter(e => e !== email);
        this.updateEmailTags();
    }

    updateEmailTags() {
        const emailTagsContainer = document.getElementById('emailTags');
        if (!emailTagsContainer) return;
        
        if (this.additionalEmails.length === 0) {
            emailTagsContainer.innerHTML = '<div style="font-size: 12px; color: #666; font-style: italic;">Chưa có email nào được thêm</div>';
            return;
        }
        
        emailTagsContainer.innerHTML = this.additionalEmails.map(email => `
            <div class="email-tag">
                ${email}
                <span class="remove-email" onclick="window.saleCommonModule.removeAdditionalEmail('${email}')">
                    <i class="fas fa-times"></i>
                </span>
            </div>
        `).join('');
    }

    toggleShareOption(element) {
        element.classList.toggle('selected');
        const checkbox = element.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
    }

    // Export functions
    exportToPDF() {
        this.showToast('Đang xuất báo cáo PDF...', 'warning');
        
        setTimeout(() => {
            this.showToast('Đã xuất báo cáo PDF thành công! File đã sẵn sàng để tải về.');
            const link = document.createElement('a');
            link.href = '#';
            const pageName = window.location.pathname.includes('report') ? 'BaoCaoDoanhThu' : 'SoSanhDoanhThu';
            link.download = `${pageName}_${new Date().toISOString().split('T')[0]}.pdf`;
            link.click();
        }, 2000);
    }

    exportToExcel() {
        this.showToast('Đang xuất báo cáo Excel...', 'warning');
        
        setTimeout(() => {
            this.showToast('Đã xuất báo cáo Excel thành công! File đã sẵn sàng để tải về.');
            const link = document.createElement('a');
            link.href = '#';
            const pageName = window.location.pathname.includes('report') ? 'BaoCaoDoanhThu' : 'SoSanhDoanhThu';
            link.download = `${pageName}_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();
        }, 2000);
    }

    printReport() {
        this.showToast('Đang chuẩn bị báo cáo để in...', 'warning');
        
        setTimeout(() => {
            window.print();
            this.showToast('Báo cáo đã sẵn sàng để in.');
        }, 1000);
    }

    shareReport() {
        const selectedOptions = [];
        const checkboxes = document.querySelectorAll('.share-option input[type="checkbox"]:checked');
        
        if (checkboxes.length === 0 && this.additionalEmails.length === 0) {
            this.showToast('Vui lòng chọn ít nhất một đối tượng để chia sẻ', 'error');
            return;
        }
        
        checkboxes.forEach(checkbox => {
            selectedOptions.push(checkbox.value);
        });
        
        const formatPdf = document.getElementById('formatPdf').checked;
        const formatExcel = document.getElementById('formatExcel').checked;
        
        if (!formatPdf && !formatExcel) {
            this.showToast('Vui lòng chọn ít nhất một định dạng file', 'error');
            return;
        }
        
        const formats = [];
        if (formatPdf) formats.push('PDF');
        if (formatExcel) formats.push('Excel');
        
        const shareBtn = document.querySelector('#shareReportModal .btn-modal.confirm');
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        shareBtn.disabled = true;
        
        setTimeout(() => {
            const recipients = selectedOptions.map(opt => {
                switch(opt) {
                    case 'manager': return 'Quản lý';
                    case 'marketing': return 'Marketing';
                    case 'accounting': return 'Kế toán';
                    default: return opt;
                }
            });
            
            const allRecipients = [...recipients, ...this.additionalEmails];
            const pageName = window.location.pathname.includes('report') ? 'báo cáo' : 'báo cáo so sánh';
            
            this.showToast(`Đã gửi ${pageName} (${formats.join(', ')}) đến ${allRecipients.length} người nhận`);
            
            document.querySelectorAll('.share-option input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.querySelectorAll('.share-option').forEach(el => el.classList.remove('selected'));
            const shareNotes = document.getElementById('shareNotes');
            if (shareNotes) shareNotes.value = '';
            document.getElementById('formatPdf').checked = true;
            document.getElementById('formatExcel').checked = false;
            
            this.additionalEmails = [];
            this.updateEmailTags();
            
            shareBtn.innerHTML = originalText;
            shareBtn.disabled = false;
            this.closeModal('shareReportModal');
        }, 1500);
    }

    // Toast notification
    showToast(message, type = 'success') {
        let toast = document.getElementById('saleToast');
        if (!toast) {
            this.initToast();
            toast = document.getElementById('saleToast');
        }

        const icon = toast.querySelector('.toast-icon i');
        const title = toast.querySelector('.toast-content h4');
        const content = toast.querySelector('.toast-content p');

        if (type === 'success') {
            toast.className = 'toast success';
            icon.className = 'fas fa-check-circle';
            title.textContent = 'Thành công!';
        } else if (type === 'error') {
            toast.className = 'toast error';
            icon.className = 'fas fa-exclamation-circle';
            title.textContent = 'Lỗi!';
        } else {
            toast.className = 'toast warning';
            icon.className = 'fas fa-info-circle';
            title.textContent = 'Thông báo!';
        }
        
        content.textContent = message;

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    initToast() {
        if (!document.getElementById('saleToast')) {
            const toast = document.createElement('div');
            toast.id = 'saleToast';
            toast.className = 'toast';
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="toast-content">
                    <h4>Thành công!</h4>
                    <p></p>
                </div>
            `;
            document.body.appendChild(toast);
        }
    }

    // Utility functions
    formatCurrency(value) {
        if (value >= 1000000000) {
            return (value / 1000000000).toFixed(1) + ' tỷ';
        } else if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + ' triệu';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + ' nghìn';
        }
        return value.toString();
    }

    formatDisplayDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Mobile sidebar toggle
    initMobileToggle() {
        const mobileToggle = document.getElementById('mobileToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
            });
        }
    }
}

// Initialize common module globally
document.addEventListener('DOMContentLoaded', () => {
    window.saleCommonModule = new SaleCommonModule();
    window.saleCommonModule.initCommonModule();
    window.saleCommonModule.initMobileToggle();
    
    // Expose functions to window
    window.openModal = (modalId) => window.saleCommonModule.openModal(modalId);
    window.closeModal = (modalId) => window.saleCommonModule.closeModal(modalId);
    window.toggleShareOption = (element) => window.saleCommonModule.toggleShareOption(element);
    window.addAdditionalEmail = () => window.saleCommonModule.addAdditionalEmail();
});