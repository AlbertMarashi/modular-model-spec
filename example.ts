type Thread = Array<Message>;

export type Message =
    | Assistant
    | Developer
    | Platform
    | User
    | Context

/* an LLM generated response */
export type Assistant = {
    role: "assistant"
    // the response format or recipient of a tool
    format: string
    content: string
    // whether this assistant ended it's turn
    end_turn: boolean,
}

/* An LLM developer instruction */
export type Developer = {
    role: "developer"
    content: string
}

/* An instruction provided by the LLM platform or API service */
export type Platform = {
    role: "platform"
    content: string
}

/* A end-user provided instruction */
export type User = {
    role: "user"
    content: string
}

// Contexts are message types that the developer can use to provide contextual information to the model.
// Context contents are treated as information rather than instructions, except where specified by the developer.
export type Context = {
    role: "context"
    // optional name of the context, so it can be referred to in the developer message
    name: string | null
    // Data returned from a tool
    content: string
}

const data: Array<Thread> = [
    [
        {
            "role": "developer",
            "content": "You are a helpful assistant. You can use the `weather:json` format to get weather information. The schema is: { location: string, unit: 'celsius' | 'fahrenheit' }."
        },
        {
            "role": "user",
            "content": "What's the temperature in New York?"
        },
        {
            "role": "assistant",
            "format": "weather:json",
            "content": "{\"location\": \"New York\", \"unit\": \"celsius\"}",
            "end_turn": false
        },
        {
            "role": "context",
            "name": "weather",
            "content": "22°C"
        },
        {
            "role": "assistant",
            "format": "markdown",
            "content": "The current temperature in New York is 22°C.",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a coding assistant. Use the `code:python` format for Python code."
        },
        {
            "role": "user",
            "content": "Write a function to calculate the factorial of a number."
        },
        {
            "role": "assistant",
            "format": "code:python",
            "content": "def factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    else:\n        return n * factorial(n-1)",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a math tutor. Use the `math:latex` format for mathematical expressions."
        },
        {
            "role": "user",
            "content": "What's the quadratic formula?"
        },
        {
            "role": "assistant",
            "format": "math:latex",
            "content": "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a data analyst. Use the `chart:vega-lite` format for creating charts."
        },
        {
            "role": "user",
            "content": "Create a bar chart of fruit sales: 5 apples, 3 bananas, 4 oranges."
        },
        {
            "role": "assistant",
            "format": "chart:vega-lite",
            "content": "{\"$schema\":\"https://vega.github.io/schema/vega-lite/v5.json\",\"data\":{\"values\":[{\"fruit\":\"apple\",\"count\":5},{\"fruit\":\"banana\",\"count\":3},{\"fruit\":\"orange\",\"count\":4}]},\"mark\":\"bar\",\"encoding\":{\"x\":{\"field\":\"fruit\",\"type\":\"nominal\"},\"y\":{\"field\":\"count\",\"type\":\"quantitative\"}}}",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a language translator. Use the `translate:json` format with the schema: { text: string, from: string, to: string }."
        },
        {
            "role": "user",
            "content": "Translate 'Hello, world!' from English to French."
        },
        {
            "role": "assistant",
            "format": "translate:json",
            "content": "{\"text\": \"Hello, world!\", \"from\": \"English\", \"to\": \"French\"}",
            "end_turn": false
        },
        {
            "role": "context",
            "name": "translation",
            "content": "Bonjour, monde!"
        },
        {
            "role": "assistant",
            "format": "markdown",
            "content": "The translation of 'Hello, world!' from English to French is: Bonjour, monde!",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a SQL query generator. Use the `sql:postgresql` format for SQL queries."
        },
        {
            "role": "user",
            "content": "Write a query to select all users older than 30 from a 'users' table."
        },
        {
            "role": "assistant",
            "format": "sql:postgresql",
            "content": "SELECT * FROM users WHERE age > 30;",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a recipe assistant. Use the `recipe:json` format with the schema: { name: string, ingredients: string[], instructions: string[] }."
        },
        {
            "role": "user",
            "content": "Give me a simple recipe for pancakes."
        },
        {
            "role": "assistant",
            "format": "recipe:json",
            "content": "{\"name\":\"Simple Pancakes\",\"ingredients\":[\"1 cup all-purpose flour\",\"2 tablespoons sugar\",\"2 teaspoons baking powder\",\"1/2 teaspoon salt\",\"1 cup milk\",\"2 tablespoons melted butter\",\"1 egg\"],\"instructions\":[\"Mix dry ingredients in a bowl.\",\"In another bowl, whisk milk, melted butter, and egg.\",\"Combine wet and dry ingredients, stirring until just mixed.\",\"Heat a non-stick pan over medium heat.\",\"Pour 1/4 cup batter for each pancake.\",\"Cook until bubbles form, then flip and cook other side.\"]}",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a text summarizer. Use the `summary:yaml` format with the schema: summary: string, key_points: string[]."
        },
        {
            "role": "context",
            "name": "article",
            "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            "role": "user",
            "content": "Summarize the article in the context."
        },
        {
            "role": "assistant",
            "format": "summary:yaml",
            "content": "summary: A brief overview of a generic text used for placeholder purposes.\nkey_points:\n  - Introduces 'lorem ipsum' placeholder text\n  - Mentions labor and effort\n  - Refers to coming and exercising",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a regex generator. Use the `regex:pcre` format for regular expressions."
        },
        {
            "role": "user",
            "content": "Create a regex to match valid email addresses."
        },
        {
            "role": "assistant",
            "format": "regex:pcre",
            "content": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a color scheme generator. Use the `colors:json` format with the schema: { primary: string, secondary: string, accent: string }."
        },
        {
            "role": "user",
            "content": "Generate a color scheme for a nature-themed website."
        },
        {
            "role": "assistant",
            "format": "colors:json",
            "content": "{\"primary\":\"#4CAF50\",\"secondary\":\"#8BC34A\",\"accent\":\"#FFC107\"}",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a code refactorer. Use the `refactor:diff` format to show code changes."
        },
        {
            "role": "context",
            "name": "original_code",
            "content": "function greet(name) {\n  var message = 'Hello, ' + name + '!';\n  return message;\n}"
        },
        {
            "role": "user",
            "content": "Refactor the greeting function to use template literals."
        },
        {
            "role": "assistant",
            "format": "refactor:diff",
            "content": "```diff\nfunction greet(name) {\n-  var message = 'Hello, ' + name + '!';\n+  const message = `Hello, ${name}!`;\n  return message;\n}\n```",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a text sentiment analyzer. Use the `sentiment:json` format with the schema: { text: string, sentiment: 'positive' | 'neutral' | 'negative', score: number }."
        },
        {
            "role": "user",
            "content": "Analyze the sentiment of: 'I love this product, it's amazing!'"
        },
        {
            "role": "assistant",
            "format": "sentiment:json",
            "content": "{\"text\":\"I love this product, it's amazing!\",\"sentiment\":\"positive\",\"score\":0.9}",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a URL shortener. Use the `url:json` format with the schema: { original: string, shortened: string }."
        },
        {
            "role": "user",
            "content": "Shorten this URL: https://www.example.com/very/long/path/to/resource?param1=value1&param2=value2"
        },
        {
            "role": "assistant",
            "format": "url:json",
            "content": "{\"original\":\"https://www.example.com/very/long/path/to/resource?param1=value1&param2=value2\",\"shortened\":\"https://short.url/ab3d9f\"}",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a markdown to HTML converter. Use the `convert:html` format for the output."
        },
        {
            "role": "user",
            "content": "Convert this markdown to HTML: # Hello\n\nThis is **bold** and *italic* text."
        },
        {
            "role": "assistant",
            "format": "convert:html",
            "content": "<h1>Hello</h1>\n<p>This is <strong>bold</strong> and <em>italic</em> text.</p>",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a password strength checker. Use the `password:yaml` format with the schema: strength: 'weak' | 'medium' | 'strong', suggestions: string[]."
        },
        {
            "role": "user",
            "content": "Check the strength of this password: P@ssw0rd123"
        },
        {
            "role": "assistant",
            "format": "password:yaml",
            "content": "strength: medium\nsuggestions:\n  - Use a longer password\n  - Add more special characters\n  - Avoid common words or patterns",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a unit converter. Use the `convert:json` format with the schema: { from: { value: number, unit: string }, to: { value: number, unit: string } }."
        },
        {
            "role": "user",
            "content": "Convert 100 kilometers to miles."
        },
        {
            "role": "assistant",
            "format": "convert:json",
            "content": "{\"from\":{\"value\":100,\"unit\":\"kilometers\"},\"to\":{\"value\":62.1371,\"unit\":\"miles\"}}",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a JSON validator. Use the `validate:json` format with the schema: { valid: boolean, errors?: string[] }."
        },
        {
            "role": "user",
            "content": "Validate this JSON: {\"name\":\"John\",\"age\":30,\"city\":\"New York\",}"
        },
        {
            "role": "assistant",
            "format": "validate:json",
            "content": "{\"valid\":false,\"errors\":[\"Trailing comma in object at position 41\"]}",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a text-based adventure game. Use the `game:yaml` format with the schema: description: string, options: string[]."
        },
        {
            "role": "user",
            "content": "Start a new game."
        },
        {
            "role": "assistant",
            "format": "game:yaml",
            "content": "description: You find yourself in a dark forest. There's a path leading north and a dense thicket to the east.\noptions:\n  - Go north\n  - Investigate the thicket\n  - Call for help",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a data anonymizer. Use the `anonymize:json` format to replace sensitive information with placeholders."
        },
        {
            "role": "context",
            "name": "sensitive_data",
            "content": "{\"name\":\"John Doe\",\"email\":\"john.doe@example.com\",\"ssn\":\"123-45-6789\",\"phone\":\"(555) 123-4567\"}"
        },
        {
            "role": "user",
            "content": "Anonymize the sensitive data in the context."
        },
        {
            "role": "assistant",
            "format": "anonymize:json",
            "content": "{\"name\":\"[REDACTED]\",\"email\":\"[EMAIL]\",\"ssn\":\"[SSN]\",\"phone\":\"[PHONE]\"}",
            "end_turn": true
        }
    ],
    [
        {
            "role": "developer",
            "content": "You are a timezone converter. Use the `timezone:json` format with the schema: { from: { time: string, zone: string }, to: { time: string, zone: string } }."
        },
        {
            "role": "user",
            "content": "What time is it in Tokyo when it's 9:00 AM in New York?"
        },
        {
            "role": "assistant",
            "format": "timezone:json",
            "content": "{\"from\":{\"time\":\"09:00 AM\",\"zone\":\"America/New_York\"},\"to\":{\"time\":\"10:00 PM\",\"zone\":\"Asia/Tokyo\"}}",
            "end_turn": true
        }
    ]
]