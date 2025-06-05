export let tags = [];
let tagInput, tagsContainer;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  tagInput = document.getElementById('tagInput');
  tagsContainer = document.getElementById('tags');
  if (tagInput && tagsContainer) {
    initializeTagInput();
  }
});

export function addTag(text) {
  if (text && text.trim() !== '' && !tags.includes(text.trim())) {
    tags.push(text.trim());
    renderTags();
  }
}

function createTagElement(text, index) {
  const tag = document.createElement('div');
  tag.className = 'tag';
  
  const tagText = document.createElement('span');
  tagText.textContent = text;
  tag.appendChild(tagText);

  const removeBtn = document.createElement('button');
  removeBtn.className = 'tag-remove-btn';
  removeBtn.innerHTML = '×';
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    removeTag(index);
  });
  tag.appendChild(removeBtn);

  tag.addEventListener('dblclick', () => {
    editTag(index);
  });

  return tag;
}

function removeTag(index) {
  tags.splice(index, 1);
  renderTags();
}

function renderTags() {
  if (!tagsContainer) return;
  
  tagsContainer.innerHTML = '';
  tags.forEach((tagText, index) => {
    const tagElement = createTagElement(tagText, index);
    tagsContainer.appendChild(tagElement);
  });
  
  // Update placeholder visibility
  const placeholder = tagInput.getAttribute('placeholder');
  if (tags.length > 0) {
    tagInput.setAttribute('placeholder', '');
  } else {
    tagInput.setAttribute('placeholder', 'Type a tag and press Enter or comma');
  }
}

function editTag(index) {
  const oldTag = tags[index];
  tagInput.value = oldTag;
  tags.splice(index, 1); // Remove the old tag
  renderTags();
  tagInput.focus();
}

function initializeTagInput() {
  // Event: when user types and presses comma or enter
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

  tagInput.addEventListener('focus', () => {
    tagInput.placeholder = "Type a tag and press Enter or comma";
  });

  tagInput.addEventListener('blur', () => {
    if (tagInput.value.trim() === '') {
      tagInput.placeholder = '';
    }
  });
}