document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#password-form');
    const passwordInput = document.querySelector('#password');
    const confirmPasswordInput = document.querySelector('#password-check');
    const passwordHelper = document.querySelector('#password-helper');
    const confirmPasswordHelper = document.querySelector('#password-check-helper');
    const submitBtn = document.querySelector('#password-btn');
    const toast = document.querySelector('#password-toast');
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
        })
        .catch((err) => {
            alert(err.message || '회원 정보를 불러오지 못했습니다.');
            location.replace('./login.html');
        });

    passwordInput.addEventListener('input', handleInput);
    confirmPasswordInput.addEventListener('input', handleInput);

    function handleInput() {
        const passwordMsg = validatePassword(passwordInput.value, confirmPasswordInput.value);
        const confirmPasswordMsg = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);

        passwordHelper.textContent = passwordMsg;
        confirmPasswordHelper.textContent = confirmPasswordMsg;

        const isValid = !passwordMsg && !confirmPasswordMsg;
        submitBtn.disabled = !isValid;
    }

    function validatePassword(password, confirm) {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}:;<>?,.]).{8,20}$/;
        const p = password.trim();
        const c = confirm.trim();

        if (!p) {
            return '*비밀번호를 입력해주세요';
        } else if (!pattern.test(p)){
            return '*비밀번호는 8자 이상 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        } else if (p !== c) {
            return '*비밀번호 확인과 다릅니다.';
        }
        return '';
    }

    function validateConfirmPassword(password, confirm){
        const p = password.trim();
        const c = confirm.trim();

        if (!c) {
            return '*비밀번호를 한번 더 입력해주세요';
        } else if (p !== c) {
            return '*비밀번호 확인과 다릅니다.';
        }
        return '';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        try {
            const res = await fetch(`${API_BASE_URL}/members/${memberId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({password, confirmPassword}),
            });

            if (res.ok) {
                showToast();
                return;
            }

            if (res.status === 422) {
                passwordHelper.textContent = '*이미 사용 중인 비밀번호입니다.';
            }
        } catch(err) {
            alert('잠시 후 다시 시도해주세요.');
        }
    }

    function showToast() {
        if (!toast) return;
        toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.hidden = true;
            location.replace('./login.html');
        }, 2000);
    }

    form.addEventListener('submit', handleSubmit);

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