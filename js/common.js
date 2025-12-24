// src/js/common.js

// Hàm cập nhật ngày giờ
function updateDateTime(elementId) {
    const now = new Date();
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const dateStr = now.toLocaleDateString('vi-VN', dateOptions);
    const timeStr = now.toLocaleTimeString('vi-VN', timeOptions);
    
    const dateTimeElement = document.getElementById(elementId);
    if (dateTimeElement) {
        dateTimeElement.textContent = `Hôm nay: ${dateStr} - ${timeStr}`;
    }
}

// Hàm xử lý sidebar mobile
function initMobileSidebar() {
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(event.target) && !mobileToggle.contains(event.target)) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });
    }
}

// Hàm set active link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Reset all
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Set active based on href
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
}

// Hàm thêm tooltip cho sidebar collapsed
function initSidebarTooltips() {
    if (window.innerWidth <= 1200) {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            const text = link.querySelector('.nav-text')?.textContent || '';
            if (text) {
                link.setAttribute('data-tooltip', text);
            }
        });
    } else {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.removeAttribute('data-tooltip');
        });
    }
}

// Chạy khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo các chức năng
    updateDateTime('currentDateTime');
    initMobileSidebar();
    setActiveNavLink();
    initSidebarTooltips();
    
    // Cập nhật datetime mỗi giây
    setInterval(() => updateDateTime('currentDateTime'), 1000);
    
    // Xử lý resize
    window.addEventListener('resize', function() {
        initSidebarTooltips();
        
        // Tự động đóng sidebar trên mobile khi resize lớn
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('mobile-open');
        }
    });
    
    // Thêm click handler cho nav items
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Không xử lý logout link
            if (this.closest('.sidebar-footer')) {
                return;
            }
            
            // Remove active từ tất cả
            navLinks.forEach(item => item.classList.remove('active'));
            
            // Add active cho item được click
            this.classList.add('active');
            
            // Trên mobile: đóng sidebar sau khi click
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });
    });
});