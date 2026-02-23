let allCards = [];

fetch('cards.json')
    .then(response => response.json())
    .then(data => {
        allCards = data;
        renderCards(allCards);
    })
    .catch(error => console.error('エラー:', error));

function renderCards(cards) {
    const list = document.getElementById('card-list');
    list.innerHTML = '';

    cards.forEach(card => {
        const div = document.createElement('div');
        div.className = 'card';
        
        const tagsHtml = card.tags ? card.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

        div.innerHTML = `
            <h3><span class="element">${card.element}</span><span class="type-badge">${card.card_type}</span>${card.name}</h3>
            <p><strong>条件/タイミング:</strong> ${card.trigger}</p>
            <p>${card.effect.replace(/\n/g, '<br>')}</p>
            <div>${tagsHtml}</div>
        `;
        list.appendChild(div);
    });
}

// ボタン用の絞り込み
function filterCards(keyword) {
    document.getElementById('searchInput').value = ''; // 検索窓をリセット
    if (keyword === 'all') {
        renderCards(allCards);
        return;
    }
    const filtered = allCards.filter(card => 
        card.card_type === keyword || 
        card.element === keyword || 
        (card.tags && card.tags.includes(keyword))
    );
    renderCards(filtered);
}

// フリーワード検索用の処理を追加
function searchCards() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query) {
        renderCards(allCards);
        return;
    }

    const filtered = allCards.filter(card => {
        const name = card.name ? card.name.toLowerCase() : '';
        const kana = card.kana ? card.kana.toLowerCase() : '';
        const effect = card.effect ? card.effect.toLowerCase() : '';
        const tags = card.tags ? card.tags.join(' ').toLowerCase() : '';
        
        // 名前、ふりがな、効果、タグのどこかに文字が含まれていれば表示
        return name.includes(query) || kana.includes(query) || effect.includes(query) || tags.includes(query);
    });
    
    renderCards(filtered);
}
