import os
import re

directory = r"c:\Users\kushg\OneDrive\Desktop\CRAFTIGARI\apps\web\src\app"
regex = re.compile(r'https://lh3\.googleusercontent\.com/aida-public/[A-Za-z0-9_-]+')
replacement = "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop"

replaced_count = 0

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content, count = regex.subn(replacement, content)
            
            if count > 0:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                replaced_count += count
                print(f"Replaced {count} instances in {filepath}")

print(f"Total replacements: {replaced_count}")
