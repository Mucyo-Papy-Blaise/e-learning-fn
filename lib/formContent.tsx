export function formatContent(html: string) {
  let output = html;

  // Fix double content stuck together
  output = output.replace(/<\/p><p>/g, "</p><p>");

  // Detect lines starting with capital words and convert to headings
  // Example: "English Vocabulary" → <h2>English Vocabulary</h2>
  output = output.replace(
    /(^|\n)([A-Z][A-Za-z0-9\s'-]{3,})\:/gm,
    "$1<h2>$2</h2><p>"
  );

  // Convert long text into paragraphs
  output = output.replace(/\. /g, ".</p><p>");

  // Wrap content in a <p> if it's not already
  if (!output.includes("<p>")) {
    output = `<p>${output}</p>`;
  }

  return output;
}