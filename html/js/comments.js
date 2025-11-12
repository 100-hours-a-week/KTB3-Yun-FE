document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://127.0.0.1:8080';

    const form = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const submitBtn = document.getElementById('comment-submit');
    
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');

    commentInput.addEventListener('input', () => {
        const isValid = !commentInput.value.trim();
        submitBtn.disabled = isValid;
    })

    form.addEventListener('submit', handleSubmit);

    //댓글 작성
    async function handleSubmit(e) {
        e.preventDefault();

        const content = commentInput.value.trim();

        try {
            const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({content}),
            })

            if (res.status === 201) {
                location.reload();
                return;
            }

            if (res.status === 401) {
                alert('로그인 후 이용해주세요.');
                location.assign('./login.html');
                return;
            }
        } catch (err) {
            alert('잠시 후에 다시 시도해주세요.');
        }
    }
})