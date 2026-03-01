/**
 * Seed 3 demo blog posts in "published" state.
 *
 * Usage:  node scripts/seedBlogPosts.js
 *
 * Requires MONGODB_URI in .env.
 * If no admin/user exists, creates posts with authorId = null (will show "VidyaTrack Team").
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import User from '../models/User.js';

const DEMO_POSTS = [
  {
    title: 'How to Build a Successful Career in Tech: A Beginner\'s Roadmap',
    slug: 'career-in-tech-beginners-roadmap',
    excerpt: 'A practical, step-by-step guide for anyone starting a career in technology — from choosing your first language to landing your first job.',
    content: `<h2>Why Tech?</h2>
<p>The technology sector continues to grow at an unprecedented rate. Whether you're drawn to web development, data science, or AI, there has never been a better time to start.</p>

<h2>Step 1 — Pick a Path</h2>
<p>Don't try to learn everything. Choose one area:</p>
<ul>
  <li><strong>Frontend Development</strong> — HTML, CSS, JavaScript, React</li>
  <li><strong>Backend Development</strong> — Node.js, Python, Databases</li>
  <li><strong>Data Science</strong> — Python, Statistics, Machine Learning</li>
  <li><strong>Mobile Development</strong> — React Native, Flutter</li>
</ul>

<h2>Step 2 — Learn by Building</h2>
<p>Tutorials are great, but the fastest way to learn is by building real projects. Start with a portfolio site, then tackle a full-stack app.</p>

<h2>Step 3 — Contribute to Open Source</h2>
<p>Open source contributions demonstrate collaboration skills and give you real-world experience. Start with "good first issue" labels on GitHub.</p>

<h2>Step 4 — Network and Apply</h2>
<p>Join communities like Dev.to, attend meetups, and start applying. Remember: you don't need to know everything to get your first role.</p>

<blockquote>"The best time to start was yesterday. The second best time is now."</blockquote>`,
    tags: ['Career', 'Beginners', 'Roadmap', 'Tech'],
    heroImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    readingTime: 4,
  },
  {
    title: 'Understanding React Server Components: What, Why, and How',
    slug: 'understanding-react-server-components',
    excerpt: 'React Server Components are changing how we build web apps. This article breaks down what they are, why they matter, and how to use them.',
    content: `<h2>The Problem with Client-Side Rendering</h2>
<p>Traditional React apps send a large JavaScript bundle to the browser. The browser downloads, parses, and executes it before showing content. This hurts performance, especially on slower devices.</p>

<h2>Enter Server Components</h2>
<p>React Server Components (RSC) run on the server and send rendered HTML to the client. They <strong>never</strong> ship to the browser's JS bundle, which means:</p>
<ul>
  <li>Smaller bundle sizes</li>
  <li>Faster initial page loads</li>
  <li>Direct access to databases and APIs on the server</li>
</ul>

<h2>Server vs Client Components</h2>
<p>Not every component should be a Server Component. Interactive elements (forms, modals, state-driven UI) still need to run on the client. The key is choosing the right boundary.</p>

<pre><code>// ServerComponent.jsx — runs on server
export default async function ArticleList() {
  const articles = await db.articles.findMany();
  return (
    &lt;ul&gt;
      {articles.map(a =&gt; &lt;li key={a.id}&gt;{a.title}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}

// ClientComponent.jsx — runs on client
'use client';
export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  return &lt;button onClick={() =&gt; setLiked(!liked)}&gt;❤️&lt;/button&gt;;
}</code></pre>

<h2>Getting Started</h2>
<p>Next.js 13+ and the App Router use Server Components by default. If you're already using Next.js, you're probably using them already.</p>

<blockquote>"Think of Server Components as a way to move expensive work off the user's device and onto your server."</blockquote>`,
    tags: ['React', 'JavaScript', 'Web Dev', 'Performance'],
    heroImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    readingTime: 5,
  },
  {
    title: 'The Art of Effective Learning: Study Techniques Backed by Science',
    slug: 'effective-learning-study-techniques',
    excerpt: 'Forget rote memorisation. These evidence-based study techniques will help you learn faster, remember longer, and actually enjoy the process.',
    content: `<h2>Why Most Study Methods Fail</h2>
<p>Highlighting, re-reading, and cramming feel productive but rarely lead to long-term retention. Research shows that <strong>active learning strategies</strong> are far more effective.</p>

<h2>1. Spaced Repetition</h2>
<p>Instead of studying a topic once, revisit it at increasing intervals. Tools like Anki automate this. The spacing effect dramatically improves memory consolidation.</p>

<h2>2. Active Recall</h2>
<p>Close your notes and try to recall what you learned. This is uncomfortable, but that's exactly why it works — your brain strengthens connections when it has to actively retrieve information.</p>

<h2>3. Interleaving</h2>
<p>Mix different topics or problem types in a single study session. It feels harder, but it builds flexibility and deeper understanding.</p>

<h2>4. The Feynman Technique</h2>
<p>Explain the concept as if teaching a 12-year-old. If you stumble, that's where your understanding is weak. Go back and fill the gaps.</p>

<h2>5. Deliberate Practice</h2>
<p>Focus on your weakest areas with targeted exercises. Comfort zones don't build skills; the edge of your ability does.</p>

<h2>Putting It Together</h2>
<p>Combine these methods: use active recall with spaced repetition flash cards, interleave your subjects, and teach what you learn. You'll cut your study time and remember more.</p>

<blockquote>"Learning is not a spectator sport." — D. Blocher</blockquote>`,
    tags: ['Learning', 'Productivity', 'Education', 'Study Tips'],
    heroImageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80',
    readingTime: 4,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Try to find an admin or any user as author
    let author = await User.findOne({ role: 'admin' });
    if (!author) author = await User.findOne({});

    for (const data of DEMO_POSTS) {
      const exists = await Post.findOne({ slug: data.slug });
      if (exists) {
        console.log(`  ↩ Post "${data.title}" already exists, skipping.`);
        continue;
      }
      await Post.create({
        ...data,
        authorId: author?._id || null,
        status: 'published',
      });
      console.log(`  ✅ Seeded: "${data.title}"`);
    }

    console.log('Done seeding blog posts.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
