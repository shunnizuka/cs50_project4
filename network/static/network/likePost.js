document.addEventListener('DOMContentLoaded', function () {
  // Find all the like/unlike buttons and assign onclick listener
  const likeBtns = document.querySelectorAll('.likeBtn');
  likeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      likeOrUnlikePost(btn);
    });
  });
  const unlikeBtns = document.querySelectorAll('.unlikeBtn');
  unlikeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      likeOrUnlikePost(btn);
    });
  });
});

function likeOrUnlikePost(target) {
  const id = target.value;
  const isLike = target.getAttribute('data') == 'like' ? true : false;

  fetch('/likeUnlike', {
    method: 'POST',
    body: JSON.stringify({
      id: id,
      isLike: isLike
    })
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);

      const likesCountElement = document.querySelector(`#likes-count-${target.value}`);
      const likesCount = parseInt(likesCountElement.innerHTML);

      if (isLike) { // The post has been liked so switch to unlike button
        target.className = 'btn btn-outline-danger btn-sm';
        target.style = 'color: red;';
        target.setAttribute('data', 'unlike');
        likesCountElement.innerHTML = `${likesCount + 1}`;
      } else { // The post has been unliked so switch to like button
        target.className = 'btn btn-danger btn-sm';
        target.style = '';
        target.setAttribute('data', 'like');
        likesCountElement.innerHTML = `${likesCount - 1}`;
      }
    });
}
