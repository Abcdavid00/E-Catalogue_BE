export enum Size {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL'
}

export function ParseSize(size: string): Size {
    const sizeEnum = Size[size.toUpperCase()];
    if (!sizeEnum) {
        throw new Error('Size is invalid');
    }
    return sizeEnum;
}