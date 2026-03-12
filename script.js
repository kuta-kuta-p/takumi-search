let allCards = [];
let currentType = 'all';     // カードタイプのフィルタ
let currentElement = 'all';  // 属性のフィルタ
let currentTag = 'all';      // タグのフィルタ
let currentSearchQuery = ''; // 現在の検索クエリ

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

        const effectText = card.effect ? card.effect.replace(/\n/g, '<br>') : '';

        div.innerHTML = `
            <h3><span class="element">${card.element}</span><span class="type-badge">${card.card_type}</span>${card.name}</h3>
            <p><strong>条件/タイミング:</strong> ${card.trigger}</p>
            <p>${effectText}</p>
            <div>${tagsHtml}</div>
        `;
        list.appendChild(div);
    });
}

// 統合フィルタリング関数
function applyFilters() {
    const filtered = allCards.filter(card => {
        // 1. 各種フィルタ判定
        // カードタイプ
        const typeMatch = currentType === 'all' || card.card_type === currentType;
        
        // 属性
        const elementMatch = currentElement === 'all' || card.element === currentElement;

        // タグ
        const tagMatch = currentTag === 'all' || (card.tags && card.tags.includes(currentTag));

        // 2. 検索ワード判定
        let searchMatch = true;
        if (currentSearchQuery) {
            const name = card.name ? card.name.toLowerCase() : '';
            const kana = card.kana ? card.kana.toLowerCase() : '';
            const effect = card.effect ? card.effect.toLowerCase() : '';
            const tags = card.tags ? card.tags.join(' ').toLowerCase() : '';
            
            searchMatch = name.includes(currentSearchQuery) || 
                          kana.includes(currentSearchQuery) || 
                          effect.includes(currentSearchQuery) || 
                          tags.includes(currentSearchQuery);
        }

        // 全ての条件を満たすもの (AND条件)
        return typeMatch && elementMatch && tagMatch && searchMatch;
    });
    
    renderCards(filtered);
}

// 種類で絞り込み
function filterByType(type) {
    currentType = type;
    applyFilters();
}

// 属性で絞り込み
function filterByElement(element) {
    currentElement = element;
    applyFilters();
}

// タグで絞り込み
function filterByTag(tag) {
    currentTag = tag;
    applyFilters();
}

// フリーワード検索用の処理
function searchCards() {
    currentSearchQuery = document.getElementById('searchInput').value.toLowerCase();
    applyFilters();
}

// 全リセット
function resetFilters() {
    currentType = 'all';
    currentElement = 'all';
    currentTag = 'all';
    currentSearchQuery = '';
    document.getElementById('searchInput').value = '';
    applyFilters();
}
