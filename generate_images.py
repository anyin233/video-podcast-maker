"""
Generate AI images for video sections using Gemini nano-banana-pro-preview model.

Usage:
    python3 generate_images.py --manifest videos/{name}/media_manifest.json --output-dir public/media/{name}/
    python3 generate_images.py --manifest videos/{name}/media_manifest.json --output-dir public/media/{name}/ --resume  # Skip existing
"""

import argparse
import base64
import json
import os
import sys
import time
import urllib.request
import urllib.error


MODEL = "nano-banana-pro-preview"


def generate_image(prompt: str, api_key: str) -> bytes:
    """Generate an image using Gemini nano-banana-pro-preview via generateContent.

    Args:
        prompt: Text prompt describing the desired image.
        api_key: Gemini API key.

    Returns:
        Raw PNG image bytes.
    """
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}"
        f":generateContent?key={api_key}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["image", "text"],
        },
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    resp = urllib.request.urlopen(req, timeout=120)
    result = json.loads(resp.read().decode("utf-8"))

    # Extract image from response
    candidates = result.get("candidates", [])
    if not candidates:
        raise RuntimeError(f"No candidates returned: {json.dumps(result)[:200]}")

    parts = candidates[0].get("content", {}).get("parts", [])
    for part in parts:
        inline_data = part.get("inlineData", {})
        if inline_data.get("mimeType", "").startswith("image/"):
            return base64.b64decode(inline_data["data"])

    raise RuntimeError(f"No image data in response parts: {[p.keys() for p in parts]}")


def main():
    parser = argparse.ArgumentParser(description="Generate AI images from media manifest")
    parser.add_argument("--manifest", required=True, help="Path to media_manifest.json")
    parser.add_argument("--output-dir", required=True, help="Output directory for images")
    parser.add_argument("--resume", action="store_true", help="Skip already-generated images")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY environment variable not set")
        sys.exit(1)

    with open(args.manifest, "r") as f:
        manifest = json.load(f)

    os.makedirs(args.output_dir, exist_ok=True)

    assets = [a for a in manifest["assets"] if a.get("source") == "ai_generated"]
    total = len(assets)
    print(f"Found {total} AI-generated assets to create (model: {MODEL})")

    success = 0
    for i, asset in enumerate(assets, 1):
        output_path = os.path.join(args.output_dir, asset["file"])

        if args.resume and os.path.exists(output_path):
            print(f"[{i}/{total}] SKIP (exists): {asset['file']}")
            success += 1
            continue

        print(f"[{i}/{total}] Generating: {asset['file']}")
        print(f"  Prompt: {asset['prompt'][:80]}...")

        try:
            image_data = generate_image(asset["prompt"], api_key)
            with open(output_path, "wb") as f:
                f.write(image_data)
            print(f"  OK: {len(image_data)} bytes -> {output_path}")
            success += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            continue

        # Rate limiting
        if i < total:
            time.sleep(2)

    print(f"\nDone! {success}/{total} images generated in {args.output_dir}")


if __name__ == "__main__":
    main()
