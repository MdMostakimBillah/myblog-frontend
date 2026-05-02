// extractPostParts ফাংশন (এটাকে আপডেট করো)
export const extractPostParts = (jsonContent) => {
if (!jsonContent?.content || !Array.isArray(jsonContent.content)) {
    return {
      title: "শিরোনাম পাওয়া যায়নি",
      featuredImage: null,
      firstParagraphNode: null,
      firstParagraphText: "বিস্তারিত পড়তে ক্লিক করুন...",
      bodyContent: { type: "doc", content: [] },
    };
  }

  let title = "";
  let featuredImage = null;
  let firstParagraphNode = null;
  let firstParagraphText = "";
  const bodyNodes = [];

  jsonContent.content.forEach((node) => {
    if (!featuredImage && node.type === "image" && node.attrs?.src) {
      featuredImage = node.attrs;
      return;
    }

    if (!title && node.type === "heading" && node.attrs?.level === 1) {
      title = node.content?.[0]?.text?.trim() || "শিরোনাম নেই";
      return;
    }

    // প্রথম paragraph নোডটা ধরে রাখা
    if (!firstParagraphNode && node.type === "paragraph") {
      firstParagraphNode = node; // পুরো নোড
      firstParagraphText = node.content
        ?.map((t) => t.text || "")
        .join("")
        .trim()
        .substring(0, 180) + "...";
      return; // bodyNodes-এ ঢুকাবো না
    }

    bodyNodes.push(node);
  });

  return {
    title,
    featuredImage,
    firstParagraphNode,
    firstParagraphText,
    bodyContent: { type: "doc", content: bodyNodes },
  };
};