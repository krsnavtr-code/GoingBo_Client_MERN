export const countHtmlTags = (html = "") => {
    const regex = /<([a-z0-9]+)(\s|>)/gi;
    const tags = {};
    let match;

    while ((match = regex.exec(html)) !== null) {
        const tag = match[1].toLowerCase();
        tags[tag] = (tags[tag] || 0) + 1;
    }

    return tags;
};
  