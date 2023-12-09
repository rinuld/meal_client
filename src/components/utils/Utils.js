export const shortenText = (text) => {
    if (text.length > 100) {
        let shortenedText = text.substring(0, 100); // get the first 100 characters
        const lastSpace = shortenedText.lastIndexOf(" "); // find the last space character
        shortenedText = shortenedText.substring(0, lastSpace) + "..."; // get the substring up to the last space character and add the triple dots
        return shortenedText;
    } else {
        return text; // use the original text if it's already shorter than 100 characters
    }
};