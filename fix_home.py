import sys
p = sys.argv[1]
lines = open(p, encoding='utf-8').readlines()
# Keep lines 1-127 (0-indexed 0-126) and lines 183-end (0-indexed 182-)
kept = lines[0:127] + lines[182:]
open(p, 'w', encoding='utf-8').writelines(kept)
print(f'Done: {len(lines)} -> {len(kept)} lines')
