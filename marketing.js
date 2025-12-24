// marketing.js

// Load sidebar vào container
function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        fetch('sidebar.html')
            .then(response => response.text())
            .then(data => {
                sidebarContainer.innerHTML = data;
                initSidebar();
            })
            .catch(error => {
                console.error('Error loading sidebar:', error);
                sidebarContainer.innerHTML = `
                    <div class="p-4 text-red-500">
                        Error loading sidebar. Please check if sidebar.html exists.
                    </div>
                `;
            });
    }
}

// Khởi tạo sidebar sau khi load
function initSidebar() {
    // Thêm active class cho nav item hiện tại
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
            link.style.color = 'var(--primary-red)';
            link.style.fontWeight = '600';
        }
    });
    
    // Toggle mobile menu nếu có
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }
}

// Update real-time stats
function updateStats() {
    const allPosts = getAllPosts();
    const total = allPosts.length;
    const draft = allPosts.filter(p => p.status === 'draft').length;
    const pending = allPosts.filter(p => p.status === 'pending').length;
    const approved = allPosts.filter(p => p.status === 'approved').length;
    const published = allPosts.filter(p => p.status === 'published').length;
    const rejected = allPosts.filter(p => p.status === 'rejected').length;
    
    const totalEl = document.getElementById('total-posts');
    const draftEl = document.getElementById('draft-posts');
    const pendingEl = document.getElementById('pending-posts');
    const approvedEl = document.getElementById('approved-posts');
    const publishedEl = document.getElementById('published-posts');
    const rejectedEl = document.getElementById('rejected-posts'); 
    
    if (totalEl) totalEl.textContent = total;
    if (draftEl) draftEl.textContent = draft;
    if (pendingEl) pendingEl.textContent = pending;
    if (approvedEl) approvedEl.textContent = approved;
    if (publishedEl) publishedEl.textContent = published;
     if (rejectedEl) rejectedEl.textContent = rejected;
}

// Update activity timestamps
function updateActivityTimestamps() {
    const timestamps = document.querySelectorAll('.activity-item .text-xs.text-gray-500');
    timestamps.forEach(ts => {
        const text = ts.textContent;
        if (text.includes('phút')) {
            const minutes = parseInt(text);
            if (!isNaN(minutes)) {
                ts.textContent = (minutes + 1) + ' phút trước';
            }
        }
    });
}

// Initialize tooltips and interactions
function initPageInteractions() {
    // Add click effects to cards
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.addEventListener('click', function() {
            const link = this.querySelector('a');
            if (link) {
                link.click();
            }
        });
    });
    
    // Add hover effects to activity items
    document.querySelectorAll('.activity-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Notification bell animation
function initNotificationBell() {
    const bell = document.querySelector('.fa-bell');
    if (bell) {
        setInterval(() => {
            bell.classList.add('animate-bounce');
            setTimeout(() => bell.classList.remove('animate-bounce'), 1000);
        }, 15000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load sidebar
    loadSidebar();
    
    // Initialize page interactions
    initPageInteractions();
    
    // Initialize notification bell
    initNotificationBell();
    
    // Update activity timestamps periodically
    if (document.querySelector('.activity-item')) {
        setInterval(updateActivityTimestamps, 60000);
    }
    
    // Simulate real-time updates for stats
    if (document.querySelector('.stats-card')) {
        setInterval(updateStats, 30000); // Every 30 seconds
    }
    
    // Add active class to current page in header navigation
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href')) {
            const href = link.getAttribute('href');
            if (currentPath.includes(href) || 
                (currentPath.endsWith('/') && href === 'trangchu.html') ||
                (currentPath.endsWith('index.html') && href === 'trangchu.html')) {
                item.classList.add('active');
            }
        }
    });
});

/* ===== DANH SÁCH BÀI VIẾT ===== */
// Dữ liệu bài viết mẫu cho cửa hàng phụ kiện charm
const postsData = [
    {
        id: 1,
        title: "Bộ Sưu Tập Móc Khóa Charm Mùa Hè 2025",
        writeDate: "22/12/2025",
        publishDate: "25/12/2025",
        category: "moc-khoa",
        status: "published",
        description: "Giới thiệu bộ sưu tập móc khóa charm mới nhất với thiết kế mùa hè rực rỡ"
    },
    {
        id: 2,
        title: "Dây Đeo Điện Thoại Charm Pha Lê Cao Cấp",
        writeDate: "20/12/2025",
        publishDate: "22/12/2025",
        category: "day-deo",
        status: "pending",
        description: "Dây đeo điện thoại charm pha lê, phản chiếu ánh sáng tuyệt đẹp"
    },
    {
        id: 3,
        title: "Set DIY Charm - Tự Tay Làm Phụ Kiện Độc Đáo",
        writeDate: "18/12/2025",
        publishDate: "20/12/2025",
        category: "set-diy",
        status: "published",
        description: "Set DIY charm cho phép bạn tự tay làm phụ kiện độc đáo"
    },
    {
        id: 4,
        title: "Ưu Đãi Black Friday - Giảm 50% Toàn Bộ Vòng Tay Charm",
        writeDate: "16/12/2025",
        publishDate: "",
        category: "vong-tay",
        status: "pending",
        description: "Chương trình khuyến mãi Black Friday đặc biệt cho vòng tay charm"
    },
    {
        id: 5,
        title: "Vòng Tay Charm Bạc - Phong Cách Tối Giản Sang Trọng",
        writeDate: "15/12/2025",
        publishDate: "18/12/2025",
        category: "vong-tay",
        status: "published",
        description: "Vòng tay charm bằng bạc nguyên chất, thiết kế tối giản sang trọng"
    },
    {
        id: 6,
        title: "Hướng Dẫn Phối Móc Khóa Charm Theo Phong Cách",
        writeDate: "14/12/2025",
        publishDate: "",
        category: "moc-khoa",
        status: "draft",
        description: "Bài viết hướng dẫn cách phối móc khóa charm cho từng phong cách"
    },
    {
        id: 7,
        title: "Dây Đeo Charm Hình Trái Tim - Quà Tặng Ý Nghĩa",
        writeDate: "12/12/2025",
        publishDate: "15/12/2025",
        category: "day-deo",
        status: "published",
        description: "Dây đeo charm hình trái tim, món quà ý nghĩa cho người thương"
    },
    {
        id: 8,
        title: "Set DIY Charm Cho Người Mới Bắt Đầu",
        writeDate: "10/12/2025",
        publishDate: "",
        category: "set-diy",
        status: "approved",
        description: "Set DIY charm dành cho người mới bắt đầu làm phụ kiện"
    },
    {
        id: 9,
        title: "Móc Khóa Charm Hình Thú Cưng - Đáng Yêu & Dễ Thương",
        writeDate: "08/12/2025",
        publishDate: "10/12/2025",
        category: "moc-khoa",
        status: "published",
        description: "Móc khóa charm hình thú cưng ngộ nghĩnh, đáng yêu"
    },
    {
        id: 10,
        title: "Dây Đeo Điện Thoại Charm Dài - Tiện Lợi & Thời Trang",
        writeDate: "05/12/2025",
        publishDate: "",
        category: "day-deo",
        status: "pending",
        description: "Dây đeo điện thoại charm dài, tiện lợi và thời trang"
    },
    {
        id: 11,
        title: "Vòng Tay Charm Đính Đá - Lấp Lánh Mọi Lúc Mọi Nơi",
        writeDate: "03/12/2025",
        publishDate: "",
        category: "vong-tay",
        status: "approved",
        description: "Vòng tay charm đính đá lấp lánh, phù hợp mọi dịp"
    },
    {
        id: 12,
        title: "Set DIY Charm Cao Cấp - Nguyên Liệu Nhập Khẩu",
        writeDate: "01/12/2025",
        publishDate: "03/12/2025",
        category: "set-diy",
        status: "published",
        description: "Set DIY charm cao cấp với nguyên liệu nhập khẩu từ Hàn Quốc"
    }
];

// Category mapping
const categoryMap = {
    'moc-khoa': 'Móc khóa charm',
    'day-deo': 'Dây đeo điện thoại charm',
    'set-diy': 'Set DIY charm',
    'vong-tay': 'Vòng tay charm'
};

// Status mapping
const statusMap = {
    'draft': { text: 'Bản nháp', class: 'status-draft-badge' },
    'pending': { text: 'Chờ duyệt', class: 'status-pending-badge' },
    'approved': { text: 'Đã duyệt', class: 'status-approved-badge' },
    'published': { text: 'Đã đăng', class: 'status-published-badge' },
    'rejected': { text: 'Cần sửa', class: 'status-rejected-badge' } 
};

// Current filter state
let currentFilters = {
    status: 'all',
    category: 'all',
    search: ''
};

// Current page state
let currentPage = 1;
const postsPerPage = 8;

// Variable to store post ID to delete
let postIdToDelete = null;

// Format date function
function formatDate(dateInput) {
    if (!dateInput) return '';
    
    try {
        // Nếu là chuỗi dạng "dd/mm/yyyy" thì trả về luôn
        if (typeof dateInput === 'string' && dateInput.includes('/')) {
            const parts = dateInput.split('/');
            if (parts.length === 3) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                return `${day}/${month}/${parts[2]}`;
            }
        }
        
        // Nếu là Date object
        let date;
        if (dateInput instanceof Date) {
            date = dateInput;
        } else {
            // Thử parse thành Date
            date = new Date(dateInput);
        }
        
        // Kiểm tra date hợp lệ
        if (isNaN(date.getTime())) {
            return dateInput || '';
        }
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
        
    } catch (e) {
        console.error('Lỗi format date:', e, 'Input:', dateInput);
        return dateInput || '';
    }
}

// Initialize danh sách bài viết
function initPostsPage() {
    initializeSampleDataWithImages(); // Khởi tạo dữ liệu mẫu
    updateStats();
    renderPosts();
    setupPostsEventListeners();
    setupStatCardListeners();
}

// Render posts based on filters and pagination
function renderPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    
    const filteredPosts = filterPosts();
    const paginatedPosts = paginatePosts(filteredPosts);
    
    postsContainer.innerHTML = '';
    
    if (paginatedPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="table-row">
                <div colspan="6" style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 40px; margin-bottom: 16px; color: #ddd;"></i>
                    <p style="font-size: 16px;">Không tìm thấy bài viết nào phù hợp với bộ lọc.</p>
                </div>
            </div>
        `;
        return;
    }
    
    paginatedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'table-row';
        
        // Format dates
        let writeDate;
        if (post.writeDate) {
            writeDate = formatDate(post.writeDate);
        } else if (post.createdAt) {
            // Nếu không có writeDate nhưng có createdAt, dùng createdAt
            writeDate = formatDate(post.createdAt);
        } else {
            // Mặc định là ngày hiện tại
            writeDate = formatDate(new Date());
        }
        
        const publishDate = post.publishDate ? formatDate(post.publishDate) : 'Chưa đăng';
        
        // Determine category
        const category = post.category || 'moc-khoa';
        const categoryName = categoryMap[category] || categoryMap['moc-khoa'];
        
        // Determine status
        const statusInfo = statusMap[post.status] || statusMap['draft'];
        
        let actionButtonHTML;
        if (post.status === 'approved') {
            actionButtonHTML = `
                <a href="dangbai.html?id=${post.id}" class="action-btn publish-btn" title="Đăng bài">
                    <i class="fas fa-paper-plane"></i>
                </a>
            `;
        } else if (post.status === 'published') {
            actionButtonHTML = `
                <span class="action-btn published-btn" title="Đã đăng" style="background-color: #D1FAE5; color: #065F46;">
                    <i class="fas fa-check"></i>
                </span>
            `;
        } else if (post.status === 'scheduled') {
            actionButtonHTML = `
                <span class="action-btn scheduled-btn" title="Đã lên lịch" style="background-color: #E0E7FF; color: #3730A3;">
                    <i class="fas fa-calendar-check"></i>
                </span>
            `;
        } else {
            actionButtonHTML = `
                <a href="chinhsuabaiviet.html?id=${post.id}" class="action-btn edit-btn" title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                </a>
            `;
        }
        
        postElement.innerHTML = `
            <div>
                <div style="font-weight: 600; color: var(--primary-dark); margin-bottom: 4px;">${post.title || 'Không có tiêu đề'}</div>
                <div style="font-size: 13px; color: #666;">${post.description || 'Không có mô tả'}</div>
            </div>
            <div>${writeDate}</div>
            <div>${publishDate}</div>
            <div><span class="category-badge">${categoryName}</span></div>
            <div><span class="status-badge ${statusInfo.class}">${statusInfo.text}</span></div>
            <div class="action-buttons">
                ${actionButtonHTML}
                <button class="action-btn delete-btn" title="Xóa" data-id="${post.id}" data-title="${post.title || 'Bài viết'}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const title = this.getAttribute('data-title');
            showDeleteModal(id, title);
        });
    });
    
    updatePagination(filteredPosts.length);
}

// Filter posts based on current filters
function filterPosts() {
    const allPosts = getAllPosts();
    return allPosts.filter(post => {
        if (currentFilters.status !== 'all' && post.status !== currentFilters.status) {
            return false;
        }
        
        if (currentFilters.category !== 'all' && post.category !== currentFilters.category) {
            return false;
        }
        
        if (currentFilters.search && !post.title.toLowerCase().includes(currentFilters.search.toLowerCase())) {
            return false;
        }
        
        return true;
    });
}

// Paginate posts
function paginatePosts(posts) {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return posts.slice(startIndex, endIndex);
}

// Update pagination buttons
function updatePagination(totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    
    // Update page buttons
    const pageButtons = document.querySelectorAll('.page-btn:not(#prev-page):not(#next-page)');
    pageButtons.forEach((btn, index) => {
        const pageNum = index + 1;
        if (pageNum <= totalPages) {
            btn.style.display = 'flex';
            btn.textContent = pageNum;
            btn.classList.toggle('active', pageNum === currentPage);
        } else {
            btn.style.display = 'none';
        }
    });
    
    // Update prev/next buttons
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Add event listeners to page buttons
    pageButtons.forEach((btn, index) => {
        btn.onclick = () => {
            currentPage = index + 1;
            renderPosts();
        };
    });
}

// Setup stat card click listeners
function setupStatCardListeners() {
    const statCards = {
        'stat-all': document.getElementById('stat-all'),
        'stat-draft': document.getElementById('stat-draft'),
        'stat-pending': document.getElementById('stat-pending'),
        'stat-approved': document.getElementById('stat-approved'),
        'stat-published': document.getElementById('stat-published'),
        'stat-rejected': document.getElementById('stat-rejected')
    };
    
    Object.keys(statCards).forEach(statId => {
        const card = statCards[statId];
        if (card) {
            card.addEventListener('click', function() {
                // Remove active class from all stat cards
                Object.values(statCards).forEach(card => {
                    if (card) card.classList.remove('active');
                });
                
                // Add active class to clicked stat card
                this.classList.add('active');
                
                // Update status filter based on clicked stat card
                const status = this.getAttribute('data-status');
                currentFilters.status = status;
                currentPage = 1;
                renderPosts();
            });
        }
    });
}

// Show delete confirmation modal
function showDeleteModal(id, title) {
    const deleteModal = document.getElementById('delete-modal');
    const postTitleToDelete = document.getElementById('post-title-to-delete');
    
    if (deleteModal && postTitleToDelete) {
        postIdToDelete = id;
        postTitleToDelete.textContent = title;
        deleteModal.style.display = 'flex';
    }
}

// Delete a post - XÓA CẢ TỪ POSTSDATA VÀ LOCALSTORAGE
function deletePost(id) {
    // Convert id to number
    const postId = parseInt(id);
    console.log('Đang xóa bài viết ID:', postId);
    
    // 1. Xóa từ mảng postsData (dữ liệu mẫu)
    const indexInSample = postsData.findIndex(post => post.id === postId);
    if (indexInSample !== -1) {
        postsData.splice(indexInSample, 1);
        console.log('Đã xóa từ postsData');
    }
    
    // 2. Xóa từ localStorage
    deletePostFromStorage(postId);
    
    // 3. Cập nhật giao diện
    updateStats();
    renderPosts();
    
    // 4. Hiển thị thông báo
    showNotification('Bài viết đã được xóa thành công!', 'success');
}

// Show notification với tự động xóa sau 3 giây
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#D1FAE5' : '#FEE2E2'}; 
                    color: ${type === 'success' ? '#065F46' : '#991B1B'}; 
                    padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
                    z-index: 1000; display: flex; align-items: center; gap: 12px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Xóa bài viết từ localStorage
function deletePostFromStorage(id) {
    const posts = getPostsFromStorage();
    const filteredPosts = posts.filter(post => post.id !== id);
    savePostsToStorage(filteredPosts);
    console.log('Đã lưu lại sau khi xóa, còn', filteredPosts.length, 'bài viết');
}

// Kết hợp dữ liệu mẫu với dữ liệu trong localStorage
function getAllPosts() {
    const storedPosts = getPostsFromStorage();
    
    // Tạo một bản sao của postsData để không ảnh hưởng đến mảng gốc
    const samplePostsCopy = [...postsData];
    
    // Tạo mảng kết hợp
    let combinedPosts = [];
    
    // Thêm dữ liệu từ localStorage trước (bài viết mới từ người dùng)
    combinedPosts = [...storedPosts];
    
    // Thêm dữ liệu mẫu (chỉ thêm nếu ID chưa tồn tại trong storedPosts)
    samplePostsCopy.forEach(samplePost => {
        if (!storedPosts.some(post => post.id === samplePost.id)) {
            combinedPosts.push(samplePost);
        }
    });
    
    // Sắp xếp: bài mới nhất lên đầu
    return combinedPosts.sort((a, b) => {
        // Ưu tiên theo createdAt nếu có
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (a.createdAt && !b.createdAt) {
            return -1; // a lên trước
        } else if (!a.createdAt && b.createdAt) {
            return 1; // b lên trước
        } else {
            // Sắp xếp theo ID (lớn hơn lên trước)
            return b.id - a.id;
        }
    });
}

// Setup event listeners for posts page
function setupPostsEventListeners() {
    const categoryFilter = document.getElementById('category-filter');
    const searchBox = document.getElementById('search-box');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            currentFilters.category = categoryFilter.value;
            currentPage = 1;
            renderPosts();
        });
    }
    
    // Search box
    if (searchBox) {
        searchBox.addEventListener('keyup', () => {
            currentFilters.search = searchBox.value;
            currentPage = 1;
            renderPosts();
        });
    }
    
    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            if (categoryFilter) categoryFilter.value = 'all';
            if (searchBox) searchBox.value = '';
            currentFilters = { status: 'all', category: 'all', search: '' };
            currentPage = 1;
            
            // Reset active stat card to "all"
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => card.classList.remove('active'));
            const statAll = document.getElementById('stat-all');
            if (statAll) statAll.classList.add('active');
            
            renderPosts();
        });
    }
    
    // Delete modal buttons
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            if (deleteModal) deleteModal.style.display = 'none';
            postIdToDelete = null;
        });
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (postIdToDelete) {
                deletePost(postIdToDelete);
                if (deleteModal) deleteModal.style.display = 'none';
                postIdToDelete = null;
            }
        });
    }
    
    // Close modal when clicking outside
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                deleteModal.style.display = 'none';
                postIdToDelete = null;
            }
        });
    }
    
    // Pagination buttons
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPosts();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const filteredPosts = filterPosts();
            const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderPosts();
            }
        });
    }
}

// Initialize posts page if on danhsachbaiviet.html
document.addEventListener('DOMContentLoaded', function() {
    const isPostsPage = window.location.pathname.includes('danhsachbaiviet.html');
    
    if (isPostsPage) {
        initPostsPage();
    }
});

/* ===== QUẢN LÝ BÀI VIẾT TRONG LOCALSTORAGE ===== */
const POSTS_STORAGE_KEY = 'tiny_tags_posts';

// Lấy danh sách bài viết từ localStorage
function getPostsFromStorage() {
    const stored = localStorage.getItem(POSTS_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Lỗi parse JSON từ localStorage:', e);
            return [];
        }
    }
    return [];
}

// Lưu bài viết vào localStorage
function savePostsToStorage(posts) {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
}

// Lấy ID tiếp theo cho bài viết mới
function getNextPostId() {
    const posts = getPostsFromStorage();
    if (posts.length === 0) return 1;
    const maxId = Math.max(...posts.map(post => post.id));
    return maxId + 1;
}

// Thêm bài viết mới
function addNewPost(postData) {
    const posts = getPostsFromStorage();
    posts.unshift(postData); // Thêm vào đầu mảng
    savePostsToStorage(posts);
}

// Cập nhật bài viết
function updatePost(updatedPost) {
    const posts = getPostsFromStorage();
    const index = posts.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
        posts[index] = updatedPost;
        savePostsToStorage(posts);
    }
}

// Function để kiểm tra và load dữ liệu mới
function checkForNewPosts() {
    const justCreated = sessionStorage.getItem('justCreatedPost');
    if (justCreated) {
        try {
            const newPost = JSON.parse(justCreated);
            sessionStorage.removeItem('justCreatedPost');
            console.log('Đã load bài viết mới từ sessionStorage');
        } catch (e) {
            console.error('Lỗi khi parse bài viết mới:', e);
        }
    }
}

/* ===== QUAN TRỌNG: LẤY BÀI VIẾT THEO ID VỚI DỮ LIỆU ĐẦY ĐỦ ===== */
function getPostById(postId) {
    const id = parseInt(postId);
    console.log('🔍 Đang tìm bài viết ID:', id);
    
    // 1. Tìm trong localStorage (ưu tiên)
    const storedPosts = getPostsFromStorage();
    console.log('📂 Bài viết trong localStorage:', storedPosts.length);
    
    const postInStorage = storedPosts.find(post => post.id === id);
    if (postInStorage) {
        console.log('✅ Tìm thấy bài viết trong localStorage:', {
            id: postInStorage.id,
            title: postInStorage.title,
            hashtags: postInStorage.hashtags,
            images: postInStorage.images,
            platforms: postInStorage.platforms
        });
        
        // Đảm bảo có đầy đủ trường dữ liệu
        const result = {
            id: postInStorage.id,
            title: postInStorage.title || 'Không có tiêu đề',
            content: postInStorage.content || postInStorage.description || '',
            description: postInStorage.description || '',
            category: postInStorage.category || 'moc-khoa',
            status: postInStorage.status || 'draft',
            // QUAN TRỌNG: Xử lý hashtags đúng cách
            hashtags: Array.isArray(postInStorage.hashtags) ? 
                postInStorage.hashtags : 
                (postInStorage.tags && Array.isArray(postInStorage.tags) ? 
                    postInStorage.tags : []),
            // QUAN TRỌNG: Xử lý images đúng cách
            images: Array.isArray(postInStorage.images) ? 
                postInStorage.images : 
                (postInStorage.imageUrl ? 
                    [postInStorage.imageUrl] : 
                    (postInStorage.photo ? [postInStorage.photo] : [])),
            // QUAN TRỌNG: Xử lý platforms đúng cách
            platforms: Array.isArray(postInStorage.platforms) ? 
                postInStorage.platforms : 
                (postInStorage.platform ? 
                    [postInStorage.platform] : 
                    ['facebook_page']),
            writeDate: postInStorage.writeDate || postInStorage.createdAt || new Date().toLocaleDateString('vi-VN'),
            publishDate: postInStorage.publishDate || '',
            feedback: postInStorage.feedback || '',
            feedbackDate: postInStorage.feedbackDate || '',
            // Giữ lại tất cả các trường cũ
            ...postInStorage
        };
        
        console.log('📤 Dữ liệu trả về từ localStorage:', {
            hashtags: result.hashtags,
            images: result.images,
            platforms: result.platforms
        });
        
        return result;
    }
    
    // 2. Tìm trong postsData (dữ liệu mẫu)
    console.log('📂 Bài viết trong postsData:', postsData.length);
    const postInSample = postsData.find(post => post.id === id);
    if (postInSample) {
        console.log('✅ Tìm thấy bài viết trong postsData:', {
            id: postInSample.id,
            title: postInSample.title,
            hashtags: postInSample.hashtags,
            images: postInSample.images,
            platforms: postInSample.platforms
        });
        
        // Đảm bảo có đầy đủ trường dữ liệu
        const result = {
            id: postInSample.id,
            title: postInSample.title || 'Không có tiêu đề',
            content: postInSample.content || postInSample.description || '',
            description: postInSample.description || '',
            category: postInSample.category || 'moc-khoa',
            status: postInSample.status || 'draft',
            hashtags: Array.isArray(postInSample.hashtags) ? postInSample.hashtags : [],
            images: Array.isArray(postInSample.images) ? postInSample.images : [],
            platforms: Array.isArray(postInSample.platforms) ? postInSample.platforms : ['facebook_page'],
            writeDate: postInSample.writeDate || '',
            publishDate: postInSample.publishDate || '',
            feedback: postInSample.feedback || '',
            feedbackDate: postInSample.feedbackDate || '',
            ...postInSample
        };
        
        console.log('📤 Dữ liệu trả về từ postsData:', {
            hashtags: result.hashtags,
            images: result.images,
            platforms: result.platforms
        });
        
        return result;
    }
    
    console.log('❌ Không tìm thấy bài viết với ID:', id);
    return null;
}

// Cập nhật bài viết trong storage
function updatePostInStorage(updatedPost) {
    const posts = getPostsFromStorage();
    const index = posts.findIndex(post => post.id === updatedPost.id);
    
    if (index !== -1) {
        // Cập nhật toàn bộ object, không chỉ merge
        posts[index] = { ...posts[index], ...updatedPost };
        console.log('🔄 Đã cập nhật bài viết có sẵn:', updatedPost.id);
    } else {
        // Thêm mới
        posts.push(updatedPost);
        console.log('🆕 Đã thêm bài viết mới:', updatedPost.id);
    }
    
    // Lưu vào localStorage với key đúng
    localStorage.setItem('tiny_tags_posts', JSON.stringify(posts));
    console.log('💾 Đã lưu vào localStorage, tổng số bài:', posts.length);
    
    // Đồng bộ với postsData nếu cần
    syncWithPostsData(updatedPost);
}

// Hàm đồng bộ với postsData
function syncWithPostsData(updatedPost) {
    const index = postsData.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
        postsData[index] = { ...postsData[index], ...updatedPost };
        console.log('🔄 Đã đồng bộ với postsData');
    }
}

// Khởi tạo dữ liệu mẫu với hình ảnh, hashtags và platforms
function initializeSampleDataWithImages() {
    // URLs hình ảnh mẫu cho charm
    const sampleImages = [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1605100940035-2de2a6d5e2ae?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop'
    ];
    
    // Cập nhật postsData với hình ảnh, hashtags và nền tảng
    postsData.forEach((post, index) => {
        // Thêm hình ảnh (mỗi bài 1-3 ảnh)
        const numImages = Math.min(Math.floor(Math.random() * 3) + 1, sampleImages.length);
        const shuffledImages = [...sampleImages].sort(() => Math.random() - 0.5);
        post.images = shuffledImages.slice(0, numImages);
        
        // Thêm nền tảng
        post.platforms = ['facebook_page']; // Mặc định có trang Facebook
        
        // 70% bài viết có nhóm Facebook
        if (Math.random() > 0.3) {
            post.platforms.push('facebook_group');
        }
        
        // 50% bài viết có TikTok
        if (Math.random() > 0.5) {
            post.platforms.push('tiktok');
        }
        
        // Thêm hashtags
        const hashtagSets = [
            ['tinytags', 'phukiencharm', 'charmdethuong', 'handmade'],
            ['tinytags', 'mockhoa', 'phukien', 'quatang'],
            ['tinytags', 'daydeo', 'dienthoai', 'thoitrang'],
            ['tinytags', 'diy', 'tulam', 'sangtao'],
            ['tinytags', 'vongtay', 'trangsuc', 'thoitrang']
        ];
        
        const selectedSet = hashtagSets[Math.floor(Math.random() * hashtagSets.length)];
        const numHashtags = Math.floor(Math.random() * 3) + 2; // 2-4 hashtags
        post.hashtags = selectedSet.slice(0, numHashtags);
        
        // Thêm content mẫu
        if (!post.content) {
            post.content = `<p>${post.description}</p>
                           <p>✨ ${categoryMap[post.category]} từ Tiny Tags - mang đến sự dễ thương và độc đáo cho bạn!</p>
                           <p>❤️ Hãy mua ngay để nhận ưu đãi đặc biệt!</p>
                           <p>📍 Địa chỉ: 123 Đường Charm, Quận 1, TP.HCM</p>
                           <p>📞 Hotline: 0909 123 456</p>`;
        }
        
        // Thêm ngày viết nếu chưa có
        if (!post.writeDate) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            post.writeDate = date.toLocaleDateString('vi-VN');
        }
    });
    
    console.log('✅ Đã khởi tạo dữ liệu mẫu với hình ảnh, hashtags và nền tảng');
}

// Gọi hàm khi trang load
document.addEventListener('DOMContentLoaded', function() {
    initializeSampleDataWithImages();
});

/* ===== TRANG QUẢN LÝ BÀI VIẾT CHỜ DUYỆT ===== */

// Status mapping cho manager
const managerStatusMap = {
    'pending': { text: 'Chờ duyệt', class: 'status-pending-badge' },
    'approved': { text: 'Đã duyệt', class: 'status-approved-badge' },
    'rejected': { text: 'Đã từ chối', class: 'status-rejected-badge' }
};

// Platform mapping
const platformMap = {
    'facebook_page': { name: 'Facebook Page', icon: 'fab fa-facebook', class: 'facebook' },
    'facebook_group': { name: 'Facebook Group', icon: 'fas fa-users', class: 'facebook' },
    'tiktok': { name: 'TikTok', icon: 'fab fa-tiktok', class: 'tiktok' },
    'instagram': { name: 'Instagram', icon: 'fab fa-instagram', class: 'instagram' }
};

// Khởi tạo trang manager
function initManagerPage() {
    updateManagerStats();
    renderManagerPosts();
    setupManagerEventListeners();
    setupManagerStatCardListeners();
}

// Cập nhật thống kê cho manager
function updateManagerStats() {
    const allPosts = getAllPostsForManager();
    const pending = allPosts.filter(p => p.status === 'pending').length;
    const approved = allPosts.filter(p => p.status === 'approved').length;
    const rejected = allPosts.filter(p => p.status === 'rejected').length;
    const total = pending + approved + rejected;
    
    const pendingEl = document.getElementById('pending-posts');
    const approvedEl = document.getElementById('approved-posts');
    const rejectedEl = document.getElementById('rejected-posts');
    const totalEl = document.getElementById('total-posts');
    
    if (pendingEl) pendingEl.textContent = pending;
    if (approvedEl) approvedEl.textContent = approved;
    if (rejectedEl) rejectedEl.textContent = rejected;
    if (totalEl) totalEl.textContent = total;
}

// Lấy tất cả bài viết cho manager (chỉ hiển thị pending, approved, rejected)
function getAllPostsForManager() {
    const allPosts = getAllPosts();
    return allPosts.filter(post => 
        post.status === 'pending' || 
        post.status === 'approved' || 
        post.status === 'rejected'
    );
}

// Render bài viết cho manager
function renderManagerPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    
    const filteredPosts = filterManagerPosts();
    const paginatedPosts = paginatePosts(filteredPosts);
    
    postsContainer.innerHTML = '';
    
    if (paginatedPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="table-row">
                <div colspan="6" style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 40px; margin-bottom: 16px; color: #ddd;"></i>
                    <p style="font-size: 16px;">Không tìm thấy bài viết nào phù hợp với bộ lọc.</p>
                </div>
            </div>
        `;
        return;
    }
    
    paginatedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'table-row';
        
        // Format dates
        const writeDate = post.writeDate || post.createdAt || '';
        const formattedWriteDate = writeDate ? formatDate(writeDate) : 'Chưa có';
        
        // Determine category
        const category = post.category || 'moc-khoa';
        const categoryName = categoryMap[category] || categoryMap['moc-khoa'];
        
        // Determine status
        const statusInfo = managerStatusMap[post.status] || managerStatusMap['pending'];
        
        // Get author (người gửi)
        const author = post.author || 'Marketing Team';
        
        // Render platforms
        let platformsHTML = '';
        if (post.platforms && Array.isArray(post.platforms)) {
            post.platforms.forEach(platform => {
                const platformInfo = platformMap[platform] || { name: platform, icon: 'fas fa-globe', class: '' };
                platformsHTML += `
                    <span class="platform-badge ${platformInfo.class}">
                        <i class="${platformInfo.icon}"></i>
                        <span>${platformInfo.name}</span>
                    </span>
                `;
            });
        } else {
            platformsHTML = '<span class="category-badge">Chưa chọn</span>';
        }
        
        // Determine action buttons based on status
        let actionButtonsHTML = '';
        
        if (post.status === 'pending') {
            actionButtonsHTML = `
                <button class="action-btn view-btn" title="Xem chi tiết" onclick="viewPostDetail(${post.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn approve-btn" title="Phê duyệt" onclick="approvePost(${post.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="action-btn reject-btn" title="Từ chối" onclick="showRejectModal(${post.id}, '${post.title.replace(/'/g, "\\'")}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
        } else if (post.status === 'approved') {
            actionButtonsHTML = `
                <button class="action-btn view-btn" title="Xem chi tiết" onclick="viewPostDetail(${post.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <span class="category-badge" style="background-color: var(--primary-green-light); color: var(--primary-green-dark);">
                    Đã duyệt
                </span>
            `;
        } else if (post.status === 'rejected') {
            actionButtonsHTML = `
                <button class="action-btn view-btn" title="Xem chi tiết" onclick="viewPostDetail(${post.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <span class="category-badge" style="background-color: var(--primary-red-light); color: var(--primary-red-dark);">
                    Đã từ chối
                </span>
            `;
        }
        
        postElement.innerHTML = `
            <div>
                <div style="font-weight: 600; color: var(--primary-dark); margin-bottom: 4px;">${post.title || 'Không có tiêu đề'}</div>
                <div style="font-size: 13px; color: #666;">${post.description || 'Không có mô tả'}</div>
            </div>
            <div>${author}</div>
            <div>${formattedWriteDate}</div>
            <div><span class="category-badge">${categoryName}</span></div>
            <div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${platformsHTML}
                </div>
            </div>
            <div class="action-buttons">
                ${actionButtonsHTML}
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
    
    updatePagination(filteredPosts.length);
}

// Filter posts for manager
function filterManagerPosts() {
    const allPosts = getAllPostsForManager();
    return allPosts.filter(post => {
        if (currentFilters.status !== 'all' && post.status !== currentFilters.status) {
            return false;
        }
        
        if (currentFilters.category !== 'all' && post.category !== currentFilters.category) {
            return false;
        }
        
        if (currentFilters.search && !post.title.toLowerCase().includes(currentFilters.search.toLowerCase())) {
            return false;
        }
        
        return true;
    });
}

// Setup stat card listeners for manager
function setupManagerStatCardListeners() {
    const statCards = {
        'stat-all': document.getElementById('stat-all'),
        'stat-approved': document.getElementById('stat-approved'),
        'stat-rejected': document.getElementById('stat-rejected'),
        'stat-total': document.getElementById('stat-total')
    };
    
    Object.keys(statCards).forEach(statId => {
        const card = statCards[statId];
        if (card) {
            card.addEventListener('click', function() {
                // Remove active class from all stat cards
                Object.values(statCards).forEach(card => {
                    if (card) card.classList.remove('active');
                });
                
                // Add active class to clicked stat card
                this.classList.add('active');
                
                // Update status filter based on clicked stat card
                const status = this.getAttribute('data-status');
                currentFilters.status = status;
                currentPage = 1;
                renderManagerPosts();
            });
        }
    });
}

// Setup event listeners for manager page
function setupManagerEventListeners() {
    const categoryFilter = document.getElementById('category-filter');
    const searchBox = document.getElementById('search-box');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const rejectModal = document.getElementById('reject-modal');
    const cancelRejectBtn = document.getElementById('cancel-reject');
    const confirmRejectBtn = document.getElementById('confirm-reject');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            currentFilters.category = categoryFilter.value;
            currentPage = 1;
            renderManagerPosts();
        });
    }
    
    // Search box
    if (searchBox) {
        searchBox.addEventListener('keyup', () => {
            currentFilters.search = searchBox.value;
            currentPage = 1;
            renderManagerPosts();
        });
    }
    
    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            if (categoryFilter) categoryFilter.value = 'all';
            if (searchBox) searchBox.value = '';
            currentFilters = { status: 'pending', category: 'all', search: '' };
            currentPage = 1;
            
            // Reset active stat card to "pending"
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => card.classList.remove('active'));
            const statAll = document.getElementById('stat-all');
            if (statAll) statAll.classList.add('active');
            
            renderManagerPosts();
        });
    }
    
    // Reject modal buttons
    if (cancelRejectBtn) {
        cancelRejectBtn.addEventListener('click', () => {
            if (rejectModal) {
                rejectModal.style.display = 'none';
                document.getElementById('reject-reason').value = '';
            }
            postIdToReject = null;
        });
    }
    
    if (confirmRejectBtn) {
        confirmRejectBtn.addEventListener('click', () => {
            const reason = document.getElementById('reject-reason').value.trim();
            if (postIdToReject && reason) {
                rejectPost(postIdToReject, reason);
                if (rejectModal) {
                    rejectModal.style.display = 'none';
                    document.getElementById('reject-reason').value = '';
                }
                postIdToReject = null;
            } else if (!reason) {
                alert('Vui lòng nhập lý do từ chối!');
            }
        });
    }
    
    // Close modal when clicking outside
    if (rejectModal) {
        rejectModal.addEventListener('click', (e) => {
            if (e.target === rejectModal) {
                rejectModal.style.display = 'none';
                document.getElementById('reject-reason').value = '';
                postIdToReject = null;
            }
        });
    }
    
    // Pagination buttons
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderManagerPosts();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const filteredPosts = filterManagerPosts();
            const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderManagerPosts();
            }
        });
    }
}

// Variable to store post ID to reject
let postIdToReject = null;

// Show reject modal
function showRejectModal(id, title) {
    const rejectModal = document.getElementById('reject-modal');
    const postTitleToReject = document.getElementById('post-title-to-reject');
    
    if (rejectModal && postTitleToReject) {
        postIdToReject = id;
        postTitleToReject.textContent = title;
        rejectModal.style.display = 'flex';
    }
}

// Approve a post
function approvePost(id) {
    const postId = parseInt(id);
    const post = getPostById(postId);
    
    if (post) {
        // Update post status to approved
        post.status = 'approved';
        post.approvedAt = new Date().toISOString();
        
        // Update in localStorage
        updatePostInStorage(post);
        
        // Update stats and render
        updateManagerStats();
        renderManagerPosts();
        
        // Show notification
        showNotification('Bài viết đã được phê duyệt thành công!', 'success');
    }
}

// Reject a post
function rejectPost(id, reason) {
    const postId = parseInt(id);
    const post = getPostById(postId);
    
    if (post) {
        // Update post status to rejected
        post.status = 'rejected';
        post.rejectedAt = new Date().toISOString();
        post.rejectionReason = reason;
        
        // Update in localStorage
        updatePostInStorage(post);
        
        // Update stats and render
        updateManagerStats();
        renderManagerPosts();
        
        // Show notification
        showNotification('Bài viết đã bị từ chối.', 'error');
    }
}

// View post detail (chuyển đến trang xem chi tiết)
function viewPostDetail(id) {
    window.location.href = `chitietbaiviet.html?id=${id}&from=manager`;
}

// Initialize manager page if on dsbaivietchoduyet.html
document.addEventListener('DOMContentLoaded', function() {
    const isManagerPage = window.location.pathname.includes('dsbaivietchoduyet.html');
    
    if (isManagerPage) {
        // Set default filter to "pending"
        currentFilters.status = 'pending';
        
        // Initialize manager page
        initManagerPage();
    }
});

// THÊM VÀO CUỐI FILE marketing.js

/* ===== ĐỒNG BỘ TRẠNG THÁI BÀI VIẾT ===== */

// Hàm phê duyệt bài viết (dùng chung cho cả manager và staff)
function approvePostInStorage(postId) {
    const post = getPostById(postId);
    if (!post) {
        console.error('Không tìm thấy bài viết ID:', postId);
        return false;
    }
    
    // Cập nhật trạng thái
    post.status = 'approved';
    post.approvedAt = new Date().toISOString();
    post.approvedBy = 'Manager';
    
    // Lưu vào localStorage
    updatePostInStorage(post);
    
    console.log('✅ Đã phê duyệt bài viết ID:', postId);
    
    // Cập nhật thống kê cho tất cả các trang
    updateAllPagesStats();
    
    return true;
}

// Hàm từ chối bài viết (dùng chung cho cả manager và staff)
function rejectPostInStorage(postId, reason) {
    console.log('🔄 marketing.js: Đang từ chối bài viết ID:', postId);
    
    const post = getPostById(postId);
    if (!post) {
        console.error('❌ Không tìm thấy bài viết ID:', postId);
        return false;
    }
    
    // Cập nhật trạng thái
    post.status = 'rejected';
    post.rejectedAt = new Date().toISOString();
    post.rejectedBy = 'Manager';
    post.rejectionReason = reason;
    post.feedback = reason;
    post.feedbackDate = new Date().toISOString();
    
    // Lưu vào storage
    updatePostInStorage(post);
    
    // Gửi event để các trang khác biết
    if (typeof window.dispatchStorageUpdateEvent === 'function') {
        window.dispatchStorageUpdateEvent();
    } else {
        // Fallback
        window.dispatchEvent(new Event('storageUpdated'));
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'tiny_tags_posts'
        }));
    }
    
    console.log('✅ Đã từ chối bài viết:', postId);
    return true;
}

// Export hàm để trang chi tiết có thể gọi
if (typeof window !== 'undefined') {
    window.rejectPostInStorage = rejectPostInStorage;
}

// THÊM HÀM MỚI: Gửi event khi storage thay đổi
function dispatchStorageUpdateEvent() {
    const event = new Event('storageUpdated');
    window.dispatchEvent(event);
    console.log('📡 Đã gửi storageUpdated event');
}

// Cập nhật thống kê cho tất cả các trang
function updateAllPagesStats() {
    // Cập nhật stats cho trang staff (danhsachbaiviet.html)
    if (typeof updateStats === 'function') {
        updateStats();
    }
    
    // Cập nhật stats cho trang manager (dsbaivietchoduyet.html)
    if (typeof updateManagerStats === 'function') {
        updateManagerStats();
    }
    
    // Cập nhật số lượng pending trên sidebar
    updateSidebarPendingCounts();
}

// Cập nhật số lượng pending trên sidebar
function updateSidebarPendingCounts() {
    const allPosts = getAllPosts();
    const pendingCount = allPosts.filter(p => p.status === 'pending').length;
    
    // Cập nhật cho sidebar staff
    const staffPendingBadge = document.getElementById('pending-count');
    if (staffPendingBadge) {
        staffPendingBadge.textContent = pendingCount;
    }
    
    // Cập nhật cho sidebar manager (nếu có)
    const managerPendingBadges = document.querySelectorAll('#pending-count');
    managerPendingBadges.forEach(badge => {
        badge.textContent = pendingCount;
    });
    
    // Cập nhật thông qua hàm toàn cục (cho manager.js)
    if (typeof window.updateSidebarPendingCount === 'function') {
        window.updateSidebarPendingCount(pendingCount);
    }
}

// Export các hàm để trang chi tiết có thể gọi
if (typeof window !== 'undefined') {
    window.approvePost = approvePostInStorage;
    window.rejectPost = rejectPostInStorage;
    window.getPostById = getPostById;
    window.updatePostInStorage = updatePostInStorage;
    window.updateAllPagesStats = updateAllPagesStats;
}

/* ===== TRANG ĐĂNG BÀI CHO STAFF ===== */

// Hàm kiểm tra bài viết đã được duyệt
function isPostApproved(postId) {
    const post = getPostById(postId);
    return post && post.status === 'approved';
}

// Hàm đăng bài ngay lập tức
function publishPostImmediately(postId) {
    const post = getPostById(postId);
    if (!post) return false;
    
    post.status = 'published';
    post.publishDate = new Date().toISOString();
    post.publishedAt = new Date().toISOString();
    post.publishedBy = 'Staff';
    
    updatePostInStorage(post);
    return true;
}

// Hàm lên lịch đăng bài
function schedulePostForPublishing(postId, scheduleData) {
    const post = getPostById(postId);
    if (!post) return false;
    
    post.status = 'scheduled';
    post.scheduleData = scheduleData;
    post.scheduledAt = new Date().toISOString();
    post.scheduledBy = 'Staff';
    
    updatePostInStorage(post);
    return true;
}

// Hàm cập nhật danh sách bài viết khi trạng thái thay đổi
function refreshPostsList() {
    if (typeof renderPosts === 'function') {
        renderPosts();
    }
    if (typeof updateStats === 'function') {
        updateStats();
    }
}

// Hàm khởi tạo trang đăng bài
function initPublishPage() {
    // Tự động kiểm tra và load bài viết
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (postId) {
        if (!isPostApproved(postId)) {
            alert('Bài viết chưa được duyệt hoặc không tồn tại!');
            window.location.href = 'danhsachbaiviet.html';
            return;
        }
    }
    
    console.log('✅ Trang đăng bài đã sẵn sàng');
}

// Gọi hàm khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    const isPublishPage = window.location.pathname.includes('dangbai.html');
    
    if (isPublishPage) {
        initPublishPage();
    }
});

/* ===== CẬP NHẬT STATUS MAPPING ===== */
// Thêm status 'scheduled' vào statusMap nếu chưa có
if (statusMap && !statusMap.scheduled) {
    statusMap.scheduled = { 
        text: 'Đã lên lịch', 
        class: 'status-scheduled-badge' 
    };
}

if (statusMap && !statusMap.published) {
    statusMap.published = { 
        text: 'Đã đăng', 
        class: 'status-published-badge' 
    };
}