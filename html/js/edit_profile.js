document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#edit-profile-form');
    const profileImageInput = document.querySelector('#profile-picture-input');
    const emailInput = document.querySelector('#email');
    const nicknameInput = document.querySelector('#nickname');
    const nicknameHelper = document.querySelector('#nickname-error');
    const toast = document.querySelector('#edit-toast');
    const modalConfirmBtn = document.querySelector('.modal-btn.modal-btn--confirm');
    const logoutBtn = document.getElementById('logout-btn');

    const API_BASE_URL = 'http://127.0.0.1:8080';

    let memberId = null;
    let toastTimer = null;

    //로그인 한 사용자 정보 받아오기
    fetch(`${API_BASE_URL}/members/me`, {
        method: 'GET',
        credentials: 'include',
    })
        .then((res) => {
            if (!res.ok) throw new Error('유저 정보를 가져올 수 없습니다.');
            return res.json();
        })
        .then((body) => {
            const data = body?.data ?? body;
            memberId = data.memberId;
            if (emailInput && data.email) {
                emailInput.value = data.email;
            }
            if (nicknameInput && data.nickname) {
                nicknameInput.value = data.nickname;
            }
            if (profileImageInput && data.profileImage) {
                profileImageInput.value = data.profileImage;
            }
        })
        .catch((err) => {
            alert(err.message || '회원 정보를 불러오지 못했습니다.');
            location.replace('./login.html');
        });


    //
    async function handleSubmit(e) {
        e.preventDefault();

        const nickname = nicknameInput.value.trim();
        const profileImage = profileImageInput.value.trim();
        const nicknameMsg = validateNickname(nickname);
        nicknameHelper.textContent = nicknameMsg;

        try {
            const res = await fetch(`${API_BASE_URL}/members/${memberId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({nickname, profileImage}),
            });

            if (res.ok) {
                showToast();
                return;
            }
            
            if (res.status === 409) {
                nicknameHelper.textContent = '*중복된 닉네임입니다.';
            }
        } catch(err) {
            alert('잠시 후 다시 시도해주세요.');
        }
    }

    async function handleWithdraw(e) {
        e.preventDefault();

        try {
            const res = await fetch(`${API_BASE_URL}/members/${memberId}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });

            if (res.status === 204) {
                alert('탈퇴 성공');
                location.replace('./login.html');
                return;
            }

            if (res.status === 401) {
                alert('로그인이 필요합니다.');
                location.replace('./login.html');
            }
        } catch (err) {
            alert('잠시 후 다시 시도해주세요.');
        }
    }

    function validateNickname(nickname) {
        const n = nickname.trim();

        if (!n) {
            return '*닉네임을 입력해주세요.';
        } else if (n.length>10){
            return '*닉네임은 최대 10자까지 작성 가능합니다.';
        }
    }

    function showToast() {
        if (!toast) return;
        toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.hidden = true;
        }, 2000);
    }

    form.addEventListener('submit', handleSubmit);
    modalConfirmBtn.addEventListener('click', handleWithdraw);

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

    logoutBtn.addEventListener('click', handleLogout);
})