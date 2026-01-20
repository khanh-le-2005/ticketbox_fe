export interface Article {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    tags: string | null;
    thumbUrl: string;
    menu: string | null;
    seoTitle: string;
    seoDescription: string;
    status: 'DRAFT' | 'PUBLISHED' | 'PENDING'; // Quan trọng để lọc
    createdDate: string;
    publishedDate: string;
}
