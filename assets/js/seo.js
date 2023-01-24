const handleSeo = ({ route, data }) => {
    const head = { meta: [] };

    if (route) {
        head.meta = [
            ...head.meta,
            {
                hid: 'og:url',
                property: 'og:url',
                content: `${process.env.URL}${route}`
            }
        ];
    }

    if (!data) return head;

    if (data.seo_title) {
        head.title = data.seo_title;
        head.meta = [
            ...head.meta,
            { hid: 'og:title', property: 'og:title', content: data.seo_title },
            { hid: 'og:site_name', property: 'og:site_name', content: data.seo_title },
            { hid: 'twitter:title', name: 'twitter:title', content: data.seo_title }
        ];
    }

    if (data.seo_description) {
        head.meta = [
            ...head.meta,
            { hid: 'description', name: 'description', content: data.seo_description },
            {
                hid: 'og:description',
                property: 'og:description',
                content: data.seo_description
            },
            {
                hid: 'twitter:description',
                name: 'twitter:description',
                content: data.seo_description
            }
        ];
    }

    if (data.seo_image) {
        const { url, alt, width, height } = data.seo_image;

        head.meta = [
            ...head.meta,
            {
                hid: 'og:image',
                property: 'og:image',
                content: url
            },
            {
                hid: 'twitter:image',
                property: 'twitter:image',
                content: url
            },
            {
                hid: 'og:image:width',
                property: 'og:image:width',
                content: width
            },
            {
                hid: 'og:image:height',
                property: 'og:image:height',
                content: height
            },
            {
                hid: 'og:image:alt',
                property: 'og:image:alt',
                content: alt
            }
        ];
    }

    return head;
};

export default handleSeo;
