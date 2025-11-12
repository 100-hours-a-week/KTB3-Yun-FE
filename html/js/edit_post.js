document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-post-form');
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    const postImageInput = document.getElementById('post-image');
    const contentHelper = document.querySelector('.helper-text');
    const submitBtn = document.querySelector('.submit-btn');

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    const backLink = document.querySelector('.back-link');
    
    const API_BASE_URL = 'http://127.0.0.1:8080';

    if (postId && backLink) {
        backLink.href = `./post.html?postId=${postId}`;
    }

    fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'GET',
        credentials: 'include',
    })
    .then((res) => {
        if (!res.ok) throw new Error('게시글 정보를 불러오지 못했습니다.');
        return res.json();
    })
    .then((body) => {
        const data = body?.data ?? body;
        titleInput.value = data.title;
        contentInput.value = data.content;
        postImageInput.value = data.postImage ?? '';
    })
    .catch((err) => {
        alert('게시글 정보를 불러오는 중 문제가 발생했습니다.');
        location.replace('./posts.html');
    })

    titleInput.addEventListener('input', handleInput);
    contentInput.addEventListener('input', handleInput);
    form.addEventListener('submit', handleSubmit);

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
            const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({title, content, postImage}),
            });

            if (res.ok) {
                alert('게시글이 수정되었습니다.')
                location.replace(`./post.html?postId=${postId}`);
                return;
            }

            if (res.status === 401) {
                alert('로그인 후 이용해주세요.');
                location.replace('./login.html');
                return;
            }

            if (res.status === 403) {
                alert('작성자만 수정할 수 있습니다.');
                location.replace('./posts.html');
                return;
            }
        } catch (err) {
            alert('잠시 후에 다시 시도해주세요.');
        }

    }

    function isValidPost(title, content){
        const t = title.trim();
        const c = content.trim();

        if (!t || !c){
            return '*제목, 내용을 모두 작성해주세요';
        }
        return '';        
    }    

})