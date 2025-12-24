// manager-posts.js
// Quản lý danh sách bài viết chờ duyệt (Manager)

/* ===== BIẾN TOÀN CỤC ===== */
let currentFilters = {
    status: 'pending',
    category: 'all',
    search: ''
};

let currentPage = 1;
const postsPerPage = 8;
let postIdToReject = null;

// Map trạng thái cho manager
const managerStatusMap = {
    'pending': { text: 'Chờ duyệt', class: 'status-pending-badge' },
    'approved': { text: 'Đã duyệt', class: 'status-approved-badge' },
    'rejected': { text: 'Đã từ chối', class: 'status-rejected-badge' }
};

// Map danh mục
const categoryMap = {
    'moc-khoa': 'Móc khóa charm',
    'day-deo': 'Dây đeo điện thoại charm',
    'set-diy': 'Set DIY charm',
    'vong-tay': 'Vòng tay charm'
};

// Map nền tảng
const platformMap = {
    'facebook_page': { name: 'Facebook Page', icon: 'fab fa-facebook', class: 'facebook' },
    'facebook_group': { name: 'Facebook Group', icon: 'fas fa-users', class: 'facebook' },
    'tiktok': { name: 'TikTok', icon: 'fab fa-tiktok', class: 'tiktok' },
    'instagram': { name: 'Instagram', icon: 'fab fa-instagram', class: 'instagram' }
};

/* ===== KHỞI TẠO TRANG ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem có đang ở trang dsbaivietchoduyet.html không
    const isManagerPage = window.location.pathname.includes('dsbaivietchoduyet.html');
    
    if (isManagerPage) {
        initializeManagerPage();
    }
});

// Khởi tạo trang manager
function initializeManagerPage() {
    console.log('🔄 Khởi tạo trang quản lý bài viết chờ duyệt');
    
    // Cập nhật thống kê
    updateManagerStats();
    
    // Render danh sách bài viết
    renderManagerPosts();
    
    // Thiết lập event listeners
    setupManagerEventListeners();
    
    // Thiết lập listener cho stat cards
    setupManagerStatCardListeners();
    
    // Thiết lập listener cho modal từ chối
    setupRejectModalListeners();
}

/* ===== XỬ LÝ DỮ LIỆU ===== */

// Lấy tất cả bài viết từ localStorage
function getAllPostsFromStorage() {
    const stored = localStorage.getItem('tiny_tags_posts');
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

// Lấy tất cả bài viết cho manager (pending, approved, rejected)
function getAllPostsForManager() {
    const allPosts = getAllPostsFromStorage();
    
    // Thêm dữ liệu mẫu nếu không có dữ liệu
    if (allPosts.length === 0) {
        loadSamplePostsToStorage();
        return getAllPostsFromStorage();
    }
    
    return allPosts.filter(post => 
        post.status === 'pending' || 
        post.status === 'approved' || 
        post.status === 'rejected'
    );
}

// Tải dữ liệu mẫu vào localStorage
function loadSamplePostsToStorage() {
    const samplePosts = [
        {
            id: 1,
            title: "Bộ Sưu Tập Móc Khóa Charm Mùa Hè 2025",
            writeDate: "22/12/2025",
            publishDate: "25/12/2025",
            category: "moc-khoa",
            status: "published",
            description: "Giới thiệu bộ sưu tập móc khóa charm mới nhất với thiết kế mùa hè rực rỡ",
            author: "Staff 01",
            content: "Bộ sưu tập móc khóa charm mùa hè 2025 với thiết kế tươi sáng, màu sắc rực rỡ. Perfect cho mùa hè này!",
            hashtags: ["tinytags", "mochoa", "summer2025", "charm"],
            images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"],
            platforms: ["facebook_page", "facebook_group"]
        },
        {
            id: 2,
            title: "Dây Đeo Điện Thoại Charm Pha Lê Cao Cấp",
            writeDate: "20/12/2025",
            publishDate: "22/12/2025",
            category: "day-deo",
            status: "pending",
            description: "Dây đeo điện thoại charm pha lê, phản chiếu ánh sáng tuyệt đẹp",
            author: "Staff 02",
            content: "Dây đeo điện thoại charm pha lê cao cấp, phản chiếu ánh sáng lung linh. Chất liệu cao cấp, bền đẹp.",
            hashtags: ["tinytags", "daydeo", "phalê", "caocap"],
            images: ["https://images.unsplash.com/photo-1605100940035-2de2a6d5e2ae?w=400&h=400&fit=crop"],
            platforms: ["facebook_page", "tiktok"]
        },
        {
            id: 3,
            title: "Set DIY Charm - Tự Tay Làm Phụ Kiện Độc Đáo",
            writeDate: "18/12/2025",
            publishDate: "20/12/2025",
            category: "set-diy",
            status: "approved",
            description: "Set DIY charm cho phép bạn tự tay làm phụ kiện độc đáo",
            author: "Staff 03",
            content: "Set DIY charm với đầy đủ nguyên liệu và hướng dẫn chi tiết. Tự tay làm phụ kiện độc đáo của riêng bạn!",
            hashtags: ["tinytags", "diy", "handmade", "sangtao"],
            images: ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop"],
            platforms: ["facebook_page", "instagram"]
        },
        {
            id: 4,
            title: "Ưu Đãi Black Friday - Giảm 50% Toàn Bộ Vòng Tay Charm",
            writeDate: "16/12/2025",
            publishDate: "",
            category: "vong-tay",
            status: "pending",
            description: "Chương trình khuyến mãi Black Friday đặc biệt cho vòng tay charm",
            author: "Staff 01",
            content: "Ưu đãi Black Friday - Giảm 50% toàn bộ vòng tay charm. Thời gian có hạn, nhanh tay đặt hàng!",
            hashtags: ["tinytags", "blackfriday", "sale50", "vongtay"],
            images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop"],
            platforms: ["facebook_page", "facebook_group", "tiktok"]
        },
        {
            id: 5,
            title: "Vòng Tay Charm Bạc - Phong Cách Tối Giản Sang Trọng",
            writeDate: "15/12/2025",
            publishDate: "18/12/2025",
            category: "vong-tay",
            status: "rejected",
            description: "Vòng tay charm bằng bạc nguyên chất, thiết kế tối giản sang trọng",
            author: "Staff 02",
            content: "Vòng tay charm bạc nguyên chất, thiết kế tối giản nhưng vô cùng sang trọng. Phù hợp với mọi phong cách.",
            hashtags: ["tinytags", "vongtay", "bacnguyenchat", "toigian"],
            images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop"],
            platforms: ["facebook_page"],
            feedback: "Cần bổ sung thông tin về chất liệu bạc và kích thước sản phẩm."
        }
    ];
    
    localStorage.setItem('tiny_tags_posts', JSON.stringify(samplePosts));
    console.log('✅ Đã tải dữ liệu mẫu vào localStorage');
}

// Lấy bài viết theo ID
function getPostById(postId) {
    const id = parseInt(postId);
    const allPosts = getAllPostsFromStorage();
    
    return allPosts.find(post => post.id === id) || null;
}

// Cập nhật bài viết trong storage
function updatePostInStorage(updatedPost) {
    const posts = getAllPostsFromStorage();
    const index = posts.findIndex(post => post.id === updatedPost.id);
    
    if (index !== -1) {
        posts[index] = updatedPost;
    } else {
        posts.push(updatedPost);
    }
    
    localStorage.setItem('tiny_tags_posts', JSON.stringify(posts));
    console.log('✅ Đã cập nhật bài viết ID:', updatedPost.id);
}

/* ===== HIỂN THỊ DANH SÁCH BÀI VIẾT ===== */

// Cập nhật thống kê
function updateManagerStats() {
    const allPosts = getAllPostsForManager();
    const pending = allPosts.filter(p => p.status === 'pending').length;
    const approved = allPosts.filter(p => p.status === 'approved').length;
    const rejected = allPosts.filter(p => p.status === 'rejected').length;
    const total = pending + approved + rejected;
    
    // Cập nhật UI
    document.querySelectorAll('#pending-posts').forEach(el => el.textContent = pending);
    document.querySelectorAll('#approved-posts').forEach(el => el.textContent = approved);
    document.querySelectorAll('#rejected-posts').forEach(el => el.textContent = rejected);
    document.querySelectorAll('#total-posts').forEach(el => el.textContent = total);
    
    // Cập nhật badge trên sidebar
    const pendingBadge = document.getElementById('pending-count');
    if (pendingBadge) {
        pendingBadge.textContent = pending;
    }
}

// Lọc bài viết
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

// Phân trang bài viết
function paginatePosts(posts) {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return posts.slice(startIndex, endIndex);
}

// Render danh sách bài viết
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
        updatePagination(0);
        return;
    }
    
    paginatedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'table-row';
        postElement.setAttribute('data-post-id', post.id);
        
        // Format dates
        const writeDate = post.writeDate || post.createdAt || '';
        const formattedWriteDate = formatDate(writeDate) || 'Chưa có';
        
        // Determine category
        const categoryName = categoryMap[post.category] || 'Không xác định';
        
        // Determine status
        const statusInfo = managerStatusMap[post.status] || managerStatusMap['pending'];
        
        // Get author
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
                <button class="action-btn reject-btn" title="Từ chối" onclick="showRejectModal(${post.id}, '${escapeHtml(post.title)}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
        } else if (post.status === 'approved') {
            actionButtonsHTML = `
                <button class="action-btn view-btn" title="Xem chi tiết" onclick="viewPostDetail(${post.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <span class="category-badge" style="background-color: #D1FAE5; color: #065F46;">
                    Đã duyệt
                </span>
            `;
        } else if (post.status === 'rejected') {
            actionButtonsHTML = `
                <button class="action-btn view-btn" title="Xem chi tiết" onclick="viewPostDetail(${post.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <span class="category-badge" style="background-color: #FEE2E2; color: #991B1B;">
                    Đã từ chối
                </span>
            `;
        }
        
        postElement.innerHTML = `
            <div>
                <div style="font-weight: 600; color: #90324D; margin-bottom: 4px;">
                    ${escapeHtml(post.title || 'Không có tiêu đề')}
                </div>
                <div style="font-size: 13px; color: #666;">
                    ${escapeHtml(post.description || 'Không có mô tả')}
                </div>
            </div>
            <div>${escapeHtml(author)}</div>
            <div>${formattedWriteDate}</div>
            <div><span class="category-badge">${escapeHtml(categoryName)}</span></div>
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

// Cập nhật phân trang
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
            btn.onclick = () => {
                currentPage = pageNum;
                renderManagerPosts();
            };
        } else {
            btn.style.display = 'none';
        }
    });
    
    // Update prev/next buttons
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage === 1;
        prevPageBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderManagerPosts();
            }
        };
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
        nextPageBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderManagerPosts();
            }
        };
    }
}

/* ===== CHỨC NĂNG CHÍNH ===== */

// Xem chi tiết bài viết (CHỨC NĂNG QUAN TRỌNG)
function viewPostDetail(postId) {
    console.log('👁️ Xem chi tiết bài viết ID:', postId);
    
    // Chuyển đến trang chi tiết với ID bài viết
    window.location.href = `chitietbaiviet.html?id=${postId}&from=manager`;
}

// Phê duyệt bài viết
function approvePost(postId) {
    if (confirm('Bạn có chắc muốn phê duyệt bài viết này?')) {
        const post = getPostById(postId);
        
        if (post) {
            // Cập nhật trạng thái
            post.status = 'approved';
            post.approvedAt = new Date().toISOString();
            post.approvedBy = 'Manager';
            
            // Lưu vào storage
            updatePostInStorage(post);
            
            // Cập nhật giao diện
            updateManagerStats();
            renderManagerPosts();
            
            // Hiển thị thông báo
            showNotification('✅ Bài viết đã được phê duyệt thành công!', 'success');
        }
    }
}

// Hiển thị modal từ chối
function showRejectModal(postId, title) {
    const rejectModal = document.getElementById('reject-modal');
    const postTitleToReject = document.getElementById('post-title-to-reject');
    
    if (rejectModal && postTitleToReject) {
        postIdToReject = postId;
        postTitleToReject.textContent = title;
        rejectModal.style.display = 'flex';
    }
}

// Từ chối bài viết
function rejectPost(postId, reason) {
    const post = getPostById(postId);
    
    if (post) {
        console.log('🚨 Manager: Đang từ chối bài viết', postId);
        
        // Cập nhật trạng thái
        post.status = 'rejected';
        post.rejectedAt = new Date().toISOString();
        post.rejectedBy = 'Manager';
        post.rejectionReason = reason;
        post.feedback = reason;
        post.feedbackDate = new Date().toISOString();
        
        // Lưu vào storage - DÙNG HÀM TỪ marketing.js
        if (typeof window.updatePostInStorage === 'function') {
            window.updatePostInStorage(post);
        } else {
            updatePostInStorage(post);
        }
        
        // GỬI EVENT ĐỂ CÁC TRANG KHÁC CẬP NHẬT
        if (typeof window.dispatchStorageUpdateEvent === 'function') {
            window.dispatchStorageUpdateEvent();
        } else {
            // Fallback: gửi storage event
            window.dispatchEvent(new Event('storage'));
        }
        
        // Cập nhật giao diện ngay lập tức
        updateManagerStats();
        renderManagerPosts();
        
        // Hiển thị thông báo
        showNotification('📝 Bài viết đã bị từ chối.', 'error');
        
        // Chuyển hướng về trang danh sách
        setTimeout(() => {
            window.location.href = 'dsbaivietchoduyet.html';
        }, 1500);
    }
}

/* ===== EVENT LISTENERS ===== */

// Thiết lập event listeners cho trang manager
function setupManagerEventListeners() {
    const categoryFilter = document.getElementById('category-filter');
    const searchBox = document.getElementById('search-box');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
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
}

// Thiết lập listeners cho stat cards
function setupManagerStatCardListeners() {
    const statCards = {
        'stat-all': document.getElementById('stat-all'),
        'stat-pending': document.getElementById('stat-pending'),
        'stat-approved': document.getElementById('stat-approved'),
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
                renderManagerPosts();
            });
        }
    });
}

// Thiết lập listeners cho modal từ chối
function setupRejectModalListeners() {
    const rejectModal = document.getElementById('reject-modal');
    const cancelRejectBtn = document.getElementById('cancel-reject');
    const confirmRejectBtn = document.getElementById('confirm-reject');
    
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
}

/* ===== TIỆN ÍCH HỖ TRỢ ===== */

// Format ngày tháng
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
        
        // Nếu là Date object hoặc ISO string
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            return dateInput || '';
        }
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
        
    } catch (e) {
        console.error('Lỗi format date:', e);
        return dateInput || '';
    }
}

// Escape HTML để tránh XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Hiển thị thông báo
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

/* ===== CHỨC NĂNG SIDEBAR ===== */

// Cập nhật số lượng bài chờ duyệt trên sidebar
function updateSidebarPendingCount(count) {
    const pendingBadge = document.getElementById('pending-count');
    if (pendingBadge && count !== undefined) {
        pendingBadge.textContent = count;
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Khởi tạo sidebar
function initSidebar() {
    // Đặt active link dựa trên URL hiện tại
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Gọi khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    
    // Cập nhật sidebar count
    const allPosts = getAllPostsForManager();
    const pendingCount = allPosts.filter(p => p.status === 'pending').length;
    updateSidebarPendingCount(pendingCount);
});

// Export các hàm cần thiết cho trang chi tiết
if (typeof window !== 'undefined') {
    window.getPostById = getPostById;
    window.updatePostInStorage = updatePostInStorage;
    window.approvePost = approvePost;
    window.rejectPost = rejectPost;
}

// THÊM VÀO CUỐI FILE manager.js

/* ===== ĐỒNG BỘ VỚI TRANG CHI TIẾT ===== */

// Hàm phê duyệt bài viết (được gọi từ trang chi tiết)
function approvePost(postId) {
    if (confirm('Bạn có chắc muốn phê duyệt bài viết này?')) {
        const post = getPostById(postId);
        
        if (post) {
            // Cập nhật trạng thái
            post.status = 'approved';
            post.approvedAt = new Date().toISOString();
            post.approvedBy = 'Manager';
            
            // Lưu vào storage
            updatePostInStorage(post);
            
            // Cập nhật tất cả các trang
            updateAllPages();
            
            // Hiển thị thông báo
            showNotification('✅ Bài viết đã được phê duyệt thành công!', 'success');
            
            // Tự động chuyển về trang danh sách sau 1.5 giây
            setTimeout(() => {
                window.location.href = 'dsbaivietchoduyet.html';
            }, 1500);
        }
    }
}

// Hàm từ chối bài viết (được gọi từ trang chi tiết)
function rejectPost(postId, reason) {
    const post = getPostById(postId);
    
    if (post) {
        // Cập nhật trạng thái
        post.status = 'rejected';
        post.rejectedAt = new Date().toISOString();
        post.rejectedBy = 'Manager';
        post.rejectionReason = reason;
        post.feedback = reason;
        post.feedbackDate = new Date().toISOString();
        
        // Lưu vào storage
        updatePostInStorage(post);
        
        // Cập nhật tất cả các trang
        updateAllPages();
        
        // Hiển thị thông báo
        showNotification('📝 Bài viết đã bị từ chối.', 'error');
        
        // Tự động chuyển về trang danh sách sau 1.5 giây
        setTimeout(() => {
            window.location.href = 'dsbaivietchoduyet.html';
        }, 1500);
    }
}

// Cập nhật tất cả các trang
function updateAllPages() {
    // Cập nhật stats
    updateManagerStats();
    
    // Cập nhật sidebar
    const allPosts = getAllPostsForManager();
    const pendingCount = allPosts.filter(p => p.status === 'pending').length;
    updateSidebarPendingCount(pendingCount);
    
    // Render lại danh sách nếu đang ở trang manager
    if (window.location.pathname.includes('dsbaivietchoduyet.html')) {
        renderManagerPosts();
    }
}

// Export các hàm để trang chi tiết có thể gọi
if (typeof window !== 'undefined') {
    window.approvePost = approvePost;
    window.rejectPost = rejectPost;
    window.getPostById = getPostById;
    window.updatePostInStorage = updatePostInStorage;
}

// THÊM VÀO CUỐI manager.js
// Hàm để lấy danh sách bài viết (nếu chưa có trong global scope)
if (typeof getAllPostsForManager === 'undefined') {
    function getAllPostsForManager() {
        const stored = localStorage.getItem('tiny_tags_posts');
        if (stored) {
            try {
                const posts = JSON.parse(stored);
                return posts.filter(post => 
                    post.status === 'pending' || 
                    post.status === 'approved' || 
                    post.status === 'rejected'
                );
            } catch (e) {
                console.error('Lỗi parse JSON:', e);
                return [];
            }
        }
        return [];
    }
}