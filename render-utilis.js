export function renderList(list) {
    const li = document.createElement('li');

    const p = document.createElement('p');
    p.textContent = list.quantity + '   ' + list.item;
    li.append(p);

    return li;
}
