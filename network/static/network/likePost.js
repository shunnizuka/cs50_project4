document.addEventListener('DOMContentLoaded', function () {
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

      if (isLike) {
        target.className = 'btn btn-outline-danger btn-sm';
        target.style = 'color: red;';
        target.setAttribute('data', 'unlike');
        likesCountElement.innerHTML = `${likesCount + 1}`;
      } else {
        target.className = 'btn btn-danger btn-sm';
        target.style = '';
        target.setAttribute('data', 'like');
        likesCountElement.innerHTML = `${likesCount - 1}`;
      }
    });
}
