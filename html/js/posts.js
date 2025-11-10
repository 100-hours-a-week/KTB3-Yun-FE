document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://127.0.0.1:8080';
    const $logoutBtn = document.getElementById('logout-btn');

    async function handleLogout() {
        try {
            const res = await fetch(`${API_BASE_URL}/members/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (res.status === 204) {
                location.assign('./login.html');
                return;
            }

            alert('로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } catch (error) {
            alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }

    if ($logoutBtn) {
        $logoutBtn.addEventListener('click', handleLogout);
    }
});
