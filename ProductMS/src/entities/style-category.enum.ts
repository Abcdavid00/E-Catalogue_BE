export enum StyleCategory {
    POPULAR = 'popular',
    MINIMAL = 'minimal',
    BUSINESS = 'business',
    STREET = 'street',
    PERFORMANCE = 'performance',
    UNIQUE = 'unique',
    LOVELY = 'lovely',
    EASYCASUAL = 'easyCasual',
    AMERICAN = 'american',
    CITYBOY = 'cityBoy',
    SPORTY = 'sporty',
    RETRO = 'retro',
    MODERN = 'modern',
}

export function parseStyleCategory(category: string): StyleCategory {   
    const categoryEnum = StyleCategory[category.toUpperCase()];
    if (!categoryEnum) {
        throw new Error('Invalid category');
    }
    return categoryEnum;
}