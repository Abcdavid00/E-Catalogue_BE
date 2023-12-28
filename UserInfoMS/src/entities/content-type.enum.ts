export enum ContentType {
    PRODUCT = 'product',
    IDEA = 'idea',
}

export function parseContentType(contentType: string): ContentType {
    const contentTypeEnum = ContentType[contentType.toUpperCase()];
    if (!contentTypeEnum) {
        throw new Error('Invalid content type');
    }
    return contentTypeEnum;
}