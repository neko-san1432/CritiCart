const tagInput = document.getElementById('tagInput');
const tagsContainer = document.getElementById('tags');
export let tags = [];

export function addTag(text) {
  if (text && text.trim() !== '' && !tags.includes(text.trim())) {
    tags.push(text.trim());
    renderTags();
  }
}

function createTagElement(text, index) {
  const tag = document.createElement('button');
  tag.className = 'tag';
  tag.textContent = text;

  tag.addEventListener('dblclick', () => {
    editTag(index);
  });

  return tag;
}

function renderTags() {
  tagsContainer.innerHTML = '';
  tags.forEach((tagText, index) => {
    tagsContainer.appendChild(createTagElement(tagText, index));
  });
}

function editTag(index) {
  const oldTag = tags[index];
  tagInput.value = oldTag;
  tags.splice(index, 1); // Remove the old tag
  renderTags();
  tagInput.focus();
}

// Event: when user types and presses comma
tagInput.addEventListener('keydown', (e) => {
  if (e.key === ',' || e.key === 'Enter') {
    e.preventDefault();
    const newTag = tagInput.value.replace(',', '').trim();
    if (newTag !== '') {
      addTag(newTag);
      tagInput.value = '';
    }
  }
});
tagInput.addEventListener('focus',()=>{
  tagInput.placeholder= "Type a tag and press comma";
})
tagInput.addEventListener('blur', () => {
  if (tagInput.value.trim() === '') {
    tagInput.placeholder = '';
  }
});