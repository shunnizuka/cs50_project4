function editPostController(id, content) {
  const postBody = document.querySelector(`#post-body-${id}`);

  postBody.innerHTML = '';

  // convert the post into a textarea form
  const textarea = document.createElement('textarea');
  textarea.id = `edited-post-${id}`;
  textarea.value = content;
  textarea.className = 'form-control';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-primary';
  saveBtn.innerHTML = 'Save';
  saveBtn.addEventListener('click', () => {
    editPost(id);
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-outline-primary';
  cancelBtn.innerHTML = 'Cancel';

  cancelBtn.addEventListener('click', () => {
    cancelEdit(id, content);
  });

  postBody.append(textarea);
  postBody.append(saveBtn);
  postBody.append(cancelBtn);
}

function editPost(id) {
  const editedPost = document.querySelector(`#edited-post-${id}`);
  const editedContent = editedPost.value;

  fetch('/editPost', {
    method: 'POST',
    body: JSON.stringify({
      postId: id,
      content: editedContent
    })
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      const postBody = document.querySelector(`#post-body-${id}`);
      postBody.innerHTML = '';

      // convert the textarea form back to a post
      const editedPost = document.createElement('p');
      editedPost.className = 'card-text';
      editedPost.innerHTML = editedContent;

      postBody.append(editedPost);
    });
}

function cancelEdit(id, content) {
  const postBody = document.querySelector(`#post-body-${id}`);
  postBody.innerHTML = '';

  const originalPost = document.createElement('p');
  originalPost.className = 'card-text';
  originalPost.innerHTML = content;

  postBody.append(originalPost);
}
