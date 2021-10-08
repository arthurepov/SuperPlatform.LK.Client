/* eslint-disable no-magic-numbers */
export const formatStringToPhoneNumber = (phoneNumber: string): string => {
    const cleaned = (`${phoneNumber}`)?.replace(/\D/g, '');
    const match = cleaned?.match(/^(7|8)?(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        const intlCode = (match[1] ? '+7' : '');

        return [
            intlCode, ' (', match[2], ') ', match[3], '-', match[4], '-', match[5],
        ].join('');
    }

    return null;
};

export const formatStringToPhoneLink = (phoneNumber: string): string => {
    const cleaned = (`${phoneNumber}`)?.replace(/\D/g, '');
    const match = cleaned?.match(/^(7|8)?(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        const intlCode = (match[1] ? '+7' : '');

        return [intlCode, match[2], match[3], match[4], match[5]].join('');
    }

    return null;
};
