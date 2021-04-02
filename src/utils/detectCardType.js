export const detectCardType = (number) => {
    if (number) {
        var re = new RegExp("^4");
        if (number.match(re) != null) {
            return "Visa";
        }
        if (number.match(/^5[1-5]/) && number.match(/^\d{1,16}$/)) {
            return 'mastercard';
        }
        if (number.match(/^3[47]/) && (number.match(/^\d{1,15}$/))) {
            return 'amex';
        }

        if (number.match(/^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/)) {
            return 'dinner';
        }
    }
}