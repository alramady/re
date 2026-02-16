#!/usr/bin/env python3
"""
Optimized Privacy Policy Screenshot Crawler v2
Higher concurrency, shorter timeouts, multiple browser instances.
"""

import asyncio
import csv
import json
import os
import sys
import time
from datetime import datetime
from playwright.async_api import async_playwright

SCREENSHOTS_DIR = "/home/ubuntu/sa_domains/screenshots"
PROGRESS_FILE = "/home/ubuntu/sa_domains/crawl_progress.json"
INPUT_FILE = "/home/ubuntu/sa_domains/privacy_urls_for_crawl.csv"

# Optimized settings
CONCURRENT_PAGES = 15  # More concurrent pages
PAGE_TIMEOUT = 15000   # 15 seconds max
BATCH_SIZE = 100       # Larger batches
NUM_BROWSERS = 3       # Multiple browser instances


def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {"completed": [], "failed": [], "results": {}}


def save_progress(progress):
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(progress, f, ensure_ascii=False, indent=1)


def load_urls():
    urls = []
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            urls.append({
                'domain': row['domain'],
                'privacy_url': row['privacy_url']
            })
    return urls


async def crawl_page(context, domain, privacy_url, semaphore):
    async with semaphore:
        result = {
            'domain': domain,
            'privacy_url': privacy_url,
            'status': 'failed',
            'screenshot_path': '',
            'text_length': 0,
            'title': '',
            'error': ''
        }
        
        page = None
        try:
            page = await context.new_page()
            
            response = await page.goto(privacy_url, wait_until='domcontentloaded', timeout=PAGE_TIMEOUT)
            
            if response and response.status >= 400:
                result['error'] = f'HTTP {response.status}'
                return result
            
            # Short wait for rendering
            await asyncio.sleep(1.5)
            
            # Get title
            try:
                result['title'] = await page.title()
            except:
                pass
            
            # Screenshot
            safe_domain = domain.replace('.', '_').replace('/', '_')
            screenshot_path = os.path.join(SCREENSHOTS_DIR, f"{safe_domain}.png")
            
            # Skip if already exists
            if os.path.exists(screenshot_path) and os.path.getsize(screenshot_path) > 1000:
                result['screenshot_path'] = screenshot_path
                result['status'] = 'success'
                return result
            
            await page.screenshot(
                path=screenshot_path,
                full_page=True,
                timeout=10000
            )
            
            if os.path.exists(screenshot_path):
                result['screenshot_path'] = screenshot_path
                result['status'] = 'success'
            
            # Extract text length
            try:
                text_len = await page.evaluate("() => document.body ? document.body.innerText.length : 0")
                result['text_length'] = text_len
            except:
                pass
            
        except asyncio.TimeoutError:
            result['error'] = 'timeout'
        except Exception as e:
            result['error'] = str(e)[:150]
        finally:
            if page:
                try:
                    await page.close()
                except:
                    pass
        
        return result


async def process_batch_with_browser(playwright, batch, batch_id, progress, semaphore):
    """Process a batch using its own browser instance."""
    browser = await playwright.chromium.launch(
        headless=True,
        args=['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu',
              '--disable-web-security', '--disable-features=IsolateOrigins']
    )
    
    context = await browser.new_context(
        viewport={'width': 1280, 'height': 720},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ignore_https_errors=True,
        locale='ar-SA'
    )
    
    # Block heavy resources
    await context.route("**/*.{mp4,webm,ogg,mp3,wav,flac,aac,woff2,woff,ttf,eot}", 
                        lambda route: route.abort())
    
    tasks = []
    for item in batch:
        tasks.append(crawl_page(context, item['domain'], item['privacy_url'], semaphore))
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    success = 0
    fail = 0
    for r in results:
        if isinstance(r, Exception):
            fail += 1
            continue
        domain = r['domain']
        if r['status'] == 'success':
            success += 1
            progress['completed'].append(domain)
        else:
            fail += 1
            progress['failed'].append(domain)
        progress['results'][domain] = {
            'privacy_url': r['privacy_url'],
            'status': r['status'],
            'screenshot_path': r['screenshot_path'],
            'text_length': r['text_length'],
            'title': r['title'],
            'error': r['error']
        }
    
    await browser.close()
    return success, fail


async def main():
    start_time = time.time()
    os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
    
    all_urls = load_urls()
    progress = load_progress()
    
    already_done = set(progress['completed']) | set(progress['failed'])
    remaining = [u for u in all_urls if u['domain'] not in already_done]
    
    total = len(all_urls)
    done_before = len(already_done)
    
    print(f"Total URLs: {total}")
    print(f"Already done: {done_before}")
    print(f"Remaining: {len(remaining)}")
    print(f"Concurrent pages: {CONCURRENT_PAGES}")
    print(f"Browser instances: {NUM_BROWSERS}")
    print(f"Start: {datetime.now().strftime('%H:%M:%S')}")
    sys.stdout.flush()
    
    # Split remaining into super-batches for multiple browsers
    super_batch_size = BATCH_SIZE * NUM_BROWSERS
    super_batches = [remaining[i:i+super_batch_size] for i in range(0, len(remaining), super_batch_size)]
    
    semaphore = asyncio.Semaphore(CONCURRENT_PAGES)
    
    async with async_playwright() as p:
        for sb_idx, super_batch in enumerate(super_batches, 1):
            sb_start = time.time()
            
            # Split super-batch among browsers
            browser_batches = []
            chunk_size = len(super_batch) // NUM_BROWSERS + 1
            for i in range(0, len(super_batch), chunk_size):
                browser_batches.append(super_batch[i:i+chunk_size])
            
            # Run all browser batches concurrently
            tasks = []
            for bi, bb in enumerate(browser_batches):
                if bb:
                    tasks.append(process_batch_with_browser(p, bb, bi, progress, semaphore))
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            total_success = 0
            total_fail = 0
            for r in results:
                if isinstance(r, tuple):
                    total_success += r[0]
                    total_fail += r[1]
            
            # Save progress
            save_progress(progress)
            
            sb_time = time.time() - sb_start
            done_now = len(progress['completed']) + len(progress['failed'])
            rate = (done_now - done_before) / (time.time() - start_time) if (time.time() - start_time) > 0 else 0
            eta = (total - done_now) / rate / 60 if rate > 0 else 0
            
            print(f"[Super-batch {sb_idx}/{len(super_batches)}] +{total_success} ok, +{total_fail} fail | "
                  f"Total: {done_now}/{total} ({done_now*100/total:.1f}%) | "
                  f"Rate: {rate:.1f}/s | ETA: {eta:.0f}min | "
                  f"Batch time: {sb_time:.0f}s")
            sys.stdout.flush()
    
    # Final summary
    elapsed = time.time() - start_time
    screenshots = len([f for f in os.listdir(SCREENSHOTS_DIR) if f.endswith('.png')])
    
    print(f"\n{'='*60}")
    print(f"CRAWL COMPLETE")
    print(f"Time: {elapsed/60:.1f} min")
    print(f"Successful: {len(progress['completed'])}")
    print(f"Failed: {len(progress['failed'])}")
    print(f"Screenshots: {screenshots}")
    print(f"Dir: {SCREENSHOTS_DIR}")
    print(f"Size: {sum(os.path.getsize(os.path.join(SCREENSHOTS_DIR,f)) for f in os.listdir(SCREENSHOTS_DIR) if f.endswith('.png'))/1024/1024:.0f} MB")
    sys.stdout.flush()
    
    save_progress(progress)


if __name__ == '__main__':
    asyncio.run(main())
