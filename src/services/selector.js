export function getSelectorString(stepArg) {
    const first = stepArg;

    let value = first;
    let label = value;

    if (!first) return { label, value: '' };

    if (typeof first === 'object') {
        if (first.xpath || first.css) {
            value = first.xpath || first.css;
            label = value;
        } else if (first.output) {
            label = `"${first.output}"`;
            value = first.value || first;
        } else {
            value = first.value || first;
            label = value;
        }
    }
    return { label, value };
}