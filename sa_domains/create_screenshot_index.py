#!/usr/bin/env python3
"""Create a CSV index mapping domains to their screenshot files."""

import csv
import json
import os

SCREENSHOTS_DIR = "/home/ubuntu/sa_domains/screenshots"
PROGRESS_FILE = "/home/ubuntu/sa_domains/crawl_progress.json"
OUTPUT_FILE = "/home/ubuntu/sa_domains/screenshots_index.csv"

# Load progress data
with open(PROGRESS_FILE, 'r') as f:
    progress = json.load(f)

# Create index
rows = []
for domain, info in progress['results'].items():
    screenshot_file = ""
    if info.get('screenshot_path'):
        screenshot_file = os.path.basename(info['screenshot_path'])
        # Verify file exists
        full_path = os.path.join(SCREENSHOTS_DIR, screenshot_file)
        if not os.path.exists(full_path):
            screenshot_file = ""
    
    rows.append({
        'domain': domain,
        'privacy_url': info.get('privacy_url', ''),
        'status': info.get('status', ''),
        'screenshot_file': screenshot_file,
        'title': info.get('title', ''),
        'text_length': info.get('text_length', 0),
        'error': info.get('error', '')
    })

# Sort by domain
rows.sort(key=lambda x: x['domain'])

# Write CSV
with open(OUTPUT_FILE, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['domain', 'privacy_url', 'status', 'screenshot_file', 'title', 'text_length', 'error'])
    writer.writeheader()
    writer.writerows(rows)

# Stats
total = len(rows)
success = sum(1 for r in rows if r['status'] == 'success')
with_screenshot = sum(1 for r in rows if r['screenshot_file'])
failed = sum(1 for r in rows if r['status'] == 'failed')

print(f"Screenshot Index Created: {OUTPUT_FILE}")
print(f"Total entries: {total}")
print(f"Successful: {success}")
print(f"With screenshot file: {with_screenshot}")
print(f"Failed: {failed}")

# Also count actual files
actual_files = len([f for f in os.listdir(SCREENSHOTS_DIR) if f.endswith('.png')])
total_size = sum(os.path.getsize(os.path.join(SCREENSHOTS_DIR, f)) for f in os.listdir(SCREENSHOTS_DIR) if f.endswith('.png'))
print(f"Actual screenshot files: {actual_files}")
print(f"Total size: {total_size/1024/1024:.0f} MB")
