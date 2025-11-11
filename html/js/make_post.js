document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#make-post-form');
    const titleInput = document.querySelector('#post-title');
    const contentInput = document.querySelector('#post-content');
    const postImageInput = document.querySelector('#post-image');
    const contentHelper = document.querySelector('.helper-text');
    const submitBtn = document.querySelector('.submit-btn');

    const API_BASE_URL = 'http://127.0.0.1:8080';

    titleInput.addEventListener('input', handleInput);
    contentInput.addEventListener('input', handleInput);
    postImageInput.addEventListener('input', handleInput);

    function handleInput() {
        const contentMsg = isValidPost(titleInput.value, contentInput.value);

        contentHelper.textContent = contentMsg;

        const isValid = !contentMsg;
        submitBtn.disabled = !isValid;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const postImage = postImageInput.value.trim();

        try {
            const res = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: "include",
                body: JSON.stringify({title, content, postImage}),
            });

            if (res.status === 201) {
                const locationHeader = res.headers.get('Location');
                if (locationHeader){
                    const [, postId] = locationHeader.split('/posts/');
                    location.assign(`./post.html?postId=${postId}`);
                }
                return;
            }
            if (res.status === 401) {
                alert('로그인 후 이용해주세요.');
                location.assign('./login.html');
            }
            return;
        } catch (err) {
            alert('잠시 후에 다시 시도해주세요.');
        }
    }

    form.addEventListener('submit', handleSubmit);

    function isValidPost(title, content){
        const t = title.trim();
        const c = content.trim();

        if (!t || !c){
            return '*제목, 내용을 모두 작성해주세요';
        }
        return '';
    }

    handleInput();
});