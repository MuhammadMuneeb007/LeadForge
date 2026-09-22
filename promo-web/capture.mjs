import {chromium} from "playwright";
import fs from "node:fs/promises";

const base="https://leadforge-umber.vercel.app";
await fs.mkdir("public/screens",{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5,colorScheme:"light"});
const page=await context.newPage();

async function shot(name){
  await page.evaluate(async()=>{if(document.fonts?.ready)await document.fonts.ready;});
  await page.waitForTimeout(450);
  await page.screenshot({path:`public/screens/${name}.png`,fullPage:false});
}

await page.goto(base,{waitUntil:"networkidle",timeout:90000});
await shot("home");

const workspace=page.locator("#workspace");
if(await workspace.count()){
  await workspace.scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  await shot("workspace");
}

const submit=page.getByRole("button",{name:/Search this area/i}).first();
if(await submit.count()){
  await submit.click();
  try{
    await page.locator(".results-section").waitFor({state:"visible",timeout:55000});
    await page.locator(".results-section").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await shot("results");

    const selects=page.locator(".lead-card .select-lead input[type=checkbox]");
    const count=Math.min(2,await selects.count());
    for(let i=0;i<count;i++) await selects.nth(i).check();
    await page.waitForTimeout(450);
    await shot("selected");

    const save=page.getByRole("button",{name:/Save selected/i}).first();
    if(await save.count() && await save.isEnabled()){
      await save.click();
      await page.waitForTimeout(450);
      await shot("saved");
    }
  }catch(e){
    console.log("Search-result capture skipped:",e.message);
    await shot("workspace-fallback");
  }
}
await browser.close();
console.log("Captured LeadForge production screens.");
