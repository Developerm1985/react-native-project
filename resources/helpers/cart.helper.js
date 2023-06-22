export function getSelectedTotalAmount(selected) {
    let total = 0
    selected.forEach( item => total+= (+item.quantity * +item.price) )

    return total
}