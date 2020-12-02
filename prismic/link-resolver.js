export default function (doc) {
    if (doc.isBroken) {
        return '/not-found';
    }

    if (doc.type === 'home') {
        return '/';
    }

    if (doc.type === 'project') {
        return '/projet/' + doc.uid;
    }

    return '/not-found';
}
