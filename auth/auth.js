// Đợi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const notification = document.getElementById('notification');
    const notificationText = notification.querySelector('.notification-text');
    const notificationIcon = notification.querySelector('.notification-icon');

    // Xử lý khi submit form ĐĂNG NHẬP
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn reload trang

            // 1. Lấy giá trị từ form (ở đây chỉ mô phỏng)
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // 2. KIỂM TRA MÔ PHỎNG (thay bằng gọi API thật sau)
            if (email && password) {
                showNotification('Đăng nhập thành công', 'success');
                // Chuyển hướng đến Dashboard sau 1.5 giây
                setTimeout(() => {
                    window.location.href = '../index.html'; // Sẽ đổi thành dashboard
                }, 1500);
            } else {
                showNotification('Vui lòng điền đầy đủ thông tin', 'error');
            }
        });
    }

    // Hàm hiển thị thông báo
    function showNotification(message, type) {
        notificationText.textContent = message;
        notificationIcon.textContent = type === 'success' ? '✅' : '❌';
        notification.style.backgroundColor = type === 'success' ? '#00b894' : '#d63031';

        notification.classList.remove('hidden');

        // Tự động ẩn thông báo sau 4 giây
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 4000);
    }

    // Xử lý form QUÊN MẬT KHẨU
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('recovery-email').value;
            
            if (email) {
                showNotification('Đã gửi email khôi phục! Vui lòng kiểm tra hộp thư.', 'success');
                // Mô phỏng: sau 2 giây chuyển đến trang "Xác thực email"
                setTimeout(() => {
                    window.location.href = 'verify_email.html';
                }, 2000);
            } else {
                showNotification('Vui lòng nhập email của bạn', 'error');
            }
        });
    }

    // Xử lý link "Gửi lại email"
    const resendLink = document.getElementById('resend-link');
    if (resendLink) {
        resendLink.addEventListener('click', function(event) {
            event.preventDefault();
            showNotification('Đã gửi lại email xác nhận!', 'info');
        });
    }

    // ===== XỬ LÝ TRANG "XÁC THỰC EMAIL" =====
const resendBtn = document.getElementById('resendBtn');
if (resendBtn) {
    resendBtn.addEventListener('click', function() {
        showNotification('Đã gửi lại email xác nhận! Vui lòng kiểm tra hộp thư.', 'success');
        
        // Vô hiệu hóa nút trong 60 giây
        resendBtn.disabled = true;
        let seconds = 60;
        const originalText = resendBtn.innerHTML;
        
        const timer = setInterval(() => {
            resendBtn.innerHTML = `<i class="fas fa-clock"></i> Gửi lại (${seconds}s)`;
            seconds--;
            
            if (seconds < 0) {
                clearInterval(timer);
                resendBtn.disabled = false;
                resendBtn.innerHTML = originalText;
            }
        }, 1000);
    });
}

// ===== XỬ LÝ TRANG "TẠO MẬT KHẨU MỚI" =====
const resetPasswordForm = document.getElementById('resetPasswordForm');
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Kiểm tra mật khẩu có khớp không
        if (newPassword !== confirmPassword) {
            showNotification('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }
        
        // Kiểm tra độ mạnh mật khẩu (ví dụ đơn giản)
        if (newPassword.length < 8) {
            showNotification('Mật khẩu phải có ít nhất 8 ký tự!', 'error');
            return;
        }
        
        // Thành công
        showNotification('Cập nhật mật khẩu thành công! Đang chuyển hướng...', 'success');
        
        // Chuyển về trang đăng nhập sau 2 giây
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}

// ===== CHỨC NĂNG HIỆN/ẨN MẬT KHẨU =====
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle-password') || 
        event.target.closest('.toggle-password')) {
        
        const toggleBtn = event.target.closest('.toggle-password');
        const targetId = toggleBtn.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        const icon = toggleBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
});
});