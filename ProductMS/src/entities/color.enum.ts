export enum Color {
    WHITES = 'Whites',
    BLACKS = 'Blacks',
    GREYS = 'Greys',
    BEIGES = 'Beiges',
    BROWNS = 'Browns',
    REDS = 'Reds',
    GREENS = 'Greens',
    BLUES = 'Blues',
    PURPLES = 'Purples',
    YELLOWS = 'Yellows',
    PINKS = 'Pinks',
    ORANGES = 'Oranges'
}

export function ParseColor(color: string): Color {
    console.log("Color: " +  color)
    const colorEnum = Color[color.toUpperCase()]
    console.log("Color Enum: " + colorEnum)
    if (!colorEnum) {
        throw new Error('Invalid color')
    }
    return colorEnum
}