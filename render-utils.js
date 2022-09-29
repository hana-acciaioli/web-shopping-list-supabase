export function renderList(list) {
    const li = document.createElement('li');

    if (list.bought) {
        li.classList.add('bought');
    }

    const p = document.createElement('p');
    p.textContent = list.quantity + '   ' + list.item;
    li.append(p);

    return li;
}
