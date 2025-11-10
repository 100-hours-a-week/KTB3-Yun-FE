document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://127.0.0.1:8080';
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');

    const postTitle = document.getElementById('post-title');
    const postAuthorName = document.getElementById('post-author-name');
    const postDate = document.getElementById('post-date');
    const postContent = document.getElementById('post-content');
    const postImage = document.getElementById('post-image');
    const postImageWrapper = document.querySelector('.post-image');
    const postLikes = document.getElementById('post-likes');
    const postViews = document.getElementById('post-views');
    const postCommentsCount = document.getElementById('post-comments-count');
    const commentList = document.getElementById('comment-list');
    const commentTemplate = document.getElementById('comment-template');

    if (!postId) {
        alert('게시글 정보를 찾을 수 없습니다.');
        window.location.replace('./posts.html');
        return;
    }

    function clearComments() {
        if (!commentList || !commentTemplate) {
            return;
        }
        Array.from(commentList.children).forEach((child) => {
            if (child !== commentTemplate) {
                child.remove();
            }
        });
    }

    function cloneCommentTemplate() {
        if (!commentTemplate) {
            return null;
        }
        const clone = commentTemplate.cloneNode(true);
        clone.removeAttribute('id');
        clone.classList.remove('comment-template');
        clone.removeAttribute('aria-hidden');
        return clone;
    }

    function fillCommentItem(item, comment) {
        const author = item.querySelector('.comment-author');
        if (author) {
            author.textContent = comment.nickname ?? '';
        }

        const content = item.querySelector('.comment-content');
        if (content) {
            content.textContent = comment.content ?? '';
        }

        const date = item.querySelector('.comment-date');
        if (date) {
            date.textContent = comment.createdAt ?? '';
        }
    }

    function renderComments(comments) {
        if (!commentList) {
            return;
        }
        clearComments();

        if (!comments.length) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'comment-item comment-empty';
            emptyItem.textContent = '첫 번째 댓글을 남겨보세요.';
            commentList.appendChild(emptyItem);
            return;
        }

        const fragment = document.createDocumentFragment();
        comments.forEach((comment) => {
            const item = cloneCommentTemplate();
            if (!item) {
                return;
            }
            fillCommentItem(item, comment);
            fragment.appendChild(item);
        });
        commentList.appendChild(fragment);
    }

    function renderPost(post) {
        if (postTitle) {
            postTitle.textContent = post.title ?? '';
        }
        if (postAuthorName) {
            postAuthorName.textContent = post.nickname ?? '';
        }
        if (postDate) {
            postDate.textContent = post.createdAt ?? '';
        }
        if (postContent) {
            postContent.textContent = post.content ?? '';
        }
        if (postImage) {
            if (post.postImage) {
                postImage.src = post.postImage;
                postImage.removeAttribute('hidden');
                if (postImageWrapper) {
                    postImageWrapper.removeAttribute('hidden');
                }
            } else {
                postImage.setAttribute('hidden', 'true');
                if (postImageWrapper) {
                    postImageWrapper.setAttribute('hidden', 'true');
                }
            }
        }
        if (postLikes) {
            postLikes.textContent = post.likes ?? 0;
        }
        if (postViews) {
            postViews.textContent = post.views ?? 0;
        }
        if (postCommentsCount) {
            postCommentsCount.textContent = post.comments ?? 0;
        }

        renderComments(Array.isArray(post.commentsList) ? post.commentsList : []);
    }

    async function fetchPostDetail() {
        try {
            const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('게시글을 불러오지 못했습니다.');
            }

            const body = await res.json();
            const post = body?.data ?? body;
            renderPost(post);
        } catch (error) {
            alert('게시글을 로드하는 중 오류가 발생했습니다.');
            console.error(error);
        }
    }

    fetchPostDetail();
});
