document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#post-btn').addEventListener('click', event => {
    event.preventDefault(); // causes connection aborted error without this

    const content = document.querySelector('#post-content');

    fetch('/newPost', {
      method: 'POST',
      body: JSON.stringify({
        content: content.value
      })
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        content.value = '';
      });
  });
});
