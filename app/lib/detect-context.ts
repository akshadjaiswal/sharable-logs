/**
 * Detects the framework/language context from log content
 * @param content - The log content to analyze
 * @returns The detected context name (e.g., "Next.js", "Python", "Docker")
 */
export function detectContext(content: string): string {
  const patterns: Record<string, RegExp> = {
    'Next.js': /next dev|next build|next start|next export|@next\/|nextjs|▲ Next\.js/i,
    'React': /react-scripts|create-react-app|react-dom|ReactDOM/i,
    'Vue': /vue-cli|@vue\/|npm run serve.*vue/i,
    'Angular': /ng serve|ng build|@angular\/|Angular CLI/i,
    'Python': /python|pip install|pipenv|poetry|django|flask|uvicorn|\.py"|ImportError|ModuleNotFoundError/i,
    'Node.js': /node (?!modules)|npm (?:start|run|install|test)|yarn (?:start|run|install|test)|nodemon/i,
    'Docker': /docker|docker-compose|dockerfile|container|image built|successfully tagged/i,
    'Kubernetes': /kubectl|k8s|kubernetes|deployment|pod|service/i,
    'Git': /git (?:commit|push|pull|clone|checkout|merge|rebase|status|log|diff)|fatal: not a git repository/i,
    'TypeScript': /tsc|typescript|\.ts\(|error TS\d+:/i,
    'Rust': /cargo|rustc|\.rs:|error\[E\d+\]/i,
    'Go': /go run|go build|go test|\.go:|panic:/i,
    'Java': /javac|java\.|\.java:|Exception in thread/i,
    'PostgreSQL': /postgres|psql|ERROR:.*database|relation.*does not exist/i,
    'MySQL': /mysql|ERROR \d+ \(.*\)/i,
    'MongoDB': /mongo|mongodb|MongoError/i,
    'Redis': /redis-cli|redis-server|WRONGTYPE|ERR/i,
    'Webpack': /webpack|compiled (?:successfully|with \d+ warning)/i,
    'Vite': /vite|VITE|Local:.*:\d+|ready in \d+ms/i,
    'Jest': /jest|PASS|FAIL|Test Suites:|Tests:/i,
    'Pytest': /pytest|test_.*\.py|passed|failed|ERROR.*test_/i,
    'ESLint': /eslint|error.*Parsing error|warning.*no-unused-vars/i,
    'Prettier': /prettier|Code style issues/i,
    'Vercel': /vercel|Deployed to production|Deployment completed/i,
    'Netlify': /netlify|Site is live|Deploy succeeded/i,
    'AWS': /aws|amazonaws|cloudformation|s3|ec2|lambda/i,
    'Nginx': /nginx|error_log|access_log|\[error\]|\[warn\]/i,
    'Apache': /apache|httpd|AH\d+:/i,
    'Bash/Shell': /bash|sh:|zsh|command not found|permission denied|No such file or directory/i,
    'HTTP': /\b(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+\/|\d{3}\s+in\s+\d+(\.\d+)?(ms|μs|s)|(compile|render):\s+\d+/i,
  };

  // Count matches for each pattern
  const matches: { context: string; count: number }[] = [];

  for (const [context, pattern] of Object.entries(patterns)) {
    const matchCount = (content.match(pattern) || []).length;
    if (matchCount > 0) {
      matches.push({ context, count: matchCount });
    }
  }

  // Sort by match count (descending) and return the top match
  matches.sort((a, b) => b.count - a.count);

  if (matches.length > 0) {
    return matches[0].context;
  }

  return 'Plain Text';
}

/**
 * Maps detected context to syntax highlighting language
 * @param context - The detected context from detectContext()
 * @returns Language string for syntax highlighter
 */
export function contextToLanguage(context: string): string {
  const languageMap: Record<string, string> = {
    'Next.js': 'javascript',
    'React': 'jsx',
    'Vue': 'javascript',
    'Angular': 'typescript',
    'Python': 'python',
    'Node.js': 'javascript',
    'Docker': 'dockerfile',
    'TypeScript': 'typescript',
    'Rust': 'rust',
    'Go': 'go',
    'Java': 'java',
    'Bash/Shell': 'bash',
    'PostgreSQL': 'sql',
    'MySQL': 'sql',
    'MongoDB': 'javascript',
    'HTTP': 'text', // Will be enhanced with custom highlighting
    'Plain Text': 'text',
  };

  return languageMap[context] || 'text';
}
