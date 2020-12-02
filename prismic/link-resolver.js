export default function (doc) {
    if (doc.isBroken) {
        return '/not-found';
    }

    if (doc.type === 'home') {
        return '/';
    }

    if (doc.type === 'project') {
        return '/project/' + doc.uid;
    }

    return '/not-found';
}
