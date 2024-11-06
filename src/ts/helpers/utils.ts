/**
 * Находит у элементов data нужный
 * @param items
 * @param dataset
 */
export const getElementsByData = (items: NodeListOf<HTMLElement> | [HTMLElement], dataset: string) => {
    if (!items.length) {
        console.error("Отсутствуют HTML элементы")
    } else {
        if (items.length > 1) {
            return Array.from(items, image => image.dataset[dataset] ?? image.dataset[dataset]).filter(item => typeof item === "string");
        } else {
            return items[0].dataset[dataset];
        }
    }
}