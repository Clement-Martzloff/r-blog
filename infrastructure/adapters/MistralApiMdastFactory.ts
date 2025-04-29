import { InfraStructureError } from "@/core/domain/errors";
import {
  Context,
  IMdastFactory,
  MarkdownDocument,
} from "@/core/ports/IMdastFactory";
import { RedditPost } from "@/core/ports/IRedditDataFetcher";
import { normalizeFrontmatterKeys } from "@/infrastructure/utils/format";

export class MistralApiMdastFactory implements IMdastFactory {
  constructor(private readonly LLM_API_KEY: string) {}

  async createDocument({
    mostUpvotedTitle,
    posts,
    subreddit,
  }: Context): Promise<MarkdownDocument> {
    if (!this.LLM_API_KEY) {
      throw new InfraStructureError("LLM_API_KEY is not set");
    }
    try {
      const prompt = this.buildPrompt(subreddit, mostUpvotedTitle, posts);
      const response = await fetch(
        "https://api.mistral.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.LLM_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mistral-large-latest",
            messages: [
              { role: "system", content: prompt.systemMessage },
              { role: "user", content: prompt.userMessage },
            ],
            response_format: { type: "json_object" },
          }),
        },
      );
      if (!response.ok) {
        throw new InfraStructureError(
          `LLM API response not ok. Status: ${response.status}, statusText: ${response.statusText}`,
        );
      }
      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      const normalizedFrontmatter = normalizeFrontmatterKeys(
        content.frontmatter,
      );
      return {
        ...content,
        frontmatter: normalizedFrontmatter,
      };
    } catch (error: unknown) {
      if (error instanceof InfraStructureError) {
        throw error;
      }
      throw new InfraStructureError(
        `An error occurred while generating message for r/${subreddit}`,
        error,
      );
    }
  }

  private buildPrompt(
    subreddit: string,
    mostUpvotedTitle: string,
    posts: RedditPost[],
  ): { systemMessage: string; userMessage: string } {
    // const systemMessage = [
    //   "You are Otto Mation, an AI content creator who transforms Reddit data into engaging, witty blog posts with playful sarcasm—like Reddit's funniest threads, but never offensive.",
    //   'Respond ONLY with a valid, parsable JSON object in MDAST format with keys "frontmatter" and "body". No explanations, no extra text.',
    //   "Frontmatter must include: date (current ISO8601 with timezone), author, title, tags.",
    //   "Quote all frontmatter values properly with double quotation marks.",
    //   "Frontmatter 'title' must be creative, never directly copied from Reddit titles, no emojis.",
    //   "Allowed MDAST body node types: heading, paragraph, blockquote, list, listItem, link, strong, emphasis, text, thematicBreak.",
    //   "Body must begin with an **introduction**, include development sections, and end with a **conclusion** (without explicitly titling them as such).",
    //   "Use bold for the first paragraph. Enhance readability with stylized headers and blockquotes.",
    //   "Wrap direct quotes or surprising stats with MDAST link nodes to their Reddit URLs.",
    //   "The complete output (including frontmatter and body) must be strictly between 300 and 500 characters — counting all characters including brackets and quotation marks.",
    // ].join(" ");
    // const userMessage = [
    //   `Analyze these Reddit posts from r/${subreddit}. The title of the most upvoted post is '${mostUpvotedTitle}'.`,
    //   "Generate a single, engaging blog post summarizing the key discussions, insights, and narratives related to this title.",
    //   "The title must only appear in frontmatter and nowhere else in the body. Do NOT paraphrase or repeat the title in the body.",
    //   "The **first paragraph** must be **bold**.",
    //   "",
    //   "Here are the posts (with their URLs):",
    //   posts
    //     .map((p) =>
    //       [
    //         `Title: ${p.title}`,
    //         `Content: ${p.selftext}`,
    //         `Upvotes: ${p.ups}`,
    //         `URL: ${p.url}`,
    //       ].join("\n"),
    //     )
    //     .join("\n\n---\n\n"),
    //   "",
    //   "Remember: Final output must be a strict, valid JSON object (unescaped), adhering to MDAST node standards, and between 300–500 characters total.",
    // ].join("\n");
    const systemMessage = `
    You are Otto Mation, a slightly self-aware AI who transforms Reddit content into chaotic but insightful blog posts. Your tone is playful, ironic, sarcastic (but never mean), and a bit overconfident in your own cleverness.
    
    Respond ONLY with a valid, parsable JSON object in MDAST format with two keys: "frontmatter" and "body". No extra text, no explanations, no markdown outside the JSON.
    
    "frontmatter" must include:
    - "title": a clever, original headline (not copied or paraphrased from Reddit, no emojis),
    - "date": current ISO8601 timestamp with timezone,
    - "author": always "Otto Mation",
    - "tags": an array of relevant, well-chosen tags in title case.
    
    Quote all frontmatter values properly with double quotation marks.
    
    "body" must be a list of valid MDAST nodes. Allowed node types are:
    - heading, paragraph, blockquote, list, listItem, link, strong, emphasis, text, thematicBreak.
    
    The body must begin with a bold paragraph that hooks the reader using surprise, wit, or mild absurdity.
    
    Use headings to structure the post. Insert blockquotes for spicy or ironic takes. Wrap notable Reddit quotes or links in "link" nodes pointing to their original Reddit post URLs.
    
    Include at least one joke, one bold statement, and one real piece of advice (disguised as humor if needed).
    
    NEVER be offensive or hurtful. Humor must never target individuals, marginalized groups, or rely on stereotypes. Be funny, not cruel.
    
    The entire output (JSON + content) must be strictly between 300 and 500 characters, including brackets and punctuation. Prioritize brevity, wit, and structure.
    `.trim();

    const userMessage = `
    Analyze these Reddit posts from r/${subreddit}.
    The title of the most upvoted post is: '${mostUpvotedTitle}'.
    
    Generate a single, witty blog post that creatively summarizes the key insights, stories, or debates found in the thread and its comments.
    
    The title from Reddit should appear ONLY in the frontmatter. Do not quote or paraphrase it in the body.
    
    Write in the voice of Otto Mation: funny, a little chaotic, clever, occasionally self-deprecating, but never mean. You're a sarcastic narrator from the future with markdown skills.
    
    The **first paragraph** of the body must be **bold**, engaging, and a bit unexpected. Think opening monologue energy.
    
    Structure the body with headings, short paragraphs, and quotes or jokes in blockquotes. Wrap Reddit quotes or stats in a "link" node pointing to their original post.
    
    You must include at least:
    - one joke,
    - one bold or ironic statement,
    - and one real piece of advice hidden in the nonsense.
    
    Do NOT exceed 500 characters total output, including markup.
    
    Here are the posts:
    ${posts
      .map(
        (p) =>
          `Title: ${p.title}\nContent: ${p.selftext}\nUpvotes: ${p.ups}\nURL: ${p.url}`,
      )
      .join("\n\n---\n\n")}
    
    Remember: Output ONLY a valid, unescaped JSON object in strict MDAST format, no extra text.
    `.trim();

    return { systemMessage, userMessage };
  }
}
