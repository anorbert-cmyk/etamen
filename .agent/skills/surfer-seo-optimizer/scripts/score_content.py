import sys
import re
import json
from collections import Counter

def clean_text(text):
    # Remove code blocks
    text = re.sub(r'```[\s\S]*?```', '', text)
    # Remove HTML/JSX tags
    text = re.sub(r'<[^>]+>', '', text)
    # Remove frontmatter
    text = re.sub(r'^---[\s\S]*?---', '', text)
    return text.lower()

def analyze_file(file_path, target_keyword=None, secondary_keywords=None):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            raw_content = f.read()
    except FileNotFoundError:
        return {"error": "File not found"}

    content = clean_text(raw_content)
    
    # Word Count
    words = re.findall(r'\w+', content)
    word_count = len(words)
    
    # Heading Count
    h1_count = len(re.findall(r'^#\s', raw_content, re.MULTILINE))
    h2_count = len(re.findall(r'^##\s', raw_content, re.MULTILINE))
    h3_count = len(re.findall(r'^###\s', raw_content, re.MULTILINE))
    
    # Keyword Analysis
    keyword_stats = {}
    if target_keyword:
        target_lower = target_keyword.lower()
        count = content.count(target_lower)
        keyword_stats[target_keyword] = {
            "count": count,
            "density": round((count * len(target_lower.split())) / word_count * 100, 2) if word_count > 0 else 0
        }
        
    if secondary_keywords:
        for sk in secondary_keywords:
            sk_lower = sk.lower()
            keyword_stats[sk] = {
                "count": content.count(sk_lower),
                "present": sk_lower in content
            }

    # NLP / Entity Extraction (Simple Frequency for now)
    # Exclude common stopwords (simplified list)
    stopwords = {'the', 'and', 'to', 'of', 'a', 'in', 'is', 'that', 'for', 'it', 'with', 'as', 'was', 'on', 'at', 'by', 'be', 'this', 'are', 'or', 'an'}
    common_words = Counter([w for w in words if w not in stopwords and len(w) > 3]).most_common(10)

    score = 0
    # Basic scoring logic (arbitrary baseline for now)
    # 1. Length Score (assuming 1500 is baseline target)
    length_score = min(word_count / 1500 * 50, 50)
    
    # 2. Structure Score
    structure_score = min((h2_count + h3_count) / 10 * 30, 30)
    
    # 3. Keyword Score
    keyword_score = 0
    if target_keyword and keyword_stats[target_keyword]['count'] > 0:
        keyword_score = 20
        
    score = min(int(length_score + structure_score + keyword_score), 100)

    return {
        "file": file_path,
        "score": score,
        "stats": {
            "words": word_count,
            "headings": {"h1": h1_count, "h2": h2_count, "h3": h3_count},
            "keywords": keyword_stats,
            "top_entities": common_words
        }
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python score_content.py <file_path> [target_keyword] [secondary_keywords_comma_separated]"}))
        sys.exit(1)
        
    file_path = sys.argv[1]
    target_kw = sys.argv[2] if len(sys.argv) > 2 else None
    sec_kws = sys.argv[3].split(',') if len(sys.argv) > 3 else []
    
    result = analyze_file(file_path, target_kw, sec_kws)
    print(json.dumps(result, indent=2))
