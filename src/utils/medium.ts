
export interface MediumPost {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    categories: string[];
    thumbnail?: string;
    source: 'medium';
}

export async function getMediumPosts(username: string): Promise<MediumPost[]> {
    try {
        const response = await fetch(`https://medium.com/feed/@${username}`);
        const xml = await response.text();

        // Simple regex parser for RSS items
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const items: MediumPost[] = [];
        let match;

        while ((match = itemRegex.exec(xml)) !== null) {
            const itemContent = match[1];

            const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/);
            const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
            const dateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
            const contentMatch = itemContent.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/) || itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);

            // Extract categories
            const categories: string[] = [];
            const categoryRegex = /<category><!\[CDATA\[(.*?)\]\]><\/category>/g;
            let catMatch;
            while ((catMatch = categoryRegex.exec(itemContent)) !== null) {
                categories.push(catMatch[1]);
            }

            // Extract thumbnail
            const content = contentMatch ? contentMatch[1] : '';
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            const thumbnail = imgMatch ? imgMatch[1] : undefined;

            if (titleMatch && linkMatch) {
                items.push({
                    title: titleMatch[1],
                    link: linkMatch[1],
                    pubDate: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
                    content: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...', // Plain text preview
                    categories,
                    thumbnail,
                    source: 'medium'
                });
            }
        }

        return items;
    } catch (error) {
        console.error('Error fetching Medium posts:', error);
        return [];
    }
}
