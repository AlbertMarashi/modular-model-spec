import { init_branch } from "./scoring.svelte"
import tokens from "./tokens.txt?raw"
import { scoring_state } from "./scoring.svelte"

const source = [
//     // Developer and user messages
//     "<|role|>developer<|content|>this is a developer message",
//     "<|role|>user<|content|>this is a user message",

    //     // JSON response
    //     "<|role|>model<|format|>json<|content|>{\n\t\"key\": true\n}<|end_turn|>",

    //     // Model reasoning
    //     "<|role|>model<|format|>reasoning<|content|>The user replied with \".io\" likely referring to their domain being siteforge.io.",
    //     // Initial memory save
    //     "<|role|>model<|format|>memory:text<|content|>SiteForge's website domain is \"siteforge.io\"<|end_turn|>",
    //     "<|role|>context<|content|>Brand Domain Updated: \"siteforge.io\"",

    //     // Ask for description
    //     "<|role|>model<|format|>markdown<|content|>Great, I've saved your brand's website domain as **siteforge.io**.",
    //     "\n",
    //     "Next, could you please provide a brief description/elavator pitch for **SiteForge**?",
    //     "\n",
    //     "*This will help me personalise your onboarding process so that we can generate your tailored website later!*<|end_turn|>",

    //     // User response
    //     "<|role|>user<|content|>SiteForge is an AI powered website builder",

    //     // Long model response
    //     "<|role|>model<|format|>markdown<|content|>",
    //     "These insights are gold Albert! I love how SiteForge bridges different needs so elegantly. Let me break down what I'm hearing:",
    //     "\n",
    //     "1. **Business Owners & Team Leads**: They're actually *perfect* for initial drafts because:",
    //     "\n",
    //     "    - They know their business best",
    //     "\n",
    //     "    - Can use SiteForge without technical skills",
    //     "\n",
    //     "    - Create better first drafts for designers to work from",
    //     "\n",

    //     "2. **SaaS Companies** (*great new insight!*):",
    //     "\n",
    //     "    - Dev teams can focus on their product",
    //     "\n",
    //     "    - Marketing gets independence from dev team",
    //     "\n",
    //     "    - No more \"marketing support\" taking dev time",
    //     "\n",

    //     "3. **Agencies**: *Love* that brand memory system for:",
    //     "\n",
    //     "    - Managing multiple clients efficiently",
    //     "\n",
    //     "    - Maintaining distinct brand identities",
    //     "\n",
    //     "    - Ensuring consistency across projects",
    //     "\n",

    //     "This is shaping up beautifully!",
    //     "\n",

    //     "Before we **wrap up onboarding**, I'd love to capture SiteForge's unique brand personality and voice. This will help ensure all generated content feels authentically ***\"SiteForge.\"***",
    //     "\n",
    //     "**First, where does SiteForge sit on these key brand dimensions?**",
    //     "\n",
    //     "### Technology Presentation",
    //     "\n",
    //     "Think about how SiteForge should **feel** when someone interacts with it. Should it:",
    //     "\n",
    //     "- Deliver a **\"wow\"** factor, making users feel like it's pure magic—seamless, invisible, and effortless?",
    //     "\n",
    //     "- Come across as smart but down-to-earth, making sophisticated tools accessible without being intimidating?",
    //     "\n",
    //     "- Feel deeply technical an d advanced, radiating an aura of cutting-edge engineering and innovation?",
    //     "\n",
    //     "- Act as a trusted guide, offering educational insights and a transparent view into how it works, empowering users to learn along the way?",
    //     "\n",

    //     "### Voice Style",
    //     "\n",
    //     "How should SiteForge **speak** to users?",
    //     "\n",
    //     "- Should it feel bold, daring, and revolutionary—like it's challenging the status quo and redefining the game?",
    //     "\n",
    //     "- Friendly and upbeat—approachable, supportive, and encouraging, like a helpful co-worker?",
    //     "\n",
    //     "- More polished and professional—instilling confidence through clear authority, with a calm, trustworthy tone?",
    //     "\n",
    //     "- Or should it lean into practicality—straightforward and efficient, focused on delivering value without fluff?",
    //     "\n",

    //     "### AI capabilities",
    //     "\n",
    //     "When showcasing SiteForge's AI, the tone matters even more. How do you want to balance confidence with *humility?* Should it:",
    //     "\n",

    //     "- Highlight the magic of the AI without overhyping, framing it as a powerful tool that makes your vision come to life?",
    //     "\n",
    //     "- Be more explanatory, grounding its capabilities in clear examples to ensure transparency and build trust?",
    //     "\n",
    //     "- Emphasize its role as a co-creator, celebrating the human-AI partnership instead of positioning it as a standalone solution?",
    //     // Code blocks and markdown examples
    //     "\n",
    //     "```json\n{\n    \"key\": 123,\n}\n```",
    //     "\n",
    //     "\n",
    //     "## This is a heading with some **bold** and ***triple*** none",
    //     "\n",
    //     "- paragraph with some **bold** and ***triple*** none",
    //     "\n",
    //     "- **outer *inner*** after",
    //     "\n",
    //     "```json",
    //     "{",
    //     "    \"key\": 123",
    //     "}",
    //     "```",
    //     "\n",
    //     "plain",
    //     "\n",
    //     "```` code ```escaped ``` `inside ````",
    //     "\n",
    //     "*We're almost done, and then we can start generating your sitemap!*<|end_turn|>",
    //     `<|role|>model<|format|>thoughts<|content|>The user has provided a brand name: Meet.

    // Next, I should ask for the brand domain, but also consider asking for a brief description of the brand to get a better understanding of what Meet does.

    // I'll also create a new memory for the brand name and update the brand profile accordingly.

    // After that, I can ask about the brand domain and then move on to more specific questions about the brand's offerings, target audience, and personality.

    // For now, let's save the brand name and ask for a brief description.

    // ## Actions
    // - Save brand name: Meet
    // - Ask for brand description

    // ## Memories
    // - Brand Name: Meet

    // ## Next Questions
    // - What's your brand's website domain (e.g., meet.com)?
    // - Can you give me a brief description of what Meet does?

    // ## Thoughts
    // The user has provided a very short brand name. I should be prepared for the possibility that the brand domain might be already taken or that the user might need help coming up with a unique domain name.

    // I'll keep this in mind when asking about the brand domain and be ready to offer suggestions if needed.

    // Now, let's update the brand profile and save the brand name memory.

    // ## Brand Profile Update
    // - Brand Name: Meet
    // - Brand Domain: null (optional)

    // ## Memories Update
    // - Brand Name: Meet

    // Let's save this information and ask the next question.

    // ## Save Memory
    // \`\`\`json
    // {
    //     "type": "memory:text",
    //     "memory_type": "general",
    //     "text": "Brand Name: Meet"
    // }
    // \`\`\`

    // Now, let's ask for the brand description.

    // <|role|>model<|format|>assistant:markdown<|content|>Your brand name is **Meet**.

    // I've saved this information. Now, can you tell me a bit more about what **Meet** does? Perhaps a one-sentence summary description of your brand?

    // (This will help me get a better understanding of your brand and create more tailored content and designs for you.)<|end_turn|>`,

    //     "<|role|>model<|format|>assistant:markdown<|content|>I love it! Your brand name is **Meet**.\n\nNext, I'd love to know more about your brand. Can you tell me a bit about what **Meet** does? What products or services do you offer, and what problems do you solve for your customers?\n\n(And don't worry if you don't have everything figured out just yet - we can work through it together!)<|end_message|><|end_turn|><|role|>user<|content|>Meet is a social media platform<|role|>model<|format|>thoughts<|content|>The user has provided information about their brand, stating that Meet is a social media platform. This is a good starting point for gathering more information about the brand's offerings and target audience. Next, I should ask questions to clarify the type of social media platform Meet is, such as its focus, features, and target audience.<|role|>model<|format|>assistant:markdown<|content|>So **Meet** is a social media platform - that's really interesting!\n\nTo help me better understand your platform, can you tell me: What kind of social media platform is **Meet**? For example, is it a platform for:\n\n* Connecting people with similar interests?\n* Sharing content, like photos or videos?\n* Professional networking?\n* Something else entirely?\n\nThis will help me get a better sense of what makes **Meet** unique and how it can benefit its users.<|end_turn|><|role|>user<|content|>We're focused on helping people connect with others who share similar interests, making it easy for them to find and join communities that align with their passions.<|role|>model<|format|>thoughts<|content|>The user has provided more information about their brand, stating that Meet is a social media platform focused on helping people connect with others who share similar interests. This suggests that the platform is centered around community-building and facilitating connections between users with common passions.\n\nNext, I should ask questions to gather more information about the target audience for Meet, such as their demographics, interests, and pain points. This will help me better understand the brand's identity and how it can effectively communicate with its users.\n\nAdditionally, I should consider using the `memory:text` action to store the information provided by the user so far, such as the brand name and description",


].join("")



export function init_branches() {
    // const b1 = init_branch(tokens)
    // const b1 = init_branch("hello world")
    // const b1 = init_branch("<|role|>model<|format|>markdown<|content|>hello world<|end_message|>")
    // scoring_state.branch_map[b1.id.id] = b1

    
    // const b2 = init_branch("le|>" + source)
    // b1.parent = b2.id

    // scoring_state.branch_map[b2.id.id] = b2

    // scoring_state.active = b1.id

    // sources_to_branches("a", "baz", "f")

    // scoring_state.active = scoring_state.heirarchy[0].id.id

    //     sources_to_branches(
    //         "<|role|>model<|format|>markdown<|content|>\n" +
    //             "```ts\n" +
    //             "type GenerateSitemap = {" +
    //         `
    //     name: "foo"
    // }` +
    //             "\n```\n" +
    //             "<|end_message|>"
    //     )
    sources_to_branches(tokens)
}

function sources_to_branches(...sources: string[]) {
    const branches = sources.map(source => init_branch(source))
    
    branches.map((branch, index) => {
        branch.parent = branches?.[index - 1]?.id
        scoring_state.branch_map[branch.id.id] = branch
    })

    scoring_state.active = branches[branches.length - 1].id.id
}