import asyncio
from pathlib import Path
import edge_tts

TEXT="""Need a practical way to discover local businesses? LeadForge turns public map data into a shortlist you can actually use. Choose a city, set your search radius, and select up to three business types. Review businesses in a list and on the map, filter the results, save the ones that matter, and optionally look for public website contacts. When you're ready, export your list as CSV, phone, email, or GeoJSON. No account. Local-first. Open source. Start building your shortlist with LeadForge today."""

async def main():
    out=Path("public/audio")
    out.mkdir(parents=True,exist_ok=True)
    c=edge_tts.Communicate(TEXT,voice="en-AU-NatashaNeural",rate="+8%",pitch="+0Hz",volume="+0%")
    await c.save(str(out/"voice.mp3"))
    print("Generated Australian-English female narration.")
asyncio.run(main())
