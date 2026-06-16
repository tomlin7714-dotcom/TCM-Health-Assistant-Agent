import os

p = os.path.join('d:\\h\\pycharm\\balance\u667a\u6167\u4e2d\u533b', 'frontend', 'src', 'pages', 'Home.tsx')
content = open(p, encoding='utf-8').read()

start_marker = '      // Intelligently match symptom keywords'
end_marker = '      suggestion: matchedResult.advice\n      });\n\n  const getHerbNameAndImg'
replacement = '\n  const getHerbNameAndImg'

if start_marker in content and 'matchedResult.advice' in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    if end_idx != -1:
        cleaned = content[:start_idx] + replacement + content[end_idx + len(end_marker):]
        open(p, 'w', encoding='utf-8').write(cleaned)
        print('Cleaned successfully')
    else:
        # fallback: just find and remove from start_marker to getHerbNameAndImg
        end_marker2 = '  const getHerbNameAndImg'
        end_idx2 = content.find(end_marker2)
        if end_idx2 > start_idx:
            cleaned = content[:start_idx] + '\n' + content[end_idx2:]
            open(p, 'w', encoding='utf-8').write(cleaned)
            print('Cleaned with fallback')
        else:
            print('Could not find end marker')
else:
    print('Start marker not found - file may already be clean')
    print('First 50 chars after handleAnalyze:')
    idx = content.find('setIsAnalyzing(false);\n    }\n  };')
    if idx != -1:
        print(repr(content[idx:idx+100]))
